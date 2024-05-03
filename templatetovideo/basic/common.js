const axios = require('axios');
const dotenv = require('dotenv');
const payloads = require('./payload');
const fs = require('fs');
dotenv.config();

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

// Calls storyboard API with payload present in payload.js and returns jobid as output
async function templateToVideoPreview(token,templateData) {
  const BASE_URL = process.env.BASE_URL;
  const VIDEO_TEMPLATE_ROUTE = process.env.VIDEO_TEMPLATE_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${VIDEO_TEMPLATE_ROUTE}`;
  const templateToVideoPayload = payloads.createTemplateToVideoPayload(templateData);
  const headers = payloads.setHeaders(token, USER_ID);

  try {
    const response = await axios.post(url, templateToVideoPayload, { headers });
    return response.data.data.jobId;
  } catch (error) {
    console.error(`Error while storyboard: ${error}`);
    return null;
  }
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
// Waits for storyboard job to get complete
async function waitForPreviewTemplatedJobToComplete(token, jobid) {
  let response = {};
  let renderData = {};

  do {
    response = await getJobId(token, jobid);

    if (response.data.status === 'in-progress') {
      console.log(`Please wait, preview job with jobId ${jobid} is still in progress...`);
    }

    await wait(20000); // Wait for 20 seconds before checking again
  } while (response.data.status === 'in-progress')

  renderData.audioSettings = response.data.renderParams.audio;
  renderData.outputSettings = response.data.renderParams.output;
  renderData.scenesSettings = response.data.renderParams.scenes;
  return renderData;
}

// Calls render endpoint with payload came from storyboard and returns jobid as output
async function createTemplateVideoRender(token, renderData,jobId) {
  const BASE_URL = process.env.BASE_URL;
  const RENDER_ROUTE = process.env.RENDER_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${RENDER_ROUTE}/${jobId}`;
  const renderRequestPayload = payloads.createRenderTemplatePayload(renderData.audioSettings, renderData.outputSettings, renderData.scenesSettings);
  const headers = payloads.setHeaders(token, USER_ID);
  try {
    const response = await axios.put(url, renderRequestPayload, { headers });
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

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

async function createTemplate(templatePath,token){
  const USER_ID = process.env.USER_ID;
  const BASE_URL = process.env.BASE_URL;
  const TEMPLATE_ROUTE=process.env.TEMPLATE_ROUTE;
  headers=payloads.setTemplateHeaders(token,USER_ID);
  const url = BASE_URL + TEMPLATE_ROUTE;
  const currentDirectory = process.cwd();
  console.log("Current directory:", currentDirectory);
  const filePath = `${currentDirectory}/${templatePath}`;
  const fileContent = fs.readFileSync(filePath);
  const config = {
  headers: headers,
  data: fileContent, 
  };
  try{
    const response=await axios.post(url, fileContent, { headers });
    console.log('Template created successfully');
    console.log('Response:', response.data);
    return response.data
  }
  catch(e) {
    console.error(`Error while creating template: ${e}`);
  }
}

module.exports = {
  getToken,
  waitForPreviewTemplatedJobToComplete,
  createTemplateVideoRender,
  waitForRenderJobToComplete,
  downloadVideo,
  templateToVideoPreview,
  createTemplate
}
