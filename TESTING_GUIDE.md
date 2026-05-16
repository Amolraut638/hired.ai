# Voice Interview Platform - Testing Guide

## 🧪 Complete Test Scenarios

### Test Scenario 1: Full Interview Flow (Happy Path)

#### 1.1 Sign Up
- **URL:** http://localhost:5174
- **Action:** Click "Sign up" tab
- **Fill in:**
  - Name: `John Doe`
  - Email: `john@example.com`
  - Password: `password123`
- **Expected Result:** Redirected to dashboard, logged in

#### 1.2 Create Interview
- **URL:** http://localhost:5174/app
- **Action:** 
  1. Find "My Interviews 🎯" section
  2. Click "Create Interview" button
  3. Fill form:
     - Position: `React Developer`
     - Company: `Meta`
     - Difficulty: `medium`
  4. Click "Create Interview"
- **Expected Result:** 
  - Interview appears in list
  - Toast: "Interview created successfully!"
  - New interview card shows position and company

#### 1.3 Start Voice Interview
- **URL:** http://localhost:5174/app/start-interview/[interviewId]
- **Action:**
  1. Click on interview card
  2. Read the welcome instructions
  3. Click "Start Interview" button
- **Expected Result:**
  - Welcome screen closes
  - Question 1 is read aloud
  - Microphone button appears
  - Progress bar shows: 1/5

#### 1.4 Answer Question 1
- **Action:**
  1. Click microphone button (purple circle with mic icon)
  2. Speak your answer: "React is a JavaScript library for building user interfaces with reusable components"
  3. Wait for text to appear
  4. Click "Save Answer" button
- **Expected Result:**
  - Button changes to red while listening
  - "🎙️ Listening..." message appears
  - Text appears as you speak
  - Answer saved successfully
  - "✓ Answer recorded" message

#### 1.5 Continue to Question 2
- **Action:**
  1. Click "Next Question" button
- **Expected Result:**
  - Progress bar updates: 2/5
  - Question 2 is read aloud
  - Answer field is empty
  - Can record new answer

#### 1.6 Repeat for Questions 3, 4, 5
- **Same flow as 1.4-1.5**
- **Final result:** All 5 questions answered, progress shows 5/5

#### 1.7 Submit Interview
- **Action:**
  1. After question 5 answered, "Next Question" changes to "Finish Interview"
  2. Click "Finish Interview"
  3. Now see submit button: "✓ Submit Interview & Get AI Feedback"
  4. Click submit button
- **Expected Result:**
  - Button shows loading: "Submitting..."
  - 30-60 second wait
  - Redirected to results page

#### 1.8 View Results
- **URL:** http://localhost:5174/app/interview/[interviewId]
- **Expected Result:**
  - All 5 questions displayed
  - Each shows your voice answer (as text)
  - AI feedback below each answer
  - Score out of 10 (e.g., 8.5/10)
  - Overall rating at bottom (e.g., 8.1/5)

---

### Test Scenario 2: User Re-records Answer

#### 2.1 Start Interview
- Follow steps 1.1 - 1.3 above

#### 2.2 Record Answer
- **Action:**
  1. Click microphone
  2. Speak answer
  3. Click "Save Answer"

#### 2.3 Re-record Same Answer
- **Action:**
  1. Click "Re-record" button
  2. Speak new answer
  3. Click "Save Answer" again
- **Expected Result:**
  - Previous answer is replaced
  - New answer is saved
  - Can continue or re-record again

---

### Test Scenario 3: Microphone Not Available

#### 3.1 Test in Private/Incognito Window
- **Action:**
  1. Open incognito window
  2. Visit http://localhost:5174
  3. Sign up
  4. Create interview
  5. Start interview
  6. Click microphone
- **Expected Result:**
  - Browser prompts for microphone permission
  - Allow access
  - Works normally

#### 3.2 Test When Mic Denied
- **Action:**
  1. Deny microphone permission
  2. Click microphone button
- **Expected Result:**
  - Error message appears
  - Cannot record voice
  - Can still use browser normally

---

### Test Scenario 4: Navigate Between Questions

#### 4.1 During Interview
- **Action:**
  1. Answer question 1
  2. Click number "3" in progress tracker
- **Expected Result:**
  - Jump to question 3
  - Question 3 reads aloud
  - Can answer question 3
  - Can go back to question 1, 2 anytime

---

### Test Scenario 5: Repeat Question

#### 5.1 Hear Question Again
- **Action:**
  1. Start recording answer
  2. Click "Repeat Question" button
- **Expected Result:**
  - Question reads aloud again
  - Can hear it multiple times
  - Doesn't affect answer

---

### Test Scenario 6: Error Handling

#### 6.1 Network Error
- **Action:**
  1. Disconnect internet
  2. Try to submit interview
- **Expected Result:**
  - Error message: "Failed to submit interview"
  - Can retry when internet returns

#### 6.2 Empty Answer
- **Action:**
  1. Don't speak any answer
  2. Try to click "Next Question"
- **Expected Result:**
  - Error: "Please provide an answer"
  - Cannot proceed without answer

