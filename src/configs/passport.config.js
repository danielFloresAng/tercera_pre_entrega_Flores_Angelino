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
          const email = profile._json?.email || null;

          // Necesitamos que en el profile haya un email
          if (email) {
            // Tratamos de ubicar en NUESTRA base de datos un usuario
            // con ese email, si no está lo creamos y lo devolvemos,
            // si ya existe retornamos directamente esos datos
            const foundUser = await manager.getOne({ email: email });

            if (!foundUser) {
              const user = {
                firstName: profile._json.name.split(" ")[0],
                lastName: profile._json.name.split(" ")[1],
                email: email,
                password: "none",
              };

              const process = await manager.add(user);

              return done(null, process);
            } else {
              return done(null, foundUser);
            }
          } else {
            return done(new Error("Faltan datos de perfil"), null);
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
    let user = userManager.get
    done(null, user);
  });
};

export default initializePassport;
