const {Builder, By, Key, until} = require('selenium-webdriver');
class TimeCount {
    constructor(time, countName) {
        this.time = time;
        this.countName = countName;
    }
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
    numbers = await driver.findElements(By.className("text-undefined"));
    let numbersText = [];
    let errors = [];
    for (let i = 0; i < numbers.length; i++) {
        let string = await numbers[i].getText();
        await numbersText.push(string);
        if (string<7 || string>10) {                                                                                    //remember to change "if"
            errors.push("dashboard element #" + (i+1) + " is uncorrect: " + string);
        }
    }
    if (errors.length == 0) {
        await console.log("dashboard test ends, no errors found");
    }
    else {
        await console.log("dashboard test ends, " + errors.length + " errors found:");
        for (let i = 0; i < errors.length; i++) {
            await console.log(i + 1 + ".    " + errors[i]);
        }
    }
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"testing of dashboard complete");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    //test dashboard ends

    //test persons starts
    button = await driver.wait(until.elementLocated(By.xpath("//a[@href='/persons']")));
    button = await driver.findElement(By.xpath("//a[@href='/persons']"));
    await button.click();
    let infoCards = await driver.wait(until.elementLocated(By.className("info-cards-value")), 2000);
    timer = new TimeCount((new Date - timers[0].time - timersCounter),"loading persons page");
    await timers.push(timer);
    timersCounter = timersCounter + timer.time;
    infoCards = await driver.findElements(By.className("info-cards-value"));
    let cardsContent = [];
    errors = [];
    for (let i = 0; i < infoCards.length; i++) {
        let string = await infoCards[i].getText();
        await cardsContent.push(string);
    }
    if (cardsContent[0] < 50) {                                                                                         //remember to change "if"
        await errors.push("persons count is incorrect: " + cardsContent[0])
    }
    if (errors.length == 0) {
        await console.log("persons test ends, no errors found");
    }
    else {
        await console.log("persons test ends, " + errors.length + " errors found:");
        for (let i = 0; i < errors.length; i++) {
            await console.log(i + 1 + ".    " + errors[i]);
        }
    }
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
        10000);
}

test1().then(
    function() {console.log("succ")},
    function(err) {console.error(err)}
).catch(function(err) {
    console.error(err);
});