# Prerequisites
Ensure you have the following prerequisites installed:

1. NODE VERSION 18 AND ABOVE
3. Pictory API KEYS which include CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id.    

Note: If you don't have your CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id please contact us at *support@pictory.ai*.

# How to run
```
CLIENT_ID=<YOUR_CLIENT_ID> CLIENT_SECRET=<YOUR_CLIENT_SECRET> node index.js
```

# Usage
 1. You can also choose to Update USER_ID,CLIENT_ID and CLIENT_SECRET in .env file.

 2. Run the index.js to initiate the text-to-video conversion process. This will perform the following steps:

     a. **Authentication**: Generate an access token using the provided client ID and client secret.

     b. **Storyboard Creation**: Call the storyboard API with predefined payloads to create a storyboard. Returns a job ID.
     
     c. **Waiting for Storyboard Job**: Monitor the status of the storyboard job until it completes.
     
     d. **Video Rendering**: Call the render endpoint with data obtained from the completed storyboard job. Returns a job ID for rendering.
     
     e. **Waiting for Render Job**: Monitor the status of the rendering job until it completes.
     
     f. **Download**: Once rendering is complete, download the final video.

### Sample Storyboard Request Body
```json
{
    "videoName": "Sino-Japanese-War", 
    "videoDescription": "History about First China Japan War ", 
    "language": "en", 
    "webhook": "https://webhook.site/f817c508-0cce-486c-a74d-4537759b077f",
    "brandLogo": {
    "url":"https://pictory.ai/wp-content/uploads/2022/03/logo-new-fon-2t.png", 
    "verticalAlignment": "top" , 
    "horizontalAlignment": "right"
    },
    "audio": {
        "autoBackgroundMusic": true, 
        "backGroundMusicVolume": 0.5, 
        "aiVoiceOver": {
            "speaker": "Adam", 
            "speed": 100, 
            "amplifyLevel": 0 
        }
    },
    "textStyles":{
    "fontFamily": "Roboto",
    "textColor": "#7000FD",
    "fontSize": 36,
    "textBackgroundColor": "#FFFFFF",
    "verticalAlignment": "bottom",
    "horizontalAlignment": "center"
    },
    "scenes": [
        {
            "text": "The First Sino-Japanese War (25 July 1894 – 17 April 1895) or the First China–Japan War was a conflict between the Qing dynasty and Empire of Japan primarily over influence in Korea.",
            "voiceOver": true,
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true 
        }
        {
            "text": "After more than six months of unbroken successes by Japanese land and naval forces and the loss of the port of Weihaiwei, the Qing government sued for peace in February 1895.",
            "voiceOver": true, 
            "textBackgroundColor": "#000000",
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true,  
            "horizontalAlignment": "right"
        },
        {
            "text": "The war demonstrated the failure of the Qing dynasty's attempts to modernize its military and fend off threats to its sovereignty, especially when compared with Japan's successful Meiji Restoration.",
            "voiceOver": true, 
            "textColor": "#FFFFFF",
            "textBackgroundColor": "#000000",
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true, 
            "fontStyle": "italic", //normal, italic"
            "horizontalAlignment": "right",
            "verticalAlignment": "top"
        },
        {
            "text": "For the first time, regional dominance in East Asia shifted from China to Japan;",
            "voiceOver": true, //AI voice reads the text
            "textDecoration": "underline",
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true, 
            "horizontalAlignment": "center",
            "verticalAlignment": "bottom"
        },
                {
            "text": "the prestige of the Qing dynasty, along with the classical tradition in China, suffered a major blow.",
            "voiceOver": true, //AI voice reads the text
            "textDecoration": "underline",
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true, 
            "horizontalAlignment": "center",
            "verticalAlignment": "bottom"
        },
        {
            "text": "The humiliating loss of Korea as a tributary state sparked an unprecedented public outcry.",
            "voiceOver": true, //AI voice reads the text
            "keywordColor": "#000000",
            "fontStyle": "italic",
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true 
        },
        {
            "text": "Within China, the defeat was a catalyst for a series of political upheavals led by Sun Yat-sen and Kang Youwei, culminating in the 1911 Revolution and ultimate end of dynastic rule in China.",
            "voiceOver": true, //AI voice reads the text
            "keywordColor": "#000000",
            "textDecoration": "underline",
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true 
        },
        {
            "text": "Thank You for watching. This video demonstrated the Pictory API's capability to add the Brand Logo and apply Text Styles",
            "voiceOver": true,
            "fontSize": 32,
            "fontWeight": "bold",
            "splitTextOnNewLine": false, 
            "splitTextOnPeriod": true,
            "horizontalAlignment": "center",
            "verticalAlignment": "center"
        }
    ],
    "voiceOver": true, //AI voice reads the text
    "splitTextOnNewLine": false, //Split scenes on '\n' in text
    "splitTextOnPeriod": true //Split scenes at periods

}
```

# Customization
You can customize the video output settings and audio settings by modifying the payload functions in payload.js. Adjust the parameters according to your preferences.

# Output
The final video will be saved as texttovideo/texttovideo.mp4 in the project directory.

