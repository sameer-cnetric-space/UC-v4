const userTemplate = (email, password, role) => {
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
     <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .header {
      background-color: #007bff;
      color: white;
      padding: 15px;
      border-radius: 8px 8px 0 0;
      font-size: 20px;
    }
    .content {
      padding: 20px;
      text-align: left;
      color: #333;
    }
    .content ul {
      list-style-type: none;
      padding: 0;
    }
    .content ul li {
      margin: 10px 0;
      font-size: 16px;
    }
    .content strong {
      color: #007bff;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      color: white;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
    .warning {
      color: red;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Welcome to UC Dashboard</div>
    <div class="content">
      <p>Your account has been created successfully. Below are your login credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Role:</strong> ${role}</li>
      </ul>
      <p class="warning">⚠️ Please change your password upon first login.</p>
      <a href="https://uc-dashboard.com/login" class="button">Login to Dashboard</a>
    </div>
    <div class="footer">
      <p>Best regards,<br><strong>The UC Team</strong></p>
      <p>If you didn't request this account, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
    `;

  return { subject, text, html };
};

module.exports = { userTemplate };
