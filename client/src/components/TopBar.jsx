import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { BellIcon, MoonIcon, SunIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { TextInput, CustomButton } from "./index";
import { useForm } from "react-hook-form";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";

const TopBar = () => {
    const { theme } = useSelector(state => state.theme);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const handleSearch = async (data) => {

    };

    const handleTheme = () => {
        const themeValue = theme === "light" ? "dark" : "light";
        dispatch(SetTheme(themeValue));
    };
    return (
        <>
            <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-gray-50 dark:bg-gray-800'>
                <Link to="/" className="flex gap-2 items-center">
                    <div className='p-1 md:p-2 bg-primary-500 rounded text-white'>
                        <UserGroupIcon className='h-6 w-6' />
                    </div>
                    <span className='text-xl md:text-2xl text-primary-500 font-semibold'>Connect</span>
                </Link>
                <form className='hidden md:flex items-center justify-center' onSubmit={handleSubmit(handleSearch)}>
                    <TextInput
                        placeholder="Search..."
                        styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
                        register={register("search")}
                    />
                    <CustomButton
                        title="Search"
                        type="submit"
                        containerStyles="bg-primary-500 text-gray-50 dark:text-gray-800 px-6 py-2.5 mt-2 rounded-r-full"
                    />
                </form>
                <div className='flex gap-4 items-center text-gray-950 dark:text-gray-50 text-lg md:text-xl'>
                    <button onClick={() => { handleTheme(); }}>
                        {theme === "light" ? <MoonIcon className='h-5 w-5' /> : <SunIcon className='h-5 w-5' />}
                    </button>
                    <div className='hidden lg:flex'>
                        <BellIcon className='h-5 w-5' />
                    </div>
                    <div>
                        <CustomButton
                            onClick={() => dispatch(Logout())}
                            title="Log Out"
                            containerStyles="text-sm text-gray-950 dark:text-gray-50 px-4 md:px-6 py-1 md:py-2 border border-gray-600 dark:border-gray-400 rounded-full"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopBar;