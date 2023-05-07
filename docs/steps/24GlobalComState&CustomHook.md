./atoms/communitiesAtom.ts
```tsx
interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    imageURL?: string;
}

interface CommunityState {
    mySnippets: CommunitySnippet[];
}

const defaultCommunityState: CommunityState = {
    mySnippets: []
}

export const communityState = atom<CommunityState>({
    key: "communitiesState",
    default: defaultCommunityState
})
```

./hooks/useCommunityData.tsx
```tsx
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
```

./components/Community/Header.tsx
```tsx
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );
  ...
                <Button
                variant={isJoined ? "outline" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              >
```