import * as base from './base.js';

$(document).ready(function() {

    /******************* Add new Word ******************/

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

        var selectColorBlock = $(wordCreateForm).find(".color-select");
        var selectedColorBlock = $(selectColorBlock).find(".color-block.selected");

        var color = $(selectedColorBlock).attr('name');

        if (color === undefined)
            color = ''

        var data = null;
        if (wordCreateForm.classList.contains('form-manually')) {
            var transcription = $(wordCreateForm).find('[name=transcription]').val();
            var translation = $(wordCreateForm).find('[name=translation]').val();

            data = {
                'value': value,
                'transcription': transcription,
                'translation': translation,
                'dictionary_slug': dictionary_slug,
                'color': color,
            };

        } else if (wordCreateForm.classList.contains('form-auto')) {
            var selectLangFrom = $($(wordCreateForm).children().first()).find('select.lang-from');
            var selectLangTo = $($(wordCreateForm).children().first()).find('select.lang-to');

            var langFrom = $($(selectLangFrom).find('option:selected')).attr('name');
            var langTo = $($(selectLangTo).find('option:selected')).attr('name');

            data = {
                'value': value,
                'dictionary_slug': dictionary_slug,
                'lang_from': langFrom,
                'lang_to': langTo,
                'color': color,
            };
        }

        $.ajax({
            type: 'POST',
            url: 'create_word',
            data: data,
            success: (data) => {
                addNewWordToWordsList(value, data, wordCreateForm);
            },
            complete: () => {
                base.closeCreateWordForm(wordCreateForm);
            }
        });
    }


   function addNewWordToWordsList(value, data, wordCreateForm) {
        var openFormBtn = $(wordCreateForm.parentElement).find('.open-form-btn');
        var newWordContainer = createWordContainer(data['word_slug'], value, data['transcription'], data['translation']);
        newWordContainer.style.backgroundColor = data['color'];
        $(openFormBtn).before(newWordContainer);
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

        $(deleteImg).one('click', (e) => {
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



    /******************** Edit dict **********************/

    $('.edit-dict').click((e) => {
        var dictContainer = e.target.parentElement.parentElement.parentElement;
        toggleEditDict(dictContainer);
    })

    function toggleEditDict(dictContainer) {
        var dictHeader = $(dictContainer).find('.dict-header')
        var el = $(dictHeader).children().first();

        for (var child of $(el).children()) {
            if ($(child).is('span'))
                base.replaceToInput(child);
            else
                base.replaceToSpan(child);
        }
        var saveEditedBtn = $(dictHeader).find('.save-edited-dict');

        $(saveEditedBtn).toggle();
    }

    $('.save-edited-dict').click((e) => {
        var dictHeader = e.target.parentElement.parentElement;
        var dictContainer = dictHeader.parentElement;
        var dictSlug = dictContainer.id;

        var newTitle = $(dictHeader).find('input').first().val();
        var newLang = $(dictHeader).find('input').last().val();

        if (newTitle != newLang)
            saveEditedDict(dictSlug, newTitle, newLang);
        else
            saveEditedDict(dictSlug, newTitle);

        toggleEditDict(dictContainer);
    })

    function saveEditedDict(dictSlug, newTitle, newLang=null) {
        $.ajax({
            type: 'POST',
            url: 'edit_dict',
            data: {
                'dict_slug': dictSlug,
                'new_title': newTitle,
                'new_language': newLang,
            },
            success: (data) => {
            },
        })
    }


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

    /************************ Edit word ************************/

   $('.edit-word').on('click', (e) => {
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

        var colorSelect = $(wordContainer).find('.color-select');
        $(colorSelect).show();

        $(saveEditedBtn).one('click', (e) => {
            e.stopPropagation();
            prepareToEdit(editWordField);
            $(saveEditedBtn).hide();
            var colorSelect = $(wordContainer).find('.color-select');
            $(colorSelect).hide();
        })
    }

    function prepareToEdit(editWordField) {
        var wordContainer = editWordField.parentElement;
        var wordField = $(wordContainer).find('.word-field');

        var wordSlug = wordContainer.id;
        var newValue = $(wordField).children().eq(0).val();
        var newTranscription = $(wordField).children().eq(1).val();
        var newTranslation = $(wordField).children().eq(2).val();

        var newColor = $(editWordField).find(".color-select").find('.color-block.selected').attr('name');

        if (newColor === undefined)
            newColor = ''

        saveEditedWord(wordSlug, newValue, newTranscription, newTranslation, newColor);

        wordContainer.style.backgroundColor = newColor;

        base.toggleEditWordField(wordField);
    }


    function saveEditedWord(wordSlug, newValue, newTranscription, newTranslation, newColor) {
        $.ajax({
            type: 'POST',
            url: 'edit_word',
            data: {
                'word_slug': wordSlug,
                'new_value': newValue,
                'new_transcription': newTranscription,
                'new_translation': newTranslation,
                'new_color': newColor,
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

});