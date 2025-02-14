const userTemplate = async (email, password, role) => {
  // Email Subject
  const subject = "Your Account Credentials";

  // Plain Text Version
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

  // HTML Version
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

  return { subject, text, html };
};

module.exports = { userTemplate };
