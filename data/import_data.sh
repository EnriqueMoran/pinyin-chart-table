#!/bin/bash

docker cp $1 mongo_app_pinyin:/data/db/
docker exec mongo_app_pinyin mongoimport --db pinyintable --collection pinyin --drop -u admin -p n5QXBTA6RYWmvZq7 --authenticationDatabase admin --file /data/db/$1

