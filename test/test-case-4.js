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

describe('Star Wars API /films/?search query', function () {
    
    beforeEach("Execute before each test", function(){
        // print a blank line to separate log output from previous test results
        console.log("");
    });

    const filmSearchTestData = [
        {
            "testName" : "Test Case 4: retrieve details for a specific Star Wars film",
            "searchString": "Return of the Jedi",
            "logSearchResults" : true,
            "assertionFunction" : function(response, searchString, searchResults) {
                let isSearchStringInEveryFilmTitle = true;
                for(let searchResult in searchResults) {
                    // search is case-insensitive; a search for 'm' will include 'The Empire Strikes Back' and 'The Phantom Menace'
                    const filmTitleLowerCase = searchResults[searchResult].title.toLocaleLowerCase('en-US');
                    if (!filmTitleLowerCase.includes(searchString.toLocaleLowerCase('en-US'))) {
                        console.log(`search string '${searchString}' not found in search result ${searchResults[searchResult].title}`);
                        isSearchStringInEveryFilmTitle = false;
                        break;
                    }
                }
    
                assert.ok(isSearchStringInEveryFilmTitle);
            }
        },
        {
            "testName" : "every film title should contain the search string",
            "searchString": "m",
            "logSearchResults" : false,
            "assertionFunction" : function(response, searchString, searchResults) {
                let isSearchStringInEveryFilmTitle = true;
                for(let searchResult in searchResults) {
                    console.log(`film title: ${searchResults[searchResult].title}`);

                    // search is case-insensitive; a search for 'm' will include 'The Empire Strikes Back' and 'The Phantom Menace'
                    const filmTitleLowerCase = searchResults[searchResult].title.toLocaleLowerCase('en-US');
                    if (!filmTitleLowerCase.includes(searchString.toLocaleLowerCase('en-US'))) {
                        console.log(`search string '${searchString}' not found in search result ${searchResults[searchResult].title}`);
                        isSearchStringInEveryFilmTitle = false;
                        break;
                    }
                }
    
                assert.ok(isSearchStringInEveryFilmTitle);
            }
        },        
        {
            "testName" : "query 'count' value should equal the quantity of search results",
            "searchString": "m",
            "logSearchResults" : false,
            "assertionFunction" : function(response, searchString, searchResults) {
                console.log(`response 'count' value: ${response.data.count}`);
                console.log(`search results length: ${searchResults.length}`);
                assert.equal(response.data.count, searchResults.length);
            }
        }
    ];

    filmSearchTestData.forEach( function(testData) {
    
        it(`${testData.testName}`, async function () {

            const searchString = testData.searchString;
            console.log(`search string: ${searchString}`);

            let timeoutInMs = 10000;
            this.timeout(timeoutInMs);
            const response = await axios.get(`${swapiUrl}/films/?search=${searchString}`);
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
                    currentPageUrl = `${swapiUrl}/films/?search=${searchString}&page=${currentPageNumber}`;
                    const response = await axios.get(currentPageUrl);
                    assert.strictEqual(response.status, 200, 'Unexpected status code');
                    console.log("currentPageUrl: " + currentPageUrl);
                    searchResultList = searchResultList.concat(response.data.results);
                    currentPageNumber++;
                } while (response.data.next != null && (currentPageNumber <= maxPages));
            }

            if (testData.logSearchResults) {
                console.log(searchResultList);
            }

            testData.assertionFunction(response, searchString, searchResultList);
        });
    });

    const queryCountTestData = [
        {
            "testName" : "query should return no results",
            "searchString": "Mission Impossible",
            "logSearchResults" : true,
            "assertFunction" : function(response, searchString) {
                console.log(`searchString: ${searchString}`);
                console.log(`response 'count' value: ${response.data.count}`);
                assert.ok(response.data.count == 0);
            }
        },
        {
            "testName" : "query should return one and only one result",
            "searchString": "Return of the Jedi",
            "logSearchResults" : true,
            "assertFunction" : function(response, searchString) {
                console.log(`searchString: ${searchString}`);
                console.log(`response 'count' value: ${response.data.count}`);
                assert.ok(response.data.count == 1);
            }
        },
        {
            "testName" : "query should return more than one result",
            "searchString": "the",
            "logSearchResults" : false,
            "assertFunction" : function(response, searchString) {
                console.log(`searchString: ${searchString}`);
                console.log(`response 'count' value: ${response.data.count}`);
                for (let film in response.data.results) {
                    console.log(`film title: ${response.data.results[film].title}`);
                }
                assert.ok(response.data.count > 1);
            }
        },
        {
            "testName" : "should be able to gracefully handle a very long search string",
            "searchString": 
            "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" + 
            "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" +
            "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" +
            "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" +
            "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
            "logSearchResults" : true,
            "assertFunction" : function(response, searchString) {
                console.log(`searchString: ${searchString}`);
                console.log(`response 'count' value: ${response.data.count}`);
                assert.strictEqual(response.status, 200, 'Unexpected status code');
            }
        },
    ];

    queryCountTestData.forEach( function(testData) {
        it(`${testData.testName}`, async function () {
            const searchString = testData.searchString;

            let timeoutInMs = 10000;
            this.timeout(timeoutInMs);
            const response = await axios.get(`${swapiUrl}/films/?search=${searchString}`);
            assert.strictEqual(response.status, 200, 'Unexpected status code');

            if (testData.logSearchResults) {
                console.log(response.data.results);
            }

            testData.assertFunction(response, searchString);

        });
    });

    // only six Star Wars films have been made; only one page should be returned given 10 results per page
    const paginationTestData = [
        {
            "testName" : "if the response does not need to paginate, both the 'previous' and 'next' values should be null",
            "searchString": "the",
            "logSearchResults" : false,
            "assertionPerPage" : function(response, searchResults, currentPageNumber, maxPages) {
                console.log(`current page number: ${currentPageNumber}`);
                console.log(`response.data.previous: ${response.data.previous}`);
                console.log(`response.data.next: ${response.data.next}`);
                if (maxPages == 1) {
                    assert.ok((response.data.previous == null) && (response.data.next == null))
                } else {
                    assert.fail("search should return one and only one page");
                }
            },
            "assertionPerTest" : function() {}
        },  
    ]

    paginationTestData.forEach( function(testData) {
    
        it(`${testData.testName}`, async function () {
            const searchString = testData.searchString;
            console.log(`search string: ${searchString}`);

            let timeoutInMs = 30000;
            this.timeout(timeoutInMs);
            const response = await axios.get(`${swapiUrl}/films/?search=${searchString}`);
            assert.strictEqual(response.status, 200, 'Unexpected status code');

            let searchResultList = [];

            const resultCount = response.data.count;
            console.log(`result count from API: ${resultCount}`);

            let resultsPerFullPage = 10;
            console.log(`results per page: ${resultsPerFullPage}`);

            let maxPages = Math.floor(resultCount / resultsPerFullPage) + 1;
            console.log(`max pages: ${maxPages}`);

            let outcomesPerPage = [];

            this.timeout(timeoutInMs * maxPages);
            let currentPageNumber = 1;
            let currentPageUrl = "";
            do {
                currentPageUrl = `${swapiUrl}/films/?search=${searchString}&page=${currentPageNumber}`;
                const response = await axios.get(currentPageUrl);
                assert.strictEqual(response.status, 200, 'Unexpected status code');
                console.log("currentPageUrl: " + currentPageUrl);
                searchResultList = searchResultList.concat(response.data.results);
                let outcome = testData.assertionPerPage(response, searchResultList, currentPageNumber, maxPages);
                outcomesPerPage.push(outcome);
                currentPageNumber++;
            } while (response.data.next != null && (currentPageNumber <= maxPages));

            if (testData.logSearchResults) {
                console.log(searchResultList);
            }

            testData.assertionPerTest(outcomesPerPage);
        });
    });
});
