const questions = [
  // === 5 Single Choice ===
  {
    type: "single",
    question: "What is the capital of India?",
    options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
    answer: ["Delhi"]
  },
  {
    type: "single",
    question: "Which language is used for web apps?",
    options: ["Python", "HTML", "Java", "All"],
    answer: ["All"]
  },
  {
    type: "single",
    question: "What does CSS stand for?",
    options: ["Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
    answer: ["Cascading Style Sheets"]
  },
  {
    type: "single",
    question: "Which is not a programming language?",
    options: ["Python", "HTML", "C++", "Java"],
    answer: ["HTML"]
  },
  {
    type: "single",
    question: "What does JS stand for?",
    options: ["Java Syntax", "Java Source", "JavaScript", "JustScript"],
    answer: ["JavaScript"]
  },

  // === 5 Multi Choice ===
  {
    type: "multi",
    question: "Select all prime numbers.",
    options: ["2", "3", "4", "5"],
    answer: ["2", "3", "5"]
  },
  {
    type: "multi",
    question: "Which are JavaScript frameworks?",
    options: ["React", "Django", "Angular", "Vue"],
    answer: ["React", "Angular", "Vue"]
  },
  {
    type: "multi",
    question: "Select front-end languages.",
    options: ["HTML", "CSS", "Python", "JavaScript"],
    answer: ["HTML", "CSS", "JavaScript"]
  },
  {
    type: "multi",
    question: "Select data types in JavaScript.",
    options: ["String", "Integer", "Boolean", "Number"],
    answer: ["String", "Boolean", "Number"]
  },
  {
    type: "multi",
    question: "Select all fruits.",
    options: ["Apple", "Car", "Banana", "Laptop"],
    answer: ["Apple", "Banana"]
  },

  // === 5 Fill in the Blanks ===
  {
    type: "fill",
    question: "The largest planet in the solar system is ____. ",
    answer: ["jupiter"]
  },
  {
    type: "fill",
    question: "HTML stands for ____. ",
    answer: ["hyper text markup language"]
  },
  {
    type: "fill",
    question: "The opposite of 'hot' is ____. ",
    answer: ["cold"]
  },
  {
    type: "fill",
    question: "5 + 5 = ____. ",
    answer: ["10"]
  },
  {
    type: "fill",
    question: "The sun rises in the ____. ",
    answer: ["east"]
  },

  // === 5 True / False ===
  {
    type: "truefalse",
    question: "The sky is green.",
    answer: ["false"]
  },
  {
    type: "truefalse",
    question: "Birds can fly.",
    answer: ["true"]
  },
  {
    type: "truefalse",
    question: "Water boils at 100°C.",
    answer: ["true"]
  },
  {
    type: "truefalse",
    question: "The moon is made of cheese.",
    answer: ["false"]
  },
  {
    type: "truefalse",
    question: "Elephants are the largest land animals.",
    answer: ["true"]
  }
];

let currentIndex = 0;
let score = 0;
const userAnswers = new Array(questions.length).fill(null);

const questionContainer = document.getElementById("question-container");
const scoreContainer = document.getElementById("score-container");
const reviewContainer = document.getElementById("review-container");
const welcomeScreen = document.getElementById("welcome-screen");
const questionScreen = document.getElementById("question-screen");
const progressBar = document.getElementById("progress-bar");

// Start Quiz
function startQuiz() {
  getUserName(); // prompt user for name and save to localStorage
  welcomeScreen.style.display = "none";
  questionScreen.style.display = "block";
  scoreContainer.style.display = "none";
  reviewContainer.style.display = "none";
  showQuestion();
}

// Display current question
function showQuestion() {
  const q = questions[currentIndex];
  updateProgressBar(currentIndex, questions.length);

  questionContainer.innerHTML = `<p>Q${currentIndex + 1}: ${q.question}</p>`;

  // Text-to-speech
  readQuestionAloud(q.question);

  if (q.type === "single") {
    q.options.forEach(option => {
      const checked = userAnswers[currentIndex]?.includes(option) ? "checked" : "";
      questionContainer.innerHTML += `
        <label>
          <input type="radio" name="option" value="${option}" ${checked}> ${option}
        </label>`;
    });
  } else if (q.type === "multi") {
    q.options.forEach(option => {
      const checked = userAnswers[currentIndex]?.includes(option) ? "checked" : "";
      questionContainer.innerHTML += `
        <label>
          <input type="checkbox" value="${option}" ${checked}> ${option}
        </label>`;
    });
  } else if (q.type === "fill") {
    const value = userAnswers[currentIndex]?.[0] || "";
    questionContainer.innerHTML += `
      <input type="text" id="fillInput" placeholder="Type your answer..." value="${value}">`;
  } else if (q.type === "truefalse") {
    ["true", "false"].forEach(val => {
      const checked = userAnswers[currentIndex]?.includes(val) ? "checked" : "";
      questionContainer.innerHTML += `
        <label>
          <input type="radio" name="tf" value="${val}" ${checked}> ${val.charAt(0).toUpperCase() + val.slice(1)}
        </label>`;
    });
  }
}

// Save answer of current question
function saveAnswer() {
  const q = questions[currentIndex];
  let answer = [];

  if (q.type === "single" || q.type === "truefalse") {
    const selected = document.querySelector('input[type="radio"]:checked');
    if (selected) answer.push(selected.value);
  } else if (q.type === "multi") {
    const selected = document.querySelectorAll('input[type="checkbox"]:checked');
    selected.forEach(cb => answer.push(cb.value));
  } else if (q.type === "fill") {
    const input = document.getElementById("fillInput");
    if (input) answer.push(input.value.trim().toLowerCase());
  }

  userAnswers[currentIndex] = answer;
}

// Next question
function nextQuestion() {
  saveAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    finishQuiz();
  }
}

