const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const USER_ID = process.env.USER_ID;

// Generates token with clientid and client secret
async function getToken(CLIENT_ID, CLIENT_SECRET) {
  const url = `${BASE_URL}${"v1/oauth2/token"}`;
  const authPayload = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    let response = await axios.post(url, authPayload, {
      headers: headers,
    });
    return response.data.access_token;
  } catch (error) {
    console.error(`Error while fetching token: ${error}`);
    return null;
  }
}

async function searchVideos(token, keyword) {
  const url = `${BASE_URL}${"v1/media/search"}`;
  const headers = {
    Authorization: token,
    "X-Pictory-User-Id": USER_ID,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, { headers, params: { keyword } });
    if (response.data?.data?.searchResults) {
      return response.data?.data?.searchResults;
    }
    return [];
  } catch (error) {
    console.error(`Error in visual search: ${error}`);
    return [];
  }
}

async function createStoryboard(token, storyboard) {
  const url = `${BASE_URL}${"v1/video/storyboard"}`;
  const headers = {
    Authorization: token,
    "X-Pictory-User-Id": USER_ID,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, storyboard, { headers });
    return response.data.jobId;
  } catch (error) {
    console.error(`Error while storyboard: ${error}`);
    return null;
  }
}

// Waits for storyboard job to get complete
async function waitForStoryboardJobToComplete(token, jobid) {
  let response = {};

  do {
    response = await getJob(token, jobid);

    if (response.data.status === "in-progress") {
      console.log(
        `Please wait, Storyboard job with jobId ${jobid} is still in progress...`
      );
    }

    await wait(10); // Wait for 10 seconds before checking again
  } while (response.data.status === "in-progress");

  return response.data;
}

async function renderVideoParams(token, renderParams) {
  const url = BASE_URL + "v1/video/render";
  const headers = {
    Authorization: token,
    "X-Pictory-User-Id": USER_ID,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, renderParams, { headers });
    let data = await response.data.data;
    const jobid = data.job_id;
    return jobid;
  } catch (e) {
    console.error(`Error while render: ${e}`);
    return null;
  }
}

async function renderStoryboardJob(token, jobId) {
  const url = `${BASE_URL}${"v1/video/render"}/${jobId}`;
  const headers = {
    Authorization: token,
    "X-Pictory-User-Id": USER_ID,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.put(url, {}, { headers });
    let data = await response.data.data;
    const jobid = data.job_id;
    return jobid;
  } catch (e) {
    console.error(`Error while render: ${e}`);
    return null;
  }
}

async function waitForRenderJobToComplete(token, jobid) {
  do {
    data = await getJob(token, jobid);

    if (data.data.status === "in-progress") {
      console.log(
        `Please wait, Video Rendering job with jobId ${jobid} is still in progress...`
      );
    }
    await wait(60); // Wait for 60 seconds before checking again
  } while (data.data.status === "in-progress");

  return data.data;
}

// Calls get jobs endpoint to get status of jobid
async function getJob(token, jobId) {
  const url = `${BASE_URL}${"v1/jobs/"}${jobId}`;
  const headers = {
    Authorization: token,
    "X-Pictory-User-Id": USER_ID,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error while get jobid: ${error}`);
    return null;
  }
}

function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

module.exports = {
  getToken,
  searchVideos,
  createStoryboard,
  waitForStoryboardJobToComplete,
  renderVideoParams,
  renderStoryboardJob,
  waitForRenderJobToComplete,
};
