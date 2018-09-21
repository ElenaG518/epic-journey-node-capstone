'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../server');
// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET endpoint', function() {

    it('should return a 200 status code and HTML', function() {
      // strategy:
      //    1. prove res has right status, data type
      //    3. prove the res is an html file
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type');
          expect(res.header['content-type']).to.be.equal('text/html; charset=UTF-8');
        });
        
    });
});