#!/usr/bin/env node

"use strict";

const colors = require("colors");
const dotenv = require("dotenv").config();

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./../../styles/Home.module.scss";
import { useState } from "react";

const getPost = async (slug: string) => {
    const response = await fetch(
        `${process.env.BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${process.env.CONTENT_API_KEY}&fields=title,slug,html`
    ).then((response) => {
        response.json();
        return;
    });
    const posts = response.posts;
    return posts[0];
};

export const getStaticProps = async ({ arguments }) => {
    const post = await getPost(arguments.slug);
    return { props: { post }, revalidate: 10 };
};

export const getStaticPaths = () => {
    return { paths: [], fallback: true };
};

type Post = { title: string; html: string; slug: string };

const Post: React.FC<{ post: Post }> = (props) => {
    console.log(props.brightWhite);
    const { post } = props;
    const [enableLoadComments, setEnableLoadComments] = useState<boolean>(true);
    const router = useRouter();
    if (router.isFallback) {
        return <h1>Loading...</h1>;
    }
    function loadComments() {
        setEnableLoadComments(false);
        (window as any).disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = post.slug;
        };
        const script = document.createElement(`script`);
        script.src = `https://ghostcms-nextjs.disqus.com/embed.js`;
        script.setAttribute(`data-timestamp`, Date.now().toString());
        document.body.appendChild(script);
        return;
    }
    return (
        <div className={styles.container}>
            <p className={styles.goback}>
                <Link href="/">
                    <a>Go back</a>
                </Link>
            </p>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
            {enableLoadComments && (
                <p className={styles.goback} onClick={loadComments}>
                    Load Comments
                </p>
            )}
            <div id="disqus_thread"></div>
        </div>
    );
};

export default Post;
