/**
 * AI MISSION CONTROL — Gemini Integration (Legacy Static Script)
 * NOTE: This file is NOT currently loaded by the Next.js app.
 * The Next.js page.js handles AI via the /api/chat server-side route instead.
 * This file is kept for reference / potential static-HTML fallback use only.
 */

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Portfolio Data for AI Context
const PORTFOLIO_DATA = {
  profile: {
    name: "Aditya Takharya",
    role: "Application Engineer I",
    current_company: "CVENT",
    education: "B.Tech in Information Technology, GPA 9.0, Top 3 University Rank"
  },
  experience: [
    {
      company: "CVENT",
      role: "Application Engineer I",
      period: "Jan 2025 - Present",
      achievements: [
        "Received 3 performance awards: 2 Rockstar Awards for delivering code-level fixes for critical production issues and reducing resolution time; 1 POB Award for developing data recovery solutions that restored 80K+ database records, demonstrating ownership and urgency.",
        "Resolved high-impact production incidents end-to-end while maintaining a zero-escalation record through proactive root cause analysis and stakeholder communication.",
        "Debugged and resolved production issues affecting enterprise users by analyzing system behavior, logs, and service interactions to provide timely, high-quality resolutions.",
        "Engineered optimized SQL and N1QL queries for PostgreSQL and Couchbase databases, improving data retrieval performance and supporting maintainable workflows.",
        "Monitored distributed backend services using Datadog, Splunk, and AWS tooling to identify reliability trends, investigate incidents, and improve operational stability.",
        "Built and maintained internal tools using JavaScript/Node.js, focusing on code reuse, reliability, and improving developer workflows.",
        "Created and maintained documentation and troubleshooting guides to improve team efficiency and support quality."
      ]
    }
  ],
  education: {
    institution: "GGSIPU",
    degree: "B.Tech in Information Technology",
    period: "2021 - 2025",
    gpa: "9.0",
    highlights: [
      "Achieved Top 3 University Rank in semester examinations across the entire University (GGSIPU).",
      "Mastered Distributed Systems, Systems Architecture, and Full-Stack Development through specialized coursework.",
      "Engineered 'Project Nilam3' as a core academic project, exploring the intersection of Web3 and secure digital auctions."
    ]
  },
  projects: [
    {
      name: "Invoxio",
      type: "Full-Stack Real-Time Chat Application with Microservices Architecture",
      tech: ["Next.js", "TypeScript", "WebSocket", "PostgreSQL", "Apache Kafka", "Redis", "FastAPI", "Docker", "Python", "NLTK"],
      highlights: [
        "Architected horizontally scalable real-time messaging infrastructure designed for 1M+ concurrent users using WebSockets, Kafka, Redis, and distributed Node.js services.",
        "Built event-driven microservices using Apache Kafka to decouple message processing and improve scalability, fault isolation, and reliability.",
        "Designed messaging workflows with extensible moderation and sentiment-analysis pipelines to support safer community interactions.",
        "Established monorepo architecture enabling code sharing across microservices, aligning with agile workflows.",
        "Built an AI-driven containerized sentiment-analysis feature service using Python FastAPI and NLTK.",
        "Live Link: invoxio.vercel.app"
      ]
    },
    {
      name: "Dilemma",
      type: "AI-Powered Social Decision-Making Platform",
      tech: ["Next.js 14", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Prisma", "TailwindCSS", "AI APIs"],
      highlights: [
        "Built an AI-powered community decision-making platform enabling anonymous discussions, real-time user engagement, and intelligent recommendation systems.",
        "Engineered leaderboard, streak, and gamification mechanics to improve retention and platform activity.",
        "Integrated AI-driven workflows for content enhancement, moderation assistance, and personalized engagement experiences.",
        "Designed scalable backend workflows with Redis caching, Prisma ORM, and optimized API patterns to support low-latency social interactions.",
        "Live Link: dilemmaa.vercel.app"
      ]
    },
    {
      name: "Nilam3",
      type: "Decentralized Auction Protocol (Web3)",
      tech: ["Solidity", "Hardhat", "Ethereum", "Web3.js", "Next.js", "Prisma"],
      highlights: [
        "Architected a decentralized auction protocol on the Ethereum blockchain for immutable and transparent digital asset exchange.",
        "Developed and audited smart contracts in Solidity using Hardhat for trustless bidding and ownership verification.",
        "Built a responsive Web3 interface using Next.js and Web3.js to interact directly with the blockchain.",
        "Ensured data consistency between on-chain events and off-chain caching layers using Prisma."
      ]
    }
  ],
  skills: {
    frontend: ["Next.js 14", "ReactJS", "Tailwind CSS", "Bootstrap", "Responsive Design", "UI/UX Optimization"],
    backend: ["Node.js", "Express.js", "TypeScript", "JavaScript (ES6+)", "Python", "FastAPI", "RESTful APIs", "System Design"],
    infrastructure: ["Apache Kafka", "Redis", "WebSockets (Socket.io)", "Docker", "Kubernetes", "Microservices", "Monorepo"],
    monitoring: ["Datadog", "Splunk", "AWS CloudWatch"],
    databases: ["PostgreSQL", "Couchbase (N1QL)", "MongoDB", "MySQL", "Prisma ORM"],
    devops_tools: ["AWS", "GitHub Actions", "Git / GitHub", "CI/CD Pipelines", "Docker Compose"]
  }
};

const SYSTEM_PROMPT = `
You are an AI assistant for Aditya's portfolio. 
Your goal is to answer questions from recruiters about Aditya's projects, experience, and skills.
Use the following data: ${JSON.stringify(PORTFOLIO_DATA)}

Guidelines:
- Be professional, concise, and enthusiastic.
- If a recruiter asks something not in the data, politely say you don't have that specific information but highlight a related skill.
- Keep responses under 3-4 sentences unless a detailed project breakdown is requested.
- Do not mention personal data like phone numbers or specific home addresses (they have been removed for privacy).
`;

// Initialize Gemini
// NOTE: gemini-1.5-flash is deprecated and returns 404. Use gemini-2.0-flash.
const GEMINI_MODEL = "gemini-2.0-flash";
let genAI = null;
let model = null;

async function initAI() {
  console.log("[AI Legacy] initAI() called.");
  try {
    // In a real production environment, you would use a backend to proxy this request.
    // For this portfolio, we check localStorage for a manually provided key.
    const apiKey = localStorage.getItem('GEMINI_API_KEY') || "";

    if (!apiKey) {
      console.warn("[AI Legacy] Gemini API Key not found in localStorage. Set it via: localStorage.setItem('GEMINI_API_KEY', 'your-key')");
      return;
    }

    console.log(`[AI Legacy] Initializing GoogleGenerativeAI with model: ${GEMINI_MODEL}`);
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    console.log("[AI Legacy] AI initialized successfully.");
  } catch (err) {
    console.error("[AI Legacy] Failed to initialize AI:", {
      message: err.message,
      stack: err.stack,
    });
  }
}

async function handleSearch() {
  const input = document.getElementById('ai-search-input');
  const responseBox = document.getElementById('ai-response-box');
  const responseText = document.getElementById('ai-response-text');
  const loader = responseBox?.querySelector('.ai-loader');

  if (!input || !responseBox || !responseText) {
    console.error("[AI Legacy] handleSearch(): Required DOM elements (#ai-search-input, #ai-response-box, #ai-response-text) not found.");
    return;
  }

  const query = input.value.trim();
  if (!query) {
    console.warn("[AI Legacy] handleSearch(): Empty query, aborting.");
    return;
  }

  console.log(`[AI Legacy] handleSearch(): Query = "${query.substring(0, 80)}${query.length > 80 ? '...' : ''}"`);

  // Check if AI is initialized
  if (!model) {
    console.log("[AI Legacy] Model not initialized, calling initAI()...");
    await initAI();
    if (!model) {
      console.error("[AI Legacy] AI could not be initialized. API key missing.");
      alert("Please provide a Gemini API Key to use this feature.\nRun in console: localStorage.setItem('GEMINI_API_KEY', 'your-key')");
      return;
    }
  }

  // UI States
  responseBox.classList.remove('hidden');
  if (loader) loader.classList.remove('hidden');
  responseText.innerHTML = "";

  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${query}`;
    console.log("[AI Legacy] Calling model.generateContent()...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`[AI Legacy] Success. Response length: ${text.length} chars.`);
    if (loader) loader.classList.add('hidden');
    responseText.innerText = text;
  } catch (error) {
    console.error("[AI Legacy] AI Search Error:", {
      message: error.message,
      status: error.status,
      stack: error.stack,
    });
    if (loader) loader.classList.add('hidden');
    responseText.innerText = `Error connecting to AI: ${error.message}`;
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log("[AI Legacy] DOMContentLoaded — setting up event listeners.");
  const searchBtn = document.getElementById('ai-search-btn');
  const searchInput = document.getElementById('ai-search-input');

  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
    console.log("[AI Legacy] Click listener attached to #ai-search-btn.");
  } else {
    console.warn("[AI Legacy] #ai-search-btn not found in DOM — skipping click listener.");
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
    console.log("[AI Legacy] Keypress listener attached to #ai-search-input.");
  } else {
    console.warn("[AI Legacy] #ai-search-input not found in DOM — skipping keypress listener.");
  }

  // Try to init on load
  initAI();
});
