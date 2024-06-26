
let TEXT_SCENES = [
    'Jacobin sympathisers viewed the Directory as a betrayal of the Revolution, while Bonapartists later justified.',
    'With Royalists apparently on the verge of power, Republicans attempted a pre-emptive coup on 4 September.'
  ];
let videoURI="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"  

function createAuthTokenPayload(clientId, clientSecret) {
  return {
    client_id: clientId,
    client_secret: clientSecret
  };
}

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
  
  // This function creates aivoiceover object used in audio object
  function createAIVoiceoverObject(speaker = 'Jackson', speed = 100, amplifyLevel = 0) {
    return {
      speaker: speaker,
      speed: speed,
      amplifyLevel: amplifyLevel
    };
  }
  
  function createAudioObject(aiVoiceOver, autoBackgroundMusic = 'true', backgroundMusicVolume = 0.5) {
    return {
      autoBackgroundMusic: autoBackgroundMusic,
      backGroundMusicVolume: backgroundMusicVolume,
      aiVoiceOver: aiVoiceOver
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
    let aivoiceover = createAIVoiceoverObject();
    let audio = createAudioObject(aivoiceover);
    let scenes = createScenes(TEXT_SCENES);
    payload.videoName = 'VisualToVideo';
    payload.videoDescription = 'VisualToVideo';
    payload.language = 'en';
    payload.audio = audio;
    payload.scenes = scenes;
    return payload;
  }

  // This function sets headers
  function setHeaders(token, userId) {
    let headers = {};
    headers.Authorization = token;
    headers['X-Pictory-User-Id'] = userId;
    headers['Content-Type'] = 'application/json';
    return headers;
  }
  
  // This function sets headers for auth request
  function setAuthHeaders() {
    let headers = {};
    headers['Content-Type'] = 'application/json';
    return headers;
  }
  
  // This function creates render payload
  function createRenderPayload(audio, output, scenes) {
    let payload = {};
    payload.audio = audio;
    payload.output = output;
    payload.scenes = scenes;
    payload.next_generation_video = true;
    payload.containsTextToImage = true;
    return payload;
  }
  

module.exports={
    createStoryboardPayload,
    createRenderPayload,
    setAuthHeaders,
    setHeaders,
    createAuthTokenPayload
}    