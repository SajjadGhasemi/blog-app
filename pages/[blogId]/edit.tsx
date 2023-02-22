import HomeLoading from "@/components/ui/layouts/HomeLoading";
import EditBlog from "@/components/ui/pages/EditBlog";
import axios from "axios";
import { FC } from "react";

interface IdsTypes {
    _id: string;
    title: string;
    content: string;
    creatorId: string;
    imgurl: string;
    averageScore: number;
    createdAt: string;
    updatedAt: string;
    creator: {
        _id: string;
        username: string;
        name: string;
        bio: string;
        blogs: string[];
        avatar: string;
        averageScore: number;
        createdAt: string;
        updatedAt: string;
    };
    rateCount: number;
}

interface ContextTypes {
    params: { blogId: string };
    locales: undefined;
    locale: undefined;
    defaultLocale: undefined;
}

interface BlogTypes {
    blog: {
        _id: string;
        title: string;
        content: string;
        creatorId: string;
        imgurl: string;
        averageScore: number;
        createdAt: string;
        updatedAt: string;
        creator: {
            _id: string;
            username: string;
            name: string;
            bio: string;
            blogs: string[];
            avatar: string;
            averageScore: number;
            createdAt: string;
            updatedAt: string;
        };
        rateCount: number;
    };
}

const Edit: FC<BlogTypes> = (props) => {
    if (!props.blog) return <HomeLoading />;

    return <EditBlog blog={props.blog} />;
};

export const getStaticPaths = async () => {
    const BLOGS = await axios({
        method: "GET",
        url: `http://localhost:4000/blog`,
    }).then(function (response) {
        return response.data;
    });

    return {
        fallback: false,
        paths: BLOGS.map((blog: IdsTypes) => ({
            params: { blogId: blog._id },
        })),
    };
};

export const getStaticProps = async (context: ContextTypes) => {
    const blogId = context.params.blogId;
    const SINGLE_BLOG = await axios({
        method: "GET",
        url: `http://localhost:4000/blog/single-blog/${blogId}`,
    }).then(function (response) {
        return response.data;
    });

    return {
        props: {
            blog: SINGLE_BLOG,
        },
        revalidate: 1,
    };
};

export default Edit;
