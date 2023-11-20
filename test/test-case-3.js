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

describe('Star Wars API /films endpoint', function () {

    // only six Star Wars films (no pages if results per page = 10) 
    // the search results should have 'next' and 'previous' values equal to null
    // query outside expected page length should return 404 not found (upper bound)
    // queries outside expected page length should return 404 not found (lower bound) ex: ?page=0, ?page=-1

    beforeEach("Execute before each test", function(){
        // print a blank line to separate log output from previous test results
        console.log("");
    });

    const entireListTestData = [
        {
            "testName" : "Test Case 3: retrieve a list of all Star Wars films",
            "logSearchResults" : false,
            "assertionFunction" : function(response, searchResults) {   
                console.log(`response data count: ${response.data.count}`);
                console.log(`search results count: ${searchResults.length}`);
                console.log("the search results contain the following films: " );
                for (let searchResult in searchResults) {
                    console.log(searchResults[searchResult].title);
                }
                assert.equal(response.data.count, searchResults.length);
            }
        },
        {
            // since the people search is indexed by title, all results must have a title or they will not be searchable
            "testName" : "the 'name' value of each response result should not be empty or null",
            "logSearchResults" : false,
            "assertionFunction" : function(response, searchResults) {   
                console.log(`response data count: ${response.data.count}`);
                console.log(`search results count: ${searchResults.length}`);
                for (let searchResult in searchResults) {
                    assert.ok(searchResults[searchResult].title !== null && searchResults[searchResult].title !== "");
                }
            }
        }
    ];

    entireListTestData.forEach( function(testData) {
    
        it(`${testData.testName}`, async function () {

            let timeoutInMs = 20000;
            this.timeout(timeoutInMs);
            const response = await axios.get(`${swapiUrl}/films/`);
            assert.strictEqual(response.status, 200, 'Unexpected status code');

            let searchResultList = [];

            const resultCount = response.data.count;
            console.log(`result count from API: ${resultCount}`);

            let resultsPerFullPage = 10;
            console.log(`results per page: ${resultsPerFullPage}`);

            let maxPages = Math.floor(resultCount / resultsPerFullPage) + 1;
            console.log(`max pages: ${maxPages}`);

            this.timeout(timeoutInMs * maxPages);
            let currentPageNumber = 1;
            let currentPageUrl = "";
            do {
                currentPageUrl = `${swapiUrl}/films/?page=${currentPageNumber}`;
                const response = await axios.get(currentPageUrl);
                console.log("currentPageUrl: " + currentPageUrl);
                searchResultList = searchResultList.concat(response.data.results);
                currentPageNumber++;
            } while (response.data.next != null && (currentPageNumber <= maxPages));

            if (testData.logSearchResults) {
                console.log(searchResultList);
            }

            testData.assertionFunction(response, searchResultList, currentPageNumber, maxPages);

        });
    });

    const boundaryTestData = [
        {
            "testName" : "query outside expected page limit should return 404 not found (upper bound)",
            "searchString": "d",
            "pageNumber": 100000000000000,
            "assertionPerTest" : function(httpStatusCode) {
                assert.equal(httpStatusCode, 404);
            }
        },
        {
            "testName" : "queries outside expected page limit should return 404 not found (lower bound)",
            "searchString": "d",
            "pageNumber": 0,
            "assertionPerTest" : function(httpStatusCode) {
                assert.equal(httpStatusCode, 404);
            }
        },
        {
            "testName" : "queries outside expected page length should return 404 not found (negative value)",
            "searchString": "d",
            "pageNumber": -1,
            "assertionPerTest" : function(httpStatusCode) {
                assert.equal(httpStatusCode, 404);
            }
        },    
    ]

    boundaryTestData.forEach( function(testData) {
    
        it(`${testData.testName}`, async function () {
            let timeoutInMs = 20000;
            this.timeout(timeoutInMs);

            let searchResultList = [];

            currentPageUrl = `${swapiUrl}/films/?page=${testData.pageNumber}`;
            console.log(`requested page number: ${testData.pageNumber}`);

            let httpStatusCode = "";
            let response;
            try {
                response = await axios.get(currentPageUrl);
                httpStatusCode = response.status;
            } catch (error) {
                httpStatusCode = error.response.status;
            } finally {
                console.log(`http status code: ${httpStatusCode}`)
            }

            testData.assertionPerTest(httpStatusCode);
        });
    });
});
