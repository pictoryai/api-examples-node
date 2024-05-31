# Prerequisites
Ensure you have the following prerequisites installed:

1. NODE VERSION 18 AND ABOVE
3. Pictory API KEYS which include CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id.    

Note: If you don't have your CLIENT_ID, CLIENT_SECRET and X-Pictory-User-Id please contact us at *support@pictory.ai*.

# How to run
```
CLIENT_ID=<YOUR_CLIENT_ID> CLIENT_SECRET=<YOUR_CLIENT_SECRET> node index.js
```

Steps to generate Bulk Videos are given below:

STEP 1: Create Project File
Create the Video Template from the Pictory Web App. Mention the text variables you want to customize as {{...}}
![image](https://github.com/pictoryai/api-examples-node/assets/154496499/d82c2164-723f-4173-a248-c91449137240)



STEP 2: Download Project File
Download the project file with extension .pictai from projects section.
![image](https://github.com/pictoryai/api-examples-node/assets/154496499/f5319cea-b982-46c4-89a8-614ee24e3188)




STEP 3: Upload the project and GET Template Id
API EndPoint: https://api.pictory.ai/pictoryapis/v1/templates

Sample API Request

cURL
```
curl --location 'https://api.pictory.ai/pictoryapis/v1/templates' \
--header 'X-Pictory-User-Id: <YOUR_USER_ID>' \
--header 'Authorization: <ACCESSTOKEN> ' \
--header 'Content-Type: application/octet-stream' \
--data '@FileName.pictai'
```
Sample API Response

JSON
```
{
    "templateId": "20240527091000991sKaqhDfBxdREvFs",
    "name": "Pending Loan Payment(",
    "language": "en",
    "audio": {
        "musicUrl": "BACKGROUND_MUSIC_URL",
        "musicVolume": 0.1,
        "aiVoice": {
            "speaker": "AI_VOICE_SPEAKER",
            "speed": 100,
            "amplifyLevel": 0
        }
    },
    "scenes": [
        {
            "sceneId": "20240527090959872RhZaJ4Lyp1jYb18",
            "subtitles": [
                {
                    "text": "Dear {{customer_name}},"
                }
            ],
            "backgroundVisual": {
                "visualUrl": "https://media.gettyimages.com/id/1460325253/video/handshake-congratulations-and-business-people-meeting-welcome-or-thank-you-for-success.mp4?b=1&s=mp4-640x640-gi&k=20&c=yAbN8GJxxWDVsj-yX-iV4vG_k4-_7IJdBA94D2M30T0=",
                "type": "video"
            }
        },
    ],
    "variables": {
        "customer_name": "CUSTOMER_NAME",
        "payment_date": "PAYMENT_DATE",
        "loan_account_number": "LOAN_ACCOUNT_NUMBER",
        "customer_support_number": "CUSTOMER_SUPPORT_NUMBER",
        "support_email_id": "SUPPORT_EMAIL_ID"
    }
}
```
To modify the scene text or visual URL, use PUT Template API.


Step 5: Update Variables and Generate Preview
You can update the text variables using the from-template API Request.

JSON
```
curl --location 'https://api.pictory.ai/pictoryapis/v1/video/from-template' \
--header 'X-Pictory-User-Id: <YOUR_PICTORY_USER_ID>' \
--header 'Authorization: <YOUR_ACCESS_TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "templateId": "20240529110124913jThMoLFesQuJa9C",
     "variables": {
        "customer_name": "Pete Bennette",
        "payment_date": "27-May-2024",
        "loan_account_number": "0977699670 ",
        "customer_support_number": "180007343922323",
        "support_email_id": "support@pictory.ai"
    }
}'
```
```
RESPONSE
{
    "success": true,
    "data": {
        "jobId": "981e84c8-bd06-4a65-a791-d4a3da315c2a"
    }
}
```
Step 6: Check Video Preview and Generate Video.
You can check video preview status by passing jobId in GET Job API and use Render API to generate the Final Video.

