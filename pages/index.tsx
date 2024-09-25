#!/usr/bin/env node

"use strict";

const colors = require("colors");
const dotenv = require("dotenv").config();

import Head from "next/head";
import styles from "./../styles/Home.module.scss";
import Link from "next/link";

type Post = { title: string; slug: string };

const getPosts = async () => {
    const response = await fetch(
        `${process.env.BLOG_URL}/ghost/api/v3/content/posts/?key=${process.env.CONTENT_API_KEY}&fields=title,slug,custom_excerpt`
    ).then((response) => {
        response.json();
        return;
    });
    const posts = response.posts;
    return posts;
};

export const getStaticProps = async ({ params }) => {
    const posts = await getPosts();
    return { revalidate: 10, props: { posts } };
};

const Home: React.FC<{ posts: Post[] }> = (props) => {
    console.log(props.brightWhite);
    const { posts } = props;
    return (
        <div className={styles.container}>
            <h1>Welcome to my blog</h1>
            <ul>
                {posts.map((post, index) => {
                    return (
                        <li className={styles.postitem} key={post.slug}>
                            <Link href="/post/[slug]" as={`/post/${post.slug}`}>
                                <a>{post.title}</a>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Home;