// Previous question
function prevQuestion() {
  saveAnswer();
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
}

// Finish quiz and calculate score
function finishQuiz() {
  saveAnswer();
  score = 0;
  questions.forEach((q, i) => {
    const user = (userAnswers[i] || []).map(a => a.toLowerCase()).sort();
    const correct = q.answer.map(a => a.toLowerCase()).sort();
    if (arraysEqual(user, correct)) score++;
  });

  questionScreen.style.display = "none";
  scoreContainer.style.display = "block";
  document.getElementById("final-score").textContent = `${score} / ${questions.length}`;

  // 🎉 Confetti celebration
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 1.0 }
  });

  setTimeout(() => {
    confetti.reset();
  }, 2000);
}


  saveScore(score);
  displayScores();
  showPerformanceSummary();

// Show answer review screen
function showReview() {
  scoreContainer.style.display = "none";
  reviewContainer.style.display = "block";
  reviewContainer.innerHTML = `<h2>Answer Review</h2>`;

  questions.forEach((q, i) => {
    const user = (userAnswers[i] || []).map(a => a.toLowerCase()).sort();
    const correct = q.answer.map(a => a.toLowerCase()).sort();
    const correctAns = q.answer.join(", ");
    const userAns = userAnswers[i]?.join(", ") || "No answer";
    const resultClass = arraysEqual(user, correct) ? "correct" : "wrong";

    reviewContainer.innerHTML += `
      <div class="${resultClass}">
        <p><strong>Q${i + 1}:</strong> ${q.question}</p>
        <p>Your Answer: ${userAns}</p>
        <p>Correct Answer: ${correctAns}</p>
        <hr>
      </div>`;
  });

  reviewContainer.innerHTML += `<button onclick="retryQuiz()">🔁 Retry Quiz</button>`;
}

// Retry quiz from beginning
function retryQuiz() {
  currentIndex = 0;
  score = 0;
  userAnswers.fill(null);
  scoreContainer.style.display = "none";
  reviewContainer.style.display = "none";
  welcomeScreen.style.display = "block";
  document.getElementById("final-score").textContent = "";
}

// Utility: Check if two arrays are equal
function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

// ================= Extra Features =====================

// Prompt user for name & save it
function getUserName() {
  let userName = prompt("Enter your name:");
  if (!userName) userName = "Player";
  localStorage.setItem("quizUserName", userName);
}

// Update progress bar width
function updateProgressBar(current, total) {
  const progress = ((current + 1) / total) * 100;
  progressBar.style.width = `${progress}%`;
}

// Read question aloud using speech synthesis
function readQuestionAloud(text) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  }
}

// Toggle dark mode and save preference
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');

  // Change toggle button text/icon
  const toggleBtn = document.getElementById('darkModeToggle');
  if (body.classList.contains('dark-mode')) {
    toggleBtn.textContent = '☀️ Light Mode';
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = '🌙 Dark Mode';
    localStorage.setItem("theme", "light");
  }
}

// Load theme from localStorage on page load
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) toggleBtn.textContent = '☀️ Light Mode';
  }
}

// Save score in localStorage
function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
  scores.push(score);
  localStorage.setItem("quizScores", JSON.stringify(scores));
}

// Display previous scores in console (can be improved to show on page)
function displayScores() {
  const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
  console.log("Previous Scores:");
  scores.forEach((score, index) => {
    console.log(`Attempt ${index + 1}: ${score}`);
  });
}

// Show performance summary alert
function showPerformanceSummary() {
  const total = questions.length;
  const correct = score;
  const wrong = total - correct;
  const accuracy = ((correct / total) * 100).toFixed(2);
  alert(`Summary:\nCorrect: ${correct}\nWrong: ${wrong}\nAccuracy: ${accuracy}%`);
}

// Load theme on window load
window.onload = loadTheme;
let totalTime = 600; // 600 seconds = 10 minutes
let timerElement = document.getElementById('timer');

let countdown = setInterval(() => {
  let minutes = Math.floor(totalTime / 60);
  let seconds = totalTime % 60;
  timerElement.textContent = `Time Left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  totalTime--;

  if (totalTime < 0) {
    clearInterval(countdown);
    endQuiz(); // You must have this function to end the quiz
  }
}, 1000);
function endQuiz() {
  clearInterval(countdown); // stop the timer

  const container = document.querySelector(".quiz-container");
  const userName = localStorage.getItem("quizUserName") || "Player";

  container.innerHTML = `
    <h2>🎉 Thank you, <span style="color:#bb86fc">${userName}</span>!</h2>
    <p>Your final score is: ${score} / ${questions.length}</p>
    <button onclick="location.reload()">🔁 Retry</button>
  `;
}


