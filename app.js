const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const StoreSQL = require("./storesql");
let storeSQL = new StoreSQL("users", "store", "item", "cart");

const app = express();
const port = 3000;
const authRoutes = require('./routes/auth-routes')
const passportSetup = require('./config/passport-setup')
const keys = require('./config/keys')
const passport = require('passport')

//cookie session
const cookieSession = require('cookie-session')

app.use(cookieSession({
	//1 day
	maxAge: 24 * 60 * 60 * 1000,
	keys: [keys.session.cookieKey]
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//auth routes
app.use('/auth', authRoutes)

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
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname + "/public"));

//knex

//authcheck
const authCheck = (req, res, next) => {
	if (!req.user) {
		res.redirect('/auth/login');
	} else {
		next();
	}
}

//index route
//2 btn to login/register
app.get("/", (req, res) => {
	res.render("index");
});


//home route
app.get("/home", authCheck, (req, res) => {
	let pic
	console.log(req.user)
	if (req.user.provider === 'google') {
		pic = req.user._json.picture
	} else if (req.user.provider === 'facebook') {
		pic = req.user.photos[0].value
	}
	res.render("home", { layout: "dashboard", user: req.user.displayName, thumbnail: pic });
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
