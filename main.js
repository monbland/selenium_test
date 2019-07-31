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
        let loginFormLoad = new Date() - time;
        inputForm = await driver.findElements(By.className('form-control'));
        await inputForm[0].sendKeys('Viktor');
        await inputForm[1].sendKeys('7188387q');
        let submitButton = await driver.findElement(By.className('btn-warning')).click();

        let navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/persons']")));
        let loginCompleteTime = new Date() - time;
        await clickLoadBack(navigationItem);

        navigationItem = await driver.wait(until.elementsLocated(By.xpath("//div[@class='content']/div/div/div[1]/div[1]/div/div/p[1]")));
        await setTimeout(() => {
            let personsCount = driver.findElement(By.xpath("//div[@class='content']/div/div/div[1]/div[1]/div/div/p[1]"));
            personsCount.getText().then(
                result => {
                    console.log(result.toString())
                },
                error => {
                    console.log(error.message)
                }
            )
        }, 2000);
        // navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/health']")));
        // let personsLoad = new Date() - time;
        // await clickLoadBack(navigationItem);
        //
        // navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/activity']")));
        // let healthLoad = new Date() - time;
        // await clickLoadBack(navigationItem);
        //
        // navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/events']")));
        // let activityLoad = new Date() - time;
        // await clickLoadBack(navigationItem);
        //
        // navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/devices']")));
        // let eventsLoad = new Date() - time;
        // await clickLoadBack(navigationItem);
        //
        // navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/admin/measurements/lab-form']")));
        // let devicesLoad = new Date() - time;
        // await clickLoadBack(navigationItem);
        //
        // navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/tags']")));
        // let measurementsLoad = new Date() - time;
        // await clickLoadBack(navigationItem);
        //
        // navigationItem = await driver.wait(until.elementLocated(By.xpath("//a[@href='/test-tags']")));
        // let tagsLoad = new Date() - time;
        // await clickLoadBack(navigationItem);
        // // let elem2 = await driver.wait(until.titleIs('nova'));
        // let resultTime = new Date() - time;
        // console.log("loading: \n" +
        //     "login          - " + loginFormLoad + " ms\n" +
        //     "login complete - " + loginCompleteTime + " ms\n" +
        //     "persons        - " + personsLoad + " ms\n" +
        //     "health         - " + healthLoad + " ms\n" +
        //     "activity       - " + activityLoad + " ms\n" +
        //     "events         - " + eventsLoad + " ms\n" +
        //     "devices        - " + devicesLoad + " ms\n" +
        //     "measurements   - " + measurementsLoad + " ms\n" +
        //     "tags           - " + tagsLoad + " ms\n" +
        //     "all tabs complete in " + resultTime + " ms");
        await setTimeout(() => {
            driver.quit();
        }, 10000);
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