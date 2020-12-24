const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught exception! Shutting down...');
});

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const DB = process.env.DATABASE;

const app = require('./app');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  });

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Database down, shutting down app...!');
});
