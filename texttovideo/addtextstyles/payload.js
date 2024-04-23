const payloadobj= require('../basic/payload');

let TEXT_SCENES = [
    'Jacobin sympathisers viewed the Directory as a betrayal of the Revolution, while Bonapartists later justified.',
    'With Royalists apparently on the verge of power, Republicans attempted a pre-emptive coup on 4 September.'
  ];

//This function creates object of brand logo used in storyboard payload
function createTextStylesObject(textColor = '#FFFF00', fontFamily = 'Roboto', textBackgroundColor = '#FFFF00', fontName = 'Serif', fontSize = 20, verticalAlignment = 'top', horizontalAlignment = 'center') {
  const textStyle = {
    textColor: textColor,
    textBackgroundColor: textBackgroundColor,
    fontFamily: fontFamily,
    fontName: fontName,
    fontSize: fontSize,
    verticalAlignment: verticalAlignment,
    horizontalAlignment: horizontalAlignment
  };
  return textStyle;
}

// This function creates storyboard payload
function createStoryboardPayload() {
    let payload = {};
    let aivoiceover = payloadobj.createAIVoiceoverObject();
    let audio = payloadobj.createAudioObject(aivoiceover);
    let scenes = payloadobj.createScenes(TEXT_SCENES);
    let textStyles=createTextStylesObject()
    payload.videoName = 'Add_Brand_Logo';
    payload.videoDescription = 'Add_Brand_Logo';
    payload.language = 'en';
    payload.audio = audio;
    payload.scenes = scenes;
    payload.textStyles=textStyles;
    return payload;
  }

module.exports={
    createStoryboardPayload
}    