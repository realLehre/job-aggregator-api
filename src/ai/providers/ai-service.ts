import { GoogleGenAI } from '@google/genai';
import { JobMatchResult } from '../../utils/job.interface';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeJobMatch = async (
  resumeText: string,
  jobTitle: string,
  jobSkills: string[],
  jobDescription: string,
): Promise<JobMatchResult> => {
  const prompt = `
    You are an AI job-matching assistant.
    
    Your task is to compare a candidate's resume against a job posting.
    
    JOB TITLE:
    ${jobTitle}
    
    JOB SKILLS:
    ${jobSkills.join(', ')}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    CANDIDATE RESUME:
    ${resumeText}
    
    Analyze the candidate's suitability for this specific job.
    
    Rules:
    - Base your analysis only on information present in the resume and job posting.
    - Do not invent skills, experience, qualifications, or achievements.
    - Consider both the explicitly listed skills and relevant experience described in the resume.
    - A skill should only be considered matched if the resume provides reasonable evidence that the candidate has that skill.
    - Missing skills are skills explicitly required or strongly emphasized by the job that are not supported by the resume.
    - Give an overall match score from 0 to 100.
    - Keep the summary concise.
    - You MUST return exactly 5 recommendations.
- Do not return fewer than 5.
- Every recommendation must be distinct and useful.
- If there are only a few major weaknesses, break them into different
  actionable resume improvements rather than returning fewer recommendations.

Possible recommendation areas include:
- Professional summary
- Skills section
- Work experience
- Project descriptions
- Achievement/impact statements
- Keywords from the job description
- Missing requirements
- Technology emphasis
- Resume wording
- Job-specific positioning

-Do not invent experience or skills.
Possible recommendation examples:
    - Include examples of how the candidate could phrase or improve the relevant resume section where appropriate.
    - Never recommend that the candidate claim or highlight an experience,skill, technology, or qualification unless it is supported by the resume.
    - If a required skill is missing, recommend learning it or mentioning it only if the candidate genuinely has that experience.
    `;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          score: {
            type: 'number',
          },
          summary: {
            type: 'string',
          },
          matchedSkills: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          missingSkills: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          recommendations: {
            type: 'array',
            minItems: 5,
            items: {
              type: 'string',
            },
          },
        },
        required: [
          'score',
          'summary',
          'matchedSkills',
          'missingSkills',
          'recommendations',
        ],
      },
    },
  });

  return JSON.parse(response.text!);
};
