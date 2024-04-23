const payloadobj= require('../basic/payload');
const INTRO="Welcome to Pictory club";
const OUTRO="Thank you";

let TEXT_SCENES = [INTRO,
    'Jacobin sympathisers viewed the Directory as a betrayal of the Revolution, while Bonapartists later justified.',
    'With Royalists apparently on the verge of power, Republicans attempted a pre-emptive coup on 4 September.',OUTRO
  ];

// This function creates storyboard payload
function createStoryboardPayload() {
    let payload = {};
    let aivoiceover = payloadobj.createAIVoiceoverObject();
    let audio = payloadobj.createAudioObject(aivoiceover);
    let scenes = payloadobj.createScenes(TEXT_SCENES);
    payload.videoName = 'Intro_Outro';
    payload.videoDescription = 'Intro_Outro';
    payload.language = 'en';
    payload.audio = audio;
    payload.scenes = scenes;
    return payload;
  }

module.exports={
    createStoryboardPayload
}    