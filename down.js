const http = require("http");
const fs = require("fs");

class GetFile {
  constructor(obj) {
    this.address = obj.address;
    this.savePath = obj.savePath;
  }

  getUrlCon() {
    let _this = this;
    http
      .get(
        {
          hostname: "at.alicdn.com",
          port: 80,
          path: this.address,
        },
        (req, res) => {
          var html = "";
          req.on("data", function (data) {
            html += data;
          });
          req.on("end", function () {
            if (html.indexOf("svg") === -1) {
              console.log("不存在svg文件，请检查项目信息");
              return;
            }
            _this.getIcons(html);
          });
        }
      )
      .on("error", (e) => {
        console.error(`出现错误: ${e.message}`);
      });
  }

  getIcons(str) {
    var reg = /<symbol .*?>(.*?)<\/symbol\>/g;
    var res = str.match(reg);

    res.forEach((item) => {
      let matchIdReg = /id=".*?(.*?)"/;
      let matchInnerReg = /<symbol .*?>(.*?)<\/symbol\>/;
      let matchRes = item.match(matchIdReg);
      let matchInnerRes = item.match(matchInnerReg);
      if (matchRes) {
        let matchId = matchRes[1];
        let matchInner = matchInnerRes[1];
        let preFix = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 1024 1024">`;
        let suffix = `</svg>`;
        let fileName = `${this.savePath}/${matchId}.svg`;
        let fileInner = preFix + matchInner + suffix;
        this.writeFileFolder(fileName, fileInner, (err) => {
          if (err) console.log(err);
          console.log(`${fileName}---创建成功`);
        });
      }
    });
  }
  // 创建文件夹并写入内容
  writeFileFolder(path, buffer, callback) {
    console.log("GetFile -> writeFileFolder -> path", path);
    let lastPath = path.substring(0, path.lastIndexOf("/"));
    fs.mkdir(lastPath, { recursive: true }, (err) => {
      if (err) return callback(err);
      fs.writeFile(path, buffer, function (err) {
        if (err) return callback(err);
        return callback(null);
      });
    });
  }
}

module.exports = GetFile;
