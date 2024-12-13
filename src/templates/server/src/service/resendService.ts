import { Resend } from "resend"
import { ForgotPasswordEmail } from "../emailTemplates/forgotPassword.tsx"

const RESEND_API_KEY = process.env.AUTH_RESEND_KEY
const resend = new Resend(RESEND_API_KEY);


export const sendCode = async (email: string, code: string) => {
  const res = await resend.emails.send({
    from: process.env.AUTH_EMAIL as string,
    to: email,
    subject: "Reset Password",
    react: ForgotPasswordEmail({code: code})
  })
  if (res.data) return res.data;
  else throw new Error(res.error?.message)
  
}