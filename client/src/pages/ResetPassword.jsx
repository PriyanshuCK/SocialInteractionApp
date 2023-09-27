import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { TextInput, Loading, CustomButton } from "../components";
import { apiRequest } from "../utils";

const ResetPassword = () => {
    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors }
    } = useForm({
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const res = await apiRequest({
                url: "/users/request-passwordreset",
                data: data,
                method: "POST",
            });

            setErrMsg(res);
        } catch (error) {
            console.log(error);
        }
        setIsSubmitting(false);
    }; return (
        <>
            <div className='w-full h-[100vh] bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-6'>
                <div className='bg-gray-50 dark:bg-gray-800 w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
                    <p className='text-gray-950 dark:text-gray-50 text-lg font-semibold'>Email Address</p>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>Enter your email address</span>
                    <form onSubmit={handleSubmit(onSubmit)} className='py-4 flex flex-col gap-5'>
                        <TextInput
                            name="email"
                            placeholder="user@email.com"
                            type="email"
                            register={register("email", {
                                required: "Email Address is required",
                            })}
                            styles="w-full"
                            labelStyle="ml-2"
                            error={errors.email ? errors.email?.message : ""}
                        />
                        {
                            errMsg?.message && (
                                <span role='alert' className={`text-sm ${errMsg?.status === "failed" ? "text-primary-600 dark:text-primary-400" : "text-primary-500"} mt-0.5`}>{errMsg?.message}</span>
                            )
                        }
                        {
                            isSubmitting ? <Loading /> : <CustomButton
                                type="submit"
                                containerStyles={`inline-flex justify-center rounded-md bg-primary-500 px-8 py-3 text-sm font-medium text-white outline-none`}
                                title="Submit"
                            />
                        }
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;