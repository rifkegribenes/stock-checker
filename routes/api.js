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
      // if the stock query is not array, then 'single' is true
      let single = !Array.isArray(stock);
      console.log(stock);
      console.log(single);
      
      // get like IP
      let likeIP = (req.headers['x-forwarded-for'] ||
       req.connection.remoteAddress ||
       req.socket.remoteAddress ||
       req.connection.socket.remoteAddress).split(",")[0];
      let likeIPs = [];
    
      // here's where we'll save and compare the number of likes if two stocks are submitted
      let likesCompare = [];
    
      // here's where result data goes if two stocks were submitted
      let result = [];

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
                  // and add a value of 1 (this is the first like for this stock) 
                  // to the likesCompare array
                  if (like) {
                    likeIPs.push(likeIP);
                    likesCompare.push(1);
                  }
                  // create the new stock object to save to mongo
                  let newStock = new Stock({
                    stock: stockKey,
                    price: data[stockKey].quote.iexRealtimePrice,
                    likeIPs
                  });
                  // and save it
                  newStock.save()
                    .then((stockInfoFromIEX) => {
                      // create the result object and return to client
                      const stockData = { ...stockInfoFromIEX._doc };
                      stockData.likes = stockInfoFromIEX._doc.likeIPs.length;
                      // if this was the only stock submitted, return it now
                      if (single) {
                        return res.status(200).json({ stockData });
                      } else {
                        // otherwise, 
                      
                    })
                    .catch((err) => {
                      console.log(`api.js > get newStock.save ${err}`);
                      return handleError(res, err);
                    });
                  } else {
                  // if the stock already exists in mongo
                  // make a copy to avoid mutation
                    const updatedStock = { ...stockFromMongo._doc }
                    // if the stock was liked, update and save it
                    if (like) {
                      // if this IP does not already exist in the likeIPs array
                      if (updatedStock.likeIPs.indexOf(likeIP) === -1) {
                        // add the new IP to the array of likeIPs
                        updatedStock.likeIPs.push(likeIP);
                      }
                      // save the updated stock to mongo
                      updatedStock.save()
                        .then((postUpdateStock) => {
                      
                        }) // holy shit this is too many $#^$^% nested callbacks
                        .catch((err) => {
                          console.log(`api.js > get updatedStock.save ${err}`);
                          return handleError(res, err);
                        });
                    } else {
                      // if it wasn't liked, 
                      // check if multiple stocks were submitted
                      if (!single) {
                        // get the number of likes to compare for response
                
                      }
                      
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
