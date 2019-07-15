const {Builder, By, Key, until} = require('selenium-webdriver');
let driver = new Builder().forBrowser('chrome').build();
async function clickLoadBack(button){
    await button.click();
    // await driver.navigate().back();
}
async function example() {
    try {
        let time = new Date();
        driver.get('https://nova.dev.aetalon.tech');
        let elem = await driver.wait(until.elementLocated(By.className('py-0')));
        await elem.click();
        let inputForm = await driver.wait(until.elementLocated(By.className('form-control')));
        inputForm = await driver.findElements(By.className('form-control'));
        await inputForm[0].sendKeys('Viktor');
        await inputForm[1].sendKeys('7188387q');
        let submitButton = await driver.findElement(By.className('btn-warning')).click();
        let navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/events']")));
        await clickLoadBack(navigationItem);
        navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/persons']")));
        await clickLoadBack(navigationItem);
        navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/devices']")));
        await clickLoadBack(navigationItem);
        navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/admin/measurements/lab-form']")));
        await clickLoadBack(navigationItem);
        navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/tags']")));
        await clickLoadBack(navigationItem);
        navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/test-tags']")));
        await clickLoadBack(navigationItem);
        // let elem2 = await driver.wait(until.titleIs('nova'));
        let resultTime = new Date() - time;
        console.log("loading all tabs complete in " + resultTime + " ms");
        await driver.quit();

    } catch (err) {
        console.log('something is wrong: ' + err.toString());
    }
}
for (var i = 0; i < 1; i++) {
    try {
        example();
    }
    catch(err) {
        console.log('something is wrong: ' + err.toString());
    }
}