const puppeteer = require('puppeteer-core');
const cookie = require('./cookie')
const schedule = require('node-schedule');

  
const imessage = require('osa-imessage')
let code=null


// 张振周六
const z6 = 'https://www.guahao.com/expert/882843e0-8845-4cec-96b4-25b8956e6be9000?hospDeptId=138181401367203000&hospitalId=0ba4a4af-6a09-47ef-8bc6-6ecd1a7d3bb4000'
// 张振周四
const z4 = 'https://www.guahao.com/expert/95d7cbfc-2990-4dd4-b19e-59c74cea97e1000?hospDeptId=35e8551e-798f-4949-b6c7-5b4d229cba87000&hospitalId=c102e248-751a-4d0b-941d-94a2c33a4e0b000'
// 测试
const test = 'https://www.guahao.com/expert/9e44bf23-db09-4e81-986e-d0392ed4d6d6000?hospDeptId=65943d2c-b4e7-4f76-8051-1a34631b4373000&hospitalId=ce1fa639-29f5-4443-a76c-2006e445206e000#guahao'

const  scheduleCronstyle = ()=>{
    schedule.scheduleJob('58 29 7 * * *',()=>{
        console.log('scheduleCronstyle:' + new Date());
        run(z6)
    }); 
    schedule.scheduleJob('58 29 7 * * *',()=>{
      run(z4)
  }); 
}
// run(test)
scheduleCronstyle();
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
  // await page.goto('https://www.guahao.com/user/login?target=%2F');
  // await page.type('#loginId', '***');    
  // await page.type('#password', 'HE2UYFKWpuJaqbE');
  // await page.click('.gbb.gbt-green');
  // await page.waitForNavigation({
  //     waitUntil: 'load'
  // });//等待页面加载出来，等同于window.onload

  const arr=Object.entries(cookie).map(([key,value])=>({name:key,value,url:'https://www.guahao.com'}))
  await page.setCookie(...arr);
  page.goto(url) 
  await page.waitForNavigation({
      waitUntil: 'load'
  })
  imessage.listen().on('message', async (msg) => {
    console.log(msg.text)
    code= msg.text.match(/\d{6}/ig)[0]
    console.log(code)
    await page.type('.page-my-reservation--mobile-check-input input',code)
  })
  const fn=async()=>{
    await page.click('.expert-guahao .valid .item.dept .contain a:nth-of-type(2)');
    await page.waitForSelector('.J_SchedulesItem.schedules-item').then(() => console.log('button加载了'));
  
    const hasClick=await page.$('.J_SchedulesItem.schedules-item:nth-of-type(2)')
    if(hasClick===null){
      console.log(111)
      await page.reload()
      await fn()
      return
    }
    const canClick=await (await page.$eval('.J_SchedulesItem.schedules-item:nth-of-type(2)', el => el.className)).includes('cannot')
    if(canClick){
      await page.reload()
      await fn()
      return
    }
    try {
      await page.waitFor(50);
  
      await page.tap('.J_SchedulesItem.schedules-item:nth-of-type(2)')
      // await page.screenshot({path: '1.png'});
      await page.click('.J_SchedulesItem.schedules-item:nth-of-type(2)')
      // await page.waitForNavigation({
      //     waitUntil: 'load'
      // })
  
      await page.waitForSelector('button.disease-btn.ivu-btn')
      await page.tap('button.disease-btn.ivu-btn')
      await page.screenshot({path: '2.png'});
      console.log(await page.click('button.disease-btn.ivu-btn'))
      // await page.type('.ivu-input.ivu-input-default', '尚未确诊'); 
      await page.waitFor(() => document.querySelector('.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text input').value.length>0);

      await page.click('input.ivu-checkbox-input')
      await page.screenshot({path: '3.png'});
      await page.click('.submit-btn')


      await page.waitForSelector('.page-my-reservation--mobile-check-input-counter',{visible:true})
      await page.tap('p.page-my-reservation--mobile-check-input-counter') //点击发送
      await page.screenshot({path: '4.png'});
      await page.waitForSelector('.page-my-reservation--mobile-check-input-counter.disabled')
     
     
      await page.waitFor(() => document.querySelector('.page-my-reservation--mobile-check-input input').value.length===6);

      await page.click('.page-my-reservation--mobile-check-submit-btn.ivu-btn')

      
  
    }catch(e){
      console.error(e)
    }
  }
  fn()
  
}
