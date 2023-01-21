const mongoose = require("mongoose");
const Auth = require("./model/auth");
const bcrypt = require("bcrypt");

async function ConnectToDB() {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected To db.");
    })
    .catch((err) => {
      console.log(err);
    });

  const admin = await Auth.findOne();
  if (!admin) {
    const password = await bcrypt.hash("123", 10);
    const new_admin = new Auth({
      password,
    });
    new_admin
      .save()
      .then(() => {
        console.log("admin created");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = ConnectToDB;
