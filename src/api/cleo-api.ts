import {Application, RequestHandler} from "express";
const express = require("express");
import {corsOptions} from "./cors-config";
const cors = require('cors');
import {sessionMiddleware} from "./session-config";
import passport = require("passport");
require("../auth/passport-config");
import authRouter from "../auth/auth-router";
import {authGuard} from "../auth/auth-guard";
import journalsRouter from "../journal/journals-router";
import entriesRouter from "../entry/entries-router";
import {API_TITLE} from "../environment";
import usersRouter from "../user/users-router";

const cleoHomeRoute = (req, res): RequestHandler =>
    res.send(API_TITLE);

const app: Application = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', cleoHomeRoute);
app.use('/auth/', authRouter);
app.use('/users/', authGuard, usersRouter);
app.use('/journals/', authGuard, journalsRouter);
app.use('/entries/', authGuard, entriesRouter);

export const run = (port: number): void => {
    app.listen(port, () => {
        console.log(`${API_TITLE} \n\tport: ${port}`);
    });
};