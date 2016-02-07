global.Q = require('Q');
global._ = require('lodash');

global.chai = require('chai');
chai.use(require('chai-as-promised'));
global.expect = chai.expect;

var Fieldbook = require('../index');

global.client = new Fieldbook({
  key: process.env.TEST_KEY,
  secret: process.env.TEST_KEY_SECRET,
  bookId: process.env.TEST_BOOK_ID,
})

global.helpers = {};

helpers.testRequest = function (name, createRequest, testFn) {
  describe(name, function () {
    var call = {};
    before(function () {
      call.response = createRequest();
      return call.response.fail(function (err) {
        // ignore errors here
      });
    })

    testFn(call);
  })
}

helpers.removeUrl = function (record) {
  if (Q.isPromise(record)) {
    return record.then(helpers.removeUrl);
  }

  return _.omit(record, 'record_url');
}

helpers.removeUrls = function (records) {
  if (Q.isPromise(records)) {
    return records.then(helpers.removeUrls);
  }

  return _.map(records, helpers.removeUrl);
}
