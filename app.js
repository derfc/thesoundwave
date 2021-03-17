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
	if (!req.user) {
		res.redirect("/auth/login");
	} else {
		next();
	}
};

// const hello = () => {
// 	console.log(stripeSecretKey);
// };
// hello();

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
app.get("/home", authCheck, (req, res) => {
	res.render("home", {
		layout: "dashboard",
		user: req.user.displayName,
		thumbnail: req.user._json.picture,
	});

	// console.log(req.user.displayName)
	// res.send('you are logged in ' + req.user.displayName)
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
				// charge below
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
