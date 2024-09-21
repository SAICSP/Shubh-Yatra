const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controller/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// Index route: Display all listings
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),  // Ensure this field matches in the form
        validateListing,
        wrapAsync(listingController.createNewListing)
    );

// Show the form to create a new listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// Show a specific listing
router.get("/:id", wrapAsync(listingController.showRoute));

// Show the form to edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// Update a specific listing
router.put(
    "/:id",  // Removed /update for RESTful convention
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
);

// Delete a specific listing
router.delete(
    "/:id",  // Removed /delete for RESTful convention
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;
