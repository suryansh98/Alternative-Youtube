import passport from 'passport'; //authentication framework
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; //Google OAuth 2.0 authentication strategy
import dotenv from 'dotenv'; //to load environment variables from a .env file

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',// URL to which Google will redirect after authentication
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'], //scopes for accessing user profile and email, and YouTube data
}, (accessToken, refreshToken, profile, done) => {
  // Here you would typically save the user profile to your database
  // For now, we will just return the profile
  return done(null, {profile, accessToken}); //You pass these to done() to attach the data to the session
}));

passport.serializeUser((user, done) => {
  // Serialize user information into the session
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  // Here you would typically retrieve the user information from your database
  done(null, user);
});
