const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
    .then(()=>{
        console.log("connected to DataBase");
    }).catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66a147d085f464359f33fa77"}));
    Listing.insertMany(initData.data);
    console.log("the data.js data was successfully inserted");
};

initDB();