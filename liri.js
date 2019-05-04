require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

//concert-this: name of venue, venue location, date of event (MM/DD/YYYY)
//`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`
node liri.js concert-this <artist/band name here>

//spotify-this-song: artist(s), the song's name, a preview link of the song from spotify, the album that the song is from
//default song is "The Sign" by Ace of Base
//https://www.npmjs.com/package/node-spotify-api
node liri.js spotify-this-song '<song name here>'

//movie-this: title of movie, year the movie came out, IMDB  rating of the movie, Rotten Tomatoes Rating of the movie, country where the movie was produced, language of the movie, plot of the movie, actors in the movie
//default movie is "Mr. Nobody", <http://www.imdb.com/title/tt0485947/>, "It's on Netflix!"
//axios
//the OMDB API requires an API key. You may use `trilogy`
node liri.js movie-this '<movie name here>'

//do-what-it-says: should run spotify-this-song and concert-this
//fs node package
node liri.js do-what-it-says