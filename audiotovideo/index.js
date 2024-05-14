const axios = require('axios');
var payloads=require('./payload');
const fs = require('fs');
require('dotenv').config();
const CLIENT_ID =process.env.CLIENT_ID;
const CLIENT_SECRET =process.env.CLIENT_SECRET;


// Generates token with clientid and client secret
async function getToken(CLIENT_ID, CLIENT_SECRET) {
    const BASE_URL = process.env.BASE_URL;
    const AUTH_ROUTE = process.env.AUTH_ROUTE;
    const url = `${BASE_URL}${AUTH_ROUTE}`;
    const authPayload = payloads.createAuthTokenPayload(CLIENT_ID, CLIENT_SECRET);
    const payload = JSON.stringify(authPayload);
    const headers = payloads.setAuthHeaders();
  
    try {
      let response =await axios.post(url,payload,{
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
      let response = await axios.post(url,payload, {
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
      const filePath = `${currentDirectory}/${videoPath}`;
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
      return response.data;
    } catch (e) {
      console.error(`Error while get jobid: ${e}`);
      return null;
    }
  }
 // Waits for transcription job to get complete
async function waitForTranscriptionJobToComplete(token, jobid) {
    let response = await getJobId(token, jobid);
    while (JSON.stringify(response).includes('in-progress')) {
      response = await getJobId(token, jobid);
    }
    return response.data;
  }


// Calls storyboard API with payload present in payload.js and returns jobid as output
async function createPreviewStoryboard(token,text,voiceOverUri) {
  const BASE_URL = process.env.BASE_URL;
  const STORYBOARD_ROUTE = process.env.STORYBOARD_ROUTE;
  const USER_ID = process.env.USER_ID;
  const url = `${BASE_URL}${STORYBOARD_ROUTE}`;
  const textToVideoPayload = payloads.createStoryboardPayload(text,voiceOverUri);
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
    let response = await getJobId(token, jobid);
    let renderData = {};
    while (JSON.stringify(response).includes('in-progress')) {
      response = await getJobId(token, jobid);
    }
    renderData.audioSettings = response.data.renderParams.audio;
    renderData.outputSettings = response.data.renderParams.output;
    renderData.scenesSettings = response.data.renderParams.scenes;
    return renderData;
  }
  
  // Calls render endpoint with payload came from storyboard and returns jobid as output
  async function createVideoRender(token, renderData) {
    const BASE_URL = process.env.BASE_URL;
    const RENDER_ROUTE = process.env.RENDER_ROUTE;
    const USER_ID = process.env.USER_ID;
    const url = BASE_URL + RENDER_ROUTE;
    const renderRequestPayload = payloads.createRenderPayload(renderData.audioSettings,renderData.outputSettings,renderData.scenesSettings);
    const headers = payloads.setHeaders(token, USER_ID);
    try {
      const response= await axios.post(url,renderRequestPayload,{headers});
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
    let data = await getJobId(token, jobid);
    while (JSON.stringify(data).includes('in-progress')) {
      data = await getJobId(token, jobid);
    }
    const url = data.data.shareVideoURL;
    return url;
  }
  
  // Download the final video generated
  async function downloadVideo(url,path) {
    const destination = path;
    const writer = fs.createWriteStream(destination);
    const response = await axios.get(url,{ responseType: 'stream' });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
  }
  


async function createAudioToVideo(){
    const token = await getToken(CLIENT_ID, CLIENT_SECRET);
    const data = await generateUploadUrl(token);
    const AUDIO_PATH = process.env.AUDIO_PATH;
    await uploadVideo(data.signedUrl, AUDIO_PATH);
    const jobid = await createTranscription(token, data.url, 'en-US');
    const transcriptiondata = await waitForTranscriptionJobToComplete(token, jobid);
    let text=transcriptiondata.txt;
    let voiceOverUri=data.url;
    let storyboardJobId= await createPreviewStoryboard(token,text,voiceOverUri);
    let renderData= await waitForStoryboardJobToComplete(token,storyboardJobId);
    let renderJobId= await createVideoRender(token,renderData);
    let videoUrl= await waitForRenderJobToComplete(token,renderJobId);
    downloadVideo(videoUrl,"audiotovideo.mp4")

}

createAudioToVideo()
  