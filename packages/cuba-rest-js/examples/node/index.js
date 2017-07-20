global.fetch = require('node-fetch');
global.localStorage = new require('node-localstorage').LocalStorage('./.local-storage');

const cuba = require('../../dist-node/cuba.js');

const app = cuba.initializeApp({apiUrl: 'http://localhost:8080/app/rest/'});

app.getUserInfo().then((d) => {
  console.log(d);
});

app.login('admin', 'admin').then((d) => {
  console.log(d);
});