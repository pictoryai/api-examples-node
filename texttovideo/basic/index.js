const dotenv = require('dotenv');
const comman = require('./comman')
dotenv.config();
const CLIENT_ID =process.env.CLIENT_ID;
const CLIENT_SECRET =process.env.CLIENT_SECRET;
  
  async function createTextToVideo(){
    const token = await comman.getToken(CLIENT_ID, CLIENT_SECRET);
    const jobid = await comman.createPreviewStoryboard(token)
    const data = await comman.waitForStoryboardJobToComplete(token,jobid);
    const rander_jobid=await comman.createVideoRender(token,data);
    const url=await comman.waitForRenderJobToComplete(token,rander_jobid);
    comman.downloadVideo(url,"texttovideo.mp4");
  }
  createTextToVideo()
