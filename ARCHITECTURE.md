# System Architecture & Design - AI Campaign Foundry

## Overview

This document provides detailed system architecture diagrams, design patterns, and system design decisions for the AI Campaign Foundry platform.

---

## 1. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend Application                 │  │
│  │  • Single Page Application (SPA)                             │  │
│  │  • Real-time WebSocket Client                                │  │
│  │  • Component-based UI Architecture                           │  │
│  │  • Responsive Design (Tailwind CSS)                          │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              WebSocket                 HTTP REST
                    │                         │
┌───────────────────┼─────────────────────────┼──────────────────────┐
│                   │                         │                       │
│    ┌──────────────┴──────────────┐         │                       │
│    │   FastAPI Application        │         │                       │
│    │   (Backend Server)           │         │                       │
│    │                              │         │                       │
│    │  ┌────────────────────────┐  │         │                       │
│    │  │   API Endpoints        │  │         │                       │
│    │  │  • WebSocket Handler   │◄─┼─────────┘                       │
│    │  │  • REST Endpoints      │  │                                 │
│    │  └───────────┬────────────┘  │                                 │
│    │              │                │                                 │
│    │  ┌───────────┴────────────┐  │                                 │
│    │  │  LangGraph Orchestrator│  │                                 │
│    │  │  • State Management    │  │                                 │
│    │  │  • Agent Coordination  │  │                                 │
│    │  │  • Workflow Execution  │  │                                 │
│    │  └───────────┬────────────┘  │                                 │
│    │              │                │                                 │
│    │  ┌───────────┴────────────┐  │                                 │
│    │  │    Agent Pipeline      │  │                                 │
│    │  │  (8 Specialized Agents)│  │                                 │
│    │  └───────────┬────────────┘  │                                 │
│    └──────────────┼───────────────┘                                 │
│                   │                                                  │
│         ┌─────────┼─────────┐                                       │
│         │         │         │                                       │
│    ┌────┴────┐ ┌──┴──┐ ┌───┴────┐                                  │
│    │  Groq   │ │Tavily│ │Unsplash│                                  │
│    │   LLM   │ │Search│ │   API  │                                  │
│    └─────────┘ └──────┘ └────────┘                                  │
│                                                                      │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐                             │
│    │  Slack  │ │Telegram │ │  Vercel │                             │
│    │ Webhook │ │   Bot   │ │   API   │                             │
│    └─────────┘ └─────────┘ └─────────┘                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Agent Workflow Architecture

### Sequential Agent Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   LangGraph State Machine                        │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │    START    │
                    └──────┬──────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │     1. PLANNER AGENT             │
        │  • Input: Raw user prompt        │
        │  • Process: LLM parsing          │
        │  • Output: Structured data       │
        │     - goal                       │
        │     - topic                      │
        │     - target_audience            │
        │     - campaign_date              │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │     2. RESEARCH AGENT            │
        │  • Input: topic, audience        │
        │  • Process:                      │
        │     - Tavily web search          │
        │     - LLM synthesis              │
        │  • Output:                       │
        │     - audience_persona           │
        │     - core_messaging             │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │     3. STRATEGY AGENT            │
        │  • Input: topic, goal            │
        │  • Process: LLM generation       │
        │  • Output:                       │
        │     - strategy_markdown          │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │     4. CONTENT AGENT             │
        │  • Input: goal, topic, persona,  │
        │           messaging              │
        │  • Process: LLM generation       │
        │  • Output:                       │
        │     - webinar_details            │
        │     - social_posts[]             │
        │     - webinar_image_prompt       │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │     5. DESIGN AGENT              │
        │  • Input: image_prompts, posts   │
        │  • Process:                      │
        │     - Unsplash API calls         │
        │     - Brand kit generation       │
        │  • Output:                       │
        │     - brand_kit                  │
        │     - generated_assets{}         │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │     6. WEB AGENT                 │
        │  • Input: topic, persona,        │
        │           messaging, assets      │
        │  • Process: LLM HTML generation  │
        │  • Output:                       │
        │     - landing_page_code (HTML)   │
        │     - landing_page_url           │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │     7. BRD AGENT                 │
        │  • Input: topic, goal, persona,  │
        │           messaging              │
        │  • Process:                      │
        │     - LLM markdown generation    │
        │     - PDF conversion (fpdf2)     │
        │  • Output:                       │
        │     - brd_url (PDF path)         │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │     8. OPS AGENT                 │
        │  • Input: social_posts, assets   │
        │  • Process:                      │
        │     - Slack webhook posting      │
        │     - Telegram bot posting       │
        │  • Output:                       │
        │     - automation_status{}        │
        └──────────────┬───────────────────┘
                       │
                       ▼
                    ┌──────┐
                    │ END  │
                    └──────┘
