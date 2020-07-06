const express = require("express");
const app = express();
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

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

  let user = await User.findOne({ email });

  if (user) {
    return res.json({ msg: "Email already taken" });
  }

  user = new User({
    email,
    password,
  });

  await user.save();
  var token = jwt.sign({ id: user.id }, "password");
  res.json({ token: token });
});

// login route api
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  let user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    return res.json({ msg: "no user found with that email" });
  }
  if (user.password !== password) {
    return res.json({ msg: "password is not correct" });
  }

  var token = jwt.sign({ id: user.id }, "password");
  return res.json({ token: token });
});

app.listen(5000, () => console.log("Example app listening on port 5000!"));
