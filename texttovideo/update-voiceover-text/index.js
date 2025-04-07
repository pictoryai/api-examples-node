//Here is the list of env variables
//CLIENT_ID
//CLIENT_SECRET
//USER_ID
//BASE_URL
//AUTH_ROUTE
//STORYBOARD_ROUTE
//RENDER_ROUTE
//GET_JOB_ROUTE

const dotenv = require("dotenv");
const request = require("./requests");
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function updateVoiceoverText() {
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
        text: "Artificial Intelligence (AI) technology refers to the simulation of human intelligence in machines that are programmed to think, learn, and make decisions. AI enables computers and systems to perform tasks such as problem-solving, speech recognition, language translation, image processing, and decision-making without explicit human instructions for every step. AI is transforming industries such as healthcare, finance, education, and transportation by increasing efficiency, reducing errors, and enabling new innovations. However, it also raises important ethical and social questions about privacy, job displacement, and decision-making transparency.",
        voiceOver: true,
        splitTextOnNewLine: false,
        splitTextOnPeriod: true,
        backgroundVisualFilter: {
          category: "Technology",
        },
      },
    ],
  };

  //Get the authorization token from client id and client secret
  const token = await request.getToken(CLIENT_ID, CLIENT_SECRET);

  console.log("Step 1/6 Status: in-progress Generating Storyboard Step.");
  let jobid = await request.createStoryboard(token, storyboard);

  console.log("Step 2/6 Status: Waiting for Storyboard to complete.");
  let { renderParams, preview } = await request.waitForStoryboardJobToComplete(
    token,
    jobid
  );

  //Prepare storyboard scenes from render params to update the scene text and create a new storyboard with updated text in the voiceover
  let scenes = [];
  for (let i = 0; i < renderParams.scenes.length; i++) {
    let scene = renderParams.scenes[i];
    let sceneObject = {
      ...storyboard.scenes[0],
      text:
        scene.sub_scenes
          .reduce((acc, curr) => {
            // Extract text from each text_line in the sub_scene
            const textFromLines = curr.text_lines.reduce(
              (lineAcc, line) => lineAcc + " " + line.text,
              ""
            );
            // Remove HTML tags and add to accumulator
            return acc + " " + textFromLines;
          }, "")
          .trim() + " I have updated this text.",
      splitTextOnNewLine: false,
      splitTextOnPeriod: false,
      backgroundUri: scene.background.src[0].url,
      backgroundType: scene.background.src[0].type,
      loopBackgroundVideo: scene.background.src[0].loop_video,
      muteBackgroundVideo: scene.background.src[0].mute,
    };
    scenes.push(sceneObject);
  }

  //assign the updated scenes to the storyboard
  storyboard.scenes = scenes;

  console.log(
    "Step 3/6 Status: Creating a new storyboard with updated text in the voiceover."
  );
  //create a new storyboard with updated text in the voiceover
  jobid = await request.createStoryboard(token, storyboard);

  console.log("Step 4/6 Status: Waiting for Storyboard to complete.");
  let { renderParams: updatedRenderParams, preview: updatedPreview } =
    await request.waitForStoryboardJobToComplete(token, jobid);

  //Now you have an updated storyboard with updated text in the voiceover, if you want to use the orginal render params with new text and new voiceover,
  // and new scene timings, lets modify the original render params with updated render params
  renderParams.audio.tts = updatedRenderParams.audio.tts;
  for (let i = 0; i < renderParams.scenes.length; i++) {
    renderParams.scenes[i].sub_scenes =
      updatedRenderParams.scenes[i].sub_scenes;
    renderParams.scenes[i].time = updatedRenderParams.scenes[i].time;
    renderParams.scenes[i].subtitles = updatedRenderParams.scenes[i].subtitles;
  }

  console.log("Step 5/6 Status: Rendering the updated storyboard.");
  //render the updated storyboard
  const renderJobId = await request.renderStoryboard(token, renderParams);

  console.log("Step 6/6 Status: Waiting for Render to complete.");
  //wait for the render to complete
  const renderOutput = await request.waitForRenderJobToComplete(
    token,
    renderJobId
  );
  console.log(renderOutput);
  console.log("Render completed.");
}
updateVoiceoverText();