```

---

## 3. Data Flow Architecture

### Request Flow Diagram

```
USER INPUT
    │
    │ "Launch webinar about AI for developers"
    ▼
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  • PromptInput component                │
│  • WebSocket connection established     │
└──────────────┬──────────────────────────┘
               │
               │ WebSocket: {initial_prompt: "..."}
               ▼
┌─────────────────────────────────────────┐
│      Backend (FastAPI WebSocket)        │
│  • Accept connection                    │
│  • Receive prompt                       │
│  • Initialize CampaignState             │
└──────────────┬──────────────────────────┘
               │
               │ LangGraph.astream()
               ▼
┌─────────────────────────────────────────┐
│       LangGraph Workflow Engine         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Agent 1: Planner                 │ │
│  │  └─> Groq LLM                     │ │
│  └───────┬───────────────────────────┘ │
│          │                              │
│          │ Update State                 │
│          │                              │
│  ┌───────▼───────────────────────────┐ │
│  │  Agent 2: Research                │ │
│  │  └─> Tavily API                   │ │
│  │  └─> Groq LLM                     │ │
│  └───────┬───────────────────────────┘ │
│          │                              │
│          │ (Continue for all agents)    │
│          │                              │
└──────────┼──────────────────────────────┘
           │
           │ Stream state updates
           ▼
┌─────────────────────────────────────────┐
│    WebSocket Stream to Frontend         │
│  • {event: "step", node: "...", data}  │
└──────────────┬──────────────────────────┘
               │
               │ Real-time updates
               ▼
┌─────────────────────────────────────────┐
│      Frontend State Updates             │
│  • Update UI components                 │
│  • Display progress                     │
│  • Show generated content               │
└─────────────────────────────────────────┘
```

### State Propagation Flow

```
Initial State
    │
    │ {initial_prompt: "..."}
    ▼
┌──────────────────────┐
│  Planner Agent       │
│  Processes input     │
│  Returns:            │
│  {                   │
│    goal: "...",      │
│    topic: "...",     │
│    ...               │
│  }                   │
└──────┬───────────────┘
       │
       │ Merge into state
       ▼
┌──────────────────────┐
│  Updated State       │
│  {                   │
│    initial_prompt,   │
│    goal,             │
│    topic,            │
│    ...               │
│  }                   │
└──────┬───────────────┘
       │
       │ Pass to next agent
       ▼
┌──────────────────────┐
│  Research Agent      │
│  Reads: goal, topic  │
│  Returns:            │
│  {                   │
│    audience_persona, │
│    core_messaging    │
│  }                   │
└──────┬───────────────┘
       │
       │ Merge into state
       ▼
┌──────────────────────┐
│  State accumulates   │
│  with each agent     │
└──────────────────────┘
```

---

## 4. Component Architecture

### Frontend Component Hierarchy

```
App.jsx (Root)
│
├─── Router (React Router)
     │
     ├─── Home.jsx
     │    ├─── Header.jsx
     │    ├─── Hero.jsx
     │    ├─── Features.jsx
     │    ├─── HowItWorks.jsx
     │    └─── Footer.jsx
     │
     ├─── PromptPage.jsx
     │    ├─── AnimatedBackground.jsx
     │    └─── PromptInput.jsx
     │         └─── (WebSocket Connection)
     │
     ├─── Report.jsx
     │    ├─── BackButton.jsx
     │    ├─── CardGrid.jsx
     │    │    ├─── Card.jsx (Multiple)
     │    │    └─── ExpandedCard.jsx
     │    │         ├─── Card1Content.jsx
     │    │         ├─── Card2Content.jsx
     │    │         ├─── Card3Content.jsx
     │    │         └─── Card4Content.jsx
     │    └─── (WebSocket Stream Handler)
     │
     └─── WebEditor.jsx
          └─── Landing Page Preview
```

### Backend Module Structure

```
server.py (Main Entry Point)
│
├─── FastAPI App Setup
│    ├─── CORS Middleware
│    ├─── WebSocket Endpoint
│    └─── REST Endpoints
│
├─── Environment Configuration
│    └─── API Key Loading
│
├─── Data Models (Pydantic)
│    ├─── CampaignState
│    ├─── EmailStep
│    ├─── SocialPost
│    ├─── BrandKit
│    └─── Output Models
│
├─── Agent Chains (LangChain LCEL)
│    ├─── planner_chain
│    ├─── research_chain
│    ├─── strategy_chain
│    ├─── content_chain
│    ├─── web_agent_chain
│    ├─── brd_agent_chain
│    └─── (Design & Ops use direct API calls)
│
├─── Agent Node Functions
│    ├─── planner_agent_node()
│    ├─── research_agent_node()
│    ├─── strategy_agent_node()
│    ├─── content_agent_node()
│    ├─── design_agent_node()
│    ├─── web_agent_node()
│    ├─── brd_agent_node()
│    └─── ops_agent_node()
│
├─── Helper Functions
│    ├─── get_unsplash_image()
│    └─── save_markdown_as_pdf()
│
└─── LangGraph Workflow
     ├─── StateGraph Creation
     ├─── Node Registration
     ├─── Edge Definition
     └─── Graph Compilation
