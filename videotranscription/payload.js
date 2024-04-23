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

module.exports={createAuthTokenPayload,createGenerateUrlPayload,createTranscriptionPayload,setHeaders,setAuthHeaders}
  
  
  