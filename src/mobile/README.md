# Mobile

NOTE: MOBILE UNUSED EXCEPT FOR `assets/sample_data`

Instructions for setting up, testing, and developing on React Native, our cross-platform mobile environment.

## Setting up the Mobile Environment (prerequisite for development and tests)

```
./setup.sh # from the project root directory, not src/mobile
```

## Running Tests
To run tests:
```
.build.py test mobile
```

## Running the dev environment (on your phone)

Assuming everything is installed for running tests, install the Expo App for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&rdid=host.exp.exponent), or [IPhone](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8).

To start the dev environment,

```sh
$ cd src/mobile
$ expo start
```

You should get a screen like this:
![image](https://www.dropbox.com/s/jo14du3iw8wb0xe/Screenshot%202019-02-19%2019.47.21.png?raw=1)

If not, try the [expo getting started page](https://facebook.github.io/react-native/docs/getting-started).

Once you see that screen, open Expo on your phone, scan the QR code, and you should see this.

![image](https://d33wubrfki0l68.cloudfront.net/14c8d3b0f0abfb9197912ed34139da539fe3fdc2/4a976/images/react/expo-intro/first-expo-app.png)

And you're in business!

## Running the dev environment on your desktop
[Instructions here](https://docs.expo.io/versions/v32.0.0/introduction/installation/)
