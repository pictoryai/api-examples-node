let introText = "Hi Bhaskar"
let outroText="Thanks Bhaskar"
  
  function createAuthTokenPayload(clientId, clientSecret) {
    return {
      client_id: clientId,
      client_secret: clientSecret
    };
  }
  
  
  // This function creates scene object used in scenes array
  function createIntroSceneObject(text,insertBeforeSceneId ,fontFamily = 'Roboto', textColor = '#00FF00', fontSize = 32, textBackgroundColor = '#000000', voiceOver = true, splitTextOnNewLine = false, splitTextOnPeriod = true) {
    return {
      insertBeforeSceneId:insertBeforeSceneId,
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
  function createOutroSceneObject(text,insertAfterSceneId ,fontFamily = 'Roboto', textColor = '#00FF00', fontSize = 32, textBackgroundColor = '#000000', voiceOver = true, splitTextOnNewLine = false, splitTextOnPeriod = true) {
    return {
      insertAfterSceneId: insertAfterSceneId,
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
  
  
// This function creates storyboard payload
function createTemplateToVideoPayload(templateData) {
    let payload = {};
    scenes=[];
    payload.templateId=templateData.templateId;
    n=templateData.scenes.length;
    insertBeforeSceneId=templateData.scenes[0].sceneId;
    insertAfterSceneId=templateData.scenes[n-1].sceneId;
    introScene=createIntroSceneObject(introText,insertBeforeSceneId);
    outroScene=createOutroSceneObject(outroText,insertAfterSceneId);
    scenes.push(introScene);
    scenes.push(outroScene);
    payload.scenes=scenes
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
  function createRenderTemplatePayload(audio, output, scenes) {
    let payload = {};
    payload.audio = audio;
    payload.output = output;
    payload.scenes = scenes;
    payload.next_generation_video = true;
    payload.containsTextToImage = true;
    return payload;
  }
  
  // This function sets headers for auth request
  function setTemplateHeaders(token, userId) {
    let headers = {};
    headers.Authorization = token;
    headers['X-Pictory-User-Id'] = userId;
    headers['Content-Type'] = 'application/octet-stream';
    return headers;
  }

module.exports={
    createAuthTokenPayload,
    createTemplateToVideoPayload,
    setHeaders,
    setAuthHeaders,
    createRenderTemplatePayload,
    setTemplateHeaders
}    