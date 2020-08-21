var stompClient = null;

function setConnected(connected) {

    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#messages").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/sms', function (sms) {
            showData(sms.body);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function showData(message) {
    $("#messages").append("<tr><td>" + message + "</td></tr>");
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();
    var form = document.getElementById('smsForm');
    var data = {};
    for (var i = 0, ii = form.length; i < ii -1; ++i) {
        var input = form[i];
        if (input.id) {
            data[input.id] = input.value;
        }
    }
    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/sms", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    return false;
}

$(function () {

    let form = document.getElementById('smsForm');
    if (form.attachEvent) {
        form.attachEvent("submit", processForm);

    } else {
        form.addEventListener("submit", processForm);
    }

        // collect the form data while iterating over the inputs

    });

    connect();
