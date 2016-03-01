var url = require('url');
var superagent = require('superagent');
var promisePlugin = require('superagent-promise-plugin');
var Q = require('q');
var _ = require('lodash');

promisePlugin.Promise = Q.Promise;

var BASE_FIELDBOOK_URL = 'https://api.fieldbook.com/v1';

var Client = module.exports = function (options) {
  this.options = options;
  this.initialize(options);
}

_.extend(Client.prototype, {
  initialize: function (options) {
    if (!options.key || !options.secret || (!options.bookId && !options.url)) {
      throw new Error('Must supply all of key, secret, and bookId.')
    }

    this.key = options.key;
    this.secret = options.secret;

    if (options.url) {
      this.baseUrl = options.url;
    } else {
      this.baseUrl = BASE_FIELDBOOK_URL + '/' + options.bookId + '/';
    }
  },

  request: function (path, options) {
    options.headers = {Accept: 'application/json'};
    options.auth = {username: this.key, password: this.secret};

    var requestUrl = url.resolve(this.baseUrl, path);

    // Remove trailing / if this is the listSheets request
    if (path === '') requestUrl = requestUrl.slice(0, -1);

    var request = superagent(options.method, requestUrl)
      .use(promisePlugin)
      .auth(this.key, this.secret)
      .accept('application/json');

    if (options.params) request = request.query(options.params);
    if (options.body) request = request.send(options.body);

    return request.end().then(function (response) {
      if (response.status === 204) return 'ok'; // no content
      return response.body;
    }).fail(function (err) {
      var response = err.response;
      if (response) {
        var message = 'Bad response: ' + response.status + ' on ' + requestUrl;
        if (response.headers['content-type'] === 'application/json') {
          try {
            var data = response.body;
            if (data && data.message) message = message + ' details: ' + data.message
          } catch (e) {
            // Do nothing (use the default "Bad response:..." message format)
          }
        }

        err = new Error(message);
        err.response = response;
        throw err;
      }

      throw err;
    });
  },

  listSheets: function () {
    return this.request('', {method: 'GET'});
  },

  list: function (sheet, options) {
    return this.request(sheet, {method: 'GET', params: options});
  },

  get: function (sheet, id, options) {
    return this.request(sheet + '/' + id, {method: 'GET', params: options});
  },

  create: function (sheet, attributes) {
    return this.request(sheet, {method: 'POST', body: attributes});
  },

  update: function (sheet, id, attrs) {
    return this.request(sheet + '/' + id, {method: 'PATCH', body: attrs})
  },

  destroy: function (sheet, id) {
    return this.request(sheet + '/' + id, {method: 'DELETE'})
  },

  createWebhook: function (url, actions) {
    return this.request('meta/webhooks', {method: 'POST', body: {
      url: url,
      actions: actions,
    }})
  },

  destroyWebhook: function (id) {
    return this.request('meta/webhooks/' + id, {method: 'DELETE'});
  },

  listWebhooks: function () {
    return this.request('meta/webhooks', {method: 'GET'})
  },
})

// Hook for fieldbook developers
Client.setBaseUrl = function (url) {
  BASE_FIELDBOOK_URL = url;
}
