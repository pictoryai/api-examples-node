const payloadobj= require('../basic/payload');

let TEXT_SCENES = [
    'Jacobin sympathisers viewed the Directory as a betrayal of the Revolution, while Bonapartists later justified.',
    'With Royalists apparently on the verge of power, Republicans attempted a pre-emptive coup on 4 September.'
  ];
let videoURI="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"  

function createBackgroundVideoSegments(start,end) {
    const backgroundVideoSegments = [{
      start: start,
      end: end
    }];
    return backgroundVideoSegments;
  }
  // This function creates scene object used in scenes array
  function createSceneObject(text,counter,videoUri=videoURI, fontFamily = 'Roboto', textColor = '#00FF00', fontSize = 32, textBackgroundColor = '#000000', voiceOver = true, splitTextOnNewLine = false, splitTextOnPeriod = true,backgroundType="video") {
    let start=counter*5
    let end=counter*5+5
    let backgroundVideoSegments=createBackgroundVideoSegments(start,end)
    return {
      text: text,
      backgroundUri:videoUri,
      backgroundType:backgroundType,
      fontFamily: fontFamily,
      textColor: textColor,
      fontSize: fontSize,
      textBackgroundColor: textBackgroundColor,
      voiceOver: voiceOver,
      splitTextOnNewLine: splitTextOnNewLine,
      splitTextOnPeriod: splitTextOnPeriod,
      backgroundVideoSegments:backgroundVideoSegments
    };
  }
  
  // This function creates scenes object used in storyboard payload
  function createScenes(textList) {
    let scenes = [];
    let i=0;
    for (let text of textList) {
      let scene = createSceneObject(text,i);
      scenes.push(scene);
      i++;
    }
    return scenes;
  }

// This function creates storyboard payload
function createStoryboardPayload() {
    let payload = {};
    let aivoiceover = payloadobj.createAIVoiceoverObject();
    let audio = payloadobj.createAudioObject(aivoiceover);
    let scenes = createScenes(TEXT_SCENES);
    payload.videoName = 'VisualToVideo';
    payload.videoDescription = 'VisualToVideo';
    payload.language = 'en';
    payload.audio = audio;
    payload.scenes = scenes;
    return payload;
  }

module.exports={
    createStoryboardPayload
}    