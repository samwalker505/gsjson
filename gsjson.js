const gsjson = require('google-spreadsheet-to-json');
const argv = require('minimist')(process.argv.slice(2));
const _ = require('underscore');

const spreadsheet = argv._[0]
const token = argv.t

if (spreadsheet == null) {
  console.error('no spreadsheet id');
  return
}

if (token == null) {
  console.error('no token');
  return
}
gsjson({
    spreadsheetId: spreadsheet,
    token: token
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
  const resResult = {'results': arr}
  console.log(JSON.stringify(resResult));
  return resResult;
})
.catch(function(err) {
    console.log(err.message);
    console.log(err.stack);
});
