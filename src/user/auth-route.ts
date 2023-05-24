import {
   BAD_REQUEST,
   CONFLICT,
   CREATED,
   INTERNAL_SERVER_ERROR,
} from "../utils/http-status-constants";
const express = require('express');
import {RequestHandler} from "express";
import {User} from "./user.type";
import {authGuard} from "./auth-guard";
import passport = require("passport");
import {registerUser$, userExists$} from "./mongo-users";

const authenticateUserMiddleware = passport.authenticate('local');

const register = async (req, res) => {
   const username = req.body.username;
   const password = req.body.password;

   if (!username) {
      res.status(BAD_REQUEST).json('Username required.');
      return;
   }

   if (!password) {
      res.status(BAD_REQUEST).json('Password required.');
      return;
   }

   userExists$(username).subscribe((userExists) => {
      if (userExists) {
         res.status(CONFLICT).json('Username already taken.');
         return;
      }

      registerUser$(username, password).subscribe((user) => {
         res.status(CREATED).json(user);
      });
   });
}

const login: RequestHandler = (req, res) => {
   res.json(`Logged in as ${(req.user as User).username}`);
}

const logout = (req, res) => {
   req.logout(
       (error) => {
          if (error) {
             res.status(INTERNAL_SERVER_ERROR)
                 .json('Log out failed.');
             return;
          }

          res.json('Logged out successfully.');
       });
};

const authenticate = (req, res) => {
   res.json(`Authenticated as ${(req.user as User).username}`);
};

const authRouter = express.Router();

authRouter.post('/register/', register);
authRouter.post('/login/', authenticateUserMiddleware, login);
authRouter.post('/logout/', authGuard, logout);
authRouter.get('/protected/', authGuard, authenticate);
export default authRouter;