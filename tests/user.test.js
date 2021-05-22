const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId,userOne,setupDatabase} = require('./fixtures/db')
// beforeEach(async()=>{
//         await User.deleteMany();
//         await new User(userOne).save();    
// })
beforeEach(setupDatabase)
test('Should signup a user',async () => {
  const response = await request(app).post('/users').send({
        name :'sreeja',
        email:'madiresrija15@gmail.com',
        password:'sreeja123'
        }).expect(201);

        //Assert that the database was changed succesfully
        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()

        //Assertions about the response 
        expect(response.body.user.name).toBe('sreeja');
        expect(response.body).toMatchObject({
          user : {
            name : 'sreeja',
            email:'madiresrija15@gmail.com',
          },
          token : user.tokens[0].token
        })
})

test('Should login exising user', async ()=>{
 const response = await request(app).post('/users/login').send({
        email : userOne.email,
         password : userOne.password
         }).expect(200)
         const user = await User.findById(userOneId)
         expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should get profile for user', async ()=>{
        await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should delete account for user', async ()=>{
        await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user).toBeNull();
})

test('Should upload avatar image', async ()=>{
        await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
        // expect({}).toBe({});  assertion fails bcz objects uses diff memory
        // expect({}).toEqual({}) //compares objects properties
        //when we deal with objects use toEqual() instead of toBe()
        const user = await User.findById(userOneId)
        expect(user.avatar).toEqual(expect.any(Buffer))

})

test('Should update valid user fields', async ()=>{
      const response =  await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
                name : 'Rashmitha Yada'
        })
        .expect(200)
        expect(response.body.name).toBe('Rashmitha Yada')
        // const user = await User.findById(userOneId)
        // expect(user.name).toBe('Rashmitha Yada')

})


test('Should not signup user with invalid name/email/user',async ()=>{
         await request(app).post('/users').send({
                name :'sreeja',
                email:'madiresrija1',
                password:'sreeja'
                }).expect(400);
        
})

