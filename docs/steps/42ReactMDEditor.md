https://github.com/uiwjs/react-md-editor
```bash
npm i @uiw/react-md-editor        
npm install next-remove-imports                 
```

next.config.js
```js
const removeImports = require("next-remove-imports");

module.exports = removeImports()({
  // ✅  options...
  reactStrictMode: true,
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
});
```

./components/Posts/PostForm/TextInputs.tsx
```ts
//...
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
return (
    <Stack spacing={3} width="100%" as="form">
      <Input
        name="title"
        onChange={onChange}
        value={textInputs.title}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
        _focusVisible={{ borderColor: "none", border: "none" }}
        _placeholder={{ color: "gray.500" }}
      />
      {/* <Textarea
        name="body"
        value={textInputs.body}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        height="100px"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
      /> */}
      <MDEditor
        value={editorValue}
        onChange={handleChange}
        data-color-mode="light"
        extraCommands={[]}
//...
```

./atoms/postAtom.ts
```ts
export type Post = {
    id?: string;
    communityId: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    body: string | undefined;
    numberOfComments: number;
    voteStatus: number;
    imageURL?: string;
    communityImageURL?: string;
    createdAt: Timestamp;
}
```

./components/Posts/NewPostForm.tsx
```ts
type NewPostFormProps = { user: User; communityImageURL?: string };

const formTabs = [
  { title: "Post", icon: IoDocumentText },
  { title: "Images & Video", icon: IoImageOutline },
  { title: "Link", icon: BsLink45Deg },
  { title: "Poll", icon: BiPoll },
  { title: "Talk", icon: BsMic },
];

export type TabIt = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const { communityId } = router.query;
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [error, setError] = useState(false);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [editorInputs, setEditorInputs] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const handleCreatePost = async () => {
    const newPost: Post = {
      communityId: communityId as string,
      communityImageURL: communityImageURL || "",
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile as string, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(error);
    }
    setLoading(false);
  };
  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange = (
    value: string | undefined,
    event: React.ChangeEvent<HTMLTextAreaElement> | undefined,
    state: ContextStore | undefined
  ) => {
    if (event) {
      setEditorInputs(value);
    }
  };
  return (
    <>
      <Flex direction="column" bg="white" borderRadius={4} mt={2}>
        <Flex width="100%">
          {formTabs.map((item) => (
            <TabItem
              key={item.title}
              item={item}
              selected={item.title === selectedTab}
              setSelectedTab={setSelectedTab}
            />
          ))}
        </Flex>
        <Flex p={4}>
          {selectedTab === "Post" && (
            <TextInputs
              editorValue={editorInputs}
              textInputs={textInputs}
              handleCreatePost={handleCreatePost}
              onChange={onTextChange}
              handleChange={handleChange}
              loading={loading}
            />
          )}
          {selectedTab === "Images & Video" && (
            <ImageUpload
              selectedFile={selectedFile}
              onSelectImage={onSelectFile}
              setSelectedTab={setSelectedTab}
              setSelectedFile={setSelectedFile}
            />
          )}
        </Flex>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>Error creating post</Text>
          </Alert>
        )}
      </Flex>
    </>
  );
};
export default NewPostForm;
```

./components/Posts/PostItem.tsx
```ts
import React, { useState } from "react";
import { Post } from "@/atoms/postsAtom";
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Link,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BsChat, BsDot } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowDownSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import moment from "moment";
import { useRouter } from "next/router";
import { FaReddit } from "react-icons/fa";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MarkdownPreview = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

type PostItemProps = {
  disableCopy: boolean;
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => Promise<boolean>;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  disableCopy,
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const [loadingUpVote, setLoadingUpVote] = useState(false);
  const [loadingDownVote, setLoadingDownVote] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(false);
  const singlePostPage = !onSelectPost;
  const router = useRouter();
  const handleVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    vote: number
  ) => {
    vote === 1 ? setLoadingUpVote(true) : setLoadingDownVote(true);

    try {
      const success = await onVote(event, post, vote, post.communityId);
      if (!success) {
        throw new Error("Failed to vote post");
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingUpVote(false);
    setLoadingDownVote(false);
  };
  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error("Failed to delete post");
      }
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };
  return (
    <Flex
      maxHeight="800px"
      overflow="hidden"
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
      cursor={singlePostPage ? "unset" : "pointer"}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePostPage ? "none" : "gray.100"}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
      >
        {loadingUpVote ? (
          <Spinner size="sm" color="brand.100" />
        ) : (
          <Icon
            as={
              userVoteValue === 1
                ? IoArrowUpCircleSharp
                : IoArrowUpCircleOutline
            }
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize={22}
            onClick={(event) => handleVote(event, 1)}
            cursor="pointer"
          />
        )}

        <Text fontSize="9pt">{post.voteStatus}</Text>
        {loadingDownVote ? (
          <Spinner size="sm" color="#4379ff" />
        ) : (
          <Icon
            as={
              userVoteValue === -1
                ? IoArrowDownCircleSharp
                : IoArrowDownCircleOutline
            }
            color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
            fontSize={22}
            onClick={(event) => handleVote(event, -1)}
            cursor="pointer"
          />
        )}
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {homePage && (
              <>
                {post.communityImageURL ? (
                  <Image
                    src={post.communityImageURL}
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="18pt" mr={1} color="blue.500" />
                )}
                <Link
                  href={`r/${post.communityId}`}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text
                    height="20px"
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                    onClick={(event) => event.stopPropagation()}
                  >{`r/${post.communityId}`}</Text>

                  <Icon as={BsDot} color="gray.500" fontSize={8} />
                </Link>
              </>
            )}
            <Text>
              Posted by u/{post.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="12px" fontWeight={600}>
            {post.title}
          </Text>
          {/* <Text fontSize="10pt">{post.body}</Text> */}
          <MarkdownPreview
            disableCopy={disableCopy}
            wrapperElement={{ "data-color-mode": "light" }}
            source={post.body}
          />
          {post.imageURL && (
            <Flex justify="center" align="center">
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight="450px"
                maxWidth="450px"
                alt="post image"
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
```

./components/Posts/Posts.tsx
```ts
type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();
  const [user] = useAuthState(auth);
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
  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item) => (
            <PostItem
              disableCopy={true}
              key={item.id}
              post={item}
              userIsCreator={user?.uid === item.creatorId}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === item.id)
                  ?.voteValue
              }
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
```

./pages/index.tsx
```ts
//...
            <PostItem
              disableCopy={true}
//...
```

./pages/r/[communityId]/submit.tsx
delete         <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>create a post</Text>
        </Box>

./pages/r/[communityId]/comments/[pid].tsx
//...
            <PostItem
              disableCopy={false}
//...
```