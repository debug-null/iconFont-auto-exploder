#!/usr/bin/env node
const path = require("path");
var GetFile = require("./down.js");
var packJson = require( "../../package.json");


if (!packJson.iconFont || !packJson.iconFont.address) {
  console.log("请配置项目地址");
  return;
}

let { address, savePath } = packJson.iconFont;
console.log("address, savePath", address, savePath);

var getFile = new GetFile({
  address,
  savePath,
});
getFile.getUrlCon();
