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

describe('Star Wars API people/?search query', function () {

    beforeEach("Execute before each test", function(){
        // print a blank line to separate log output from previous test results
        console.log("");
    });

    const characterSearchTestData = [
        {
            "testName" : "Test Case 2: retrieve details for a specific Star Wars character",
            "searchString": "Luke Skywalker",
            "logSearchResults" : true,
            "assertionFunction" : function(response, searchString, searchResults) {
                let isSearchStringInEveryCharacterName = true;
                for(let searchResult in searchResults) {
                    // search is case-insensitive; a search for 'd' will include 'Yoda' and 'R2-D2'
                    const characterNameLowerCase = searchResults[searchResult].name.toLocaleLowerCase('en-US');
                    if (!characterNameLowerCase.includes(searchString.toLocaleLowerCase('en-US'))) {
                        console.log(`search string '${searchString}' not found in search result ${searchResults[searchResult].name}`);
                        isSearchStringInEveryCharacterName = false;
                        break;
                    }
                }
    
                assert.ok(isSearchStringInEveryCharacterName);
            }
        },
        {
            "testName" : "every character name should contain the search string",
            "searchString": "d",
            "logSearchResults" : false,
            "assertionFunction" : function(response, searchString, searchResults) {
                let isSearchStringInEveryCharacterName = true;
                for(let searchResult in searchResults) {
                    // search is case-insensitive; a search for 'd' will include 'Yoda' and 'R2-D2'
                    const characterNameLowerCase = searchResults[searchResult].name.toLocaleLowerCase('en-US');
                    if (!characterNameLowerCase.includes(searchString.toLocaleLowerCase('en-US'))) {
                        console.log(`search string '${searchString}' not found in search result ${searchResults[searchResult].name}`);
                        isSearchStringInEveryCharacterName = false;
                        break;
                    }
                }
    
                assert.ok(isSearchStringInEveryCharacterName);
            }
        },        
        {
            "testName" : "query 'count' value should equal the quantity of search results",
            "searchString": "d",
            "logSearchResults" : false,
            "assertionFunction" : function(response, searchString, searchResults) {
                console.log(`response 'count' value: ${response.data.count}`);
                console.log(`search results length: ${searchResults.length}`);
                assert.equal(response.data.count, searchResults.length);
            }
        }
    ];

    characterSearchTestData.forEach( function(testData) {
    
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
            "searchString": "Santa Claus",
            "logSearchResults" : true,
            "assertFunction" : function(response, searchString) {
                console.log(`searchString: ${searchString}`);
                console.log(`response 'count' value: ${response.data.count}`);
                assert.ok(response.data.count == 0);
            }
        },
        {
            "testName" : "query should return one and only one result",
            "searchString": "Darth Vader",
            "logSearchResults" : true,
            "assertFunction" : function(response, searchString) {
                console.log(`searchString: ${searchString}`);
                console.log(`response 'count' value: ${response.data.count}`);
                assert.ok(response.data.count == 1);
            }
        },
        {
            "testName" : "query should return more than one result",
            "searchString": "Darth",
            "logSearchResults" : true,
            "assertFunction" : function(response, searchString) {
                console.log(`searchString: ${searchString}`);
                console.log(`response 'count' value: ${response.data.count}`);
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
            const response = await axios.get(`${swapiUrl}/people/?search=${searchString}`);
            assert.strictEqual(response.status, 200, 'Unexpected status code');

            if (testData.logSearchResults) {
                console.log(response.data.results);
            }

            testData.assertFunction(response, searchString);

        });
    });

    const paginationTestData = [
        {
            "testName" : "response should contain more than one page",
            "searchString": "d",
            "logSearchResults" : false,
            "assertionPerPage" : function(response, searchResults, currentPageNumber, maxPages) {
                if (maxPages > 1) {
                    if (currentPageNumber == maxPages) {
                        console.log(`current page number: ${currentPageNumber}`);
                        assert.ok(currentPageNumber > 1);
                    }
                } else {
                    assert.fail("search should return more than one page");
                }
            },
            "assertionPerTest" : function() {}
        },
        {
            "testName" : "response should be able to paginate through all pages",
            "searchString": "d",
            "logSearchResults" : false,
            "assertionPerPage" : function(response, searchResults, currentPageNumber, maxPages) {
                if (maxPages > 1) {
                    if (response.data.count == searchResults.length) {
                        assert.ok(currentPageNumber == maxPages);
                    }
                } else {
                    assert.fail("search should return more than one page");
                }
            },
            "assertionPerTest" : function() {}
        },
        {
            "testName" : "if the response does not need to paginate, both the 'previous' and 'next' values should be null",
            "searchString": "Luke Skywalker",
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
        {
            "testName" : "each page of the response that is not the first page should contain a 'previous' value",
            "searchString": "d",
            "logSearchResults" : false,
            "assertionPerPage" : function(response, searchResults, currentPageNumber, maxPages) {
                console.log(`current page number: ${currentPageNumber}`);
                console.log(`response.data.previous: ${response.data.previous}`);
                if (currentPageNumber > 1) {
                    if (response.data.previous !== null) {
                        return "pass";
                    } else {
                        return "fail";
                    }
                } else {
                    if (response.data.previous == null) {
                        return "first page: null";
                    } else {
                        return "fail";
                    }
                }
            },
            "assertionPerTest" : function(outcomesPerPage) {
                let assertion = true;
                for (let outcome in outcomesPerPage) {
                    console.log(`check if page 'previous' value is not null: ${outcomesPerPage[outcome]}`);
                    if (outcomesPerPage[outcome] === "fail") {
                        assertion = false;
                        break;
                    }
                }

                assert.ok(assertion);
            }
        },
        {
            "testName" : "each page of the response that is not the last page should contain a 'next' value",
            "searchString": "d",
            "logSearchResults" : false,
            "assertionPerPage" : function(response, searchResults, currentPageNumber, maxPages) {
                console.log(`current page number: ${currentPageNumber}`);
                console.log(`response.data.next: ${response.data.next}`);
                if (currentPageNumber < maxPages) {
                    if (response.data.next !== null) {
                        return "pass";
                    } else {
                        return "fail";
                    }
                } else {
                    if (response.data.next == null) {
                        return "last page: null";
                    } else {
                        return "fail";
                    }
                }
            },
            "assertionPerTest" : function(outcomesPerPage) {
                let assertion = true;
                for (let outcome in outcomesPerPage) {
                    console.log(`check if page 'next' value is not null: ${outcomesPerPage[outcome]}`);
                    if (outcomesPerPage[outcome] === "fail") {
                        assertion = false;
                        break;
                    }
                }

                assert.ok(assertion);
            }
        }        
    ]

    paginationTestData.forEach( function(testData) {
    
        it(`${testData.testName}`, async function () {
            const searchString = testData.searchString;
            console.log(`search string: ${searchString}`);

            let timeoutInMs = 15000;
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

            let outcomesPerPage = [];

            this.timeout(timeoutInMs * maxPages);
            let currentPageNumber = 1;
            let currentPageUrl = "";
            do {
                currentPageUrl = `${swapiUrl}/people/?search=${searchString}&page=${currentPageNumber}`;
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
