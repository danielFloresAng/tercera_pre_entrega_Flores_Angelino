import { Router } from "express";
// import config from "../config.js";

import { createHash } from '../services/utils.js';

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (firstName && lastName && email && password) {
      let newUser = {
        firstName,
        lastName,
        email,
        password: createHash(password),
      };
    } else {
      res.status(400).send({ status: "Error", playload: "Datos no válidos" });
    }

    // res.status(200).send({ origin: config.SERVER, playload: "post" });
  } catch (error) {
    res.status(500).send({ status: "Error", playload: error.message });
  }
});

export default router;
