import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { z } from "zod";

dotenv.config();

// Zod Schema for input validation
const insightsSchema = z.object({
  formData: z.object({
    // Step 1: Personal Information
    fullName: z.string().max(100).optional(),
    mobileNumber: z.string().max(30).optional(),
    email: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    pinCode: z.string().max(20).optional(),
    currentOccupation: z.string().max(100).optional(),
    yearsOfExperience: z.string().max(50).optional(),

    // Step 2: Business Information
    businessType: z.string().max(100).optional(),
    industry: z.string().max(100).optional(),
    currentBusiness: z.string().max(10).optional(),
    businessExperience: z.string().max(500).optional(),
    timeline: z.string().max(100).optional(),

    // Legacy parameters compatibility
    category: z.string().max(100).optional(),
    description: z.string().max(2000).optional(),

    // Step 3: Investment
    availableBudget: z.string().max(100).optional(),
    maximumBudget: z.string().max(100).optional(),
    loanRequired: z.string().max(10).optional(),
    monthlyInvestmentCapacity: z.string().max(100).optional(),
    fundingSource: z.string().max(100).optional(),

    // Legacy parameters compatibility
    budget: z.string().max(100).optional(),

    // Step 4: Location
    preferredCountry: z.string().max(100).optional(),
    preferredState: z.string().max(100).optional(),
    preferredCity: z.string().max(100).optional(),
    preferredPinCode: z.string().max(20).optional(),
    canRelocate: z.string().max(10).optional(),

    // Step 5: Goals
    monthlyIncomeGoal: z.string().max(100).optional(),
    longTermGoal: z.string().max(2000).optional(),
    businessObjective: z.string().max(2000).optional(),
    preferredMarket: z.string().max(100).optional(),

    // Legacy parameters compatibility
    goals: z.string().max(2000).optional(),
  }),
});

// Zod schemas for other endpoints
const researchDraftSchema = z.object({
  businessCategory: z.string().max(100).optional(),
  businessType: z.string().max(100).optional(),
  investment: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  draftType: z.string().max(50).optional(),
  specialRequirements: z.string().max(1000).optional()
});

const businessDiscoverySchema = z.object({
  age: z.string().max(20).optional(),
  education: z.string().max(100).optional(),
  occupation: z.string().max(100).optional(),
  experience: z.string().max(100).optional(),
  skills: z.string().max(500).optional(),
  languages: z.string().max(200).optional(),
  currentIncome: z.string().max(100).optional(),
  availableBudget: z.string().max(100).optional(),
  maximumBudget: z.string().max(100).optional(),
  loanRequired: z.string().max(20).optional(),
  investmentTimeline: z.string().max(100).optional(),
  monthlyInvestmentCapacity: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  pinCode: z.string().max(20).optional(),
  canRelocate: z.string().max(20).optional(),
  preferredArea: z.string().max(100).optional(),
  businessPreference: z.string().max(100).optional(),
  interestCategories: z.string().max(500).optional(),
  monthlyIncomeGoal: z.string().max(100).optional(),
  fiveYearGoal: z.string().max(500).optional(),
  tenYearGoal: z.string().max(500).optional(),
  expansionGoals: z.string().max(500).optional(),
  riskProfile: z.string().max(100).optional(),
  currentBusiness: z.string().max(100).optional(),
  availableTeam: z.string().max(500).optional(),
  factory: z.string().max(100).optional(),
  warehouse: z.string().max(100).optional(),
  office: z.string().max(100).optional(),
  vehicle: z.string().max(100).optional(),
  licenses: z.string().max(500).optional(),
  otherAssets: z.string().max(1000).optional()
});

const businessOsSchema = z.object({
  profile: z.any().optional(),
  goals: z.any().optional(),
  tasks: z.array(z.any()).optional(),
  documents: z.array(z.any()).optional(),
  health: z.any().optional()
});

const knowledgeSchema = z.object({
  question: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  userProfile: z.any().optional()
});

const ceoInsightsSchema = z.object({
  metrics: z.any().optional(),
  trends: z.any().optional(),
  alerts: z.any().optional()
});

