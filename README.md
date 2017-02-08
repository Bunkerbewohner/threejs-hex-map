# threejs-hex-map

[![Build Status](https://travis-ci.org/Bunkerbewohner/threejs-hex-map.svg?branch=master)](https://travis-ci.org/Bunkerbewohner/threejs-hex-map)

A simple 3D hexagonal terrain map based on three.js.
 
![Screenshot](examples/random/screenshot.jpg)

## Overview

* hexagonal tiles with water, flat land, hills, mountains, rivers, trees and coast
* one texture atlas each for terrain textures, river tiles, and coast tiles
* blending mask texture for transitions between tiles
* two-tier fog of war like in Civilization

## Usage

For an example check out the code in `examples/random`. To test it in the browser
simply `npm start` and open `http://localhost:3000/examples/random/`.