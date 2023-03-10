import Layout from "@/components/ui/layouts/Layout";
import { wrapper, store, RootState } from "@/store/store";
import "@/styles/globals.css";
import axios from "axios";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/userSlice";
import { Cookies } from "react-cookie";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import NextNProgress from "nextjs-progressbar";
import Head from "next/head";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
    const renderWithLayout =
        Component.getLayout ||
        function (page) {
            return <Layout>{page}</Layout>;
        };
    const dispatch = useDispatch();
    const userEdited = useSelector(
        (state: RootState) => state.userSlice.userEdited
    );
    const updateAvatar = useSelector(
        (state: RootState) => state.userSlice.updateAvatar
    );

    const [queryClient] = React.useState(() => new QueryClient());

    const cookie: string = new Cookies().get("token");

    const me = async () => {
        await axios({
            method: "post",
            url: "http://localhost:4000/user/me",
            headers: {
                auth: `ut ${cookie}`,
            },
        })
            .then(function (response) {
                dispatch(setCurrentUser(response.data));
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    useEffect(() => {
        me();
    }, [cookie, userEdited, updateAvatar]);

    return renderWithLayout(
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <Provider store={store}>
                    <NextNProgress
                        options={{ showSpinner: false }}
                        color="#00abdf"
                        startPosition={0.2}
                        stopDelayMs={200}
                        height={4}
                        showOnShallow={false}
                    />
                    <ToastContainer
                        position="top-center"
                        autoClose={4000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={true}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                    <Head>
                        <link rel="manifest" href="/manifest.json" />
                        <link rel="shortcut icon" href="/favicon.png" />
                        <meta name="theme-color" content="#fff" />
                    </Head>
                    <Component {...pageProps} />
                </Provider>
            </Hydrate>
        </QueryClientProvider>
    );
}

export default wrapper.withRedux(App);
