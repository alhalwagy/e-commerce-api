const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const Product = require('../../models/productModel');

//Read file Json
const data = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

//connected DB
const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful !!');
  });

//import data to DB

const importData = async () => {
  try {
    await Product.create(data);
    console.log('Data has been imported successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data has been deleted successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
