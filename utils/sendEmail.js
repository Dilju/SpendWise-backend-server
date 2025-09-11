import nodemailer from 'nodemailer'
export const sendEmail = async(to, subject, text) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        await transporter.sendMail({
            from: `"SpendWise" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        })

        console.log("Email sent successfully!");
    } catch(error){
        console.error("Email sending failed : ", error);
        throw new Error("Email could not be sent")
    }
}