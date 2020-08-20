const { createWorker } = require('tesseract.js');
const image='data:image/png;base64,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'

const worker = createWorker();

(async () => { 
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(image);
  console.log(text);
  await worker.terminate();
})();