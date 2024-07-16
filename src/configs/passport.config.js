import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import { isValidPass } from "../services/utils.js";
import config from "../config.js";
import userManager from "../controllers/usersManagaerMdb.js";

const LocalStrategy = local.Strategy;
const manager = new userManager();

const initializePassport = () => {
  // ---------> Estrategia local
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const user = await manager.getUser({ email: username });

          if (user && isValidPass(password, user.password)) {
            const { password, ...filteredUser } = user;
            return done(null, filteredUser);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(`Error al obtener el usuario "${+error}"`, false);
        }
      }
    )
  );
  // ---------> Estrategia gitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await manager.getUser({ email: profile._json.email });

          if (!user) {
            let newUser = {
              firstName: profile._json.name,
              lastName: "",
              email: profile._json.email,
              password: "",
              role: "",
            };
            let result = await manager.addUser(newUser)
            done(null, result)
          } else {
            done(null, user)
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
  // ---------> serial y desSerial
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((user, done) => {
    let user = userManager.get;
    done(null, user);
  });
};

export default initializePassport;
