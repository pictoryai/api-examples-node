//Here is the list of env variables
//CLIENT_ID
//CLIENT_SECRET
//BASE_URL=https://api.pictory.ai/pictoryapis/
//USER_ID=X-Pictory-User-Id

const dotenv = require("dotenv");
const request = require("./requests");
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

(async function () {
  console.log("Step 1/3 Status: Get Authorization Token");
  //Get the authorization token from client id and client secret
  const token = await request.getToken(CLIENT_ID, CLIENT_SECRET);

  //Create Storyboard scenes with subtitles having bulletin animation
  const storyboard = {
    videoName: "AP news",
    videoDescription: "Thunderbolts and Sinners",
    language: "en",
    scenes: [
      {
        story: "Thunderbolts and Sinners top box office charts once more",
        background: {
          visualUrl:
            "https://brandsettings-prod.pictorycontent.com/public/58b25118-3ffe-4eba-9d8d-8ef1631411d5/images/1fcd27d2-4a00-4833-9d6d-5455bf4f085f.PNG",
          type: "image",
          settings: {
            zoomAndPan: false,
          },
        },
        subtitleStyle: {
          animations: [
            {
              name: "bulletin",
              type: "entry",
              speed: "medium",
            },
            {
              name: "bulletin",
              type: "exit",
              speed: "medium",
            },
          ],
          showBullet: true,
          showBoxBackground: true,
          bulletSize: 20,
          bulletFillColor: "rgba(235, 68, 2, 1)",
        },
      },
    ],
  };

  
  console.log("Step 2/3 Status: Render Storyboard...");
  let storyboardJobId = await request.renderStoryboard(token, storyboard);

  console.log("Step 3/3 Status: Waiting for Storyboard render to complete.");
  let renderOutput = await request.waitForRenderJobToComplete(
    token,
    storyboardJobId
  );

  console.log("Step 3/3 Status: Storyboard Render completed.");

  console.log(renderOutput);
})();
