const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception occured! Shutting down...');
  process.exit(1);

})

//check the environment
//console.log(app.get('env'));

//bunch of environment variables coming from the process module
//process is the core module of NodeJS
console.log(process.env);

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    //console.log(conn);
    console.log("Database Connection Successful");
  })
  // .catch((error) => {
  //   console.log("Some error has occured");
  // });



//CREATE A SERVER
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Server has started");
});


process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandled rejection occured! Shutting down...');

  server.close(() => {
    process.exit(1);
  })
})




