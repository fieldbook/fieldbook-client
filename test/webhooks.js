describe('Webhooks', function () {
  helpers.testRequest(
    'when you create a webhook',
    function () { return client.createWebhook('https://mywebhook.com', ['create']) },
    function (call) {
      it('should return the created webhook', function () {
        return expect(call.response.then(function (data) { return _.omit(data, 'id') })).eventually.deep.equal({
          url: 'https://mywebhook.com',
          actions: ['create']
        })
      })

      var needsDelete = true;

      describe('when you wait for the call', function () {
        var id;
        before(function () {
          return call.response.then(function (data) {
            id = data.id;
          })
        })

        helpers.testRequest(
          'when you list webhooks',
          function () {
            return client.listWebhooks();
          },
          function (call) {
            it('should return the webhook', function () {
              return expect(call.response).eventually.deep.equal([{
                id: id,
                url: 'https://mywebhook.com',
                actions: ['create'],
              }])
            })
          }

        )

        helpers.testRequest(
          'when you delete a webhook',
          function () {
            needsDelete = false;
            return client.destroyWebhook(id);
          },
          function (call) {
            it('should return ok', function () {
              return expect(call.response).eventually.equal('ok');
            })
          }
        )
      })

      after(function () {
        if (needsDelete) {
          return call.response.then(function (data) {
            return client.destroyWebhook(data.id)
          })
        }
      })
    }
  )
})
