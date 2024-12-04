import { Resend } from "resend"
import { ForgotPasswordEmail } from "../emailTemplates/forgotPassword"

const RESEND_API_KEY = process.env.AUTH_RESEND_KEY
const resend = new Resend(RESEND_API_KEY);


export const sendCode = async (email: string, code: string) => {
  await resend.emails.send({
    from: process.env.AUTH_EMAIL ? `Scaffold <${process.env.AUTH_EMAIL}>` : "Adeyemi Scaffold",
    to: email,
    subject: "Reset Password",
    react: ForgotPasswordEmail({code: code})
  })
}