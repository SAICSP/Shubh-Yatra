const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews"); // Assuming reviews.js is in the same directory
const { types, required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

async function main() {
  try {
    const uri = "mongodb://localhost:27017/your_database_name"; // Replace with your connection string
    await mongoose.connect(uri);
    console.log("Successfully Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

const listing1 = {
  title: "Historic Castle in Scotland",
  description:
    "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
  image: {
    filename: "listingimage", // Optional: You can set a filename if needed
    url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  price: 4000,
  location: "Scottish Highlands",
  country: "United Kingdom",
};

const listing2 = {
  title: "Desert Oasis in Dubai",
  description:
    "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
  image: {
    filename: "listingimage", // Optional: You can set a filename if needed
    url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  price: 5000,
  location: "Dubai",
  country: "United Arab Emirates",
};


async function addListing() {
  try {
    await addListing(listing1);
    await addListing(listing2);
    console.log("Listings added successfully!");
  } catch (err) {
    console.error("Error adding listings:", err);
  }
}

