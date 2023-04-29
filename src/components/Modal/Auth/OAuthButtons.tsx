import { Flex, Button, Image } from "@chakra-ui/react";
import React from "react";

const OAuthButtons: React.FC = () => {
  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button variant="oauth" mb={2} onClick={() => {}}>
        <Image
          src="/images/googlelogo.png"
          alt="OAuthGoogle"
          height="20px"
          mr={4}
        />
        Continue with Google
      </Button>
      <Button variant="oauth" mb={2} onClick={() => {}}>
        <Image
          src="/images/github-mark.png"
          alt="OAuthGoogle"
          height="20px"
          mr={4}
        />
        Continue with Github
      </Button>
    </Flex>
  );
};
export default OAuthButtons;
