add ```<RightContent/> ```in Navbar.tsx

./components/Navbar/RightContent/RightContent.tsx
```ts
type RightContentProps = {};

const RightContent: React.FC<RightContentProps> = () => {
  return (
    <>
      <Flex justify="center" align="center">
        <AuthButtons />
      </Flex>
    </>
  );
};
export default RightContent;
```

./components/Navbar/RightContent/AuthButtons.tsx
```ts
const AuthButtons: React.FC = () => {
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
      >
        Log In
      </Button>
      <Button
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;

```