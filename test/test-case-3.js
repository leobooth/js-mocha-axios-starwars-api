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

describe('Star Wars API Test Case 3', function () {

    // Test Case 3: Retrieve a list of all Star Wars films
    it ('should retrieve a list of all Star Wars films', 
    async function () {
        let timeoutInMs = 15000;
        this.timeout(timeoutInMs);
        
        let currentPageUrl = `${swapiUrl}/films/`;
        const response = await axios.get(currentPageUrl);
        assert.strictEqual(response.status, 200, 'Unexpected status code');
        console.log("currentPageUrl: " + currentPageUrl);
        
        const filmCount = response.data.count;
        console.log(`film count from API: ${filmCount}`);

        let filmList = response.data.results;

        console.log(`filmList length: ${filmList.length}`);
        console.log("the film list contains the following films: " );
        for (let film in filmList) {
            console.log(filmList[film].title);
        }

        assert.equal(filmCount, filmList.length);
    });
});
