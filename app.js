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

//register route
app.get("/register", (req, res) => {
	res.render("register");
});

//home route
//layouts
app.get("/home", (req, res) => {
	// res.render("home");
	//render user name, playlist, lots of btns, browsing
});

//setting route
app.get("/setting", (req, res) => {
	// res.render("setting");
});

//setting route
//commit changes
app.post("/setting", (req, res) => {
	// res.render("setting");
});

//store route
app.get("/store", (req, res) => {
	res.render("store");
});

//cart route
app.get("/cart", (req, res) => {
	res.render("cart");
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
