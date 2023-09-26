import React from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import moment from 'moment';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';

const ReplyCard = ({ reply, user, handleLike }) => {
    return (
        <><div className='w-full py-3'>
            <div className='flex gap-3 items-center mb-1'>
                <Link to={"/profile/" + reply?.userId?._id}>
                    <img
                        src={reply?.userId?.profileUrl ?? NoProfile}
                        alt={reply?.userId?.firstName}
                        className='w-10 h-10 rounded-full object-cover'
                    />
                </Link>
                <div>
                    <Link to={"/profile/" + reply?.userId?._id}>
                        <p
                            className='font-medium text-base text-gray-950 dark:text-gray-50'>
                            {reply?.userId?.firstName} {reply?.userId?.lastName}
                        </p>
                    </Link>
                    <span className='text-gray-600 dark:text-gray-400 text-sm'>
                        {moment(reply?.createdAt ?? "2023-01-01").fromNow()}
                    </span>
                </div>
            </div>
            <div className='ml-12'>
                <p className='text-gray-600 dark:text-gray-400'>
                    {reply?.comment}
                </p>
                <div className='mt-2 flex gap-6'>
                    <p className='flex gap-2 items-center text-base text-gray-600 dark:text-gray-400 cursor-pointer'
                        onClick={handleLike}>
                        {reply?.likes?.includes(user?._id) ? (
                            <HeartIconSolid className='w-5 h-5 text-primary-500' />
                        ) : (
                            <HeartIconOutline className='w-5 h-5 text-primary-500' />
                        )}
                        {reply?.likes?.length} {reply?.likes?.length === 1 ? "Like" : "Likes"}
                    </p>
                </div>
            </div>
        </div></>
    );
};

export default ReplyCard;