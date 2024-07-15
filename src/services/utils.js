import bcrypt from "bcrypt";

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
