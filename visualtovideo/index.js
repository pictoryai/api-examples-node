const axios = require('axios');
const dotenv = require('dotenv');
const payloads = require('./payload');
const fs = require('fs');
dotenv.config();
const CLIENT_ID =process.env.CLIENT_ID;
const CLIENT_SECRET =process.env.CLIENT_SECRET;

// Generates token with clientid and client secret
async function getToken(CLIENT_ID, CLIENT_SECRET) {
  const BASE_URL = process.env.BASE_URL;
  const AUTH_ROUTE = process.env.AUTH_ROUTE;
  const url = `${BASE_URL}${AUTH_ROUTE}`;
  const authPayload = payloads.createAuthTokenPayload(CLIENT_ID, CLIENT_SECRET);
  const headers = payloads.setAuthHeaders()

  try {
    let response = await axios.post(url, authPayload, {
      headers: headers
    })
    return response.data.access_token;
  } catch (error) {
    console.error(`Error while fetching token: ${error}`);
    return null;
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Waits for storyboard job to get complete
async function waitForStoryboardJobToComplete(token, jobid) {
  let response = {};
  let renderData = {};

  do {
    response = await getJobId(token, jobid);

    if (response.data.status === 'in-progress') {
      console.log(`Please wait, Storyboard job with jobId ${jobid} is still in progress...`);
    }

    await wait(20000); // Wait for 20 seconds before checking again
  } while (response.data.status === 'in-progress')

  renderData.audioSettings = response.data.renderParams.audio;
  renderData.outputSettings = response.data.renderParams.output;
  renderData.scenesSettings = response.data.renderParams.scenes;
  return renderData;
}

// Calls get jobs endpoint to get status of jobid
async function getJobId(token, jobId) {
  const BASE_URL = process.env.BASE_URL;
  const GET_JOB_ROUTE = process.env.GET_JOB_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${GET_JOB_ROUTE}${jobId}`;
  const headers = payloads.setHeaders(token, USER_ID);

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error while get jobid: ${error}`);
    return null;
  }
}

// Calls storyboard API with payload present in payload.js and returns jobid as output
async function createPreviewStoryboard(token) {
  const BASE_URL = process.env.BASE_URL;
  const STORYBOARD_ROUTE = process.env.STORYBOARD_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${STORYBOARD_ROUTE}`;
  const textToVideoPayload = payloads.createStoryboardPayload();
  const headers = payloads.setHeaders(token, USER_ID);

  try {
    const response = await axios.post(url, textToVideoPayload, { headers });
      return response.data.jobId;
  } catch (error) {
    console.error(`Error while storyboard: ${error}`);
    return null;
  }
}

// Calls render endpoint with payload came from storyboard and returns jobid as output
async function createVideoRender(token, renderData) {
  const BASE_URL = process.env.BASE_URL;
  const RENDER_ROUTE = process.env.RENDER_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = BASE_URL + RENDER_ROUTE;
  const renderRequestPayload = payloads.createRenderPayload(renderData.audioSettings, renderData.outputSettings, renderData.scenesSettings);
  const headers = payloads.setHeaders(token, USER_ID);
  try {
    const response = await axios.post(url, renderRequestPayload, { headers });
    let data = await response.data.data;
    const jobid = data.job_id;
    return jobid;
  } catch (e) {
    console.error(`Error while render: ${e}`);
    return null;
  }
}

// Waits for render job to get complete
async function waitForRenderJobToComplete(token, jobid) {

  do {
    data = await getJobId(token, jobid);

    if (data.data.status === 'in-progress') {
      console.log(`Please wait, Video Rendering job with jobId ${jobid} is still in progress...`);
    }
    await wait(60000); // Wait for 60 seconds before checking again

  } while (data.data.status === 'in-progress')

  const url = data.data.shareVideoURL;
  return url;
}

// Download the final video generated
async function downloadVideo(url, path) {
  const destination = path;
  const writer = fs.createWriteStream(destination);
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

  
async function createVisualToVideo(){
    console.log("Step 1/6:  Fetching Auth token: Running ");
    const token = await getToken(CLIENT_ID, CLIENT_SECRET);
  
    console.log("Step 2/6 Status: in-progress Generating Video Preview Step.");
    const jobid = await createPreviewStoryboard(token)
  
    console.log("Step 3/6 Status: Waiting for Video Preview.");
    const data = await waitForStoryboardJobToComplete(token,jobid);
  
    console.log("Step 4/6 : Status: in-progress sending Video Generation Request.");
    const rander_jobid=await createVideoRender(token,data);
  
    console.log("Step 5/6: Video generation Request Sent. now waiting for video generation to complete video");
    const url=await waitForRenderJobToComplete(token,rander_jobid);
  
    downloadVideo(url,"visualToVideo.mp4");
    console.log("Completed: Video downloaded with name visualToVideo.mp4 complete");
    }

  createVisualToVideo()
