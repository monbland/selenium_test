const settings = require('./settings.js');
const {Builder, By, Key, until, Select} = require('selenium-webdriver');
class TimeCount {
    constructor(time, countName) {
        this.time = time;
        this.countName = countName;
    }
}
class DriverWithTimeCounter {
    constructor(driver, timers, timersCounter){
        this.driver = driver;
        this.timers = timers;
        this.timersCounter = timersCounter;
    }
}

async function clickByXPath(xpath,driver) {
    let button = await driver.wait(until.elementLocated(By.xpath(xpath)),5000);
    button = await driver.wait(until.elementIsEnabled(await driver.findElement(By.xpath(xpath))),5000);
    button = await driver.findElement(By.xpath(xpath));
    await button.click();
}

async function clickAndWaitByXpath(xpath, driver) {
    await clickByXPath(xpath, driver);
    await driver.wait(until.elementLocated(By.className("el-loading-mask")),20000);
    await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))),20000);
}

async function clickEnterAndWaitByXpath(xpath, driver) {
    await clickEnterByXPath(xpath, driver);
    await driver.wait(until.elementLocated(By.className("el-loading-mask")),20000);
    await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))),20000);
}

async function clickEnterByXPath(xpath, driver) {
    let button = await driver.wait(until.elementLocated(By.xpath(xpath)),5000);
    button = await driver.wait(until.elementIsEnabled(await driver.findElement(By.xpath(xpath))),5000);
    button = await driver.findElement(By.xpath(xpath));
    await button.sendKeys(Key.ENTER);
}

