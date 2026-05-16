# 🎤 Voice Interview Platform - Quick Start Guide

## ✨ What You Just Got

A **complete voice-based interview platform** where:
1. Users speak their interview answers
2. Voice is converted to text automatically
3. AI (OpenAI) evaluates all answers
4. Users get detailed feedback and scores

## 🚀 Quick Start (5 minutes)

### 1. Open Two Terminals

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\manoj\OneDrive\Desktop\hired.ai\server"
npm run server
# Wait for: "Server is running at port 5000"
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\manoj\OneDrive\Desktop\hired.ai\client"
npm run dev
# You'll see: "Local: http://localhost:5174"
```

### 2. Visit the App
- Open: http://localhost:5174
- **Sign up** with any email/password
- You'll be logged in automatically

### 3. Create an Interview
1. Click "My Interviews 🎯" (in navigation or sidebar)
2. Click blue "Create Interview" button
3. Fill in:
   - Position: `Frontend Engineer`
   - Company: `Google`
   - Difficulty: `Medium`
4. Click "Create Interview"

### 4. Start Voice Interview
1. Click on the interview card you just created
2. Read the instructions
3. Click "Start Interview" button
4. **You'll hear the first question!**

### 5. Answer Questions
For each question:
- 🎙️ **Click microphone** to start recording
- 🗣️ **Speak your answer** clearly
- ✅ **Click "Save Answer"** when done
- ➡️ **Click "Next Question"** to continue

### 6. Get AI Feedback
After all 5 questions:
- Click "Submit Interview & Get AI Feedback"
- Wait 30-60 seconds for OpenAI to evaluate
- See detailed feedback for each answer!

## 📁 Files Created

### New Files:
```
client/src/
├── hooks/
│   └── useSpeechRecognition.js    (Speech-to-text hook)
├── pages/
│   └── VoiceInterview.jsx          (Voice interview UI)
└── services/
    └── api.js                      (Backend communication)

Documentation/
├── VOICE_INTERVIEW_IMPLEMENTATION.md
├── VOICE_INTERVIEW_GUIDE.md
├── API_EXAMPLES.md
└── README (this file)
```

## 🎯 Key Features

### For Users
- ✅ Speak naturally, no typing needed
- ✅ Questions are read aloud
- ✅ Real-time text conversion of voice
- ✅ Can re-record any answer
- ✅ See detailed AI feedback

### For Interviewers
- ✅ Automated question generation (AI)
- ✅ Automated evaluation (OpenAI)
- ✅ Structured feedback
- ✅ Comparable scores
- ✅ Interview history

## 💾 Technology Stack

**Browser Features Used:**
- Web Speech API (Speech Recognition)
- Web Speech API (Speech Synthesis)
- LocalStorage
- Fetch API

**Server:**
- Node.js + Express
- MongoDB (Atlas)
- OpenAI API
- JWT Authentication

## 🔧 Customization

### Change AI Model
Edit `server/services/aiService.js`, line 8:
```javascript
model: "gpt-4o-mini",  // Change to "gpt-4" or "gpt-3.5-turbo"
```

### Change Speech Language
Edit `client/src/hooks/useSpeechRecognition.js`, line 18:
```javascript
recognition.lang = 'en-US';  // Change to 'es-ES', 'fr-FR', etc.
```

### Adjust Number of Questions
Edit `client/src/pages/interview.jsx`, when creating interview:
```javascript
generate: true,  // Set count parameter
```

## 📊 How It Works (Behind the Scenes)

```
1. User speaks answer
2. Browser's Web Speech API converts to text
3. Text displayed for user review
4. User clicks "Next" or "Save Answer"
5. All answers collected in component state
6. User clicks "Submit Interview"
7. POST request sent to backend with all answers
8. Backend sends to OpenAI API
9. OpenAI returns feedback + scores
10. Backend stores in MongoDB
11. Frontend displays results beautifully
```

## 🌐 Browser Support

| Browser | Support | Voice | Notes |
|---------|---------|-------|-------|
| Chrome | ✅ Full | ✅ | Best experience |
| Safari | ✅ Full | ✅ | iOS 14.5+ |
| Edge | ✅ Full | ✅ | Chromium-based |
| Firefox | ✅ Full | ✅ | Works well |
| Mobile | ✅ Full | ✅ | Android + iOS |

## 🎙️ Tips for Best Results

1. **Use a quiet room** - Background noise affects speech recognition
2. **Speak clearly** - Don't mumble or speak too fast
3. **Normal pace** - Speak like you're in a real interview
4. **Good microphone** - Built-in works, but external is better
5. **Fast internet** - Needed for real-time conversion

## ❌ Troubleshooting

### "No microphone access"
- Check browser permission (look for mic icon in URL bar)
- System Settings → Privacy → Microphone → Allow app

### "Speech not recognized"
- Try again, speak more clearly
- Check if any other app is using mic
- Restart browser

### "Question not speaking"
- Check speaker volume
- Check system audio settings
- Refresh page

### "Stuck on a question"
- Click "Repeat Question"
- Wait a few seconds
- If stuck, refresh page

## 📈 What Happens With Your Data

```
Your Voice → Text (Local Browser)
     ↓
