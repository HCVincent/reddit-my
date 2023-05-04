./components/Navbar/Navbar.tsx
```ts
const Navbar: React.FC = () => {
  return <div>nav</div>;
};
export default Navbar;
```

./components/Layout/Layout.tsx
```ts
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
export default Layout;
```

./pages/_app.tsx
```ts
return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
```