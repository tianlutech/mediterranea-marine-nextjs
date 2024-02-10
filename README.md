# Frontend Readme

Make a short briefing

### Set Up

- Installation (npm install or yarn install)

### Run

- How to run the project (npm run dev or yarn dev)

## Deployment

Notes for deployment, or brief about the pipeline configurations

URL of the existing environments

### Stack

What main libraries are used, with a link to the documentation? (I'm not talking about all the dependencies, but I am talking about the most important 3rd parties)

- Tailwind
- Form Validation
- Router
- Toasts and warnings

### File Structure


### IU Components

Which are the reusable common components, We don't want buttons, cards, or IU to look different across the portal.

Which is the color code? 

Components
 - Booking
 - common
 - modal
 - sidebar

### Env variables

All the values are also accessible from the [credentials page](https://www.notion.so/tianlu/Mediterranea-Marina-Credentials-218f712be104457e8e865f3037471d86?pvs=4) page.

 - NOTION_SECRET: Notion Integration to save data in the notion database. The key is in Marina Mediterranea Notion
 - NEXT_PUBLIC_GOOGLE_API_KEY: We use it to complete and validate the user address.
 - NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID: You ca get it in the google drive when click on share and copy link [URL](https://drive.google.com/drive/u/0/folders/1cSvd3MvYsZ9LCRtI038Mz5IjWWcYIEv1) THE Id is from after /folder
- NEXT_PUBLIC_GOOGLE_PROJECT_ID: we use it in google drive api we find this in the credentials json file from  the google console
- NEXT_PUBLIC_GOOGLE_PRIVATE_KEY_ID: we use it in google drive api we find this in the credentials json file from  the google console
- NEXT_PUBLIC_GOOGLE_PRIVATE_KEY: we use it in google drive api we find this in the credentials json file from  the google console
- NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL: we use it in google drive api we find this in the credentials json file from  the google console
- NEXT_PUBLIC_GOOGLE_CLIENT_ID: we use it in google drive api we find this in the credentials json file from  the google console
- NEXT_PUBLIC_GOOGLE_CLIENT_X509_CERT_URL: we use it in google drive api we find this in the credentials json file from  the google console
- NEXT_PUBLIC_SKIP_BOOKING_STEPS: Add the steps by comma (from the file steps-actions) to skip some sensibles or charged steps during the booking validation
- WHATSAPP_TOKEN: To send messages on the message bulk functionality to whatsapp numbers. You can get a temporal one in the application [API Config](https://developers.facebook.com/apps/6964882823566210/whatsapp-business/wa-dev-console/?business_id=2330989420463473) but you require permissions.
For the production was is generated as a system user in the facebook business section (pretty complex)
- PDFMONKEY_API_KEY: This API key you can get it from the PDF monkey in the account page or in notion env variables [PDF Monkey URL](https://dashboard.pdfmonkey.io/account)

### Application state

What information do we have in the application state or context (Which is shared with all the applications)

For example User login information [Local Storage]
