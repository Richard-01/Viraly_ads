import mongoose from 'mongoose';

let conn = null;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://backend:qvPLAWlXuR6fdHWC@viraly-ads.ocijyvt.mongodb.net/ads";

const connector = async function () {
  if (conn === null) {
    conn = await mongoose.createConnection(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  }

  return conn;
};

export default connector;