async function initDriver() {
    //initialisation of webdriver
    let driverWithCounter = new DriverWithTimeCounter();
    driverWithCounter.timers = [];
    driverWithCounter.timersCounter = 0;
    driverWithCounter.driver = new Builder().forBrowser('chrome').build();
    let timer = new TimeCount(Date.now(), "initial");
    await driverWithCounter.timers.push(timer);
    //load main page
    await driverWithCounter.driver.get(settings.host);
    timer = new TimeCount((new Date() - driverWithCounter.timers[0].time), "loading page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;
    return driverWithCounter;
}

async function login(driverWithCounter) {
    //login starts
    let timePoint = driverWithCounter.timersCounter + driverWithCounter.timers[0].time;
    driverWithCounter.timersCounter = 0;

    let button = await driverWithCounter.driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")));
    button = await driverWithCounter.driver.findElement(By.xpath("//a[@href='/login']"));
    await button.click();

    let inputForm = await driverWithCounter.driver.wait(until.elementLocated(By.className("form-control")), 5000);
    let timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "loading login page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    inputForm = await driverWithCounter.driver.findElements(By.className("form-control"));
    await inputForm[0].sendKeys(settings.login);
    await inputForm[1].sendKeys(settings.password);
    button = await driverWithCounter.driver.findElement(By.className("btn-warning"));
    await button.click();

    let numbers = await driverWithCounter.driver.wait(until.elementLocated(By.className("text-undefined")), 5000);
    numbers = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")), "."), 5000);
    timer = new TimeCount((new Date() - timePoint), "login complete");
    await driverWithCounter.timers.push(timer);

    //login ends
    driverWithCounter.timersCounter = timer.time + timePoint - driverWithCounter.timers[0].time;
    return driverWithCounter;
}

async function testDashboard(driverWithCounter) {
    //test dashboard starts
    await clickByXPath("//a[@href='/dashboard']", driverWithCounter.driver);
    let timePoint = driverWithCounter.timersCounter + driverWithCounter.timers[0].time;
    driverWithCounter.timersCounter = 0;

    //testing of data pickers
    //day
    await clickByXPath("//div[@data-toggle='timeButtons']/button[1]", driverWithCounter.driver);
    let button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")), "сегодня"), 5000);
    let timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "day button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //week
    await clickByXPath("//div[@data-toggle='timeButtons']/button[2]", driverWithCounter.driver);
    button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")), "неделю"), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "week button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //month
    await clickByXPath("//div[@data-toggle='timeButtons']/button[3]", driverWithCounter.driver);
    button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")), "месяц"), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "month button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //manual data pickers
    let inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[2]", driverWithCounter.driver);
    button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")), "14.08.19 по 31.08.19"), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "date picker checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //testing buttons in company card
    //company picker
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[1]", driverWithCounter.driver);
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[2]/div/div/div[3]/div/button", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "company picker checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //department picker
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[1]", driverWithCounter.driver);
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[2]/div/div/div[3]/div/button", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "department picker checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //settings button
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[1]/div/button", driverWithCounter.driver);
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[1]/div/div/div[3]/div/button", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "settings button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    timer = new TimeCount((new Date() - timePoint), "testing of dashboard complete");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = timer.time + timePoint - driverWithCounter.timers[0].time;
    //test dashboard ends
    return driverWithCounter;
}

async function testPersons(driverWithCounter) {
    //test persons starts
    //loading page
    await clickByXPath("//a[@href='/persons']", driverWithCounter.driver);
    let timePoint = driverWithCounter.timersCounter + driverWithCounter.timers[0].time;
    driverWithCounter.timersCounter = 0;
    let infoCards = await driverWithCounter.driver.wait(until.elementLocated(By.className("info-cards-value")), 5000);
    let timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "loading persons page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //elements on page picker
    await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[1]/div/div/input", driverWithCounter.driver);
    let button = await driverWithCounter.driver.wait(until.elementIsVisible(await driverWithCounter.driver.findElement(By.xpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]"))), 5000);
    await clickAndWaitByXpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "elements on page checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    // forward to person`s page
    await clickEnterByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[3]/div/div[4]/div[2]/table/tbody/tr[1]/td[12]/div/button/a", driverWithCounter.driver);
    await driverWithCounter.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "open person page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //testing of person`s page
    //testing of data pickers
    //day
    await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[1]", driverWithCounter.driver);
    button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "сегодня"), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "day button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //week
    await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[2]", driverWithCounter.driver);
    button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "неделю"), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "week button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //month
    await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[3]", driverWithCounter.driver);
    button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "месяц"), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "month button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //manual data pickers
    let inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await inputForm.sendKeys(Key.ENTER);
    button = await driverWithCounter.driver.wait(until.elementTextContains(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "14.08.19 по 31.08.19"), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "date picker checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //settings button
    await driverWithCounter.driver.wait(until.elementIsVisible(await driverWithCounter.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[1]/div[2]/button"))), 5000);
    await clickEnterAndWaitByXpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[1]/div[2]/button", driverWithCounter.driver);
    await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div[1]/div[1]/div/div/div[3]/div/button", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "settings checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    // code that check anchors to persons health/activity/safety pages
    // wait for victor
    // let personsPages = ["health/ecg","health/hrv","health/pulse","health/temperature","health/pressure","health/saturation","health/events","activity/steps","activity/calories","activity/distance","activity/events","safety/fall","safety/fixed-state","safety/vibe","safety/hazardous-area","safety/run","safety/events"]
    // for (let i = 0; i < personsPages.length; i++) {
    //     await clickEnterByXPath("//a[@href='/persons/1/" + personsPages[i] + "']", driverWithCounter.driver);
    //     await driverWithCounter.driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))),5000);
    //     timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter),"person`s " + personsPages[i] + " loaded");
    //     await driverWithCounter.timers.push(timer);
    //     driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;
    //
    //     await driverWithCounter.driver.navigate().back();
    //     await driverWithCounter.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")),5000);
    //     timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter),"back to person page");
    //     await driverWithCounter.timers.push(timer);
    //     driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;
    // }
    //

    // check forwarding to device page
    await clickEnterAndWaitByXpath("//a[@href='/devices/device/21']", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "person`s device page loaded");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    await driverWithCounter.driver.navigate().back();
    await driverWithCounter.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "back to person page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //check forwarding to device chart on device page
    await clickEnterAndWaitByXpath("//a[@href='/devices/device/21#nova-chart']", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "person`s chart on person`s device page loaded");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    await driverWithCounter.driver.navigate().back();
    await driverWithCounter.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), 5000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "back to person page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    // check buttons that forwards to events page
    inputForm = await driverWithCounter.driver.findElements(By.xpath("//a[@href='/events/events']"));
    for (let i = 0; i < inputForm.length; i++) {
        inputForm = await driverWithCounter.driver.findElements(By.xpath("//a[@href='/events/events']"));
        await driverWithCounter.driver.wait(until.elementIsVisible(inputForm[i]), 5000);
        await driverWithCounter.driver.wait(until.elementIsEnabled(inputForm[i]), 5000);
        await inputForm[i].sendKeys(Key.ENTER);
        await driverWithCounter.driver.wait(until.elementLocated(By.className("el-loading-mask")), 20000);
        await driverWithCounter.driver.wait(until.elementIsNotVisible(await driverWithCounter.driver.findElement(By.className("el-loading-mask"))), 20000);
        timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "person`s event page #" + (i + 1) + " loaded");
        await driverWithCounter.timers.push(timer);
        driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

        await driverWithCounter.driver.navigate().back();
        await driverWithCounter.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), 5000);
        await driverWithCounter.driver.wait(until.elementLocated(By.className("el-loading-mask")), 20000);
        await driverWithCounter.driver.wait(until.elementIsNotVisible(await driverWithCounter.driver.findElement(By.className("el-loading-mask"))), 20000);
        timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "back to person page");
        await driverWithCounter.timers.push(timer);
        driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;
    }

    timer = new TimeCount((new Date() - timePoint), "testing of persons page complete");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = timer.time + timePoint - driverWithCounter.timers[0].time;
    //test persons ends

    return driverWithCounter;
}

