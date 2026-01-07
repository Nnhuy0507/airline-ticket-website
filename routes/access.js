const express = require("express");
const route = express.Router();
const passport = require("passport");
const authenticationController = require("../controllers/AuthenticationController");
const siteController = require("../controllers/SiteController");

route.get("/login", authenticationController.showLoginPage);

route.post(
  "/login",
  authenticationController.checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

route.get("/register", authenticationController.showRegisterPage);

route.post("/register", authenticationController.registerNewUser);

route.post("/logout", authenticationController.logout);

// verify user via email
route.get("/verify/:userID/:uniqueString", authenticationController.verifyUser);

// reset psd via email
route.get(
  "/changepassword/:userID/:uniqueString",
  authenticationController.showChangePassword
);

// reset psd via email
route.post(
  "/changepassword/:userID/:uniqueString",
  authenticationController.changePassword
);

// forgot password
route.get("/forgotpassword", authenticationController.showforgotPassword);

route.post("/forgotpassword", authenticationController.forgotPassword);

// GG login

route.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

route.get(
  "/auth/google/callback",
  authenticationController.checkNotAuthenticated,
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// route.get('/auth/google/success',authenticationController.checkNotAuthenticated, siteController.index);

// route.get('/auth/google/failure', (req, res)=> {
//     res.redirect('/login');
// });
route.get("/account", authenticationController.showProfile);
route.get("/", siteController.index);


module.exports = route;
