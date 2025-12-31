# AI Campaign Foundry 🚀

**Domain**: Marketing Automation & AI-Powered Campaign Generation

An intelligent, multi-agent marketing automation platform that transforms a simple text prompt into a complete marketing campaign - from research and strategy to content creation, design assets, landing pages, and automated social media distribution.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [System Flow](#system-flow)
- [Technical Documentation](#technical-documentation)
- [Planned Improvements for Round 2](#planned-improvements-for-round-2)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

AI Campaign Foundry is a full-stack marketing automation platform that leverages Large Language Models (LLMs) and multi-agent orchestration to automate the entire marketing campaign lifecycle. Simply describe your campaign goal in natural language, and the system generates:

- **Strategic Planning**: Audience personas, core messaging, and campaign strategy
- **Content Assets**: Webinar details, social media posts, blog content
- **Design Assets**: Stock images, brand kits, visual identity
- **Landing Pages**: Fully functional HTML landing pages
- **Business Documents**: Professional BRDs (Business Requirements Documents)
- **Automated Distribution**: Social media posts to Slack and Telegram

### Problem Statement

Traditional marketing campaign creation is time-consuming, requires multiple tools, and involves coordination between various teams (strategy, content, design, development). This platform automates the entire pipeline, reducing campaign creation time from days/weeks to minutes.

---

## ✨ Features

### Core Capabilities

1. **Intelligent Campaign Planning**
   - Natural language prompt processing
   - Automatic goal extraction and topic identification
   - Target audience analysis

2. **Research & Strategy**
   - Web-based research using Tavily Search API
   - Audience persona generation
   - Core messaging development
   - Strategic planning document generation

3. **Content Generation**
   - Webinar titles and abstracts
   - Social media posts (LinkedIn, Twitter/X, Instagram)
   - Blog post outlines
   - Email sequences

4. **Design Automation**
   - Stock image search via Unsplash API
   - Brand kit generation (colors, fonts, logo concepts)
   - Automated image selection for campaigns

5. **Web Development**
   - HTML landing page generation
   - Responsive design
   - Integration with generated assets
   - One-click deployment to Vercel

6. **Document Generation**
   - Business Requirements Documents (BRD) in PDF format
   - Strategic planning documents

7. **Social Media Automation**
   - Automated posting to Slack channels
   - Automated posting to Telegram channels
   - Post scheduling capabilities

### Technical Features

- **Real-time Streaming**: WebSocket-based real-time progress updates
- **Multi-Agent Orchestration**: LangGraph-powered agent workflow
- **API Integrations**: Groq LLM, Tavily Search, Unsplash, Vercel, Slack, Telegram
- **Modern UI/UX**: React + Tailwind CSS with dark mode support
- **Fast API Backend**: Async Python backend with WebSocket support

---

## 🛠 Tech Stack

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.8+
- **AI/ML**:
  - LangChain & LangGraph (Agent Orchestration)
  - Groq LLM (llama-3.1-8b-instant)
  - Tavily Search API (Web Research)
- **APIs & Services**:
  - Unsplash API (Stock Images)
  - Vercel API (Web Deployment)
  - Slack Webhooks
  - Telegram Bot API
- **Additional Libraries**:
  - Pydantic (Data Validation)
  - fpdf2 (PDF Generation)
  - WebSockets (Real-time Communication)
  - BeautifulSoup4 (Web Scraping)

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM v7
- **UI Components**:
  - Framer Motion (Animations)
  - GSAP (Advanced Animations)
  - Lucide React (Icons)
  - Radix UI (Accessible Components)
- **State Management**: React Hooks

### Infrastructure

- **Development Server**: Uvicorn
- **Package Management**: pip (Python), npm (Node.js)
- **Environment Management**: python-dotenv

---

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React Frontend (React Router, Tailwind CSS)          │  │
│  │  - Prompt Input                                        │  │
│  │  - Real-time Progress Display                          │  │
│  │  - Campaign Results Visualization                      │  │
│  │  - Landing Page Editor                                 │  │
│  └──────────────────┬────────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────┘
                      │ WebSocket / HTTP
                      │
┌─────────────────────┼───────────────────────────────────────┐
│                    BACKEND SERVER                            │
│  ┌──────────────────┴────────────────────────────────────┐  │
│  │  FastAPI Application (server.py)                       │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  LangGraph Multi-Agent System                     │ │  │
│  │  │                                                    │ │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │ │  │
│  │  │  │ Planner  │→ │ Research │→ │ Strategy │       │ │  │
│  │  │  │  Agent   │  │  Agent   │  │  Agent   │       │ │  │
│  │  │  └──────────┘  └──────────┘  └────┬─────┘       │ │  │
│  │  │                                     │             │ │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌────┴─────┐       │ │  │
│  │  │  │ Content  │→ │ Design   │→ │   Web    │       │ │  │
│  │  │  │  Agent   │  │  Agent   │  │  Agent   │       │ │  │
│  │  │  └──────────┘  └──────────┘  └────┬─────┘       │ │  │
│  │  │                                     │             │ │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌────┴─────┐       │ │  │
│  │  │  │   BRD    │→ │   Ops    │→ │   END    │       │ │  │
│  │  │  │  Agent   │  │  Agent   │  │          │       │ │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘       │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  WebSocket Endpoint: /ws_stream_campaign              │  │
│  │  REST Endpoints: /deploy_to_vercel, /download_brd    │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
   │  Groq   │          │ Tavily  │          │Unsplash │
   │   LLM   │          │  Search │          │   API   │
   └─────────┘          └─────────┘          └─────────┘
        │
   ┌────┴────┐          ┌─────────┐          ┌─────────┐
   │  Slack  │          │Telegram │          │ Vercel  │
   │Webhook  │          │   Bot   │          │   API   │
   └─────────┘          └─────────┘          └─────────┘
```

### Agent Workflow (LangGraph State Machine)

```
START
  │
  ▼
┌─────────────────┐
│ Planner Agent   │  • Parses user prompt
│                 │  • Extracts: goal, topic, audience, date
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Research Agent  │  • Web research via Tavily
│                 │  • Generates audience persona
│                 │  • Creates core messaging
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Strategy Agent  │  • High-level strategic plan
│                 │  • Phase breakdown
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Content Agent   │  • Webinar details
│                 │  • Social media posts
│                 │  • Image prompts
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Design Agent    │  • Unsplash image search
│                 │  • Brand kit generation
│                 │  • Asset URLs
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Web Agent       │  • HTML landing page
│                 │  • Responsive design
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ BRD Agent       │  • Business Requirements Doc
│                 │  • PDF generation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Ops Agent       │  • Slack posting
│                 │  • Telegram posting
└────────┬────────┘
         │
         ▼
        END
```

### Data Flow Diagram (DFD)

```
┌──────────────────────────────────────────────────────────────┐
│                    LEVEL 0 - CONTEXT DIAGRAM                  │
└──────────────────────────────────────────────────────────────┘

    [User]                    [AI Campaign Foundry]
       │                                │
       │ 1. Campaign Prompt             │
       ├───────────────────────────────>│
       │                                │
       │                                │ 2. Research Request
       │                                ├──────────────────> [Tavily API]
       │                                │<────────────────── 3. Research Data
       │                                │
       │                                │ 4. Image Request
       │                                ├──────────────────> [Unsplash API]
       │                                │<────────────────── 5. Images
       │                                │
       │                                │ 6. LLM Request
       │                                ├──────────────────> [Groq LLM]
       │                                │<────────────────── 7. Generated Content
       │                                │
       │                                │ 8. Deploy Request
       │                                ├──────────────────> [Vercel API]
       │                                │<────────────────── 9. Deployment URL
       │                                │
       │                                │ 10. Post Content
       │                                ├──────────────────> [Slack/Telegram]
       │                                │<────────────────── 11. Post Confirmation
       │                                │
       │ 12. Campaign Results           │
       │<───────────────────────────────┤
       │                                │


┌──────────────────────────────────────────────────────────────┐
│                    LEVEL 1 - SYSTEM DFD                       │
└──────────────────────────────────────────────────────────────┘

    [User Prompt]
          │
          ▼
    ┌─────────────┐
    │  Frontend   │◄────────┐
    │   (React)   │         │ WebSocket Stream
    └──────┬──────┘         │
           │                │
           │ HTTP/WS        │
           ▼                │
    ┌─────────────┐         │
    │   FastAPI   │─────────┘
    │   Server    │
    └──────┬──────┘
           │
           ├─────────────────┐
           │                 │
           ▼                 ▼
    ┌─────────────┐   ┌─────────────┐
    │  LangGraph  │   │   External  │
    │   Workflow  │   │    APIs     │
    └──────┬──────┘   └─────────────┘
           │
           ├───> Planner Agent
           ├───> Research Agent ──> Tavily API
           ├───> Strategy Agent
           ├───> Content Agent ──> Groq LLM
           ├───> Design Agent ──> Unsplash API
           ├───> Web Agent ──> Groq LLM
           ├───> BRD Agent ──> Groq LLM + fpdf2
           └───> Ops Agent ──> Slack/Telegram
```

---

## 🚀 Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm
- API Keys (see below)

### API Keys Required

Create a `.env` file in the root directory with the following keys:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Optional (for social media automation)
SLACK_WEBHOOK_URL=your_slack_webhook_url
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Optional (for deployment)
VERCEL_TOKEN=your_vercel_token
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hack_the_winter
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Frontend dependencies**
   ```bash
   cd ui
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env  # Create .env file if it doesn't exist
   # Edit .env and add your API keys
   ```

5. **Run the application**

   **Option A: Using the provided script**
   ```bash
   chmod +x run.sh
   ./run.sh
   ```

   **Option B: Manual start**
   ```bash
   # Terminal 1: Start backend
   python server.py
   
   # Terminal 2: Start frontend
   cd ui
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

---

## 📖 Usage

### Basic Workflow

1. **Launch the Application**
   - Open http://localhost:5173 in your browser

2. **Enter Campaign Prompt**
   - Navigate to the prompt page
   - Enter a natural language description of your campaign
   - Example: *"Launch a webinar about AI-powered code debugging for VPs of Engineering on March 15th"*

3. **Monitor Real-time Progress**
   - The system streams progress updates via WebSocket
   - Each agent's completion is displayed in real-time

4. **Review Campaign Results**
   - View generated content (webinar details, social posts)
   - Preview the landing page
   - Download the BRD (PDF)
   - Review strategy document

5. **Deploy & Distribute**
   - Deploy landing page to Vercel (optional)
   - Social media posts are automatically sent to Slack/Telegram (if configured)

### Example Prompts

- *"Create a campaign to promote our new AI coding assistant tool targeting software developers"*
- *"Launch a product launch event for our SaaS platform targeting enterprise CTOs"*
- *"Promote a free trial of our data analytics platform to marketing directors"*

---

## 🔄 System Flow

### Detailed Agent Execution Flow

1. **Planner Agent**
   - Input: Raw user prompt (natural language)
   - Process: LLM-based parsing with structured output
   - Output: `{goal, topic, target_audience, source_docs_url, campaign_date}`
   - Technology: LangChain + Groq LLM + Pydantic

2. **Research Agent**
   - Input: Topic, target audience
   - Process:
     - Tavily API search for audience pain points
     - Web scraping (optional, if source_docs_url provided)
     - LLM synthesis of research data
   - Output: `{audience_persona, core_messaging}`
   - Technology: Tavily Search API + LangChain

3. **Strategy Agent**
   - Input: Topic, goal
   - Process: LLM generates strategic plan markdown
   - Output: Strategy markdown document
   - Technology: Groq LLM

4. **Content Agent**
   - Input: Goal, topic, audience persona, core messaging
   - Process: LLM generates campaign content
   - Output: `{webinar_details, social_posts[], webinar_image_prompt}`
   - Technology: Groq LLM + Pydantic

5. **Design Agent**
   - Input: Image prompts from content agent
   - Process:
     - Unsplash API searches for stock images
     - Brand kit generation (colors, fonts)
   - Output: `{brand_kit, generated_assets{urls}}`
   - Technology: Unsplash API + Python requests

6. **Web Agent**
   - Input: Topic, persona, messaging, generated assets
   - Process: LLM generates HTML landing page
   - Output: Complete HTML code
   - Technology: Groq LLM

7. **BRD Agent**
   - Input: Topic, goal, persona, messaging
   - Process:
     - LLM generates BRD markdown
     - fpdf2 converts markdown to PDF
   - Output: PDF file path
   - Technology: Groq LLM + fpdf2

8. **Ops Agent**
   - Input: Social posts, generated assets
   - Process:
     - Format posts with images
     - Send to Slack (webhook)
     - Send to Telegram (bot API)
   - Output: Automation status
   - Technology: Slack Webhooks + Telegram Bot API

---

## 📚 Technical Documentation

### State Management

The system uses a `CampaignState` Pydantic model that flows through all agents:

```python
class CampaignState(BaseModel):
    initial_prompt: str
    goal: Optional[str]
    topic: Optional[str]
    target_audience: Optional[str]
    source_docs_url: Optional[str]
    campaign_date: Optional[datetime]
    audience_persona: Optional[Dict[str, str]]
    core_messaging: Optional[Dict[str, str]]
    webinar_details: Optional[Dict[str, str]]
    webinar_image_prompt: Optional[str]
    social_posts: List[SocialPost]
    brand_kit: Optional[BrandKit]
    generated_assets: Dict[str, str]
    landing_page_code: Optional[str]
    landing_page_url: Optional[str]
    brd_url: Optional[str]
    strategy_markdown: Optional[str]
    automation_status: Dict[str, Any]
```

### WebSocket Protocol

The frontend connects via WebSocket to `/ws_stream_campaign`:

**Client → Server:**
```json
{
  "initial_prompt": "User's campaign description"
}
```

**Server → Client (per agent step):**
```json
{
  "event": "step",
  "node": "planner_agent",
  "data": "{...CampaignState JSON...}"
}
```

**Server → Client (completion):**
```json
{
  "event": "done"
}
```

### API Endpoints

- `GET /` - Health check
- `WebSocket /ws_stream_campaign` - Campaign generation stream
- `GET /download_brd/{filename}` - Download BRD PDF
- `POST /deploy_to_vercel` - Deploy HTML to Vercel

---

## 🔮 Planned Improvements for Round 2

### 1. Enhanced Agent Capabilities

#### 1.1 Advanced Research Agent
- **Multi-source aggregation**: Integrate additional research sources (Google Scholar, Reddit, industry reports)
- **Sentiment analysis**: Analyze competitor campaigns and market sentiment
- **Trend analysis**: Identify trending topics and keywords in the target domain
- **Citation tracking**: Properly cite sources in generated content

#### 1.2 Intelligent Content Agent
- **A/B testing variants**: Generate multiple versions of content for testing
- **SEO optimization**: Automatic keyword research and SEO-optimized content
- **Multi-language support**: Generate content in multiple languages
- **Content personalization**: Create personalized variants based on audience segments
- **Tone/style customization**: Allow users to specify brand voice and tone

#### 1.3 Advanced Design Agent
- **AI image generation**: Integrate DALL-E or Midjourney for custom images instead of stock photos
- **Brand consistency checker**: Ensure generated assets match brand guidelines
- **Video asset generation**: Create video thumbnails and promotional video scripts
- **Logo generation**: AI-powered logo creation with multiple variants
- **Design system generation**: Create complete design systems (colors, typography, spacing)

#### 1.4 Enhanced Web Agent
- **Framework support**: Generate React/Next.js/Vue landing pages instead of plain HTML
- **Interactive components**: Add forms, chatbots, interactive elements
- **Analytics integration**: Automatic Google Analytics/Mixpanel setup
- **A/B testing setup**: Built-in split testing configuration
- **CMS integration**: Generate content for WordPress/Contentful

### 2. User Experience Enhancements

#### 2.1 Campaign Management Dashboard
- **Campaign history**: View all past campaigns
- **Campaign analytics**: Track performance metrics
- **Edit/regenerate**: Ability to modify and regenerate specific parts of campaigns
- **Version control**: Track changes and rollback to previous versions
- **Templates**: Save and reuse successful campaign templates

#### 2.2 Real-time Collaboration
- **Team workspaces**: Multi-user collaboration
- **Comments & annotations**: Add feedback on generated content
- **Approval workflows**: Set up approval chains before publishing
- **Role-based access**: Different permissions for team members

#### 2.3 Advanced UI Features
- **Drag-and-drop editor**: Visual landing page builder
- **Live preview**: Real-time preview of changes
- **Mobile preview**: Preview campaigns on different device sizes
- **Accessibility checker**: Automatic accessibility audit

### 3. Integration & Automation

#### 3.1 CRM Integration
- **Salesforce integration**: Sync campaigns and leads
- **HubSpot integration**: Connect with marketing automation
- **Pipedrive/Monday.com**: Sync campaign data

#### 3.2 Social Media Platforms
- **Facebook/Instagram**: Direct posting to Meta platforms
- **Twitter/X API**: Enhanced Twitter integration
- **LinkedIn API**: Professional network posting
- **TikTok/YouTube**: Video platform integration
- **Scheduling**: Buffer/Hootsuite-style post scheduling

#### 3.3 Email Marketing
- **Email service providers**: Integration with Mailchimp, SendGrid, ConvertKit
- **Email template generation**: Generate email campaigns with HTML templates
- **Drip campaign automation**: Automated email sequences
- **Email analytics**: Open rates, click-through rates

#### 3.4 Analytics & Reporting
- **Campaign performance dashboard**: Real-time metrics
- **ROI tracking**: Calculate return on investment
- **Custom reports**: Generate PDF/Excel reports
- **Data export**: Export campaign data for external analysis

### 4. AI/ML Improvements

#### 4.1 Model Optimization
- **Fine-tuned models**: Domain-specific fine-tuning on marketing data
- **Model selection**: Choose between different LLMs (GPT-4, Claude, etc.)
- **Caching**: Cache common patterns to reduce API costs
- **Batch processing**: Process multiple campaigns simultaneously

#### 4.2 Quality Assurance
- **Content quality scoring**: Automated quality checks
- **Plagiarism detection**: Ensure original content
- **Fact-checking**: Verify claims in generated content
- **Grammar/style checking**: Enhanced proofreading

#### 4.3 Personalization
- **User behavior learning**: Learn from user edits and preferences
- **Predictive analytics**: Predict campaign success before launch
- **Recommendation engine**: Suggest improvements based on best practices

### 5. Enterprise Features

#### 5.1 Security & Compliance
- **SSO integration**: Single sign-on for enterprise customers
- **GDPR compliance**: Data privacy and compliance tools
- **Audit logs**: Complete activity logging
- **Data encryption**: End-to-end encryption for sensitive data

#### 5.2 Scalability
- **Multi-tenant architecture**: Support for multiple organizations
- **API rate limiting**: Proper rate limiting and quota management
- **Database optimization**: Efficient data storage and retrieval
- **CDN integration**: Fast asset delivery worldwide

#### 5.3 White-labeling
- **Custom branding**: Allow clients to brand the platform
- **Custom domains**: Deploy under client domains
- **API access**: Public API for integrations

### 6. Advanced Features

#### 6.1 Voice & Video
- **Voice generation**: AI-generated voiceovers for videos
- **Video script generation**: Complete video production workflows
- **Podcast generation**: Create podcast scripts and content

#### 6.2 Market Intelligence
- **Competitor analysis**: Automated competitor campaign monitoring
- **Market research reports**: Generate comprehensive market analysis
- **Trend forecasting**: Predict future marketing trends

#### 6.3 Workflow Automation
- **Zapier/Make.com integration**: Connect with 1000+ tools
- **Custom webhooks**: Trigger external systems
- **Scheduled campaigns**: Auto-generate campaigns on schedule
- **Event-triggered campaigns**: Generate campaigns based on events

### Priority Implementation Roadmap

**Phase 1 (High Priority - Weeks 1-4):**
1. Campaign management dashboard
2. Edit/regenerate capabilities
3. Enhanced social media integrations (Facebook, LinkedIn)
4. Email marketing integration
5. Analytics dashboard

**Phase 2 (Medium Priority - Weeks 5-8):**
1. AI image generation (DALL-E integration)
2. Framework-based landing pages (React/Next.js)
3. CRM integrations (Salesforce, HubSpot)
4. Multi-language support
5. Content quality scoring

**Phase 3 (Future - Weeks 9+):**
1. Enterprise features (SSO, white-labeling)
2. Advanced analytics and reporting
3. Voice/video generation
4. Market intelligence features
5. Custom fine-tuning capabilities

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript/React code
- Write tests for new features
- Update documentation for API changes
- Follow semantic versioning for releases

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **LangChain/LangGraph**: For the amazing agent orchestration framework
- **Groq**: For fast and accessible LLM inference
- **Unsplash**: For beautiful stock images
- **Tavily**: For efficient web research capabilities

---

## 📞 Contact & Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ for Hack the Winter 2024**

