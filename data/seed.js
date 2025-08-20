import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

await Product.deleteMany({});

mongoose.connection.close();
