const mongoose = require('mongoose');
const validator = require('validator');
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true 
})

const User = mongoose.model('User',{
    name:{
    type: String ,
    required : true
    },
    email:{
     type : String,
     required : true,
     trim : true,
     lowercase : true,
     validate(value){
         if(!validator.isEmail(value)){
             throw new Error('email is invalid')
            }
        }
    },
     password : {
         type :String,
         required : true,
         trim : true,
         minlength : 7,
         validate(value){
             if(value.toLowerCase().includes('password')){
             throw new Error('password cannot contain password')
             }
         }
     },
    age : {
     type :Number,
     validate(value){
         if(value < 0)
         throw new Error('Age must be a positive number')
     }

    }

});

 const newrecord = new User({name : 'bhanuSree',email :'bhanuSree@gmail.com',password:'res123456',age : 23})
 newrecord.save().then(()=>
 {
    console.log(newrecord)
 }).
 catch((error)=>{
     console.log('error',error)
 });

// const Task = mongoose.model('Task',{
//     description :{
//         type :String,
//         required : true ,//if we dont provide descripton while creating instance we get error
//         trim :true
//     },
//     completed :{
//         type :Boolean ,
//         default : false
//     }
// })
// const mytask = new Task({
//     description : ' Eat lunch'
// })
// mytask.save().then (()=>{
//     console.log(mytask);
// }).catch((error)=>{
//     console.log(error);
// })