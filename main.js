const {Builder, By, Key, until} = require('selenium-webdriver');
let driver = new Builder().forBrowser('chrome').build();
class Timer {
    constructor(name, date) {
        this.name = name;
        this.date = date;
    }
}
let timers = [];
let count = 0;

async function getElementContentByXPath(xpath) {
    await setTimeout(() => {
        driver.findElement(By.xpath(xpath)).getText().then(
            result => {
                console.log(result)
            },
            error => {
                console.log(error.message)
            }
        )
    }, 1500);
}
async function clickByXPath(xpath) {
    await setTimeout(() => {
        driver.findElement(By.xpath(xpath)).click().then(
            result => {
            },
            error => {
                console.log(error.message)
            }
        )
    }, 2500);
}

async function fillByXPath(xpath, content) {
    await setTimeout(() => {
        driver.findElement(By.xpath(xpath)).sendKeys(content).then(
            result => {
            },
            error => {
                console.log(error.message)
            }
        )
    }, 1500);
}

function addTimer(name) {
    let addedTimer = new Timer(name, new Date());
    timers.push(addedTimer);
    count++;
}

async function example() {
    try {
        let initialTimer = new Timer("start", new Date);
        timers.push(initialTimer);
        driver.get('https://nova.dev.aetalon.tech');
        count++;
        addTimer("page loaded");

        await clickByXPath("//a[@href='/login']");
        addTimer("authentication loaded");

        let inputForm = await driver.wait(until.elementLocated(By.className('form-control')));
        inputForm = await driver.findElements(By.className('form-control'));
        await inputForm[0].sendKeys('Viktor');
        await inputForm[1].sendKeys('7188387q');
        await driver.findElement(By.className('btn-warning')).click();

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