const dotenv = require('dotenv');
const comman = require('./common')
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function createTemplateToVideo() {
  console.log("Step 1/6:  Fetching Auth token: Running ");
  const token = await comman.getToken(CLIENT_ID, CLIENT_SECRET);

  const templateData=await comman.createTemplate("Template.pictai",token)

  console.log("Step 2/6 Status: in-progress Generating Video Preview Step.");
  const previewTemplatejobid = await comman.templateToVideoPreview(token,templateData);

  console.log("Step 3/6 Status: Waiting for Video Preview.");
  const data = await comman.waitForPreviewTemplatedJobToComplete(token, previewTemplatejobid);

  console.log("Step 4/6 : Status: in-progress sending Video Generation Request.");
  const rander_jobid = await comman.createTemplateVideoRender(token, data,previewTemplatejobid);

  console.log("Step 5/6: Video generation Request Sent. now waiting for video generation to complete video");
  const url = await comman.waitForRenderJobToComplete(token, rander_jobid);

  comman.downloadVideo(url, "templateToVideo.mp4");
  console.log("Completed: Video downloaded with name templateToVideo.mp4 complete");

}
createTemplateToVideo()
