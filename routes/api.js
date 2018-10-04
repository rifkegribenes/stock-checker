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

const getStockData = (stock) => {
  
  console.log(`stock: ${stock}`);

  return new Promise((resolve, reject) => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = now.getMonth() + 1;
    const DD = now.getDate();
    
    const url = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote&last=1`;

    utils.getContent(url)
      .then((data) => {
        resolve(data.quote.iexRealtimePrice);
      })
      .catch((err) => {
        console.log('api.js > getStockData utils.getContent');
        console.log(err);
        reject(err);
      });

  });

}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get((req, res) => {
      const { stock } = req.query;

      getStockData(stock)
        .then((price) => {
          const newStock = new Stock({
            stock,
            price,
            likes: 0
          });
          newStock.save()
            .then((stock) => {
              return res.status(200).json(stock);
            })
            .catch((err) => {
              console.log(`api.js > get newStock.save ${err}`);
              return handleError(res, err);
            });         
        })
        .catch((err) => {
          console.log(`api.js > get utils.getContent ${err}`);
          return handleError(res, err);
        });
    });
    
};
