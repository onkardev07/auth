import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./models/UserSchema.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });

        console.log("ppp:", profile.photos[0].value);

        if (user) {
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        } else {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            profilePicture: profile.photos[0].value,
            isVerified: true,
            lastLogin: new Date(),
          });

          await user.save();
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
