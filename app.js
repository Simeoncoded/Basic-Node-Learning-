//IMPORT PACKAGE
const express = require("express");
const fs = require("fs");
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController');
let app = express();



//creating custom middleware
const logger = function(req,res,next){
    console.log('Custom middleware called');
    next();
}

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

//app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(logger);
app.use((req,res,next) => {
    req.requestedAt = new Date().toISOString();
    next();
})

// //ROUTE HANDLE FUNCTIONS
// const getAllMovies = (req, res) => {
//     res.status(200).json({
//       status: "success",
//       requestedAt: req.requestedAt,
//       count: movies.length,
//       data: {
//         movies: movies,
//       },
//     });
//   }


// const getMovie =  (req, res) => {
//     console.log(req.params);
//     const id = req.params.id * 1;//converting to numeric value
  
//     //find movie based on id parameter
//    let movie =  movies.find(el => 
//       el.id === id 
//     )
//     //find() is an array method
  
//     if(!movie){
//           return res.status(404).json({
//               status: "fail",
//               message: 'Movie with ID '+id+' is not found'
//           })
//     }
  
//     //sending the response
//     res.status(200).json({
//           status: "success",
//           data:{
//               movie: movie
//           } 
//     });
//   }

// const createMovie = (req, res) => {
//     //console.log(req.body);
//     const newId = movies[movies.length - 1].id + 1;
  
//     const newMovie = Object.assign(
//       {
//         id: newId,
//       },
//       req.body
//     );
  
//     movies.push(newMovie);
  
//     fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
//       res.status(201).json({
//         status: "success",
//         data: {
//           movie: newMovie,
//         },
//       });
//     });
//     //res.send('Created');
//   }

// const updateMovie = (req,res) => {
//     let id = req.params.id * 1; //convert from string to number
//     let movieToUpdate = movies.find(el => el.id === id); //returns movie object

    
//     if(!movieToUpdate){
//         res.status(404).json({
//             status:'fail',
//             message:'No movie object with ID' + id + 'is found'
//         })
//     }
    
//     let movieIndex = movies.indexOf(movieToUpdate);

//     const updateMovieObject = Object.assign(movieToUpdate, req.body);
//     movies[movieIndex] = movieToUpdate;

//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
//         res.status(200).json({
//             status: "success",
//             data: {
//               movie: movieToUpdate,
//             },
//           }); 
//     })
// }

// const deleteMovie = (req,res) =>{
//     const id = req.params.id * 1; //convert id to numeric type
//     const movieToDelete = movies.find((el => el.id === id));

//     if(!movieToDelete){
//         res.status(404).json({
//             status:'fail',
//             message:'No movie object with ID ' + id + ' is found to delete'
//         })
//     }

//     const index = movies.indexOf(movieToDelete);

//     movies.splice(index,1);

//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
//         res.status(204).json({
//             status: "success",
//             data: {
//               movie: null,
//             },
//           }); 
//     })
// };

// //GET - api/v1/movies
// app.get("/api/v1/movies", getAllMovies);
// //ROUTE PARAMETER
// //GET - api/v1/movies/id (id is the route parameter)
// app.get("/api/v1/movies/:id", getMovie);
// //POST - api/v1/movies
// app.post("/api/v1/movies", createMovie);
// //PATCH
// app.patch('/api/v1/movies/:id', updateMovie)
// //DELETE
// app.delete('/api/v1/movies/:id', deleteMovie)

// const moviesRouter = express.Router();

// //because they have the same endpoint

// moviesRouter.route('/')
//     .get(getAllMovies)
//     .post(createMovie)

// // app.route('/api/v1/movies')
// //     .get(getAllMovies)
// //     .post(createMovie)

// moviesRouter.route('/:id')
//     .get(getMovie)
//     .patch(updateMovie)
//     .delete(deleteMovie)

//USING ROUTES
app.use('/api/v1/movies',moviesRouter);//mounting routes

//routes will be executed for all types of requests
app.all('*', (req,res, next) => {
    // res.status(404).json({
    //   status: "fail",
    //   message: `Can't find ${req.originalUrl} on the server!`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`,404);


    next(err);
})


app.use(globalErrorHandler);

module.exports = app;
