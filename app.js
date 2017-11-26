const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
const jwt = require("jsonwebtoken");
const jwtValidator = require("express-jwt");

const app = express();
const Schema = mongoose.Schema;
mongoose.Promise = Promise;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now() }
});
const User = mongoose.model("User", UserSchema);

const authRouter = express.Router();
const userRouter = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

authRouter.route("/register").post((req, res) => {
  const { username, password } = req.body;

  User.create({ username: username, password: password })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      if (err) {
        return res.status(500).json(err);
      }
    });
});

authRouter.route("/login").post((req, res) => {
  const { username, password } = req.body;

  User.findOne({
    $and: [
      {
        username: username,
        password: password
      }
    ]
  })
    .then(user => {
      const token = jwt.sign(user.toObject(), "secret", { expiresIn: "7d" });

      return res.status(200).json({
        user: user,
        token: token,
        expires_in: "1 week"
      });
    })
    .catch(err => {
      if (err) {
        return res.status(500).json(err);
      }
    });
});

userRouter.route("/").get((req, res) => {
  User.find({}).then(users => {
    return res.status(200).json(users);
  });
});
userRouter.route("/me").get((req, res) => {
  const user = req.user._id;
  User.findOne({ _id: user })
    .then(user => {
      return res.status(200).json(user);
    })
    .catch(err => {
      if (err) {
        return res.status(500).json(err);
      }
    });
});

app.use("/auth", authRouter);
app.use("/users", jwtValidator({ secret: "secret" }), userRouter);
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  }
});
mongoose.connect(
  "mongodb://mongo:27017/users",
  { useMongoClient: true },
  error => {
    if (error) {
      throw error;
    }

    app.listen(4000, () =>
      console.log("auth-user-service run at port " + 4000)
    );
  }
);
