# Voice Interview - API Examples & Response Formats

## 1. Create Interview Request

### Endpoint
```
POST http://localhost:5000/api/interviews
Authorization: <JWT_TOKEN>
```

### Request Body
```json
{
  "position": "Frontend Engineer",
  "companyName": "Google",
  "difficulty": "medium",
  "duration": "30 min",
  "generate": true,
  "userId": "user_id_from_login"
}
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "_id": "1767645357596",
    "userId": "user_id",
    "position": "Frontend Engineer",
    "companyName": "Google",
    "difficulty": "medium",
    "duration": "30 min",
    "questions": [
      {
        "questionText": "What is the Virtual DOM in React and how does it improve performance?",
        "userAnswer": null,
        "aiFeedback": null,
        "score": null
      },
      {
        "questionText": "Explain the difference between useEffect and useLayoutEffect hooks.",
        "userAnswer": null,
        "aiFeedback": null,
        "score": null
      },
      {
        "questionText": "How does React handle reconciliation and what is the diffing algorithm?",
        "userAnswer": null,
        "aiFeedback": null,
        "score": null
      },
      {
        "questionText": "What are higher-order components (HOC) and when would you use them?",
        "userAnswer": null,
        "aiFeedback": null,
        "score": null
      },
      {
        "questionText": "How do you optimize performance in a large React application?",
        "userAnswer": null,
        "aiFeedback": null,
        "score": null
      }
    ],
    "status": "scheduled",
    "createdAt": "2026-01-06T10:00:00Z",
    "updatedAt": "2026-01-06T10:00:00Z"
  }
}
```

## 2. Get Interview Details

### Endpoint
```
GET http://localhost:5000/api/interviews/1767645357596
Authorization: <JWT_TOKEN>
```

### Response (Before submission)
```json
{
  "success": true,
  "data": {
    "_id": "1767645357596",
    "position": "Frontend Engineer",
    "companyName": "Google",
    "difficulty": "medium",
    "duration": "30 min",
    "questions": [
      {
        "questionText": "What is the Virtual DOM in React and how does it improve performance?",
        "userAnswer": null,
        "aiFeedback": null,
        "score": null
      },
      // ... more questions
    ],
    "status": "in-progress",
    "rating": null,
    "feedback": null
  }
}
```

## 3. Submit Interview with Voice Answers

### Endpoint
```
POST http://localhost:5000/api/interviews/1767645357596/submit
Authorization: <JWT_TOKEN>
```

### Request Body (from Voice Interview)
```json
{
  "answers": [
    {
      "index": 0,
      "answer": "Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to improve performance by batching updates and only applying changes that have actually been made. This reduces direct manipulation of the actual DOM which is slow."
    },
    {
      "index": 1,
      "answer": "useEffect runs after the component renders and is used for side effects like fetching data. useLayoutEffect runs synchronously after DOM mutations, before the browser paints, useful for reading layout and avoiding visual flashing."
    },
    {
      "index": 2,
      "answer": "React uses a diffing algorithm where it compares the new virtual DOM with the previous one, identifies which elements changed, and updates only those elements in the real DOM. This is much more efficient than re-rendering everything."
    },
    {
      "index": 3,
      "answer": "Higher-order components are functions that take a component and return an enhanced version. They're useful for code reuse, state abstraction, and prop manipulation. Modern hooks are often preferred for the same purposes though."
    },
    {
      "index": 4,
      "answer": "Performance optimization includes: code splitting with lazy loading, memoization with React.memo, using useCallback and useMemo hooks, optimizing re-renders, implementing virtual scrolling for large lists, and using production builds."
    }
  ]
}
```

### Response (After AI Evaluation)
```json
{
  "success": true,
  "data": {
    "_id": "1767645357596",
    "position": "Frontend Engineer",
    "companyName": "Google",
    "difficulty": "medium",
    "questions": [
      {
        "questionText": "What is the Virtual DOM in React and how does it improve performance?",
        "userAnswer": "Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to improve performance by batching updates and only applying changes that have actually been made. This reduces direct manipulation of the actual DOM which is slow.",
        "aiFeedback": "Excellent explanation! You correctly identified the core concept of Virtual DOM and explained how it improves performance through batching updates. You could have mentioned the reconciliation process more specifically.",
        "score": 8.5
      },
      {
        "questionText": "Explain the difference between useEffect and useLayoutEffect hooks.",
        "userAnswer": "useEffect runs after the component renders and is used for side effects like fetching data. useLayoutEffect runs synchronously after DOM mutations, before the browser paints, useful for reading layout and avoiding visual flashing.",
        "aiFeedback": "Great answer! You explained the timing difference correctly. A small note: useEffect is preferred in most cases for performance reasons. You could mention preventing flashing in modal or tooltip scenarios.",
        "score": 8.0
      },
      {
        "questionText": "How does React handle reconciliation and what is the diffing algorithm?",
        "userAnswer": "React uses a diffing algorithm where it compares the new virtual DOM with the previous one, identifies which elements changed, and updates only those elements in the real DOM. This is much more efficient than re-rendering everything.",
        "aiFeedback": "Good explanation of the concept. For a more complete answer, consider mentioning React's heuristics: 1) Different element types have different trees, 2) Keys help identify elements across renders.",
        "score": 7.5
      },
      {
        "questionText": "What are higher-order components (HOC) and when would you use them?",
        "userAnswer": "Higher-order components are functions that take a component and return an enhanced version. They're useful for code reuse, state abstraction, and prop manipulation. Modern hooks are often preferred for the same purposes though.",
        "aiFeedback": "Solid understanding! You correctly identified it as a function and its use cases. The note about hooks being preferred shows modern knowledge. Examples like withRouter or withStyles would strengthen this answer.",
        "score": 7.8
      },
      {
        "questionText": "How do you optimize performance in a large React application?",
        "userAnswer": "Performance optimization includes: code splitting with lazy loading, memoization with React.memo, using useCallback and useMemo hooks, optimizing re-renders, implementing virtual scrolling for large lists, and using production builds.",
        "aiFeedback": "Comprehensive answer covering multiple optimization strategies! You listed diverse and practical techniques. Consider mentioning profiling tools and lazy-loading images for even better coverage.",
        "score": 8.8
      }
    ],
    "status": "completed",
    "rating": 8.1,
    "feedback": "Overall strong performance with good understanding of React fundamentals and best practices.",
    "createdAt": "2026-01-06T10:00:00Z",
    "updatedAt": "2026-01-06T10:05:30Z"
  },
  "aiEvaluation": [
    {
      "question": "What is the Virtual DOM...",
      "score": 8.5,
      "feedback": "Excellent explanation..."
    },
    // ... more evaluations
  ]
}
```

