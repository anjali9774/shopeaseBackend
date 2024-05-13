
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const http = require('http');
const mongoose = require('mongoose');
const path=require("path");
const app  = require('./app');
const { dbConnect } = require('./config/dbConnect');



//uncaught exceptions
process.on('uncaughtException',err =>{
    console.log(err.name,err.message);
    process.exit(1);
    });
   

//connecting to schema
/* const DB=process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(()=>{
    console.log("DB connection is Successfull")
})
 */
dbConnect();


// creating the server
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT,console.log(`The Server is running at port ${PORT} successfully`));