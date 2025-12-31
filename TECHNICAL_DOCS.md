# Technical Documentation - AI Campaign Foundry

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Agent Architecture](#agent-architecture)
3. [Data Models & Schemas](#data-models--schemas)
4. [API Specifications](#api-specifications)
5. [State Management](#state-management)
6. [Communication Protocols](#communication-protocols)
7. [Error Handling](#error-handling)
8. [Performance Considerations](#performance-considerations)
9. [Security](#security)
10. [Deployment Architecture](#deployment-architecture)

---

## System Architecture

### 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Frontend (Port 5173)                          │   │
│  │  • React 18 + Vite                                   │   │
│  │  • React Router (Client-side routing)                │   │
│  │  • Tailwind CSS (Styling)                            │   │
│  │  • WebSocket Client (Real-time updates)              │   │
│  │  • Component-based architecture                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/WebSocket
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FastAPI Backend (Port 8000)                         │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  API Endpoints                                  │  │   │
│  │  │  • /ws_stream_campaign (WebSocket)             │  │   │
│  │  │  • /deploy_to_vercel (REST)                    │  │   │
│  │  │  • /download_brd/{filename} (REST)             │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  LangGraph Orchestration Engine                │  │   │
│  │  │  • StateGraph (Sequential workflow)            │  │   │
│  │  │  • Agent nodes (8 specialized agents)          │  │   │
│  │  │  • State management (Pydantic models)          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                    API Calls
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                    DATA & SERVICE LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Groq    │  │  Tavily  │  │ Unsplash │  │  Vercel  │   │
│  │   LLM    │  │  Search  │  │    API   │  │    API   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                │
│  │  Slack   │  │Telegram  │                                │
│  │ Webhook  │  │    Bot   │                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  App.jsx                                                     │
│    ├─── Router                                               │
│         ├─── Home.jsx                                        │
│         ├─── PromptPage.jsx                                  │
│         │     └─── PromptInput.jsx                           │
│         │     └─── WebSocket Connection                      │
│         │                                                     │
│         ├─── Report.jsx                                      │
│         │     ├─── WebSocket Stream Handler                  │
│         │     ├─── CardGrid.jsx                              │
│         │     │     ├─── Card.jsx                            │
│         │     │     └─── ExpandedCard.jsx                    │
│         │     │           ├─── Card1Content.jsx              │
│         │     │           ├─── Card2Content.jsx              │
│         │     │           └─── Card4Content.jsx              │
│         │     └─── Real-time Progress Display                │
│         │                                                     │
│         └─── WebEditor.jsx                                   │
│               └─── Landing Page Preview                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Backend Components                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  server.py (FastAPI Application)                            │
│    ├─── FastAPI App Instance                                │
│    ├─── CORS Middleware                                     │
│    │                                                         │
│    ├─── WebSocket Endpoint                                  │
│    │     └─── /ws_stream_campaign                           │
│    │           └─── LangGraph Stream Handler                │
│    │                                                         │
│    ├─── REST Endpoints                                      │
│    │     ├─── /deploy_to_vercel                            │
│    │     └─── /download_brd/{filename}                     │
│    │                                                         │
│    └─── LangGraph Workflow                                  │
│          ├─── StateGraph                                    │
│          │     └─── CampaignState (Pydantic)                │
│          │                                                   │
│          └─── Agent Nodes                                    │
│                ├─── planner_agent_node()                    │
│                ├─── research_agent_node()                   │
│                ├─── strategy_agent_node()                   │
│                ├─── content_agent_node()                    │
│                ├─── design_agent_node()                     │
│                ├─── web_agent_node()                        │
│                ├─── brd_agent_node()                        │
│                └─── ops_agent_node()                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Agent Architecture

### Agent Node Structure

Each agent follows a consistent pattern:

```python
def agent_node(state: CampaignState) -> dict:
    """
    Standard agent node structure:
    1. Log entry point
    2. Extract inputs from state
    3. Invoke LLM/external API
    4. Parse/process output
    5. Return state updates
    """
    print(f"--- N. 🔧 Calling {Agent} Agent ---")
    
    # 1. Extract inputs
    inputs = {
        "key": state.value,
        ...
    }
    
    # 2. Invoke chain
    try:
        output = agent_chain.invoke(inputs)
        
        # 3. Process output
        processed = process_output(output)
        
        # 4. Return state delta
        return processed.model_dump()
        
    except Exception as e:
        print(f"--- ❌ ERROR: {e} ---")
        return {}
```

### Agent Chain Architecture (LangChain LCEL)

Each agent uses LangChain's LCEL (LangChain Expression Language):

```python
# Pattern:
# Prompt → LLM → Parser → Output

prompt = ChatPromptTemplate.from_messages([...])
chain = prompt | llm | parser

# Invocation:
output = chain.invoke({"input": "..."})
```

### Agent Dependencies Graph

```
                    START
                      │
                      ▼
            ┌─────────────────┐
            │  Planner Agent  │
            │  (No deps)      │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Research Agent  │
            │ Depends on:     │
            │ - topic         │
            │ - target_audience│
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Strategy Agent  │
            │ Depends on:     │
            │ - topic         │
            │ - goal          │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Content Agent   │
            │ Depends on:     │
            │ - goal          │
            │ - topic         │
            │ - persona       │
            │ - messaging     │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Design Agent    │
            │ Depends on:     │
            │ - image_prompts │
            │ - social_posts  │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Web Agent       │
            │ Depends on:     │
            │ - topic         │
            │ - persona       │
            │ - messaging     │
            │ - assets        │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ BRD Agent       │
            │ Depends on:     │
            │ - topic         │
            │ - goal          │
            │ - persona       │
            │ - messaging     │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Ops Agent       │
            │ Depends on:     │
            │ - social_posts  │
            │ - assets        │
            └────────┬────────┘
                     │
                     ▼
                    END
```

---

## Data Models & Schemas

### CampaignState Schema

```python
class CampaignState(BaseModel):
    """
    Main state object flowing through the LangGraph workflow.
    Each agent updates specific fields.
    """
    
    # Layer 1: User Input (Planner Agent)
    initial_prompt: str
    goal: Optional[str]
    topic: Optional[str]
    target_audience: Optional[str]
    source_docs_url: Optional[str]
    campaign_date: Optional[datetime]
    
    # Layer 2: Research (Research Agent)
    audience_persona: Optional[Dict[str, str]]
    # {
    #   "pain_point": "...",
    #   "motivation": "...",
    #   "preferred_channel": "..."
    # }
    
    core_messaging: Optional[Dict[str, str]]
    # {
    #   "value_proposition": "...",
    #   "tone_of_voice": "...",
    #   "call_to_action": "..."
    # }
    
    # Layer 3: Strategy (Strategy Agent)
    strategy_markdown: Optional[str]
    
    # Layer 4: Content (Content Agent)
    webinar_details: Optional[Dict[str, str]]
    # {
    #   "title": "...",
    #   "abstract": "..."
    # }
    webinar_image_prompt: Optional[str]
    social_posts: List[SocialPost]
    # List of SocialPost objects
    
    # Layer 5: Design (Design Agent)
    brand_kit: Optional[BrandKit]
    generated_assets: Dict[str, str]
    # {
    #   "webinar_banner_url": "...",
    #   "post_1_image_url": "...",
    #   "post_2_image_url": "..."
    # }
    
    # Layer 6: Web (Web Agent)
    landing_page_code: Optional[str]  # HTML string
    landing_page_url: Optional[str]
    
    # Layer 7: BRD (BRD Agent)
    brd_url: Optional[str]  # Path to PDF file
    
    # Layer 8: Operations (Ops Agent)
    automation_status: Dict[str, Any]
    # {
    #   "slack_results": [...],
    #   "telegram_results": [...],
    #   "status": "completed"
    # }
```

### Supporting Models

```python
class EmailStep(BaseModel):
    subject: str
    body_markdown: str
    send_delay_days: int

class SocialPost(BaseModel):
    platform: str  # "LinkedIn", "X (Twitter)", "Instagram"
    content: str
    image_prompt: str

class BrandKit(BaseModel):
    logo_prompt: str
    color_palette: List[str]  # Hex codes
    font_pair: str

class PlannerOutput(BaseModel):
    goal: str
    topic: str
    target_audience: str
    source_docs_url: Optional[str]
    campaign_date: Optional[datetime]

class ResearchOutput(BaseModel):
    audience_persona: Dict[str, str]
    core_messaging: Dict[str, str]

class ContentAgentOutput(BaseModel):
    webinar_details: WebinarDetails
    social_posts: List[SocialPost]
    webinar_image_prompt: str
```

---

## API Specifications

### WebSocket API

**Endpoint**: `ws://localhost:8000/ws_stream_campaign`

#### Connection Flow

```
Client                    Server
  │                         │
  │─── WebSocket Connect ──>│
  │<── Connection Accepted ──│
  │                         │
  │─── Send Prompt ────────>│
  │   {                     │
  │     "initial_prompt":   │
  │     "..."               │
  │   }                     │
  │                         │
  │<── Step Update ─────────│
  │   {                     │
  │     "event": "step",    │
  │     "node": "planner",  │
  │     "data": "{...}"     │
  │   }                     │
  │                         │
  │<── Step Update ─────────│
  │   {                     │
  │     "event": "step",    │
  │     "node": "research", │
  │     "data": "{...}"     │
  │   }                     │
  │                         │
  │     ... (more steps)    │
  │                         │
  │<── Done ────────────────│
  │   {                     │
  │     "event": "done"     │
  │   }                     │
  │                         │
  │<── Connection Closed ───│
```

#### Message Format

**Client → Server:**
```json
{
  "initial_prompt": "Launch a webinar about AI for developers"
}
```

**Server → Client (Step Update):**
```json
{
  "event": "step",
  "node": "planner_agent",
  "data": "{...complete CampaignState JSON...}"
}
```

**Server → Client (Error):**
```json
{
  "event": "error",
  "data": "Error message string"
}
```

**Server → Client (Completion):**
```json
{
  "event": "done"
}
```

### REST API Endpoints

#### 1. Health Check

```http
GET /
```

**Response:**
```json
{
  "message": "AI Campaign Foundry Server is running. Connect via WebSocket."
}
```

#### 2. Deploy to Vercel

```http
POST /deploy_to_vercel
Content-Type: application/json
```

**Request Body:**
```json
{
  "html_content": "<html>...</html>",
  "project_name": "my-campaign"
}
```

**Response (Success):**
```json
{
  "success": true,
  "url": "https://my-campaign.vercel.app",
  "id": "deployment-id",
  "name": "my-campaign"
}
```

**Response (Error):**
```json
{
  "error": "Error message",
  "status_code": 400
}
```

#### 3. Download BRD

```http
GET /download_brd/{filename}
```

**Response:**
- Content-Type: `application/pdf`
- File download

**Example:**
```
GET /download_brd/my_campaign_brd.pdf
```

---

## State Management

### LangGraph State Flow

LangGraph uses a state-based architecture where:

1. **Initial State**: Created from user input
   ```python
   initial_input = {"initial_prompt": "..."}
   ```

2. **State Updates**: Each agent returns a dictionary that gets merged into the state
   ```python
   # Agent returns:
   return {"goal": "...", "topic": "..."}
   
   # LangGraph automatically merges:
   state = {**state, **agent_output}
   ```

3. **State Propagation**: Updated state is passed to the next agent
   ```python
   # Sequential flow ensures previous agent's output is available
   graph_builder.add_edge("planner_agent", "research_agent")
   ```

### State Update Pattern

```python
# Each agent receives full state
def agent_node(state: CampaignState) -> dict:
    # Extract what we need
    inputs = {
        "topic": state.topic,
        "audience": state.target_audience
    }
    
    # Process
    output = chain.invoke(inputs)
    
    # Return only what we're updating
    return {
        "audience_persona": output.persona,
        "core_messaging": output.messaging
    }
```

### Frontend State Management

The frontend uses React hooks for state:

```javascript
// Report.jsx state structure
const [jsonState, setJsonState] = useState({})  // Complete CampaignState
const [plannerData, setPlannerData] = useState(null)
const [researchData, setResearchData] = useState(null)
const [contentData, setContentData] = useState(null)
const [generatedAssets, setGeneratedAssets] = useState({})
const [landingPageCode, setLandingPageCode] = useState(null)
const [brdUrl, setBrdUrl] = useState(null)
const [strategyMarkdown, setStrategyMarkdown] = useState(null)
```

State updates are triggered by WebSocket messages:

```javascript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (message.event === "step") {
    const stateData = JSON.parse(message.data)
    setJsonState(stateData)  // Update complete state
    
    // Extract and update individual pieces
    if (stateData.plannerData) setPlannerData(stateData.plannerData)
    // ... etc
  }
}
```

---

## Communication Protocols

### WebSocket Protocol Details

#### Connection Management

```python
# Server-side (FastAPI)
@app.websocket("/ws_stream_campaign")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()  # Accept connection
    try:
        # Receive initial prompt
        json_data = await websocket.receive_json()
        
        # Stream LangGraph execution
        async for state_update in foundry_app.astream(initial_input):
            await websocket.send_json({
                "event": "step",
                "node": node_name,
                "data": state_json
            })
        
        await websocket.send_json({"event": "done"})
    finally:
        await websocket.close()
```

#### Error Handling

```python
try:
    # Agent execution
    output = agent_chain.invoke(inputs)
except Exception as e:
    # Log error
    print(f"--- ❌ ERROR: {e} ---")
    # Return empty dict (state not updated)
    return {}
```

### HTTP Protocol

Standard REST API using FastAPI:

```python
@app.post("/deploy_to_vercel")
async def deploy_to_vercel(request: DeployRequest):
    # Validate request
    # Call external API
    # Return response
    return {"success": True, "url": "..."}
```

---

## Error Handling

### Error Handling Strategy

1. **Agent-Level Errors**: Each agent has try-catch blocks
   ```python
   try:
       output = chain.invoke(inputs)
       return output.model_dump()
   except Exception as e:
       print(f"--- ❌ ERROR: {e} ---")
       return {}  # Empty dict = no state update
   ```

2. **WebSocket Errors**: Caught at endpoint level
   ```python
   except Exception as e:
       await websocket.send_json({
           "event": "error",
           "data": str(e)
       })
   ```

3. **API Errors**: HTTP status codes
   ```python
   except Exception as e:
       raise HTTPException(status_code=500, detail=str(e))
   ```

### Error Recovery

- **Partial Failures**: Workflow continues even if one agent fails (returns empty dict)
- **Retry Logic**: Can be added at agent level for transient failures
- **User Notification**: Errors sent to frontend via WebSocket

---

## Performance Considerations

### Optimization Strategies

1. **Async/Await**: All I/O operations are async
   ```python
   async for state in foundry_app.astream(...):
       await websocket.send_json(...)
   ```

2. **Streaming**: Real-time updates instead of waiting for completion
   - Users see progress immediately
   - Better UX for long-running operations

3. **API Rate Limiting**: 
   - Groq: Check rate limits
   - Unsplash: Limited requests per hour
   - Tavily: Check quota

4. **Caching**: Not implemented but could cache:
   - Common research queries
   - Frequently used prompts
   - Generated assets

5. **Batch Processing**: Currently sequential, could parallelize:
   - Image fetching (multiple Unsplash calls)
   - Social post generation (if generating many posts)

### Bottlenecks

1. **LLM API Calls**: Slowest operation (~2-5 seconds per call)
   - 8 agents = ~20-40 seconds total
   - Mitigation: Could parallelize independent agents

2. **External API Calls**: 
   - Tavily search: ~1-2 seconds
   - Unsplash: ~0.5-1 second per image
   - Mitigation: Parallel image fetching

3. **PDF Generation**: fpdf2 is synchronous
   - Could use async PDF library

---

## Security

### Security Measures

1. **Environment Variables**: All API keys stored in `.env`
   ```python
   GROQ_API_KEY = os.getenv("GROQ_API_KEY")
   ```

2. **CORS Configuration**: Limited to development origins
   ```python
   allow_origins=["http://localhost:5173"]
   ```

3. **Input Validation**: Pydantic models validate all inputs
   ```python
   class StreamRequest(BaseModel):
       initial_prompt: str
   ```

4. **No SQL Injection**: No database, no SQL queries

5. **API Key Protection**: Keys never exposed to frontend

### Security Improvements (Round 2)

- [ ] Rate limiting per IP/user
- [ ] Authentication/Authorization
- [ ] Input sanitization for HTML generation
- [ ] HTTPS in production
- [ ] API key rotation
- [ ] Audit logging

---

## Deployment Architecture

### Current Setup (Development)

```
┌─────────────────────────────────────────┐
│        Local Development                │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Backend    │    │   Frontend   │  │
│  │  (Python)    │    │   (React)    │  │
│  │  Port 8000   │    │  Port 5173   │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
│  • uvicorn server                       │
│  • Vite dev server                      │
│  • Hot reload                           │
└─────────────────────────────────────────┘
```

### Proposed Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Architecture               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              CDN / Load Balancer                │   │
│  │              (CloudFlare / AWS)                 │   │
│  └──────────────┬────────────────┬──────────────────┘   │
│                 │                │                      │
│        ┌────────┴────────┐      │                      │
│        │                 │      │                      │
│  ┌─────▼─────┐    ┌─────▼─────┐│                      │
│  │  Frontend │    │  Backend  ││                      │
│  │  (Vercel) │    │  (AWS/GCP)││                      │
│  │           │    │           ││                      │
│  │ • Static  │    │ • FastAPI ││                      │
│  │   Assets  │    │ • uvicorn ││                      │
│  │ • React   │    │ • Workers ││                      │
│  │   Build   │    │ • Auto-   ││                      │
│  └───────────┘    │   Scaling ││                      │
│                   └─────┬─────┘│                      │
│                         │      │                      │
│                         └──────┘                      │
│                         │                             │
│                    ┌────▼─────┐                       │
│                    │ External │                       │
│                    │   APIs   │                       │
│                    └──────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Deployment Steps (Future)

1. **Frontend**:
   ```bash
   cd ui
   npm run build
   # Deploy dist/ to Vercel/Netlify
   ```

2. **Backend**:
   ```bash
   # Dockerfile
   FROM python:3.11
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD uvicorn server:app --host 0.0.0.0 --port 8000
   ```

3. **Environment Variables**: Set in deployment platform

---

## Database Schema (Future)

Currently stateless, but Round 2 could add:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    initial_prompt TEXT,
    state JSONB,  -- Complete CampaignState
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Campaign outputs table
CREATE TABLE campaign_outputs (
    id UUID PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id),
    output_type VARCHAR(50),  -- 'landing_page', 'brd', 'social_post'
    content TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP
);
```

---

## Monitoring & Logging

### Current Logging

```python
print(f"--- N. 🔧 Calling {Agent} Agent ---")
print(f"--- ✅ Success ---")
print(f"--- ❌ ERROR: {e} ---")
```

### Proposed Monitoring (Round 2)

1. **Structured Logging**: Use `logging` module
2. **Metrics**: 
   - Agent execution time
   - API call latency
   - Error rates
3. **APM**: Application Performance Monitoring (e.g., Sentry)
4. **Health Checks**: `/health` endpoint
5. **Alerting**: Notifications for errors

---

## Testing Strategy (Future)

### Unit Tests

```python
def test_planner_agent():
    state = CampaignState(initial_prompt="...")
    result = planner_agent_node(state)
    assert "goal" in result
    assert "topic" in result
```

### Integration Tests

```python
async def test_websocket_flow():
    async with websockets.connect("ws://localhost:8000/ws_stream_campaign") as ws:
        await ws.send(json.dumps({"initial_prompt": "..."}))
        response = await ws.recv()
        assert json.loads(response)["event"] == "step"
```

### E2E Tests

- Playwright/Cypress for frontend
- Test complete workflow from prompt to output

---

## Conclusion

This technical documentation provides a comprehensive overview of the AI Campaign Foundry system architecture, design patterns, and implementation details. For implementation-specific questions, refer to the code comments and inline documentation.

