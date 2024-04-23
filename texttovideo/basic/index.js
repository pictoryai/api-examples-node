const dotenv = require('dotenv');
const comman = require('./common')
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function createTextToVideo() {
  console.log("Step 1/6:  Fetching Auth token: Running ");
  const token = await comman.getToken(CLIENT_ID, CLIENT_SECRET);

  console.log("Step 2/6 Status: in-progress Generating Video Preview Step.");
  const jobid = await comman.createPreviewStoryboard(token);

  console.log("Step 3/6 Status: Waiting for Video Preview.");
  const data = await comman.waitForStoryboardJobToComplete(token, jobid);

  console.log("Step 4/6 : Status: in-progress sending Video Generation Request.");
  const rander_jobid = await comman.createVideoRender(token, data);

  console.log("Step 5/6: Video generation Request Sent. now waiting for video generation to complete video");
  const url = await comman.waitForRenderJobToComplete(token, rander_jobid);

  comman.downloadVideo(url, "texttovideo.mp4");
  console.log("Completed: Video downloaded with name texttovideo.mp4 complete");

}
createTextToVideo()
