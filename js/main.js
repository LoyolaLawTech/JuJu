function addRow(row) {

    var totalCost = 0,
    rowCost = 0,
    baseVal = row.find('button').data('amount'),
    multiplier = row.find('input').val(),
    rowTotal = row.find('span.row-total');

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

$(document).ready(function (){
    $.getJSON('data/data.json', null)
        .done(function (data) {
            $.each(data, function (index, prop){
                var item;

                if (prop.interval === null){
                    item = '<div class="row"> <div class="col-xs-6"> <button type="button" class="btn btn-default no-interval" data-toggle="button" data-amount="' +
                    prop.cost + '">' + prop.name + '</button> </div> <div class="col-xs-4"> </div>' +
                    '<div class="col-xs2 hidden-xs"><span class="label label-default row-total "></span> </div></div>';

                } else {
                    item = '<div class="row"> <div class="col-xs-6"> <button type="button" class="btn btn-default has-interval" data-toggle="button" data-amount="' +
                    prop.cost + '">' + prop.name + '</button> </div> <div class="col-xs-4"> <input class="form-control is-interval" type="number" name="num_val" placeholder="' +
                    prop.interval + '"></div>' + '<div class="col-xs2 hidden-xs"><span class="label label-default row-total "></span> </div></div>';
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
            $(this).closest('.row').find('input').show().change(function (e){
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

