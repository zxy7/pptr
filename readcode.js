
// const iMessage = require('apple-imessage');
// const im = new iMessage();

// (async () => {
  
  //   const messages = await im.getMessages();
  //   console.log(messages);
  
  // })();
  
const imessage = require('osa-imessage')
let code=null
imessage.listen().on('message', (msg) => {
  console.log(msg.text)
  code= msg.text.match(/\d{6}/ig)[0]
  console.log(code)
})