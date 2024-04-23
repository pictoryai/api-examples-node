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
      return response.data.data;
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
    return response;
  }
  
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
      let response = await axios.post(url, payload,{
        headers: headers
      });
      return response.data.data.jobId;
    } catch (e) {
      console.error(`Error while highlights: ${e}`);
      return null;
    }
  }
  
  // Waits for highlights job to get complete
  async function waitForHighlightsJobToComplete(token, jobid) {
    let data = await getJobId(token, jobid);
    while (JSON.stringify(data).includes('in-progress')) {
      data =await getJobId(token, jobid);
    }
    return data;
  }
async function createFinalHighlights(){
const token = await getToken(CLIENT_ID, CLIENT_SECRET);
const data = await generateUploadUrl(token);
const VIDEO_PATH = process.env.VIDEO_PATH;
await uploadVideo(data.signedUrl, VIDEO_PATH);
const jobid = await createTranscription(token, data.url, 'en-US');
const transcriptiondata = await waitForTranscriptionJobToComplete(token, jobid);
const highlightjobid = await createHighlights(token, transcriptiondata);
const highlightdata = await waitForHighlightsJobToComplete(token, highlightjobid);
console.log(highlightdata);  
}

createFinalHighlights()
  