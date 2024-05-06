# Prerequisites
Ensure you have the following prerequisites installed:

1. NODE VERSION 18 AND ABOVE
3. Pictory API KEYS which include CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id.    

Note: If you don't have your CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id please contact us at *support@pictory.ai*.

# How to run
```
CLIENT_ID=<YOUR_CLIENT_ID> CLIENT_SECRET=<YOUR_CLIENT_SECRET> node index.js
```
`createFinalHighlights` method is called on executing `index.js` file 
# Usage
 1. You can also choose to Update USER_ID,CLIENT_ID and CLIENT_SECRET in .env file.

 2. Run the index.js to initiate the text-to-video conversion process. This will perform the following steps:

     a. **Authentication**: Generate an access token using the provided client ID and client secret.
    
     b. **Upload Video and Generate Transcription**: Upload the video on Pictory s3 bucket and generate text transcription.
    
     c. **Generate Text Summary**: Call Pictory API to generate 1 min text summary. You shall modify `highlightDuration` for longer videos.
    
     d. **Storyboard Creation**: Call the storyboard API with predefined payloads to create a storyboard. Returns a job ID.
         
     e. **Video Rendering**: Call the render endpoint with data obtained from the completed storyboard job. Returns a job ID for rendering.
    
     f. **Download**: Once rendering is complete, download the final video.
  
