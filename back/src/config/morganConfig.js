import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";

const logDir = path.join("src", "logs");
const logPath = path.join(logDir, "access.log");

// Verifica se o diretório "logs" existe, senão cria
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Verifica se o arquivo "access.log" existe, senão cria
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, "", { encoding: "utf-8" }); // Cria o arquivo vazio
}
//const logPath = path.join("src", "logs", "access.log");
const createLog = fs.createWriteStream(logPath, { flags: "a" });

const morganConfig = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream: createLog }
);
export default morganConfig;
