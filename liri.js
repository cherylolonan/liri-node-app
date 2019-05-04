require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');

var command = process.argv[2];
var searchValue = "";

// Puts together the search value into one string
for (var i = 3; i < process.argv.length; i++) {
    searchValue += process.argv[i] + " ";
};

// Error Functions 
function errorFunction(respError) {
    if (respError) {
        return console.log("An error occured: ", respError);
     }
};


//concert-this: name of venue, venue location, date of event (MM/DD/YYYY)
//`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`
//node liri.js concert-this <artist/band name here>

function searchConcert(searchValue) {
    if (searchValue == "") {
        searchValue = "Bruno Mars";
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + searchValue + "/events?app_id=codingbootcamp";

    request(queryUrl, function(respError, response, body) {

        errorFunction();

        if (JSON.parse(body).Error == 'Concert Information not found!' ) {

            console.log("\nThe artist " + searchValue + " could not be found. Please check your spelling and try again.\n")
        
        } else {

            concertBody = JSON.parse(body);

            console.log("\n++++ BandsInTown Search Results ++++\n");
            console.log("Name of Venue: " + concertBody.venue);
            console.log("Venue Location: " + concertBody.location);
            console.log("Date of Event: " + concertBody.dateOfEvent);

            }
        });      
    };


//spotify-this-song: artist(s), the song's name, a preview link of the song from spotify, the album that the song is from
//default song is "The Sign" by Ace of Base
//https://www.npmjs.com/package/node-spotify-api
//node liri.js spotify-this-song '<song name here>'

function searchSong(searchValue) {

    // Default search value if no song is given
    if (searchValue == "") {
        searchValue = "The Sign Ace of Base";
    }

    // Accesses Spotify keys  
    var spotify = new Spotify(keys.spotify);

    var searchLimit = "";

    // Allows the user to input the number of returned spotify results, defaults 1 return if no input given
    if (isNaN(parseInt(process.argv[3])) == false) {
        searchLimit = process.argv[3];

        console.log("\nYou requested: " + searchLimit + " songs");
        
        // Resets the searchValue to account for searchLimit
        searchValue = "";
        for (var i = 4; i < process.argv.length; i++) {        
            searchValue += process.argv[i] + " ";
        };

    } else {
        console.log("\nFor more than 1 result, add the number of results you would like after spotify-this-song.\n\nHere is an example requesting 3 results:\n     node.js spotify-this-song 3 The Sign")
        searchLimit = 1;
    }
   
    // Searches Spotify with given values
    spotify.search({ type: 'track', query: searchValue, limit: searchLimit }, function(respError, response) {

        errorFunction();

        var songResp = response.tracks.items;

        for (var i = 0; i < songResp.length; i++) {
            console.log("\n==== Spotify Search Result "+ (i+1) +" ====\n");
            console.log(("Artist: " + songResp[i].artists[0].name));
            console.log(("Song title: " + songResp[i].name));
            console.log(("Album name: " + songResp[i].album.name));
            console.log(("URL Preview: " + songResp[i].preview_url));
            console.log("\n========\n");
        }
    })
};

//movie-this: title of movie, year the movie came out, IMDB  rating of the movie, Rotten Tomatoes Rating of the movie, country where the movie was produced, language of the movie, plot of the movie, actors in the movie
//default movie is "Mr. Nobody"
//axios - the OMDB API requires an API key. You may use `trilogy`
//node liri.js movie-this '<movie name here>'

function searchMovie(searchValue) {
    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(respError, response, body) {

        errorFunction();

        if (JSON.parse(body).Error == 'Movie not found!' ) {

            console.log("\nI'm sorry, no movies of the title " + searchValue + " could be found. Please check your spelling and try again.\n")
        
        } else {

            movieBody = JSON.parse(body);

            console.log("\n++++ OMDB Search Results +++++\n");
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

            // If there is no Rotten Tomatoes Rating
            if (movieBody.Ratings.length < 2) {

                console.log("There is no Rotten Tomatoes Rating for this movie.")
                
            } else {

                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);

            }
            
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
            console.log("\n+++++++++\n");
            console.log("xxxx Log Ended xxxx");
        };      
    });
};


//do-what-it-says: should run spotify-this-song and concert-this
//fs node package
//node liri.js do-what-it-says
function randomSearch() {

    fs.readFile("random.txt", "utf8", function(respError, data) {

        var randomArray = data.split(", ");

        errorFunction();

        if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } else {
            searchConcert();
        }
    });
};



// Runs corresponding function based on user command
switch (command) {
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomSearch();
        break;
        case "concert-this":
        searchConcert(searchValue);
        break;    
};