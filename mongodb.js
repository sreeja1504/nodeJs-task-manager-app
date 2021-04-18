//crud operations in mongodb



// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;


const {MongoClient , ObjectID} = require('mongodb');



const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "Task-manager";

// const id = new ObjectID();
// console.log(id);
// console.log(id.id.length);
// console.log(id.toHexString().lenght);
// console.log(id.getTimestamp());

//async call after connection execution callback is executed
MongoClient.connect(connectionURL,{ useNewUrlParser: true },(error,client)=>{
    if(error){
        return console.log('Unable to connect to database!');
    }
    const db = client.db(databaseName); //it will create db 
    //inserOne is async

    // db.collection('users').insertOne({
    //     // _id : id,
    //     name:"gee",
    //     age :25
    // },(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops);
    // })



// db.collection('users').insertMany([
//     {
//         name : "sreya",
//         age :18

//     },{
//         name :"rashu",
//         age : 25
//     }
// ],(error,result)=>{
//     if(error){
//         return console.log('Unable to insert documents !');
//     }
//     console.log(result.ops);
// })

// db.collection('tasks').insertMany([
//     {
//         description : "code",
//         completed :"true"
//     },{
//         description : "debug",
//         completed :"true"
//     },{
//         description : "test",
//         completed :"true"
//     }
// ],(error,result)=>{
//     if(error){
//         return console.log('Unable to insert task documents');
//     }
//     console.log(result.ops);
// })

// db.collection('users').findOne({name : 'sreya'},(error,user)=>{
    //if we use _id= "" in output we get null
    // db.collection('users').findOne({_id : new ObjectID("603fc555b9ea741f98cb43d4")},(error,user)=>{
        // db.collection('users').find({age : 25}).toArray((error,user)=>{


//             db.collection('users').find({age : 25}).count((error,user)=>{
//     if(error){
//         return console.log('unable to fetch');
//     }
//     console.log(user);
// })



//whenever we update if no callback return promise
// const updatePromise = db.collection('users').updateOne({ _id : new ObjectID("603e8be22b12941568ed54cd")},{
//     $set: {
//           name : "rashmitha"
//     }
// })


// updatePromise.then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })



// db.collection('users').updateOne({ _id : new ObjectID("603e8be22b12941568ed54cd")},{
//     $set: {
//           name : 'rashmitha'
//     }

//     // $inc: {
//     //     age : 1
//     // }
// }).then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })

// db.collection('tasks').updateMany({completed : 'true'},{
//     $set: {
//         completed : false
//     }
// }).then((result)=>{
//          console.log(result)
//      }).catch((error)=>{
//         console.log(error)
//      })

// db.collection('users').deleteMany({age : 22}).then((result)=>{console.log(result)}).catch((error)=>{console.log(error)})
db.collection('tasks').deleteOne({description : 'code'}).then((result)=>{console.log(result)}).catch((error)=>{console.log(error)})


})