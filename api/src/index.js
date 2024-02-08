// Load Environment Variables
import { config } from "dotenv";
config();

import cors from "cors";
import express, { Router, json } from "express";
import helmet from "helmet";
import nocache from "nocache";
import morgan from 'morgan';
import compression from 'compression';
import responseTime from 'response-time';
import dockerRouter from "./routes/docker.js";

const PORT = parseInt(process.env.PORT, 10) || 3000;
const app = express();
const apiRouter = Router();

morgan.token('reqBody', req => {
  return JSON.stringify(req.body);
})

// Disable 'X-Powered-By' response header banner
app.disable('x-powered-by')

app.use(compression())
app.use(responseTime())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] - :reqBody'))
app.use(json());
app.use(express.urlencoded({extended: true}))
app.set("json spaces", 2);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: {
      action: "deny",
    },
  })
);

app.use(nocache());

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

app.use("/api", apiRouter);
apiRouter.use("/docker", dockerRouter);

app.use((error, request, response, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  response.status(status).json({ message });
});

app.use((request, response, next) => {
  const message = "Not Found";
  response.status(404).json({ message });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}.`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server.')
  server.close(() => {
    console.log('HTTP server closed.')
  })
})
