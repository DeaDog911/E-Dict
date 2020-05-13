$(document).ready(function() {


    var csrftoken = $.cookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });


    $('#open-form-btn').click((e) => {
        var parent = e.target.parentElement;
        var wordCreateForm = $(parent).find('form');
        $(wordCreateForm).toggle();
    });

    $('.dict-container').click((e) => {
        var container = e.target;
        var wordList = $(container).find('.words-list');
        $(wordList).toggle();
    });

    $('#open-create-dict-form').click((e) => {
        $('#create-dict-form').toggle();
    });

    $('.add-word-btn').click((e) => {
        e.preventDefault();

        var wordCreateForm = e.target.parentElement;
        var value = $(wordCreateForm).find('#value').val();
        var transcription = $(wordCreateForm).find('#value').val();
        var translation = $(wordCreateForm).find('#translation').val();

        var wordsList = wordCreateForm.parentElement;
        var dictionaryContainer = wordsList.parentElement;
        var dictionary_slug = dictionaryContainer.id;

        $.ajax({
            type: 'POST',
            url: 'create_word',
            data: {
                'value': value,
                'transcription': transcription,
                'translation': translation,
                'dictionary_slug': dictionary_slug
            },
            success: (data) => {
                var openFormBtn = document.getElementById('open-form-btn');
                var newWordField = createWordField(value, transcription, translation)
                wordsList.insertBefore(newWordField, openFormBtn);
            },
        });
    });

    function createWordField(value, transcription,translation) {
        var newWordField = document.createElement('div');
        newWordField.setAttribute('class', 'word-field')        ;

        var valueSpan = document.createElement('span');
        valueSpan.innerHTML = value;

        var transcriptionSpan = document.createElement('span');
        transcriptionSpan.innerHTML = transcription;

        var translationSpan = document.createElement('span');
        translationSpan.innerHTML = translation;

        newWordField.appendChild(valueSpan);
        newWordField.appendChild(transcriptionSpan);
        newWordField.appendChild(translationSpan);

        return newWordField;
    }


    $(".word-field").click((e) => {
        var wordField = e.target;
        toggleEditWordField(wordField);
    });

    function toggleEditWordField(wordField) {
        var wordContainer = wordField.parentElement;
        var editWordField = $(wordContainer).find('.edit-word-field');

        if ($(editWordField).css('display') == 'none') {
            $(editWordField).show();
            wordField.style.borderBottom = 0;
        }else {
            $(editWordField).hide();
            wordField.style.borderBottom = '1px solid grey';
        }
    }


    $('.delete-word').click((e) => {
        var editWordField = e.target.parentElement;
        var wordContainer = editWordField.parentElement;
        deleteWord(wordContainer);
    });

    function deleteWord(wordContainer) {
        var wordSlug = wordContainer.id;
        $.ajax({
            type: 'POST',
            url: 'delete_word',
            data: {
                'word_slug': wordSlug,
            },
            success: (data) => {
                var wordsList = wordContainer.parentElement;
                wordsList.removeChild(wordContainer);
            },
        });
    }

    $('.edit-word').click((e) => {
        var editWordField = e.target.parentElement;
        var wordContainer = editWordField.parentElement;
        editWord(wordContainer);
    });

    function editWord(wordContainer) {

    }

});