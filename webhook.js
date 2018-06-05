'use strict';
const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({
  path: '/webhook',
  secret: 'truechain_xiaojian',
});
const { spawn } = require('child_process');

const runCommand = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  let response = '';
  child.stdout.on('data', buffer => {
    response += buffer.toString();
  });
  child.stdout.on('end', () => callback(response));
};


http.createServer(function(req, res) {
  handler(req, res, function(err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(7777);

handler.on('error', function(err) {
  console.error('Error:', err.message);
});

handler.on('push', function(event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  console.log(event.payload.repository.name, 'name');
  console.log(event.payload.ref, 'ref');

  runCommand('sh', [ './auto_deploy.sh' ], txt => {
    console.log(txt);
  });
});
