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

// Test Suite
describe('Star Wars API Tests', function () {

    // Test Case 1: Retrieve a list of all Star Wars characters
    it  ('should retrieve a list of all Star Wars characters', 
    async function () {
        // retrieving an initial result often takes over 5000ms
        let timeoutInMs = 10000;
        this.timeout(timeoutInMs);
        const response = await axios.get(`${swapiUrl}/people`);
        
        const charCount = response.data.count;
        console.log(`character count: ${charCount}`);

        let resultsPerFullPage = 10;
        console.log(`results per page: ${resultsPerFullPage}`);

        let maxPages = Math.floor(charCount / resultsPerFullPage) + 1;
        console.log(`max pages: ${maxPages}`);

        let currentPageNumber = 1;
        let characterList = [];
        let currentPageUrl = "";
        do {
            this.timeout(timeoutInMs * maxPages);
            currentPageUrl = `${swapiUrl}/people/?page=${currentPageNumber}`
            const response = await axios.get(currentPageUrl);
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

    // // Test Case 2: Retrieve details for a specific Star Wars character
    // it('should retrieve details for a specific Star Wars character',
    // async function () {
    //     const characterName = "Luke Skywalker";
    //     // TODO: Implement the remainder of this test case
    // });
        
    // // Test Case 3: Retrieve a list of all Star Wars films
    // it('should retrieve a list of all Star Wars films', 
    // async function () {
    //     // TODO: Implement the test case
    // });
        
    // // Test Case 4: Retrieve details for a specific Star Wars film
    // it('should retrieve details for a specific Star Wars film', 
    // async function () {
    //     // TODO: Implement the test case
    // });
});

