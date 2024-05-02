const axios = require('axios');
var payloads = require('./payload');
const fs = require('fs');
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;


// Generates token with clientid and client secret
async function getToken(CLIENT_ID, CLIENT_SECRET) {
  const BASE_URL = process.env.BASE_URL;
  const AUTH_ROUTE = process.env.AUTH_ROUTE;
  const url = `${BASE_URL}${AUTH_ROUTE}`;
  const authPayload = payloads.createAuthTokenPayload(CLIENT_ID, CLIENT_SECRET);
  const payload = JSON.stringify(authPayload);
  const headers = payloads.setAuthHeaders();

  try {
    let response = await axios.post(url, payload, {
      headers: headers
    })
    return response.data.access_token;
  } catch (e) {
    console.error(`Error while fetching token: ${e}`);
    return null;
  }
}

async function generateUploadUrl(token) {
  const BASE_URL = process.env.BASE_URL;
  const GENERATEURL_ROUTE = process.env.GENERATEURL_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${GENERATEURL_ROUTE}`;
  const headers = payloads.setHeaders(token, USER_ID);
  const generateUrlPayload = payloads.createGenerateUrlPayload('testvideo.mp4');
  const payload = JSON.stringify(generateUrlPayload);

  try {
    let response = await axios.post(url, payload, {
      headers: headers
    });
    return response.data.data;
  } catch (e) {
    console.error(`Error while generate url: ${e}`);
    return null;
  }
}
// Upload video function
async function uploadVideo(url, videoPath) {
  const headers = { "Content-Type": "video/mp4" };
  const currentDirectory = process.cwd();
  console.log("Current directory:", currentDirectory);

  const videoData = await new Promise((resolve, reject) => {
    //const filePath = `${currentDirectory}/${videoPath}`;
    const filePath = `${videoPath}`;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  try {
    let response = await axios.put(url, videoData, { headers });
    console.log("Video uploaded successfully!");
    return response
  } catch (e) {
    console.error(`Error uploading video: ${e}`);
  }
}

// Create transcription function
async function createTranscription(token, fileUrl, language) {
  const BASE_URL = process.env.BASE_URL;
  const TRANSCRIPTION_ROUTE = process.env.TRANSCRIPTION_ROUTE;
  const USER_ID = process.env.USER_ID;
  const WEBHOOK_URL = process.env.WEBHOOK_URL;
  const url = `${BASE_URL}${TRANSCRIPTION_ROUTE}`;
  const transcriptionPayload = payloads.createTranscriptionPayload(fileUrl, language, WEBHOOK_URL);
  const headers = payloads.setHeaders(token, USER_ID);

  try {
    let response = await axios.post(url, transcriptionPayload, { headers });
    const jobId = response.data.data.jobId;
    return jobId;
  } catch (e) {
    console.error(`Error while storyboard: ${e}`);
    return null;
  }
}

// Get job status function
async function getJobId(token, jobId) {
  const BASE_URL = process.env.BASE_URL;
  const GET_JOB_ROUTE = process.env.GET_JOB_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${GET_JOB_ROUTE}${jobId}`;
  const headers = payloads.setHeaders(token, USER_ID);

  try {
    let response = await axios.get(url, { headers });
    return response.data.data;
  } catch (e) {
    console.error(`Error while get jobid: ${jobId} ${e}`);
    throw new Error(`Error while get jobid: ${jobId} ${e}`);
  }
}
// Waits for transcription job to get complete
/* async function waitForTranscriptionJobToComplete(token, jobid) {
  let response = await getJobId(token, jobid);
  while (JSON.stringify(response).includes('in-progress')) {
    response = await getJobId(token, jobid);
  }
  return response;
} */

