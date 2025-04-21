import mongoose, { ConnectOptions } from "mongoose";
// import dotenv from 'dotenv';
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const user = process.env.USER;
    const password = process.env.PASSWORD;
    const dbName = process.env.DB_NAME;
    const mongoURI = process.env.MONGO_URI || "";

    // const mongoURI =  `mongodb://${user}:${password}@127.0.0.1:27017/${dbName}?authSource=admin`;
    console.log("Ruben: mongoURI", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("MongoDB conectado");

    // const db = mongoose.connection.db;
    const admin = mongoose.connection?.db?.admin();
    const dbList = await admin?.listDatabases();
    const dbExists = dbList?.databases.some((db) => db.name === dbName);

    if (!dbExists) {
      console.log(`Base de datos '${dbName}' creada.`);
    } else {
      console.log(`Base de datos '${dbName}' ya existe.`);
    }
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
