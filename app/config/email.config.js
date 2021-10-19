require("dotenv").config();

module.exports = {
  email: {
    system: {
      from_email: process.env.SYSTEM_FROM_EMAIL,
      from_name: process.env.SYSTEM_FROM_NAME,
      to_email: [],
      cc_email: [],
      bcc_email: [],
    },
    notification: {
      from_email: process.env.NOTIFICATION_FROM_EMAIL,
      from_name: process.env.NOTIFICATION_FROM_NAME,
    },
  },
};
