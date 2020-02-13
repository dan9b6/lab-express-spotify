require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/artist-search', function(req, res) {
  //This will get the information of the query the user did in '/'
  let userQuery = req.query.term;

  //This will do a request to the spotifyApi
  spotifyApi
    //The request in this case is an artist search
    .searchArtists(userQuery)
    .then(result => {
      // console.log('here', result.body.artists.items[0].images);
      const data = { artistList: result.body.artists.items };
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', data);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', function(req, res, next) {
  let id = req.params.id;
  spotifyApi
    .getArtistAlbums(id)
    .then(result => {
      // console.log('here', result.body.items.name);
      const data = { artistList: result.body.items };
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-albums', data);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/album-tracks/:id', function(req, res, next) {
  let id = req.params.id;
  console.log(id);
  spotifyApi
    .getAlbumTracks(id)
    .then(result => {
      console.log('here', result.body.items);
      const data = { artistList: result.body.items };
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // res.render('artist-albums', data);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
