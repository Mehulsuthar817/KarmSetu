import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        index:true
    },
    description:String,

    employerId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    companyName:{
        type:String,
        required:true,
        index:true
    },
    skillsRequired:[{
        type:String,
        index:true
    }],
    location:{
        type:String,
        index:true
    },
    salary:{
        min:Number,
        max:Number
    },
    jobType:{
        type:String,
        enum:["full-time","part-time","internship","contract"]
    },
    workMode:{
        type:String,
        enum:["onsite","remote","hybrid"],
        index:true
    },
    slug:{
        type:String,
        
    },
    isActive:{
        type:Boolean,
        default: true
    }
},{timestamps:true})

jobSchema.index({skillsRequired:1,location:1});

export default mongoose.model("Job",jobSchema);