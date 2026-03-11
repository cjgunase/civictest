import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { QUESTION_BANK } from "../lib/civics/question-bank";
import { QUESTION_EXPLANATIONS } from "../lib/civics/question-explanations";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
    const newExplanations: Record<string, string> = {};

    console.log("Starting to generate history lessons...");

    for (const question of QUESTION_BANK) {
        const originalHtml = QUESTION_EXPLANATIONS[question.id];

        // Check if it already has a history lesson to avoid duplication during testing/failures
        if (originalHtml.includes("Fun History Fact")) {
            newExplanations[question.id] = originalHtml;
            continue;
        }

        try {
            console.log(`Generating for ${question.id}... ${question.prompt}`);
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an enthusiastic civics historian answering a request to add a fun and comprehensive small history lesson to a civics test study guide.",
                    },
                    {
                        role: "user",
                        content: `For the US Civics test question: "${question.prompt}" (accepted answers: ${question.acceptedAnswers.join(", ")}).
            
Here is the current simple explanation:
${originalHtml}

Provide a short, comprehensive, and fun historical fact (1-2 sentences, about 30-50 words maximum) that helps the student remember this answer. Make it engaging, maybe slightly surprising or fun. 
DO NOT INCLUDE any HTML tags in your response. JUST the raw text of the fun history fact. Never include introductory text like "Here is a fact:". Just the fact.`,
                    },
                ],
                temperature: 0.7,
            });

            const fact = response.choices[0].message.content?.trim() || "";

            // Append it to the HTML
            const newHtml = `${originalHtml}<div class="mt-4 pt-4 border-t border-border/50"><h4 class="font-semibold text-primary mb-2 flex items-center gap-1.5">&#128220; Fun History Fact</h4><p class="text-sm opacity-90">${fact}</p></div>`;

            newExplanations[question.id] = newHtml;
        } catch (e) {
            console.error(`Error generating for ${question.id}`, e);
            newExplanations[question.id] = originalHtml;
        }
    }

    // Generate file content
    const content = `export const QUESTION_EXPLANATIONS: Record<string, string> = {\n` +
        Object.keys(newExplanations)
            .map(
                (id) =>
                    `    "${id}": ${JSON.stringify(newExplanations[id])}`
            )
            .join(",\n\n") +
        `\n};\n`;

    fs.writeFileSync(
        path.join(process.cwd(), "lib", "civics", "question-explanations.ts"),
        content
    );

    console.log("Finished rewriting lib/civics/question-explanations.ts");
}

run();
