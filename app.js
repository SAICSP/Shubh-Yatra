try {
    require('dotenv').config();
} catch (err) {
    console.error("Error loading .env file:", err);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const dburl = process.env.ATLASDB_URL || "mongodb://localhost:27017/yourDatabaseName";


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.secret || "thisshouldbeabettersecret"
    },
    touchAfter: 24 * 3600 // 24 hours
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
    store,
    secret: process.env.secret || "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to Database");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

main();

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { err: { message, statusCode } });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
