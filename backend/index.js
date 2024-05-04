"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://aakash2000:aakash2000@cluster0.femcm9t.mongodb.net/mern");
const userSchema = new mongoose_1.default.Schema({
    username: { type: String },
    password: { type: String },
});
const User = mongoose_1.default.model("Users", userSchema);
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.verify(req.cookies.token, "SECRET");
    const user = yield User.findOne({ _id: token.user });
    res.json({ username: user === null || user === void 0 ? void 0 : user.username });
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const user = yield User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ user: user.id }, "SECRET");
        res.cookie("token", token);
        res.json({ success: true });
    }
    else {
        res.json({ success: false });
    }
}));
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    if (yield User.findOne({ username, password })) {
        res.json({ success: false });
    }
    else {
        const newUser = new User({ username, password });
        const user = yield newUser.save();
        console.log({ user });
        res.json({ success: true });
    }
}));
app.post("/signout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
