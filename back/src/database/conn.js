import "dotenv/config";
import mongoose from "mongoose";

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_NAME,
    });
    console.log("Banco de dados sincronizado com sucesso!");
  } catch (error) {
    console.error(
      `Não foi possível conectar ao banco de dados. \nError:${error.message}`
    );
  }
};
export default conn;
