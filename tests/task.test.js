const request = require('supertest');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const {userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
     } = require('./fixtures/db')
const app = require('../src/app');

 beforeEach(setupDatabase)
test('Should create task for user',async ()=>{
const response = await request(app)
                .post('/tasks')
                .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                .send({
                    description : 'From my test'
                })
                .expect(201)
                const task = await Task.findById(response.body._id);
                expect(task).not.toBeNull();
                expect(task.completed).toEqual(false);
                expect(response.body).not.toBeNull();
                expect(response.body.completed).toEqual(false);

})
test('Should fetch user tasks', async ()=>{
    const response = await request(app)
                     .get('/tasks')
                     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                     .send()
                     .expect(200);
                     expect(response.body.length).toEqual(2);
     
})

test('Should not delete other users tasks ',async()=>{
  const response = await request(app)
         .delete(`/tasks/${taskOne._id}`)
         .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
         .send()
         .expect(404)
         const task = await Task.findById(taskOne._id)
         expect(task).not.toBeNull();

})


test('Should sort task based on description',async ()=>{
    const response = await request(app)                    
          .get('/tasks?limit=3&skip=0&sortBy=description:desc')
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200);
          expect(response.body.length).toEqual(2);


})