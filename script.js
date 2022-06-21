const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const startQuiz = $("#start-quiz-id");
const ruleQuiz = $(".rule-of-quiz");
const quitQuiz = $(".exit-quiz");
const continueQuiz = $(".button-rule__continue");
const boxQuestion = $(".question-quiz")
const questionBody = $(".question-quiz__body");
const numberPerTotal = $(".question-quiz__footer__total-question");
const nextQuesQuiz = $("#next-question");
const resultBox = $(".complete-question");
const innerResult = $(".complete-question__result");
const replayQuiz = $("#replay-quiz");
const outQuiz = $("#quit-quiz"); 
const countDownTime = $(".time-cooldown");
const TIME_REMAIN = 15;
const Number_Quiz_Default = 10;
let countInterval;
let questionsSource = [];
let indexCurrent = 0;
let numberCorrect = 0;
let numberTotalQues = 0;

let questions =[];
function toggleRuleModal(){
    ruleQuiz.classList.toggle("active");
}

function toggleStartQuizQuestion(){
    boxQuestion.classList.toggle("active");
}
function fnStartQuiz(){
    numberCorrect = 0;
    indexCurrent = 0;
    toggleRuleModal();
    toggleStartQuizQuestion();
    changeQuestion(indexCurrent);
   
    
}
function checkResult(index, indexOfChild)
{
    return questions[index].answer === questions[index].options[indexOfChild] ;
}
function handleOptionResult(index, indexOfChild){
    clearInterval(countInterval);
    let isRight = checkResult(index, indexOfChild);
    if (indexOfChild === -1){
        reChangeQuestion(index, false, questions[index].options.indexOf(questions[index].answer), indexOfChild);
        return;
    }
    let indexRightQuestion = indexOfChild;
    if (!isRight){
        indexRightQuestion = questions[index].options.indexOf(questions[index].answer);
    }else {
        ++numberCorrect;
    }
    reChangeQuestion(index, isRight, indexRightQuestion, indexOfChild);
}
async function startCountDown(TIME_REMAIN){
    let count = TIME_REMAIN;
    return await new Promise(resolve=>{
        countInterval = setInterval(()=>{
            if (count === 0){
                console.log(count);
                clearInterval(countInterval);
                resolve(1);
            }
            countDownTime.innerHTML = count;
            count--;
        }, 1000)
    })

}
async function changeQuestion(indexCurrent){
    countDownTime.innerHTML = TIME_REMAIN;
    numberPerTotal.innerHTML = `${indexCurrent+1} of ${numberTotalQues} Questions`
    questionBody.innerHTML = 
    `<h1 class="question-quiz__body__question">${indexCurrent+1}. ${questions[indexCurrent].question}</h1>
    <ul class="question-quiz__body__list-answer">
        ${questions[indexCurrent].options.map((value, index)=> {
            return `<li class="qustion-quiz__body__item-answer active" onclick="handleOptionResult(${indexCurrent}, ${index})">
            <p>${value}</p>
            </li>`
        }).join("")}
    </ul>`
    let count = await startCountDown(TIME_REMAIN);
    let isAnswered = $(".question-quiz__body__list-answer.answered");
    if (count === 1 && !isAnswered){
        handleOptionResult(indexCurrent, -1)
    }
}
function reChangeQuestion(indexCurrent, isRight, indexOfChild, indexChoose){
   
    questionBody.innerHTML = 
    `<h1 class="question-quiz__body__question">${indexCurrent+1}. ${questions[indexCurrent].question}</h1>
    <ul class="question-quiz__body__list-answer answered">
        ${questions[indexCurrent].options.map((value, index)=> {
            let classResult = "";
            if (isRight && index === indexOfChild){
                classResult = "fa-solid fa-circle-check conrect";
            } else if (!isRight){
                if (!isRight && index !== indexOfChild){
                    classResult= "fa-solid fa-circle-xmark wrong"
                } else if(!isRight && index === indexOfChild) {
                    classResult = "fa-solid fa-circle-check conrect"
                }
            }
            return `<li class="qustion-quiz__body__item-answer ${index === indexChoose ? "actived" : ""}">
            <p>${value}</p>
            <i class="${classResult}"></i>
            </li>`
        }).join("")}
    </ul>`
}
function getData(){
    return fetch("https://1daicongtu.github.io/QuizJson/quiz.json")
    .then(res => res.json())
    .catch(err => []);
}
function getRandomQuestion(questions, numbers){
    let max = questions.length-1, min = 0;
    if (numbers >= questions.length ){
        return [...questions];
    }
    let newArray = [];
    while(newArray.length < numbers){
        let indexRandom = Math.floor(Math.random() * (max - min) + min);
        let isContains = newArray.filter((value)=>{return value.numb === questions[indexRandom].numb}).length !== 0;
        if (!isContains){
            newArray =  [...newArray, JSON.parse(JSON.stringify(questions[indexRandom]))];
        }
    }
    return newArray;
}
async function start(){
    questionsSource = await getData();
    numberTotalQues = Number_Quiz_Default;
    questions = getRandomQuestion(questionsSource, Number_Quiz_Default);
    startQuiz.addEventListener("click", toggleRuleModal);
    quitQuiz.addEventListener("click", toggleRuleModal);
    continueQuiz.addEventListener("click", fnStartQuiz);
    nextQuesQuiz.addEventListener("click", ()=>{
        clearInterval(countInterval);
        if (indexCurrent === numberTotalQues-1){
            toggleStartQuizQuestion();
            innerResult.innerHTML = (numberCorrect === numberPerTotal-1) ? `and sorry,` : `` + `You got only ${numberCorrect} out of ${numberTotalQues}`
            resultBox.classList.toggle("active");
        }
        let isAnswered = $(".question-quiz__body__list-answer.answered");
        
        if (isAnswered && indexCurrent < numberTotalQues-1){
            indexCurrent++;
            changeQuestion(indexCurrent);
        } else if (!isAnswered ){
            alert("Bạn phải trả lời trước khi chuyển câu!")
        }
    })
    replayQuiz.addEventListener("click", ()=>{
        resultBox.classList.toggle("active");
        toggleRuleModal();
        questions = getRandomQuestion(questionsSource, Number_Quiz_Default);
    });
    outQuiz.addEventListener("click", ()=>{
        numberCorrect = 0;
        indexCurrent = 0;
        resultBox.classList.toggle("active");
        questions = getRandomQuestion(questionsSource, Number_Quiz_Default);
    })
}

start();