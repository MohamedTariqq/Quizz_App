// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set option
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      //   Creat Bullets + Set Questions Count
      creatBullets(qCount);

      //   Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      //   Start Count down
      countdown(5, qCount);

      //   Click on Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase index
        currentIndex++;

        // Check the Answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Precious Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        //   Add Question Data
        addQuestionData(questionsObject[currentIndex], qCount);

        // Handle Bullest Class
        handleBullets();

        //   Start Count down
        clearInterval(countDownInterval);
        countdown(5, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "html.questions.json", true);
  myRequest.send();
}
getQuestions();

function creatBullets(num) {
  countSpan.innerHTML = num;

  //   Creat spans
  for (i = 0; i < num; i++) {
    // Creat bulletSpan
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    // Appen bulletSpan to main bulletDiv
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //   Creat h2 Question Function
    let questionTitle = document.createElement("h2");

    //   Creat Question Text
    let questionText = document.createTextNode(obj["title"]);

    //   Append Text to h2
    questionTitle.appendChild(questionText);

    //   Append h2 to Quiz area
    quizArea.appendChild(questionTitle);

    //   Creat The Answers
    for (let i = 1; i <= 4; i++) {
      // Creat Main Answer Div
      let mainDiv = document.createElement("div");

      // Add class to Main Div
      mainDiv.className = "answer";

      // Creat Radio input
      let radioInput = document.createElement("input");

      // Add type + name + id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      //   Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Crear Label
      let theLabel = document.createElement("label");

      // Add for Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Creat Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text to label
      theLabel.appendChild(theLabelText);

      // Add input + Label to main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append all Divs To Answer Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good.`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is good.`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} `;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
