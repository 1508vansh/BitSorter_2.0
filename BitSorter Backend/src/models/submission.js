const mongoose = require('mongoose');
const {Schema} = mongoose;

const SubmissionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        enum:['c++','java','javascript'],
        required:true
    },
    status:{
        type:String,
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    totalTestCases:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    }
})

SubmissionSchema.index({userId:1,problemId:1});

const Submission = mongoose.model('submission',SubmissionSchema);

module.exports = Submission;