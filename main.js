// var webdriver = require('selenium-webdriver');
// var browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'safari'}).build();
// browser.get('https://nova.dev.aetalon.tech');
// browser.quit();
const {Builder, By, Key, until} = require('selenium-webdriver');
function browse() {
    let driver = new Builder().forBrowser('chrome').build();
    // driver.manage().setTimeouts(10000);
    try {
        driver.get('https://nova.dev.aetalon.tech');
        let elements = driver.wait(
            until.elementLocated(By.className('my-0')),
            20000
            );
        // await elements;
        var element = driver.getTitle();
        console.log(elements.getId());
        driver.sleep(5000);
        driver.quit();
    }
    catch(err) {
        console.log('something going wrong: \n' + err.toString());
    }
};
browse();