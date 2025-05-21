const payloadobj= require('../basic/payload');

let TEXT_SCENES = [
    'Jacobin sympathisers viewed the Directory as a betrayal of the Revolution, while Bonapartists later justified.',
    'With Royalists apparently on the verge of power, Republicans attempted a pre-emptive coup on 4 September.'
  ];
let LOGO_URL="https://i0.wp.com/www.amazingathome.com/wp-content/uploads/2023/04/pictoryai_logo_main.jpg?fit=1080%2C1080&ssl=1"  

function createBrandLogoObject(url = LOGO_URL, verticalAlignment = 'top', horizontalAlignment = 'left') {
    const brandLogo = {
      url: url,
      verticalAlignment: verticalAlignment,
      horizontalAlignment: horizontalAlignment
    };
    return brandLogo;
  }

// This function creates storyboard payload
function createStoryboardPayload() {
    let payload = {};
    let aivoiceover = payloadobj.createAIVoiceoverObject();
    let audio = payloadobj.createAudioObject(aivoiceover);
    let scenes = payloadobj.createScenes(TEXT_SCENES);
    let brandLogo=createBrandLogoObject()
    payload.videoName = 'Add_Brand_Logo';
    payload.videoDescription = 'Add_Brand_Logo';
    payload.language = 'en';
    payload.audio = audio;
    payload.scenes = scenes;
    payload.brandLogo=brandLogo;
    return payload;
  }

module.exports={
    createStoryboardPayload
}    