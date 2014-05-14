function addRow(row) {

    var totalCost = 0,
    rowCost = 0,
    baseVal = row.find('button').data('amount'),
    defaultInverval = row.find('button').data('interval'),
    multiplier = row.find('input').val(),
    userInterval = row.find('select').val(),
    rowTotal = row.find('span.row-total');

    //First cook the amount from data down to per day
    if (defaultInverval !== 'days'){

        if (defaultInverval === 'years') {
            baseVal = baseVal / 365;
        }

        if (defaultInverval === 'months') {
            baseVal = baseVal / 30;
        }
    }

    //Cook user input down to days
    if (userInterval !== 'days'){
        if (userInterval === 'years'){
            multiplier = multiplier * 365;

        }

        if (userInterval === 'months'){
            multiplier = multiplier * 30;

        }

    }

    if (multiplier){
        rowTotal.html((baseVal * multiplier).toLocaleString('en-US', {style: 'currency', currency: 'USD'})).show();
    } else {
        rowTotal.html(baseVal.toLocaleString('en-US', {style: 'currency', currency: 'USD'})).show();
    }
}

function addColumn(panel) {
    var rowTotals = panel.find('span.row-total'),
    sectionTotal = panel.siblings('.panel-footer').find('.section-total'),
    totalCost = 0;

    $.each(rowTotals, function() {
        var strip = $(this).html().replace(/\$/g, '');
        if (isNaN(strip)){
            totalCost = totalCost + parseFloat(strip.replace(/\,/g,''));
        }
    });
    sectionTotal.html(totalCost.toLocaleString('en-US', {style: 'currency', currency: 'USD'}));
}

function clearRow(el) {

    el.removeClass('active');
    el.closest('.row').find('.row-total').html('');
    if (el.hasClass('has-interval')){
        el.closest('.row').find('input').val('').hide();
    }
}

function getDiff() {
    var total1 = parseFloat($('.panel-footer:eq(0) .section-total').html().replace(/[$,]/g,'')),
    total2 = parseFloat($('.panel-footer:eq(1) .section-total').html().replace(/[$,]/g,'')),
    comparisonText,
    difference;

    if (total1 > total2){
        difference = (total1 - total2).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        comparisonText = 'more expensive than';
    } else {
        difference = (total2 - total1).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        comparisonText = 'cheaper than';
    }

    $('.diff-amount').html(difference);
    $('.diff-comparison').html(comparisonText);
}

function sendEmail(){

    var subj = '?subject=JuJu Report';
    var body = 'Sentence 1\n=====================\n\n';
    var panel1Data = $('.panel-body:eq(0) .row');
    $.each(panel1Data, function () {
        var activeBtn = $(this).find('button');
        if (activeBtn.hasClass('active')){
            body += activeBtn.html();
            if (activeBtn.hasClass('has-interval')){
                body += '     ' + $(this).find('input').val() + ' ' +
                $(this).find('input').attr('placeholder');
            }
            body += '     ' + $(this).find('.row-total').html();
            body += '\n';
        }

    });

    body += '\nTotal:' + $('.panel-footer:eq(0)').find('.section-total').html() + '\n\n';

    body += 'Sentence 2\n=====================\n\n';
    var panel2Data = $('.panel-body:eq(1) .row');
    $.each(panel2Data, function () {
        var activeBtn = $(this).find('button');
        if (activeBtn.hasClass('active')){
            body += activeBtn.html();
            if (activeBtn.hasClass('has-interval')){
                body += '     ' + $(this).find('input').val() + ' ' +
                $(this).find('input').attr('placeholder');
            }
            body += '     ' + $(this).find('.row-total').html();
            body += '\n';
        }

    });

    body += '\nTotal:' + $('.panel-footer:eq(1)').find('.section-total').html() + '\n\n';
    body += 'Result\n=====================\n\n';
    body += $('.jumbotron h4').text().trim();
    location.href='mailto:' + subj + '&body=' + encodeURI(body);
}

$(document).ready(function (){
    $.getJSON('data/data.json', null)
        .done(function (data) {
            $.each(data, function (index, prop){
                var item;

                if (prop.interval === null){
                    item = '<div class="row"> <div class="col-sm-5"> <button type="button" class="btn btn-default no-interval" data-toggle="button" data-amount="' +
                    prop.cost + '">' + prop.name + '</button> </div> <div class="col-sm-5"> </div>' +
                    '<div class="col-sm-2 hidden-xs"><span class="label label-default row-total pull-right"></span> </div></div>';

                } else {
                    item = '<div class="row"> <div class="col-sm-5"> <button type="button" class="btn btn-default has-interval" data-toggle="button" data-amount="' +
                    prop.cost + '" data-interval="' + prop.interval  + '">' + prop.name + '</button> </div>' +
                    '<div class="col-sm-5"><form class="form-inline"> <div class="input-group time-combo">' +
                    '<div class="form-group"> <input type="number" class="form-control is-interval" name="num_val" placeholder="0"> </div>' +
                    '<div class="form-group"> <select class="form-control">' +
                    '<option value="years">Years</option> <option value="months">Months</option> <option value="days">Days</option> </select> </form></div> </div></div> '+
                    '<div class="col-sm-2 hidden-xs"><span class="label label-default row-total pull-right "></span> </div> </div>';
                }
                $('.panel-body').append(item);
            });
        })
        .fail(function (jqxhr, textStatus, error){
            console.log(textStatus + ' ' + error);
        });

    $('.container').on('click','.has-interval', function (){
        if ($(this).hasClass('active')){
            clearRow($(this));
            addColumn($(this).closest('.panel-body'));
        } else {
            $(this).closest('.row').find('.time-combo').show().bind('input', function (e){
                addRow($(this).closest('.row'));
                addColumn($(this).closest('.panel-body'));
            });
        }
    });

    $('.container').on('click','.no-interval', function (){
        if ($(this).hasClass('active')){
            clearRow($(this));
            addColumn($(this).closest('.panel-body'));
        } else {
            addRow($(this).closest('.row'));
            addColumn($(this).closest('.panel-body'));
        }
    });

    $('.panel-footer').on('DOMSubtreeModified','.section-total', function (){
        getDiff();
        //Don't reveal until we have data in panel 2 to compare
        if ($(this).closest('.panel-danger').length > 0){
            $('.jumbotron').removeClass('hidden');
        }
    });

});

//Utility buttons
$('.send-email').click(function (e) {
    sendEmail();
});

$('.redo').click(function (e) {
    location.reload();
});
