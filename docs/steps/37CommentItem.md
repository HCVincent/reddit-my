https://console.firebase.google.com/v1/r/project/**************/firestore/indexes?create_composite=ClBwcm9qZWN0cy9teS1yZWRkaXQtN2I1ODEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2NvbW1lbnRzL2luZGV4ZXMvXxABGgoKBnBvc3RJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI

./components/Posts/Comments/Comments.tsx
```ts
type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      batch.set(commentDocRef, newComment);
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setCreateLoading(false);
  };
  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log("onDeleteComment", error);
    }
    setLoadingDeleteId("");
  };
  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error) {
      console.log("getPostComments error", error);
    }
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
        />
        <Stack spacing={6} p={2}>
          {fetchLoading ? (
            <>
              {[0, 1, 2].map((item) => (
                <Box key={item} padding="6" bg="white">
                  <SkeletonCircle size="10" />
                  <SkeletonText mt="4" noOfLines={2} spacing="4" />
                </Box>
              ))}
            </>
          ) : (
            <>
              {comments.length === 0 ? (
                <>
                  <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    p={20}
                  >
                    <Text fontWeight={700} opacity={0.3}>
                      No Comments Yet
                    </Text>
                  </Flex>
                </>
              ) : (
                <>
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onDeleteComment={onDeleteComment}
                      loadingDelete={loadingDeleteId === comment.id}
                      userId={user.uid}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default Comments;
```

./components/Posts/Comments/CommentItem.tsx
```ts
export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
};
type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  loadingDelete,
  userId,
}) => {
  return (
    <Flex>
      <Box>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1} ml={2}>
        <Stack direction="row" align="center" fontSize="8pt">
          <Text fontWeight={700}>{comment.creatorDisplayText}</Text>
          <Text color="gray.600">
            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
          </Text>
          {loadingDelete && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{comment.text}</Text>
        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {userId === comment.creatorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={() => onDeleteComment(comment)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default CommentItem;
```