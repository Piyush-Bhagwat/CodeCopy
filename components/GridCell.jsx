import React from "react";

const GridCell = ({
    children,
    rowStart,
    colStart,
    colSpan,
    rowSpan,
    className,
}) => {
    return (
        <div
            className={`${className} shadow-md bg-indigo-200 dark:bg-neutral-900 p-2 rounded-lg md:h-full dark:text-neutral-100 row-start-${rowStart} col-start-${colStart} col-span-${colSpan} row-span-${rowSpan}`}
        >
            {children}
        </div>
    );
};

export default GridCell;
