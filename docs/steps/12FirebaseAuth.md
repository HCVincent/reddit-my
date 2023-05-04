https://console.firebase.google.com/project/my-reddit-7b581/authentication/providers
Build -> Authentication -> Sign-in method, Enable Google, Github(needing Client ID && Client secret)

here to get Github Client ID && Client secret
https://github.com/settings/profile 
settings -> Devloper settings -> OAuth Apps -> New OAuth App

https://github.com/CSFrequency/react-firebase-hooks/tree/master/auth#usesigninwithgoogle
```tsx
const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInWithGithub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(auth);
  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={googleLoading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src="/images/googlelogo.png"
          alt="OAuthGoogle"
          height="20px"
          mr={4}
        />
        Continue with Google
      </Button>
      <Button
        variant="oauth"
        mb={2}
        isLoading={githubLoading}
        onClick={() => signInWithGithub()}
      >
        <Image
          src="/images/github-mark.png"
          alt="OAuthGoogle"
          height="20px"
          mr={4}
        />
        Continue with Github
      </Button>
      {(googleError || githubError) && (
        <Text>{googleError?.message || githubError?.message}</Text>
      )}
    </Flex>
  );
};
```