# Pictory Node.js Examples

Pictory is an AI technology company that offers an API for generating videos using artificial intelligence. Our platform allows businesses/individuals to create video content without requiring in-house AI engineers or data scientists.

This repository contains an example implementation of using Pictory Cloud APIs for text-to-video conversion, video transcription generation, and video summary generation in a Node.js environment 

## Text to Video Generation

Pictory's Text-to-Video APIs offer a dynamic way to transform the text into engaging videos.

These APIs allow for the creation and editing of videos based on various text inputs. For instance, if you have a blog or an article, you can easily convert it into a captivating video by simply providing the webpage URL. Text-to-Video APIs open up various possibilities, including:

1. Generating new videos directly from existing text content.
2. Converting your published blogs or articles into videos using their URLs.

# Prerequisites
Ensure you have the following prerequisites installed:

1. NODE VERSION 18 AND ABOVE
3. Pictory API KEYS which include CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id.    

Note: If you don't have your CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id please contact us at *support@pictory.ai*.

# How to run
```shell
CLIENT_ID=<YOUR_CLIENT_ID> CLIENT_SECRET=<YOUR_CLIENT_SECRET> node index.js
```


## Text to Video Examples

1. [Convert Text to Video using Storyboard API](https://github.com/pictoryai/api-examples-node/tree/main/texttovideo/basic) 
2. [Add Brand Logo to your Videos](https://github.com/pictoryai/api-examples-node/tree/main/texttovideo/addbrandlogo) 
3. [Add Text Styles to your Videos](https://github.com/pictoryai/api-examples-node/tree/main/texttovideo/addtextstyles)
4. [Add Intro / Outro scenes to your Videos](https://github.com/pictoryai/api-examples-node/tree/main/texttovideo/introoutro)


# Video Summary and Transcription Examples
1. [Summarize your existing Video](https://github.com/pictoryai/api-examples-node/tree/main/videohighlights)
2. [Burn Subtitles to your existing Video](https://github.com/pictoryai/api-examples-node/tree/main/videotranscription)
