import { Post } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/clientApp";
import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import { ContextStore } from "@uiw/react-md-editor";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { IoDocumentText } from "react-icons/io5";
import TextEditInputs from "./PostForm/TextEditInputs";
import usePosts from "@/hooks/usePosts";
type EditPostFormProps = {
  setShow: () => void;
  post: Post;
  show: boolean;
};

export type TabIt = {
  title: string;
  icon: typeof Icon.arguments;
};

const EditPostForm: React.FC<EditPostFormProps> = ({ post, show, setShow }) => {
  const { setPostStateValue } = usePosts();
  const [error, setError] = useState(false);
  const [textInputs, setTextInputs] = useState({
    title: post.title,
    body: post.body ? post.body : "",
  });
  const [editorInputs, setEditorInputs] = useState<string | undefined>(
    post.body || ""
  );
  const [loading, setLoading] = useState(false);

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

  const handleEditPost = async (title?: string, body?: string | undefined) => {
    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", post?.id!);
      if (title || body) {
        await updateDoc(postDocRef, {
          title: title,
          body: body,
        });
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: {
            ...post,
            title: title,
            body: body,
          } as Post,
        }));
      }
      setLoading(false);
      setShow();
    } catch (error: any) {
      setError(error.message);
      console.log("handleEditPost error", error.message);
    }
  };
  return (
    <>
      <Flex
        direction="column"
        bg="white"
        borderRadius={4}
        mt={2}
        hidden={!show}
      >
        <Flex p={4}>
          <TextEditInputs
            setShow={setShow}
            editorValue={editorInputs}
            textInputs={textInputs}
            handleEditPost={() =>
              handleEditPost(textInputs.title, editorInputs)
            }
            onChange={onTextChange}
            handleChange={handleChange}
            loading={loading}
          />
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
export default EditPostForm;
