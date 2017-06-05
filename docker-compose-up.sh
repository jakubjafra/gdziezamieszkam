#!/usr/bin/env bash

cd app
meteor build --architecture=os.linux.x86_64 ../.build --directory
cd ..