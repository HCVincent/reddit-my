Once an user created, add a doc on Firestore Database

https://console.firebase.google.com/project
Build -> Functions

```bash
npm install -g firebase-tools
firebase init
```

choose:
Functions: Configure a Cloud Functions directory and its files
Use an existing project
project name
TypeScript
No
Yes

functions/src/index.ts
```ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth.user().onCreate(async (user) => {
    const newUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        providerData: user.providerData
    }
    db.collection("users").doc(user.uid).set(newUser);
});
```

```bash
firebase deploy --only functions
```

second way to achieve same functions above
./components/Modal/Auth/SignUp.tsx
```ts
import {User} from "firebase/auth";
...
const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);
  const createUserDocument = async (user: User) => {
    await addDoc(
      collection(firestore, "users"),
      JSON.parse(JSON.stringify(user))
    );
  };
  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);
```