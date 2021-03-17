const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const StoreSQL = require("./storesql");
let storeSQL = new StoreSQL("users", "store", "item", "cart");

const app = express();
const port = 3000;
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const keys = require("./config/keys");
const passport = require("passport");
const session = require("express-session");
const stripePublicKey = process.env.stripe_pk;
const stripeSecretKey = process.env.stripe_sk;
const stripe = require("stripe")(stripeSecretKey);

//cookie session
const cookieSession = require("cookie-session");

app.use(
	cookieSession({
		//1 day
		maxAge: 24 * 60 * 60 * 1000,
		keys: [keys.session.cookieKey],
	})
);

app.use(
	session({
		secret: "supersecret",
		resave: false,
		saveUninitialized: false,
	})
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//auth routes
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname + "/public"));

//knex

//authcheck
const authCheck = (req, res, next) => {
	console.log("requser", req.user);
	// if (!req.user) {
	// 	console.log('auth check fail?')
	// 	res.redirect('/auth/login');
	// } else {
	// 	next();
	// }
	if (req.isAuthenticated()) {
		console.log("He is allowed!");
		return next();
	} else {
		res.redirect("/auth/login");
	}
};

// const hello = () => {
// 	console.log(stripeSecretKey);
// };
// hello();

//landing page
app.get("/", (req, res) => {
	res.render("index");
});

//home route
app.get("/home", authCheck, (req, res) => {
	let pic;
	let user;
	console.log("this is requser", req.user);
	if (req.user.provider === "google") {
		pic = req.user._json.picture;
		user = req.user.displayName;
	} else if (req.user.provider === "facebook") {
		pic = req.user.photos[0].value;
		user = req.user.displayName;
	} else {
		user = req.user.username;
	}

	res.render("home", { layout: "dashboard", user: user, thumbnail: pic });
});

//setting route
app.get("/setting", (req, res) => {
	res.render("setting", { layout: "dashboard" });
});

//setting route
app.put("/setting", (req, res) => {
	res.render("setting", { layout: "dashboard" });
});

//store route
app.get("/store", (req, res) => {
	return storeSQL.getStoreItem().then((item) => {
		res.render("store", {
			item: item,
			layout: "dashboard",
			stripePublicKey: stripePublicKey,
		});
	});
});

//cart route
app.get("/cart", (req, res) => {
	let user_id = 1;
	return storeSQL.getCartItem(user_id).then((item) => {
		res.render("cart", {
			item: item,
			layout: "dashboard",
			stripePublicKey: stripePublicKey,
		});
	});
});

app.post("/cart", (req, res) => {
	let item_id = req.body.item_id;
	let user_id = req.body.user_id;
	return storeSQL.addToCart(user_id, item_id).then(() => {
		res.render("cart", {
			layout: "dashboard",
			stripePublicKey: stripePublicKey,
		});
	});
});

app.post("/purchase", (req, res) => {
	let total = 0;
	let count = 0;
	req.body.items.forEach((item) => {
		storeSQL.getItemPrice(item.item_id).then((data) => {
			total += data[0].item_price * item.quantity;
			count++;
			if (count === req.body.items.length) {
				console.log("charge below");
				// stripe.charges
				// 	.create({
				// 		amount: total,
				// 		source: req.body.stripeTokenId,
				// 		currency: "usd",
				// 	})
				// 	.then(() => {
				// 		console.log("charge successful");
				// //clear cart
				// 		res.json({ message: "successfully purchased" });
				// 	})
				// 	.catch((err) => {
				// 		console.log("charge fail", err);
				// 		res.status(500).end();
				// 	});
			}
		});
	});
});

app.delete("/cart/:user_id/:item_id", (req, res) => {
	let user_id = req.params.user_id;
	let delete_item = req.params.item_id;
	return storeSQL.delCartItem(user_id, delete_item).then(() => {
		return storeSQL.getCartItem(user_id).then((item) => {
			res.render("cart", {
				item: item,
				layout: "dashboard",
				stripePublicKey: stripePublicKey,
			});
		});
	});
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
