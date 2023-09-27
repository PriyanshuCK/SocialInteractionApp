import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import moment from 'moment';
import { ChatBubbleOvalLeftIcon, HeartIcon as HeartIconOutline, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { CommentForm, Loading, ReplyCard } from "./index";
import { apiRequest } from '../utils';

const getPostComments = async (id) => {
    try {
        const res = await apiRequest({
            url: "/posts/comments/" + id,
            method: "GET",
        });

        return res?.data;
    } catch (error) {
        console.log(error);
    }
};

const PostCard = ({ post, user, deletePost, likePost }) => {
    const [showAll, setShowAll] = useState(0);
    const [showReply, setShowReply] = useState(0);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [replyComments, setReplyComments] = useState(0);
    const [showComments, setShowComments] = useState(0);

    const getComments = async (id) => {
        setReplyComments(0);
        const result = await getPostComments(id);
        setComments(result);
        setLoading(false);
    };

    const handleLike = async (uri) => {
        await likePost(uri);
        await getComments(post?._id);
    };

    return (
        <>
            <div className='mb-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl'>
                <div className='flex gap-3 items-center mb-2'>
                    <Link to={"/profile/" + post?.userId._id}>
                        <img
                            src={post?.userId?.profileUrl ?? NoProfile}
                            alt={post?.userId?.firstName}
                            className='w-14 h-auto object-cover rounded-full'
                        />
                    </Link>
                    <div className='w-full flex justify-between'>
                        <div>
                            <Link to={"/profile/" + post?.userId?._id}>
                                <p className='font-medium text-lg text-gray-950 dark:text-gray-50'>
                                    {post?.userId?.firstName} {post.userId?.lastName}
                                </p>
                            </Link>
                            <span className='text-gray-600 dark:text-gray-400'>
                                {post?.userId?.location}
                            </span>
                            <span className='flex md:hidden text-gray-600 dark:text-gray-400 text-sm'>
                                {moment(post?.createdAt ?? "2023-01-01").fromNow()}
                            </span>
                        </div>
                        <span className='hidden md:flex text-gray-600 dark:text-gray-400'>
                            {moment(post?.createdAt ?? "2023-01-01").fromNow()}
                        </span>
                    </div>
                </div>
                <div>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {showAll === post?._id ? post?.description : post?.description.slice(0, 300)}
                        {
                            post?.description?.length > 301 && (
                                showAll === post?._id ? (
                                    <span
                                        className='text-primary-500 ml-2 font-medium cursor-pointer'
                                        onClick={() => setShowAll(0)}
                                    >
                                        Show Less
                                    </span>
                                ) : (
                                    <span
                                        className='text-primary-500 ml-2 font-medium cursor-pointer'
                                        onClick={() => setShowAll(post?._id)}
                                    >
                                        Show More
                                    </span>
                                )
                            )
                        }
                    </p>
                    {
                        post?.image && post.image.includes("image") && (
                            <img
                                src={post?.image}
                                alt="Post"
                                className='w-full mt-2 rounded-lg'
                            />
                        )
                    }
                    {
                        post?.image && post.image.includes("video") && (
                            <video
                                src={post?.image}
                                alt="Post"
                                className='w-full mt-2 rounded-lg'
                                controls
                                autoPlay
                                muted
                                loop
                            />
                        )
                    }
                </div>
                <div className='mt-4 flex justify-between items-center px-3 py-2 text-gray-600 dark:text-gray-400 text-base border-t border-gray-300 dark:border-gray-700'>
                    <p className='flex gap-2 items-center text-base cursor-pointer' onClick={() => handleLike("/posts/like/" + post?._id)}>
                        {post?.likes?.includes(user?._id) ? (
                            <HeartIconSolid className="w-5 h-5 text-primary-500" />

                        ) : (
                            <HeartIconOutline className="w-5 h-5 text-primary-500" />
                        )}
                        {post?.likes?.length} {post?.likes?.length === 1 ? "Like" : "Likes"}
                    </p>
                    <p className='flex gap-2 items-center text-base cursor-pointer'
                        onClick={() => {
                            setShowComments(showComments === post._id ? null : post._id);
                            getComments(post?._id);
                        }}>
                        <ChatBubbleOvalLeftIcon className='w-5 h-5 text-primary-500' />
                        {post?.comments?.length} {post?.comments?.length === 1 ? "Comment" : "Comments"}
                    </p>
                    {
                        user?._id === post?.userId?._id && (
                            <div className='flex gap-1 items-center text-base text-gray-950 dark:text-gray-50 cursor-pointer'
                                onClick={() => deletePost(post?._id)}>
                                <TrashIcon className='w-5 h-5 text-primary-500' />
                                <span>Delete</span>
                            </div>
                        )
                    }
                </div>

                {showComments === post?._id && (
                    <div className='w-full mt-4 border-t border-gray-300 dark:border-gray-700 pt-4'>
                        <CommentForm
                            user={user}
                            id={post?._id}
                            getComments={() => getComments(post?._id)}
                        />
                        {loading ? (
                            <Loading />
                        ) : (
                            comments?.length > 0 ? (
                                comments?.map((comment) => (
                                    <div className='w-full py-2' key={comment?._id}>
                                        <div className='flex gap-3 items-center mb-1'>
                                            <Link to={"/profile/" + comment?.userId?._id}>
                                                <img
                                                    src={comment?.userId?.profileUrl ?? NoProfile}
                                                    alt={comment?.userId?.firstName}
                                                    className='w-10 h-10 rounded-full object-cover'
                                                />
                                            </Link>
                                            <div>
                                                <Link to={"/profile/" + comment?.userId?._id}>
                                                    <p
                                                        className='font-medium text-base text-gray-950 dark:text-gray-50'>
                                                        {comment?.userId?.firstName} {comment?.userId?.lastName}
                                                    </p>
                                                </Link>
                                                <span className='text-gray-600 dark:text-gray-400 text-sm'>
                                                    {moment(comment?.createdAt ?? "2023-01-01").fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='ml-12'>
                                            <p className='text-gray-600 dark:text-gray-400'>
                                                {comment?.comment}
                                            </p>
                                            <div className='mt-2 flex gap-6'>
                                                <p className='flex gap-2 items-center text-base text-gray-600 dark:text-gray-400 cursor-pointer'
                                                    onClick={() => {
                                                        handleLike("/posts/like-comment/" + comment?._id);
                                                    }}>
                                                    {comment?.likes?.includes(user?._id) ? (
                                                        <HeartIconSolid className='w-5 h-5 text-primary-500' />
                                                    ) : (
                                                        <HeartIconOutline className='w-5 h-5 text-primary-500' />
                                                    )}
                                                    {comment?.likes?.length} {comment?.likes?.length === 1 ? "Like" : "Likes"}
                                                </p>
                                                <span
                                                    className='text-primary-500 cursor-pointer'
                                                    onClick={() => setReplyComments(comment?._id)}>Reply</span>
                                            </div>
                                            {replyComments === comment?._id && (
                                                <CommentForm
                                                    user={user}
                                                    id={comment?._id}
                                                    replyAt={comment?.from}
                                                    getComments={() => getComments(post?._id)}
                                                />
                                            )}
                                        </div>
                                        <div className='py-2 px-8 mt-6'>
                                            {comment?.replies?.length > 0 && (
                                                <p className='text-base text-gray-950 dark:text-gray-50 cursor-pointer'
                                                    onClick={() => setShowReply(
                                                        showReply === comment?.replies?._id
                                                            ? 0
                                                            : comment?.replies?._id
                                                    )}>
                                                    Show Replies ({comment?.replies?.length})
                                                </p>
                                            )}
                                            {showReply === comment?.replies?._id && comment?.replies?.map((reply) => (
                                                <ReplyCard
                                                    reply={reply}
                                                    user={user}
                                                    key={reply?._id}
                                                    handleLike={() => handleLike(
                                                        "/posts/like-comment/" +
                                                        comment?._id +
                                                        "/" +
                                                        reply?._id
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <span className='flex text-sm py-4 text-gray-600 dark:text-gray-400 text-center'>
                                    Be the first to comment on this post!
                                </span>
                            )
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default PostCard;