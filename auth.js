const passport = require("passport");
const LocalStratergy = require("passport-local").Strategy;
const Person = require("./models/person");

passport.use(
  new LocalStratergy(async (username, password, done) => {
    // authentication logic
    try {
      // console.log("received credentials: ", username, password);
      const user = await Person.findOne({username});
      if (!user) 
          return done(null, false, { message: "incorrect username" });
      const isPasswordMatch = await user.comparePassword(password);
      if (isPasswordMatch) 
          return done(null, user);
      else 
          return done(null, false, { message: "incorrect password" });
    } catch (error) {
      return done(error);
    }
  }));

module.exports = passport;
