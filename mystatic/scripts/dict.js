import * as base from './base.js';

$(document).ready(function() {

     $('.add-word-btn').click((e) => {
        e.preventDefault();
        var wordCreateForm = e.target.parentElement;
        addNewWord(wordCreateForm);
    })


    $('.edit-dict').click((e) => {
        var dictContainer = e.target.parentElement.parentElement.parentElement;
        toggleEditDict(dictContainer);
    })

    function toggleEditDict(dictContainer) {
        var dictHeader = $(dictContainer).find('.dict-header')
        var el = $(dictHeader).children().first();

        if ($(el).is('span'))
            base.replaceToInput(el);
        else
            base.replaceToSpan(el);

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
            base.toggleEditWordField(newWordField);
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
        deleteImg.setAttribute('src', '../../static/images/delete.svg');

        $(deleteImg).click((e) => {
            base.deleteWord(newEditWordField);
        })

        var editImg = document.createElement('img');
        editImg.setAttribute('class', 'edit-word');
        editImg.setAttribute('src', '../../static/images/edit.svg');


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

        base.replaceAllToInput(wordField);

        var saveEditedBtn = $(editWordField).find('.save-edited');
        $(saveEditedBtn).show();

        $(saveEditedBtn).one('click', (e) => {
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

        base.toggleEditWordField(wordField);
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