"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { WritingPointsSuggestionsCard } from "./writing_points_suggestions_card";
import { generateWritingPoints } from "@/app/_actions/rag/generate_writing_points";
import { wpSuggestion } from "./writing_points_suggestions_card";
import { useSectionContext } from "@/app/_store/sectionContextStore";
import { TabPanel } from "../tab_panel";
import { ReturnParams } from "@/app/_actions/return_types";
import toast from "react-hot-toast";
import { FpToaster } from "../../fp_toast";
export const WritingPointsSuggestions = ({
    className,
}: {
    className?: string;
}) => {
    const heading = useSectionContext((state) => state.heading);
    const notes = useSectionContext((state) => state.notes);
    const text = useSectionContext((state) => state.text);

    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [writingPoints, setWritingPoints] = useState<wpSuggestion[] | null>(
        null
    );
    const [active, setActive] = useState<boolean>(false);

    const getWritingPointsSuggestions = useCallback(async () => {
        const writingPointsSuggestions = await generateWritingPoints({
            heading,
            notes,
            // text,
        });
        return writingPointsSuggestions;
    }, [heading, notes, text]);

    const refresh = async () => {
        setIsWaiting(true);

        const writingPointsSuggestions: ReturnParams =
            await getWritingPointsSuggestions();
        if (writingPointsSuggestions.error) {
            toast.error(writingPointsSuggestions.error);
        } else {
            setWritingPoints(writingPointsSuggestions.data);
        }

        setIsWaiting(false);
        // setActive(false);
    };

    useEffect(() => {
        setActive(true);
    }, [heading, notes]);

    return (
        <TabPanel
            isWaiting={isWaiting}
            className={className}
            subheadingText="Writing points are generated based on your documents and current section title and notes."
            onClick={refresh}
            buttonActive={active}
            key="tab_panel_wp"
            buttonText="EXTRACT WRITING POINTS"
        >
            <div className="space-y-2 my-0 mx-0 w-auto">
                {writingPoints &&
                    writingPoints.map((item) => (
                        <WritingPointsSuggestionsCard
                            item={item}
                            key={`wp-suggestions-${item.key}`}
                        />
                    ))}
            </div>
            <FpToaster />
        </TabPanel>
    );
};
