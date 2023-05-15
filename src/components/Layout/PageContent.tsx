import { Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = { children: React.ReactNode };

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" justify="center" maxWidth="1200px">
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        <Flex
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
          height="0"
          position="sticky"
          top={0}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
