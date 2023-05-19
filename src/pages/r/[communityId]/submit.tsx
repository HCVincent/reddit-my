import PageContent from "@/components/Layout/PageContent";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import useCommunityData from "@/hooks/useCommunityData";
import NewPostForm from "@/components/Posts/NewPostForm";
import About from "@/components/Community/About";

type submitProps = {};

const submit: React.FC<submitProps> = () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();
  return (
    <PageContent>
      <>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default submit;
