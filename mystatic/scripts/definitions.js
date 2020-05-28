import * as base from './base.js';

$(document).ready(function() {


    $('.edit-dict').click((e) => {
        var dictContainer = e.target.parentElement.parentElement.parentElement;
        toggleEditDict(dictContainer);
    })

    function toggleEditDict(dictContainer) {
        var dictHeader = $(dictContainer).find('.dict-header')
        var aboutDict = $(dictHeader).children().first();
        var span = $(aboutDict).children().first();

        if ($(span).is('span'))
            base.replaceToInput(span);
        else
            base.replaceToSpan(span);

        var saveEditedBtn = $(dictHeader).find('.save-edited-dict');

        $(saveEditedBtn).toggle();
    }

    $('.save-edited-dict').click((e) => {
        var dictHeader = e.target.parentElement.parentElement;
        var dictContainer = dictHeader.parentElement;
        var dictSlug = dictContainer.id;

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
    })

    function addNewWord(wordCreateForm) {
        var value = $(wordCreateForm).find('[name=value]').val();

        var wordsList = wordCreateForm.parentElement;
        var dictionaryContainer = wordsList.parentElement;
        var dictionary_slug = dictionaryContainer.id;

        var data = {};

        if (wordCreateForm.classList.contains('form-manually')) {
            var definition = $(wordCreateForm).find('[name=definition]').val();

            data = {
                'value': value,
                'definition': definition,
                'dictionary_slug': dictionary_slug,
            };

        } else if (wordCreateForm.classList.contains('form-auto')) {
            var selectLang = $($(wordCreateForm).children().first()).find('select.definition-lang');
            var lang = $($(selectLang).find('option:selected')).attr('name');

            data = {
                'value': value,
                'dictionary_slug': dictionary_slug,
                'lang': lang,
            };
        }

        $.ajax({
            type: 'POST',
            url: 'create_word',
            data: data,
            success: (data) => {
                addNewWordToWordsList(value, data, wordCreateForm)
            },
            complete: () => {
                base.closeCreateWordForm(wordCreateForm);
            },
        });
    }

    function addNewWordToWordsList(value, data, wordCreateForm) {
        var openFormBtn = $(wordCreateForm.parentElement).find('.open-form-btn');
        var newWordContainer = createWordContainer(data['word_slug'], value, data['definition']);
        $(openFormBtn).before(newWordContainer);
        $(wordCreateForm).hide();
   }

    function createWordContainer(wordSlug, value, definition) {
        var newWordContainer = document.createElement('div');
        newWordContainer.setAttribute('class', 'word-container');
        newWordContainer.id = wordSlug;

        var newWordField = createWordField(value, definition);
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

    function createWordField(value, definition) {
        var newWordField = document.createElement('div');
        newWordField.setAttribute('class', 'word-field')        ;

        var valueSpan = document.createElement('span');
        valueSpan.innerHTML = value;

        var br = document.createElement('br');

        var definitionSpan = document.createElement('span');
        definitionSpan.innerHTML = definition;

        newWordField.appendChild(valueSpan);
        newWordField.appendChild(br);
        newWordField.appendChild(definitionSpan);

        return newWordField;
    }

    function createEditWordField() {
        var newEditWordField = document.createElement('div');
        newEditWordField.setAttribute('class', 'edit-word-field');

        var deleteImg = document.createElement('img');
        deleteImg.setAttribute('class', 'delete-word');
        deleteImg.setAttribute('src', '../../static/images/delete.svg');

        $(deleteImg).click((e) => {
            super.deleteWord(newEditWordField);
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

    $('.edit-word').click((e) => {
        var editWordField = e.target.parentElement;
        var wordField = $(editWordField.parentElement).find('.word-field')[0];

        if ($(wordField).hasClass('edit')) {
            base.toggleEditWordField(wordField);
            $(wordField).removeClass('edit');
        } else {
            $(wordField).toggleClass('edit');
            editWord(editWordField);
        }
    });

    function editWord(editWordField) {
        var wordContainer = editWordField.parentElement;
        var wordField = $(wordContainer).find('.word-field');

        base.replaceAllToInput(wordField);

        var saveEditedBtn = $(editWordField).find('.save-edited');
        $(saveEditedBtn).show();

        $(saveEditedBtn).one('click', (e) => {
            e.stopPropagation();
            prepareToEdit(editWordField);
            $(saveEditedBtn).hide();
        })
    }

    function prepareToEdit(editWordField) {
        var wordContainer = editWordField.parentElement;
        var wordField = $(wordContainer).find('.word-field');

        var wordSlug = wordContainer.id;
        var newValue = $(wordField).children().eq(0).val();
        var newDefinition = $(wordField).children().eq(2).val();

        saveEditedWord(wordSlug, newValue, newDefinition);

        base.toggleEditWordField(wordField);
    }

    function saveEditedWord(wordSlug, newValue, newDefinition) {
        $.ajax({
            type: 'POST',
            url: 'edit_word',
            data: {
                'word_slug': wordSlug,
                'new_value': newValue,
                'new_definition': newDefinition,
            },
            success: (data) => {},
        });
    }

    $('.switch').on('change', (e) => {
        var formManually = $(e.target.parentElement.parentElement.parentElement).find('.form-manually');
        var formAuto = $(e.target.parentElement.parentElement.parentElement).find('.form-auto');
        $(formManually).toggle();
        $(formAuto).toggle();
    })

})