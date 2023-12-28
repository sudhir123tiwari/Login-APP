const mongoose=require("mongoose");


require("dotenv").config();
exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then( () => console.log("Db connection successfully"))
    .catch( (error) =>{
        console.log("ISSue in connection");
        console.error(error.message);
        process.exit(1);
    });

}