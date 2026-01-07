const bcrypt = require("bcryptjs");
const userVerification = require("../services/UserVerificationService");
const userService = require("../services/UserService");
const userVerificationService = require("../services/UserVerificationService");
class Authentication {
  showLoginPage(req, res, next) {
    res.render("pages/authentication/login", { layout: null });
  }
  test(req, res, next) {
    res.render("pages/authentication/test", { layout: null });
  }
  showRegisterPage(req, res, next) {
    res.render("pages/authentication/register", { layout: null });
  }
  async registerNewUser(req, res, next) {
    try {
      const { email, password, phoneNumber, firstName, lastName, dob } = req.body;
      // check if user exists already
      const user = await userService.getUserByEmail(email);
      if (user) {
        if (!user.verified) {
          userVerificationService.sendVerificationEmail(user, res);
        } else {
          res.render("pages/authentication/register", {
            layout: null,
            error: "Email already exists.",
          });
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        userService.createUser(
          email,
          lastName,
          firstName,
          hashedPassword,
          phoneNumber,
          "",
          dob,
          res
        );
      }

      // res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.redirect("/register");
    }
  }
  // }
checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.user = req.user || req.session.passport.user;
    } else {
        req.user = null;
    }
    next();
}

  logout(req, res, next) {
    req.logOut(function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.redirect("/");
    });
  }

  async verifyUser(req, res, next) {
    try {
      const { userID, uniqueString } = req.params;
      const user = await userVerification.findByUserId(userID);
      if (user) {
        const { expiredAt, uniqueString: hashedUniqueString } = user;
        // Handle the case where verification has expired
        if (expiredAt < Date.now()) {
          userVerification
            .delUserVerification(userID, res)
            // return;
            .then((result) => {
              if (result.status == 200) {
                res.render("../views/pages/authentication/403.hbs", {
                  layout: null,
                  error: res.message,
                });
              } else {
                res.render("../views/pages/authentication/403.hbs", {
                  layout: null,
                  error: res.message,
                });
              }
            })
            .catch((error) => {
              res.render("../views/pages/authentication/403.hbs", {
                layout: null,
                error: error.message,
              });
            });
        } else {
          const result = await bcrypt.compare(uniqueString, hashedUniqueString);
          if (result) {
            const userUpdated = await userService.updateUserStatus(userID);
            if (userUpdated) {
              await userVerification.delUserVerification(userID, res);
              res.render("../views/pages/authentication/verifiedsucess.hbs", {
                layout: null,
              });
            } else {
              res.render("../views/pages/authentication/verifiedfail.hbs", {
                layout: null,
              });
            }
          } else {
            res.render("../views/pages/authentication/verifiedfail.hbs", {
              layout: null,
            });
          }
        }
      } else {
        res.render("../views/pages/authentication/verifiedfail.hbs", {
          layout: null,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // isLoggedIn(req,res,next){
  //     if(req.user){
  //         next();
  //     }
  //     res.sendStatus(401);
  // }
  showforgotPassword(req, res, next) {
    res.render("../views/pages/authentication/forgotpassword.hbs", {
      layout: null,
    });
  }
  async forgotPassword(req, res, next) {
    if (!req.body.email) {
      res.render("../views/pages/authentication/forgotpassword.hbs", {
        layout: null,
        error: "Bạn chưa nhập email.",
      });
    }
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      if (user.verified) {
        const result = await userVerification.sendCodeResetPassword(user);
        if (result.status == 200) {
          res.render("../views/pages/authentication/forgotpassword.hbs", {
            layout: null,
            success: result.message,
          });
        } else {
          res.render("../views/pages/authentication/forgotpassword.hbs", {
            layout: null,
            error: result.message,
          });
        }
      } else {
        res.render("../views/pages/authentication/forgotpassword.hbs", {
          layout: null,
          error: "Please verify your account first.",
        });
      }
    } else {
      res.render("../views/pages/authentication/forgotpassword.hbs", {
        layout: null,
        error: "No user found with that email.",
      });
    }
  }

  showChangePassword(req, res, next) {
    res.render("../views/pages/authentication/changepassword.hbs", {
      layout: null,
    });
  }

  async changePassword(req, res, next) {
    try {
      const { userID, uniqueString } = req.params;
      const userVerify = await userVerification.findByUserId(userID);
      if (userVerify) {
        const { expiredAt, uniqueString: hashedUniqueString } = userVerify;
        // Handle the case where verification has expired
        if (expiredAt < Date.now()) {
          userVerification
            .delUserVerification(userID, res)
            .then((result) => {
              if (result.status == 200) {
                res.render("../views/pages/authentication/403.hbs", {
                  layout: null,
                  error: res.message,
                });
              } else {
                res.render("../views/pages/authentication/403.hbs", {
                  layout: null,
                  error: res.message,
                });
              }
            })
            .catch((error) => {
              res.render("../views/pages/authentication/403.hbs", {
                layout: null,
                error: error.message,
              });
            });
        } else {
          const result = await bcrypt.compare(uniqueString, hashedUniqueString);
          if (result) {
            const newPassword = req.body.newPassword;
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const userUpdated = await userService.updateUserPassword(
              userID,
              hashedNewPassword
            );
            if (userUpdated) {
              await userVerification.delUserVerification(userID, res);
              res.render("../views/pages/authentication/changepassword.hbs", {
                layout: null,
                success: `Change password successfully. Login <a href="localhost:${process.env.PORT}/login">here</a>`,
              });
            } else {
              res.render("../views/pages/authentication/changepassword.hbs", {
                layout: null,
                error: "There was an error",
              });
            }
          } else {
            res.render("../views/pages/authentication/changepassword.hbs", {
              layout: null,
              error: "This link is invalid",
            });
          }
        }
      } else {
        res.render("../views/pages/authentication/changepassword.hbs", {
          layout: null,
          error: "No userverification was found.",
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  showProfile(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  res.render("pages/client/account", {
    user: req.user,
    layout: "main"
  });
}

}

module.exports = new Authentication();
