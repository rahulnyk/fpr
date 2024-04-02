import { useSlate } from "slate-react";
import { dropDownOptions } from "./assistant_button/assistant_menu_items";
import { useEffect, useState } from "react";
import { Headings } from "../main_editor/types";
import { Node } from "slate";
import { Excerpts } from "./excerpts/excerpts";
import { generateOutline } from "@/app/_actions/rag/generate_outline";
import { Outline } from "./outline/outline";

export const AssistantPanel = ({
    dropDownItem,
}: {
    dropDownItem: dropDownOptions;
}) => {
    const editor = useSlate();

    const [heading, setHeading] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [titleNotes, setTitleNotes] = useState<string>("");
    const [action, setAction] = useState<string | undefined>();
    const getSectionText = () => {
        const sectionText = editor.getCurrentSectionText();
        return sectionText ? sectionText : "";
    };

    const getSectionNotes = () => {
        const sectionNotes = editor.getCurrentSectionNotes();
        return sectionNotes ? sectionNotes : "";
    };

    const getSectionHeading = () => {
        const currentSectionHeading = editor.getPreviousSibling([...Headings]);
        let text = "";
        if (currentSectionHeading) {
            const [n, _] = currentSectionHeading;
            text = Node.string(n);
        }
        return text;
    };

    const getTitle = () => {
        const title = editor.getTitleString();
        return title ? title : "";
    };

    const getTitleNotes = () => {
        const titleNotes = editor.getTitleNotes();
        return titleNotes ? titleNotes : "";
    };

    useEffect(() => {
        setAction(dropDownItem.action);
        setHeading(getSectionHeading());
        setText(getSectionText());
        setNotes(getSectionNotes());
        setTitle(getTitle());
        setTitleNotes(getTitleNotes());
    }, [dropDownItem.action, editor.selection]);

    return (
        <div className="text-gray-800 dark:text-gray-200">
            {(action === "semanticSearch" && (
                <Excerpts
                    title={title}
                    heading={heading}
                    notes={notes}
                    text={text}
                    titleNotes={titleNotes}
                />
            )) ||
                (action === "suggestFromResearch" && (
                    <div>
                        Suggests From Research:{" "}
                        {[title, heading, notes].join("\n")}
                    </div>
                )) ||
                (action === "generateHeadings" && (
                    <div>
                        {/* Generate Headings: {[title, heading, notes].join("\n")} */}
                        <Outline
                            title={title}
                            heading={heading}
                            notes={notes}
                            text={text}
                            titleNotes={titleNotes}
                        />
                    </div>
                ))}
        </div>
    );
};