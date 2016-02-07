# fieldbook-client

A nodejs client for Fieldbook.com

## To Run Tests

First install foreman, if you don't have it. `gem install foreman`

Take the `test/apiTestBook.json` file and drag it onto the book list, this will
create a book

On that book, create an api key, and then populate a .env file with this variables:

    TEST_BOOK_ID='<BOOK_ID_HERE>'
    TEST_KEY='<API_KEY_NAME>'
    TEST_KEY_SECRET='<API_SECRET>'

Then just run `npm test`.
