# Shoezgallery-monitor

Checks shoezgallery for new shoes, notifies you by calling via twilio and sending a message via a discord hook. Made for the yeezy 350 boost black shock drop.  
  
Very dependent on current DOM, so any changes to the monitored webpage could break this monitor. 

## Installation

1. Install [Node.JS](https://nodejs.org/en/download/).
2. Download or clone the repository.
3. Open a shell in the folder.
4. Run `npm install` to download the dependencies.
5. Set up the `config.json` file.
6. Run `npm start` to start the monitor.

## Configuration settings
`twilioSid`: Your twilio account SID.  
`twilioToken`: Your twilio auth token.  
`twilioUrl`: The URL to your TwiML intructions.   
`twilioTo`: Your own phone number.  
`twilioFrom`: Twilio phone number.  
`discordHookId`: The number in your discord hook url.  
`discordHookToken`: The character string in your discord hook url.  
`url`: The webpage to be monitored. Usually the standard should be fine.  
`retryDelay`: Delay between each request in milliseconds.  
`timeout`: Milliseconds before each request should timeout.

## Todo
- [ ] Instead of just dumping the raw HTML from the div in which the new sneaker resides, search for the link and picture. 
- [ ] Make twilio optional.
- [ ] Make discord optional.