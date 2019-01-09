'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');

const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');

const { notes } = require('../db/data');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Notes Api', function(){
  before(function() {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });
    
  beforeEach(function() {
    return Note.insertMany(notes);
  });
    
  afterEach(function () { 
    return mongoose.connection.db.dropDatabase();
  });
    
  after(function () {
    return mongoose.disconnect();
  });


  // Serial Request - Call API then call DB then compare
  describe('POST /api/notes', function() {
    it('should create a new note when given title and content', function() {
      const testNote = {
        'title': 'bang-bang',
        'content': 'my test note'
      };
      let res;
      // 1_ First, call the api
      return chai.request(app)
        .post('/api/notes')
        .send(testNote)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Note.findById(res.body.id);
        })
        // 3) then compare the API response to the database
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    describe('GET /api/notes', function () {
      it('should return the correct number of Notes', function () {
        // 1) Call the database **and** the API
        // 2) Wait for both promises to resolve using `Promise.all`
        return Promise.all([
          Note.find(),
          chai.request(app).get('/api/notes')
        ])
          // 3) then compare database results to API response
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(data.length);
          });
      });
    });

    describe('GET /api/notes/:id', function () {
      it('should return correct note', function () {
        let data;
        // 1) First, call the database
        return Note.findOne()
          .then(_data => {
            data = _data;
            // 2) then call the API with the ID
            return chai.request(app).get(`/api/notes/${data.id}`);
          })
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
    
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
    
            // 3) then compare database results to API response
            expect(res.body.id).to.equal(data.id);
            expect(res.body.title).to.equal(data.title);
            expect(res.body.content).to.equal(data.content);
            expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
            expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
          });
      });
    });

    describe('PUT /api/notes:id', function(){
      it('should update a note when passed update parameters', function() {

        let update = {
          'title': 'update test',
          'content': 'ding ding ding'
        };
        return Note.findOne()
          .then(data => {
            update.id = data.id;
              
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .send(update);
          })
          .then(res => {
            expect(res).to.have.status(200);
            return Note.findById(update.id);
          })
          .then(updatedNote => {
            expect(updatedNote.title).to.equal(update.title);
            expect(updatedNote.content).to.equal(update.content);
          });
      });
    });
    
    describe('DELETE', function(){
      it('should delete a note when given an id', function() {
        let note;

        return Note
          .findOne()
          .then(_note => {
            note = _note;
            return chai.request(app).delete(`/api/notes/${note.id}`);
          })
          .then(res => {
            expect(res).to.have.status(204);
            return Note.findById(note.id);
          })
          .then(_note => {
            expect(_note).to.be.null;
          });
      });
    });
  });

























});