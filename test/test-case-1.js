const axios = require('axios');
const assert = require('assert');
// SWAPI endpoint
const swapiUrl = "https://swapi.dev/api";

// Run the tests
// This is just a placeholder, candidates might need to customize this 
// based on their project structure.
// For example, if the script is in a "test" folder, candidates can use
//`mocha test/*.js`.
// Make sure Mocha is installed either globally or as a devDependency.
// npm install -g mocha
// or
// npm install --save-dev mocha

describe('Star Wars API Test Case 1', function () {

    // Test Case 1: Retrieve a list of all Star Wars characters
    it ('should retrieve a list of all Star Wars characters', 
    async function () {
        let timeoutInMs = 10000;
        this.timeout(timeoutInMs);
        const response = await axios.get(`${swapiUrl}/people/`);
        assert.strictEqual(response.status, 200, 'Unexpected status code');
        
        const charCount = response.data.count;
        console.log(`character count from API: ${charCount}`);

        let resultsPerFullPage = 10;
        console.log(`results per page: ${resultsPerFullPage}`);

        let maxPages = Math.floor(charCount / resultsPerFullPage) + 1;
        console.log(`max pages: ${maxPages}`);

        let currentPageNumber = 1;
        let characterList = [];
        let currentPageUrl = "";

        
        this.timeout(timeoutInMs * maxPages);
        do {
            currentPageUrl = `${swapiUrl}/people/?page=${currentPageNumber}`;
            const response = await axios.get(currentPageUrl);
            assert.strictEqual(response.status, 200, 'Unexpected status code');

            console.log("currentPageUrl: " + currentPageUrl);

            characterList = characterList.concat(response.data.results);
            currentPageNumber++;
        } while (response.data.next !== null && currentPageNumber <= maxPages);

        console.log(`characterList length: ${characterList.length}`);
        console.log("the character list contains the following characters: " );
        for (let character in characterList) {
            console.log(characterList[character].name);
        }

        assert.equal(charCount, characterList.length);
    });

    // TODO:
    // response should contain more than one result
    // response should contain more than one page
    // response should be able to paginate through all pages

    // each page of the response that is not the first page should contain a previous page
    // each page of the response that is not the last page should contain a next page

    // query outside expected page length should return 404 not found (upper bound)

    // queries outside expected page length should return 404 not found (lower bound) ex: ?page=0, ?page=-1

    // the 'name' value of each response result should not be empty or null
});