## 4. Error Responses

### Missing Authorization Token
```json
{
  "message": "Unauthorized"
}
```
Status: `401`

### Invalid Interview ID
```json
{
  "success": false,
  "message": "Interview not found"
}
```
Status: `404`

### OpenAI API Error (when generating questions)
```json
{
  "success": false,
  "message": "Failed to generate questions: OpenAI API error"
}
```
Status: `500`

### Missing Required Fields
```json
{
  "message": "Missing required fields"
}
```
Status: `400`

## 5. Frontend Implementation Example

### Getting Interview and Starting Voice Recording

```javascript
// Fetch interview data
const response = await fetch('http://localhost:5000/api/interviews/1767645357596', {
  headers: {
    'Authorization': localStorage.getItem('token')
  }
});
const interview = await response.json();

// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Listen to user and collect answers
let answers = [];
interview.data.questions.forEach((q, idx) => {
  // Question is read aloud using Speech Synthesis
  const utterance = new SpeechSynthesisUtterance(q.questionText);
  speechSynthesis.speak(utterance);
  
  // Record user answer
  recognition.start();
  recognition.onresult = (event) => {
    answers[idx] = event.results[0][0].transcript;
  };
});

// Submit answers
const submitResponse = await fetch(
  `http://localhost:5000/api/interviews/1767645357596/submit`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    },
    body: JSON.stringify({
      answers: answers.map((answer, idx) => ({
        index: idx,
        answer: answer
      }))
    })
  }
);

const results = await submitResponse.json();
console.log('Interview Results:', results.data);
```

## 6. Real-World Scenario

### User Journey with Data Flow

```
1. User Signup
   POST /api/users/register
   Response: { token, user: { _id, name, email } }

2. User Creates Interview
   POST /api/interviews
   Data: { position: "Frontend Engineer", generate: true }
   Response: Interview with 5 questions

3. User Starts Voice Interview
   Browser: Speech Synthesis reads Question 1
   Browser: Speech Recognition listens for answer
   User speaks answer (e.g., 45 seconds of audio)

4. Answer Converted to Text
   Browser: Speech-to-text converts audio → "Virtual DOM is..."
   Frontend: Displays text for review

5. User Confirms Answer
   Frontend: Stores answer in state
   Browser: Speech Synthesis reads Question 2
   Repeat for all 5 questions

6. Submit Answers
   POST /api/interviews/:id/submit
   Body: { answers: [{ index: 0, answer: "..." }, ...] }

7. Backend Processing
   Server: Sends to OpenAI API
   OpenAI: Evaluates each answer
   Server: Receives feedback and scores
   MongoDB: Stores results

8. Response to Frontend
   Response includes:
   - Updated interview data
   - AI feedback for each answer
   - Individual scores
   - Overall rating

9. User Views Results
   Frontend: Displays all answers with feedback
   User: Reviews suggestions for improvement
```

## 7. Testing Checklist

- [ ] Interview created with auto-generated questions
- [ ] Questions displayed and spoken aloud
- [ ] Microphone access requested and granted
- [ ] Speech-to-text conversion working
- [ ] Interim transcript shows while speaking
- [ ] Final transcript saved when done speaking
- [ ] Can re-record individual answers
- [ ] Navigation between questions works
- [ ] All answers submitted successfully
- [ ] AI evaluation received within 60 seconds
- [ ] Scores and feedback displayed correctly
- [ ] Overall rating calculated and shown
- [ ] Results can be reviewed multiple times

## 8. Performance Metrics

Typical timings:
- Question text-to-speech: 3-5 seconds
- User speaks answer: 20-45 seconds
- Speech-to-text conversion: < 2 seconds
- Move to next question: < 1 second
- All 5 questions: ~5-10 minutes total
- OpenAI evaluation: 30-60 seconds
- Results display: < 2 seconds

Total interview time: ~10-15 minutes including AI evaluation