```

---

## 5. External API Integration Architecture

### API Integration Flow

```
┌──────────────────────────────────────────────────────────┐
│                  Backend Application                      │
└──────────────────────────────────────────────────────────┘
         │              │              │              │
         │              │              │              │
    ┌────┴───┐    ┌────┴───┐    ┌────┴───┐    ┌────┴───┐
    │        │    │        │    │        │    │        │
    ▼        ▼    ▼        ▼    ▼        ▼    ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Groq  │ │ Tavily │ │Unsplash│ │ Slack  │ │Telegram│ │ Vercel │
│   LLM  │ │ Search │ │   API  │ │Webhook │ │   Bot  │ │   API  │
│        │ │   API  │ │        │ │        │ │        │ │        │
│  • LLM │ │  • Web │ │  • Stock│ │ • Post │ │ • Post │ │ • Deploy│
│    API │ │    Search│ │  Images│ │  Messages│ │ Messages│ │  HTML  │
│        │ │        │ │        │ │        │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

### API Call Patterns

#### 1. Groq LLM Integration

```python
# Pattern: LangChain + Groq
llm = ChatGroq(model_name="llama-3.1-8b-instant", temperature=0)
chain = prompt | llm | parser
output = chain.invoke({"input": "..."})
```

**Used by:**
- Planner Agent
- Research Agent
- Strategy Agent
- Content Agent
- Web Agent
- BRD Agent

#### 2. Tavily Search Integration

```python
# Pattern: Direct API call via LangChain tool
tavily_tool = TavilySearch(max_results=3)
results = tavily_tool.invoke("search query")
```

**Used by:**
- Research Agent

#### 3. Unsplash Integration

```python
# Pattern: HTTP REST API
response = requests.get(
    "https://api.unsplash.com/search/photos",
    headers={"Authorization": f"Client-ID {key}"},
    params={"query": "...", "per_page": 1}
)
image_url = response.json()["results"][0]["urls"]["regular"]
```

**Used by:**
- Design Agent

#### 4. Slack Integration

```python
# Pattern: Webhook POST
requests.post(
    SLACK_WEBHOOK_URL,
    json={"blocks": [...]},
    timeout=10
)
```

**Used by:**
- Ops Agent

#### 5. Telegram Integration

```python
# Pattern: Bot API POST
requests.post(
    f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto",
    data={"chat_id": CHAT_ID, "caption": "...", "photo": "..."},
    timeout=10
)
```

**Used by:**
- Ops Agent

#### 6. Vercel Integration

```python
# Pattern: REST API POST
requests.post(
    "https://api.vercel.com/v13/deployments",
    headers={"Authorization": f"Bearer {TOKEN}"},
    json={"name": "...", "files": [...]},
    timeout=30
)
```

**Used by:**
- Deploy Endpoint (REST API)

---

## 6. State Management Architecture

### LangGraph State Model

```python
CampaignState (Pydantic BaseModel)
│
├─── Input Layer (Planner Agent)
│    ├─── initial_prompt: str
│    ├─── goal: Optional[str]
│    ├─── topic: Optional[str]
│    ├─── target_audience: Optional[str]
│    ├─── source_docs_url: Optional[str]
│    └─── campaign_date: Optional[datetime]
│
├─── Research Layer (Research Agent)
│    ├─── audience_persona: Optional[Dict[str, str]]
│    └─── core_messaging: Optional[Dict[str, str]]
│
├─── Strategy Layer (Strategy Agent)
│    └─── strategy_markdown: Optional[str]
│
├─── Content Layer (Content Agent)
│    ├─── webinar_details: Optional[Dict[str, str]]
│    ├─── webinar_image_prompt: Optional[str]
│    └─── social_posts: List[SocialPost]
│
├─── Design Layer (Design Agent)
│    ├─── brand_kit: Optional[BrandKit]
│    └─── generated_assets: Dict[str, str]
│
├─── Web Layer (Web Agent)
│    ├─── landing_page_code: Optional[str]
│    └─── landing_page_url: Optional[str]
│
├─── BRD Layer (BRD Agent)
│    └─── brd_url: Optional[str]
│
└─── Operations Layer (Ops Agent)
     └─── automation_status: Dict[str, Any]
```

### State Update Mechanism

```
Agent Execution
    │
    ├─> Agent receives full CampaignState
    │
    ├─> Agent extracts needed fields
    │
    ├─> Agent processes (LLM/API call)
    │
    ├─> Agent returns dict with updates
    │    e.g., {"goal": "...", "topic": "..."}
    │
    └─> LangGraph merges updates into state
         state = {**current_state, **agent_updates}
```

