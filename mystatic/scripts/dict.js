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


    $('.open-form-btn').click((e) => {
        var parent = e.target.parentElement;
        var wordCreateForm = $(parent).find('form');
        $(wordCreateForm).toggle();
    });

    $('.dict-header').click((e) => {
        var container = e.target.parentElement;
        var wordList = $(container).find('.words-list');
        $(wordList).toggle();
    });

    $('#open-create-dict-form').click((e) => {
        $('#create-dict-form').toggle();
    });


    $('.delete-dict').click((e) => {
        deleteDict(e.target.parentElement.parentElement.parentElement);
    })

    function deleteDict(dict) {
        var dictSlug = dict.id;
        $.ajax({
            type: 'POST',
            url: 'delete_dict',
            data: {
                'dict_slug': dictSlug,
            },
            success: (data) => {
                var dictList = dict.parentElement;
                dictList.removeChild(dict);
            },
        });
    }

    $('.edit-dict').click((e) => {
        var dictContainer = e.target.parentElement.parentElement.parentElement;
        toggleEditDict(dictContainer);
    })

    function toggleEditDict(dictContainer) {
        var dictHeader = $(dictContainer).find('.dict-header')
        var el = $(dictHeader).children().first();

        if ($(el).is('span'))
            replaceToInput(el);
        else
            replaceToSpan(el);

        var saveEditedBtn = $(dictHeader).find('.save-edited-dict');

        $(saveEditedBtn).toggle();
    }

    $('.save-edited-dict').click((e) => {
        var dictHeader = e.target.parentElement.parentElement;
        var dictContainer = dictHeader.parentElement;
        var dictSlug = dictContainer.id;
        console.log()
        var newTitle = $(dictHeader).find('input').val();
        saveEditedDict(dictSlug, newTitle);
        toggleEditDict(dictContainer);
    })

    function saveEditedDict(dictSlug, newTitle) {
        $.ajax({
            type: 'POST',
            url: 'edit_dict',
            data: {
                'dict_slug': dictSlug,
                'new_title': newTitle,
            },
            success: (data) => {
            },
        })
    }

    $('.add-word-btn').click((e) => {
        e.preventDefault();
        var wordCreateForm = e.target.parentElement;
        addNewWord(wordCreateForm);
    });

    function addNewWord(wordCreateForm) {
        var value = $(wordCreateForm).find('[name=value]').val();
        var transcription = $(wordCreateForm).find('[name=transcription]').val();
        var translation = $(wordCreateForm).find('[name=translation]').val();

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
                var openFormBtn = $(wordCreateForm.parentElement).find('.open-form-btn');
                var wordSlug = data;
                var newWordContainer = createWordContainer(wordSlug, value, transcription, translation)
                $(openFormBtn).before(newWordContainer);
                $(wordCreateForm).hide();
            },
        });
    }

    function createWordContainer(wordSlug, value, transcription, translation) {
        var newWordContainer = document.createElement('div');
        newWordContainer.setAttribute('class', 'word-container');
        newWordContainer.id = wordSlug;

        var newWordField = createWordField(value, transcription, translation);
        var newEditWordField = createEditWordField();
        newWordContainer.appendChild(newWordField);
        newWordContainer.appendChild(newEditWordField);

        $(newWordField).click((e) => {
            toggleEditWordField(newWordField);
        })

        var editImg = $(newEditWordField).find('.edit-word');
        var saveEditedBtn = $(newEditWordField).find('.save-edited');


        $(editImg).click((e) => {
            editWord(newEditWordField);
        })

        return newWordContainer;
    }

    function createWordField(value, transcription, translation) {
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

    function createEditWordField() {
        var newEditWordField = document.createElement('div');
        newEditWordField.setAttribute('class', 'edit-word-field');

        var deleteImg = document.createElement('img');
        deleteImg.setAttribute('class', 'delete-word');
        deleteImg.setAttribute('src', 'static/images/delete.svg');

        $(deleteImg).click((e) => {
            deleteWord(newEditWordField);
        })

        var editImg = document.createElement('img');
        editImg.setAttribute('class', 'edit-word');
        editImg.setAttribute('src', 'static/images/edit.svg');


        var saveEditedBtn = document.createElement('button');
        saveEditedBtn.setAttribute('class', 'btn btn-success save-edited');
        $(saveEditedBtn).text('Сохранить');
        $(saveEditedBtn).hide();


        newEditWordField.appendChild(deleteImg);
        newEditWordField.appendChild(editImg);
        newEditWordField.appendChild(saveEditedBtn);

        newEditWordField.style.display = 'none';

        return newEditWordField;
    }


    $(".word-field").click((e) => {
        var wordField = e.target;
        toggleEditWordField(wordField);
    });

    $('input').click((e) => {
        e.stopPropagation();
    })

    function toggleEditWordField(wordField) {

        var wordContainer = wordField.parentElement;
        var editWordField = $(wordContainer).find('.edit-word-field');

        if ($(editWordField).css('display') == 'none') {
            $(editWordField).show();
            try {
                wordField.style.borderBottom = 0;
            } catch(e) {
                $(wordField).css('border-bottom: 0');
            }
        }else {
            $(editWordField).hide();
            try {
                wordField.style.borderBottom = '1px solid grey';
            } catch {
                $(wordField).css('border-bottom: 1px solid grey');
            }
            replaceAllToSpan(wordField);
        }
    }


    $('.delete-word').click((e) => {
        var editWordField = e.target.parentElement;
        var wordContainer = editWordField.parentElement;
        deleteWord(editWordField);
    });

    function deleteWord(editWordField) {
        var wordContainer = editWordField.parentElement;
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
        editWord(editWordField);
    });

    function editWord(editWordField) {
        var wordContainer = editWordField.parentElement;
        var wordField = $(wordContainer).find('.word-field');

        replaceAllToInput(wordField);

        var saveEditedBtn = $(editWordField).find('.save-edited');
        $(saveEditedBtn).show();

        $(saveEditedBtn).click((e) => {
            prepareToEdit(editWordField);
            $(saveEditedBtn).hide();
        })
    }

    function prepareToEdit(editWordField) {
        var wordContainer = editWordField.parentElement;
        var wordField = $(wordContainer).find('.word-field');

        var wordSlug = wordContainer.id;
        var newValue = $(wordField).children().eq(0).val();
        var newTranscription = $(wordField).children().eq(1).val();
        var newTranslation = $(wordField).children().eq(2).val();

        saveEditedWord(wordSlug, newValue, newTranscription, newTranslation);

        toggleEditWordField(wordField);
    }

    function replaceAllToSpan(wordField) {
        for (var el of $(wordField).children()) {
            if ($(el).is('input'))
                replaceToSpan(el);
        }
    }

    function replaceToSpan(input) {
        var value = $(input).val();
        var span = document.createElement('span');
        $(span).text(value);
        $(input).replaceWith(span);
    }

    function replaceAllToInput(wordField) {
        for (var el of $(wordField).children()) {
            if ($(el).is('span'))
                replaceToInput(el);
        }
    }

    function replaceToInput(span) {
        var oldValue = $(span).text();
        var input = document.createElement('input');
        input.setAttribute('class', 'form-control');
        input.value = oldValue;
        $(input).click((e) => {
            e.stopPropagation();
        })
        $(span).replaceWith(input);
    }

    function saveEditedWord(wordSlug, newValue, newTranscription, newTranslation) {
        $.ajax({
            type: 'POST',
            url: 'edit_word',
            data: {
                'word_slug': wordSlug,
                'new_value': newValue,
                'new_transcription': newTranscription,
                'new_translation': newTranslation,
            },
            success: (data) => {},
        });
    }


});