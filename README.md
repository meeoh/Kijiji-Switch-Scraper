# Kijiji-Switch-Scraper

## Description
Scrapes kijiji using `kijijiji-scraper` then messages to your desginated telegram `CHAT_ID` if theres an ad in the last 10 minutes that is related to a nintendo switch (and meets the params). Then it waits 10 minutes to prevent spam.

## Installation
`npm i`

Create a .env file with keys `TELEGRAM_TOKEN` and `CHAT_ID`

## Usage
`node main.js`
