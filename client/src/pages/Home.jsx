import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TopBar, ProfileCard, FriendsCard, CustomButton, TextInput, Loading, PostCard, EditProfile } from "../components";
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import { UserPlusIcon, PhotoIcon, VideoCameraIcon, GifIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, likePost, sendFriendRequest } from "../utils";
import { UserLogin } from '../redux/userSlice';

const Home = () => {
    const { user, edit } = useSelector(state => state.user);
    const { posts } = useSelector(state => state.post);
    const [friendRequest, setFriendRequest] = useState([]);
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [errMsg, setErrMsg] = useState("");
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);


    const dispatch = useDispatch();

    const handlePostSubmit = async (data) => {
        setPosting(true);
        try {
            const uri = file && (await handleFileUpload(file));
            const newData = uri ? { ...data, image: uri } : data;

            const res = await apiRequest({
                url: "/posts/create-post",
                data: newData,
                token: user?.token,
                method: "POST",
            });

            if (res?.status === "failed") {
                setErrMsg(res);
            } else {
                reset({
                    description: "",
                });
                setFile(null);
                setErrMsg("");
                await fetchPost();
            }

        } catch (error) {
            console.log(error);
        }

        setPosting(false);
    };

    const fetchPost = async () => {
        await fetchPosts(user?.token, dispatch);
        setLoading(false);
    };

    const handleLikePost = async (uri) => {
        await likePost({ uri: uri, token: user?.token });
        await fetchPost();
    };

    const handleDelete = async (id) => {
        await deletePost(id, user.token);
        await fetchPost();
    };

    const fetchFriendRequests = async () => {
        try {
            const res = await apiRequest({
                url: "/users/get-friend-request",
                token: user?.token,
                method: "POST",
            });

            setFriendRequest(res?.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFriendRequest = async (id) => {
        try {
            const res = await sendFriendRequest(id, user.token);
            await fetchFriendRequests();
        } catch (error) {
            console.log(error);
        }
    };

    const acceptFriendRequest = async (id, status) => {
        try {
            const res = await apiRequest({
                url: "/users/accept-request",
                token: user?.token,
                method: "POST",
                data: { rid: id, status }
            });

            setFriendRequest(res?.data);
            getUser();
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSuggestedFriends = async () => {
        try {
            const res = await apiRequest({
                url: "/users/suggested-friends",
                token: user?.token,
                method: "POST",
            });

            setSuggestedFriends(res?.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async () => {
        const res = await getUserInfo(user?.token);
        const newData = { token: user?.token, ...res };
        dispatch(UserLogin(newData));
    };

    useEffect(() => {
        setLoading(true);
        getUser();
        fetchPost();
        fetchFriendRequests();
        fetchSuggestedFriends();
    }, []);

    return (
        <>
            <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-200 dark:bg-gray-900 lg:rounded-lg h-screen overflow-hidden'>
                <TopBar />
                <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                    <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                        <ProfileCard user={user} />
                        <FriendsCard friends={user?.friends} />
                    </div>
                    <div className='flex-1 h-full bg-gray-50 dark:bg-gray-800 px-4 flex flex-col gap-6 overflow-y-auto'>
                        <form
                            className='bg-gray-50 dark:bg-gray-800 px-4 rounded-lg' onSubmit={handleSubmit(handlePostSubmit)}>
                            <div className='w-full flex items-center gap-2 py-4 border-b border-gray-300 dark:border-gray-700'>
                                <img
                                    src={user?.profileUrl ?? NoProfile}
                                    alt='User'
                                    className='w-14 h-14 rounded-full object-cover'
                                />
                                <TextInput
                                    styles="w-full rounded-full py-5"
                                    placeholder="What's on your mind..."
                                    name="description"
                                    register={register("description", {
                                        required: "Write something about the post",
                                    })}
                                    error={errors.description ? errors.description.message : ""}
                                />
                            </div>
                            {
                                errMsg?.message && (
                                    <span role='alert' className={`text-sm ${errMsg?.status === "failed" ? "text-primary-600 dark:text-primary-400" : "text-primary-500"} mt-0.5`}>{errMsg?.message}</span>
                                )
                            }
                            <div className='flex items-center justify-between py-4'>
                                <label
                                    htmlFor='imgUpload'
                                    className='flex items-center gap-1 text-base text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 cursor-pointer'
                                >
                                    <input
                                        type='file'
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className='hidden'
                                        id="imgUpload"
                                        data-max-size="5120"
                                        accept='.jpg, .png, .jpeg'
                                    />
                                    <PhotoIcon className='w-5 h-5' />
                                    <span>Upload Image</span>
                                </label>
                                <label
                                    htmlFor='videoUpload'
                                    className='flex items-center gap-1 text-base text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 cursor-pointer'
                                >
                                    <input
                                        type='file'
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className='hidden'
                                        id="videoUpload"
                                        data-max-size="5120"
                                        accept='.mp4, .mkv, .wav'
                                    />
                                    <VideoCameraIcon className='w-5 h-5' />
                                    <span>Upload Video</span>
                                </label>
                                <label
                                    htmlFor='vgifUpload'
                                    className='flex items-center gap-1 text-base text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 cursor-pointer'
                                >
                                    <input
                                        type='file'
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className='hidden'
                                        id="vgifUpload"
                                        data-max-size="5120"
                                        accept='.gif'
                                    />
                                    <GifIcon className='w-5 h-5' />
                                    <span>Upload Gif</span>
                                </label>
                                <div>
                                    {
                                        posting ? <Loading /> : <CustomButton
                                            type="submit"
                                            containerStyles={`bg-primary-500 px-6 py-1 text-sm font-medium text-white rounded-full font-semibold`}
                                            title="Post"
                                        />
                                    }
                                </div>
                            </div>
                        </form>
                        {loading ? (
                            <Loading />
                        ) : posts?.length > 0 ? (
                            posts?.map((post) => (
                                <PostCard key={post?._id} post={post} user={user} deletePost={handleDelete} likePost={handleLikePost} />
                            ))
                        ) : ""}
                    </div>
                    <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
                        <div className='w-full bg-gray-50 dark:bg-gray-800 shadow-sm rounded-lg px-6 py-5'>
                            <div className='flex items-center justify-between text-xl text-gray-950 dark:text-gray-50 pb-2 border-b border-gray-300 dark:border-gray-700'>
                                <span>Friend Request</span>
                                <span>{friendRequest?.length}</span>
                            </div>
                            <div className='w-full flex flex-col gap-4 pt-4'>
                                {
                                    friendRequest?.map(({ _id, requestFrom: from }) => (
                                        <div key={_id} className='flex items-center justify-between'>
                                            <Link to={"/profile/" + from._id} className='w-full flex gap-4 items-center cursor-pointer' key={from._id}>
                                                <img
                                                    src={from?.profileUrl ?? NoProfile}
                                                    alt={from?.firstName}
                                                    className='w-10 h-10 object-cover rounded-full'
                                                />
                                                <div className='flex-1'>
                                                    <p className='text-base font-medium text-gray-950 dark:text-gray-50'>
                                                        {from?.firstName} {from?.lastName}
                                                    </p>
                                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                        {from?.profession ?? "No Profession"}
                                                    </span>
                                                </div>

                                            </Link>
                                            <div className='flex gap-1'>
                                                <CustomButton
                                                    title="Accept"
                                                    onClick={() => acceptFriendRequest(_id, "Accepted")}
                                                    containerStyles="bg-primary-500 text-xs text-gray-950 dark:text-gray-50 px-1.5 py-1 rounded-full"
                                                />
                                                <CustomButton
                                                    title="Deny"
                                                    onClick={() => acceptFriendRequest(_id, "Denied")}
                                                    containerStyles="border border-gray-600 dark:border-gray-400 text-xs text-gray-950 dark:text-gray-50 px-1.5 py-1 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className='w-full bg-gray-50 dark:bg-gray-800 shadow-sm rounded-lg px-5 py-5'>
                            <div className='flex items-center justify-between text-lg text-gray-950 dark:text-gray-50 border-b border-gray-300 dark:border-gray-700'>
                                <span>Friend Suggestions</span>
                            </div>
                            <div className='w-full flex flex-col gap-4 pt-4'>
                                {
                                    suggestedFriends?.map((friend) => (
                                        <div className='flex items-center justify-between' key={friend._id}>
                                            <Link to={"/profile/" + friend._id} className='w-full flex gap-4 items-center cursor-pointer' key={friend?._id}>
                                                <img
                                                    src={friend?.profileUrl ?? NoProfile}
                                                    alt={friend?.firstName}
                                                    className='w-10 h-10 object-cover rounded-full'
                                                />
                                                <div className='flex-1'>
                                                    <p className='text-base font-medium text-gray-950 dark:text-gray-50'>
                                                        {friend?.firstName} {friend?.lastName}
                                                    </p>
                                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                        {friend?.profession ?? "No Profession"}
                                                    </span>
                                                </div>
                                            </Link>
                                            <div className='flex gap-1'>
                                                <button
                                                    className='bg-primary-500 text-sm text-white p-1 rounded'
                                                    onClick={() => handleFriendRequest(friend._id)}>
                                                    <UserPlusIcon className='w-4 h-4 text-white' />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div >
            </div>
            {edit && <EditProfile />}
        </>
    );
};

export default Home;