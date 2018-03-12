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

function getData() {
    Object.keys(LOCATIONS).forEach(currentLocation => {
        var prefs = {
            categoryId: 625,
            locationId: LOCATIONS[currentLocation]
        };

        kijiji.query(prefs, params, (err, ads) => {
            if (err) {
                console.warn("Error getting add: ", err);
                return;
            }

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
        });
    });
    setTimeout(getData, 600000);
}

getData();
