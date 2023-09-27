import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NoProfile } from '../assets';
import TextInput from './TextInput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import { apiRequest } from '../utils';

const CommentForm = ({ user, id, replyAt, getComments }) => {
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "onChange" });
    const onSubmit = async (data) => {
        setLoading(true);
        setErrMsg("");
        try {
            const URL = !replyAt
                ? "/posts/comment/" + id
                : "/posts/reply-comment/" + id;

            const newData = {
                comment: data?.comment,
                from: user?.firstName + " " + user.lastName,
                replyAt: replyAt,
            };
            const res = await apiRequest({
                url: URL,
                data: newData,
                token: user?.token,
                method: "POST",
            });

            if (res?.status === "failed") {
                setErrMsg(res);
            } else {
                reset({ comment: "" });
                setErrMsg("");
                await getComments();
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}
                className='w-full border-b border-gray-300 dark:border-gray-700'>
                <div className='w-full flex items-center gap-2 py-4'>
                    <img
                        src={user?.profileUrl ?? NoProfile}
                        alt="User"
                        className='w-10 h-10 rounded-full object-cover'
                    />
                    <TextInput
                        name="comment"
                        styles="w-full rounded-full py-3"
                        placeholder={replyAt ? `Reply @${replyAt}` : "Comment on this post"}
                        register={register("comment", {
                            required: "Comment can't be empty!"
                        })}
                        error={errors.comment ? errors.comment.message : ""}
                    />
                </div>
                {
                    errMsg?.message && (
                        <span role='alert' className={`text-sm ${errMsg?.status === "failed" ? "text-primary-600 dark:text-primary-400" : "text-primary-500"} mt-0.5`}>{errMsg?.message}</span>
                    )
                }
                <div className='flex items-end justify-end pb-2'>
                    {loading ? (
                        <Loading />
                    ) : (
                        <CustomButton
                            title="Comment"
                            type="submit"
                            containerStyles="bg-primary-500 text-white py-1 px-3 rounded-full font-semibold text-sm"
                        />
                    )}
                </div>
            </form>
        </>
    );
};

export default CommentForm;