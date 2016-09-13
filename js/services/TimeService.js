angular
    .module('app')
    .service('TimeService', TimeService);

function TimeService() {
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
            weekdays[day] = UTC;
            UTC = new Date(UTC.getTime() + 86400000);
            dayInt == 6 ? dayInt = 0 : dayInt++;
        }
        return weekdays;
    }

    //given the day integer, returns the day of the week.
    var getDay = function(int) {
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

    this.allTimeFormats = function(hour, period, week, day) {
        var timeFormats = {};

        timeFormats['militaryTime'] = militaryTime(hour, period);
        timeFormats['UTC'] = week[day];
        timeFormats['UNIX'] = Math.floor(Date.parse(week[day])/1000);
        timeFormats['commonDate'] = dateParser(week[day]);

        return timeFormats;
    }

    // takes the hour and period and returns military time.
    var militaryTime = function(hour, period) {
        return period === "AM" ? parseInt(hour) : (parseInt(hour) + 12);
    }

    //takes UTC and returns 'YYYY-MM-DD' string. Need to do this to include the future time for trip as a new UTC.
    var dateParser = function(UTCdate) {
        var day = UTCdate.getDate();
        var month = UTCdate.getMonth();
        var year = UTCdate.getFullYear();
        day = day < 10 ? (0 + day) : day;
        return year + '-' + month + '-' + day;
    }

    //takes an object with coords for each waypoint and adds the appropriate time value to each waypoint.
    this.setWaypointTimes = function(response, markers, date, hour) {
        var duration = response['routes'][0]['legs'][0]['duration']['value'];
        var markerCount = Object.keys(markers).length;
        var markerTimeInterval = Math.floor(duration / markerCount);
        var timeInterval = markerTimeInterval;
        var adjustedTime = getWaypointUTCTime(timeInterval);
        var adjustedHour = adjustedTime[0] + hour;

        for (var marker in markers) {
            markers[marker].push(timeInterval);
            timeInterval += markerTimeInterval;
        }
        return markers;
    }

    //params are YYYY-MM-DD and military time, and interval in seconds.
    var getWaypointUTCTime = function(interval) {
        hourIncrements = 0;
        //interval in minutes, rounded down
        intervalTime = Math.floor(interval / 60);
        while (intervalTime > 60) {
            intervalTime -= 60;
            hourIncrements++;
        }
        return [hourIncrements, intervalTime];
    }
}
