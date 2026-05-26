/* ===========================================================================
   Crystal Tech - Firebase configuration for client reviews
   ===========================================================================

   This file makes the Reviews section on the homepage shared across ALL
   visitors. Without it, reviews are stored only in each visitor's browser.

   ---------------------------------------------------------------------------
   SETUP (one-time, ~5 minutes)
   ---------------------------------------------------------------------------

   1. Go to https://console.firebase.google.com/ and click "Add project".
      - Name it (e.g. "crystal-tech-reviews"). Disable Google Analytics if
        prompted; you don't need it.

   2. In the project, open "Build > Firestore Database" and click
      "Create database".
      - Choose "Start in production mode".
      - Pick a region close to your users (e.g. us-central or europe-west).

   3. Open the "Rules" tab in Firestore and replace the contents with:

        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /reviews/{review} {
              allow read: if true;
              allow create: if
                request.resource.data.keys().hasAll(['name','text','rating','date'])
                && request.resource.data.name is string
                && request.resource.data.name.size() > 0
                && request.resource.data.name.size() <= 60
                && request.resource.data.text is string
                && request.resource.data.text.size() >= 10
                && request.resource.data.text.size() <= 1000
                && request.resource.data.rating is number
                && request.resource.data.rating >= 1
                && request.resource.data.rating <= 5;
              allow update, delete: if false;
            }
          }
        }

      Click "Publish". These rules let anyone read reviews and submit new
      ones, but prevent anyone from editing or deleting existing reviews.

   4. Back in the project home, click the web icon (</>) under "Get started
      by adding Firebase to your app". Register a nickname (e.g. "crystal
      website"), do NOT enable hosting.

   5. Firebase shows a "firebaseConfig" object. Copy ONLY the values from it
      and paste them into the object below (apiKey, authDomain, etc).

   ---------------------------------------------------------------------------
   PASTE YOUR CONFIG VALUES HERE
   --------------------------------------------------------------------------- */

window.CRYSTAL_FIREBASE_CONFIG = {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

/* Until the values above are replaced with your real Firebase config, the
   reviews feature falls back to localStorage (each visitor sees only their
   own + the seeded testimonials). Once configured, all visitors share the
   same review feed. */
