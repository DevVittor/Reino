import "dotenv/config";
import cron from "node-cron";
import { exec } from "child_process";
import fs from "node:fs";
import path from "node:path";
import archiver from "archiver";
import nodemailer from "nodemailer";

// 📁 Diretório de backups
const backupDir = path.resolve("backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// 📧 Configuração do transporte de email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📦 Função para zipar e enviar por email
async function zipAndSendBackup(backupPath, timestamp) {
  const zipPath = `${backupPath}.zip`;
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(backupPath, false);
  await archive.finalize();

  output.on("close", () => {
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
        fs.rmSync(backupPath, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      }
    });
  });
}

// 🔁 Função principal de backup
function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `backup-${timestamp}`);

  // Modificação aqui: adiciona --db ReinoAnimal para fazer backup só desse banco
  const command = `mongodump --uri="${process.env.MONGO_URI}" --db=ReinoAnimal --out="${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao fazer backup:", error.message);
      return;
    }

    if (stderr) {
      console.log("ℹ️ Aviso do mongodump:\n", stderr); // Apenas loga o stderr se existir
    }

    console.log(`✅ Backup feito com sucesso: ${backupPath}`);
    zipAndSendBackup(backupPath, timestamp);
  });
}

// 🕒 Agendamento a cada 3 dias às 02:00 da manhã
cron.schedule("0 2 */3 * *", runBackup);

// 🚀 Executa imediatamente ao iniciar
//runBackup();