---

## 7. Communication Protocols

### WebSocket Protocol Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WebSocket Protocol                        │
└─────────────────────────────────────────────────────────────┘

CLIENT (Frontend)                    SERVER (Backend)
     │                                     │
     │  ── WebSocket Connect ────────────> │
     │                                     │
     │  <── Connection Accepted ────────── │
     │                                     │
     │  ── Send Prompt ──────────────────> │
     │     {                               │
     │       "initial_prompt": "..."       │
     │     }                               │
     │                                     │
     │  <── Step Update ────────────────── │
     │     {                               │
     │       "event": "step",              │
     │       "node": "planner_agent",      │
     │       "data": "{...state...}"       │
     │     }                               │
     │                                     │
     │  <── Step Update ────────────────── │
     │     {                               │
     │       "event": "step",              │
     │       "node": "research_agent",     │
     │       "data": "{...state...}"       │
     │     }                               │
     │                                     │
     │  ... (more steps)                   │
     │                                     │
     │  <── Done ───────────────────────── │
     │     {                               │
     │       "event": "done"               │
     │     }                               │
     │                                     │
     │  <── Connection Closed ──────────── │
     │                                     │
```

### Message Format Specifications

**Client → Server:**
```json
{
  "initial_prompt": "User's campaign description"
}
```

**Server → Client (Per Agent Step):**
```json
{
  "event": "step",
  "node": "agent_name",
  "data": "{...complete CampaignState JSON...}"
}
```

**Server → Client (Error):**
```json
{
  "event": "error",
  "data": "Error message"
}
```

**Server → Client (Completion):**
```json
{
  "event": "done"
}
```

---

## 8. Error Handling Architecture

### Error Handling Flow

```
Agent Execution
    │
    ├─> Try: Execute agent logic
    │   │
    │   ├─> Success ──> Return state updates
    │   │
    │   └─> Exception ──> Catch block
    │       │
    │       ├─> Log error
    │       │
    │       └─> Return {} (empty dict)
    │           │
    │           └─> State not updated
    │               │
    │               └─> Workflow continues
    │
└─> WebSocket Error
    │
    ├─> Try: Stream updates
    │   │
    │   └─> Exception ──> Catch block
    │       │
    │       ├─> Send error message to client
    │       │
    │       └─> Close connection
```

### Error Propagation

```
Agent Level Error
    │
    ├─> Caught in agent_node()
    ├─> Logged to console
    ├─> Returns {} (no state update)
    └─> Workflow continues to next agent
         │
         ▼
WebSocket Level Error
    │
    ├─> Caught in websocket_endpoint()
    ├─> Error message sent to client
    └─> Connection closed gracefully
```

---

## 9. Performance Architecture

### Current Performance Characteristics

```
┌──────────────────────────────────────────────────────────┐
│              Performance Bottlenecks                      │
└──────────────────────────────────────────────────────────┘

1. LLM API Calls (Groq)
   • Latency: ~2-5 seconds per call
   • Frequency: 6 agents use LLM
   • Total: ~12-30 seconds for LLM calls
   
2. External API Calls
   • Tavily Search: ~1-2 seconds
   • Unsplash (per image): ~0.5-1 second
   • Slack/Telegram: ~0.5 seconds
   
3. PDF Generation
   • fpdf2 (synchronous): ~1-2 seconds
   
Total Estimated Time: ~20-40 seconds per campaign
```

### Optimization Opportunities

```
Potential Parallelization:

1. Image Fetching
   Current: Sequential Unsplash calls
   Optimized: Parallel requests for multiple images
   
2. Social Media Posting
   Current: Sequential Slack then Telegram
   Optimized: Parallel posting to both platforms
   
3. Independent Agents (Future)
   Current: Fully sequential
   Optimized: Parallel execution of independent agents
```

---

## 10. Security Architecture

### Security Layers

```
┌──────────────────────────────────────────────────────────┐
│                   Security Architecture                   │
└──────────────────────────────────────────────────────────┘

Layer 1: Environment Variables
  • API keys stored in .env file
  • Never exposed to frontend
  • Not committed to version control

Layer 2: Input Validation
  • Pydantic models validate all inputs
  • Type checking and schema validation
  • Prevents injection attacks

Layer 3: CORS Protection
  • Limited to specific origins
  • Prevents unauthorized access

Layer 4: No Database
  • Stateless architecture
  • No SQL injection risks
  • No data persistence vulnerabilities

Layer 5: API Key Protection
  • Keys only in backend
  • No client-side exposure
```

---

## Conclusion

This architecture document provides a comprehensive view of the AI Campaign Foundry system design. The architecture is modular, scalable, and follows best practices for multi-agent systems, API integration, and real-time communication.

