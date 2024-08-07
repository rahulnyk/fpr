"use server";

import { semanticSearch } from "../vector_store";
import { SearchResults } from "../return_types";
import { OutlineResponse } from "../return_types";

import { LLMProvider } from "../llms";
const [chatFunction] = LLMProvider();

export type outlineResponse = {
    level: string;
    text: string;
    description?: string;
};

export async function generateOutline({
    title,
    titleNotes,
}: {
    title: string | null;
    titleNotes?: string | null;
}): Promise<OutlineResponse> {
    if (!title && !titleNotes) {
        return {
            data: [],
            error: "I need a Title and some Notes about your article before I can suggest an outline",
        };
    }

    const searchString = `${title} \n ${titleNotes}`;
    const results: SearchResults = await semanticSearch({
        text: searchString,
        numResults: 5,
    });
    if (results.error) {
        // return { data: [], error: results.error };
        console.log(results.error);
    }
    const docsString = results.documents
        .map((doc) => doc.pageContent)
        .join("\n-\n");
    const system_prompt = [
        "Develop the outline for an article discussing the topic given by the user.",
        "Incorporate the rough titleNotes (if provided by the user) into your outline.",
        "Consider structuring your outline with an introduction, main sections, supporting points or arguments, and a conclusion.",
        "Aim to create a clear and logical flow of ideas that effectively communicates your message to the reader.",
        "Aim to create headings that cover distinct aspects of the topic that do not overlap with each other",
        "Remember to add conclusion and references headings towards the end of the outline",
        "Respond with a valid JSON with the following schema\n",
        // "Respond with a JSON array of objects where every object is of the following type \n",
        `[{
            level: string ("heading"),
            text: string,
            description: Text. Notes on what to write in this heading. be detailed when possible,
        }, {...}]`,
    ].join(" ");

    const user_prompt: string = [
        `Topic: ${title}`,
        titleNotes ? `Rough titleNotes: ${titleNotes}.` : "",
        `docs: ${docsString} \n ----- \n`,
        "Also suggest more ideas and headings (apart from my titleNotes) that I can write about",
    ].join("\n");

    console.log("SYS\n", system_prompt, "USER\n", user_prompt);
    try {
        const completion = await chatFunction({
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: user_prompt },
            ],
            model: process.env.MODEL ? process.env.MODEL : "gpt-3.5-turbo",
            // response_format: { type: "json_object" },
        });

        let outlineResponse = completion.choices[0].message.content?.replace(
            /```json\n?|```/g,
            ""
        );
        // console.log(outlineResponse);
        if (!outlineResponse) {
            return {
                data: [],
                error: "Could not get a response from LLM. Please try again",
            };
        }
        return { data: JSON.parse(outlineResponse) };
    } catch (e: any) {
        console.log(e);
        return { data: [], error: e?.message };
    }
}
