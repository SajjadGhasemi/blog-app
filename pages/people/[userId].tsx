import HomeLoading from "@/components/ui/layouts/HomeLoading";
import axios from "axios";
import Link from "next/link";
import { FC } from "react";
import StarRatings from "react-star-ratings";

interface BlogsTypes {
    userBlogs: {
        _id: string;
        title: string;
        content: string;
        creatorId: string;
        imgurl: string;
        averageScore: number;
        createdAt: string;
        updatedAt: string;
        rateCount: number;
    }[];
    singleUser: {
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
}

interface IdsTypes {
    _id: string;
    username: string;
    name: string;
    bio: string;
    avatar: string;
    averageScore: number;
    createdAt: string;
    updatedAt: string;
}

interface ContextTypes {
    params: { userId: string };
    locales: undefined;
    locale: undefined;
    defaultLocale: undefined;
}

const UserId: FC<BlogsTypes> = (props) => {
    if (!props.userBlogs || !props.singleUser) return <HomeLoading />;
    return (
        <>
            <div className="grid grid-cols-1 my-2">
                <div className="flex justify-around items-center py-2 border-b border-gray-400">
                    <img
                        className="h-16 w-16 rounded-full p-1 border border-gray-300 "
                        src={
                            props.singleUser.avatar
                                ? `http://localhost:4000/${props.singleUser.avatar}`
                                : "/userAvatar.png"
                        }
                    />
                    <div>
                        <p>{props.singleUser.name}</p>
                        <p className="text-gray-500">{props.singleUser.bio}</p>
                    </div>
                </div>
            </div>
            <div className="px-3 z-10 grid grid-cols-1 gap-1 md:grid-cols-3 my-2">
                {props.userBlogs.map((item, i) => (
                    <Link
                        key={i}
                        className="flex flex-col justify-center hover:shadow-2xl"
                        href={`/${item._id}`}
                    >
                        <div className="h-[270px] w-[270px] relative">
                            <img
                                className="p-1 h-full w-full object-cover cursor-pointer"
                                src={
                                    item.imgurl
                                        ? item.imgurl
                                        : "/userAvatar.png"
                                }
                            />
                            <div className="absolute text-center p-1 bottom-1 left-1 bg-black w-[16.3rem] opacity-70">
                                <StarRatings
                                    starRatedColor="orange"
                                    numberOfStars={5}
                                    rating={
                                        item.averageScore
                                            ? item.averageScore
                                            : 0
                                    }
                                    starDimension="23px"
                                    starSpacing="2px"
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export const getStaticPaths = async () => {
    const USERS = await axios({
        method: "GET",
        url: `http://localhost:4000/user/`,
    }).then(function (response) {
        return response.data;
    });

    const dd = USERS.map((user: IdsTypes) => ({
        params: { userId: user._id },
    }));
    console.log(dd);

    return {
        fallback: false,
        paths: USERS.map((user: IdsTypes) => ({
            params: { userId: user._id },
        })),
    };
};

export const getStaticProps = async (context: ContextTypes) => {
    const userId = context.params.userId;
    const SINGLE_USER = await axios({
        method: "GET",
        url: `http://localhost:4000/user/singleUser/${userId}`,
    }).then(function (response) {
        return response.data;
    });

    const USER_BLOGS = await fetch("http://localhost:4000/blog/by-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _id: userId,
        }),
    }).then((response) => response.json());

    return {
        props: {
            userBlogs: USER_BLOGS,
            singleUser: SINGLE_USER,
        },
    };
};

export default UserId;
