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

const getStockData = (stocks) => {

  return new Promise((resolve, reject) => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = now.getMonth() + 1;
    const DD = now.getDate();
    
    const url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${stocks}&types=quote&last=1`;
    
    utils.getContent(url)
      .then((data) => {
        resolve(data);
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
        .then((data) => {
          const stockList = Object.keys(data);
          console.log(stockList);
          let stockDataArray = [];
          stockList.forEach((stockObj) => {
            stockDataArray
          }
         data.quote.iexRealtimePrice
          const newStock = new Stock({
            stock,
            price,
            likesIPs: []
          });
          newStock.save()
            .then((stockData) => {
              const stock = { ...stockData._doc };
              stock.likes = stockData._doc.likesIPs.length;
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
