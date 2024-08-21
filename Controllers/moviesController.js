const { param } = require('../Routes/moviesRoutes');
const Movie = require("./../Models/movieModel");
const ApiFeatures = require('./../Utils/ApiFeatures');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');

exports.getHighestRated = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings';

  next();
}

//ROUTE HANDLE FUNCTIONS
exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
    const features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      
    let movies = await features.query;

    //console.log(req.query);

    // const excludeFields = ['sort', 'page', 'limit', 'fields'];

    // const queryObj = {...req.query};

    // excludeFields.forEach((el) => {
    //   delete queryObj[el]
    // })

    // console.log(queryObj)

    console.log(req.query);

    //convert to string
    // let queryStr = JSON.stringify(req.query);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // const queryObj = JSON.parse(queryStr);
    // //console.log(queryObj);

    // let query = Movie.find();

    //SORTING LOGIC
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    //   //query.sort('releaseYear ratings')
    // } else {
    //   query = query.sort("-createdAt");
    // }

    //LIMITING FIELDS
    // if (req.query.fields) {
    //   //query.select('name duration price ratings')
    //   const fields = req.query.fields.split(",").join(" ");
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // //PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // //PAGE 1: 1 - 10; PAGE 2: 11 - 20; PAGE 3: 21 - 30
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const moviesCount = await Movie.countDocuments();
    //   if (skip >= moviesCount) {
    //     throw new Error("This page is not found!");
    //   }
    // }

    //TWO PARAMETERS

    // if(req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    //   //query.sort('releaseYear ratings')
    // }

    //const movies = await query;

    //find({duration: {$gte: 90}, ratings : {$gte:5}, price: {$lte:100}});

    // const movies = await Movie.find()
    // .where('duration')
    // .gte(req.query.duration)
    // .where('ratings')
    // .gte(req.query.ratings)
    // .where('price')
    // .lte(req.query.price)

    res.status(200).json({
      status: "success",
      length: movies.length,
      data: {
        movies,
      },
    });

});

exports.getMovie =  asyncErrorHandler(async (req, res, next) => {

    //const movie = await movie.find({_id:req.params.id});
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
});



exports.createMovie = asyncErrorHandler(async (req, res,next) => {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        movie
      },
    });
});

exports.updateMovie = asyncErrorHandler(async(req, res,next) => {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        movie: updatedMovie,
      },
    });
 
});

exports.deleteMovie = asyncErrorHandler(async (req, res,next) => {
 
    await Movie.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
 
});

exports.getMovieStats = asyncErrorHandler(async(req, res, next) => {
        const stats = await Movie.aggregate([
          { $match: {releaseDate: {$lte: new Date()}}},
          { $match: {ratings: {$gte: 4.5}}},
          { $group: {
              _id: '$releaseYear',
              avgRating: { $avg: '$ratings'},
              avgPrice: { $avg: '$price'},
              minPrice: { $min: '$price'},
              maxPrice: { $max: '$price'},
              priceTotal: { $sum: '$price'},
              movieCount: { $sum: 1}
            }},
            { $sort: { minPrice: 1}}
            //{ $match: {maxPrice: {$gte: 60}}}
        ]);
        res.status(200).json({
          status: "success",
          count: stats.length,
          data: {
            stats
          },
        }); 
});


exports.getMovieByGenre = asyncErrorHandler(async(req, res, next) => {
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
        {$unwind: '$genres'},
        {$group: {
         _id: '$genres',
         movieCount:{ $sum: 1},
         movies: {$push: '$name'},
       
        }},
        {$addFields: {genre: "$_id"}},
        {$project: {_id:0}},
        {$sort: {movieCount: -1}},
        //{$limit: 6}
        {$match: {genre: genre}}
    ]);

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies
      },
    });
});