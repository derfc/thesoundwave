const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const StoreSQL = require("./storesql");
let storeSQL = new StoreSQL("users", "store", "item", "cart");

const app = express();
const port = 3000;

//auth routes
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
app.use("/auth", authRoutes);

//handlebars
app.engine(
	"handlebars",
	handlebars({
		defaultLayout: "main",
		helpers: {
			add: function (a, b) {
				return a + b;
			},
			times: function (a, b) {
				return a * b;
			},
			divide: function (a, b) {
				return a / b;
			},
		},
	})
);
app.set("view engine", "handlebars");

//body-parser
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname + "/public"));

//knex
const knex = require("knex")({
	client: "postgresql",
	connection: {
		database: process.env.db_name,
		user: process.env.db_username,
		password: process.env.db_password,
	},
});

//index route
//2 btn to login/register
app.get("/", (req, res) => {
	res.render("index");
});

//login route
// app.get("/login", (req, res) => {
// 	res.render("login");
// });

//login logic
// app.post("/login", (req, res) => {
// 	res.send("logged in");
// 	//rediredt to /home
// });

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
app.put("/setting", (req, res) => {
	res.render("setting", { layout: "dashboard" });
});

//store route
app.get("/store", (req, res) => {
	return storeSQL.getStoreItem().then((item) => {
		res.render("store", { item: item, layout: "dashboard" });
	});
});

//cart route
app.get("/cart", (req, res) => {
	let user_id = 1;
	return storeSQL.getCartItem(user_id).then((item) => {
		console.log("hello", item);
		res.render("cart", { item: item, layout: "dashboard" });
	});
});

app.post("/cart", (req, res) => {
	let item_id = req.body.item_id;
	let user_id = req.body.user_id;
	console.log(item_id, user_id);
	return storeSQL.addToCart(user_id, item_id).then(() => {
		res.render("cart", { layout: "dashboard" });
	});
});

app.delete("/cart/:id", (req, res) => {
	// res.render("cart", { layout: "dashboard" });
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
