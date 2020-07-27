const puppeteer = require('puppeteer-core');
const cookie = require('./cookie')

// 测试
const test = 'https://www.guahao.com/expert/9e44bf23-db09-4e81-986e-d0392ed4d6d6000?hospDeptId=65943d2c-b4e7-4f76-8051-1a34631b4373000&hospitalId=ce1fa639-29f5-4443-a76c-2006e445206e000#guahao'


run(test)
async function run(url=test) {
  const browser = await puppeteer.launch({
    executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false, 
    devtools: true,
    defaultViewport: {
      width: 1000,
      height: 800
    }
  });
  const page = (await browser.pages())[0]

  const arr=Object.entries(cookie).map(([key,value])=>({name:key,value,url:'https://www.guahao.com'}))
  await page.setCookie(...arr);
  page.goto(url) 
  await page.waitForNavigation({
      waitUntil: 'load'
  })
  await page.click('.expert-guahao .valid .item.dept .contain a:nth-of-type(2)');
  await page.waitForSelector('.J_SchedulesItem.schedules-item').then(() => console.log('button加载了'));

}
