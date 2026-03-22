import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';
import { UserRole } from '../constants/roles';
import { log } from '../utils/logger';

const configurePassport = (): void => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback';

  if (!clientID || !clientSecret) {
    log.warn('Google OAuth not configured – GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['profile', 'email'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done
      ) => {
        try {
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;

          if (!email) {
            return done(new Error('Google account has no email'), undefined);
          }

          // Check if user already exists with this googleId
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user as any);
          }

          // Check if user exists with same email (registered via email/password)
          user = await User.findOne({ email: email.toLowerCase() });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.avatar =
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : undefined;
            await user.save();
            return done(null, user as any);
          }

          // Create new user from Google profile
          user = await User.create({
            googleId: profile.id,
            email: email.toLowerCase(),
            firstName: profile.name?.givenName || profile.displayName || 'User',
            lastName: profile.name?.familyName || '',
            phoneNumber: '', // will need to be collected later
            avatar:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : undefined,
            role: UserRole.USER,
          });

          return done(null, user as any);
        } catch (error) {
          log.error('Google OAuth error', { error: (error as Error).message });
          return done(error as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user as any);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
