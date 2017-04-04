// -----------------------------------------------
// -----------------------------------------------
// Data access layer
// -----------------------------------------------
// -----------------------------------------------
function DataAccess() {
    var self = this;

    /** @private */
    var getLog = function(callback) {
        chrome.storage.local.get(function(data) {
            callback(data.log);
        });
    };

    /** @private */
    var getAllWorkingTimeInPrivate = function(callback) {
        chrome.storage.local.get(function(data) {
            callback(data.workingTime);
        });
    };


    /** @private */
    var setWorkingTimeInPrivate = function(year, month, day, checkin, checkout) {
      var id = (new Date(year, month, day)).getTime();
      getAllWorkingTimeInPrivate(function(data) {
          if (!data) {
              var newData = {};
              var obj = {
                  checkin: checkin,
                  checkout: checkout
              };
              newData[id] = obj;
              chrome.storage.local.set({
                  'workingTime': newData
              }, function() {
                  console.log('Create Working Time successful!');
                  console.log(newData[id]);
              });
          } else {
              if (!data[id]) {
                  var obj = {
                      checkin: checkin,
                      checkout: checkout
                  };
                  data[id] = obj;
                  chrome.storage.local.set({
                      'workingTime': data
                  }, function() {
                      console.log('Working Time saved!');
                      console.log(data[id]);
                  });
              }
          }
      });
    };

    /** @private */
    var editWorkingTimeInPrivate = function(year, month, day, checkin, checkout) {
      var id = (new Date(year, month, day)).getTime();
      getAllWorkingTimeInPrivate(function(data) {
          if (!data) {
              var newData = {};
              var obj = {
                  checkin: checkin,
                  checkout: checkout
              };
              newData[id] = obj;
              chrome.storage.local.set({
                  'workingTime': newData
              }, function() {
                  console.log('Create Working Time successful!');
                  console.log(newData[id]);
              });
          } else {
              if (!data[id]) {
                  var obj = {
                      checkin: checkin,
                      checkout: checkout
                  };
                  data[id] = obj;
                  chrome.storage.local.set({
                      'workingTime': data
                  }, function() {
                      console.log('Working Time saved!');
                      console.log(data[id]);
                  });
              }
          }
      });
    };


    /** @private */
    var initialWorkingTime = function() {
        var now = new Date();
        var id = (new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime();
        getAllWorkingTimeInPrivate(function(data) {
            if (!data) {
                var newData = {};
                var obj = {
                    checkin: "08:00",
                    checkout: "17:30"
                };
                newData[id] = obj;
                chrome.storage.local.set({
                    'workingTime': newData
                }, function() {
                    console.log('Working Time saved!');
                    console.log(data);
                });
            } else {
                if (!data[id]) {
                    var obj = {
                        checkin: "08:00",
                        checkout: "17:30"
                    };
                    data[id] = obj;
                    chrome.storage.local.set({
                        'workingTime': data
                    }, function() {
                        console.log('Working Time saved!');
                        console.log(data);
                    });
                }
            }
        });
    };

    /** @public */
    this.getAllWorkingTime = function(callback) {
        getAllWorkingTimeInPrivate(function(data) {
            callback(data);
        });
    };

    /** @public */
    this.getWorkingTime = function(year, month, date, callback) {
        getAllWorkingTimeInPrivate(function(data) {
            var id = (new Date(year, month, date)).getTime();
            var result = data[id];
            callback(result);
        });
    };

    /** @public */
    this.addWorkingTime = function(year, month, date, from, to) {
        setWorkingTimeInPrivate(year, month, date, from, to);
    };

    initialWorkingTime();
};
