const mongoose = require("mongoose");
const fs = require('fs');
const validator = require('validator');


//schema
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field!"],
    unique: true,
    maxlength: [100, "Movie name must not have more then 100 characters"],
    minlength: [4, "Movie name must have at least 4 characters"],
    trim:true,
    validate:[validator.isAlpha, "Name should only contain alphabets"]
  },
  description: {
    type: String,
    required: [true, "Description is required field!"],
    unique: true,
    trim:true
  },
  duration: {
    type: Number,
    required: [true, "Duration is required field!"],
  },
  ratings: {
    type: Number,
    validate: {
      validator: function(value){
        return value >= 1 && value <= 10;
      },
      message:"Ratings ({VALUE}) be above 1 and below 10"
    }
  },
  totalRating:{
    type: Number
  },
  releaseYear: {
    type: Number,
    required:[true, 'Release year is required field!']
  },
  releaseDate:{
    type:Date
  },
  createdAt:{
    type: Date,
    default:Date.now(),
    select:false
  },
  genres:{
    type:[String],
    required:[true, 'Genres is required field!'],
    enum:{
      values: ["Action", "Adventure", "Sci-Fi", "Thriller","Crime","Drama", "Comedy", "Romance","Biography"],
      message: "This genre does not exist"
    }
  },
  coverImage:{
    type:String,
    required:[true, 'Cover image is required field']
  },
  actors:{
    type:[String],
    required:[true, 'actors is required field!']
  },
  price:{
    type:Number,
    required:[true,'Price is a required field']
  },
  createdBy:{
    type:String
  }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//VIRTUAL PROPERTY

movieSchema.virtual('durationInHours').get(function(){
  return this.duration / 60;
});

//DOCUMENT MIDDLEWARE

movieSchema.pre('save', function(next) {
  this.createdBy= 'MANOJHA';
  next();
});

movieSchema.post('save', function(doc, next){
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err) => {
    console.log(err.message);
  
  });
  next();
});

//QUERY MIDDLEWARE
movieSchema.pre(/^find/, function(next){
  this.find({releaseDate: {$lte: Date.now()}});
  next();
});

movieSchema.post(/^find/, function(docs, next){
  this.find({releaseDate: {$lte: Date.now()}});
  this.endTime = Date.now();

  const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents`
  fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err) => {
    console.log(err.message);
  
  });

  next();
});

movieSchema.pre('aggregate', function(next){
  console.log(this.pipeline().unshift({
    $match: {releaseDate: {$lte: new Date()}}
  }));
  next();
});


//model
const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
