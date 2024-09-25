#!/usr/bin/env node

"use strict";

import "./../styles/globals.scss";

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
