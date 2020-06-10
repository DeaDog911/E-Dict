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
        $($(editWordField).find('.save-edited')).hide();
        try {
            wordField.style.borderBottom = '1px solid grey';
        } catch {
            $(wordField).css('border-bottom: 1px solid grey');
        }
        replaceAllToSpan(wordField);
        var colorSelect = $(wordContainer).find('.color-select');
        $(colorSelect).hide();
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

export function closeCreateWordForm(wordCreateForm) {
    $(wordCreateForm).hide();
    var parent = wordCreateForm.parentElement;
    var toggleBox = $(parent).find('.toggleBox');
    $(toggleBox).hide();
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
        $('#create-dict-form').toggle();
    });

    $('.dict-header').click((e) => {
        var container = e.target.parentElement;
        var wordList = $(container).find('.words-list');
        $(wordList).toggle();
    });

    $('.open-form-btn').click((e) => {
        var parent = e.target.parentElement;
        var wordCreateForm = $(parent).find('.form-auto');
        $(wordCreateForm).toggle();
        var toggleBox = $(parent).find('.toggleBox');
        $(toggleBox).toggle();
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

    $('input,span').click((e) => {
        e.stopPropagation();
    })

    $('.profile-information').click((e) => {
        $('.profile-information-block').toggle();
    })

    /**************** Select Color ********************/
    $('.color-block').click((e) => {
        var colorBlock = e.target;
        var colorSelectBlock = colorBlock.parentElement;

        for (var color of $(colorSelectBlock).find(".color-block")) {
            $(color).removeClass('selected');
        }
        $(colorBlock).addClass('selected');
    });

})