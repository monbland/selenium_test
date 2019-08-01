import * as webdriver from 'node_modules/selenium-webdriver';
//рабочие функции

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

//неполностью рабочие функции


// async function test() {
//     driver.get('https://nova.dev.aetalon.tech');
//     await clickByXPath("//a[@href='/login']");
//
//     let inputForm = await driver.wait(until.elementLocated(By.className('form-control')));
//     inputForm = await driver.findElements(By.className('form-control'));
//     await inputForm[0].sendKeys('Viktor');
//     await inputForm[1].sendKeys('7188387q');
//     await driver.findElement(By.className('btn-warning')).click();
//
//
//
//     await setTimeout(() => {
//         driver.quit().then();
//     }, 10000);
// }

function test() {
    let driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.get('http://www.google.com');

    let element = driver.findElement(By.name('q'));
    element.sendKeys('Cheese!');
    element.submit();

    driver.getTitle().then(function(title) {
        console.log('Page title is: ' + title);
    });

    driver.wait(function() {
        return driver.getTitle().then(function(title) {
            return title.toLowerCase().lastIndexOf('cheese!', 0) === 0;
        });
    }, 3000);

    driver.getTitle().then(function(title) {
        console.log('Page title is: ' + title);
    });

    driver.quit();
}
try {
    test();
}
catch(err) {
    console.log(err.message);
}