// Calls render endpoint with payload came from storyboard and returns jobid as output
async function createHighlights(token, transcriptdata) {
  const BASE_URL = process.env.BASE_URL;
  const HIGHLIGHTS_ROUTE = process.env.HIGHLIGHTS_ROUTE;
  const WEBHOOK_URL = process.env.WEBHOOK_URL;
  const USER_ID = process.env.USER_ID;
  const url = BASE_URL + HIGHLIGHTS_ROUTE;
  const renderRequestPayload = payloads.createHighlightsPayload(transcriptdata.transcript, 60, WEBHOOK_URL);
  const headers = payloads.setHeaders(token, USER_ID);
  const payload = JSON.stringify(renderRequestPayload);
  try {
    let response = await axios.post(url, payload, {
      headers: headers
    });
    return response.data.data.jobId;
  } catch (e) {
    console.error(`Error while highlights: ${e}`);
    return null;
  }
}

// Waits for highlights job to get complete
async function waitForJobToComplete(jobName, token, jobid, pollDuration) {
  /* let data = await getJobId(token, jobid);
  while (JSON.stringify(data).includes('in-progress')) {
    data = await getJobId(token, jobid);
  } */

  do {
    response = await getJobId(token, jobid);

    if (response.status === 'in-progress') {
      console.log(`Please wait, ${jobName} job with jobId ${jobid} is still in progress...`);
    }
    await wait(pollDuration * 1000); // Wait for `pollDuration` seconds before checking again
  } while (response.status === 'in-progress')
  return response;
}

// Calls storyboard API with payload present in payload.js and returns jobid as output
async function createPreviewStoryboard(token, fileUrl, highlightData) {
  const BASE_URL = process.env.BASE_URL;
  const STORYBOARD_ROUTE = process.env.STORYBOARD_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${STORYBOARD_ROUTE}`;
  const textToVideoPayload = payloads.prepareStoryboardPayload(fileUrl, highlightData);
  const headers = payloads.setHeaders(token, USER_ID);

  try {
    const response = await axios.post(url, textToVideoPayload, { headers });
    return response.data.jobId;
  } catch (error) {
    console.error(`Error while storyboard: ${error}`);
    return null;
  }
}
// Waits for storyboard job to get complete
async function waitForStoryboardJobToComplete(token, jobid) {
  let response = {};
  let renderData = {};

  do {
    response = await getJobId(token, jobid);

    if (response.status === 'in-progress') {
      console.log(`Please wait, Storyboard job with jobId ${jobid} is still in progress...`);
    }

    await wait(20000); // Wait for 20 seconds before checking again
  } while (response.status === 'in-progress')

  renderData.audioSettings = response.renderParams.audio;
  renderData.outputSettings = response.renderParams.output;
  renderData.scenesSettings = response.renderParams.scenes;
  return renderData;
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

    if (data.status === 'in-progress') {
      console.log(`Please wait, Video Rendering job with jobId ${jobid} is still in progress...`);
    }
    await wait(60000); // Wait for 60 seconds before checking again

  } while (data.status === 'in-progress')

  const url = data.shareVideoURL;
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

async function createFinalHighlights() {
  const token = await getToken(CLIENT_ID, CLIENT_SECRET);

  console.log("Step 1/6 Status: Uploading Video...");

  const data = await generateUploadUrl(token);
  const VIDEO_PATH = process.env.VIDEO_PATH;
  await uploadVideo(data.signedUrl, VIDEO_PATH);

  console.log("Step 2/6 Status: Generating Transcription");
  const jobid = await createTranscription(token, data.url, 'en-US');
  const transcriptiondata = await waitForJobToComplete("Transcription", token, jobid, 20);

  const highlightjobid = await createHighlights(token, transcriptiondata);
  const highlightdata = await waitForJobToComplete("Highlights", token, highlightjobid, 60);
  console.log(highlightdata);

  const storyboardJobId = await createPreviewStoryboard(token, data.url, highlightdata)
  console.log("Step 3/6 Status: Waiting for Video Preview.");
  const renderData = await waitForJobToComplete("Storyboard", token, storyboardJobId, 20);

  console.log("Step 4/6 : Status: in-progress sending Video Generation Request.");
  const rander_jobid = await createVideoRender(token, renderData);

  console.log("Step 5/6: Video generation Request Sent. now waiting for video generation to complete video");
  const url = await waitForJobToComplete("Render", token, rander_jobid, 60);

  downloadVideo(url, "highlights.mp4");
  console.log("Completed: Video downloaded with name highlights.mp4 complete");
}

createFinalHighlights()
