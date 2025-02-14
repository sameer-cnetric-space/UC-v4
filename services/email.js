const mailerClient = require("../config/email/mailer");

class EmailService {
  /**
   * Send an email using the configured mailer client.
   * @param {string} to - Recipient email address.
   * @param {string} subject - Email subject.
   * @param {string} text - Plain text email body.
   * @param {string} html - HTML formatted email body (optional).
   * @returns {Promise<Object>} - Email sending response.
   */
  static async sendEmail({ to, subject, text, html }) {
    try {
      const mailOptions = {
        from: `"UC Dashboard" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
      };

      const info = await mailerClient.sendMail(mailOptions);
      console.log(
        `📧 Email sent successfully to ${to} - Message ID: ${info.messageId}`
      );

      return {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      };
    } catch (error) {
      console.error("❌ Error sending email:", error.message);
      throw new Error("Failed to send email.");
    }
  }

  /**
   * Send a user credentials email.
   * @param {string} email - Recipient email address.
   * @param {string} password - User's temporary password.
   * @param {string} role - User's assigned role.
   */
  static async sendUserEmail(email, password, role) {
    const subject = "Your Account Credentials";
    const text = `
      Hello,

      Your account has been created successfully. Below are your login credentials:

      📧 Email: ${email}
      🔑 Password: ${password}
      🏷️ Role: ${role}

      Please change your password upon first login.

      Regards,
      The Team
    `;

    const html = `
      <h2>Welcome to UC Dashboard</h2>
      <p>Your account has been created successfully. Below are your login credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Role:</strong> ${role}</li>
      </ul>
      <p>⚠️ Please change your password upon first login.</p>
      <br>
      <p>Best regards,<br>The Team</p>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  }
}

module.exports = EmailService;
