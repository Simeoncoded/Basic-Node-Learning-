const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('./../Models/movieModel');

dotenv.config({path: './config.env'});

//CONNECT TO MONGODB

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser:true
}).then((conn) => {
    console.log('DB Connection Successful');
}).catch((error) => {
    console.log('Some error has occured');
});

//READ MOVIES.JSON file 
const movies = JSON.parse(fs.readFileSync('./data/movies.json', {encoding:'utf8'}));

//DELETE EXISTING MOVIE DOCUMENTS FROM COLLECTION
const deleteMovies = async () => {
    try{
        await Movie.deleteMany();
        console.log('Data Successfully Deleted');
    }catch(err){
        console.log(err.message);
    }
}

//IMPORT MOVIES DATA TO MONGODB COLLECTION
const importMovies = async () => {
    try{
        await Movie.create(movies);
        console.log('Data Successfully Imported');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

// deleteMovies();
// importMovies();

if(process.argv[2] === '--import'){
    importMovies();
}
if(process.argv[2] === '--delete'){
    deleteMovies();
}