var questionsForm = document.getElementById('questions-form');

for (var question of questionsForm.children) {
    if (question.classList.contains('question')) {
        if (question.getAttribute('data-word-slug') == questionsForm.children[1].getAttribute('data-word-slug')) {
            question.style.display = 'block';
        }
    }
}

$('.next').on('click', (e) => {
    var nextButton = e.target;

    var targetQuestion = nextButton.parentElement;
    var wordSlug = targetQuestion.getAttribute('data-word-slug');

    var questionsForm = document.getElementById('questions-form');
    var questions = questionsForm.children;

    if (targetQuestion.getAttribute('data-question-group') == 'choose') {
        targetQuestion.append(createAnswerInput(targetQuestion));
    }

    var nextQuestion = null;
    for (var i = 1; i < questions.length; i++) {
        if (questions[i].getAttribute('data-word-slug') == wordSlug) {
            nextQuestion = questions[i+1];
            if (i + 2 == questions.length || i == questions.length - 1) {
                nextToDone(questions, targetQuestion, i);
            }
        }
    }
    $(targetQuestion).hide();
    $(nextQuestion).show();

    if (!nextButton.classList.contains('done')) {
        e.preventDefault();
    }

});


function nextToDone(questions, targetQuestion, i) {
    var lastQuestion = null;
    if (i == questions.length - 1)
        lastQuestion = targetQuestion;
    else
        lastQuestion = questions[i+1];

    var lastNextBtn = $(lastQuestion).find(".next");
    $(lastNextBtn).text('Done');
    $(lastNextBtn).addClass('done');
    $(lastNextBtn).on('click', doneExam);
}


function createAnswerInput(targetQuestion) {
    var inputAnswer = document.createElement('input');
    inputAnswer.value = '';
    $(inputAnswer).hide();

    var options = $(targetQuestion).find(".options");

    for (var radio of $(options).find('input')) {
        if (radio.checked) {
            var value = $(radio).attr('data-value');
            inputAnswer.value = value;
        }
        inputAnswer.setAttribute('name', $(radio).attr('name'));
    }
    return inputAnswer;
}

function doneExam() {

}
