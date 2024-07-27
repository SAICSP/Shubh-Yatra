const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {  saveRedirectUrl } = require("../middleware");
const userController=require("../controller/users");

router
.route("/signup")
.get(((req,res)=>{
    res.render("../views/users/signup.ejs")}))
.post(wrapAsync(userController.signUp))

router
.route("/login")
.get(((req,res)=>{
    res.render("../views/users/login.ejs")}))
.post(saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/login',
            failureFlash:true})
        ,async(req,res)=>{
            req.flash("success","Welcome back to Shubh Yatra ");
            let redirectUrl=res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
});

router.get("/logout",userController.logout);

module.exports=router;