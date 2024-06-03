const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

//check the environment
//console.log(app.get('env'));

//bunch of environment variables coming from the process module
//process is the core module of NodeJS
console.log(process.env);

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    //console.log(conn);
    console.log("Database Connection Successful");
  })
  .catch((error) => {
    console.log("Some error has occured");
  });



//CREATE A SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server has started");
});
