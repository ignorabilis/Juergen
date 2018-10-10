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


## Networking
You need to make sure that your phone and dev machine are on the same wifi network.

Additionally you should use interface metric instead of automatic for your internet connection.
To do so:
`Control Panel -> Network and Internet -> Network and Sharing Center -> {select primary connection}`,
then
`Properties -> select TCP/IPv4 -> Properties -> Advanced -> uncheck 'Automatic metric' -> set 10 for 'Interface metric'`.
Do the same thing for your secondary connection, but with a higher value (say 20);
