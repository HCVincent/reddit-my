https://github.com/CSFrequency/react-firebase-hooks/tree/master/auth#useauthstate

./components/Modal/Auth/AuthModal.tsx
```tsx
  const [user, loading, error] = useAuthState(auth);
    useEffect(() => {
    if (user) handleClose();
  }, [user]);
```

./components/Navbar/Navbar.tsx
```tsx
  const [user, loading, error] = useAuthState(auth);
  ...
  <RightContent user={user} />
```

./components/Navbar/RightContent.tsx
```tsx
type RightContentProps = {
  user: any;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <AuthButtons />
        )}
      </Flex>
    </>
  );
};
```