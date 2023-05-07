import { communityState } from "@/atoms/communitiesAtom";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Community } from "@/atoms/communitiesAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { authModalState } from "@/atoms/authModalAtom";
import { collection, getDocs } from "firebase/firestore";
import { CommunitySnippet } from "@/atoms/communitiesAtom";

const useCommunityData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
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
  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error) {
      console.log("getMySnippets error", error);
    }
    setLoading(false);
  };
  const joinCommunity = (communityData: Community) => {};
  const leaveCommunity = (communityData: string) => {};
  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);
  return { communityStateValue, onJoinOrLeaveCommunity, loading };
};
export default useCommunityData;
