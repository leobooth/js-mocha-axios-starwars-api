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

        try {
            this.timeout(timeoutInMs * maxPages);

            do {
                currentPageUrl = `${swapiUrl}/people/?page=${currentPageNumber}`;
                const response = await axios.get(currentPageUrl);
                assert.strictEqual(response.status, 200, 'Unexpected status code');

                console.log("currentPageUrl: " + currentPageUrl);
    
                characterList = characterList.concat(response.data.results);
                currentPageNumber++;
            } while (response.data.next !== null && currentPageNumber <= maxPages);
        } catch (error) {
            console.log(error);
        }

        console.log(`characterList length: ${characterList.length}`);
        console.log("the character list contains the following characters: " );
        for (let character in characterList) {
            console.log(characterList[character].name);
        }

        assert.equal(charCount, characterList.length);
    });
});
