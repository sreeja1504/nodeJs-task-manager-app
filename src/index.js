const express = require('express')
require('./db/mongoose1')
const User = require('./models/user.js');
const Task = require('./models/task.js');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js');


const app = express();

// const port = process.env.PORT || 3000
  const port = process.env.PORT 



//without middleware - new request -> new route  handler
//with handler - new request -> do something ->new route handler
//from 14 to 29 middlewares .instead of declaring in index declare them in separate file then it is organised 
// app.use((req,res,next)=>{
// console.log(req.method , req.path);
// next()   
// })

// app.use((req,res,next)=>{
//   if(req.method === 'GET'){
//     res.send('GET requests are disabled')
//   }else{
//     next()   
//   }
// })

// app.use((req,res,next)=>{
// res.status(503).send('site is currently down.check back soon !')
// })


// const multer = require('multer');
// const upload = multer({
//     dest : 'images',
//     limits : {
//         fileSize : 1000000
//     },
//     fileFilter(req,file,cb){
//         // if(!file.originalname.endsWith('.pdf')){
//         //     return cb(new Error('please upload a pdf file'))
//         // }
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('please upload a word document'))
//         }

//         cb(undefined,true)
//     }
// })



// single() is a funcion of middleware multer ..upload is const upload 
//1-url
//2-auth
//3-validation


// app.post('/upload',upload.single('avatar'),(req,res)=>{
// res.send();
// },(error,req,res,next)=>{
//     res.status(400).send({error : error.message});
// })


app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('server is up on port ' + port);
})

// const bcrypt = require('bcryptjs')
// const myFunction = async()=>{
// const password = "incture";
// const hashPassword = await bcrypt.hash(password,8);
// console.log(password);
// console.log(hashPassword);
// //bcrypt.compare() it will convert input password to input hashed password and compares with hashPassword
// const isMatch =await bcrypt.compare('incture',hashPassword);
// console.log(isMatch);
// }


// const jwt = require('jsonwebtoken');
// const myFunction = async()=>{
//    const token = jwt.sign({_id :'abc123'},'thisismynewcourse',{expiresIn : '7 days'})
//    console.log(token)
//   // jwt.verify() returns payload
//   const data = jwt.verify(token ,'thisismynewcourse');
//   console.log(data);
// }

// myFunction();


//here with the help of task id i will get owner id who created the task ..to get owner details we can query using owner id (manual way)..shortcut is to use ref of user in owner in task model and when we want user details populate owner 
// const main = async()=>{
//   // const task = await Task.findById('60572ec7973a0f1548f0978c')
//   // await task.populate('owner').execPopulate()
//   // console.log(task.owner)

//   const user = await User.findById('60572eaf973a0f1548f0978a')
//   await user.populate('tasks').execPopulate() 
//   //by this no change to user document in db ..just having virtual view
//   console.log(user.tasks)
// }
// main()