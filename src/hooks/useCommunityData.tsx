import { communityState } from "@/atoms/communitiesAtom";
import React from "react";
import { useRecoilState } from "recoil";
import { Community } from "@/atoms/communitiesAtom";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };
  const joinCommunity = (communityData: Community) => {};
  const leaveCommunity = (communityData: string) => {};
  return { communityStateValue, onJoinOrLeaveCommunity };
};
export default useCommunityData;
