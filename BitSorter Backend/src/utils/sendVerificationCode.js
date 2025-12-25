// authController.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_KEY);

const sendVerificationCode = async ({ code, userEmail }) => {
   try {
    console.log("Code and userEmail",code,userEmail);
  await resend.emails.send({
    from: "BitSorter <no-reply@bitsorter.dev>",
    to: userEmail,
    subject: "Verify your BitSorter account",
    html: `
<div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
  <p>Hi,</p>

  <p>Thank you for signing up for <strong>BitSorter</strong>.</p>

  <p>Please use the verification code below to complete your registration:</p>

  <div style="margin: 16px 0; padding: 12px 16px; background-color: #f4f6f8; border-radius: 4px; display: inline-block;">
    <span style="font-size: 20px; font-weight: 600; letter-spacing: 2px;">
      ${code}
    </span>
  </div>

  <p>This code will expire in <strong>10 minutes</strong>.</p>

  <p>If you did not request this, you can safely ignore this email.</p>

  <p style="margin-top: 24px;">
    Regards,<br />
    <strong>BitSorter Team</strong>
  </p>

  <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />

  <p style="font-size: 12px; color: #777;">
    This is an automated message. You may reply to this email if you need help.
  </p>
</div>
`,
  });
  } catch (err) {
    console.log("can't send verification email", err);
  }
};

module.exports = sendVerificationCode;