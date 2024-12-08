import { client } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Mailtrap Test",
  };

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, username) => {
  const recipient = [{ email }];
  const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Mailtrap Test",
  };
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "1b20593c-2ae9-47a8-865d-0841da36dbef",
      template_variables: {
        name: `${username}`,
        company_info_name: "SafePass",
        company_info_address: "Goregaon",
        company_info_city: "Mumbai",
        company_info_zip_code: "400065",
        company_info_country: "India",
      },
    });

    console.log("Welcome Email sent successfully", response);
  } catch (err) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Mailtrap Test",
  };

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Reset Password",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending reset password verification email`, error);
    throw new Error(
      `Error sending reset password verification email: ${error}`
    );
  }
};

export const sendResetPasswordEmailSuccessEmail = async (email) => {
  const recipient = [{ email }];
  const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Mailtrap Test",
  };

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
