const {Builder, By, Key, until, Select} = require('selenium-webdriver');
class TimeCount {
    constructor(time, countName) {
        this.time = time;
        this.countName = countName;
    }
}

async function clickByXPath(xpath,driver) {
    let button = await driver.wait(until.elementLocated(By.xpath(xpath)),2000);
    button = await driver.findElement(By.xpath(xpath));
    await button.click();
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
    let inputForm = await driver.wait(until.elementLocated(By.className("form-control")), 2000);
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
    let numbers = await driver.wait(until.elementLocated(By.className("text-undefined")), 2000);
    numbers = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")),"."),3000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"login complete");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //testing of data pickers
    //day
    await clickByXPath("//div[@data-toggle='timeButtons']/button[1]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"сегодня"),2000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"day button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //week
    await clickByXPath("//div[@data-toggle='timeButtons']/button[2]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"неделю"),2000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"week button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //month
    await clickByXPath("//div[@data-toggle='timeButtons']/button[3]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"месяц"),2000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"month button checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    //manual data pickers
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
    await inputForm.sendKeys("2019-08-14");
    inputForm = await driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
    await inputForm.sendKeys("2019-08-31");
    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[2]",driver);
    button = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[6]/div[4]/div/div/footer/div[2]")),"14.08.19 по 31.08.19"),2000);
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
    let infoCards = await driver.wait(until.elementLocated(By.className("info-cards-value")), 2000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"loading persons page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;


    button = await driver.wait(until.elementIsEnabled(await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[1]/div/div/input"))),2000);
    button = await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[1]/div/div/input"));
    await button.sendKeys(Key.ENTER);
    button = await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]"))),2000);
    button = await driver.findElement(By.xpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]"));
    await button.click();
    await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[3]/div/div[4]/div[2]/table/tbody/tr[6]/td[1]/div")),2000)
    await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[3]/div/div[4]/div[2]/table/tbody/tr[6]/td[1]/div")),"6"),2000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"elements on page checked");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;

    await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[5]/ul/li[3]/a",driver);
    // inputForm = await driver.wait(until.)

    timer = new TimeCount((new Date - timers[0].time - timersCounter),"testing of persons page complete");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    //test persons ends

    //test events starts
    button = await driver.wait(until.elementLocated(By.xpath("//a[@href='/events']")));
    button = await driver.findElement(By.xpath("//a[@href='/events']"));
    await button.click();
    let eventCards = await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='All events']")), 2000);
    eventCards = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("//div[@data-msgid='All events']")),"события"),2000);
    eventCards = await driver.wait(until.elementLocated(By.className("info-cards-value")), 2000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"loading events page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    eventCards = await driver.findElements(By.className("info-cards-value"));
    let eventContent = [];
    errors = [];
    for (let i = 0; i <eventCards.length; i++) {
        let string = await eventCards[i].getText();
        await eventContent.push(string);
    }
    if (eventContent[0] < 2000) {                                                                                       //remember to change "if"
        await errors.push("events count is incorrect: " + eventContent[0])
    }
    if (errors.length == 0) {
        await console.log("events test ends, no errors found");
    }
    else {
        await console.log("events test ends, " + errors.length + " errors found:");
        for (let i = 0; i < errors.length; i++) {
            await console.log(i + 1 + ".    " + errors[i]);
        }
    }
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"testing of events page complete");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    //test events ends

    //test devices starts
    button = await driver.wait(until.elementLocated(By.xpath("//a[@href='/devices']")));
    button = await driver.findElement(By.xpath("//a[@href='/devices']"));
    await button.click();
    let deviceCards = await driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Devices']")), 3000);
    deviceCards = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("//div[@data-msgid='Devices']")),"Устройства"),2000);
    deviceCards = await driver.wait(until.elementLocated(By.className("info-cards-value")), 2000);
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
        15000);
}

test1().then(
    function() {console.log("succ")},
    function(err) {console.error(err)}
).catch(function(err) {
    console.error(err);
});