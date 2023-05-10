./atoms/communitiesAtom.ts
```ts
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
```ts
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
```ts
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