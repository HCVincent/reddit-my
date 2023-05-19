import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";
import { ContextStore } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
  };
  editorValue: string | undefined;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleChange: (
    value: string | undefined,
    event: React.ChangeEvent<HTMLTextAreaElement> | undefined,
    state: ContextStore | undefined
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  editorValue,
  textInputs,
  onChange,
  handleCreatePost,
  loading,
  handleChange,
}) => {
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
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={() => handleCreatePost()}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
