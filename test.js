"use strict";

const AWS = require("aws-sdk");
const https = require("https");
const querystring = require("querystring");
const Sharp = require("sharp");

const S3 = new AWS.S3({
  signatureVersion: "v4",
  region: "ap-northeast-2",
});
const BUCKET = "liontime-images";
const ORIGINAL_IMAGE_URL = "https://mandarin.api.weniv.co.kr";

exports.handler = async (event, context, callback) => {
  const { request, response } = event.Records[0].cf;
  const {
    w: width,
    h: height,
    originalFormat,
  } = querystring.parse(request.querystring);
  const imageName = request.uri.match(/\/(.+)\.(.+)/)[1];
  // gif를 제외한 이미지는 webp로 변환한다.
  const targetFormat = originalFormat === "gif" ? "gif" : "webp";


  console.log("request", JSON.stringify(request));
  console.log("response", JSON.stringify(response));

  let resizedImage;

  // 오리진에 해당 이미지 없음
  if (response.status >= 400) {
    const imageBuffer = await fetchImage(
      `${ORIGINAL_IMAGE_URL}/${imageName}.${originalFormat}`
    );
  }

  resizedImage = await resize(imageBuffer);

  // 오리진에 해당 이미지 있음

  // 리사이즈 한 이미지 버킷에 저장
  await S3.putObject({
    Bucket: BUCKET,
    Key: `${imageName}.${targetFormat}`,
    Body: resizedImage,
  }).promise();

  // 응답객체 업데이트
  const updatedResponse = updateResponse(response, resizedImage, forma);

  return callback(null, updatedResponse);
};

async function resize(imageBuffer, width, height, targetFormat) {
  let resizedImage;
  let quality = 100;
  let byteLength = 0;

  while (true) {
    resizedImage = await Sharp(imageBuffer)
      .resize(width, height)
      .toFormat(targetFormat, { quality })
      .toBuffer();

    byteLength = Buffer.byteLength(resizedImage, "base64");

    // 리사이즈된 이미지의 용량이 1MB를 넘고 품질이 60 이상이라면
    // 품질을 낮춰서 다시 리사이즈 한다.
    if (byteLength >= MB(1) && quality >= 60) quality -= 10;
    else break;
  }

  return resizedImage;
}

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];

      res.on("data", (chunk) => {
        data.push(chunk);
      });

      res.on("end", () => {
        resolve(Buffer.concat(data));
      });

      res.on("error", (error) => {
        reject(error);
      });
    });
  });
}

function updateResponse(response) {
  
  return updatedResponse;
}

function MB(n) {
  return n * 1024 * 1024;
}
