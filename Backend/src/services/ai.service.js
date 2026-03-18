const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
  title: z.string().describe("The title of the job for which the interview report is generated"),

  matchScore: z.number()
    .min(0)
    .max(100)
    .describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("A technical interview question"),
      intention: z.string().describe("What the interviewer wants to evaluate with this question"),
      answer: z.string().describe("How to answer this question effectively, including approach and key points")
    })
  ).describe("Technical interview questions with their intention and answers"),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("A behavioral interview question"),
      intention: z.string().describe("What the interviewer wants to evaluate (e.g. teamwork, leadership)"),
      answer: z.string().describe("How to answer using structured approach like STAR method")
    })
  ).describe("Behavioral interview questions with their intention and answers"),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The missing or weak skill in the candidate profile"),
      severity: z.enum(["low", "medium", "high"])
        .describe("Importance of this skill gap for the job")
    })
  ).describe("List of skill gaps with severity"),

  preparationPlan: z.array(
    z.object({
      day: z.number().int().min(1)
        .describe("Day number in preparation plan"),
      focus: z.string()
        .describe("Main focus area for the day"),
      tasks: z.array(z.string()).min(1)
        .describe("Tasks to complete on that day")
    })
  ).describe("Day-wise preparation plan")
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


const prompt = `Analyze the resume, self-description, and job description. Generate a comprehensive interview preparation report STRICTLY following this schema. ALWAYS provide AT LEAST:\n- 5 technical questions with detailed answers\n- 5 behavioral questions using STAR method\n- 3-5 skill gaps with severity\n- 7-day preparation plan\n\nResume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}`;


    const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)


}

module.exports = generateInterviewReport;
