const express = require('express');
const moviesController = require('./../Controllers/moviesController');

const router = express.Router();

//param middle ware

//router.param('id', moviesController.checkId);


router.route('/highest-rated')
    .get(moviesController.getHighestRated, moviesController.getAllMovies);

router.route('/movie-stats').get(moviesController.getMovieStats);

router.route('/movie-by-genre/:genre').get(moviesController.getMovieByGenre);

//because they have the same endpoint

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)

// app.route('/api/v1/movies')
//     .get(getAllMovies)
//     .post(createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router;

//app.use('/api/v1/movies',moviesRouter)//mounting routes
