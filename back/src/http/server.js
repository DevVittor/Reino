import "dotenv/config";
import express from "express";
const app = express();
import { createServer } from "node:http";
const serverHTTP = createServer(app);

import { exec } from "child_process";

// Importa e agenda o backup (cron job é iniciado automaticamente)
import "../middleware/backupMongoDB.js";

import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import conn from "../database/conn.js";

import router from "../routes/index.js";

import corsConfig from "../config/corsConfig.js";
import rateLimitConfig from "../config/rateLimitConfig.js";
import morganConfig from "../config/morganConfig.js";

app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsConfig);
app.use(rateLimitConfig);
app.use(morganConfig);
app.use(compression());
app.use(helmet());
app.use(cookieParser());

app.disable("x-powered-by");

app.use("/", (req, _, next) => {
  console.log(`Path: ${req.path} | Method: ${req.method}`);
  next();
});

// Middleware de debug (opcional)
app.use((req, res, next) => {
  console.log("IP detectado:", req.ip); // Verifique se é o IP real
  next();
});

app.use("/api", router);

exec("mongodump --version", (error, stdout, stderr) => {
  if (error) {
    console.error(`Exec error: ${error}`);
    // Não pare a inicialização do servidor
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`mongodump versão: ${stdout}`);
});

const port = process.env.PORT;

serverHTTP.listen(port, async () => {
  try {
    await conn();
    console.log(`Servidor rodando na porta ${port}...`);
  } catch (error) {
    console.error(
      `Não foi possível iniciar o servidor. \nError:${error.message}`
    );
  }
});
