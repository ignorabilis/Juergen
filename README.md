# Juergen

A camera for taking series of photos very fast

## Running the project
To run the project use either npm or yarn to install the packages; 
however do not use `npm start` or `yarn start` as after installing a package
this messes up the node_modules folder. So use this instead:
```bash
    npm i
    expo start
```
## Timing
The timing issue seems to be relevant only for a presumably cluttered (android) phone; 
on another device this works flawlessly.
The timing of `setInterval` does not seem to be very good. On my phone `this.shoot` is async and takes less than 2ms to fire.
Then `setInterval` is invoked, but the first invokation of `this.shoot` happens after ~1.5s + interval;
each subsequent shot is taken accurately.
The timing of `setTimeout` seems to be even worse, as for each invokation ~1.5s are added.
Some info can be found here - https://stackoverflow.com/questions/42100658/accuracy-of-settimeout-in-react-native

## Flash
`Camera.Constants.FlashMode.on` & `Camera.Constants.FlashMode.auto` are not able to keep up when rapidly taking shots.
This makes the photos blurry or very differently lit or both. In order to be consistent `Camera.Constants.FlashMode.torch`
is used instead (only when actually taking shots) - the resulting photos are uniformly lit and do not have inferior
quality.

## Performance
If the camera cannot keep up `takePictureAsync` is invoked (???), but the promise is neither resolved nor rejected.
Note that an attempt is still made - the flash might be turned on a few more times.
`takePictureAsync` won't be resolved/rejected if the `Camera` is unmounted.
`takePictureAsync` won't be resolved/rejected if the `Camera` is not visible.
The code tries to ensure that the `Camera` is visible long enough so that all `takePictureAsync` invocations are resolved.
The `Camera` is delibarately not unmounted to ensure that `takePictureAsync` is resolved/rejected.
It seems that `takePictureAsync` can be unresolved for a variety of reasons: 
- https://github.com/react-native-community/react-native-camera/issues/1311
- https://github.com/react-native-community/react-native-camera/issues/1373

## Reloading the app
Note that hot reloading does not work particularly well with the camera - the app does not get reloaded; use live reload instead.
This is one of the cases which the React Native docs mention - https://facebook.github.io/react-native/docs/debugging#automatic-reloading.

## Networking
You need to make sure that your phone and dev machine are on the same wifi network.

Additionally you should use interface metric instead of automatic for your internet connection.
To do so:
`Control Panel -> Network and Internet -> Network and Sharing Center -> {select primary connection}`,
then
`Properties -> select TCP/IPv4 -> Properties -> Advanced -> uncheck 'Automatic metric' -> set 10 for 'Interface metric'`.
Do the same thing for your secondary connection, but with a higher value (say 20);
