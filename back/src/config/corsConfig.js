import cors from "cors";
const corsConfig = cors({
  /*origin: (origin, callback) => {
    const allowedOrigins = [
      "https://reino-production.up.railway.app",
      "https://reino-animal.onrender.com",
      "https://reinoanimalstore.com",
      "https://www.reinoanimalstore.com",
      "http://localhost:3000", // necessário para desenvolvimento
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || "*");
    } else {
      callback(new Error("Origem não permitida pelo CORS"));
    }
  },*/
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Adicione PATCH aqui
  allowedHeaders: ["Content-Type", "Authorization"],
});
export default corsConfig;
