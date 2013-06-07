#!/bin/bash

nodelint --config config/config.js src/js/*.js
nodelint --config config/config.js src/inject-preprocessed.js