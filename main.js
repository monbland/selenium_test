const {Builder, By, Key, until, Select} = require('selenium-webdriver');
class TimeCount {
    constructor(time, countName) {
        this.time = time;
        this.countName = countName;
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

async function test1(){
    //initialisation of webdriver
    let driver = new Builder().forBrowser('chrome').build();

    //initialization of timers array
    let timers = [];
    let timer = new TimeCount(new Date(), "initial");
    await timers.push(timer);
    let timersCounter = 0;

    //load main page
    await driver.get("https://nova.dev.aetalon.tech/");
    timer = new TimeCount((new Date - timers[0].time),"loading page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //login starts
    let button = await driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")));
    button = await driver.findElement(By.xpath("//a[@href='/login']"));
    await button.click();
    let inputForm = await driver.wait(until.elementLocated(By.className("form-control")), 5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"loading login page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    inputForm = await driver.findElements(By.className("form-control"));
    await inputForm[0].sendKeys("Viktor");
    await inputForm[1].sendKeys("7188387q");
    button = await driver.findElement(By.className("btn-warning"));
    await button.click();
    //login ends

    //test dashboard starts
    let numbers = await driver.wait(until.elementLocated(By.className("text-undefined")), 5000);
    numbers = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")),"."),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"login complete");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //testing of data pickers
    //day
    await clickByXPath("//div[@data-toggle='timeButtons']/button[1]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"сегодня"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"day button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //week
    await clickByXPath("//div[@data-toggle='timeButtons']/button[2]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"неделю"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"week button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //month
    await clickByXPath("//div[@data-toggle='timeButtons']/button[3]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"месяц"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"month button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //manual data pickers
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[2]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"14.08.19 по 31.08.19"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"date picker checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //testing buttons in company card
    //company picker
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[1]",driver);
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[2]/div/div/div[3]/div/button",driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"company picker checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //department picker
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[1]",driver);
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[2]/div/div/div[3]/div/button",driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"department picker checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //settings button
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[1]/div/button",driver);
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[1]/div/div/div[3]/div/button",driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"settings button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    timer = new TimeCount((new Date - timers[0].time),"testing of dashboard complete");
    await timers.push(timer);
    let dashboardCompleteTime;
    //test dashboard ends

    //test persons starts
    //loading page
    await clickByXPath("//a[@href='/persons']", driver);
    let infoCards = await driver.wait(until.elementLocated(By.className("info-cards-value")), 5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"loading persons page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //elements on page picker
    await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[1]/div/div/input", driver);
    button = await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]"))),5000);
    await clickAndWaitByXpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]", driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"elements on page checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    // forward to person`s page
    await clickEnterByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[3]/div/div[4]/div[2]/table/tbody/tr[1]/td[12]/div/button/a", driver);
    await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"open person page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //testing of person`s page
    //testing of data pickers
    //day
    await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[1]", driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")),"сегодня"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"day button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //week
    await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[2]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")),"неделю"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"week button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //month
    await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[3]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")),"месяц"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"month button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //manual data pickers
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await inputForm.sendKeys(Key.ENTER);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")),"14.08.19 по 31.08.19"),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"date picker checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //settings button
    await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[1]/div[2]/button"))),5000);
    await clickEnterAndWaitByXpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[1]/div[2]/button", driver);
    await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div[1]/div[1]/div/div/div[3]/div/button",driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"settings checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    // code that check anchors to persons health/activity/safety pages
    // wait for victor
    // let personsPages = ["health/ecg","health/hrv","health/pulse","health/temperature","health/pressure","health/saturation","health/events","activity/steps","activity/calories","activity/distance","activity/events","safety/fall","safety/fixed-state","safety/vibe","safety/hazardous-area","safety/run","safety/events"]
    // for (let i = 0; i < personsPages.length; i++) {
    //     await clickEnterByXPath("//a[@href='/persons/1/" + personsPages[i] + "']", driver);
    //     await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))),5000);
    //     timer = new TimeCount((new Date - timers[0].time - timersCounter),"person`s " + personsPages[i] + " loaded");
    //     await timers.push(timer);
    //     timersCounter = timersCounter + timer.time;
    //
    //     await driver.navigate().back();
    //     await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")),5000);
    //     timer = new TimeCount((new Date - timers[0].time - timersCounter),"back to person page");
    //     await timers.push(timer);
    //     timersCounter = timersCounter + timer.time;
    // }
    //

    // check forwarding to device page
    await clickEnterAndWaitByXpath("//a[@href='/devices/device/21']", driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"person`s device page loaded");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    await driver.navigate().back();
    await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"back to person page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //check forwarding to device chart on device page
    await clickEnterAndWaitByXpath("//a[@href='/devices/device/21#nova-chart']", driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"person`s chart on person`s device page loaded");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    await driver.navigate().back();
    await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")),5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"back to person page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    // check buttons that forwards to events page
    inputForm = await driver.findElements(By.xpath("//a[@href='/events/events']"));
    for (let i = 0; i < inputForm.length; i++) {
        inputForm = await driver.findElements(By.xpath("//a[@href='/events/events']"));
        await driver.wait(until.elementIsVisible(inputForm[i]),5000);
        await driver.wait(until.elementIsEnabled(inputForm[i]),5000);
        await inputForm[i].sendKeys(Key.ENTER);
        await driver.wait(until.elementLocated(By.className("el-loading-mask")),20000);
        await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))),20000);
        timer = new TimeCount((new Date - timers[0].time - timersCounter),"person`s event page #" + (i + 1) + " loaded");
        await timers.push(timer);
        timersCounter = timersCounter + timer.time;

        await driver.navigate().back();
        await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")),5000);
        await driver.wait(until.elementLocated(By.className("el-loading-mask")),20000);
        await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))),20000);
        timer = new TimeCount((new Date - timers[0].time - timersCounter),"back to person page");
        await timers.push(timer);
        timersCounter = timersCounter + timer.time;
    }

    timer = new TimeCount((new Date - timers[0].time - timersCounter),"testing of persons page complete");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    //test persons ends

    //test events starts
    //open events
    clickAndWaitByXpath("//a[@href='/events']", driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"open events page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //testing of data pickers
    //day
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[1]", driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"day button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //week
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[2]",driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"week button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //month
    await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[3]",driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"month button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //manual data pickers
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await inputForm.sendKeys(Key.ENTER);
    await driver.wait(until.elementLocated(By.className("el-loading-mask")),20000);
    await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))),20000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"date picker checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div/div/div[2]/div[1]/div/div/input", driver);
    // button = await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("/html/body/div[3]/div[1]/div[1]/ul/li[3]"))),5000);
    await clickAndWaitByXpath("/html/body/div[3]/div[1]/div[1]/ul/li[3]", driver);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"elements on page checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;


    timer = new TimeCount((new Date - timers[0].time - timersCounter),"testing of events page complete");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    //test events ends

    //test devices starts
    button = await driver.wait(until.elementLocated(By.xpath("//a[@href='/devices']")));
    button = await driver.findElement(By.xpath("//a[@href='/devices']"));
    await button.click();
    let deviceCards = await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Devices']")), 5000);
    deviceCards = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("//div[@data-msgid='Devices']")),"Устройства"),5000);
    deviceCards = await driver.wait(until.elementLocated(By.className("info-cards-value")), 5000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"loading devices page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    deviceCards = await driver.findElements(By.className("info-cards-value"));
    let deviceContent = [];
    errors = [];
    for (let i = 0; i <deviceCards.length; i++) {
        let string = await deviceCards[i].getText();
        await deviceContent.push(string);
    }
    if (deviceContent[0] < 2000) {                                                                                       //remember to change "if"
        await errors.push("devices count is incorrect: " + deviceContent[0])
    }
    if (errors.length == 0) {
        await console.log("devices test ends, no errors found");
    }
    else {
        await console.log("devices test ends, " + errors.length + " errors found:");
        for (let i = 0; i < errors.length; i++) {
            await console.log(i + 1 + ".    " + errors[i]);
        }
    }
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"testing of devices page complete");
    await timers.push(timer);
    //test devices ends

    timer = new TimeCount((new Date - timers[0].time),"all test complete");
    await timers.push(timer);

    for (let i = 0; i < timers.length; i++) {
        console.log(i + ".  " + timers[i].countName + " in " + timers[i].time + " ms")
    }
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