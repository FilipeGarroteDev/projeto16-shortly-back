import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/authRouter.js';
import linksRouter from './routers/linksRouter.js';
import usersRouter from './routers/usersRouter.js';
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(authRouter);
server.use(linksRouter);
server.use(usersRouter);

server.listen(process.env.PORT, () =>
	console.log(`Listening on port ${process.env.PORT}`)
);
