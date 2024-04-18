// This function creates payload for auth request
function createAuthTokenPayload(clientId, clientSecret) {
    const payload = {
      client_id: clientId,
      client_secret: clientSecret
    };
    return payload;
  }
  
  // This function creates genrate url payload
  function createGenerateUrlPayload(filename) {
    const payload = {
      contentType: 'video/mp4',
      fileName: filename
    };
    return payload;
  }
  
  // This function creates transcription payload
  function createTranscriptionPayload(fileUrl, language, webhook) {
    const payload = {
      fileUrl: fileUrl,
      mediaType: "video",
      language: language,
      webhook: webhook
    };
    return payload;
  }
  
  // This function sets headers
  function setHeaders(token, userId) {
    const headers = {
      Authorization: token,
      'X-Pictory-User-Id': userId,
      'Content-Type': 'application/json'
    };
    return headers;
  }
  
  // This function sets headers for auth request
  function setAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    return headers;
  }
  // This function creates audio object used in storyboard payload
  function createAudioObject(voiceOverUri, autoBackgroundMusic = 'true', backgroundMusicVolume = 0.5) {
    return {
      autoBackgroundMusic: autoBackgroundMusic,
      backGroundMusicVolume: backgroundMusicVolume,
      voiceOverUri: voiceOverUri,
      autoSyncVoiceOver: true
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
  function createScenes(text) {
    let texts = text.trim();
    let scenes = [];
    let textList = texts.split('.');
    for (let i = 0; i < textList.length; i++) {
      if (textList[i].length > 0) {
        let scene = createSceneObject(textList[i]);
        scenes.push(scene);
      }
    }
    return scenes;
  }

// This function creates storyboard payload
function createStoryboardPayload(text,voiceOverUri) {
    let payload = {};
    let audio = createAudioObject(voiceOverUri);
    let scenes = createScenes(text);
    payload.videoName = 'Text_To_Video_English';
    payload.videoDescription = 'Text_To_Video_English';
    payload.language = 'en';
    payload.audio = audio;
    payload.scenes = scenes;
    return payload;
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
  createGenerateUrlPayload,
  createTranscriptionPayload,
  setHeaders,
  setAuthHeaders,
  createRenderPayload,
  createStoryboardPayload
}
  
  
  