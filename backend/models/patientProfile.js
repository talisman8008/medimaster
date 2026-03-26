const  mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true
    },
    birthdate:{
      type:Date,
      required:true
    },
    weight:{ //in Kgs
        type:Number,
        required:true
    },
    address:{
        type:String
    },
    hospitalId:{ //haar hospital ka unique hoga
        type:String,
        unique:true
    },
    activeMedication:[{
        type:String,
    }],
    reports:[{
        title:{type:String},
        date:{type:Date,default:Date.now},
        fileUrl:{type:String,default:null},
        doctorNote:{type:String},
    }]
},{ timestamps: true });

module.exports= mongoose.model('PatientProfile',patientProfileSchema);