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

describe('Star Wars API Test Case 2', function () {

    const searchStrings = [
        {
            "testName" : "should retrieve details for a specific Star Wars character v2",
            "searchString": "Luke Skywalker",
            "logSearchResults" : true
        },
        {
            "testName" : "every character name should contain the search string",
            "searchString": "d",
            "logSearchResults" : false
        }
    ];

    searchStrings.forEach( function(testData) {
    
        it(`${testData.testName}`, async function () {
            const searchString = testData.searchString;
            console.log(`search string: ${searchString}`);

            let timeoutInMs = 10000;
            this.timeout(timeoutInMs);
            const response = await axios.get(`${swapiUrl}/people/?search=${searchString}`);
            assert.strictEqual(response.status, 200, 'Unexpected status code');

            let searchResultList = [];

            const resultCount = response.data.count;
            console.log(`result count from API: ${resultCount}`);

            let resultsPerFullPage = 10;
            console.log(`results per page: ${resultsPerFullPage}`);

            let maxPages = Math.floor(resultCount / resultsPerFullPage) + 1;
            console.log(`max pages: ${maxPages}`);

            if (response.data.next == null && maxPages == 1) {
                searchResultList = response.data.results;
            } else if (response.data.next != null && maxPages > 1) { 
                this.timeout(timeoutInMs * maxPages);
                let currentPageNumber = 1;
                let currentPageUrl = "";
                do {
                    currentPageUrl = `${swapiUrl}/people/?search=${searchString}&page=${currentPageNumber}`;
                    const response = await axios.get(currentPageUrl);
                    assert.strictEqual(response.status, 200, 'Unexpected status code');
                    console.log("currentPageUrl: " + currentPageUrl);
                    searchResultList = response.data.results;
                    currentPageNumber++;
                } while (response.data.next != null && (currentPageNumber <= maxPages));
            }

            let isSearchStringInEveryCharacterName = true;
            for(let searchResult in searchResultList) {
                // search is case-insensitive; a search for 'd' will return 'Yoda' or 'R2-D2'
                const characterNameLowerCase = searchResultList[searchResult].name.toLocaleLowerCase('en-US');
                if (!characterNameLowerCase.includes(searchString.toLocaleLowerCase('en-US'))) {
                    console.log(`search string '${searchString}' not found in search result ${searchResultList[searchResult].name}`);
                    isSearchStringInEveryCharacterName = false;
                    break;
                }
            }

            if (testData.logSearchResults) {
                console.log(searchResultList);
            }

            assert.ok(isSearchStringInEveryCharacterName);
        });
    });

    // TODO:
    // query should contain more than one search result
    // query 'count' value should match the quantity of search results
    // response should contain more than one page
    // response should be able to paginate through all pages
    // each page of the response that is not the first page should contain a previous page
    // each page of the response that is not the last page should contain a next page

    // response should contain no results

    // query outside expected page length should return 404 not found (upper bound)

    // queries outside expected page length should return 404 not found (lower bound) ex: ?page=0, ?page=-1

    // extremely long search query
});
