import { Flex, Image } from "@chakra-ui/react";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
      >
        <Image src="/images/redditFace.svg" height="30px" alt="logo" />
        <Image
          src="/images/redditText.svg"
          height="46px"
          alt="logoText"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
    </Flex>
  );
};
export default Navbar;
