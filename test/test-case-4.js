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

describe('Star Wars API Test Case 4', function () {

    // Test Case 4: Retrieve details for a specific Star Wars film
    it ('should retrieve details for a specific Star Wars film', 
    async function () {
        const filmTitle = "Return of the Jedi";
        let filmDetails = {};

        let timeoutInMs = 10000;
        this.timeout(timeoutInMs);

        let currentPageUrl = `${swapiUrl}/films/`;
        const response = await axios.get(currentPageUrl);
        assert.strictEqual(response.status, 200, 'Unexpected status code');
        console.log("currentPageUrl: " + currentPageUrl);
        
        const filmCount = response.data.count;
        console.log(`film count from API: ${filmCount}`);

        let filmList = response.data.results;

        for (let film in filmList) {
            if(filmList[film].title === filmTitle) {
                filmDetails = filmList[film];
                console.log(`found ${filmDetails.title}`);
                console.log(filmDetails);
                break;
            }
        }

        assert.equal(filmTitle, filmDetails.title);
    });
});
