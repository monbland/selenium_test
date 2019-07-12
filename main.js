// var webdriver = require('selenium-webdriver');
// var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'safari'}).build();
// browser.get('https://nova.dev.aetalon.tech');
// browser.quit();
const {Builder, By, Key, until} = require('selenium-webdriver');
async function browse() {
    let driver = new Builder().forBrowser('chrome').build();
    // driver.manage().setTimeouts(10000);
    try {
        driver.get('https://nova.dev.aetalon.tech');
        let elements = driver.wait(
            until.elementsLocated(By.tagName('div')),
            20000
            );
        // await elements;
        let element = driver.getTitle();
        console.log(element);
    }
    catch(err) {
        console.log('something going wrong: \n' + err.toString());
    }
};
browse();