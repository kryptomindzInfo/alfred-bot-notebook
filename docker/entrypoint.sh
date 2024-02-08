#!/bin/bash

set -eo pipefail

function callback(){
  OUTPUT=`curl -sLX POST -H "Content-Type: application/json" -d "{\"id\": \"$HOSTNAME\"}" "http://20.193.133.6:3000/api/docker/error"`
  echo $OUTPUT
  [[ `echo $OUTPUT | jq -r .response.success` == true ]] && echo Sent state to callback URL. || echo Failed to send state to callback URL.
}

trap callback ERR

python /opt/notebooks/Art-ChatGPT-FinRL-Bot.py
