#!/usr/bin/env bash

echo "Updating HTTP/2 Push Headers..."
pushFiles=("index.css" "index.js")
headerString='Link "</fonts/share-v10-latin-700.woff2>;rel=preload;as=font;crossorigin'

for i in "${pushFiles[@]}"
do
    :
    fileName=$(cat ./themes/iamschulz-hugo-theme/data/assetManifest.json | jq "[. | to_entries[] | select(.key | startswith(\""$i"\")) | .value][0]") # read value from manifest
    fileName=$(sed "s/\"//g" <<< "$fileName") # sanitize doublequotes
    fileExt="${fileName##*.}"
    headerString="${headerString},</$fileName>;rel=preload"

    # add "as" attribute
    if [ "$fileExt" == "js" ];
    then
        headerString="${headerString};as=script"
    fi
    if [ "$fileExt" == "css" ];
    then
        headerString="${headerString};as=style"
    fi
done

# add closing doublequote
headerString="${headerString}\""

# check if we're on host
if ! command -v uberspace web header list &> /dev/null
then
    echo "uberspace web headers not found on this system. Sure you're on uberspace?"
    exit
fi

# ENGAGE!
uberspace web header suppress iamschulz.com/js Link
uberspace web header set iamschulz.com/ ${headerString}
