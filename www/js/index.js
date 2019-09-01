let loopNumber = 1;

// Timers for duration of each slide
let timers = {
    one: 1,
    two: 1,
    three: 1
};

// API data
let eData;
let nData;
let iData;

// Intervals
let nInt;
let ntInt;
let eInt;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        //document.addEventListener('deviceready', app.onDeviceReady, false);

        //this.onDeviceReady();
        this.onOnline();
    },
    onDeviceReady: function() {
        // Check for network connection
        document.addEventListener("offline", app.onOffline, false);
        document.addEventListener("online", app.onOnline, false);
    },
    onOffline: function() {
        // Show message if no network is detected
        $("#offline").html("Internetanslutning saknas... ");
        document.addEventListener("online", app.onOnline, false);
    },
    onOnline: function() {
        // Run slider after 10sec
        // Make sure API data loads first
        setTimeout(function() {
            app.contentSlider(timers);
        }, 10000);

        // Get data from API
        app.getInformation();
        app.getEmployees();
        app.getNews();

        // Make new API call every 30min
        setInterval(function() {
            app.getInformation();
            app.getEmployees();
            app.getNews();
        }, 60 * 1000 * 30);
    },
    infoData: function(data) {
        iData = data;
    },
    empData: function(data) {
        eData = data;
    },
    newsData: function(data) {
        nData = data;
    },
    getInformation: function() {
        let url = "http://localhost:5000/templates/information";
        $.ajax({
            type: "GET",
            url: url,
            success: data => {
                // Set duration of slide
                timers.one = 20000;
                // Send data
                app.infoData(data);
            },
            error: err => {
                console.log(err);
            }
        });
    },
    showInfo: function(data) {
        // Get data fields
        let { infoName, infoFieldOne, infoFieldTwo } = data[0];

        // Update image
        $("#information-image").css(
            "background-image",
            "url('http://localhost:5000/uploads/" + data[0].infoImage + "')"
        );

        // Update DOM with data
        $("#info-name").html(infoName);
        $("#info-field-one").html(infoFieldOne);
        $("#info-field-two").html(infoFieldTwo);
    },
    getEmployees: function() {
        let url = "http://localhost:5000/templates/employeelist";
        $.ajax({
            type: "GET",
            url: url,
            success: data => {
                // Set duration of slide
                timers.two = 11000 * data.length;
                // Send data
                app.empData(data);
            },
            error: err => {
                console.log(err);
            }
        });
    },
    showEmployees: function(data) {
        let i = -1;
        // Animate and display employee content
        function animateEmployee() {
            // Change employee-data displayed
            if (i < data.length - 1) {
                i++;
            } else {
                i = 0;
            }
            // Style content
            let employeeLeft =
                "<h2>" + data[i].empName + "</h2>" + data[i].empDescription;
            let employeeRight =
                '<h2>Här finns jag</h2><p><span id="room">Rum: </span>' +
                data[i].empRoom +
                '<span><br><span id="phone">Telefon: </span>' +
                data[i].empPhoneNr +
                "</p>";

            // Write content to page
            $("#employee-left").animate({ opacity: 0 }, 1000, function() {
                $("#employee-left")
                    .html(employeeLeft)
                    .animate({ opacity: 1 }, 1000);
            });
            $("#employee-right").animate({ opacity: 0 }, 1000, function() {
                $("#employee-right")
                    .html(employeeRight)
                    .animate({ opacity: 1 }, 1000);
            });

            // Write image to page
            $("#employee-image").animate({ opacity: 0 }, 1000, function() {
                $("#employee-image")
                    .css(
                        "background-image",
                        "url('http://localhost:5000/uploads/" +
                            data[i].empImage +
                            "')"
                    )
                    .animate({ opacity: 1 }, 1000);
            });
        }

        // Run animation in intervals
        animateEmployee();
        eInt = setInterval(function() {
            animateEmployee();
        }, 11000);
    },
    getNews: function() {
        let url = "http://localhost:5000/templates/newslist";
        $.ajax({
            type: "GET",
            url: url,
            success: data => {
                // Set duration of slide
                timers.three = 10000 * data.length;
                app.newsData(data);
            },
            error: err => {
                console.log(err);
            }
        });
    },
    showNews: function(data) {
        // Sort through uploaded images
        let newsArr = data.filter(item => item.newsImage != "newsImage.png");

        // Send images to DOM
        if (newsArr.length) {
            let i = -1;
            // Change and animate images
            function animateNewsImage() {
                if (i < newsArr.length - 1) {
                    i++;
                } else {
                    i = 0;
                }

                $("#news-image").animate({ opacity: 0 }, 1000, function() {
                    $("#news-image")
                        .css(
                            "background-image",
                            "url('http://localhost:5000/uploads/" +
                                newsArr[i].newsImage +
                                "')"
                        )
                        .animate({ opacity: 1 }, 1000);
                });
            }
            // Run animation in intervals
            animateNewsImage();
            nInt = setInterval(function() {
                animateNewsImage();
            }, 10000);
        } else {
            let newsImages =
                '<div><img src="http://localhost:5000/uploads/noimage.png" alt=""></div>';
            $("#news-image-container").html(newsImages);
        }

        let i = -1;
        // Change and animate news
        function animateNews() {
            if (i < data.length - 1) {
                i++;
            } else {
                i = 0;
            }

            // Display news content
            let newsContent =
                "<h2>" + data[i].newsHeading + "</h2>" + data[i].newsText;
            $("#news-right").animate({ opacity: 0 }, 1000, function() {
                $("#news-right")
                    .html(newsContent)
                    .animate({ opacity: 1 }, 1000);
            });
        }
        // Run news animation in intervals
        animateNews();
        ntInt = setInterval(function() {
            animateNews();
        }, 10000);
    },
    contentSlider: function(timers) {
        if (loopNumber === 1) {
            // Show/hide active content
            $("#employees").css("display", "none");
            $("#news").css("display", "none");
            $("#information").css("display", "inline");

            // Clear news interval
            clearInterval(nInt);
            clearInterval(ntInt);

            // Display info
            app.showInfo(iData);

            // Set length of slide
            setTimeout(function() {
                loopNumber = 2;
                app.contentSlider(timers);
            }, timers.one);
        } else if (loopNumber === 2) {
            // Show/hide active content
            $("#employees").css("display", "inline");
            $("#news").css("display", "none");
            $("#information").css("display", "none");

            // Display Employees
            app.showEmployees(eData);

            // Set length of slide
            setTimeout(function() {
                loopNumber = 3;
                app.contentSlider(timers);
            }, timers.two);
        } else if (loopNumber === 3) {
            // Show/hide active content
            $("#employees").css("display", "none");
            $("#news").css("display", "inline");
            $("#information").css("display", "none");

            // Clear Employee interval
            clearInterval(eInt);

            // Display news
            app.showNews(nData);

            // Set length of slide
            setTimeout(function() {
                loopNumber = 1;
                app.contentSlider(timers);
            }, timers.three);
        }
    }
};
