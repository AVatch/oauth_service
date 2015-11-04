# oauth_service


## Overview
An expressJS + passport oath proxy to quickly get setup with various OAuth providers. As of now, 
this node application simply guides a person through a provider's oauth flow and then redirects
the user back to a client url with the users basic information as url query params.

## Installation
```
$ npm install
$ node app.js
```

## Dependencies
You will need a ```credentials.js``` file
```
var credentials = {
    'CONSUMER_KEY' : {
      'twitter': 'TWITTER_KEY',
      'facebook': 'FACEBOOK_KEY',
      'github': 'GITHUB_KEY'
    },
    'CONSUMER_SECRET' : {
      'twitter': 'TWITTER_SECRET',
      'facebook': 'FACEBOOK_SECRET',
      'github': 'GITHUB_SECRET'
    }
};

module.exports = credentials;
```

You will also need to update ```config.js``` with the applications domain. This is used
in constructing the callback urls for the oauth providers.

## Implemented Providers
1. facebook: Works
2. twitter: Works
3. github: Pending
