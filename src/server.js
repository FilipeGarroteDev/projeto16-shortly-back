import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routers/usersRouter.js';
import linksRouter from './routers/linksRouter.js';
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(usersRouter);
server.use(linksRouter);

server.listen(process.env.PORT, () =>
	console.log(`Listening on port ${process.env.PORT}`)
);
