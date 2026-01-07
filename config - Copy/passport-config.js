const LocalStrategy = require("passport-local").Strategy
const userController = require('../services/UserService');
const bcrypt = require("bcryptjs")

function initialize(passport){
    const authenticateUsers = async (email, password, done) => {
        const user = await userController.getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: "No user found with that email."})
        }
        try {
            if(await bcrypt.compare(password, user.password)){  
                if(!user.verified){
                    return done (null, false, {message: "Please verify your email address before continuing."})
                }
                else{
                    return done(null, user)
                }
            } else{
                return done (null, false, {message: "Password Incorrect."})
            }
        } catch (e) {
            console.log(e);
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUsers))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, userController.getUserById(id))
    })
}

module.exports = initialize







