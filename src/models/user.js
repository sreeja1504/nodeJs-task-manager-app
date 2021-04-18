console.log(process.cwd());

console.log("here in user file ")
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');
//middle ware helps to run functions before or after events .  middleware defined at  schema level .we define schema and pass to model 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Age must be a positive number')
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar : {
        type : Buffer
    }

},{
    timestamps : true 
});

//actually not stored in db .it gives relationship between entities .virtual() helps to create virtual attributes . it is just for mongooose to figure out ho owns who 
userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})


//this methods accessible on instance methods . we use it for specific user ..so instead of arrow function use es6 function to deal with specific user object this 
userSchema.methods.generateAuthToken = async function(){
  const user = this 
//   const token = jwt.sign({ _id : user._id.toString() },'thisismynewcourse')
  const token = jwt.sign({ _id : user._id.toString() },process.env.JWT_SECRET)

//   user.tokens = user.tokens.concat({token : token})
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}
// userSchema.methods.getPublicProfile = function(){
    userSchema.methods.toJSON = function(){
    const user = this 
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject;
}
//statics methods accessble on model methods 
userSchema.statics.findByCredentials = async (email, password) => {
    // const user = await User.findOne({email :email});
    const user = await User.findOne({ email })
    if (!user) {
    throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
    throw new Error('Unable to login')
    }
    return user
}

//it means perform this function before save event. we dont use arrow function becuase we need to deal with this
//hashing plain txt password
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


//delete user tasks when user is deleted 
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner : user._id})

    next()
})


const User = mongoose.model('User', userSchema);
//use below code if we dont use middleware mongoose.model also creates schema internally
// const User = mongoose.model('User',{
//     name:{
//     type: String ,
//     required : true
//     },
//     email:{
//      type : String,
//      required : true,
//      trim : true,
//      lowercase : true,
//      validate(value){
//          if(!validator.isEmail(value)){
//              throw new Error('email is invalid')
//             }
//         }
//     },
//      password : {
//          type :String,
//          required : true,
//          trim : true,
//          minlength : 7,
//          validate(value){
//              if(value.toLowerCase().includes('password')){
//              throw new Error('password cannot contain password')
//              }
//          }
//      },
//     age : {
//      type :Number,
//      default:0,
//      validate(value){
//          if(value < 0)
//          throw new Error('Age must be a positive number')
//      }

//     }

// });


module.exports = User