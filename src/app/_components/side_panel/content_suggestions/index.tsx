"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../loading_spinner";
import { IoMdRefreshCircle } from "react-icons/io";
import { generalTextStyle } from "../../main_editor/typography";
import { useCallback } from "react";
import { ChatCompletion } from "openai/resources/index.mjs";
import { generateContent } from "@/app/_actions/rag/generate_content";
import { ContentCard } from "./content_card";
import { useSectionContext } from "@/app/_store/sectionContextStore";

export const ContentSuggestions = ({ className }: { className?: string }) => {
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [content, setContent] = useState<ChatCompletion.Choice | null>(null);
    const [refreshVisible, setRefreshVisible] = useState<boolean>(false);
    const [contenthReferenceHeading, setContentReferenceHeading] = useState<
        string | null
    >();

    const heading = useSectionContext((state) => state.heading);
    const notes = useSectionContext((state) => state.notes);
    const text = useSectionContext((state) => state.text);

    const getContentSuggestions = useCallback(async () => {
        const contentSuggestions = await generateContent({
            heading,
            notes,
            text,
        });
        return contentSuggestions;
    }, [heading, notes, text]);

    const refresh = async () => {
        setIsWaiting(true);
        setContentReferenceHeading(heading);
        const contentSuggestions = await getContentSuggestions();
        setContent(contentSuggestions);
        console.log("From Content Suggestion Component", contentSuggestions);
        setIsWaiting(false);
        setRefreshVisible(false);
    };

    // useEffect(() => {
    //     refresh();
    // }, []);

    useEffect(() => {
        setRefreshVisible(true);
        // console.log("editor changed");
    }, [heading, notes, text]);

    return (
        <div
            className={clsx(
                // "flex-col rounded shadow pb-10",
                // "rounded-l-sm border-l border-blue-500 dark:border-blue-500",
                // "bg-gray-50 dark:bg-zinc-600/20",
                className,
                generalTextStyle
            )}
        >
            <div className="flex justify-between space-x-5 p-4">
                <div className={clsx("w-5/6")}>
                    CONTENT SUGGESTIONS
                    {contenthReferenceHeading
                        ? " | ".concat(contenthReferenceHeading)
                        : ""}
                </div>
                {!isWaiting && refreshVisible && (
                    <IoMdRefreshCircle
                        className="size-6 text-gray-600 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-600"
                        onClick={refresh}
                    />
                )}
            </div>
            <div className="px-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-5 pb-5">
                Content suggestions are based on the current heading and the
                current section notes. <br /> For better results, add more info
                to the current section notes.
            </div>
            {isWaiting ? (
                <LoadingSpinner className="size-10 align-middle justify-center p-4 m-10" />
            ) : (
                <div className="space-y-2 my-0 mx-0 w-auto">
                    {content && <ContentCard choice={content} />}
                </div>
            )}
        </div>
    );
};
