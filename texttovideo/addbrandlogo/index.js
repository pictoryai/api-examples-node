const axios = require('axios');
const dotenv = require('dotenv');
const payloads = require('./payload');
const basicpayload = require('../basic/payload')
const basic=require('../basic/comman');
dotenv.config();
const CLIENT_ID =process.env.CLIENT_ID;
const CLIENT_SECRET =process.env.CLIENT_SECRET;


// Calls storyboard API with payload present in payload.js and returns jobid as output
async function createPreviewStoryboard(token) {
  const BASE_URL = process.env.BASE_URL;
  const STORYBOARD_ROUTE = process.env.STORYBOARD_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${STORYBOARD_ROUTE}`;
  const textToVideoPayload = payloads.createStoryboardPayload();
  const headers = basicpayload.setHeaders(token, USER_ID);

  try {
    const response = await axios.post(url, textToVideoPayload, { headers });
    return response.data.jobId;
  } catch (error) {
    console.error(`Error while storyboard: ${error}`);
    return null;
  }
}

  
async function createAddBrandLogoVideo(){
    const token = await basic.getToken(CLIENT_ID, CLIENT_SECRET);
    const jobid = await createPreviewStoryboard(token)
    const data = await basic.waitForStoryboardJobToComplete(token,jobid);
    const rander_jobid=await basic.createVideoRender(token,data);
    const url=await basic.waitForRenderJobToComplete(token,rander_jobid);
    basic.downloadVideo(url,"addbrandlogo.mp4");
  }

  createAddBrandLogoVideo()
