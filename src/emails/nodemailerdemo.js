const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service : 'Outlook',
    auth : {
        user : 'sreeja.madire@incture.com',
        pass : 'INC01429@',
    }
})
 const sendemail = (maildetails)=>{
    transporter.sendMail(maildetails , function(error,info){
         if(error){
            console.log("Error is "+ error);
             return ;
        }
         else{
         console.log("Msg sent " + info.response)
        }
       })
    
 }

const sendWelcomeMail = (email,name)=>{
    const maildetails = {
     from : 'sreeja.madire@incture.com',
     to : email ,
     subject : 'Thanks for joining in!',
     text : `Welcome to Task-manager-app ,${name}.Let me know how you get along with the app`
    }
   sendemail(maildetails);
}

const sendCancelationMail = (email,name)=>{

    const maildetails = {
        from : 'sreeja.madire@incture.com',
        to : email ,
        subject : 'Sorry to see you go!',
        text : `Goodbye ,${name}.I hope to see you back sometime soon.`
    }
       sendemail(maildetails);
}
// sendWelcomeMail("madiresrija15@gmail.com","srija");
// sendCancelationMail("madiresrija15@gmail.com","srija");


 module.exports = {
     sendWelcomeMail,
     sendCancelationMail
}














// const maildetails = {
//     from : 'sreeja.madire@incture.com',
//     to : 'madiresrija15@gmail.com',
//     subject : 'mail from taskmanaager-app',
//     text : 'successfully sent the mail'
// }
// transporter.sendMail(maildetails , function(error,info){
//     if(error){
//         console.log("Error is "+ error);
//         return ;
//     }
//     else{
//     console.log("Msg sent " + info.response)
//     }
// })

