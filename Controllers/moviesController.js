const Movie = require("./../Models/movieModel");

//ROUTE HANDLE FUNCTIONS
exports.getAllMovies = async (req, res) => {
  try {
    //console.log(req.query);

    // const excludeFields = ['sort', 'page', 'limit', 'fields'];

    // const queryObj = {...req.query};

    // excludeFields.forEach((el) => {
    //   delete queryObj[el]
    // })

    // console.log(queryObj)

    console.log(req.query);

    //convert to string 
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}` );
    const queryObj = JSON.parse(queryStr);
    //console.log(queryObj);
    
    let query = Movie.find();

    //SORTING LOGIC
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //query.sort('releaseYear ratings')
    }else{
      query = query.sort('-createdAt');
    }


    //TWO PARAMETERS
    
    // if(req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    //   //query.sort('releaseYear ratings')
    // }
    
    const movies = await query;

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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMovie = async (req, res) => {
  try {
    //const movie = await movie.find({_id:req.params.id});
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
