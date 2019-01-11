'use strict';

const express = require('express');
const router = express.Router();
const Tag = require('../models/tags');
const mongoose = require('mongoose');
const Note = require('../models/note');

// Get all tags

router.get('/', (req, res, next) => {
  Tag.find()
    .sort({name: 'asc'})
    .then(tags => {
      res.json(tags);
    })
    .catch(err=> {
      return  next(err);
    });
});
  
// Get by id 
  
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Tag.findById(id)
    .then(tag => {
      if (tag) {
        res.json(tag);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  
});
  
// make a tag
  
router.post('/', (req, res, next) => {
  const { name } = req.body;
  const newTag = { name };
  
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  Tag.create(newTag)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});
  
// Put update
  
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateObj = { name };
  
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Tag.findByIdAndUpdate(id, updateObj, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});
  
//  DELETE
  
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  // ON DELETE SET NULL equivalent
  const tagRemovePromise = Tag.findByIdAndRemove( id );
  // ON DELETE CASCADE equivalent
  // const noteRemovePromise = Note.deleteMany({ folderId: id });

  const noteRemovePromise = Note.updateMany(
    {tags: id},
    { $pull: {tags: id} }
   
  );

  Promise.all([tagRemovePromise, noteRemovePromise])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});
  
  
module.exports = router;