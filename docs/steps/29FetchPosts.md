getPosts error The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/my-reddit-7b581/firestore/indexes?create_composite=Ck1wcm9qZWN0cy9teS1yZWRkaXQtN2I1ODEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Bvc3RzL2luZGV4ZXMvXxABGg8KC2NvbW11bml0eUlkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg

./pages/r/[communityId]/index.tsx
```ts
<Posts communityData={communityData} />
```

./components/Posts/Posts.tsx
```ts
type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const { postStateValue, setPostStateValue } = usePosts();
  const [loading, setLoading] = useState(false);
  const getPosts = async () => {
    try {
      setLoading(true);
      const postQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData]);
  return <div>Posts</div>;
};
export default Posts;
```

./hooks/usePosts.tsx
```ts
const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const onVote = async () => {};
  const onSelectPost = () => {};
  const onDeletePost = async () => {};
  return {
    postStateValue,
    setPostStateValue,
  };
};
export default usePosts;
```