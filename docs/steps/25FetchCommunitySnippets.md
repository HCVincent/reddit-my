./atoms/communitiesAtom.ts
```ts
export interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    imageURL?: string;
}
```

./hooks/useCommunityDta.tsx
```ts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  //...
  const setAuthModalState = useSetRecoilState(authModalState);
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
  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);
  return { communityStateValue, onJoinOrLeaveCommunity, loading };
```

./components/Community/Header.tsx
```ts
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();
    //...
                    onClick={() => {
                  onJoinOrLeaveCommunity(communityData, isJoined);
                }}
                isLoading={loading}
```

./components/Navbar/RightContent/UserMenu.tsx
```ts
  const resetCommunityState = useResetRecoilState(communityState);
  const logout = async () => {
    await signOut(auth);
    resetCommunityState();
  };
  //...
              <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
              onClick={logout}
            >
```