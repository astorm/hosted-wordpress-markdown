#!/bin/bash

nodelint --config src/js/config.js src/js/*.js
nodelint --config src/js/config.js src/inject-preprocessed.js