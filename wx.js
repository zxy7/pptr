const puppeteer = require('puppeteer-core');
const schedule = require('node-schedule');
const { createWorker } = require('tesseract.js');
const cookie = require('./cookie-wx')

const worker = createWorker();

const startTime=new Date()
const url='https://h5.shqmxx.com/Resource.aspx?CustomerId=94&Pri=DD.EJxmsmZnYsr3cUcm6DdY2BtBo5H5t6N2wWHOZSxFmbVRrZxW56SZQvl2s2hZICv3hZaV1p1gKUGVCIU7f5SBFLbxlrymlJI0mCqyyCYbiSvtsbxmmmkF_34PDI3uln3LTMlflFVNwvrV5V4K6xqs12_5SvK6nty9MI4VlkMEalHXr/GkpFXcUluyHXVHcqQIbDgg0VbyICxDEkEXcO/PRcsgsS8/Lo30JV0WIS5Gzkrlp6nMsFzs7kn_GFDyE69CYtYARlV5oP8=&UiServiceId=gh_79eafca4e31a&UItype=wx&IsMenu=1&Version=1.1'
const  scheduleCronstyle = ()=>{
    schedule.scheduleJob('59 29 7 * * *',()=>{
        console.log('scheduleCronstyle:' + new Date());
        run()
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
  let n=0
  const fn=async()=>{
    await page.waitForSelector('.list-item.list-button')
    const hasClick=await page.$('.list-item.list-button[data-pri]')
    if(hasClick===null){
      console.log(n)
      if(n>30) return
      n=n+1
      await page.reload()
      await fn()
      return
    }
    await page.waitForSelector('.list-item.list-button[data-pri]').then(() => console.log('button加载了')).catch(error=>console.log("hhhhh",error));
    await page.click('.list-item.list-button[data-pri]');
  
 
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

