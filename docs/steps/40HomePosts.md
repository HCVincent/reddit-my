./pages/index.tsx
```ts
export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { communityStateValue } = useCommunityData();
  const {
    setPostStateValue,
    postStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();
  const buildUserHomeFeed = async () => {
    setLoading(true);
    if (communityStateValue.mySnippets.length) {
      const myCommunityIds = communityStateValue.mySnippets.map(
        (snippet) => snippet.communityId
      );
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "in", myCommunityIds),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } else {
      buildNoUserHomeFeed();
    }
    try {
    } catch (error) {
      console.log("buildUserHomeFeed error", error);
    }
    setLoading(false);
  };
  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("buildNoUserHomeFeed error", error);
    }
    setLoading(false);
  };
  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("postVotes", postVotes);
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log("getUserPostVotes error", error);
    }
  };

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts]);

  return (
    <PageContent>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
              onVote={onVote}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === post.id)
                  ?.voteValue
              }
              userIsCreator={user?.uid === post.creatorId}
              homePage
            />
          ))}
        </Stack>
      )}
      <Stack spacing={5}></Stack>
    </PageContent>
  );
}
```

./atoms/communitesAtom.ts
```ts
interface CommunityState {
    mySnippets: CommunitySnippet[];
    currentCommunity?: Community;
    snippetsFetched: boolean;
}

const defaultCommunityState: CommunityState = {
    mySnippets: [],
    snippetsFetched: false
}
```

./hooks/useCommunityData.tsx
```ts
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
        snippetsFetched: true,
      }));
    } catch (error) {
      console.log("getMySnippets error", error);
    }
    setLoading(false);
  };
//...
  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);
```

