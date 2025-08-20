import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express();

const corsOptions = {
  origin: ['http://192.168.219.100:3000/', 'https://pandamarket-fs-8-kwangche.netlify.app/'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(express.json());
app.use(cors(corsOptions));

function asyncHandler(handler) {
  async function asyncReqHandler(req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  }

  return asyncReqHandler;
}

app.get('/products', asyncHandler(async (req, res) => {
  const sort = req.query.sort;
  const sortOption =
    sort === 'price' ? { price: 'desc' } : { createdAt: 'desc' };

  const products = await Product.find().sort(sortOption);
  res.send(products);
}));

app.get('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));

app.post('/products', asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).send(newProduct);
}));

app.patch('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });
    await product.save();
    res.send(product);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));

app.delete('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
