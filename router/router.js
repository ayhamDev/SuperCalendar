const Router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Calendar = require("../model/Calendar");
const Auth = require("../model/auth");
const moment = require("moment");
const { isAuthenticated, isNotAuthenticated } = require("../middleware/auth");
var convertTime = require("convert-time");

// auth routes
Router.get("/auth", isNotAuthenticated, (req, res) => {
  res.render("auth", { error: req.query.error });
});
Router.post(
  "/auth",
  isNotAuthenticated,
  body("password").isString().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).redirect("/auth?error=1");
    const { password } = req.body;
    const admin = await Auth.findOne();
    bcrypt.compare(password, admin.password, (err, isValid) => {
      if (err) return console.log(err);
      if (isValid) {
        const Token = jwt.sign(admin.id, process.env.TOKEN_KEY);
        const date = new Date();
        date.setHours(date.getHours() + 6);
        const secure = process.env.SECURE == "true" ? true : false;
        res
          .cookie("token", Token, {
            httpOnly: true,
            sameSite: true,
            secure,
            expires: date,
          })
          .redirect("/");
      } else {
        res.redirect("/auth?error=2");
      }
    });
  }
);

Router.get("/auth/change-password", isAuthenticated, (req, res) => {
  res.render("change-password", { error: req.query.error });
});
Router.post(
  "/auth/change-password",
  isAuthenticated,
  body("current_password").isString().isLength({ min: 1 }),
  body("new_password").isString().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).redirect("/auth?error=1");
    const { current_password, new_password } = req.body;
    bcrypt.compare(
      current_password,
      req.admin.password,
      async (err, isValid) => {
        if (err) return console.log(err);
        if (isValid) {
          const admin = await Auth.findById(req.admin.id);
          if (!admin) return res.clearCookie("token").redirect("/auth");
          const new_hashed_password = await bcrypt.hash(new_password, 10);
          admin.password = new_hashed_password;
          admin
            .save()
            .then(() => {
              res.clearCookie("token").redirect("/auth");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          res.redirect("/auth/change-password?error=2");
        }
      }
    );
  }
);
Router.get("/auth/logout", isAuthenticated, async (req, res) => {
  res.clearCookie("token").redirect("/auth");
});

// normal routes

Router.get("/", isAuthenticated, async (req, res) => {
  let Calendars = await Calendar.find();
  Calendars = Calendars.map((cal) => {
    return {
      id: cal.id,
      title: cal.title,
      events: cal.events,
      lastUpdate: moment(cal.updatedAt).fromNow(),
    };
  });

  res.render("home", { Calendars, error: req.query.error });
});

Router.post(
  "/new-calendar",
  isAuthenticated,
  body("title").isString().isLength({ min: 1 }),
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).redirect("/new-calendar?error=1");
    const newCalendar = new Calendar({
      title: req.body.title,
    });
    newCalendar
      .save()
      .then(() => {
        res.status(201).redirect(`/calendar/${newCalendar.id}`);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).redirect("/new-calendar?error=2");
      });
  }
);
Router.get("/new-calendar", isAuthenticated, (req, res) => {
  res.render("create", { error: req.query.error });
});
Router.get("/calendar/:id", isAuthenticated, async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (calendar) {
      res.render("calender", { id: calendar.id, calendar });
    } else {
      return res.redirect("/?error=1");
    }
  } catch (err) {
    return res.redirect("/?error=2");
  }
});
Router.get("/calendar/:id/delete", isAuthenticated, async (req, res) => {
  try {
    const cal = await Calendar.findById(req.params.id);
    if (cal) {
      res.render("calendar-delete", {
        error: req.query.error,
        title: cal.title,
        id: cal.id,
      });
    } else {
      res.redirect("/?error=1");
    }
  } catch {
    res.redirect("/?error=2");
  }
});

