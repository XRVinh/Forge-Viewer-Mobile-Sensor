var express =require ('express') ;
var fs =require ('fs') ;
var path =require ('path') ;
var router =express.Router () ;
var ForgeSDK = require('forge-apis');

var CLIENT_ID = 'xTypOF4teSh2iOMbjXIGQdaI8zrE2O7H' , CLIENT_SECRET = 'GfM7jRnB7jKlFJPk';

//LMV workflow
router.get ('/gettoken', function (req, res) {

    // Initialize the 2-legged OAuth 2.0 client, and optionally set specific scopes.
    // If you omit scopes, the generated token will have all scope permissions.
    var oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(CLIENT_ID, CLIENT_SECRET, [
        'data:read',
        'data:write'
    ]);

    oAuth2TwoLegged.authenticate().then(function(credentials){
        // The `credentials` object contains an access_token that you use to call the endpoints.
        // You can set the credentials globally on the OAuth client and retrieve them later on.
        oAuth2TwoLegged.setCredentials(credentials);
        console.log(credentials.access_token);
        res.send (credentials) ;
    }, function(err){
        console.error(err);
    });
});

module.exports =router ;
