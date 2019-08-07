const {Builder, By, Key, until, Select} = require('selenium-webdriver');

async function clickByXPath(xpath,driver) {
    let button = await driver.wait(until.elementLocated(By.xpath(xpath)),2000);
    button = await driver.findElement(By.xpath(xpath));
    await button.click();
}

async function getAllAnchors(driver) {
    let anchors = await driver.findElements(By.xpath("//a"));
    let title = await driver.getTitle();
    for (let i = 10; i < anchors.length; i++) {
        await driver.wait(until.elementIsEnabled(anchors[i]),2000);
        await anchors[i].click();
        let newTitle = await driver.getTitle();
        await console.log(anchors.length);
        if (title != newTitle) {
            await getAllAnchors(driver);
            await driver.navigate().back();
        }
    }
}

async function test1() {
    //initialisation of webdriver
    let driver = new Builder().forBrowser('chrome').build();
    await driver.get("https://nova.dev.aetalon.tech/");
    getAllAnchors(driver);
    setTimeout(
        () => {
            driver.quit();
        },
        10000);
}

test1().then(
    function() {console.log("succ")},
    function(err) {console.error(err)}
).catch(function(err) {
    console.error(err);
});