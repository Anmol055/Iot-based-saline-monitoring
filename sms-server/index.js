import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

app.use(cors());

app.post('/send-message', (req,res) => {
    twilioClient.messages.create({
        body: `Low Saline Level Alert: The saline bottle in Patient's IV line is below 10%. Please replace the bottle immediately to ensure uninterrupted medication delivery.`,
        from: +6205511801,
        to: +919907416211
    })
    .then((message) => {
        res.send({
            success: true,
            message: message.sid
        })
    })
    .catch((err) => {
        res.send({
            success: false,
            err
        })
    })
})

app.listen(3000,() => {
    console.log('Server is running on port 3000');
})