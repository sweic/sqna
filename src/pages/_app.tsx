// src/pages/_app.tsx
import { MantineProvider } from "@mantine/core";
import { createWSClient, httpBatchLink, wsLink } from "@trpc/client";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import type { AppRouter } from "../server/router";
import { emotionCache } from "../shared/utils/emotionCache";
import { appTheme } from "../styles/constants";
import GlobalStyles from "../styles/createGlobalStyles";
import "../styles/fontStyles.css";
const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        colors: {
          app: appTheme.colors.primary,
          dark: appTheme.colors.secondary,
        },
        primaryColor: "app",
        fontFamily: "Inter",
      }}
      emotionCache={emotionCache}
    >
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <GlobalStyles />
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

function getEndingLink() {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    });
  }

  const client = createWSClient({
    url: "ws://sqna-production.up.railway.app/"
  });

  return wsLink<AppRouter>({
    client,
  });
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      links: [getEndingLink()],

      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
