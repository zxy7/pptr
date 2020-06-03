const puppeteer = require('puppeteer');
const cookie = require('./cookie')

async function run() {
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
  // await page.goto('https://www.guahao.com/user/login?target=%2F');
  // await page.type('#loginId', '***');    
  // await page.type('#password', 'HE2UYFKWpuJaqbE');
  // await page.click('.gbb.gbt-green');
  // await page.waitForNavigation({
  //     waitUntil: 'load'
  // });//等待页面加载出来，等同于window.onload

  const arr=Object.entries(cookie).map(([key,value])=>({name:key,value,url:'https://www.guahao.com'}))
  await page.setCookie(...arr);
  // page.goto('https://www.guahao.com/expert/882843e0-8845-4cec-96b4-25b8956e6be9000?hospDeptId=138181401367203000&hospitalId=0ba4a4af-6a09-47ef-8bc6-6ecd1a7d3bb4000')
  page.goto('https://www.guahao.com/expert/9e44bf23-db09-4e81-986e-d0392ed4d6d6000?hospDeptId=65943d2c-b4e7-4f76-8051-1a34631b4373000&hospitalId=ce1fa639-29f5-4443-a76c-2006e445206e000#guahao')
  await page.waitForNavigation({
      waitUntil: 'load'
  })

  await page.click('.expert-guahao .valid .item.dept .contain a:nth-of-type(2)');
  await page.waitForSelector('.J_SchedulesItem.schedules-item').then(() => console.log('button加载了'));

  try {
    await page.waitFor(1000);
    await page.tap('.J_SchedulesItem.schedules-item:nth-of-type(2)')
    await page.screenshot({path: '1.png'});
    await page.click('.J_SchedulesItem.schedules-item:nth-of-type(2)')
    // await page.waitForNavigation({
    //     waitUntil: 'load'
    // })

    await page.screenshot({path: '2.png'});
    await page.waitForSelector('a.gb.gb-grey1.J_NoDisease')
    await page.tap('a.gb.gb-grey1.J_NoDisease')
    await page.click('input.J_Agreement')

  }catch(e){
    console.error(e)
  }
}

run();
