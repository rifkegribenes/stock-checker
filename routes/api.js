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
      const { stock, like } = req.query;
      
    // get like IP
    let likeIP = (req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress).split(",")[0];
    let likeIPs = [];

      getStockData(stock)
        .then((data) => {
          const stockList = Object.keys(data);
          console.log(stockList);
          let stockDataReturnArray = [];
          stockList.forEach((stockKey) => {
            Stock.findOne({ stock: stockKey })
              .then((stockFromMongo) => {
              // if the stock is not yet in the db
                if (!stockFromMongo) {
                  // if it was liked, save the liker's IP in the likeIPs array
                  if (like) {
                    likeIPs.push(likeIP);
                  }
                  // create the new stock object to save to mongo
                  let newStock = new Stock({
                    stock: stockKey,
                    price: data[stockKey].quote.iexRealtimePrice,
                    likeIPs
                  });
                  // and save it
                  newStock.save()
                    .then((stockData) => {
                      // const stock = { ...stockData._doc };
                      // stock.likes = stockData._doc.likeIPs.length;
                    })
                    .catch((err) => {
                      console.log(`api.js > get newStock.save ${err}`);
                      return handleError(res, err);
                    });
                  } else {
                  // if the stock already exists in mongo
                    if (like) {
                      stockF
                  }
            })
              .catch();
            
          }
                 
        })
        .catch((err) => {
          console.log(`api.js > get utils.getContent ${err}`);
          return handleError(res, err);
        });
    });
    
};
