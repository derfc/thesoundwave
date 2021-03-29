const router = require("express").Router();
const passport = require("passport");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//register route
router.get("/register", (req, res) => {
	res.render("register");
});

router.post(
	"/register",
	passport.authenticate("local-signup", {
		successRedirect: "/auth/login",
		failureRedirect: "/",
	})
);

//login route
router.get("/login", (req, res) => {
	res.render("login");
});

router.post(
	"/login",
	passport.authenticate("local-login", {
		successRedirect: "/home",
		failureRedirect: "/auth/register",
	})
);

//logout
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

//auth with GOOGLE
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile"],
	})
);

//callback route for google redirect
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
	// console.log('this is the user', req.user);
	res.redirect("/home");
});

//auth with FACEBOOK
router.get(
	"/facebook",
	passport.authenticate("facebook", {
		scope: ["email", "user_location"],
	})
);

//callback route for facebook redirect
router.get(
	"/facebook/redirect",
	passport.authenticate("facebook"),
	(req, res) => {
		// console.log("this is the user", req.user);
		res.redirect("/home");
	}
);

module.exports = router;
