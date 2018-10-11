# FSCamera

A camera for taking series of photos very fast

## Running the project
To run the project use either npm or yarn to install the packages; 
however do not use `npm start` or `yarn start` as after installing a package
this messes up the node_modules folder. So use this instead:
```bash
    npm i
    expo start
```

Another solution would be (if using npm/yarn):
- Navigate to node_modules > .bin of the codebase
- Find expo and expo.cmd in that directory
- Rename it to anything.
- Start the project normally.

## Timing
The timing of `setInterval` does not seem to be very good. On my phone `this.shoot` is async and takes less than 2ms to fire.
Then `setInterval` is invoked, but the first invokation of `this.shoot` happens after ~1.5s + interval;
each subsequent shot is taken accurately.

The timing of `setTimeout` seems to be even worse, as for each invokation ~1.5s are added.
Some info can be found here - https://stackoverflow.com/questions/42100658/accuracy-of-settimeout-in-react-native

## Performance
If the camera cannot keep up `takePictureAsync` is simply not invoked - the promise is neither resolved nor rejected.
Note that an attempt is still made - the flash might be turned on a few more times.

## Reloading the app
Note that hot reloading does not work particularly well with the camera - the app does not get reloaded; use live reload instead.


## Networking
You need to make sure that your phone and dev machine are on the same wifi network.

Additionally you should use interface metric instead of automatic for your internet connection.
To do so:
`Control Panel -> Network and Internet -> Network and Sharing Center -> {select primary connection}`,
then
`Properties -> select TCP/IPv4 -> Properties -> Advanced -> uncheck 'Automatic metric' -> set 10 for 'Interface metric'`.
Do the same thing for your secondary connection, but with a higher value (say 20);
