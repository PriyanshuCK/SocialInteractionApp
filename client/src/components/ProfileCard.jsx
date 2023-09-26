import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NoProfile } from "../assets";
import { PencilSquareIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { UpdateProfile } from '../redux/userSlice';
import moment from "moment";

const ProfileCard = ({ user }) => {
    const { user: data, edit } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    return (
        <>
            <div className='w-full bg-gray-50 dark:bg-gray-800 flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
                <div className='w-full flex items-center justify-between pb-5 border-b border-gray-300 dark:border-gray-700'>
                    <Link to={"/profile/" + user?._id} className='flex gap-2'>
                        <img src={user?.profileUrl ?? NoProfile} alt={user?.email} className='w-14 h-14 object-cover rounded-full' />
                        <div className='flex flex-col justify-center'>
                            <p className='text-lg font-medium text-gray-950 dark:text-gray-50'>
                                {user?.firstName} {user?.lastName}
                            </p>
                            <span className='text-gray-600 dark:text-gray-400'>
                                {user?.profession ?? "No Profession"}
                            </span>
                        </div>
                    </Link>
                    <div className=''>
                        {user?._id === data?._id ? (
                            <PencilSquareIcon
                                className='w-5 h-5 text-primary-500 cursor-pointer'
                                onClick={() => {
                                    dispatch(UpdateProfile(true));
                                }}
                            />
                        ) : (
                            <button
                                className='bg-primary-500 text-sm text-white p-1 rounded'
                                onClick={() => { }}>
                                <UserPlusIcon className='h-5 w-5' />
                            </button>
                        )}
                    </div>
                </div>

                <div className='w-full flex flex-col gap-2 py-4 border-b border-gray-300 dark:border-gray-700'>
                    <div className='flex gap-2 items-center text-gray-600 dark:text-gray-400'>
                        <MapPinIcon className='w-5 h-5 text-xl text-gray-950 dark:text-gray-50' />
                        <span>
                            {user?.location ?? "Add Location"}
                        </span>
                    </div>
                    <div className='flex gap-2 items-center text-gray-600 dark:text-gray-400'>
                        <BriefcaseIcon className='w-5 h-5 text-lg text-gray-950 dark:text-gray-50' />
                        <span>
                            {user?.profession ?? "Add Profession"}
                        </span>
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2 py-4'>
                    <p className='text-xl text-gray-950 dark:text-gray-50 font-semibold'>
                        {user?.friends?.length} Friends
                    </p>
                    <div className='flex items-center justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>
                            Who viewed your Profile
                        </span>
                        <span className='text-gray-950 dark:text-gray-50 text-lg'>
                            {user?.views?.length}
                        </span>
                    </div>
                    <span className='text-base text-primary-500'>
                        {user?.verified ? "Verified Account" : "Not Verified"}
                    </span>
                    <div className='flex items-center justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>
                            Joined
                        </span>
                        <span className='text-gray-950 dark:text-gray-50 text-base'>
                            {moment(user?.createdAt).fromNow()}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileCard;