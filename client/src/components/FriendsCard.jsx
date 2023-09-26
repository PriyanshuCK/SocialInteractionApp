import React from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';

const FriendsCard = ({ friends }) => {
    return (
        <>
            <div className='w-full bg-gray-50 dark:bg-gray-800 shadow-sm rounded-lg px-6 py-5'>
                <div className='flex items-center justify-between text-gray-950 dark:text-gray-50 pb-2 border-b border-gray-300 dark:border-gray-700'>
                    <span>Friends</span>
                    <span>{friends?.length}</span>
                </div>
                <div className='w-full flex flex-col gap-4 pt-4'>
                    {
                        friends?.map((friend) => {
                            return (
                                <>
                                    <Link to={"/profile/" + friend?._id} key={friend._id} className='w-full flex gap-4 items-center cursor-pointer'>
                                        <img src={friend?.profileUrl ?? NoProfile} alt={friend?.firstName} className='w-10 h-10 object-cover rounded-full' />
                                        <div className='flex-1'>
                                            <p className='text-base font-medium text-gray-950 dark:text-gray-50'>
                                                {friend?.firstName} {friend?.lastName}
                                            </p>
                                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                {friend?.profession ?? "No Profession"}
                                            </span>
                                        </div>
                                    </Link>
                                </>
                            );
                        })
                    }
                </div>
            </div>
        </>
    );
};

export default FriendsCard;