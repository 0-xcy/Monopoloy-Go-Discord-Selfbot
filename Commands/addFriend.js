const puppeteer = require('puppeteer');
const { facebooklogin, facebookpass } = require('../config.json');
const cookies = require('../facebookCookies.json');
const fs = require('fs').promises;
var clc = require("cli-color");

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function addFriend(targetLink) {
    const browser = await puppeteer.launch( { headless: 'new' } );
    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto('https://www.facebook.com')
    const isLoggedIn = await page.$('#email')
    if (isLoggedIn != null) {
        console.log('Cookies Expired. Logging in...')
        await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle0' });
        const inputValue = await page.$eval('#email', el => el.value);
        await page.click('#email');
        for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace');
        }
        await page.click('#email');
        await page.keyboard.type(facebooklogin, { delay: 100 });
        await page.keyboard.press('Tab');
        await page.keyboard.type(facebookpass, { delay: 100 });
        await page.keyboard.press('Enter');
        await page.waitForNavigation();
        const cookies = await page.cookies();
        await fs.writeFile('./facebookCookies.json', JSON.stringify(cookies, null, 2));
        console.log('Cookies updated. Continuing...')
    } else {
        console.log('Cookies session valid. Continuing...')
    }
    try {
        await page.goto(targetLink, { waitUntil: 'networkidle0' });
        await page.click('div[aria-label="Add friend"]');
        await sleep(3000)
        const confirmPopup = await page.$('div[aria-label="Cancel"]')
        if (confirmPopup != null) {
            console.log('Popup found. Confirming...')
            await page.keyboard.press('Tab');
            await page.keyboard.press('Enter');
        } else {
            console.log('Popup not found. Continuing...')
        }
        await sleep(3000)
        console.log(clc.green.bold('Friend Request Successfully Sent! Closing browser...'));
        // await browser.close();
      } catch (err) {
        console.log(clc.red.bold('Something went wrong. Closing browser...'));
        console.log(err);
        // await browser.close();
      }
}

module.exports = addFriend;