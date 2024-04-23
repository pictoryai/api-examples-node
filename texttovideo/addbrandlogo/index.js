const axios = require('axios');
const dotenv = require('dotenv');
const payloads = require('./payload');
const basicpayload = require('../basic/payload')
const basic=require('../basic/common');
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
  console.log("Step 1/6:  Fetching Auth token: Running ");
  const token = await basic.getToken(CLIENT_ID, CLIENT_SECRET);

  console.log("Step 2/6 Status: in-progress Generating Video Preview Step.");
  const jobid = await createPreviewStoryboard(token)

  console.log("Step 3/6 Status: Waiting for Video Preview.");
  const data = await basic.waitForStoryboardJobToComplete(token,jobid);

  console.log("Step 4/6 : Status: in-progress sending Video Generation Request.");
  const rander_jobid=await basic.createVideoRender(token,data);

  console.log("Step 5/6: Video generation Request Sent. now waiting for video generation to complete video");
  const url=await basic.waitForRenderJobToComplete(token,rander_jobid);

  basic.downloadVideo(url,"addbrandlogo.mp4");
  console.log("Completed: Video downloaded with name addbrandlogo.mp4 complete");
  }

  createAddBrandLogoVideo()
