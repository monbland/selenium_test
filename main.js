const settings = require('./settings.js');
const {Builder, By, Key, until, Options} = require('selenium-webdriver');
const chromeDriver = require('selenium-webdriver/chrome');
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: settings.elasticurl });

async function clickByXPath(xpath,driver) {
    let button = await driver.wait(until.elementLocated(By.xpath(xpath)), settings.waitingtime);
    button = await driver.wait(until.elementIsEnabled(await driver.findElement(By.xpath(xpath))), settings.waitingtime);
    button = await driver.findElement(By.xpath(xpath));
    await button.click();
}

async function clickAndWaitByXpath(xpath, driver) {
    await clickByXPath(xpath, driver);
    await driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
    await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
}

async function clickEnterAndWaitByXpath(xpath, driver) {
    await clickEnterByXPath(xpath, driver);
    await driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
    await driver.wait(until.elementIsNotVisible(await driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
}

async function clickEnterByXPath(xpath, driver) {
    let button = await driver.wait(until.elementLocated(By.xpath(xpath)), settings.waitingtime);
    button = await driver.wait(until.elementIsEnabled(await driver.findElement(By.xpath(xpath))), settings.waitingtime);
    button = await driver.findElement(By.xpath(xpath));
    await button.sendKeys(Key.ENTER);
}

class TimeCount {
    constructor(time, countName) {
        this.time = time;
        this.countName = countName;
    }
}

class Test {
    constructor() {
        this.url = settings.host;
        //initialisation of webdriver
        this.timers = [];
        this.timersCounter = 0;
        const CHROME_BIN_PATH = settings.chromepath;
        let options = new chromeDriver.Options();
        options.setChromeBinaryPath(CHROME_BIN_PATH);
        options.addArguments('headless');
        options.addArguments('window-size=1200x600');
        this.driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();
        let timer = new TimeCount(Date.now(), "initial");
        this.timers.push(timer);
        //load main page
        this.driver.get(this.url);
        this.log = '';
        this.name = '';
        this.elasticIndex = settings.elasticindex;
        this.elasticType = '';
    }

    async printLog() {
        for (let i = 0; i < this.timers.length; i++) {
            this.log += i + ".  " + this.timers[i].countName + " in " + this.timers[i].time + " ms\n";
        }
        console.log(this.log);
        return this.log;
    }

    async send() {
        this.timersCounter = 0;
        for (let i = 1; i < this.timers.length - 1; i++) {
            this.timersCounter += this.timers[i].time;
            let date = this.timers[0].time + this.timersCounter;
            await client.index({
                index: this.elasticIndex,
                body: {
                    type: this.elasticType,
                    id: i,
                    countName: this.timers[i].countName,
                    time: this.timers[i].time,
                    date: date,
                }
            });
        };
        let date = this.timers[0].time + this.timers[this.timers.length - 1].time;
        await client.index({
            index: this.elasticIndex,
            body: {
                type: this.elasticType,
                id: this.timers.length - 1,
                countName: this.timers[this.timers.length - 1].countName,
                time: this.timers[this.timers.length - 1].time,
                date: date,
            }
        });
    }

    async quit() {
        setTimeout(
            () => {
                this.driver.quit();
            },
            settings.quittime);
    }
}

class LoginTest extends Test {
    constructor(){
        super();
        this.name = "login";
        this.elasticType = 'login';
    }
    async run() {
        //login starts

        let timePoint = this.timersCounter + this.timers[0].time;
        this.timersCounter = 0;
        let timer;
        let button;
        let inputForm;

        try {
            button = await this.driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")), settings.waitingtime);
            button = await this.driver.findElement(By.xpath("//a[@href='/login']"));
            await button.click();

            inputForm = await this.driver.wait(until.elementLocated(By.className("form-control")), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "loading login page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        try {
            inputForm = await this.driver.findElements(By.className("form-control"));
            await inputForm[0].sendKeys(settings.login);
            await inputForm[1].sendKeys(settings.password);
            button = await this.driver.findElement(By.className("btn-warning"));
            await button.click();

            let numbers = await this.driver.wait(until.elementLocated(By.className("text-undefined")),  settings.waitingtime);
            numbers = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")), "."), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint), "login complete");
            await this.timers.push(timer);
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //login ends
    }
}

class DashboardTest extends Test {
    constructor(){
        super();
        this.name = "dashboard";
        this.elasticType = 'dashboard';
    }
    async run() {
        //login starts

        let timer;
        let button;
        let inputForm;
        let numbers;
        let timePoint;
        try {
            button = await this.driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")), settings.waitingtime);
            button = await this.driver.findElement(By.xpath("//a[@href='/login']"));
            await button.click();

            inputForm = await this.driver.wait(until.elementLocated(By.className("form-control")), settings.waitingtime);

            inputForm = await this.driver.findElements(By.className("form-control"));
            await inputForm[0].sendKeys(settings.login);
            await inputForm[1].sendKeys(settings.password);
            button = await this.driver.findElement(By.className("btn-warning"));
            await button.click();

            numbers = await this.driver.wait(until.elementLocated(By.className("text-undefined")), settings.waitingtime);
            numbers = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")), "."), settings.waitingtime);

            //test dashboard starts
            await clickByXPath("//a[@href='/dashboard']", this.driver);
            timePoint = this.timersCounter + this.timers[0].time;
            this.timersCounter = 0;
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "dashboard loaded");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //testing of data pickers
        //day
        try {
            await clickAndWaitByXpath("//div[@data-toggle='timeButtons']/button[1]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "day button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //week
        try {
            await clickAndWaitByXpath("//div[@data-toggle='timeButtons']/button[2]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "week button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //month
        try {
            await clickAndWaitByXpath("//div[@data-toggle='timeButtons']/button[3]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "month button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //manual data pickers
        try {
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
            await inputForm.sendKeys("2019-08-14");
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
            await inputForm.sendKeys("2019-08-31");
            await clickAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[2]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "date picker checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //testing buttons in company card
        //company picker
        try {
            await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[1]", this.driver);
            await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[2]/div/div/div[3]/div/button", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "company picker checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //department picker
        try {
            await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[2]/div[2]/div/div[1]", this.driver);
            await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[2]/div/div/div[3]/div/button", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "department picker checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //settings button
        try {
            await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div[1]/div/button", this.driver);
            await clickByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[1]/div/div/div[3]/div/button", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "settings button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //test dashboard ends
    }
}

class PersonsTest extends Test {
    constructor() {
        super();
        this.name = "persons";
        this.elasticType = 'persons';
    }
    async run() {
        //login starts

        let timer;
        let button;
        let inputForm;
        let timePoint;
        let infoCards;
        let numbers;

        try {
            button = await this.driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")), settings.waitingtime);
            button = await this.driver.findElement(By.xpath("//a[@href='/login']"));
            await button.click();

            inputForm = await this.driver.wait(until.elementLocated(By.className("form-control")), settings.waitingtime);

            inputForm = await this.driver.findElements(By.className("form-control"));
            await inputForm[0].sendKeys(settings.login);
            await inputForm[1].sendKeys(settings.password);
            button = await this.driver.findElement(By.className("btn-warning"));
            await button.click();

            numbers = await this.driver.wait(until.elementLocated(By.className("text-undefined")), settings.waitingtime);
            numbers = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")), "."), settings.waitingtime);

            //test persons starts
            //loading page
            await clickByXPath("//a[@href='/persons']", this.driver);
            timePoint = this.timersCounter + this.timers[0].time;
            this.timersCounter = 0;
            infoCards = await this.driver.wait(until.elementLocated(By.className("info-cards-value")), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "loading persons page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //elements on page picker
        try {
            await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[1]/div/div/input", this.driver);
            await this.driver.wait(until.elementIsEnabled(await this.driver.findElement(By.className("el-input el-input--suffix is-focus"))), settings.waitingtime);
            button = await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.xpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]"))), settings.waitingtime);
            await clickAndWaitByXpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "elements on page checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        // forward to person`s page
        try {
            await clickEnterByXPath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/div/div[3]/div/div[4]/div[2]/table/tbody/tr[1]/td[12]/div/button/a", this.driver);
            await this.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "open person page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //testing of person`s page
        //testing of data pickers
        //day
        try {
            await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[1]", this.driver);
            button = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "сегодня"), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "day button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //week
        try {
            await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[2]", this.driver);
            button = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "неделю"), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "week button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //month
        try {
            await clickEnterByXPath("//div[@data-toggle='timeButtons']/button[3]", this.driver);
            button = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "месяц"), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "month button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //manual data pickers
        try {
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
            await inputForm.sendKeys("2019-08-14");
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
            await inputForm.sendKeys("2019-08-31");
            await inputForm.sendKeys(Key.ENTER);
            button = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[2]/div[4]/div/div/footer/div[2]")), "14.08.19 по 31.08.19"), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "date picker checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //settings button
        try {
            await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[1]/div[2]/button"))), settings.waitingtime);
            await clickEnterAndWaitByXpath("/html/body/div/div[2]/div[2]/div/div/div[1]/div[3]/div[1]/div[2]/button", this.driver);
            await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div[1]/div[1]/div/div/div[3]/div/button", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "settings checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        // code that check anchors to persons health/activity/safety pages
        let personsPages = ["health/ecg","health/hrv","health/pulse","health/temperature","health/pressure","health/saturation","health/events","activity/steps","activity/calories","activity/distance","activity/events","safety/fall","safety/fixed-state","safety/vibe","safety/hazardous-area","safety/run","safety/events"]
        for (let i = 0; i < personsPages.length; i++) {
            try {
                await clickEnterByXPath("//a[@href='/persons/1/" + personsPages[i] + "']", this.driver);
                await this.driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
                await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
                timer = new TimeCount((new Date() - timePoint - this.timersCounter),"person`s " + personsPages[i] + " loaded");
                await this.timers.push(timer);
                this.timersCounter = this.timersCounter + timer.time;
            }
            catch (e) {
                console.error(e);
                timer = new TimeCount(-1,e.message);
                await this.timers.push(timer);
                this.timersCounter = this.timersCounter + timer.time;
            }

            try {
                await this.driver.navigate().back();
                await this.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), settings.waitingtime);
                timer = new TimeCount((new Date() - timePoint - this.timersCounter),"back to person page");
                await this.timers.push(timer);
                this.timersCounter = this.timersCounter + timer.time;
            }
            catch (e) {
                console.error(e);
            }
        }


        // check forwarding to device page
        try {
            await clickEnterAndWaitByXpath("//a[@href='/devices/device/21']", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "person`s device page loaded");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        try {
            await this.driver.navigate().back();
            await this.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "back to person page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //check forwarding to device chart on device page
        try {
            await clickEnterAndWaitByXpath("//a[@href='/devices/device/21#nova-chart']", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "person`s chart on person`s device page loaded");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        try {
            await this.driver.navigate().back();
            await this.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "back to person page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        // check buttons that forwards to events page
        inputForm = await this.driver.findElements(By.xpath("//a[@href='/events/events']"));
        for (let i = 0; i < inputForm.length; i++) {
            try {
                inputForm = await this.driver.findElements(By.xpath("//a[@href='/events/events']"));
                await this.driver.wait(until.elementIsVisible(inputForm[i]), settings.waitingtime);
                await this.driver.wait(until.elementIsEnabled(inputForm[i]), settings.waitingtime);
                await inputForm[i].sendKeys(Key.ENTER);
                await this.driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
                await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
                timer = new TimeCount((new Date() - timePoint - this.timersCounter), "person`s event page #" + (i + 1) + " loaded");
                await this.timers.push(timer);
                this.timersCounter = this.timersCounter + timer.time;
            }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

            try {
                await this.driver.navigate().back();
                await this.driver.wait(until.elementLocated(By.xpath("//div[@data-msgid='Employee']")), settings.waitingtime);
                await this.driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
                await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
                timer = new TimeCount((new Date() - timePoint - this.timersCounter), "back to person page");
                await this.timers.push(timer);
                this.timersCounter = this.timersCounter + timer.time;
            }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        }

        //test persons ends
    }
}

class EventsTest extends Test {
    constructor(){
        super();
        this.name = "events";
        this.elasticType = 'events';
    }
    async run() {
        //login starts

        let button;
        let inputForm;
        let numbers;
        let timePoint;
        let timer;

        try {
            button = await this.driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")), settings.waitingtime);
            button = await this.driver.findElement(By.xpath("//a[@href='/login']"));
            await button.click();

            inputForm = await this.driver.wait(until.elementLocated(By.className("form-control")), settings.waitingtime);

            inputForm = await this.driver.findElements(By.className("form-control"));
            await inputForm[0].sendKeys(settings.login);
            await inputForm[1].sendKeys(settings.password);
            button = await this.driver.findElement(By.className("btn-warning"));
            await button.click();

            numbers = await this.driver.wait(until.elementLocated(By.className("text-undefined")), settings.waitingtime);
            numbers = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")), "."), settings.waitingtime);

            //test events starts
            //open events
            await clickAndWaitByXpath("//a[@href='/events']", this.driver);
            timePoint = this.timersCounter + this.timers[0].time;
            this.timersCounter = 0;
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "open events page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //testing of data pickers
        //day
        try {
            await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[1]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "day button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //week
        try {
            await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[2]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "week button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //month
        try {
            await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[3]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "month button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //manual data pickers
        try {
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
            await inputForm.sendKeys("2019-08-14");
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
            await inputForm.sendKeys("2019-08-31");
            await inputForm.sendKeys(Key.ENTER);
            await this.driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
            await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "date picker checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //elements on page picker
        try {
            await clickEnterAndWaitByXpath("/html/body/div[1]/div[2]/div[2]/div/div/div/div[5]/div/div/div[2]/div[1]/div/div/input", this.driver);
            await this.driver.wait(until.elementIsEnabled(await this.driver.findElement(By.className("el-input el-input--suffix is-focus"))), settings.waitingtime);
            await clickAndWaitByXpath("/html/body/div[3]/div[1]/div[1]/ul/li[3]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "elements on page checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //test events ends
    }
}

class DevicesTest extends Test {
    constructor(){
        super();
        this.name = "devices";
        this.elasticType = 'devices';
    }
    async run() {
        //login starts

        let button;
        let inputForm;
        let numbers;
        let timePoint;
        let timer;

        try {
            button = await this.driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")), settings.waitingtime);
            button = await this.driver.findElement(By.xpath("//a[@href='/login']"));
            await button.click();

            inputForm = await this.driver.wait(until.elementLocated(By.className("form-control")), settings.waitingtime);

            inputForm = await this.driver.findElements(By.className("form-control"));
            await inputForm[0].sendKeys(settings.login);
            await inputForm[1].sendKeys(settings.password);
            button = await this.driver.findElement(By.className("btn-warning"));
            await button.click();

            numbers = await this.driver.wait(until.elementLocated(By.className("text-undefined")), settings.waitingtime);
            numbers = await this.driver.wait(until.elementTextContains(await this.driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div[3]/div/div/section/section/div/div[1]/div/span")), "."), settings.waitingtime);

            //test devices starts
            //forward to devices page
            await clickAndWaitByXpath("//a[@href='/devices']", this.driver);
            timePoint = this.timersCounter + this.timers[0].time;
            this.timersCounter = 0;
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "loading of devices page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //elements on page picker
        try {
            await clickEnterAndWaitByXpath("/html/body/div/div[2]/div[2]/div/div/div/div[3]/div[1]/div/div/div[1]/div/div[1]/input", this.driver);
            await this.driver.wait(until.elementIsEnabled(await this.driver.findElement(By.className("el-input el-input--suffix is-focus"))), settings.waitingtime);
            await clickAndWaitByXpath("/html/body/div[2]/div[1]/div[1]/ul/li[3]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "elements on page checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //forward to device page
        try {
            await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
            button = await this.driver.findElement(By.xpath("//a[@href='/devices/device/3']"));
            await this.driver.executeScript("arguments[0].click();",button);
            await this.driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
            await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "loading device page");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //testing of data pickers
        //day
        try {
            await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[1]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "day button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //week
        try {
            await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[2]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "week button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //month
        try {
            await clickEnterAndWaitByXpath("//div[@data-toggle='timeButtons']/button[3]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "month button checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //manual data pickers
        try {
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Начальная дата']"));
            await inputForm.sendKeys("2019-08-14");
            inputForm = await this.driver.findElement(By.xpath("//input[@placeholder='Конечная дата']"));
            await inputForm.sendKeys("2019-08-31");
            await inputForm.sendKeys(Key.ENTER);
            await this.driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
            await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "date picker checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //elements on page picker
        try {
            await clickEnterAndWaitByXpath("/html/body/div/div[2]/div[2]/div/div/div/div[6]/div/div[1]/div/div[1]/input", this.driver);
            await this.driver.wait(until.elementIsEnabled(await this.driver.findElement(By.className("el-input el-input--suffix is-focus"))), settings.waitingtime);
            await clickAndWaitByXpath("/html/body/div[3]/div[1]/div[1]/ul/li[3]", this.driver);
            timer = new TimeCount((new Date() - timePoint - this.timersCounter), "elements on page checked");
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //forward to person`s page

        try {
            button = await this.driver.findElement(By.xpath("//a[@href='/persons/23/profile']"));
            await this.driver.executeScript("arguments[0].click();",button);
            await this.driver.wait(until.elementLocated(By.className("el-loading-mask")), settings.waitingtime);
            await this.driver.wait(until.elementIsNotVisible(await this.driver.findElement(By.className("el-loading-mask"))), settings.waitingtime);
            timer = new TimeCount((new Date() - timePoint), "person`s page loaded");
            await this.timers.push(timer);
            this.timersCounter = timer.time + timePoint - this.timers[0].time;
        }
        catch (e) {
            console.error(e);
            timer = new TimeCount(-1,e.message);
            await this.timers.push(timer);
            this.timersCounter = this.timersCounter + timer.time;
        }

        //test devices ends
    }
}

async function test1() {
    let errorCount = 0;
    let log = "";
    for (let i = 0; i < settings.iterations; i++) {
        let test = new DashboardTest();
        await test.run().catch(error => {
            console.error(error);
            console.log(i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events");
            log += error + "\n" + i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events\n";
            errorCount++;
        });
        log += await test.printLog();
        test.quit();
        test.send();
        test = new EventsTest();
        await test.run().catch(error => {
            console.error(error);
            console.log(i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events");
            log += error + "\n" + i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events\n";
            errorCount++;
        });
        log += await test.printLog();
        test.quit();
        test.send();
        test = new DevicesTest();
        await test.run().catch(error => {
            console.error(error);
            console.log(i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events");
            log += error + "\n" + i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events\n";
            errorCount++;
        });
        log += await test.printLog();
        test.quit();
        test.send();
        test = new PersonsTest();
        await test.run().catch(error => {
            console.error(error);
            console.log(i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events");
            log += error + "\n" + i + " iteration, " + test.timers[test.timers.length - 1].countName + " on events\n";
            errorCount++;
        });
        log += await test.printLog();
        test.quit();
        test.send();
        console.log(i + 1 +  " iteration from " + settings.iterations + " complete")
    }


    await fs.writeFile(settings.logpath, log, (err) => {
        if (err) {
            console.error(err);
        }
    });
}

test1().then(result => {console.log("succ")}, error => {console.error(error)});