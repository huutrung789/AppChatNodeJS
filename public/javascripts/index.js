var socket = io();
// var moment = require('moment');

socket.on('connect', function (data) {
    console.log('Connected websocket');
    console.log(jQuery.deparam(window.location.search));
    var params = jQuery.deparam(window.location.search);

    if (!stringValidate(params.room) || !stringValidate(params.name)) {
        alert('Invalid name or room');
        window.location.href = '/';
    } else {
        socket.emit('join', params, function (err) {
            if (err) {
                alert(err);

            } else {

            }
        });
    }

});


var stringValidate = (param) => {
    return typeof param === 'string' && param.trim().length > 0;
};


socket.on('disconnect', function (data) {
    console.log('Disconnected');
});

socket.on('newMessage', function (message) {
    var formattedTimestamp = moment(message.createAt).format('MMM Do YYYY, h:mm:ss a');
    // console.log('New Message: ', message);
    // var li = jQuery('<li></li>');
    // li.text(`${formattedTimestamp} ${message.from}: ${message.text}`);
    // jQuery('#message').append(li);
    var template = jQuery('#template-message').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createAt: formattedTimestamp
    });
    jQuery('#message').append(html);
});

socket.on('createMessage', function (message) {
    console.log('createMessage', message);

});

socket.on('sendLocationMessage', function(message) {
    var formattedTimestamp = moment(message.createAt).format('MM Do YYYY, h:mm:ss a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Location</a>');
    a.attr('href', message.url);
    console.log(message.url);
    li.text(`${formattedTimestamp} ${message.from}: `);
    li.append(a);
    jQuery('#message').append(li);

});
// socket.emit('createMessage', {to: 'trung2@gmail.com', text: 'new comer'}, function (message) {
//     console.log('Sent: ', message);
// });

jQuery('#message-form').on('submit', function (event) {
    var params = jQuery.deparam(window.location.search);
    //prevent default behavior of Send button on the form
    var messageTextForm = jQuery('[name=message]');
    event.preventDefault();
    socket.emit('createMessage', {
        from: params.name,
        text: messageTextForm.val(),
        createAt: moment().valueOf()
    }, function(data) {
        console.log(data);
        messageTextForm.val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    // console.log('Click send location');
    if (!navigator.geolocation) {
        alert('Geolocation is not supported');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location....');
    navigator.geolocation.getCurrentPosition(function (location) {
        locationButton.removeAttr('disabled').text('Send Location');
        if (location) {

            console.log(location.coords.latitude, location.coords.longitude);
            // alert(`${location.coords.latitude}, ${location.coords.longitude}`);
            socket.emit('sendLocationMessage', {
                from: 'User',
                longitude: location.coords.longitude,
                latitude: location.coords.latitude
            });
        } else {
            alert('No location');
        }

    });
});
