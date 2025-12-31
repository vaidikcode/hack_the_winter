# Quick Start Guide - AI Campaign Foundry

## 🚀 Getting Started in 5 Minutes

### Prerequisites Check

Before starting, ensure you have:

- ✅ Python 3.8+ installed
- ✅ Node.js 16+ and npm installed
- ✅ API keys ready (see below)

### Step 1: Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd hack_the_winter

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd ui
npm install
cd ..
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add your API keys to `.env`:

```env
# Required APIs
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_key

# Optional (for social media automation)
SLACK_WEBHOOK_URL=your_slack_webhook_url
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Optional (for deployment)
VERCEL_TOKEN=your_vercel_token
```

### Step 3: Run the Application

**Option A: Using the provided script (Recommended)**

```bash
chmod +x run.sh
./run.sh
```

**Option B: Manual start (Two terminals)**

Terminal 1 - Backend:
```bash
python server.py
```

Terminal 2 - Frontend:
```bash
cd ui
npm run dev
```

### Step 4: Access the Application

- **Frontend**: Open http://localhost:5173 in your browser
- **Backend API**: http://localhost:8000

### Step 5: Create Your First Campaign

1. Navigate to the prompt page
2. Enter a campaign description, for example:
   ```
   Launch a webinar about AI-powered code debugging 
   for VPs of Engineering on March 15th
   ```
3. Press Enter or click Submit
4. Watch the real-time progress as agents work
5. Review the generated campaign assets

---

## 📝 Example Prompts

Try these example prompts to get started:

### Example 1: Webinar Campaign
```
Launch a webinar about AI-powered code debugging 
for VPs of Engineering on March 15th
```

### Example 2: Product Launch
```
Create a campaign to promote our new SaaS analytics 
platform targeting marketing directors in enterprise companies
```

### Example 3: Free Trial Promotion
```
Promote a free trial of our data visualization tool 
to data analysts and business intelligence professionals
```

---

## 🔑 API Keys Setup Guide

### 1. Groq API Key

1. Visit: https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add to `.env` as `GROQ_API_KEY`

### 2. Tavily Search API Key

1. Visit: https://tavily.com/
2. Sign up for an account
3. Get your API key from the dashboard
4. Add to `.env` as `TAVILY_API_KEY`

### 3. Unsplash API Key

1. Visit: https://unsplash.com/developers
2. Create a new application
3. Get your Access Key
4. Add to `.env` as `UNSPLASH_ACCESS_KEY`

### 4. Slack Webhook (Optional)

1. Go to your Slack workspace
2. Visit: https://api.slack.com/apps
3. Create a new app
4. Enable Incoming Webhooks
5. Create a webhook URL
6. Add to `.env` as `SLACK_WEBHOOK_URL`

### 5. Telegram Bot (Optional)

1. Message @BotFather on Telegram
2. Use `/newbot` command
3. Follow instructions to create a bot
4. Get your bot token
5. Get your chat ID (message @userinfobot)
6. Add both to `.env` as `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`

---

## 🐛 Troubleshooting

### Issue: "GROQ_API_KEY not found"

**Solution**: Ensure your `.env` file is in the root directory and contains `GROQ_API_KEY=your_key`

### Issue: Frontend won't connect to backend

**Solution**: 
- Ensure backend is running on port 8000
- Check CORS settings in `server.py`
- Verify WebSocket URL in frontend code

### Issue: Module not found errors

**Solution**: 
```bash
# Reinstall Python dependencies
pip install -r requirements.txt

# Reinstall frontend dependencies
cd ui
npm install
```

### Issue: Port already in use

**Solution**:
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>

# Or change port in server.py
uvicorn.run(app, host="localhost", port=8001)
```

---

## 📚 Next Steps

- Read the [README.md](README.md) for detailed documentation
- Check [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) for technical details
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design

---

## 💡 Tips

1. **Start Simple**: Begin with simple prompts to understand the flow
2. **Monitor Console**: Check backend console for detailed logs
3. **Check WebSocket**: Open browser DevTools to monitor WebSocket messages
4. **Save Outputs**: Generated files are saved in `campaign_outputs/` directory

---

## 🆘 Need Help?

- Check the documentation files
- Review error messages in console
- Ensure all API keys are correctly set
- Verify all dependencies are installed

Happy Campaign Building! 🎉

