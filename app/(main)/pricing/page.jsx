import GridCell from "@/components/GridCell";
import React from "react";

const Page = () => {
    return (
        <>
            <GridCell
                rowStart={4}
                colStart={1}
                colSpan={2}
                rowSpan={8}
                className="md:rounded-l-none pl-4"
            ></GridCell>

            <GridCell
                rowStart={4}
                colStart={4}
                colSpan={8}
                rowSpan={8}
                className=""
            >
                <div className="flex justify-center h-full gap-6 p-8">
                    {/* Free Plan */}
                    <div className="w-72 p-6 flex flex-col items-center text-center justify-around border-2 border-dashed rounded-2xl shadow-lg bg-white dark:bg-transparent">
                        <h3 className="text-2xl font-semibold ">Free</h3>
                        <p className="text-gray-500 ">
                            Great for getting started
                        </p>
                        <div className="mt-4 space-y-2 ">
                            <p className="flex items-center justify-center gap-2">
                                ✅ Unlimited boards
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                ❌ 10 codes per board
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                ❌ Private boards
                            </p>
                        </div>
                        <button className="mt-6 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:scale-105 transition-all duration-75 active:scale-95">
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="w-72 p-6 flex flex-col items-center text-center justify-around border-2 border-neutral-600 border-dashed rounded-2xl shadow-lg dark:bg-neutral-300 bg-indigo-400">
                        <h3 className="text-2xl text-indigo-50 dark:text-neutral-900 font-semibold">
                            Pro
                        </h3>
                        <p className="text-indigo-200 dark:text-neutral-500">
                            For professionals & teams
                        </p>
                        <div className="mt-4 space-y-2 dark:text-neutral-800">
                            <p className="flex items-center justify-center gap-2">
                                ✅ Unlimited boards
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                ✅ Unlimited codes
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                ✅ Private boards
                            </p>
                        </div>
                        <button className="mt-6 hover:scale-105 transition-all duration-75 active:scale-95 w-full py-2 bg-white dark:bg-neutral-400 text-neutral-900 font-semibold rounded-lg">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </GridCell>
        </>
    );
};

export default Page;
