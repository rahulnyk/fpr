"use server";

import { OpenAI } from "openai"; // Import OpenAI library

const openai = new OpenAI(); // Initialize OpenAI with your API key

export type outlineResponse = {
    level: string;
    text: string;
    description: string;
};

export async function generateOutline({
    title,
    notes,
    outline,
}: {
    title: string;
    notes?: string;
    outline?: string[];
}) {
    const system_prompt = [
        "Develop an outline for an article discussing the topic give by the user.",
        "Incorporate the rough notes (if provided by the user) into your outline.",
        "Consider structuring your outline with an introduction, main sections, supporting points or arguments, and a conclusion.",
        "Create outline in the form of headings and subheadings",
        "Aim to create a clear and logical flow of ideas that effectively communicates your message to the reader.",
        "Respond with an array of objects as JSON array where every object is of the following type \n",
        `[{
            level: string ("heading", or "subheading"),
            text: string,
            description: what to write about in this heading or subheading,
        }, {...}]`,
    ].join(" ");

    const user_prompt: string = [
        `Topic: ${title}`,
        notes ? `Rough Notes: ${notes}.` : "",
        "Also suggest more ideas and headings (apart from my notes) that I can write about",
    ].join("\n");

    console.log(system_prompt, user_prompt);
    let outlineObject: outlineResponse[] = [];
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: user_prompt },
            ],
            model: "gpt-3.5-turbo",
            // response_format: { type: "json_object" },
        });

        let outlineResponse = completion.choices[0].message.content?.replace(
            /```json\n?|```/g,
            ""
        );
        console.log(outlineResponse);
        outlineObject = JSON.parse(outlineResponse ? outlineResponse : "[]");
    } catch (e) {
        outlineObject = [];
        console.log(e);
    } finally {
        return outlineObject;
    }
}