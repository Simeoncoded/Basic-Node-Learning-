const mongoose = require("mongoose");
const fs = require('fs');



//schema
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field!"],
    unique: true,
    trim:true
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
    default: 1.0,
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
    required:[true, 'Genres is required field!']
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


//model
const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
