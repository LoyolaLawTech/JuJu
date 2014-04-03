function addVals(row) {

    var totalCost = 0,
    rowCost = 0,
    baseVal = row.find('button').data('amount'),
    multiplier = row.find('input').val(),
    rowTotal = row.find('span.row-total'),
    sectionTotal = row.closest('.panel-body').siblings('.panel-footer').find('.section-total');

    if (multiplier){
        rowTotal.html((baseVal * multiplier).toLocaleString('en-US', {style: 'currency', currency: 'USD'})).show();
    } else {
        rowTotal.html(baseVal.toLocaleString('en-US', {style: 'currency', currency: 'USD'})).show();
    }

    var rowTotals = row.closest('.panel-body').find('span.row-total');

    $.each(rowTotals, function() {
        var strip = $(this).html().replace(/\$/g, '');
        if (isNaN(strip)){
            totalCost = totalCost + parseFloat(strip.replace(/\,/g,''));
        }
    });
    sectionTotal.html(totalCost.toLocaleString('en-US', {style: 'currency', currency: 'USD'}));
}

function getDiff(){
    var total1 = $('.panel-footer:eq(0) .section-total').html().replace(/[$,]/g,''),
    total2 = $('.panel-footer:eq(1) .section-total').html().replace(/[$,]/g,''),
    comparisonText,
    difference;

    console.log(total1 + ' ' + total2);
    if (total1 > total2){
        difference = total1 - total2;
        comparisonText = 'more expensive than';
        console.log('total1 is ' + difference + ' ' +  comparisonText + 'total2' );
    } else {
        difference = total2 - total1;
        comparisonText = 'cheaper than';
        console.log('total1 is ' + difference + ' ' +  comparisonText + 'total2' );
    }
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
        $(this).closest('.row').find('input').show().change(function (e){
            addVals($(this).closest('.row'));
        });
    });

    $('.container').on('click','.no-interval', function (){
        addVals($(this).closest('.row'));
    });

    //User starts clicking on second sentencing choices
    $('.container').on('click','.panel-body:eq(1) button', function (){
        getDiff();
    });
});

