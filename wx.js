const puppeteer = require('puppeteer-core');
const schedule = require('node-schedule');
const { createWorker } = require('tesseract.js');
const cookie = require('./cookie')

const worker = createWorker();

const startTime=new Date()
const url='https://h5.shqmxx.com/Resource.aspx?CustomerId=94&Pri=DD.rqcF/6iOr6WVgbQMBKQ0NMIyFGWwzlB0IuuSrURManmJ2fVGOZETpXSDvs0m94KIUHhSnLUWvgJ4B1Em8JIPVWi7tEHYkXxmTUlJaXEAMqxcQiDK/P2hRHomypZaH30SDFrxu3sGnNgr7QYa9IZxwolMVSjFNntyVBb1LOCyMSlKaz/XKkzqo9kuWqAymfouqznWCm7LFng_qFn8zwAQ8qad/K/vyvOrHPXygsghbQ7K7nMSW0h8j/ybFe9VPggloV5OWm9IZmmUPOYOeMnGNRWs7tw03rm8O5fQ4KNyk5ILXLdGkXgRsA==&UiServiceId=gh_79eafca4e31a&UItype=wx&IsMenu=1&Version=1.1'
// const url="https://h5.shqmxx.com/Resource.aspx?CustomerId=94&Pri=DD.rqcF/6iOr6WVgbQMBKQ0NMIyFGWwzlB0IuuSrURManmJ2fVGOZETpXSDvs0m94KIUHhSnLUWvgJ4B1Em8JIPVWi7tEHYkXxmTUlJaXEAMqxcQiDK/P2hRHomypZaH30SdZGZwCw_o2vSS9WvSSoUTiGcaM7lK1stVeIS7qQLm/bVbGDWNm1bIIPdducWUd1FllkwMCCKWau7ZQr8/8c1q5ouvsLSS1tdisq6lsssdYixC0WprE1FkKBAbZUU07bput8Uu69oxl9y1IaSeLgZnw==&UiServiceId=gh_79eafca4e31a&UItype=wx&IsMenu=1&Version=1.1"
const  scheduleCronstyle = ()=>{
    schedule.scheduleJob('58 29 7 * * *',()=>{
        console.log('scheduleCronstyle:' + new Date());
        run(z6)
    });  
}
run()
// scheduleCronstyle();
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

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) MicroMessenger/6.8.0(0x16080000) MacWechat/2.4.2(0x12040201) NetType/WIFI WindowsWechat');
  await page.setViewport({ 
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        isLandscape: false,
        width: 400,
        height: 800})

  const arr=Object.entries(cookie).map(([key,value])=>({name:key,value,url:'https://h5.shqmxx.com/Resource.aspx'}))
  await page.setCookie(...arr);
  page.goto(url) 
  await page.waitForNavigation({
      waitUntil: 'load'
  })
  const fn=async()=>{
    await page.waitForSelector('.list-item.list-button[data-pri]').then(() => console.log('button加载了'));
    await page.click('.list-item.list-button[data-pri]');
  
    const hasClick=await page.$('.list-item.list-button[data-pri]')
    if(hasClick===null){
      console.log(111)
      await page.reload()
      await fn()
      return
    }
    try {

      await page.waitForSelector('.data-alert.alert-body.list-icon-round',{visible:true})
      await page.tap('.list-panel-r.priclick[data-pri]')
      await page.screenshot({path: '1-1.png'});


      await page.waitForSelector('.layermchild.layermanim',{visible:true})
      await page.tap('.layermbtn:nth-of-type(2)')
 
      await page.waitForSelector('.btn-submit.btn-lg[name="btnDoBespeak"]',{visible:true})
      await page.screenshot({path: '1-2.png'});
      const image=await page.$eval('.form-box.form-box-none img', el => el.src)
      // console.log(image)

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(image);
      console.log(text);
      await worker.terminate();

      await page.type('input',text.replace(/[^a-zA-Z0-9]+/g,''))
      await page.click('.btn-submit.btn-lg[name="btnDoBespeak"]')
      const endTime=new Date()
      console.log(difTime(startTime,endTime))

    }catch(e){
      console.error(e)
    }
  }
  fn()
  
}
function difTime(sTime, eTime) {
  var timeType =1000;
  return `${parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType))}秒`;
}

