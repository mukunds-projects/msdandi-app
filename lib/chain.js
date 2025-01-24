import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

// Define the schema for the output
const summarySchema = z.object({
  summary: z.string()
    .min(100, "Summary must be at least 100 characters")
    .max(1000, "Summary must not exceed 1000 characters"),
  cool_facts: z.array(z.string())
    .min(3, "Must provide at least 3 cool facts")
    .max(7, "Must not exceed 7 cool facts"),
  technologies: z.array(z.string())
    .min(1, "Must identify at least one technology")
    .max(10, "Must not exceed 10 technologies"),
  key_features: z.array(z.string())
    .min(1, "Must identify at least one key feature")
    .max(5, "Must not exceed 5 key features"),
  difficulty_level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimated_study_time: z.string()
});

// Create the output parser with the schema
const parser = StructuredOutputParser.fromZodSchema(summarySchema);

// Create the prompt template
const promptTemplate = PromptTemplate.fromTemplate(`
Analyze this GitHub repository README content and provide a comprehensive summary.
Focus on the main features, purpose, and unique aspects of the project.

README Content:
{readme_content}

{format_instructions}

Required sections in your analysis:
1. A detailed summary (100-1000 characters)
2. 3-7 interesting facts about the project
3. List of technologies used (1-10)
4. Key features (1-5 most important features)
5. Project difficulty level (Beginner/Intermediate/Advanced)
6. Estimated time to study and understand the codebase

Make sure to:
- Keep the summary informative and well-structured
- Focus on technical aspects and implementation details
- Include unique or innovative approaches used
- Consider the project's complexity and learning curve
`);

// Create the LLM
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
});

// Create the chain
const chain = RunnableSequence.from([
  {
    readme_content: (input) => input.readme_content,
    format_instructions: async () => parser.getFormatInstructions(),
  },
  promptTemplate,
  model,
  async (response) => {
    try {
      const parsed = await parser.parse(response.content);
      // Additional validation using the schema
      return summarySchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse or validate response:", e);
      throw new Error("Failed to generate valid summary");
    }
  },
]);

export async function summarizeReadme(readmeContent) {
  try {
    // Invoke the chain with the README content
    const result = await chain.invoke({
      readme_content: readmeContent,
    });

    return {
      ...result,
      processed_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in summarizeReadme:', error);
    throw new Error('Failed to summarize README content');
  }
} 