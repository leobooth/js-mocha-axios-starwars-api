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

    // Test Case 2: Retrieve details for a specific Star Wars character
    it('should retrieve details for a specific Star Wars character',
    async function () {
        const characterName = "Luke Skywalker";
        let characterDetails = {};

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

        let characterList = [];

        try {
            this.timeout(timeoutInMs * maxPages);

            let currentPageNumber = 1;
            let currentPageUrl = "";
            let characterFound = false;
            do {
                currentPageUrl = `${swapiUrl}/people/?page=${currentPageNumber}`;
                const response = await axios.get(currentPageUrl);
                assert.strictEqual(response.status, 200, 'Unexpected status code');

                console.log("currentPageUrl: " + currentPageUrl);
    
                characterList = response.data.results;

                for (let character in characterList) {
                    if(characterList[character].name === characterName) {
                        characterDetails = characterList[character];
                        console.log(`found ${characterDetails.name}`);
                        console.log(characterDetails);
                        characterFound = true;
                        break;
                    }
                }

                currentPageNumber++;
            } while (response.data.next !== null && currentPageNumber <= maxPages && !characterFound);
        } catch (error) {
            console.log(error);
        }

        assert.equal(characterName, characterDetails.name);
    });
});