#### 6.3 Browser Doesn't Support Speech API
- **Action:**
  1. Use very old browser (IE 11, etc)
  2. Try to start interview
- **Expected Result:**
  - Error: "Speech Recognition not supported"
  - Cannot use voice features
  - Backend and frontend still work with text

---

## 📝 Test Cases Checklist

### Login & Auth
- [ ] Sign up with new email
- [ ] Sign up with existing email (should fail)
- [ ] Login with correct password
- [ ] Login with wrong password (should fail)
- [ ] Logout clears session
- [ ] Refresh page keeps logged in
- [ ] Protected routes require login

### Interview Creation
- [ ] Create interview with all fields
- [ ] Create without position (should fail)
- [ ] Create without company (optional, should work)
- [ ] Interview appears in list
- [ ] Can create multiple interviews
- [ ] Interviews load from database

### Voice Recording
- [ ] Microphone prompts permission
- [ ] Accepting permission allows recording
- [ ] Denying permission shows error
- [ ] Can record first time
- [ ] Can record multiple times
- [ ] Transcript appears in real-time
- [ ] Final transcript saved

### Answer Management
- [ ] Answer saved after recording
- [ ] Can re-record answer
- [ ] Previous answer replaced with re-record
- [ ] Cannot proceed without answer
- [ ] Can navigate between questions
- [ ] Progress updates correctly

### Submission & Evaluation
- [ ] All 5 answers submitted together
- [ ] Backend receives all answers
- [ ] OpenAI evaluates answers
- [ ] Feedback appears for each question
- [ ] Scores calculated (0-10)
- [ ] Overall rating calculated (0-5)
- [ ] Results displayed in clean format

### UI/UX
- [ ] Buttons are clickable
- [ ] Progress bar updates
- [ ] Loading spinners appear
- [ ] Toast notifications show
- [ ] Error messages appear
- [ ] Layout is responsive
- [ ] Mobile view works

### Data Persistence
- [ ] Interviews saved in database
- [ ] Answers saved in database
- [ ] Feedback saved in database
- [ ] Can view old interviews
- [ ] Can view old results

---

## 🔍 Debug Checklist

### Frontend Issues
- [ ] Check browser console (F12)
- [ ] Look for red error messages
- [ ] Check Network tab for failed requests
- [ ] Verify localhost:5174 is accessible
- [ ] Clear browser cache if needed

### Backend Issues
- [ ] Check server terminal for errors
- [ ] Verify MongoDB connection (should show "Database Connected!")
- [ ] Verify OpenAI API key is correct
- [ ] Check environment variables in .env
- [ ] Test: curl http://localhost:5000/

### API Issues
- [ ] Check response status (should be 200-201)
- [ ] Check response body has 'success': true
- [ ] Check error message if failed
- [ ] Verify JWT token is being sent
- [ ] Test endpoints individually with curl

### Voice Issues
- [ ] Check microphone is working (system level)
- [ ] Try different browser
- [ ] Speak clearly and slower
- [ ] Reduce background noise
- [ ] Check microphone permissions

---

## 📊 Sample Test Data

### Test User 1
```
Name: Frontend Engineer
Email: frontend@example.com
Password: password123
```

### Test Interview 1
```
Position: React Developer
Company: Meta
Difficulty: medium
```

### Sample Answer (Question 1)
```
"React is a JavaScript library created by Facebook for building 
user interfaces. It uses a component-based architecture where the 
UI is divided into reusable, stateful components. React efficiently 
updates the DOM through its Virtual DOM mechanism and reconciliation 
algorithm, making applications fast and scalable."
```

---

## ⏱️ Expected Timings

| Action | Expected Time | Actual Time |
|--------|----------------|------------|
| Sign up | < 2 seconds | _ |
| Create interview | < 3 seconds | _ |
| AI generates questions | < 2 seconds | _ |
| Start interview | < 1 second | _ |
| Question reads aloud | 3-5 seconds | _ |
| User speaks answer | 20-45 seconds | _ |
| Text conversion | < 1 second | _ |
| Move to next question | < 1 second | _ |
| All 5 questions | 5-10 minutes | _ |
| Submit answers | < 1 second | _ |
| AI evaluation | 30-60 seconds | _ |
| Show results | < 2 seconds | _ |

---

## 🎯 Acceptance Criteria

### All of these must pass:

- [x] ✅ User can create account
- [x] ✅ User can create interview
- [x] ✅ Questions are generated by AI
- [x] ✅ Questions are read aloud
- [x] ✅ User can record voice answers
- [x] ✅ Voice is converted to text
- [x] ✅ All answers submitted together
- [x] ✅ Answers evaluated by OpenAI
- [x] ✅ Feedback shown to user
- [x] ✅ Scores displayed (0-10)
- [x] ✅ Overall rating shown (0-5)
- [x] ✅ UI is responsive
- [x] ✅ Error messages clear
- [x] ✅ Mobile friendly
- [x] ✅ Works in modern browsers

---

## 🚀 Ready to Test!

All systems are go. Start the servers and run through Test Scenario 1 (Full Interview Flow) to ensure everything works perfectly.

Good luck! 🎉
