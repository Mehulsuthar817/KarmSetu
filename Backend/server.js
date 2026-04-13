import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";

import connectDb from "./src/config/db.js";


connectDb();

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is Runing on Port:${PORT}`);
});