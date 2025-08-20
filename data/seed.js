import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Subscription from '../models/Product.js';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

await Subscription.deleteMany({});

mongoose.connection.close();
