import { NextResponse } from 'next/server';

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
        "Its a support + dev role, current job started in January 2025 and still ongoing, so I do a lot of debugging, troubleshooting, and production issue resolution, but I also get to contribute code-level fixes and optimizations to our backend services and internal tools.",
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
You are an engineering-focused recruiter assistant for Aditya's portfolio.
Aditya is currently in a support + development role with a support-leaning focus.
Use the portfolio data exactly as provided. Do not invent details, do not assume facts, and do not add information not present in the portfolio data.
If the portfolio data does not contain the requested information, respond with: "I don't have that specific information in the portfolio data."
Prefer concise, recruiter-friendly answers with technical depth, architecture, scalability, engineering impact, and reliability focus.
Default responses should stay within 50-80 words. If the question explicitly asks for deeper technical detail, answers may expand up to 180 words, but never exceed 250 words.
Avoid marketing fluff, hype, or generic exaggeration. Redirect unrelated questions politely to portfolio-relevant content.
Include full portfolio context when needed, but do not repeat the entire data set verbatim.
Portfolio data:
${JSON.stringify(PORTFOLIO_DATA)}
`;

function getWordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getMaxTokens(query) {
  const q = query.toLowerCase();
  if (
    q.includes('architecture') ||
    q.includes('explain') ||
    q.includes('detailed') ||
    q.includes('breakdown') ||
    q.includes('scalability')
  ) {
    return 300;
  }
  return 140;
}

function sanitizeResponse(text) {
  const cleaned = text.trim().replace(/\n{2,}/g, '\n');
  return cleaned.length > 2200 ? `${cleaned.slice(0, 2200).trim()}...` : cleaned;
}

export async function POST(req) {
  const requestId = `req_${Date.now()}`;
  const logPrefix = `[AI Route][${requestId}]`;

  try {
    const body = await req.json();
    const query = body?.query == null ? '' : String(body.query).trim();

    console.log(`${logPrefix} Received query: "${query?.substring(0, 80) || ''}${query?.length > 80 ? '...' : ''}"`);

    if (!query) {
      console.warn(`${logPrefix} Rejected: empty query.`);
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const wordCount = getWordCount(query);
    if (wordCount > 200) {
      console.warn(`${logPrefix} Rejected: query too long (${wordCount} words).`);
      return NextResponse.json(
        { error: 'Query is too long. Please keep questions under 200 words.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      console.error(`${logPrefix} FATAL: GROQ_API_KEY is not set in environment variables.`);
      return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
    }

    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    const maxTokens = getMaxTokens(query);

    console.log(`${logPrefix} Using model: ${GROQ_MODEL}, maxTokens: ${maxTokens}`);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: query }
        ],
        max_tokens: maxTokens,
        temperature: 0.2,
        top_p: 0.9,
        frequency_penalty: 0.2,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`${logPrefix} Groq API failure (${response.status}):`, errorBody);
      return NextResponse.json(
        { error: 'AI service error. Please try again later.' },
        { status: 502 }
      );
    }

    const result = await response.json();
    const rawText = result.choices?.[0]?.message?.content || result.choices?.[0]?.text || '';
    const text = sanitizeResponse(rawText);

    console.log(`${logPrefix} Success. Response length: ${text.length} chars.`);
    return NextResponse.json({ text });
  } catch (error) {
    console.error(`${logPrefix} AI API Error:`, {
      message: error?.message,
      stack: error?.stack
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error. Could not connect to AI.',
        details: error?.message || 'Unknown server error.'
      },
      { status: 500 }
    );
  }
}
