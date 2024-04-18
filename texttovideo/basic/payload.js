let TEXT_SCENES = [
    'Jacobin sympathisers viewed the Directory as a betrayal of the Revolution, while Bonapartists later justified.',
    'With Royalists apparently on the verge of power, Republicans attempted a pre-emptive coup on 4 September.'
  ];
  
  function createAuthTokenPayload(clientId, clientSecret) {
    return {
      client_id: clientId,
      client_secret: clientSecret
    };
  }
  
  // This function creates audio object used in storyboard payload
  function createAudioObject(aiVoiceOver, autoBackgroundMusic = 'true', backgroundMusicVolume = 0.5) {
    return {
      autoBackgroundMusic: autoBackgroundMusic,
      backGroundMusicVolume: backgroundMusicVolume,
      aiVoiceOver: aiVoiceOver
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
  
  // This function creates scene object used in scenes array
  function createSceneObject(text, fontFamily = 'Roboto', textColor = '#00FF00', fontSize = 32, textBackgroundColor = '#000000', voiceOver = true, splitTextOnNewLine = false, splitTextOnPeriod = true) {
    return {
      text: text,
      fontFamily: fontFamily,
      textColor: textColor,
      fontSize: fontSize,
      textBackgroundColor: textBackgroundColor,
      voiceOver: voiceOver,
      splitTextOnNewLine: splitTextOnNewLine,
      splitTextOnPeriod: splitTextOnPeriod
    };
  }
  
  // This function creates scenes object used in storyboard payload
  function createScenes(textList) {
    let scenes = [];
    for (let text of textList) {
      let scene = createSceneObject(text);
      scenes.push(scene);
    }
    return scenes;
  }
  
// This function creates storyboard payload
function createStoryboardPayload() {
    let payload = {};
    let aivoiceover = createAIVoiceoverObject();
    let audio = createAudioObject(aivoiceover);
    let scenes = createScenes(TEXT_SCENES);
    payload.videoName = 'Text_To_Video_English';
    payload.videoDescription = 'Text_To_Video_English';
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
    createAuthTokenPayload,
    createStoryboardPayload,
    setHeaders,
    setAuthHeaders,
    createRenderPayload,
    createAudioObject,
    createAIVoiceoverObject,
    createSceneObject,
    createScenes
}    