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

        var wordContainer = wordCreateForm.parentElement;
        var dictionaryContainer = wordContainer.parentElement;
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
                console.log('OK');
            },
        });
    });

});