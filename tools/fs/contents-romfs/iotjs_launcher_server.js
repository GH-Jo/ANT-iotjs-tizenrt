var fs = require('fs');
var Buffer = require('buffer');
var http = require('http');
var httpServerPort = 80;
var Server = require('http_server').Server;
var server = undefined;


function http_handler(req, res) {
  var reqBody = '';
  var url = req.url;

  req.on('data', function (chunk) {
    reqBody += chunk;
  });

  var endHandler = function () {
    var isCloseServer = false;
    var resBody = "";
    var errorMsg = "";
    if (req.method == 'GET') {
      var isHtml = false;
      var filePath = undefined;
      if (url.indexOf(".html") >= 0 || url.indexOf(".htm") >= 0) {
        isHtml = true;
      }
      if (url == "/") {
        // index.html
        filePath = "/rom/index.html";
        isHtml = true;
      } else if (isHtml) {
        filePath = "/rom" + url; // html in rom
      } else {
        filePath = "/mnt" + url; // others in mnt
      }
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
      } else {
        resBody = fs.readFileSync(filePath).toString();
        var host = req.headers.Host;
        if (isHtml && (host !== undefined)) {
          resBody = resBody.replace(/IPADDR/gi, host);
        }
        res.writeHead(200, {
          'Content-Length': resBody.length
        });
      }
    } else if (req.method == 'POST') {
      var filePath = "/mnt/index.js";
      var fd = fs.openSync(filePath, 'w');

      var parsingState = "ContentBody";
      var reqBodyLines = reqBody.split(/\r?\n/);
      for (var i in reqBodyLines) {
        var line = reqBodyLines[i];
        if (parsingState == "ContentBody") {
          if (line.indexOf("------") >= 0) {
            parsingState = "ContentHeader";
          }
        } else if (parsingState == "ContentHeader") {
          if (line.indexOf("Content-Type") >= 0) {
            if (line.indexOf("filename") >= 0) {
              parsingState = "JSHeader";
            }
          } else if (line.length == 0) {
            parsingState = "ContentBody";
          }
        } else if (parsingState == "JSHeader") {
          if (line.length == 0) {
            parsingState = "JSBody";
          }
        } else if (parsingState == "JSBody") {
          if (line.indexOf("------") >= 0) {
            parsingState = "ContentHeader";
          } else {
            var lineBuffer = new Buffer(line);
            fs.writeSync(fd, lineBuffer, 0, lineBuffer.length);
          }
        }
      }
      fs.closeSync(fd);
      console.log("Write to " + filePath + " success!");
      console.log("Contents: " + reqBody);
    } else {
      res.writeHead(403);
    }

    if (url == "/close.html") {
      isCloseServer = true;
    }

    res.write(resBody);
    res.end(function () {
      if (isCloseServer) {
        console.log("close the server");
        server.close();
      }
    });
  };

  req.on('end', endHandler);
}

function app_main() {
  server = http.createServer(http_handler);
  server.listen(httpServerPort, function () {
    console.log("\n\nIoT.js Launcher: installer server starts: port=" + httpServerPort);
  });
}
app_main();