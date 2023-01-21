const jwt = require("jsonwebtoken");
const Auth = require("../model/auth");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const admin_id = jwt.verify(token, process.env.TOKEN_KEY);
    if (admin_id) {
      const admin = await Auth.findById(admin_id);
      if (admin) {
        req.admin = { password: admin.password, id: admin_id };
        next();
      } else {
        req.admin = null;
        res.clearCookie("token").redirect("/");
      }
    } else {
      req.admin = null;
      res.clearCookie("token").redirect("/auth");
    }
  } catch {
    req.admin = null;
    res.clearCookie("token").redirect("/auth");
  }
};
const isNotAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) res.redirect("/");
  if (!token) {
    next();
  }
};

module.exports = { isAuthenticated, isNotAuthenticated };
