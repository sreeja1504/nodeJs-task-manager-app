const path = require('path');
console.log(path.dirname(__filename));

console.log('here in task file');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description :{
        type :String,
        required : true ,//if we dont provide descripton while creating instance we get error
        trim :true
    },
    completed :{
        type :Boolean ,
        default : false
    },
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User' 

    }
},{
    timestamps : true   //by default timestamps will be false 
});
 const Task = mongoose.model('Task',taskSchema);

// const Task = mongoose.model('Task',{
//     description :{
//         type :String,
//         required : true ,//if we dont provide descripton while creating instance we get error
//         trim :true
//     },
//     completed :{
//         type :Boolean ,
//         default : false
//     },
//     owner :{
//         type : mongoose.Schema.Types.ObjectId,
//         required : true,
//         ref : 'User' 

//     }
// })


module.exports = Task