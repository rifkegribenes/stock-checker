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

// store result data if two stocks submitted
let result = [];

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

// takes in an array of two stock objects and returns a new array 
// containing both objects with a new 'rel_likes' key replacing the original 'likes' key
const formatStockData = data => {
  // first map through the two objects and substitute the rel_likes value for the # of likes
  return data.map((stockObj, index) => {
    // save a reference to the 'other stock' in the array
    // (not the one being processed at this step in the map)
    const otherStock = index === 0 ? data[1] : data[0];
    // find the relative likes value by comparing this object to the otherStock
    stockObj.rel_likes = stockObj.likes - otherStock.likes;
    console.log('52');
    // return the updated stockObject
    return stockObj;
  });
}

const returnSingle = (stockData, res) => {
  res.status(200).json(stockData);
}

const returnTwo = res => {
  const resultToReturn = formatStockData(result);
  console.log('64');
  res.status(200).json(resultToReturn);
}

const createStockObject = (stock, single, res) => {
  const stockData = { ...stock }
  stockData.likes = stock.likeIPs.length;
  // if this was the only stock submitted, return it now
  if (single) {
    returnSingle(stockData, res);
  } else {
    console.log('75');
    // otherwise, save it to the result array
    result.push(stockData);
    // if the result array already has two stocks in it, it's time to return it
    console.log('79');
    if (result.length === 2) {
      returnTwo(res);
    } else {
      // otherwise, just return out of this function and continue
      return;
    }
  }
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get((req, res) => {
      const { stock, like } = req.query;
      // reset result array on each new api call
      result = [];
      // if the stock query is not array, then 'single' is true
      let single = !Array.isArray(stock);
      
      // get like IP
      let likeIP = (req.headers['x-forwarded-for'] ||
       req.connection.remoteAddress ||
       req.socket.remoteAddress ||
       req.connection.socket.remoteAddress).split(",")[0];
      let likeIPs = [];

      getStockData(stock)
        .then((data) => {
          const stockList = Object.keys(data);
          console.log('111');
          let stockDataReturnArray = [];
          stockList.forEach((stockKey) => {
            console.log('114');
            let stockKeyUpper = stockKey.toUpperCase();
            Stock.findOne({ stock: stockKeyUpper })
              .then((stockFromMongo) => {
 
              // if the stock is not yet in the db
                if (!stockFromMongo) {
                  console.log('121');
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
                    .then(savedStock => createStockObject(savedStock._doc, single, res))
                    .catch((err) => {
                      console.log(`api.js > get stockToSave.save ${err}`);
                      return handleError(res, err);
                    });
                } else { // if the stock already exists in mongo
                    // if the stock was liked, update and save it
                    if (like) {
                      console.log('_doc');
                      console.log(stockFromMongo._doc.likeIPs);
                      console.log('no _doc');
                      console.log(stockFromMongo.likeIPs);
                      // if this IP does not already exist in the likeIPs array
                      if (stockFromMongo._doc.likeIPs.indexOf(likeIP) === -1) {
                        // add the new IP to the array of likeIPs
                        stockFromMongo._doc.likeIPs.push(likeIP);
                        console.log('_doc after push');
                        
                        console.log(stockFromMongo._doc.likeIPs);
                        // save the updated stock to mongo and return to client
                        stockFromMongo.save()
                          .then(savedStock => createStockObject(savedStock._doc, single, res))
                          .catch((err) => {
                            console.log(`api.js > get stockToSave.save ${err}`);
                            return handleError(res, err);
                          });
                      }
                    } else {
                      // (if it wasn't liked, there were no changes so don't need to re-save) 
                      createStockObject(stockFromMongo._doc, single, res)
                    }
                }
              })
              .catch((err) => {
                console.log(`api.js > get Stock.findOne ${err}`);
                return handleError(res, err);
              });
          });       
        })
        .catch((err) => {
          console.log(`api.js > get utils.getContent ${err}`);
          return handleError(res, err);
        });
    });
    
};
