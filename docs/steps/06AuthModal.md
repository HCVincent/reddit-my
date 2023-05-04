add ```<AuthModal/> ```in ./components/Navbar/RightContent/RightContent.tsx
```ts
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        <AuthButtons />
      </Flex>
    </>
  );
```

https://chakra-ui.com/docs/components/modal

./components/Modal/Auth/AuthModal.tsx
```ts
const AuthModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            doloribus accusantium alias delectus nostrum temporibus
            necessitatibus fuga ratione dignissimos mollitia velit, libero
            consectetur perferendis similique sequi dolorum dolore doloremque
            numquam!
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
```