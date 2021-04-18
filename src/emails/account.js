const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeMail = (email,name)=>{
    sgMail.send({
        to:email,
        from : 'madiresrija15@gmail.com',
        subject : 'this is my first creation',
        text : `i hope this one actually get to u ${name}`
    })
    
}
const sendCancelationMail = (email,name)=>{
    sgMail.send({
        to:email,
        from : 'madiresrija15@gmail.com',
        subject : 'sorry to see u go',
        text : `goodbye.. ${name}`
    })

}
module.exports = {
    sendWelcomeMail,
    sendCancelationMail
}