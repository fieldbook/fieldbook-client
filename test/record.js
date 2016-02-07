describe('Records', function () {
  helpers.testRequest(
    'when you get a record',
    function () { return client.show('people', 1) },
    function (call) {
      it('should return the record', function () {
        return expect(helpers.removeUrl(call.response)).eventually.deep.equal({
          "id":1,
          "name":"Paul Jacobs",
          "role":"Group Manager",
          "phone":"573-356-3327",
          "tasks":[{"id":3, "summary":"Finalize next iteration of test plan"}, {"id":10, "summary":"Publish industry analysis"}]
        });
      })
    }
  )

  helpers.testRequest(
    'when you get a record with options',
    function () { return client.show('people', 1, {include: 'role', exclude: 'id,record_url'}) },
    function (call) {
      it('should return the record', function () {
        return expect(call.response).eventually.deep.equal({role:"Group Manager"});
      })
    }
  );

  helpers.testRequest(
    'when you create a record',
    function () { return client.create('people', {name: 'Ben B', role: 'Engineer'}) },
    function (call) {
      it('should return the record', function () {
        var response = call.response.then(function (data) {
          return _.omit(data, 'id', 'record_url');
        })
        return expect(response).eventually.deep.equal({
          name: 'Ben B',
          role: 'Engineer',
          phone: null,
          tasks: []
        });
      })

      var needsDelete = true;
      describe('when you get the response', function () {
        var id;
        before(function () {
          return call.response.then(function (data) { id = data.id })
        })

        helpers.testRequest(
          'when you update a record',
          function () { return client.update('people', id, {phone: '510-867-5309'}) },
          function (call) {
            it('should return the modified record', function () {
              var response = call.response.then(function (data) {
                return _.omit(data, 'id', 'record_url');
              })

              return expect(response).eventually.deep.equal({
                name: 'Ben B',
                role: 'Engineer',
                phone: '510-867-5309',
                tasks: []
              });
            })
          }
        )

        helpers.testRequest(
          'when you delete a record',
          function () {
            needsDelete = false;
            return client.destroy('people', id)
          },
          function (call) {
            it('should complete successfully', function () {
              return expect(call.response).eventually.equal('ok');
            })
          }
        )
      })

      after(function () {
        // Cleanup if we haven't already run the delete
        if (needsDelete) {
          return call.response.then(function (data) {
            return client.destroy('people', data.id);
          })
        }
      })
    }
  )

  helpers.testRequest(
    'when you request a record and get an error',
    function () { return client.show('people', 99) },
    function (call) {
      it('should throw an error', function () {
        return expect(call.response).eventually.rejectedWith(/Record id not found/)
      })
    }
  )
});
