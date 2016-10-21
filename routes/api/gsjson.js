const express = require('express');
const router = express.Router();
const gsjson = require('google-spreadsheet-to-json');
const _ = require('underscore');


function validateParams(req, res, next) {
    console.log('validateParams');
    const spreadsheetId = req.body.spreadsheetId;
    const oauthToken = req.body.oauthToken;
    if (_.isUndefined(spreadsheetId) || _.isNull(spreadsheetId)) {
      console.log('no spreadsheet id');
      next('no spreadsheet id');
    }

    if (_.isUndefined(oauthToken) || _.isNull(oauthToken)) {
      console.log('no token');
      next('no token');
    }
    next()
}

/* GET users listing. */
router.post('/', validateParams, (req, res, next) => {
  console.log('ho');
  const spreadsheetId = req.body.spreadsheetId;
  const oauthToken = req.body.oauthToken;
  gsjson({
      spreadsheetId: spreadsheetId,
      token: oauthToken
  })
  .then(function(results) {
    let arr = [];
    for (result of results) {
      let r = {}
      for (key in result) {
        const keyArr = key.split('.');
        let temp = r
        for (k of keyArr) {
          if (_.last(keyArr) == k ) {
            temp[k] = result[key]
          } else {
            if (temp[k] == undefined) {
              temp[k] = {}
              temp = temp[k]
            } else {
              temp = temp[k]
            }
          }
        }
      }
      arr.push(r);
    }
    res.json({'results': arr})
  })
  .catch(function(err) {
      console.log(err.message);
      console.log(err.stack);
      next(err);
  });

});

module.exports = router;
