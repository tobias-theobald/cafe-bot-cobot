// IMPORTANT SETTINGS

var vat = {
    regular: 19.0,
    reduced: 7.0
};

var gapiKey = "REPLACE ME";
var googleSheetId = "REPLACE ME";

var currency = '€';

// LESS IMPORTANT SETTINGS

var googleSheetApiBase = "https://sheets.googleapis.com/v4/spreadsheets";
var googleSheetApiFull = googleSheetApiBase + "/" + googleSheetId + "/values/A2:C1000?key=" + gapiKey;

// CODE

function price(number) {
    return (Math.round(number * 100) / 100).toFixed(2);
}
var subdomain = window.cobot.subdomain;
var membershipId;
var client = Cobot.Api(window.cobot.access_token);
var storage = Cobot.Storage(window.cobot.storage_token);
client.get('www', '/user').then(function(user) {
    console.log('loaded user', user);
    membershipId = user.memberships.filter(function(membership) {return membership.space_subdomain === subdomain})[0].id;
});
var $tableBody = $('#products-tbody');
$.ajax({
    url: googleSheetApiFull,
    success: pricesLoaded,
    error: priceLoadingError,
    dataType: "json"
});
function pricesLoaded(data) {
    console.log('Loaded products', data);
    $tableBody.html('');
    data.values.forEach(function(row) {
        if (row.length === 0) {
            return renderProduct(null);
        }
        var product = {
            name: row[0],
            vat: row[1],
            endPrice: 0
        };
        if (row[2] !== "") {
            try {
                product.endPrice = parseFloat(row[2]);
            } catch (e) {
                //nop
            }
        }
        renderProduct(product);
    });
    Cobot.iframeResize();
}
function priceLoadingError(err) {
    console.error(err);
    var $row = $('<tr/>');
    $row.append($('<td colspan="5">').text('Error fetching prices ' + err.toString() + '. Please ask the team for assistance!'));
    $tableBody.append($row);
    Cobot.iframeResize();
}
function renderProduct(product) {
    var $row = $('<tr/>');
    if (product === null) {
        // separator
        $row.append($('<td class="separator" colspan="5">'));
    } else if (product.endPrice === 0) {
        $row.append($('<td class="product-name">').text(product.name));
        $row.append($('<td>').text('Free'));
        $row.append($('<td>').text('-'));
        $row.append($('<td>').text('Free'));
        $row.append($('<td>'));
    } else {
        $row.append($('<td class="product-name">').text(product.name));
        $row.append($('<td>').text(price(1 / (1 + vat[product.vat] / 100) * product.endPrice) + '\xa0' + currency));
        $row.append($('<td>').text(price(vat[product.vat]) + '\xa0%'));
        $row.append($('<td>').text(price(product.endPrice) + '\xa0' + currency));
        var $buyButton = $('<button>').text('Buy').click(function() {buy(product)});
        $row.append($('<td>').append($buyButton));
    }
    $tableBody.append($row);
}
function buy(product) {
    var opts = {
        tax_rate: '' + vat[product.vat],
        description: typeof product.name === 'object' ? product.name[language] : product.name,
        amount: 1 / (1 + vat[product.vat] / 100) * product.endPrice,
    };
    if (!confirm('You will be charged ' + price(product.endPrice) + ' ' + currency + ' (incl. ' + price(vat[product.vat]) + ' % VAT) for ' + product.name +'.')) {
        return;
    }
    client.post(subdomain, '/memberships/' + membershipId + '/charges', opts)
            .then(function(retVal) {
                console.log('Charge added', retVal);
                setMessage(opts.description + ' has been added to your invoice. Thanks 🙂');
            }, function(xhr) {
                var message = xhr.responseJSON.error ||
                        (xhr.responseJSON.errors || []).join(', ') ||
                        "There has been an error. Please contact support."
                console.error(message);
                setMessage(message, true);
            })
}
function setMessage(message, bad) {
    $('#message').text(message).css('color', bad ? 'red' : 'black');
}
