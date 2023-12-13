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
 - NOTION_DATABASE_ID: Booking Database ID. Can get through Notion Marina Mediterranea Notion, via the [URL](https://www.notion.so/0aac587c9c8a4ad9b52c7a138efb3111?v=478876de6de64c12b88331d2efc05d44&pvs=4) you can get the Id.
 - NEXT_PUBLIC_GOOGLE_API_KEY: We use it to complete and validate the user address.
 - NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID: You ca get it in the google drive when click on share and copy link [URL](https://drive.google.com/drive/u/0/folders/1cSvd3MvYsZ9LCRtI038Mz5IjWWcYIEv1) THE Id is from after /folder

### Application state

What information do we have in the application state or context (Which is shared with all the applications)

For example User login information [Local Storage]
