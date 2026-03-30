import mongoose from "mongoose";
import Job from "./Job.js";

const applicationSchema = new mongoose.Schema({
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Job,
        required:true
    },

    candidateId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },

    jobTitle:String,
    companyName:String,
    candidateName:String,

    resume:{
        url:String,
        public_id:String
    },
    status:{
        type: String,
        enum:["applied","shortlisted","rejected","accepted"],
        default:"applied",
        index:true
    }


},{timestamps:true});

applicationSchema.index(
    {jobId:1,candidateId:1},
    {unique:true}
);

export default mongoose.model("Applicaton",applicationSchema);