# Text-to-Video Voiceover Update Example

This project demonstrates how to update voiceover text in a video using the Pictory API. The script shows how to modify text content while maintaining the original video structure and timing.

## Overview

The script performs the following steps:
1. Creates an initial storyboard with text content
2. Waits for the storyboard generation to complete
3. Extracts and modifies the text from the generated scenes
4. Creates a new storyboard with updated text
5. Renders the final video with the updated voiceover

## Prerequisites

- Node.js installed
- Pictory API credentials (Client ID and Client Secret)
- Environment variables configured

## Environment Variables

Create a `.env` file with the following variables:
```
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
USER_ID=your_user_id
BASE_URL=api_base_url
AUTH_ROUTE=auth_endpoint
STORYBOARD_ROUTE=storyboard_endpoint
RENDER_ROUTE=render_endpoint
GET_JOB_ROUTE=job_status_endpoint
```

## Features

- Automatic background music selection
- AI voiceover with customizable speaker, speed, and amplification
- Text processing with HTML tag removal
- Scene timing preservation
- Background visual filtering

## Usage

1. Install dependencies:
```bash
npm install
```

2. Configure your environment variables in `.env`

3. Run the script:
```bash
node index.js
```

## How It Works

1. **Initial Storyboard Creation**: Creates a storyboard with initial text content and voiceover settings
2. **Text Extraction**: Extracts text from each scene's sub-scenes, removing HTML formatting
3. **Text Modification**: Updates the extracted text while preserving scene structure
4. **New Storyboard Generation**: Creates a new storyboard with the modified text
5. **Final Rendering**: Renders the video with updated voiceover while maintaining original timing

## Example Output

The script will output progress updates for each step:
```
Step 1/6 Status: in-progress Generating Storyboard Step.
Step 2/6 Status: Waiting for Storyboard to complete.
Step 3/6 Status: Creating a new storyboard with updated text in the voiceover.
Step 4/6 Status: Waiting for Storyboard to complete.
Step 5/6 Status: Rendering the updated storyboard.
Step 6/6 Status: Waiting for Render to complete.
```

## Notes

- The script preserves the original scene timing and structure
- HTML tags are automatically removed from the text
- Background music and visual settings are maintained
- The voiceover settings (speaker, speed, amplification) can be customized in the initial storyboard configuration
