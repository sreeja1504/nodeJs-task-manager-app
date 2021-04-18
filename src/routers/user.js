
const express = require('express');
const User = require('../models/user.js')
const router = express.Router();
const sharp = require('sharp');
const auth = require('../middleware/auth');
const { sendWelcomeMail,sendCancelationMail } = require('../emails/nodemailerdemo');
router.get('/test',(req,res)=>{
    res.send('from a new file')
})
router.post('/users/login',async (req,res)=>{
    try{
        //findByCredentials is used for collection so used User
    const user = await User.findByCredentials(req.body.email, req.body.password)
    //generate token for specific user so used user
    const token = await user.generateAuthToken()
    // res.send({user : user.getPublicProfile(), token})
    res.send({user, token})

    // res.send(user)
    }catch(e){
        console.log(e)
      res.status(400).send(e);
    }
})
// router.post('/users',(req,res)=>{
//     const user = new User(req.body);
//     user.save().then(()=>{
//       res.send(user);
//     }).catch((error)=>{
//     //     res.status(400);
//     //  res.send(error);
//     res.status(400).send(error);
//     })

// })


router.post('/users/logout', auth,async(req,res)=>{
 try{
     req.user.tokens = req.user.tokens.filter((oneofTokensObj)=>{
        return oneofTokensObj.token !== req.token
     })

     await req.user.save();
     res.send();
 }catch(e){
    res.status(500).send(e);
 }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
      req.user.tokens = []
      await req.user.save();
      res.send();
 
    }catch(e){
        res.status(500).send(e);
    }
})

router.post('/users', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeMail(user.email,user.name)
        const token = await user.generateAuthToken()
        // res.status(201).send(user);
        res.status(201).send({user,token});

    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
})



// router.get('/users',(req,res)=>{
//     User.find({}).then((users)=>{
//         res.send(users)
//     }).catch((e)=>{
//       res.status(500).send();
//     })
// })


//to provide auth to this function give auth (middleware)as second argument .if middleware calls next() then only third argument gets executed

// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (e) {
//         res.status(500).send();
//     }
// })
router.get('/users/me', auth, async (req, res) => {
res.send(req.user);
})


// router.get('/users/:id',(req,res)=>{
//     console.log(req.params);
//     const _id = req.params.id;
//     User.findById(_id).then((user)=>{
//         if(!user){
//            return  res.status(404).send()
//         }
//         res.send(user)
//     }).catch((error)=>{
//         res.status(500).send();
//     })
// })

//i shouldnot be able to fetch the user profile of other users for the application 
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)

//     } catch (e) {
//         res.status(500).send();

//     }
// })



// router.patch('/users/:id', async (req,res)=>{
//     console.log(" req id is ",req.params.id)
//     console.log(req.body)
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name', 'email', 'password', 'age'];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }
//     try {

//          const user = await User.findById(req.params.id);
//          updates.forEach((update)=>user[update]= req.body[update]);
//         await user.save();
//         //  updates.forEach((update)=>{
//         //      user[update]= req.body[update];
//         //  })
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// })

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {

         updates.forEach((update)=> req.user[update]= req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})



// router.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// })

router.delete('/users/me', auth ,async (req, res) => {
    try {
       await req.user.remove()
       sendCancelationMail(req.user.email, req.user.name)
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})
const multer = require('multer');
const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('please upload a pdf file'))
        // }
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload a image'))
        }

        cb(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height :250}).png().toBuffer();
     req.user.avatar = buffer

    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send();
    },(error,req,res,next)=>{
        res.status(400).send({error : error.message});
    })
    
    router.delete('/users/me/avatar',auth,async(req,res)=>{
        req.user.avatar = undefined 
        await req.user.save()
        res.send();
    })

    router.get('/users/:id/avatar',async(req,res)=>{
        try{
         const user = await User.findById(req.params.id)
         if(!user || !user.avatar){
             throw new Error()
         }
         res.set('Content-Type','image/png');
         res.send(user.avatar);
        }catch(e){
            res.status(404).send();
        }
    })
module.exports = router