Router.post("/calendar/:id/delete", isAuthenticated, async (req, res) => {
  const cal = await Calendar.findOneAndDelete({
    id: req.params.id,
    title: req.body.title,
  });
  if (cal) {
    res.redirect("/");
  } else {
    res.redirect(`/calendar/${req.params.id}/delete?error=1`);
  }
});
Router.get("/calendar/:id/new-event", isAuthenticated, async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (calendar) {
      res.render("new-event", {
        title: calendar.title,
        id: calendar.id,
        error: req.query.error,
      });
    } else {
      res.redirect("/?error=1");
    }
  } catch {
    return res.redirect(`/?error=2`);
  }
});
Router.post(
  "/calendar/:id/new-event",
  isAuthenticated,
  body("title").isString().isLength({ min: 1 }),
  body("desc").isString().isLength({ min: 1 }),
  body("color").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .redirect(`/calendar/${req.params.id}/new-event?error=1`);

    const event_data = {};
    event_data.date = {
      time: { start: Number, end: Number },
      from: {
        year: Number,
        month: Number,
        day: Number,
      },
      to: {
        year: Number,
        month: Number,
        day: Number,
      },
      days: [Number],
    };

    event_data.title = req.body.title;
    event_data.desc = req.body.desc;
    event_data.color = req.body.color;
    const from_date = req.body.from_date.split("T");
    const to_date = req.body.to_date.split("T");

    // Start
    const start_date = from_date[0];
    let start_time = from_date[1].replace(/^0+(?=\d)/, "");

    start_time.charAt(0) == "0"
      ? (start_time = start_time.replace("", "12"))
      : start_time;

    const Start_year = parseInt(start_date.split("-")[0]);
    const Start_month = parseInt(start_date.split("-")[1]) - 1;
    const Start_day = parseInt(start_date.split("-")[2]);

    // End
    const end_date = to_date[0];
    const end_time = to_date[1];
    const End_year = parseInt(end_date.split("-")[0]);
    const End_month = parseInt(end_date.split("-")[1]) - 1;
    const End_day = parseInt(end_date.split("-")[2]);

    // Time
    event_data.date.time.start = convertTime(start_time).toUpperCase();
    event_data.date.time.end = convertTime(end_time).toUpperCase();
    event_data.date.time.start.charAt(0) == "0"
      ? (event_data.date.time.start = event_data.date.time.start.replace(
          "0",
          "12"
        ))
      : null;
    // Starting Date
    event_data.date.from.year = Start_year;
    event_data.date.from.month = Start_month;
    event_data.date.from.day = Start_day;

    // Ending Date
    event_data.date.to.year = End_year;
    event_data.date.to.month = End_month;
    event_data.date.to.day = End_day;

    // Days
    event_data.date.days = [...req.body.days];

    const doc = await Calendar.findById(req.params.id);
    if (doc) {
      doc.events = [event_data, ...doc.events];
      doc
        .save()
        .then(() => {
          res.redirect(`/calendar/${req.params.id}`);
        })
        .catch(() => {
          res.redirect(`/calendar/${req.params.id}/new-event?error=2`);
        });
    } else {
      res.redirect("/");
    }
  }
);
Router.get(
  "/calendar/:id/event/:event_id",
  isAuthenticated,
  async (req, res) => {
    try {
      const calendar = await Calendar.findById(req.params.id);
      if (calendar) {
        const cal = JSON.parse(JSON.stringify(calendar));
        const found = cal.events.find(
          (event) => event._id == req.params.event_id
        );
        if (found) {
          res.render("event", {
            title: found.title,
            cal_title: calendar.title,
            id: req.params.id,
            event_id: found._id,
            data: found,
            error: req.query.error,
          });
        } else {
          res.redirect(`/calendar/${req.params.id}?error=1`);
        }
      } else {
        res.redirect("/");
      }
    } catch {
      res.redirect(`/calendar/${req.params.id}?error=2`);
    }
  }
);
Router.post(
  "/calendar/:id/event/:event_id",
  isAuthenticated,
  body("title").isString().isLength({ min: 1 }),
  body("desc").isString().isLength({ min: 1 }),
  body("color").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .redirect(`/calendar/${req.params.id}/new-event?error=1`);

    const event_data = {};
    event_data.date = {
      time: { start: Number, end: Number },
      from: {
        year: Number,
        month: Number,
        day: Number,
      },
      to: {
        year: Number,
        month: Number,
        day: Number,
      },
      days: [Number],
    };

    event_data.title = req.body.title;
    event_data.desc = req.body.desc;
    event_data.color = req.body.color;
    const from_date = req.body.from_date.split("T");
    const to_date = req.body.to_date.split("T");

    // Start
    const start_date = from_date[0];
    let start_time = from_date[1].replace(/^0+(?=\d)/, "");

    const Start_year = parseInt(start_date.split("-")[0]);
    const Start_month = parseInt(start_date.split("-")[1]) - 1;
    const Start_day = parseInt(start_date.split("-")[2]);

    // End
    const end_date = to_date[0];
    const end_time = to_date[1];
    const End_year = parseInt(end_date.split("-")[0]);
    const End_month = parseInt(end_date.split("-")[1]) - 1;
    const End_day = parseInt(end_date.split("-")[2]);

    // Time

    event_data.date.time.start = convertTime(start_time).toUpperCase();
    event_data.date.time.end = convertTime(end_time).toUpperCase();
    event_data.date.time.start.charAt(0) == "0"
      ? (event_data.date.time.start = event_data.date.time.start.replace(
          "0",
          "12"
        ))
      : null;
    // Starting Date
    event_data.date.from.year = Start_year;
    event_data.date.from.month = Start_month;
    event_data.date.from.day = Start_day;

    // Ending Date
    event_data.date.to.year = End_year;
    event_data.date.to.month = End_month;
    event_data.date.to.day = End_day;

    // Days
    event_data.date.days = [...req.body.days];
    const doc = await Calendar.findById(req.params.id);
    if (doc) {
      let events = JSON.parse(JSON.stringify(doc.events));
      events.forEach((event, index) => {
        if (event._id == req.params.event_id) {
          events[index] = { ...event_data, _id: req.params.event_id };
        }
      });
      doc.events = events;

      doc
        .save()
        .then(() => {
          res.redirect(`/calendar/${req.params.id}`);
        })
        .catch(() => {
          res.redirect(`/calendar/${req.params.id}/new-event?error=2`);
        });
    } else {
      res.redirect("/?error=1");
    }
  }
);

Router.get(
  "/calendar/:id/event/:event_id/delete",
  isAuthenticated,
  async (req, res) => {
    const doc = await Calendar.findById(req.params.id);
    if (doc) {
      let events = JSON.parse(JSON.stringify(doc.events));
      events.forEach((event, index) => {
        if (event._id == req.params.event_id) {
          events.splice(index, 1);
          doc.events = events;
          doc
            .save()
            .then(() => {
              res.redirect(`/calendar/${req.params.id}`);
            })
            .catch(() => {
              res.redirect(`/calendar/${req.params.id}/new-event?error=2`);
            });
        }
      });
    } else {
      res.redirect("/");
    }
  }
);
// {h: new Date().getHours(),m: new Date().getMinutes(), type: new Date().getHours() < 13 ? "pm" : "am"}
module.exports = Router;
