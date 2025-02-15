const mailerClient = require("../config/email/mailer");
const { userTemplate } = require("../constant/email/userMail");

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
    const { subject, text, html } = userTemplate(email, password, role);

    return this.sendEmail({ to: email, subject, text, html });
  }
}

module.exports = EmailService;
