'use strict';

const express = require('express');

const router = express.Router();

const Note = require('../models/note');
/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  let filter = {};
  if(searchTerm) {
    filter = {
      $or: [
        {title: {$regex: searchTerm, $options: 'i'}},
        {content: {$regex: searchTerm, $options: 'i'}}
      ]
    };
  }

  Note
    .find(filter)
    .sort({updatedAt: 'desc'})
    .then(notes => 
      res.json(notes))
    
    .catch(err => {
      return next(err);
    });

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {

  const { id } = req.params;
  
  Note.findById(id)
    .then(notes => res.json(notes))
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content } = req.body;
  
  const newNote = { title, content };

  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  
  const { title, content } = req.body;
 
  const updateObj = { title, content};

  Note.findByIdAndUpdate(id, updateObj, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  const { id } = req.params;

  Note
    .findByIdAndDelete(id)
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
  res.sendStatus(204);
});

module.exports = router;
