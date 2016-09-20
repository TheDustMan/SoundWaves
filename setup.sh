#!/usr/bin/env bash

npm install
pushd scripts
./workspace_fixup.sh
popd