const express = require("express");
const handlebars = require("express-handlebars");

const app = express();
const port = 3000;

//handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static files
app.use(express.static("public"));

//index route
//2 btn to login/register
app.get("/", (req, res) => {
	res.render("index");
});

//login route
app.get("/login", (req, res) => {
	res.render("login");
});

//login logic
app.post("/login", (req, res) => {
	res.send("logged in");
	//rediredt to /home
});

//register route
app.get("/register", (req, res) => {
	res.render("register");
});

//register logic
app.post("/register", (req, res) => {
	res.send("registered");
	//rediredt to /home
});

//home route
app.get("/home", (req, res) => {
	res.render("home", { layout: "dashboard" });
	//render user name, playlist, lots of btns, browsing
});

//setting route
app.get("/setting", (req, res) => {
	res.render("setting", { layout: "dashboard" });
});

//setting route
//commit changes
app.post("/setting", (req, res) => {
	res.render("setting", { layout: "dashboard" });
});

//store route
app.get("/store", (req, res) => {
	res.render("store", { layout: "dashboard" });
});

//cart route
app.get("/cart", (req, res) => {
	res.render("cart", { layout: "dashboard" });
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
