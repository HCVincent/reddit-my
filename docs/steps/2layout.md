./components/Navbar/Navbar.tsx
```tsx
const Navbar: React.FC = () => {
  return <div>nav</div>;
};
export default Navbar;
```

./components/Layout/Layout.tsx
```tsx
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
```tsx
return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
```