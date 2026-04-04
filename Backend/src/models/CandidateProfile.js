import mongoose from "mongoose";

const CandidateProfileSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true

    },

    skills:[{
        type:String,
        index :true
    }],
    experience:{
        type: Number,
        default:0
    },
    education :String,
    location : String,

    resume: {
        url : String,
        public_id :String
    }


},{timestamps: true});

export default mongoose.model("CandidateProfile",CandidateProfileSchema);