async function testEvents(driverWithCounter) {
    //test events starts
    //open events
    await clickAndWaitByXpath("//a[@href='/events']", driverWithCounter.driver);
    let timePoint = driverWithCounter.timersCounter + driverWithCounter.timers[0].time;
    driverWithCounter.timersCounter = 0;
    let timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "open events page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //testing of data pickers
    //day
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[1]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "day button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //week
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[2]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "week button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //month
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[3]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "month button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //manual data pickers
    let inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await inputForm.sendKeys(Key.ENTER);
    await driverWithCounter.driver.wait(until.elementLocated(By.className("el-loading-mask")), 20000);
    await driverWithCounter.driver.wait(until.elementIsNotVisible(await driverWithCounter.driver.findElement(By.className("el-loading-mask"))), 20000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "date picker checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //elements on page picker
    await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div/div/div[2]/div[1]/div/div/input", driverWithCounter.driver);
    await clickAndWaitByXpath("/html/body/div[3]/div[1]/div[1]/ul/li[3]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "elements on page checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    timer = new TimeCount((new Date() - timePoint), "testing of events page complete");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = timer.time + timePoint - driverWithCounter.timers[0].time;
    //test events ends

    return driverWithCounter;
}

async function testDevices(driverWithCounter) {
    //test devices starts
    //forward to devices page
    await clickAndWaitByXpath("//a[@href='/devices']", driverWithCounter.driver);
    let timePoint = driverWithCounter.timersCounter + driverWithCounter.timers[0].time;
    driverWithCounter.timersCounter = 0;
    let timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "loading of devices page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //elements on page picker
    await clickEnterAndWaitByXpath("/html/body/div/div[2]/div[2]/div/div/div/div[3]/div[1]/div/div/div[1]/div/div[1]/input", driverWithCounter.driver);
    await clickAndWaitByXpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "elements on page checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //forward to device page
    await driverWithCounter.driver.wait(until.elementIsNotVisible(await driverWithCounter.driver.findElement(By.className("el-loading-mask"))), 20000);
    let button = await driverWithCounter.driver.findElement(By.xpath("//a[@href='/devices/device/3']"));
    await driverWithCounter.driver.executeScript("arguments[0].click();",button);
    await driverWithCounter.driver.wait(until.elementLocated(By.className("el-loading-mask")),20000);
    await driverWithCounter.driver.wait(until.elementIsNotVisible(await driverWithCounter.driver.findElement(By.className("el-loading-mask"))),20000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "loading device page");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //testing of data pickers
    //day
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[1]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "day button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //week
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[2]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "week button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //month
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[3]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "month button checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //manual data pickers
    let inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driverWithCounter.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await inputForm.sendKeys(Key.ENTER);
    await driverWithCounter.driver.wait(until.elementLocated(By.className("el-loading-mask")), 20000);
    await driverWithCounter.driver.wait(until.elementIsNotVisible(await driverWithCounter.driver.findElement(By.className("el-loading-mask"))), 20000);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "date picker checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //elements on page picker
    await clickEnterAndWaitByXpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div/div[1]/div/div[1]/input", driverWithCounter.driver);
    await clickAndWaitByXpath("/html/body/div[3]/div[1]/div[1]/ul/li[3]", driverWithCounter.driver);
    timer = new TimeCount((new Date() - timePoint - driverWithCounter.timersCounter), "elements on page checked");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = driverWithCounter.timersCounter + timer.time;

    //forward to person`s page

    button = await driverWithCounter.driver.findElement(By.xpath("//a[@href='/persons/23/profile']"));
    await driverWithCounter.driver.executeScript("arguments[0].click();",button);
    await driverWithCounter.driver.wait(until.elementLocated(By.className("el-loading-mask")),20000);
    await driverWithCounter.driver.wait(until.elementIsNotVisible(await driverWithCounter.driver.findElement(By.className("el-loading-mask"))),20000);
    timer = new TimeCount((new Date() - timePoint), "person`s page loaded");
    await driverWithCounter.timers.push(timer);
    driverWithCounter.timersCounter = timer.time + timePoint - driverWithCounter.timers[0].time;

    //test devices ends

    return driverWithCounter;
}

async function test1() {
    let driverWithCounter = await initDriver();
    driverWithCounter = await login(driverWithCounter);
    driverWithCounter = await testDashboard(driverWithCounter);
    driverWithCounter = await testPersons(driverWithCounter);
    driverWithCounter = await testEvents(driverWithCounter);
    driverWithCounter = await testDevices(driverWithCounter);

    let timer = new TimeCount((new Date() - driverWithCounter.timers[0].time), "all test complete");
    await driverWithCounter.timers.push(timer);

    for (let i = 0; i < driverWithCounter.timers.length; i++) {
        await console.log(i + ".  " + driverWithCounter.timers[i].countName + " in " + driverWithCounter.timers[i].time + " ms")
    }
    setTimeout(
        () => {
            driverWithCounter.driver.quit();
        },
        10000);
}
test1().then(result => {console.log("succ")}, error => {console.error(error)});