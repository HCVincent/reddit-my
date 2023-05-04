./firebase/errors.ts
```ts
export const FIREBASE_ERRORS = {
    "Firebase: Error (auth/email-already-in-use).": "A user with that email already exists.",
    "Firebase: Error (auth/user-not-found).": "Invalid email or password.",
    "Firebase: Error (auth/wrong-password).": "Invalid email or password."
}
```

./components/Modal/Auth
```ts
      {(error || userError) && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
```