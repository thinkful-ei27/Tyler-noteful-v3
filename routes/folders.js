'use strict';

const express = require('express');
const router = express.Router();
const Folder = require('../models/folder');
const mongoose = require('mongoose');
// Get all folders

router.get('/', (req, res, next) => {
  Folder.find()
    .sort({name: 'asc'})
    .then(folders => {
      res.json(folders);
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

  Folder.findById(id)
    .then(folder => {
      res.json(folder)
        .catch(err => next(err));
    });

});

// make a folder

router.post('/', (req, res, next) => {
  const { name } = req.body;
  const newFolder = { name };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  Folder.create(newFolder)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
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

  Folder.findByIdAndUpdate(id, updateObj, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

//  DELETE

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  Folder.findByIdAndRemove(id)
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
  
});


module.exports = router;