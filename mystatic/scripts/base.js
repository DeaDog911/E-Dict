export function deleteWord(editWordField) {
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

export function toggleEditWordField(wordField) {

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

export function replaceAllToSpan(wordField) {
    for (var el of $(wordField).children()) {
        if ($(el).is('input'))
            replaceToSpan(el);
    }
}


export function replaceToSpan(input) {
    var value = $(input).val();
    var span = document.createElement('span');
    $(span).text(value);
    $(input).replaceWith(span);
}

export function replaceAllToInput(wordField) {
    for (var el of $(wordField).children()) {
        if ($(el).is('span'))
            replaceToInput(el);
    }
}

export function replaceToInput(span) {
    var oldValue = $(span).text();
    var input = document.createElement('input');
    input.setAttribute('class', 'form-control');
    input.value = oldValue;
    $(input).click((e) => {
        e.stopPropagation();
    })
    $(span).replaceWith(input);
}

$(document).ready(() => {

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


    $('#open-create-dict-form').click((e) => {
        console.log('hhhh');
        $('#create-dict-form').toggle();
    });

    $('.dict-header').click((e) => {
        var container = e.target.parentElement;
        var wordList = $(container).find('.words-list');
        $(wordList).toggle();
    });

    $('.open-form-btn').click((e) => {
        var parent = e.target.parentElement;
        var wordCreateForm = $(parent).find('form');
        $(wordCreateForm).toggle();
    });

    $('.delete-word').click((e) => {
        var editWordField = e.target.parentElement;
        var wordContainer = editWordField.parentElement;
        deleteWord(editWordField);
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

    $(".word-field").click((e) => {
        var wordField = e.target;
        toggleEditWordField(wordField);
    });

    $('input').click((e) => {
        e.stopPropagation();
    })



})