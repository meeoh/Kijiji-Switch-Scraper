require("dotenv").config();

var kijiji = require("kijiji-scraper");
var moment = require("moment");
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: false });
const chatId = process.env.CHAT_ID;

var LOCATIONS = {
    kitchener: 1700209,
    guelph: 1700242,
    toronto: 1700272
};

var params = {
    minPrice: 300,
    maxPrice: 500,
    keywords: "nintendo+switch",
    adType: "OFFER"
};

var delay = 1800000

function getData() {
    var finished = 0;
    var locationKeys = Object.keys(LOCATIONS);

    locationKeys.forEach(currentLocation => {
        var prefs = {
            categoryId: 625,
            locationId: LOCATIONS[currentLocation]
        };

        console.log("Querying", currentLocation);

        kijiji.query(prefs, params, (err, ads) => {
            if (err) {
                console.log("Error getting add: ", err);
                return;
            }

            finished += 1;

            var todaysDate = moment();
            ads.forEach(ad => {
                var timeDifference = moment
                    .duration(todaysDate.diff(moment(ad.pubDate)))
                    .asMinutes();
                if (timeDifference < 10) {
                    var message = `Picked up an ad that was posted at ${moment(
                        ad.pubDate
                    ).format(
                        "MMMM Do h:mm:ss a"
                    )} (${timeDifference} minutes ago) in ${currentLocation}.\nThe ads title is: ${
                        ad.title
                    } and its price is: ${ad.innerAd.info.Price}.\n${ad.link}`;
                    bot.sendMessage(chatId, message);
                }
            });
            console.log(`Done scraping for ${currentLocation}`);
            if (finished == locationKeys.length) {
                console.log(
                    "Done scraping for all cities, sleeping for 10 mins"
                );
                setTimeout(getData, delay);
            }
        });
    });
}

getData();
