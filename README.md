# oauth_service


## Overview
An expressJS + passport oauth proxy to quickly get setup with various OAuth providers. As of now, 
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

## Flow
From your client, direct user to 

```http://<domain>.<tld>/auth/<provider>?clientRedirectUrl=<your redirect url>```

This will step the user through the steps and return to `clientRedirectUrl` the following structure:

```
<clientRedirectUrl>?provider=<provider>&id=<id>&firstName=<firstName>&lastName=<lastName>&email=<email>
```

In the case one of these fields is not found, it will return ```None```

You can now parse the query params and do with them as you wish.

## Implemented Providers
1. facebook: Works
2. twitter: Works
3. github: Pending

## Deployment
Follow along the helpful steps in this Digital Ocean Walkthrough [link](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04)
