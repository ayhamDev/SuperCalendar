const mongoose = require("mongoose");
const auth = require("./model/auth");
const bcrypt = require("bcrypt");

async function ConnectToDB() {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log("Connected To db.");
      const admin = await auth.findOne();
      if (!admin) {
        const password = await bcrypt.hash("123", 10);
        const new_admin = new auth({
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
    })
    .catch((err) => {
      console.log(err);
    });
}
module.exports = ConnectToDB;
