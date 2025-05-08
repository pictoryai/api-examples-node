//Here is the list of env variables
//CLIENT_ID
//CLIENT_SECRET
//BASE_URL=https://api.pictory.ai/pictoryapis/
//USER_ID=X-Pictory-User-Id

const dotenv = require("dotenv");
const request = require("./requests");
const c = require("config");
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

(async function () {
  console.log("Step 1/9 Status: Get Authorization Token");
  //Get the authorization token from client id and client secret
  const token = await request.getToken(CLIENT_ID, CLIENT_SECRET);

  console.log("Step 2/9 Status: Searching for videos...");
  const searchResult = await request.searchVideos(
    token,
    "artificial intelligence"
  );

  if (searchResult.length === 0) {
    console.log("No videos found for the given keyword.");
    return;
  }

  console.log("Step 3/9 Status: Preparing storyboard...");

  //When adding background videos manually, we need to slit the text into scenes manually and add background video to each scene
  //The splitTextOnNewLine and splitTextOnPeriod should be set to false because we are manually splitting the text into scenes
  //As we are adding stock videos as background, we will set loopBackgroundVideo and muteBackgroundVideo to true as well.
  const storyboard = {
    videoName: "artificial_intelligence",
    videoDescription: "Artificial Intelligence",
    audio: {
      autoBackgroundMusic: true,
      backGroundMusicVolume: 0.5,
      aiVoiceOver: {
        speaker: "Jackson",
        speed: 100,
        amplifyLevel: 1,
      },
    },
    scenes: [
      {
        text: "Artificial Intelligence (AI) technology refers to the simulation of human intelligence in machines that are programmed to think, learn, and make decisions.",
        voiceOver: true,
        splitTextOnNewLine: false,
        splitTextOnPeriod: false,
        backgroundUri: "",
        backgroundType: "video",
        loopBackgroundVideo: true,
        muteBackgroundVideo: true,
      },
      {
        text: "AI enables computers and systems to perform tasks such as problem-solving, speech recognition, language translation, image processing, and decision-making without explicit human instructions for every step.",
        voiceOver: true,
        splitTextOnNewLine: false,
        splitTextOnPeriod: false,
        backgroundUri: "",
        backgroundType: "video",
        loopBackgroundVideo: true,
        muteBackgroundVideo: true,
      },
      {
        text: "AI is transforming industries such as healthcare, finance, education, and transportation by increasing efficiency, reducing errors, and enabling new innovations.",
        voiceOver: true,
        splitTextOnNewLine: false,
        splitTextOnPeriod: false,
        backgroundUri: "",
        backgroundType: "video",
        loopBackgroundVideo: true,
        muteBackgroundVideo: true,
      },
      {
        text: "However, it also raises important ethical and social questions about privacy, job displacement, and decision-making transparency.",
        voiceOver: true,
        splitTextOnNewLine: false,
        splitTextOnPeriod: false,
        backgroundUri: "",
        backgroundType: "video",
        loopBackgroundVideo: true,
        muteBackgroundVideo: true,
      },
    ],
  };

  //Assign the backgroundUri of each scene to the preview url of the videos/images returned from the search
  for (let i = 0; i < storyboard.scenes.length; i++) {
    storyboard.scenes[i].backgroundUri =
      searchResult[i % searchResult.length].preview.url;
  }

  console.log("Step 4/9 Status: Creating Storyboard...");
  let storyboardJobId = await request.createStoryboard(token, storyboard);

  console.log("Step 5/9 Status: Waiting for Storyboard to complete.");
  let { renderParams, preview } = await request.waitForStoryboardJobToComplete(
    token,
    storyboardJobId
  );

  console.log("step 5/9 Status: Storyboard is created.");
  console.log("Preview URL: ", preview);

  console.log("Step 6/9 Status: Rendering video params...");
  //Pass the renderParams value obtained from the storyboard job to the render video
  //Do not pass the object having attribute renderParams like this: { renderParams }
  //This will cause the render to fail. 
  //We need to pass the value of the renderParams object directly
  //The renderParams object contains the video name, description, and other parameters
  let renderJobId = await request.renderVideoParams(token, renderParams);

  console.log("Step 7/9 Status: Waiting for video render to complete.");
  //wait for the render to complete
  let renderOutput = await request.waitForRenderJobToComplete(
    token,
    renderJobId
  );

  console.log("Step 7/9 Status: Video Render completed.");

  console.log("Step 8/9 Status: Rendering Storyboard Job Output...");

  //If you are not modifying the renderParams values obtained from the storyboard job output,
  //you can use the completed storyboard job Id as well to render the video
  renderJobId = await request.renderStoryboardJob(token, storyboardJobId);

  console.log("Step 9/9 Status: Waiting for Storyboard Render to complete.");
  //wait for the render to complete
  renderOutput = await request.waitForRenderJobToComplete(token, renderJobId);

  console.log("Step 9/9 Status: Storyboard Render completed.");

  console.log(renderOutput);
})();
