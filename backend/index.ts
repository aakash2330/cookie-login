import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://aakash2000:aakash2000@cluster0.femcm9t.mongodb.net/mern",
);

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
});
const User = mongoose.model("Users", userSchema);
const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.get("/user", async (req, res) => {
  const token = jwt.verify(req.cookies.token, "SECRET");
  const user = await User.findOne({ _id: (token as JwtPayload).user });
  res.json({ username: user?.username });
});

app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ user: user.id }, "SECRET");
    res.cookie("token", token);
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (await User.findOne({ username, password })) {
    res.json({ success: false });
  } else {
    const newUser = new User({ username, password });
    const user = await newUser.save();
    console.log({ user });
    res.json({ success: true });
  }
});

app.post("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
