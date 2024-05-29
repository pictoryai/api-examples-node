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
  
  // This function creates highlights payload
  function createHighlightsPayload(transcript, highlightDuration, webhookUrl) {
    const payload = {
      transcript: transcript,
      highlight_duration: highlightDuration,
      webhook: webhookUrl
    };
    return payload;
  }
  function prepareStoryboardPayload(fileUrl, transcribeResult) {
    let storyBoardJob = {
      videoName: "highlight_video",
      scenes: []
    };
    transcribeResult.transcript.forEach((sentence) => {
      let sentenceText = sentence.words.reduce((acc, item) => {
        if (item.word.length > 0 && item.highlight) {
          acc = acc + " " + item.word;
        }
        return acc;
      }, "");


      let backgroundSegments = [];

      sentence.words.forEach(word => {
        if (word.highlight){
        let segment = {
            start: word.start_time,
            end: word.end_time
        };
        backgroundSegments.push(segment);
      }
    });

      if(transcribeResult && sentenceText.length>0)
      storyBoardJob.scenes.push({
        text: sentenceText,
        backgroundUri: fileUrl,
        backgroundType: "video",
        backgroundVideoSegments: backgroundSegments,
        voiceOver: false,
        splitTextOnNewLine: false,
        splitTextOnPeriod: false,
        subtitle: true
      });
    });
    console.log(storyBoardJob)
    return storyBoardJob;
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

module.exports={createAuthTokenPayload,createGenerateUrlPayload,createTranscriptionPayload,setHeaders,setAuthHeaders,createHighlightsPayload,prepareStoryboardPayload,createRenderPayload}
  
  
  