const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const FacebookStrategy = require("passport-facebook").Strategy;

const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/user");

console.log("Passport strategies loaded");

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "dummy-google-client-secret",
      callbackURL: `${process.env.SERVER_URL}/user/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            firstName: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
            //provider: 'google'
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "dummy-facebook-app-id",
      clientSecret:
        process.env.FACEBOOK_APP_SECRET || "dummy-facebook-app-secret",
      callbackURL: `${process.env.SERVER_URL}/user/auth/facebook/callback`,
      profileFields: ["id", "displayName", "email", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [{ facebookId: profile.id }, { email: email }],
        });

        // const newUser = await User.create({
        //   firstName: firstName,
        //   email: email,
        //   password: hashPass,
        //   role: "user",
        // });

        //if user is not present in DB then store it...
        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            firstName: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
            //provider: 'facebook'
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "dummy-github-client-id",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || "dummy-github-client-secret",
      callbackURL: `${process.env.SERVER_URL}/user/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [{ githubId: profile.id }, { email: email }],
        });

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            firstName: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
            //provider: 'github'
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