// Rate Limiters Configuration (Thresholds configurable via env vars or defaults)
const GLOBAL_LIMIT = parseInt(process.env.RATE_LIMIT_GLOBAL || "100", 10);
const GLOBAL_WINDOW = parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS || "900000", 10); // 15 mins
const AUTH_LIMIT = parseInt(process.env.RATE_LIMIT_AUTH || "5", 10);
const AUTH_WINDOW = parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || "900000", 10); // 15 mins

// 1. General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: GLOBAL_WINDOW,
  max: GLOBAL_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

import slowDown from "express-slow-down";

// 2. Strict Auth Rate Limiter with exponential backoff
const authSpeedLimiter = slowDown({
  windowMs: AUTH_WINDOW, 
  delayAfter: Math.floor(AUTH_LIMIT / 2), // allow half of limit at full speed, then delay
  delayMs: 500, // adds 500ms of delay per request above limit
});

const authLimiter = rateLimit({
  windowMs: AUTH_WINDOW,
  max: AUTH_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global middleware
  app.use(express.json({ limit: "50kb" })); // Prevent large payloads

  // Apply rate limiters
  app.use("/api/", apiLimiter);
  app.use("/api/auth/", authSpeedLimiter, authLimiter); // Applies to future auth endpoints

  // AI API Route
  app.post("/api/ai/insights", async (req, res) => {
    try {
      // 2. Input Validation (strict schema)
      const parseResult = insightsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid input format.",
          details: parseResult.error.issues 
        });
      }

      const { formData } = parseResult.data;
      
      if (!process.env.GEMINI_API_KEY) {
        // Internal error (do not leak to client)
        console.error("Internal Server Error: GEMINI_API_KEY is missing.");
        return res.status(500).json({ error: "An internal server error occurred. Please try again later." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are an expert business consultant. Analyze the following business discovery and investment data and provide comprehensive, actionable feasibility insights.
        
        Business Data:
        - Full Name: \${formData.fullName || "N/A"}
        - Current Occupation: \${formData.currentOccupation || "N/A"} (\${formData.yearsOfExperience || "0"} years experience)
        - Business Type Requested: \${formData.businessType || formData.category || "N/A"}
        - Business Sector/Industry: \${formData.industry || "N/A"}
        - Description of Idea: \${formData.description || "N/A"}
        - Has Current Business: \${formData.currentBusiness || "No"}
        - Past Business Experience: \${formData.businessExperience || "None"}
        
        Investment Parameters:
        - Available Budget: \${formData.availableBudget || formData.budget || "N/A"}
        - Maximum Budget Capability: \${formData.maximumBudget || "N/A"}
        - Loan Required: \${formData.loanRequired || "No"}
        - Monthly Investment Capacity: \${formData.monthlyInvestmentCapacity || "N/A"}
        - Funding Source: \${formData.fundingSource || "N/A"}
        
        Geographic Constraints:
        - Target Market Location: Preferred City: \${formData.preferredCity || formData.city || "N/A"}, State: \${formData.preferredState || formData.state || "N/A"}, Country: \${formData.preferredCountry || formData.country || "N/A"}, PIN Code: \${formData.preferredPinCode || formData.pinCode || "N/A"}
        - Can Relocate: \${formData.canRelocate || "No"}
        
        Goals & Metrics:
        - Monthly Income Goal: \${formData.monthlyIncomeGoal || "N/A"}
        - Long-term Vision: \${formData.longTermGoal || "N/A"}
        - Main Business Objective: \${formData.businessObjective || formData.goals || "N/A"}
        - Preferred Market Scale: \${formData.preferredMarket || "N/A"}
        - Setup Timeline: \${formData.timeline || "N/A"}

        Provide your response in the following precise structured JSON format:
        {
          "summary": "A 2-3 sentence executive overview of the feasibility and market potential.",
          "opportunityScore": 85, // number from 0 to 100 assessing market demand and scale potential
          "difficultyScore": 45, // number from 0 to 100 assessing complexity, capital intensity, regulatory hurdles
          "investmentLevel": "Medium", // "Low" or "Medium" or "High"
          "suggestedIndustries": ["Industry 1", "Industry 2"], // 2-3 specific matching sectors
          "suggestedBusinessTypes": ["Type 1", "Type 2"], // 2-3 tactical business models
          "generalRecommendations": [
            "Recommendation 1",
            "Recommendation 2",
            "Recommendation 3"
          ],
          "strengths": ["Key strength or competitive advantage 1", "Key strength or competitive advantage 2"],
          "risks": ["Critical risk factor or barrier to entry 1", "Critical risk factor or barrier to entry 2"],
          "nextSteps": [
            "Filing GST or entity setup action step",
            "Market research action step",
            "Initial capital deployment action step"
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text;
      const jsonStr = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      const insights = JSON.parse(jsonStr);

      res.json(insights);
    } catch (error) {
      // 5. Error handling & information leakage prevention
      // Log full details server-side
      console.error("AI Insights Error:", error);
      // Return generic message to client
      res.status(500).json({ error: "Failed to generate AI insights due to an internal error." });
    }
  });

  // AI Research Assistant Draft Generator API
  app.post("/api/research/draft", async (req, res) => {
    try {
      const parseResult = researchDraftSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid input format.",
          details: parseResult.error.issues 
        });
      }
      const { businessCategory, businessType, investment, location, draftType, specialRequirements } = parseResult.data;

      if (!process.env.GEMINI_API_KEY) {
        console.error("Internal Server Error: GEMINI_API_KEY is missing.");
        return res.status(500).json({ error: "An internal error occurred." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompts: { [key: string]: string } = {
        market_overview: `Draft an exhaustive Market Overview for a proposed ${businessCategory || "Business"} (${businessType || "Standard Model"}) located in ${location || "India"}. Include regional demand trends, YoY growth parameters, and primary target consumer demographic insights. ${specialRequirements ? "Special requirements: " + specialRequirements : ""}`,
        industry_overview: `Draft a high-level Industry Overview for ${businessCategory || "Business"} in ${location || "India"}. Highlight sectoral policies, manufacturing hubs, wholesale sourcing networks, and crucial regulatory frameworks.`,
        competitor: `Draft a Competitive Landscape and Competitor Analysis report for ${businessCategory || "Business"} in ${location || "India"}. Detail key direct/indirect competitor dynamics, common market-entry barriers, and unique selling proposition (USP) recommendations.`,
        swot: `Draft an exhaustive SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) for a proposed ${businessCategory || "Business"} venture in ${location || "India"} with an investment scale of ${investment || "Medium"}. Provide distinct, actionable bullet points for each quadrant.`,
        risks: `Draft a comprehensive Business Risks and Mitigation Matrix for a proposed ${businessCategory || "Business"} venture in ${location || "India"}. Detail supply-chain, regulatory, operational, and capital risks with concrete solutions.`,
        investment: `Draft a Detailed Capital Investment, CapEx, and Cost Structure model for starting a ${businessCategory || "Business"} business in ${location || "India"} with a budget size of ${investment || "Medium"}. Estimate initial equipment, license procurement, retail rentals, working capital reserves, and typical monthly overhead costs.`,
        marketing: `Draft an omnichannel Marketing Strategy for a ${businessCategory || "Business"} business in ${location || "India"}. Outline digital customer acquisition, local offline activations, and customer retention programs.`,
        sales: `Draft a tactical Sales and Distribution Guide for ${businessCategory || "Business"} (${businessType || "B2B/B2C"}). Define ideal partner margins, wholesale credit terms, sales target quotas, and customer checkout incentive designs.`,
        business_opportunity: `Draft a high-potential Business Opportunities report for ${businessCategory || "Business"} in ${location || "India"}. Spot emerging micro-niches, high-margin premium variations, and value-add options for rapid scalability.`,
        action_plan: `Draft a 90-Day Launch Action Plan (Phase 1: Week 1-4, Phase 2: Week 5-8, Phase 3: Week 9-12) for a proposed ${businessCategory || "Business"} in ${location || "India"} within the investment level of ${investment || "Medium"}.`,
        executive_summary: `Draft an elegant, professional Executive Summary for a premium corporate research dossier on starting a ${businessCategory || "Business"} in ${location || "India"} with an investment scale of ${investment || "Medium"}.`
      };

      const prompt = prompts[draftType] || `Draft a comprehensive, professional research briefing segment focusing on ${draftType} for starting a ${businessCategory || "Business"} business in ${location || "India"}.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      res.json({ draft: response.text });
    } catch (error) {
      console.error("AI Research Draft Generation Error:", error);
      res.status(500).json({ error: "Failed to generate research segment draft due to an internal error." });
    }
  });

  // AI Business Discovery Engine API
  app.post("/api/ai/business-discovery", async (req, res) => {
    try {
      const parseResult = businessDiscoverySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid input format.",
          details: parseResult.error.issues 
        });
      }
      const formData = parseResult.data;
      
      if (!process.env.GEMINI_API_KEY) {
        console.error("Internal Server Error: GEMINI_API_KEY is missing.");
        return res.status(500).json({ error: "An internal server error occurred." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are an elite AI Business Consultant and Discovery Engine.
        Analyze the following comprehensive user profile and generate the top 10 best business opportunities tailored exactly to their profile.
        
        Profile Data:
        - Personal Profile: Age: ${formData.age}, Education: ${formData.education}, Occupation: ${formData.occupation}, Experience: ${formData.experience}, Skills: ${formData.skills}, Languages: ${formData.languages}, Current Income: ${formData.currentIncome}
        - Investment: Available Budget: ${formData.availableBudget}, Maximum Budget: ${formData.maximumBudget}, Loan Required: ${formData.loanRequired}, Investment Timeline: ${formData.investmentTimeline}, Monthly Investment Capacity: ${formData.monthlyInvestmentCapacity}
        - Location: Country: ${formData.country}, State: ${formData.state}, City: ${formData.city}, PIN Code: ${formData.pinCode}, Can Relocate: ${formData.canRelocate}, Preferred Area: ${formData.preferredArea}
        - Business Preference: ${formData.businessPreference}
        - Interest Categories: ${formData.interestCategories}
        - Goals: Monthly Income Goal: ${formData.monthlyIncomeGoal}, 5 Year Goal: ${formData.fiveYearGoal}, 10 Year Goal: ${formData.tenYearGoal}, Expansion Goals: ${formData.expansionGoals}
        - Risk Profile: ${formData.riskProfile}
        - Additional Assets/Info: Current Business: ${formData.currentBusiness}, Available Team: ${formData.availableTeam}, Factory: ${formData.factory}, Warehouse: ${formData.warehouse}, Office: ${formData.office}, Vehicle: ${formData.vehicle}, Licenses: ${formData.licenses}, Other Assets: ${formData.otherAssets}
        
        Provide your response in the following precise structured JSON format:
        {
          "analysis": {
            "businessOpportunityScore": 85, // number 0-100
            "businessReadinessScore": 80, // number 0-100
            "investmentSuitability": "Explanation of investment fit",
            "riskAnalysis": "Explanation of risk factors",
            "skillMatch": "How well their skills match the recommended industries",
            "locationMatch": "Location advantages/disadvantages",
            "industryMatch": "Best matching industries",
            "expansionPotential": "Potential for growth based on goals",
            "growthPotential": "Overall growth trajectory",
            "recommendedBusinessModels": ["Model 1", "Model 2"]
          },
          "topRecommendations": [
            {
              "title": "Business Idea Title",
              "shortDescription": "2-3 sentence description.",
              "opportunityScore": 92,
              "investmentRequired": "Estimated investment range in local currency",
              "estimatedComplexity": "Low/Medium/High",
              "scalability": "Low/Medium/High",
              "recommendedLocation": "Specific recommended location type",
              "targetCustomers": "Description of target demographic",
              "suitableFor": "Why this is suitable for this specific user",
              "demand": "High/Medium/Low with explanation",
              "competition": "High/Medium/Low with explanation",
              "risk": "Risk level with explanation",
              "growth": "Growth projection",
              "roiAssumptions": "Expected ROI timeframe and percentage"
            }
          ] // Must contain exactly 10 distinct ideas
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text;
      const jsonStr = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      const result = JSON.parse(jsonStr);

      res.json(result);
    } catch (error) {
      console.error("AI Business Discovery Error:", error);
      res.status(500).json({ error: "Failed to generate AI Business Discovery due to an internal error." });
    }
  });

  // AI Business OS Advisor Endpoint
  app.post("/api/business-os/ai", async (req, res) => {
    try {
      const parseResult = businessOsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid input format.",
          details: parseResult.error.issues 
        });
      }
      const { profile, goals, tasks, documents, health } = parseResult.data;

      if (!process.env.GEMINI_API_KEY) {
        console.error("Internal Server Error: GEMINI_API_KEY is missing.");
        return res.status(500).json({ error: "An internal error occurred." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        You are an elite enterprise Business Operating System AI Advisor. Your goal is to analyze the current state of a business and provide highly specific, hyper-actionable, real corporate suggestions.
        Do NOT generate generic dummy responses or placeholders. Base your analysis on the actual business data provided.

        BUSINESS PROFILE:
        - Name: ${profile?.businessName || "N/A"}
        - Category: ${profile?.businessCategory || "N/A"}
        - Industry: ${profile?.industry || "N/A"}
        - GST: ${profile?.gst || "N/A"}
        - PAN: ${profile?.pan || "N/A"}
        - MSME: ${profile?.msme || "N/A"}
        - IEC (Import Export Code): ${profile?.iec || "N/A"}
        - Trademark Status: ${profile?.trademarkStatus || "N/A"}

        BUSINESS GOALS:
        - Monthly Revenue Goal: ₹${goals?.monthlyRevenueGoal || "N/A"} (Current: ₹${goals?.monthlyRevenueCurrent || "N/A"})
        - Annual Revenue Goal: ₹${goals?.annualRevenueGoal || "N/A"} (Current: ₹${goals?.annualRevenueCurrent || "N/A"})
        - Expansion Goal: ${goals?.expansionGoal || "N/A"}
        - Hiring Goal: ${goals?.hiringGoal || "N/A"}
        - Funding Goal: ${goals?.fundingGoal || "N/A"}
        - Export Goal: ${goals?.exportGoal || "N/A"}
        - Brand Goal: ${goals?.brandGoal || "N/A"}

        ACTIVE TASKS:
        ${(tasks || []).map((t: any) => `- [${t.priority} Priority] ${t.taskName} (Deadline: ${t.deadline}, Status: ${t.status}, Progress: ${t.progress}%)`).join("\n")}

        UPLOADED DOCUMENTS:
        ${(documents || []).map((d: any) => `- ${d.name} (${d.category}, Version: ${d.version})`).join("\n")}

        HEALTH METRICS:
        - Health Score: ${health?.healthScore || "N/A"}/100
        - Readiness Score: ${health?.readinessScore || "N/A"}/100
        - Growth Index: ${health?.growthIndex || "N/A"}/100

        Based strictly on the data above, perform a professional gap analysis. Identify:
        1. Critical pending task reminders or upcoming deadlines (prioritize high and critical tasks).
        2. Missing critical document types or renewals (check if GST, PAN, IEC, Trademark, Business Registration, or contracts are uploaded, flag if anything standard for this industry is missing).
        3. Clear, sequential Next Business Steps to improve the Readiness Score and Growth Index.
        4. Highly relevant BizNxt services that the company should avail (select from: 'Discovery Hub', 'Dubai Business Setup', 'Global Marketplace Sourcing', 'Trade Documentation Vault', 'Icegate & AD Code Registration', 'Customs Clearance SME Suite', 'Legal IP & Trademark Filing').

        Respond in the following exact JSON schema:
        {
          "reminders": ["string describing a critical task reminder or priority action"],
          "deadlines": ["string warning of an upcoming deadline"],
          "missingDocs": ["string listing a missing document or pending certificate renewal"],
          "nextSteps": ["detailed sequential business growth step"],
          "services": [
            {
              "name": "Service Name matching one of the options",
              "description": "Short explanation of how this service addresses their specific gap",
              "path": "the logical link path, e.g. /global/dubai-setup, /global/trade-docs, /launch, /discovery, /services"
            }
          ],
          "analysis": "A high-level executive summary of current business health, identifying strengths and concrete risk mitigation advice."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("AI Business OS Advisor Error:", error);
      res.status(500).json({ error: "Failed to generate AI Business Insights due to an internal server error." });
    }
  });

  // AI Knowledge Hub Assistant Endpoint
  app.post("/api/knowledge/ai", async (req, res) => {
    try {
      const parseResult = knowledgeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid input format.",
          details: parseResult.error.issues 
        });
      }
      const { question, category, userProfile } = parseResult.data;

      if (!process.env.GEMINI_API_KEY) {
        console.error("Internal Server Error: GEMINI_API_KEY is missing.");
        return res.status(500).json({ error: "An internal error occurred." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        You are India's premier corporate BizNxt Knowledge Hub AI Assistant for business owners, startup founders, and MSME leaders.
        Your goal is to answer the following business question thoroughly, objectively, and with high-value factual accuracy.
        
        USER QUESTION: "${question}"
        SELECTED TOPIC FILTER: "${category || "All Topics"}"
        USER PROFILE DATA: ${userProfile ? JSON.stringify(userProfile) : "N/A"}

        Respond strictly in the following JSON format:
        {
          "answer": "A detailed, structured educational markdown response answering the question, with bullet points, numbered lists, and subheadings where appropriate.",
          "relevantGuides": [
            {
              "title": "A highly descriptive title for a guide that addresses their query",
              "reason": "Why this guide is highly recommended for them"
            }
          ],
          "relatedTemplates": [
            {
              "name": "Template Name (e.g. Detailed Pitch Deck Outline, MSME Project Report, GST Checklist)",
              "type": "The category of template",
              "utility": "How this specific template helps them execute immediately"
            }
          ],
          "suggestedServices": [
            {
              "name": "One of the standard BizNxt Services (e.g., 'Discovery Hub', 'Dubai Business Setup', 'Global Marketplace Sourcing', 'Trade Documentation Vault', 'Icegate & AD Code Registration', 'Customs Clearance SME Suite', 'Legal IP & Trademark Filing')",
              "benefit": "Why they should avail this platform service to scale or solve this"
            }
          ],
          "recommendedReports": [
            {
              "name": "Name of a commercial report (e.g., 'Feasibility Study on Coir Pith Manufacturing', 'Import Trade Sourcing Analysis')",
              "focus": "The specific data focus of this report"
            }
          ],
          "learningPath": {
            "title": "Custom recommended learning roadmap name",
            "steps": [
              "Step 1 description (e.g., Incorporate LLP or Private Limited)",
              "Step 2 description (e.g., Apply for MSME Udyam and GST Registration)",
              "Step 3 description (e.g., Formulate standard operating procedures for raw sourcing)"
            ]
          },
          "consultingDisclaimer": "A clearly separated professional consulting disclaimer emphasizing that this information is for educational purposes and is not formal legal, financial, or tax advice."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("AI Knowledge Assistant Error:", error);
      res.status(500).json({ error: "Failed to fetch AI answer due to an internal error." });
    }
  });

  // AI CEO Command Center Insights API
  app.post("/api/ceo/insights", async (req, res) => {
    try {
      const parseResult = ceoInsightsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid input format.",
          details: parseResult.error.issues 
        });
      }
      const { metrics, trends, alerts } = parseResult.data;

      if (!process.env.GEMINI_API_KEY) {
        console.error("Internal Server Error: GEMINI_API_KEY is missing.");
        return res.status(500).json({ error: "An internal error occurred." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are the AI Chief Strategy Officer for BizNxt. Analyze the following enterprise performance data and provide 3-4 high-level strategic insights for the CEO.
        
        PERFORMANCE METRICS:
        ${JSON.stringify(metrics)}
        
        TRENDS:
        ${JSON.stringify(trends)}
        
        ACTIVE ALERTS:
        ${JSON.stringify(alerts)}

        Provide insights that are actionable and focus on:
        1. Growth opportunities
        2. Risk mitigation
        3. Operational efficiency
        
        Respond in the following precise structured JSON format:
        {
          "insights": [
            {
              "type": "opportunity" | "risk" | "summary",
              "title": "Short descriptive title",
              "description": "1-2 sentence detailed strategic observation"
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || '{"insights": []}');
      res.json(result);
    } catch (error) {
      console.error("CEO Insights Error:", error);
      res.status(500).json({ error: "Failed to generate CEO insights due to an internal error." });
    }
  });

  // 6. File upload safety (Placeholder/documentation for future routes)
  // Upload endpoints should validate mime types (e.g. using 'file-type'), 
  // enforce size limits via multer, and store files outside web root (e.g. S3/GCS).

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
