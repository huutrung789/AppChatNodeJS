var socket = io();
socket.on('connect', function (data) {
    console.log('New connection');
    socket.emit('createEmail', {to: 'trung2@gmail.com', text: 'sfkljsflk'});
})

socket.on('disconnect', function (data) {
    console.log('Disconnected');
});

socket.on('newEmail', function (data) {
    console.log('New email: ', data);
});