Sent to Server (HTTPS, JWT Protected)
     ↓
Stored Temporarily
     ↓
Sent to OpenAI
     ↓
AI Evaluates
     ↓
Results Back to Server
     ↓
Stored in MongoDB
     ↓
Displayed to You
```

**Privacy:** Your data is encrypted and stored securely. Only you can access your interview results.

## 🎓 Interview Strategy

1. **Listen carefully** - Understand what's being asked
2. **Think briefly** - Pause for 2-3 seconds if needed
3. **Structure answers** - Intro → Details → Conclusion
4. **Be specific** - Use examples and real experiences
5. **Show confidence** - Speak clearly and assuredly

## 📞 Quick Reference

### Key URLs
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000
- API Docs: Check `API_EXAMPLES.md`

### Important Endpoints
- `POST /api/users/register` - Sign up
- `POST /api/users/login` - Log in
- `POST /api/interviews` - Create interview
- `GET /api/interviews/:id` - Get interview details
- `POST /api/interviews/:id/submit` - Submit answers

### Key Files to Remember
- Backend config: `server/.env`
- Frontend config: `client/src/services/api.js`
- Interview component: `client/src/pages/VoiceInterview.jsx`

## 🚨 If Something Goes Wrong

1. **Check server is running**
   ```powershell
   curl http://localhost:5000/
   # Should return: "Server is live..."
   ```

2. **Check frontend is running**
   ```
   Visit: http://localhost:5174
   ```

3. **Check environment variables**
   - MONGODB_URI set? `server/.env`
   - JWT_SECRET set? `server/.env`
   - OPENAI_API_KEY set? `server/.env`

4. **Check browser console** (F12)
   - Any red errors?
   - Check error messages

5. **Restart everything**
   ```powershell
   # Close both terminals
   # Open new terminals
   # Restart both servers
   ```

## 📚 Documentation Files

- **VOICE_INTERVIEW_IMPLEMENTATION.md** - Complete technical details
- **VOICE_INTERVIEW_GUIDE.md** - User guide and features
- **API_EXAMPLES.md** - Request/response examples
- **This file** - Quick start and reference

## 🎉 Next Steps

1. **Test thoroughly** - Try creating and completing a full interview
2. **Get feedback** - See what the AI thinks of your answers
3. **Refine** - Make adjustments based on feedback
4. **Deploy** - When ready, deploy to production

## 🤝 Need Help?

1. Read the documentation files listed above
2. Check `API_EXAMPLES.md` for request/response formats
3. Review browser console (F12) for error messages
4. Check server terminal for backend errors
5. Try a different browser if issues persist

---

**You're all set! Enjoy your voice-powered interview platform! 🚀**

Questions? Issues? Check the documentation files first - they cover most scenarios.
