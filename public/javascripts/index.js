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


// socket.emit('createMessage', {to: 'trung2@gmail.com', text: 'new comer'}, function (message) {
//     console.log('Sent: ', message);
// });

jQuery('#message-form').on('submit', function (event) {
    //prevent default behavior of Send button on the form
    event.preventDefault();
    socket.emit('createMessage', {
        from: 'New user',
        text: jQuery('[name=message]').val()
    }, function(data) {
        console.log(data);
        jQuery('[name=message]').val('');
    });
});