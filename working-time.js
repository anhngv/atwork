// -----------------------------------------------
// -----------------------------------------------
// Working Time object to calculate time in a day
// -----------------------------------------------
// -----------------------------------------------
function WorkingTime(date, checkin, checkout) {

    var self = this;

    this.date = date;

    this.checkinTime = checkin;

    this.checkoutTime = checkout;

    this.validateInputTime = function(inputTime) {
        var spliter = inputTime.split(':');
        if (spliter.length == 2) {
            if (parseInt(spliter[0]) != "NaN" && parseInt(spliter[1]) != "NaN") {
                return true;
            }
        }
        return false;
    };

    this.calculateRealMorningTimeInMinute = function(checkInTime) {
        var spliter = checkInTime.split(':');
        var hour = parseInt(spliter[0]);
        var min = parseInt(spliter[1]);
        // Earliest is 07:30
        var totalMinInMorning = (12 - 7.5) * 60;
        var totalMinForLate = hour * 60 + min - 7.5 * 60;
        var totalMinForWork = totalMinInMorning - totalMinForLate;
        return parseInt(totalMinForWork);
    };

    this.calculateRealNightTimeInMinute = function(checkoutTime) {
        var spliter = checkoutTime.split(':');
        var hour = parseInt(spliter[0]);
        var min = parseInt(spliter[1]);
        // Latest is 24:00
        var totalMinInNight = (24 - 13) * 60;
        var totalMinForSoon = 24 * 60 - hour * 60 - min;
        var totalMinForWork = totalMinInNight - totalMinForSoon;
        return parseInt(totalMinForWork);
    };

    this.getMorningWorkingTime = function() {
        var realMorningTime = self.calculateRealMorningTimeInMinute(self.checkinTime);
        var case1 = self.calculateRealMorningTimeInMinute("07:30");
        var case2 = self.calculateRealMorningTimeInMinute("07:45");
        var case3 = self.calculateRealMorningTimeInMinute("08:00");
        var case4 = self.calculateRealMorningTimeInMinute("08:15");
        var case5 = self.calculateRealMorningTimeInMinute("08:30");
        var case6 = self.calculateRealMorningTimeInMinute("09:00");
        var case7 = self.calculateRealMorningTimeInMinute("10:00");
        var case8 = self.calculateRealMorningTimeInMinute("12:00");
        if (realMorningTime >= case1) {
            return case1;
        } else if (realMorningTime >= case2) {
            return case2;
        } else if (realMorningTime >= case3) {
            return case3;
        } else if (realMorningTime >= case4) {
            return case4;
        } else if (realMorningTime >= case5) {
            return case5;
        } else if (realMorningTime >= case6) {
            return case6;
        } else if (realMorningTime >= case7) {
            return case7;
        } else if (realMorningTime >= case8) {
            return case8;
        }
        return undefined;
    };

    this.getNightWorkingTime = function() {
        var realNightTime = self.calculateRealNightTimeInMinute(self.checkoutTime);
        var result = realNightTime - (realNightTime % 15);
        return result;
    };
};

WorkingTime.prototype.getRealWorkingTime = function() {
    if (this.validateInputTime(this.checkinTime) && this.validateInputTime(this.checkoutTime)) {
        var morningTime = this.getMorningWorkingTime();
        var nightTime = this.getNightWorkingTime();
        return morningTime + nightTime;
    } else {
        return undefined;
    }
};

WorkingTime.prototype.getDisparityTime = function() {
    var realTime = this.getRealWorkingTime();
    var standardTime = 8.5 * 60;
    return realTime - standardTime;
};
