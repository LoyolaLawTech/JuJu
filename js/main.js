$(document).ready(function (){
    $.getJSON('data/data.json', null)
        .done(function (data) {
            console.log('doo');
            $.each(data, function (index, prop){
                console.log(index + ' ' + prop.name);
                var item = '<button type="button" class="btn btn-default" data-toggle="button">' + prop.name + '</button>';
                $('div.btn-group-vertical').append(item);

            });
        })
        .fail(function (jqxhr, textStatus, error){
            console.log(textStatus + ' ' + error);
        });
});
