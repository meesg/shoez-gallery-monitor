// Import dependencies
const config = require('./config');
const request = require('request');
const cheerio = require('cheerio');
const Discord = require('discord.js');
const chalk = require('chalk');
const twilio = require('twilio')(config.twilioSid, config.twilioToken);

// Set up program constants
const log = console.log;
const discordHook = new Discord.WebhookClient(config.discordHookId, config.discordHookToken);

// Set up program variables
let running = false;
let oldShoe;
let interval;

function start() {
    request(config.url, {timeout: config.timeout}, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(body);

            oldShoe = $('span[itemprop="name"]').first().text();
            interval = setInterval(checkForChange, config.retryDelay);
            running = true;

            log(chalk.blue(`Started with: ${oldShoe}`));
            discordHook.send("I'm online");
        } 
        else {
            start();
            failedRequest(error, response);
        }
    });
}

function stop() {
    clearInterval(interval);
    running = false;
}

function checkForChange() {
    if(!running) {
        log(chalk.red(`ERROR | Start the program before running checkForChange().`));
        return;
    }

    log(chalk.grey(`Checking.`));

    request(config.url, {timeout: config.timeout}, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(body);
            currentShoe = $('span[itemprop="name"]').first().text();
        
            if(oldShoe !== currentShoe) {
                discordHook.send(`NEW SHOE FOUND | Name : ${currentShoe}.`);
                discordHook.send($('span[itemprop="name"]').first().closest("div").html());
                callMobilePhone();
				
				oldShoe = $('span[itemprop="name"]').first().text();
				
                log(chalk.green(`NEW SHOE FOUND | Name : ${currentShoe}.`));
            } 
            else {
                log(chalk.grey(`Nothing new.`));
            }
        }
        else {
            failedRequest(error, response);
        }
    });
}

function callMobilePhone() {
    twilio.calls.create({
        url: config.twilioUrl,
        to: config.twilioTo,
        from: config.twilioFrom
    }, function(err, call) {
        if(err) {
            log(chalk.red(`ERROR | ${err}`));
        } else {
            log(chalk.green(`Calling.`));
        }
    });
}

function failedRequest(error, response) {
    if(error) {
        log(chalk.red(`ERROR | Failed request. ${error}.`));
    } 
    else if (response.statusCode) {
        log(chalk.red(`ERROR | Failed request. Statuscode: ${response.statusCode}`));
    }
}

start();
