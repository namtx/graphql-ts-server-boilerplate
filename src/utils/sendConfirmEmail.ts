import * as nodemailer from "nodemailer"

export const sendConfirmEmail = async (to: string, confirmLink: string) => {
  const transport = nodemailer.createTransport({
    host: "localhost",
    port: 1025
  })

  const message = {
    from: 'noreply@domain.com',
    to,
    subject: 'Confirm Email',
    text: 'Please confirm your email',
    html: `<a href="${confirmLink}">confirm your email</p>`
  };

  transport.sendMail(message)
}
