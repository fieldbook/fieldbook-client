# fieldbook-client

A nodejs client for Fieldbook.com

## Creating a client

```javascript
var Fieldbook = require('fieldbook-client');
var client = new Fieldbook({
  key: 'KEY_HERE',
  secret: 'SECRET_HERE',
  bookId: 'BOOK_ID_HERE',
})
```

To get an api key, see [the getting started guide](https://github.com/fieldbook/api-docs/blob/master/quick-start.md).

## API Methods

All api methods will return a promise for data from the fieldbook api.  Error responses will try to give an error with a good message, and the rejected errors will have a `response` property that contains the full response for the errored request.  This api uses Q promises via requestify.

#### client.listSheets()

```javascript
client.listSheets()
```

Returns the list of sheet names on the book.

#### client.list(SHEET_NAME, OPTIONS)

```javascript
client.list('people', {include: 'name,phone'})
```

Return the list of records.  OPTIONS can include include/exclude, limit/offset, and filter terms.  See the [sheet api docs](https://github.com/fieldbook/api-docs/blob/master/reference.md#sheet-queries) for more information.

#### client.show(SHEET_NAME, ID, OPTIONS)

```javascript
client.show('people', 2, {exclude: 'phone'})
```

Return a specific record in a sheet.  OPTIONS can include include/exclude options just list list() can.

#### client.create(SHEET_NAME, ATTRIBUTES)

```javascript
client.create('people', {name: "Julia Rogers", role: "Engineer"})
```

Create a record in the SHEET_NAME sheet with the specified attributes.

#### client.update(SHEET_NAME, ID, ATTRIBUTES)

```javascript
client.update('people', 4, {role: 'manager'})
```

Update the attributes of a specified record.  Only changed the passed attributes.

#### client.destroy(SHEET_NAME, ID)

```javascript
client.destroy('people', 3)
```

Deletes the specified record from the sheet.

#### client.createWebhook(URL, ACTIONS)

```javascript
client.createWebhook('https://example.com/my-webhook', ['create', 'update', 'destroy'])
```

Creates a webhook at the specified endpoint.  Only current valid actions are `create`, `update`, and `destroy`. See the [webhook documentation](https://github.com/fieldbook/api-docs/blob/master/reference.md#webhooks) for more information.

#### client.listWebhooks()

```javascript
client.listWebhooks()
```

Lists all the webhooks with their subscribed actions that are currently on the book.

#### client.destroyWebhook(ID)

```
client.listWebhooks().then(function (webhooks) {
  return client.destroyWebhook(webhooks[0].id)
})
```

Remove a webhook from the book.

## To Run Tests

First install foreman, if you don't have it. `gem install foreman`

Take the `test/apiTestBook.json` file and drag it onto the book list, this will
create a book

On that book, create an api key, and then populate a .env file with this variables:

```bash
TEST_BOOK_ID='<BOOK_ID_HERE>'
TEST_KEY='<API_KEY_NAME>'
TEST_KEY_SECRET='<API_SECRET>'
```
Then just run `npm test`.
