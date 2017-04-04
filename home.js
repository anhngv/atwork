document.addEventListener('DOMContentLoaded', function() {

    chrome.bookmarks.getTree(getBookmarks);

    showWorkingTime();

    editor = new MediumEditor('#editor', {
        placeholder: '',
        buttons: [
            'header1',
            'header2',
            'normal',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'anchor',
            'orderedlist',
            'unorderedlist'
        ],
        cleanPastedHTML: true
    });

    getLogData(function(logData) {
        $('#editor').html(logData);
        window.setInterval(syncLogData, 1000);
    });

    var dataAccess = new DataAccess();
    dataAccess.getWorkingTime(2017, 2, 24, function(data) {
        console.log(data);
    });
});

var getBookmarks = function(array) {
    if (array.length > 0) {
        printUrl(array[0]);
    }
};

var printUrl = function(bookmarkItem) {
    if (bookmarkItem.url) {
        if (bookmarkItem.url.indexOf("http") == 0) {
            var stringArr = [];
            stringArr.push('<tr>');
            stringArr.push('<td><a href="' + bookmarkItem.url + '">' + bookmarkItem.title + '</a></td>');
            stringArr.push('<td><span class="label label-success">AH</span></td>');
            stringArr.push('</tr>');
            $('#lstLink').append(stringArr.join(''));
        }
    } else {
        if (bookmarkItem.children) {
            for (var i = 0; i < bookmarkItem.children.length; i++) {
                printUrl(bookmarkItem.children[i]);
            }
        }
    }
}

var showWorkingTime = function() {
    var dataAccess = new DataAccess();
    dataAccess.getAllWorkingTime(function(data) {
        console.log(data);
        var now = new Date();
        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();
        var dayInCurrentMonth = [];
        while (true) {
            var tmpDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            dayInCurrentMonth.push(tmpDate.getTime());
            now.setDate(now.getDate() - 1);
            if (currentDate < 15) {
                if (now.getMonth() == currentMonth - 1 && now.getDate() == 15) {
                    break;
                }
            } else {
                if (now.getDate() == 15) {
                    break;
                }
            }
        }
        console.log(dayInCurrentMonth);
        for (var i = 0; i < dayInCurrentMonth.length; i++) {
            var stringArr = [];
            //var tmpTime = new Date(dayInCurrentMonth[dayInCurrentMonth.length - i - 1]);
            var tmpTime = new Date(dayInCurrentMonth[i]);
            var tmpYear = tmpTime.getFullYear()
            var tmpMonth = tmpTime.getMonth() + 1;
            var tmpDate = tmpTime.getDate();
            var tmpDay = tmpTime.getDay();

            var currentData = data[dayInCurrentMonth[i]];
            if (currentData) {
                stringArr.push('<tr>');
                stringArr.push('<td>' + tmpDate + '/' + tmpMonth + '</td>');
                stringArr.push('<td class="check-in" date="' + dayInCurrentMonth[i] + '"><span>' + currentData.checkin + '</span><input type="text" class="form-control" value="' + currentData.checkin + '"></td>');
                stringArr.push('<td class="check-out" date="' + dayInCurrentMonth[i] + '"><span>' + currentData.checkout + '</span><input type="text" class="form-control" value="' + currentData.checkout + '"></td>');
                var tmpRes = calculateTimeInDay(currentData.checkin, currentData.checkout);
                if (tmpRes => 0) {
                    stringArr.push('<td><span class="label label-success sumItem">' + tmpRes + '</span></td>');
                } else {
                    stringArr.push('<td><span class="label label-danger subItem">' + (tmpRes * (-1)) + '</span></td>');
                }
                stringArr.push('</tr>');
            } else {
                if (tmpDay == 0 || tmpDay == 6) {
                    stringArr.push('<tr class="weekend text-muted">');
                    stringArr.push('<td>' + tmpDate + '/' + tmpMonth + '</td>');
                    stringArr.push('<td class="check-in"><span>-----</span><input type="text" class="form-control" value="08:30"></td>');
                    stringArr.push('<td class="check-out"><span>-----</span><input type="text" class="form-control" value="08:30"></td>');
                    stringArr.push('<td></td>');
                    stringArr.push('</tr>');
                } else {
                    stringArr.push('<tr>');
                    stringArr.push('<td>' + tmpDate + '/' + tmpMonth + '</td>');
                    stringArr.push('<td class="check-in" date="' + dayInCurrentMonth[i] + '"><span>08:00</span><input type="text" class="form-control" value="08:00"></td>');
                    stringArr.push('<td class="check-out" date="' + dayInCurrentMonth[i] + '"><span>17:30</span><input type="text" class="form-control" value="17:30"></td>');
                    stringArr.push('<td><span class="label label-success sumItem">0</span></td>');
                    stringArr.push('</tr>');
                }
            }
            $('#lstWorkingTime').append(stringArr.join(''));
        }
    });
};

$(document).on('click', '.check-in', function() {
    $(this).addClass("edited");
    $(this).children('input').val($(this).children('span').text()).focus();
});

$(document).on('click', '.check-out', function() {
    $(this).addClass("edited");
    $(this).children('input').val($(this).children('span').text()).focus();
});

$(document).on('blur', '.check-in input', function() {
    var parent = $(this).parents('.check-in');
    $(parent).removeClass("edited");
    $(parent).children('span').text($(this).val());
});

$(document).on('blur', '.check-out input', function() {
    var parent = $(this).parents('.check-out');
    $(parent).removeClass("edited");
    $(parent).children('span').text($(this).val());
});

// $(document).on('mouseleave', '.check-in', function(){
//    $(this).toggleClass( "edited" );
//    $(this).children('span').text($(this).children('input').val());
// });
//
// $(document).on('mouseleave', '.check-out', function(){
//    $(this).toggleClass( "edited" );
//    $(this).children('span').text($(this).children('input').val());
// });


// $('#menucontainer').click(function(event){
//   event.stopPropagation();
// });

var syncLogData = function() {
    var data = $('#editor').html();
    if (!data) {
        console.log('Error: No value specified');
        return;
    }
    chrome.storage.local.set({
        'logData': data
    }, function() {
        // console.log('Settings saved');
    });
};

var getLogData = function(callback) {
    chrome.storage.local.get(function(data) {
        callback(data.logData);
    });
};

var calculateTimeInDay = function(checkinTime, checkoutTime) {
    console.log(checkinTime);
    console.log(checkoutTime);
    var workTime = new WorkingTime(null, checkinTime, checkoutTime);
    var result = workTime.getDisparityTime();
    return result;
};
