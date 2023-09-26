import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { XMarkIcon } from '@heroicons/react/24/solid';
import TextInput from './TextInput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import { UpdateProfile } from '../redux/userSlice';

const EditProfile = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [picture, setPicture] = useState(null);

    const { register, handleSubmit, formState: { errors }, } = useForm({
        mode: "onChange",
        defaultValues: { ...user },
    });

    const onSubmit = async (data) => {

    };

    const handleClose = () => {
        dispatch(UpdateProfile(false));
    };

    const handleSelect = (e) => {
        setPicture(e.target.files[0]);
    };

    return (
        <>
            <div className='fixed z-50 inset-0 overflow-y-auto'>
                <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                    <div className='fixed inset-0 transition-opacity'>
                        <div className='absolute inset-0 bg-gray-950 opacity-70'>
                        </div>
                        <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
                        </span>
                        &#8203;
                        <div className='inline-block align-bottom bg-gray-50 dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
                            role='dialog'
                            aria-model="true"
                            aria-labelledby='modal-headline'
                        >
                            <div className='flex justify-between px-6 pt-5 pb-2'>
                                <label
                                    htmlFor='name'
                                    className='block font-medium text-xl text-gray-950 dark:text-gray-50 text-left'
                                >
                                    Edit Profile
                                </label>
                                <button className='text-gray-950 dark:text-gray-50' onClick={handleClose}>
                                    <XMarkIcon className='w-5 h-5 text-primary-500' />
                                </button>
                            </div>
                            <form className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
                                onSubmit={handleSubmit(onSubmit)}>
                                <TextInput
                                    name="firstName"
                                    placeholder="First Name"
                                    label="First Name"
                                    type="text"
                                    register={register("firstName", {
                                        required: "First Name is required!",
                                    })}
                                    styles="w-full"
                                    error={errors.firstName ? errors.firstName?.message : ""}
                                />
                                <TextInput
                                    name="lastName"
                                    placeholder="Last Name"
                                    label="Last Name"
                                    type="text"
                                    register={register("lastName", {
                                        required: "Last Name is required!",
                                    })}
                                    styles="w-full"
                                    error={errors.lastName ? errors.lastName?.message : ""}
                                />
                                <TextInput
                                    name="profession"
                                    placeholder="Profession"
                                    label="Profession"
                                    type="text"
                                    register={register("profession", {
                                        required: "Profession is required!",
                                    })}
                                    styles="w-full"
                                    error={errors.profession ? errors.profession?.message : ""}
                                />
                                <TextInput
                                    name="location"
                                    placeholder="Location"
                                    label="Location"
                                    type="text"
                                    register={register("location", {
                                        required: "Location is required!",
                                    })}
                                    styles="w-full"
                                    error={errors.location ? errors.location?.message : ""}
                                />
                                <label className='flex items-center gap-1 text-base text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 cursor-pointer my-4' htmlFor='imgUpload'>
                                    <input type='file'
                                        className=''
                                        id="imgUpload"
                                        onChange={(e) => handleSelect(e)}
                                        accept='.jpg, .png, .jpeg'
                                    />
                                </label>
                                {
                                    errMsg?.message && (
                                        <span role='alert' className={`text-sm ${errMsg?.status === "failed" ? "text-primary-600 dark:text-primary-400" : "text-primary-500"} mt-0.5`}>{errMsg?.message}</span>
                                    )
                                }
                                <div className='py-5 sm:flex sm:flex-row-reverse border-t border-gray-300 dark:border-gray-700'>
                                    {
                                        isSubmitting ? <Loading /> : <CustomButton
                                            type="submit"
                                            containerStyles={`inline-flex justify-center rounded-md bg-primary-500 px-8 py-3 text-sm font-medium text-white outline-none`}
                                            title="Submit"
                                        />
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default EditProfile;