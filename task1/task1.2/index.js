const express = require('express');

const app = express();

const DATE_END = process.env.DATE_END;
const DELAY = process.env.DELAY;
const PORT = 3000;

app.get('/date', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  let dateInterval;
  
  setTimeout(() => {
    clearInterval(dateInterval);
    console.log(`Current date: ${new Date(new Date().toUTCString())}\n`);
    res.write(`Current date: ${new Date(new Date().toUTCString())}\n`);
    res.end();
    process.exit();
  }, +new Date(DATE_END) - +new Date(new Date()));

  dateInterval = setInterval(() => {
    console.log(`${new Date(new Date().toUTCString())}`);
    res.write(`Current date: ${new Date(new Date().toUTCString())}\n`);
  }, DELAY);

});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

