/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const Stock = require('../models/stock');
const utils = require('../utils');

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get((req, res) => {
      const { stock } = req.body;

      const url = `https://finance.google.com/finance/info?q=NASDAQ%3a${stock}`

      utils.getContent(url)
        .then((data) => {
          console.log(`data returned from google finance api for ${stock}`
          const books = data.items.filter((book) => book.volumeInfo.imageLinks.thumbnail && book.volumeInfo.imageLinks.thumbnail.length);
          return res.status(200).json({ books });
        })
        .catch((err) => {
          console.log(`book.ctrl.js > searchBook: ${err}`);
          return handleError(res, err);
        });
    });
    
};
