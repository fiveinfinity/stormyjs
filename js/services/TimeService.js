angular
    .module('app')
    .service('TimeService', TimeService);

function TimeService() {
    //given the day integer, returns the day of the week.
    function getDay(int) {
        switch (int) {
            case 0:
                day = "Sunday";
                break;
            case 1:
                day = "Monday";
                break;
            case 2:
                day = "Tuesday";
                break;
            case 3:
                day = "Wednesday";
                break;
            case 4:
                day = "Thursday";
                break;
            case 5:
                day = "Friday";
                break;
            case 6:
                day = "Saturday";
        }
        return day;
    }

    // takes the hour and period and returns military time.
    function militaryTime(hour, period) {
        return period === "AM" ? parseInt(hour) : (parseInt(hour) + 12);
    }

    //takes UTC and returns 'YYYY-MM-DD' string. Need to do this to include the future time for trip as a new UTC.
    function dateParser(UTCdate) {
        var day = UTCdate.getDate();
        var month = UTCdate.getMonth();
        var year = UTCdate.getFullYear();
        day = day < 10 ? (0 + day) : day;
        return year + '-' + month + '-' + day;
    }

    // returns a hash with the weekday as the key, and the UTC date as the value.
    this.nextSevenDays = function() {
        var UTC = new Date(Date.now());
        var dayInt = UTC.getDay();
        var weekdays = {};
        var day = '';

        for (i = 0; i < 7; i++) {
            if (i === 0) {
                day = "Today";
            } else if (i === 1) {
                day = "Tomorrow";
            } else {
                day = getDay(dayInt);
            }
            weekdays[day] = [UTC, dayInt];
            UTC = new Date(UTC.getTime() + 86400000);
            dayInt == 6 ? dayInt = 0 : dayInt++;
        }
        return weekdays;
    }

    this.allTimeFormats = function(hour, period, week, day) {
        var timeFormats = {};

        timeFormats['militaryTime'] = militaryTime(hour, period);
        timeFormats['UTC'] = week[day][0];
        timeFormats['UNIX'] = Math.floor(Date.parse(week[day])/1000);
        timeFormats['commonDate'] = dateParser(week[day][0]);
        timeFormats['dayOfWeek'] = day;
        timeFormats['dayInt'] = week[day][1];

        return timeFormats;
    }

    this.getAccruedTripHours = function(interval) {
        hourIncrements = 0;
        while (interval > 60) {
            interval -= 60;
            hourIncrements++;
        }
        return hourIncrements;
    }
}
