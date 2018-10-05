/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
const mocha = require('mocha');
var assert = chai.assert;
var server = require('../server');

const { suite, test } = mocha;

chai.use(chaiHttp);

let _id1;
let _id2;
let firstLikes;

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'stock', 'StockData should contain stock');
            assert.property(res.body, '_id', 'StockData should contain _id');
            _id1 = res.body._id;
            assert.property(res.body, 'price', 'StockData should contain price');
            assert.equal(res.body.stock, 'GOOG');
            done();
          });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'stock', 'StockData should contain stock');
              assert.property(res.body, '_id', 'StockData should contain _id');
              _id1 = res.body._id;
              assert.property(res.body, 'price', 'StockData should contain price');
              assert.property(res.body, 'likes', 'StockData should contain likes');
              assert.isAtLeast(res.body.likes, 1, 'likes should be at least 1');
              firstLikes = res.body.likes;
              assert.equal(res.body.stock, 'GOOG');
              done();
            });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, 'stock', 'StockData should contain stock');
              assert.property(res.body, '_id', 'StockData should contain _id');
              _id1 = res.body._id;
              assert.property(res.body, 'price', 'StockData should contain price');
              assert.property(res.body, 'likes', 'StockData should contain likes');
              assert.isAtLeast(res.body.likes, 1, 'likes should be at least 1');
              assert.equal(res.body.likes, firstLikes);
              assert.equal(res.body.stock, 'GOOG');
              done();
            });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['aapl', 'goog']})
          .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isArray(res.body, 'Res.body should be an array');
              assert.property(res.body[0], 'stock', 'Each StockData object should contain stock');
              assert.property(res.body[0], '_id', 'Each StockData object should contain _id');
              _id2 = res.body[0]._id;
              assert.property(res.body[0], 'price', 'Each StockData object should contain price');
              assert.property(res.body[0], 'rel_likes', 'Each StockData object should contain rel_likes');
              assert.equal(res.body[0].stock, 'AAPL');
              done();
            });
      });
      
      test('2 stocks with like', function(done) {
        
      });
      
    });

});
