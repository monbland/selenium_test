const {Builder, By, Key, until} = require('selenium-webdriver');

//ready

//to-do

async function clickByXPath(xpath) {
    let button = await driver.wait(until.elementLocated(By.xpath(xpath)));
    button = await driver.findElement(By.xpath(xpath));
    await button.click();
}


async function test1(){
    //initialisation of webdriver
    let driver = new Builder().forBrowser('chrome').build();

    //load main page
    await driver.get("https://nova.dev.aetalon.tech/");

    //login starts
    let button = await driver.wait(until.elementLocated(By.xpath("//a[@href='/login']")));
    button = await driver.findElement(By.xpath("//a[@href='/login']"));
    await button.click();
    let inputForm = await driver.wait(until.elementLocated(By.className("form-control")), 2000);
    inputForm = await driver.findElements(By.className("form-control"));
    await inputForm[0].sendKeys("Viktor");
    await inputForm[1].sendKeys("7188387q");
    button = await driver.findElement(By.className("btn-warning"));
    await button.click();
    //login ends

    //test dashboard

    let numbers = await driver.wait(until.elementLocated(By.xpath("//span")));
    numbers = await driver.wait(until.elementTextContains(await driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/div/div/div/div[5]/div[2]/div[4]/div/div/section/section/div/div[1]/div/span")),"."))
    numbers = await driver.findElements(By.xpath("//span"));
    let numbersText = [];
    for (let i = 0; i < numbers.length; i++) {
        let string = await numbers[i].getText();
        numbersText.push(string);
        await console.log(numbersText[i]);
    }

    //test dashboard ends

    setTimeout(
        () => {
            driver.quit();
        },
        5000);
}

test1().then(
    function() {console.log("succ")},
    function(err) {console.error(err)}
).catch(function(err) {
    console.error(err);
});