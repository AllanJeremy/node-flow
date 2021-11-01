const https = require("https");
require("dotenv").config();

const KEYS = {
  signup: "Signup Completed",
  profile_completed: "Minimum Profile Completed",
  account_deactivated: "Account Deactivated",
  account_deleted: "Account Deleted",
  firstMatch: "First Peer Added",
};

/**
 * Manages Active Campaign hooks
 *
 * @class EmailEvents
 * @package app
 * @subpackage helpers
 */
class EmailEvents {

  static init(action, data) {
    if (process.env.APP_ENV == "production") {

      switch (action) {
        case "signup":
          return this.signup(data);
        case "profileCompleted":
          return this.profileCompleted(data);
        case "accountDeactivate":
          return this.accountDeactivate(data);
        case "accountDelete":
          return this.accountDelete(data);
        case "firstMatch":
          return this.firstMatch(data);
      }
    }
  }

  static createUser = (data) => {
    const headers = {
      "Content-Type": "application/json",
      "Api-Token": process.env.ACTIVE_CAMPAIGN_API_TOKEN,
    };

    const hostname = process.env.ACTIVE_CAMPAIGN_BASE_URL;

    const param = new TextEncoder().encode(
      JSON.stringify({
        contact: {
          email: data["email"],
        },
      })
    );

    const url = process.env.ACTIVE_CAMPAIGN_API_URL + "contacts";

    this.httpRequest(hostname, url, headers, param);
  };

  static signup = (data) => {
    this.createUser(data);

    var json = { email: data["email"] };
    var encoded = encodeURIComponent(JSON.stringify(json)).replace(/%40/g, "@");

    const param = `${encodeURIComponent("actid")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_ACCOUNT_ID
    )}&${encodeURIComponent("key")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_EVENT_KEY
    )}&${encodeURIComponent("event")}=${encodeURIComponent(
      KEYS.signup
    )}&${encodeURIComponent("eventdata")}=${encodeURIComponent(
      data["verificationCode"]
    )}&${encodeURIComponent("visit")}=${encoded}`.replace(/%20/g, " ");

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const hostname = process.env.ACTIVE_CAMPAIGN_TRACKING_URL;

    const url = "/event";

    this.httpRequest(hostname, url, headers, param);
  };

  static profileCompleted = (data) => {
    var json = { email: data["email"] };
    var encoded = encodeURIComponent(JSON.stringify(json)).replace(/%40/g, "@");

    const param = `${encodeURIComponent("actid")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_ACCOUNT_ID
    )}&${encodeURIComponent("key")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_EVENT_KEY
    )}&${encodeURIComponent("event")}=${encodeURIComponent(
      KEYS.profile_completed
    )}&${encodeURIComponent("eventdata")}=${encodeURIComponent(
      ""
    )}&${encodeURIComponent("visit")}=${encoded}`.replace(/%20/g, " ");

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const hostname = process.env.ACTIVE_CAMPAIGN_TRACKING_URL;

    const url = "/event";

    this.httpRequest(hostname, url, headers, param);
  };

  static accountDeactivate = (data) => {
    var json = { email: data["email"] };
    var encoded = encodeURIComponent(JSON.stringify(json)).replace(/%40/g, "@");

    const param = `${encodeURIComponent("actid")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_ACCOUNT_ID
    )}&${encodeURIComponent("key")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_EVENT_KEY
    )}&${encodeURIComponent("event")}=${encodeURIComponent(
      KEYS.account_deactivated
    )}&${encodeURIComponent("eventdata")}=${encodeURIComponent(
      ""
    )}&${encodeURIComponent("visit")}=${encoded}`.replace(/%20/g, " ");

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const hostname = process.env.ACTIVE_CAMPAIGN_TRACKING_URL;

    const url = "/event";

    this.httpRequest(hostname, url, headers, param);
  };

  static accountDelete = (data) => {
    var json = { email: data["email"] };
    var encoded = encodeURIComponent(JSON.stringify(json)).replace(/%40/g, "@");

    const param = `${encodeURIComponent("actid")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_ACCOUNT_ID
    )}&${encodeURIComponent("key")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_EVENT_KEY
    )}&${encodeURIComponent("event")}=${encodeURIComponent(
      KEYS.account_deleted
    )}&${encodeURIComponent("eventdata")}=${encodeURIComponent(
      ""
    )}&${encodeURIComponent("visit")}=${encoded}`.replace(/%20/g, " ");

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const hostname = process.env.ACTIVE_CAMPAIGN_TRACKING_URL;

    const url = "/event";

    this.httpRequest(hostname, url, headers, param);
  };

  static firstMatch = (data) => {
    var json = { email: data["email"] };
    var encoded = encodeURIComponent(JSON.stringify(json)).replace(/%40/g, "@");

    const param = `${encodeURIComponent("actid")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_ACCOUNT_ID
    )}&${encodeURIComponent("key")}=${encodeURIComponent(
      process.env.ACTIVE_CAMPAIGN_EVENT_KEY
    )}&${encodeURIComponent("event")}=${encodeURIComponent(
      KEYS.firstMatch
    )}&${encodeURIComponent("eventdata")}=${encodeURIComponent(
      "Peer Id" + data["peerId"]
    )}&${encodeURIComponent("visit")}=${encoded}`.replace(/%20/g, " ");

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const hostname = process.env.ACTIVE_CAMPAIGN_TRACKING_URL;

    const url = "/event";

    this.httpRequest(hostname, url, headers, param);
  };

  static httpRequest = (hostname, url, header, data) => {
    var options = {
      method: "POST",
      hostname: hostname,
      path: url,
      headers: header,
    };

    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        //console.log(body.toString());
      });

      res.on("error", function (error) {
        //error
      });
    });

    req.write(data);

    req.end();
  };
}

module.exports = EmailEvents;
