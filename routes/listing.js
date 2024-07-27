const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controller/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createNewListing)
    );

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

router.get("/:id", isLoggedIn, wrapAsync(listingController.showRoute));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

router.put(
    "/:id/update",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
);

router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
