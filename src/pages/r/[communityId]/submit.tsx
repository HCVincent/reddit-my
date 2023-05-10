import PageContent from "@/components/Layout/PageContent";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import useCommunityData from "@/hooks/useCommunityData";
import NewPostForm from "@/components/Posts/NewPostForm";

type submitProps = {};

const submit: React.FC<submitProps> = () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();
  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>create a post</Text>
        </Box>
        {user && <NewPostForm />}
      </>
      <></>
    </PageContent>
  );
};
export default submit;
