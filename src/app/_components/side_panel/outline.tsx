"use client";
import { semanticSearch } from "@/app/_actions/vector_store";
import clsx from "clsx";
import { ExcerptCard } from "./excerpt_card";
import { Document } from "langchain/document";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../loading_spinner";
import { IoMdRefreshCircle } from "react-icons/io";
import {
    generateOutline,
    outlineResponse,
} from "@/app/_actions/rag/generate_outline";
import { ChatCompletion } from "openai/resources/index.mjs";
import { OutlineCard } from "./outline_card";
import { generalTextStyle } from "../main_editor/typography";

export const Outline = ({
    className,
    title,
    heading,
    notes,
    titleNotes,
    text,
}: {
    className?: string;
    title: string;
    heading: string;
    notes: string;
    titleNotes: string;
    text: string;
}) => {
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [outline, setOutline] = useState<outlineResponse[] | undefined>(
        undefined
    );
    const [refreshVisible, setRefreshVisible] = useState<boolean>(false);

    const getOutline = async () => {
        setIsWaiting(true);
        const outline: outlineResponse[] = await generateOutline({
            title,
            notes: titleNotes,
        });
        setOutline(outline);
        setIsWaiting(false);
        console.log(outline);
    };

    useEffect(() => {
        getOutline();
    }, []);

    useEffect(() => {
        setRefreshVisible(true);
    }, [title, heading, notes, text]);

    return (
        <div
            className={clsx(
                "flex-col rounded shadow",
                "rounded-l-sm border-l border-blue-500 dark:border-blue-500",
                "bg-gray-50 dark:bg-zinc-600/20",
                className,
                generalTextStyle
            )}
        >
            <div className="flex justify-between space-x-5 p-4">
                <div>OUTLINE</div>
                {refreshVisible && (
                    <IoMdRefreshCircle
                        className="size-6 text-gray-600 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-600"
                        onClick={getOutline}
                    />
                )}
            </div>
            {isWaiting ? (
                <LoadingSpinner className="size-10 align-middle justify-center p-4 m-10" />
            ) : (
                <div className="space-y-2 my-0 mx-0 w-auto">
                    {outline &&
                        outline.map((item) => <OutlineCard item={item} />)}
                </div>
            )}
        </div>
    );
};
