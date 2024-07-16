import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../config.js";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPass = (enteredPassword, savedPassword) =>
  bcrypt.compareSync(enteredPassword, savedPassword);

export const verifyRequired = (required) => {
  return (req, res, next) => {
    const verifiedOk = required.every((field) => {
      req.body.hasOwnProperty(field) &&
        req.body[field] !== "" &&
        req.body[field] !== null &&
        req.body[field] !== undefined;
    });
    return verifiedOk
      ? next()
      : res.status(400).send({
          origin: config.SERVER,
          payload: "Faltan propiedades",
          required,
        });
  };
};

const PRIVATE_KEY = config.SECRET;

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};
export const authThoken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).sene({ error: "No autenticado" });

  const token = authHeader.split("")[1];
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "No autorizado" });
    req.user = credentials.user;
    next();
  });
};
