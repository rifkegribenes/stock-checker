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
            assert.property(res.body, 'price', 'StockData should contain price');
            assert.equal(res.body.stock, 'goog');
            done();
          });
      });
      
      test('1 stock with like', function(done) {
        
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        
      });
      
      test('2 stocks', function(done) {
        
      });
      
      test('2 stocks with like', function(done) {
        
      });
      
    });

});
