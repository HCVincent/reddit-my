https://chakra-ui.com/docs/styled-system/customize-theme

./chakra/theme.ts
```ts
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { Button } from './buttons';

export const theme = extendTheme({
    colors: {
        brand: {
            100: "#FF3c00",
        },
    },
    fonts: {
        body: "Open Sans, sans-serif"
    },
    styles: {
        global: () => ({
            body: {
                bg: "gray.200"
            }
        })
    },
    components: {
        Button,
    }
})
```

./chakra/buttons.ts
```ts
import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: "60px",
        fontSize: "10pt",
        fontWeight: 700,
        _focus: {
            boxShadow: "none",
        },
    },
    sizes: {
        sm: {
            fontSize: "8pt",
        },
        md: {
            fontSize: "10pt",
        },
    },
    variants: {
        solid: {
            color: "white",
            bg: "blue.500",
            _hover: {
                bg: "blue.400",
            },
        },
        outline: {
            color: "blue.500",
            border: "1px solid",
            borderColor: "blue.500",
            _hover: {
                bg: "gray.300",
            },
        },
        oauth: {
            height: "34px",
            border: "1px solid",
            borderColor: "gray.300",
            _hover: {
                bg: "gray.50",
            },
        },
    },
};
```

./pages/_app.tsx
```tsx
return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
```