import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";

import connectDb from "./src/config/db.js";

console.log("API KEY:", process.env.CLOUD_API_KEY);

connectDb();

const PORT = process.env.PORT;

console.log("NAME:", process.env.CLOUD_NAME);
console.log("KEY:", process.env.CLOUD_API_KEY);
console.log("SECRET:", process.env.CLOUD_API_SECRET);

app.listen(PORT,()=>{
    console.log(`Server is Runing on Port:${PORT}`);
});