#!/usr/bin/env bash

echo "Updating HTTP/2 Push Headers..."
pushFiles=("index.css" "index.js")
headerString='Header set Link "</fonts/share-v10-latin-700.woff2>;rel=preload;as=font;crossorigin'
htaccessFile='public/.htaccess'
regex='## HTTP2 Push Placeholder'

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

# ENGAGE!
sed -i "s|$regex|$headerString|gm" ${htaccessFile}

echo "Done."