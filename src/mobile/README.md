# React Native

Instructions to get a dev environment working via the Expo CLI on desktop, and Expo APP on Phone.

I have no clue how to integrate testing yet.  For our future reference, here are links for [Unit Testing](https://jestjs.io/docs/en/tutorial-react-native) and [E2E Testing](https://medium.com/@reime005/react-native-end-to-end-testing-d488e010e39f).

## Installing the Dev Setup

I first installed the latest version of nvm to manage node versions.

```sh
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
$ # or
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

Then install the latest node version:

```sh
$ nvm install node --reinstall-packages-from=node
```

The [expo cli](https://github.com/creationix/nvm#installation)

```sh
$ npm install -g expo-cli
```

And the Expo App for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&rdid=host.exp.exponent), or [IPhone](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8).

Setup complete!

To start the dev environment,

```sh
$ expo start
```

You should get a screen like this:
![image](https://www.dropbox.com/s/jo14du3iw8wb0xe/Screenshot%202019-02-19%2019.47.21.png?raw=1)

If not, try the [expo getting started page](https://facebook.github.io/react-native/docs/getting-started).

Once you see that screen, open Expo on your phone, scan the QR code, and you should see this.

![image](https://d33wubrfki0l68.cloudfront.net/14c8d3b0f0abfb9197912ed34139da539fe3fdc2/4a976/images/react/expo-intro/first-expo-app.png)

And you're in business!
