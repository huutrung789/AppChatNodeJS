var socket = io();
socket.on('connect', function (data) {
    console.log('Connected websocket');

});

socket.on('disconnect', function (data) {
    console.log('Disconnected');
});

socket.on('newMessage', function (message) {
    console.log('New Message: ', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#message').append(li);
});

socket.on('createMessage', function (message) {
    console.log('createMessage', message);

});

socket.on('sendLocationMessage', function(message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Location</a>');
    a.attr('href', message.url);
    console.log(message.url);
    li.text(`${message.from}: `);
    li.append(a);
    jQuery('#message').append(li);

});
// socket.emit('createMessage', {to: 'trung2@gmail.com', text: 'new comer'}, function (message) {
//     console.log('Sent: ', message);
// });

jQuery('#message-form').on('submit', function (event) {
    //prevent default behavior of Send button on the form
    var messageTextForm = jQuery('[name=message]');
    event.preventDefault();
    socket.emit('createMessage', {
        from: 'New user',
        text: messageTextForm.val()
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
