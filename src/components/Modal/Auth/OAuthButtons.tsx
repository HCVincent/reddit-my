import { auth } from "@/firebase/clientApp";
import { Flex, Button, Image, Text } from "@chakra-ui/react";
import React from "react";
import {
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

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
export default OAuthButtons;
