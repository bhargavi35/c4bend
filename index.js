const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const connection = require("./config/db");
const { todoRouter } = require("./routes/Todo.route");
const { userModel } = require("./models/User.model");
const { authenticate } = require("./middleware/authenitication");

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.send("Welcome to C4");
});

app.post("/signup", async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    const userPresent = await userModel.findOne({ email });
    if (userPresent?.email) {
        res.send("Try again, already exist");
    } else {
        try {
            bcrypt.hash(password, 4, async function (err, hash) {
                const user = new userModel({ email, password: hash });
                await user.save();
                res.send("signup Successfull");
            });
        } catch (err) {
            console.log(err);
            res.send({ err: "Something went wrong" });
        }
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.find({ email });
        if (user.length > 0) {
            const new_password = user[0].password;
            bcrypt.compare(password, new_password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ userID: user[0]._id }, "hash");
                    res.send({ msg: "Login Successfull" ,"token":token});
                } else {
                    res.send("Login Fail");
                }
            });
        } else {
            res.send("Login Fail");
        }
    } catch (err) {
        console.log(err);
        res.send({ err: "Something went wrong" });
    }
});

app.get("/about", (req, res) => {
    res.send("Welcome to About Page...");
});

app.use(authenticate)
app.use("/todos", todoRouter);

app.listen(8081, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
        console.log("Disconnected to DB");
    }
    console.log("Listening on Port 8081");
});
