#!/bin/bash

if ! screen -ls | grep -q "triviabot"
then
	echo "not running"
	screen -dmS triviabot
	screen -S triviabot -X stuff 'node main.js\n'
	screen -r triviabot
else
	echo "running"
	screen -r triviabot
fi
