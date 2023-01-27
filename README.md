# Game Hosting Framework (GHF)

## Objective
Create a simple web game hosting framework that allows others to host game instances within iframes on their own websites.

## Description

### example-client
This is an example web page that someone may create and use to host a GHF game instance. Key responsibilities include:
- Creating an iframe to show the game instance
- Requesting an **accessKey** from the game-server and passing along game config data at the same time
- On receipt of a valid **accessKey**, starting up the game instance within its hosted iframe

### game-build-ts
This is the typescript barebones phaser game application. Only use this directory during development. On build, a javascript version of this application is created within the **game-server** that is sent to host clients on request. Key responsibilities:
- Test environment for a game that can be iterated on quickly

### game-server
The core server that looks after creation of game rooms (using colyseus) and manages **accessKey** requests. Features a sub-directory called **game-build-js** which is publicly available for calling HOWEVER, a valid accessKey will be required to run any games. Key responsbiilities:
- Create and manage colyseus rooms
- Create and manage accessKey lists
- Run game logic in a server authorative manner