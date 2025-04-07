"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function getRecommendations(location: string) {
  try {
    // Access the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a prompt for the AI
    const prompt = `
      Act as a travel expert and provide recommendations for ${location}.
      
      Please provide the following information in a structured format:
      
      1. Top 5 restaurants to try in ${location}, including a brief description of each (1-2 sentences).
      2. Top 5 events or activities to experience in ${location}, including a brief description of each (1-2 sentences).
      3. Top 5 travel tips for visitors to ${location}, including practical advice for travelers.
      
      Format your response as a JSON object with the following structure:
      {
        "restaurants": ["Restaurant 1 with brief description", "Restaurant 2 with brief description", ...],
        "events": ["Event 1 with brief description", "Event 2 with brief description", ...],
        "tips": ["Tip 1", "Tip 2", ...]
      }
      
      Only return the JSON object, nothing else.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract the JSON from the response
    // The response might contain markdown code blocks, so we need to extract just the JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) || [null, text];
    const jsonString = jsonMatch[1] || text;

    // Parse the JSON
    const recommendations = JSON.parse(jsonString.trim());

    return {
      restaurants: recommendations.restaurants || [],
      events: recommendations.events || [],
      tips: recommendations.tips || [],
    };
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw new Error("Failed to get recommendations");
  }
}
