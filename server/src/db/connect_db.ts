import mongoose from "mongoose";
import logger from "../logger/index";

const connectDB = () => {
  mongoose
    .connect(process.env.DB_BASE_URI || "", {})
    .then(() => {
      logger.info("DB Connected");
    })
    .catch((err: Error) => {
      console.error(`Error connecting to the database: ${err}`);
    });

  mongoose.connection.on("connected", () => {
    logger.info("Mongoose Connected");
  });
};

export default connectDB;
