import React, { useState } from "react";

const EditModel = ({ title, onSave, value, setValue, setVisiblity, max }) => {
    const [prevValue, setVal] =useState(value);
    return (
        <div className="fixed bg-white/35 dark:bg-black/70 top-0 left-0 z-50 w-full h-[100vh] flex items-center justify-center">
            <div className="bg-indigo-300 dark:bg-neutral-800 p-4 flex flex-col gap-4 rounded-md">
                <h1 className="text-2xl font-bold">{title}</h1>

                <input
                    type="text"
                    value={value}
                    className="bg-transparent outline-2 outline-dashed outline-neutral-600 p-2 rounded-md"
                    onChange={(e) => setValue(e.target.value)}
                    maxLength={max}
                />

                <div>
                    <button
                        onClick={() => {
                            setValue(prevValue);
                            setVisiblity(false);
                        }}
                        className="mr-2 rounded-full bg-indigo-200  dark:bg-neutral-600 dark:text-white px-4 py-1 hover:bg-indigo-100  dark:hover:bg-neutral-700 active:scale-95 transition-all"
                    >
                        Cancle
                    </button>
                    <button
                        className="mr-2 rounded-full bg-indigo-500 text-white dark:bg-neutral-200 dark:text-black px-4 py-1 dark:hover:bg-neutral-400 hover:bg-indigo-400 active:scale-95 transition-all"
                        onClick={() => {
                            onSave();
                            setVisiblity(false);
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModel;
