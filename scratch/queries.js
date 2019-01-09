'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    const searchTerm = 'lady gaga';
    let filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm, $options: 'i' };
    }

    return Note.find(filter).sort({ updatedAt: 'desc' });
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// find by id
//   mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     let id = "111111111111111111111101";
//     return Note.findById(id);
//   })
//   .then((results) => {
//       console.log(results);
//   })
//   .then(() => {
//       return mongoose.disconnect()
//   })
//   .catch(err => {
//       console.error(`ERROR: ${err.message}`)
//       console.error(err);
//   });

// create
// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     let sampleNote = {
//       title: 'my fake title',
//       content: 'blah blah words'
//     };
//     return Note.create(sampleNote);
//   })
//   .then((results) => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// find and update by id
// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => { 
//     const id ={_id : '111111111111111111111101'};
//     const updater = { title :  'hopefully this specifically got updated'};
      
        
//     return Note.findByIdAndUpdate(id, updater, {new : true, upsert :true });
//   })
//   .then(results => console.log(results))
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch( err => {
//     console.error( `ERROR: ${err.message}`);
//     console.error(err);
//   });

// delete
// mongoose.connect( `${MONGODB_URI}` , { useNewUrlParser: true })
//   .then(() => { 
//     const id = '111111111111111111111101';
  
    
//     return Note.findByIdAndRemove(id);
//   })
//   .then( results => console.log(results))
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch( err => {
//     console.error( `ERROR: ${err.message}`);
//     console.error(err);
//   });

