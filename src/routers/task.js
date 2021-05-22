const express = require('express');
const Task = require('../models/task.js')
const auth = require('../middleware/auth');
const User = require('../models/user.js');

const router = express.Router();
router.get('/test',(req,res)=>{
    res.send('from a routers/task file')
})

// router.post('/tasks',(req,res)=>{
//     const task = new Task(req.body);
//     task.save().then(()=>{
//       res.send(task);
//     }).catch((error)=>{
//     //     res.status(400);
//     //  res.send(error);
//     res.status(400).send(error);
//     })

// })

router.post('/tasks',auth, async (req, res) => {
    //  const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);

    }

})
// router.get('/task',(req,res)=>{
//     Task.find({}).then((tasks)=>{
//         res.send(tasks);
//     }).catch((error)=>{
//         res.status(404).send();
//     })
// })



// router.get('/tasks',auth, async (req, res) => {
//     try {
//         // const tasks = await Task.find({owner : req.user._id});
//         // res.send(tasks);
//         await req.user.populate('tasks').execPopulate();
//         res.send(req.user.tasks)

//     } catch (error) {
//         res.status(404).send();
//     }
// })


//GET /tasks?completed=true
//GET /tasks?limit=3&skip=2 // means out of 4 records skip first 2 tasks and get 3 tasks from there
//GET /tasks?sortBy=createdAt:desc
//fetching tasks based on completed variable (filtering)
router.get('/tasks',auth, async (req, res) => {
    const match = {}
    const sort = {}
    //req.query.completed is string ..but for match.completed need boolean value
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]]= parts[1]==='desc'? -1 :1;
    }
    try {
        await req.user.populate({
            path : 'tasks',
            // match : match
            match ,
            options :{
                limit : parseInt(req.query.limit) ,//converting to integer because what ever we take fro req ..it will be in string format
                skip : parseInt(req.query.skip) ,
                // sort :{
                //     createdAt : -1  //-1 desc 1 asc
                //     // completed : 1
                // } 
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks)

    } catch (error) {
        res.status(404).send();
    }
})



// router.get('/task/:id',(req,res)=>{
//     const _id = req.params.id;
//     Task.findById(_id).then((task)=>{
//            if(!task){
//             return  res.status(404).send();
//            }
//            res.send(task);
//     }).catch((error)=>{
//         res.status(500).send();

//     })
// })
router.get('/task/:id',auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id , owner : req.user._id})
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);

    } catch (error) {
        res.status(404).send();

    }
})
router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {

        // const task = await Task.findById(req.params.id); 
        const task = await Task.findOne({_id : req.params.id,owner : req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
          return res.status(404).send();
        }

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()

        res.status(200).send(task);
    } catch (e) {
        res.send(400).send(e);
    }
})
router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id});
        if (!task) {
          return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})
module.exports = router