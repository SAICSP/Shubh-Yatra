const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://chennasaicsp:km9mtX7bOMWgzpnP@cluster0.o2zsu2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {  });

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Failed to connect to MongoDB Atlas", err);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
