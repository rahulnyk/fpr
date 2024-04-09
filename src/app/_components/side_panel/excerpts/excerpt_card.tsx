import { Document } from "langchain/document";
import { Open_Sans } from "next/font/google";
import { Lato } from "next/font/google";
import clsx from "clsx";

export const textStyle = Lato({
    subsets: ["latin"],
    weight: "300",
});

export const ExcerptCard = ({ document }: { document: Document }) => {
    const filenameFromPath = (path: string) => {
        let filename = path.split("/").pop();
        filename = chopString(filename);
        return filename;
    };

    const sanitizePDFText = (pdfText: string) => {
        // Replace newline characters with <br> tags
        let text = pdfText.replace(/\n/g, "<br>");

        // Normalize spaces
        text = text.replace(/\s+/g, " ");

        // Trim leading and trailing whitespace
        text = text.trim();

        return text;
    };

    function chopString(str: string | undefined): string | undefined {
        if (!str) {
            return;
        }
        const maxLen = 40;
        if (str.length <= maxLen) {
            return str;
        } else {
            return str.substring(0, maxLen) + "...";
        }
    }

    return (
        <div
            className={clsx(
                "flex-col flex-grow rounded p-4 mx-0 text-pretty w-full",
                "text-zinc-500 dark:text-zinc-400"
            )}
        >
            {/* metadata */}
            <div
                className={clsx(
                    "flex-col space-y-1 justify-evenly text-sm px-2 py-2 rounded mb-4",
                    "bg-blue-100 dark:bg-blue-900/30"
                )}
            >
                <div className="font-bold">
                    {filenameFromPath(document?.metadata?.source)}
                </div>
                <div className="">
                    Page: {document?.metadata?.loc?.pageNumber}
                </div>
            </div>

            <div
                className={clsx(
                    "whitespace-pre-wrap break-normal font-light text-sm",
                    textStyle
                )}
                dangerouslySetInnerHTML={{
                    __html: sanitizePDFText(document?.pageContent),
                }}
            />
            <hr className="dark:border-zinc-700 my-4" />
        </div>
    );
};
