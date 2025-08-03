import "dotenv/config";
import cron from "node-cron";
import { exec } from "child_process";
import fs from "node:fs";
import path from "node:path";
import archiver from "archiver";
import nodemailer from "nodemailer";

const routeBackupDir = path.join("src", "backups");
const backupDir = path.join(routeBackupDir);
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function zipAndSendBackup(backupPath, timestamp) {
  const zipPath = `${backupPath}.zip`;
  console.log(`📁 Criando zip: ${zipPath}`);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(backupPath, false);

  await archive.finalize();

  output.on("close", () => {
    console.log(`📦 Zip criado com ${archive.pointer()} bytes`);

    const mailOptions = {
      from: `"Backup MongoDB" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Backup MongoDB - ${timestamp}`,
      text: `Backup realizado com sucesso em ${timestamp}.`,
      attachments: [
        {
          filename: `backup-${timestamp}.zip`,
          path: zipPath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Erro ao enviar email:", err.message);
      } else {
        console.log("📤 Email enviado:", info.response);
        console.log("🟢 Não apagando arquivos locais. Backup e zip mantidos.");
      }
    });
  });
}

function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `backup-${timestamp}`);

  console.log(`⏳ Iniciando backup: ${backupPath}`);

  const command = `mongodump --uri="${process.env.MONGO_URI}" --db=ReinoAnimal --out="${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao fazer backup:", error.message);
      return;
    }

    if (stderr) {
      console.log("ℹ️ Aviso do mongodump:\n", stderr);
    }

    console.log(`✅ Backup feito com sucesso: ${backupPath}`);

    zipAndSendBackup(backupPath, timestamp);
  });
}

// Teste: cron job executando a cada minuto
cron.schedule("0 2 */3 * *", runBackup, {
  timezone: "America/Sao_Paulo", // Define o fuso horário
});
