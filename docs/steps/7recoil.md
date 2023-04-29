add ```<RecoilRoot> ```in ./pages/_app.tsx
```tsx
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
```

https://recoiljs.org/docs/basic-tutorial/atoms
./atoms/authModalAtom.ts
```tsx
import { atom } from "recoil";

export interface AuthModalState {
    open: boolean;
    view: "login" | "signup" | "resetPassword";
}

const defaultModalState: AuthModalState = {
    open: false,
    view: "login"
}

export const authModalState = atom<AuthModalState>({
    key: "authModalState",
    default: defaultModalState
})
```

change authModal
./components/Modal/Auth/AuthModal.tsx
```tsx
const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
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
        </ModalContent>
      </Modal>
    </>
  );
};
```

add onClick on AuthButtons
./components/Modal/Auth/AuthModal.tsx
```tsx
<Button
        variant="outline"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => {
          setAuthModalState({
            view: "login",
            open: true,
          });
        }}
      >
        Log In
      </Button>
      <Button
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() =>
          setAuthModalState({
            open: true,
            view: "signup",
          })
        }
      >
        Sign Up
      </Button>
```