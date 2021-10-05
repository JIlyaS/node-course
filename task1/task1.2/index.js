const express = require('express');

const app = express();

const DATE_END = process.env.DATE_END;
const DELAY = process.env.DELAY;
const PORT = 3000;

let connections = [];

app.get('/date', (req, res, next) => {
 res.setHeader('Content-Type', 'text/html; charset=utf-8');
 res.setHeader('Transfer-Encoding', 'chunked');
 connections.push(res);

 if (+new Date(new Date()) >= +new Date(DATE_END)) {
    res.write(`Current date: ${new Date(new Date().toUTCString())}\n`);
    res.end();
 }
});

setTimeout(function run () {
  console.log(`${new Date(new Date().toUTCString())}`);
  if (+new Date(new Date()) >= +new Date(DATE_END)) {
    connections.map((res) => {
        res.write(`Current date: ${new Date(new Date().toUTCString())}\n`);
        res.end();
    });
    connections = [];
  }
  connections.map((res, index) => {
    res.write(`${new Date(new Date().toUTCString())}\n`);
  });
  setTimeout(run, DELAY);
}, DELAY);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

