const express = require("express");
const app = express();
const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    "mongodb://auth1:qwertyuiop1@ds049558.mlab.com:49558/auth",
    { useUnifiedTopology: true, useNewUrlParser: true }
  );

  console.log("db connected");
}
connectDB();

// this takes the post body
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Hello World!"));

// model
var schema = new mongoose.Schema({ email: "string", password: "string" });
var User = mongoose.model("User", schema);

// signup route api
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  let user = new User({
    email,
    password,
  });

  await user.save();
  res.json({ token: "1234567890" });
});

// login route api
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  let user = await User.findOne({ email });
  console.log(user);
  if (user.password !== password) {
    return res.json({ msg: "password is not correct" });
  }

  return res.json({ token: "1234567890" });
});

app.listen(5000, () => console.log("Example app listening on port 5000!"));
