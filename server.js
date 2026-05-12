const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();
app.use(cors());

const PORT = process.env.PORT;

//RateLimit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//Routes

//Mongoose Connection
mongoose.connect(process.env.MONGO_URI, {})
.then(()=>{console.log("MongoDB Connected ✅✅")})
.catch(()=>{console.log("MongoDB cannot connected ❌❌")})


//Server Listen
app.listen(PORT, (err)=>{
    if(err){
        console.log("Server Cannot Successfully ❌❌")
    } else{
        console.log("Server Connected Succussfully ✅✅");
    }
});