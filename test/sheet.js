var Fieldbook = require('../index');

describe('Sheets', function () {
  helpers.testRequest(
    'when you list the sheets',
    function () { return client.listSheets() },
    function (call) {
      it('should return all the sheets', function () {
        return expect(call.response).eventually.deep.equal(['tasks', 'projects', 'people']);
      })
    }
  )

  helpers.testRequest(
    'when you list records in a sheet',
    function () { return client.list('people') },
    function (call) {
      it('should return the people', function () {
        return expect(helpers.removeUrls(call.response).get(0)).eventually.deep.equal({
          "id":1,
          "name":"Paul Jacobs",
          "role":"Group Manager",
          "phone":"573-356-3327",
          "tasks":[{"id":3, "summary":"Finalize next iteration of test plan"}, {"id":10, "summary":"Publish industry analysis"}]
        })
      });

      it('should return the correct number of records', function () {
        return expect(call.response.get('length')).eventually.equal(5);
      })
    }
  )

  helpers.testRequest(
    'request a sheet list with options',
    function () { return client.list('people', {name: 'Alan Walters', include: 'name,phone'}) },
    function (call) {
      it('should return the correct data', function () {
        return expect(helpers.removeUrls(call.response)).eventually.deep.equal([{
          id: 2,
          name: 'Alan Walters',
          phone: '520-742-9705',
        }])
      })
    }
  )

  describe('when you have an error', function () {
    helpers.testRequest(
      'request a sheet that doesnt exist',
      function () { return client.list('foo') },
      function (call) {
        it('should reject the promise', function () {
          return expect(call.response).eventually.rejectedWith(/No such sheet/);
        })
      }
    )
  })

  describe('when you have an error without a message', function () {
    var badClient, response;
    before(function () {
      var options = _.clone(client.options);
      options.bookId = 'not-a-id',
      badClient = new Fieldbook(options);

      response = badClient.list('people');
      return response.fail(function (err) {}) // Swallow errrors so tests don't stop
    })

    it('should return an error', function () {
      return expect(response).eventually.rejectedWith(/400 on.*invalid id/);
    })
  })
})
