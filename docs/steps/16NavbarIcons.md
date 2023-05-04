./components/Navbar/RightContent/RightContent/tsx
```ts
type RightContentProps = {
  user?: User | null;
};
{user ? (
          // <Button onClick={() => signOut(auth)}>Logout</Button>
          <Icons />
        ) : (
          <AuthButtons />
        )}
```