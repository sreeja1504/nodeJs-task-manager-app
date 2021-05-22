// test('Hello World',()=>{

// })

// test('This should fail',()=>{
//     throw new Error('Failure!')
// })

const {calculateTip,fahrenheitToCelsius ,celsiusToFahrenheit,add}  = require('../src/math')
test('Should calculate total with tip',()=>{
    const total = calculateTip(10,0.3);
    // if(total !== 13){
    //     throw new Error('Total tip should be 13. Got '+total)
    // }
    expect(total).toBe(13)
})

test('Should convert 32 F to 0 C',()=>{
   const cel =  fahrenheitToCelsius(32);
   expect(cel).toBe(0)
})

test('Should convert 0 C to 32 F',()=>{
    const far = celsiusToFahrenheit(0);
    expect(far).toBe(32)
})

test('Async test demo',(done)=>{
    setTimeout(()=>{
        expect(2).toBe(2);
        done()
    },2000)
})
//testing asynchronous code using promises
test('Should add two numbers',(done)=>{
    add(2,3).then((sum)=>{
      expect(sum).toBe(5);
      done();
    })
})


//testing asynchronous code with promises using async await
test('Should add two numbers asnc/await',async ()=>{
  const sum = await add(2,3);
  expect(sum).toBe(5);
})