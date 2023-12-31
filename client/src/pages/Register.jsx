import React, { useState } from 'react';
import { ArrowPathIcon, ShareIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/solid";
import { TextInput, Loading, CustomButton } from '../components';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BgImage } from '../assets';
import { apiRequest } from "../utils";

const Register = () => {
    const { register, handleSubmit, getValues, formState: { errors }, } = useForm({ mode: "onChange" });
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const res = await apiRequest({
                url: "/auth/register",
                data: data,
                method: "POST",
            });

            setErrMsg(res);

            if (res?.status !== "failed") {
                setTimeout(() => {
                    window.location.replace("/login");
                }, 5000);
            }

        } catch (error) {
            console.log(error);
        }
        setIsSubmitting(false);
    };
    return (
        <div className='bg-gray-200 dark:bg-gray-900 w-full h-[100vh] flex items-center justify-center p-6'>
            <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl'>
                <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-primary-500'>
                    <div className='relative w-full flex items-center justify-center'>
                        <img
                            src={BgImage}
                            alt='Background'
                            className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
                        />
                        <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
                            <ShareIcon className='h-3 w-3' />
                            <span className='text-xs font-medium'>Share</span>
                        </div>
                        <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
                            <UsersIcon className='h-3 w-3' />
                            <span className='text-xs font-medium'>Connect</span>
                        </div>
                        <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
                            <ArrowPathIcon className='h-3 w-3' />
                            <span className='text-xs font-medium'>Interact</span>
                        </div>
                    </div>
                    <div className='mt-16 text-center'>
                        <p className='text-white text-base'>
                            Connect with friends & have fun
                        </p>
                        <span className='text-sm text-white/80'>
                            Share memories with friends and the world
                        </span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
                    <div className='w-full flex gap-2 items-center mb-6'>
                        <div className='p-2 bg-primary-500 rounded text-white dark:text-gray-100'>
                            <UserGroupIcon className='h-6 w-6' />
                        </div>
                        <span className='text-2xl text-primary-500 font-semibold'>
                            Connect
                        </span>
                    </div>
                    <p className='text-gray-950 dark:text-gray-50 text-base font-semibold'>Create your account</p>

                    <form className='py-8 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                        <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
                            <TextInput
                                name="firstName"
                                placeholder="First Name"
                                label="First Name"
                                type="text"
                                register={register("firstName", {
                                    required: "First Name is required",
                                })}
                                styles="w-full"
                                labelStyle="ml-2"
                                error={errors.firstName ? errors.firstName?.message : ""}
                            />
                            <TextInput
                                name="lastName"
                                placeholder="Last Name"
                                label="Last Name"
                                type="text"
                                register={register("lastName", {
                                    required: "Last Name is required",
                                })}
                                styles="w-full"
                                labelStyle="ml-2"
                                error={errors.lastName ? errors.lastName?.message : ""} />
                        </div>

                        <TextInput
                            name="email"
                            placeholder="user@email.com"
                            label="Email Address"
                            type="email"
                            register={register("email", {
                                required: "Email Address is required",
                            })}
                            styles="w-full"
                            error={errors.email ? errors.email?.message : ""}
                        />

                        <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
                            <TextInput
                                name="password"
                                placeholder="Password"
                                label="Password"
                                type="password"
                                register={register("password", {
                                    required: "Password is required",
                                })}
                                styles="w-full"
                                error={errors.password ? errors.password?.message : ""}
                            />
                            <TextInput
                                placeholder="Password"
                                label="Confirm Password"
                                type="password"
                                register={register("cPassword", {
                                    validate: (value) => {
                                        const { password } = getValues();
                                        if (password !== value) {
                                            return "Both passwords should match!";
                                        }
                                    }
                                })}
                                styles="w-full"
                                error={errors.cPassword && errors.cPassword.type === "validate" ? errors.cPassword?.message : ""}
                            />
                        </div>
                        {
                            errMsg?.message && (
                                <span role='alert' className={`text-sm ${errMsg?.status === "failed" ? "text-primary-600 dark:text-primary-400" : "text-primary-500"} mt-0.5`}>{errMsg?.message}</span>
                            )
                        }
                        {
                            isSubmitting ? <Loading /> : <CustomButton
                                type="submit"
                                containerStyles={`inline-flex justify-center rounded-md bg-primary-500 px-8 py-3 text-sm font-medium text-white outline-none`}
                                title="Create Account"
                            />
                        }
                    </form>
                    <p className='text-gray-600 dark:text-gray-400 text-sm text-center'>
                        Already have an account?
                        <Link
                            to="/login"
                            className='text-primary-500 font-semibold ml-2 cursor-pointer'
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;