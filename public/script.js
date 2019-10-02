$("#SMS").hide();
$(function () {
    var names = $('#username').val();
    var username = $('#username');
    var myname = '';
    
    
    // $("#Counter").val(counter);
    //var listOfUser = [];
    var socket = io();

    socket.on('online', function (data) {
        listOfUser = [];
        
        $('.Us').remove()
        for (let i = 0; i < data.length; i++) {
            // console.log(listOfUser)
            if (!listOfUser.includes(data[i]) && username.val() != data[i]) {
                listOfUser.push(data[i]);
                var user = data[i];
                $('#activeUser').append($("<li class='Us'>").text(user));
            }
        } 

            $("#Counter").text(listOfUser.length+1);      
    })

    socket.on("already_used", function(data) {
        alert(data);
    })


    $('#submitButton').click(function () {
        
        //$('#activeUser').append("<li>"+username.val());
        $("#title").text(username.val());
        myname = username.val();
        socket.emit('online', username.val());
        // console.log(username.val());
        $('#userinterface').hide();
        $("#SMS").show();


    })

    $("#disconnect").click(function () {
       
        alert(myname);
        socket.emit('logout', myname);
        location.reload();
    })

    $('form').submit(function () {
        socket.emit('chat message', username.val() + " : " + $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('logout', function (data) {
        listOfUser = [];
        $('.Us').remove()
        for (let i = 0; i < data.length; i++) {
            if (!listOfUser.includes(data[i]) && username.val() != data[i]) {
                listOfUser.push(data[i]);
                var user = data[i];
                $('#activeUser').append($("<h1  class='Us' >").text(user));
                
            }
        }
        $("#Counter").text(listOfUser.length+1)
        console.log(listOfUser.length)
        
    })

    $('#m').on('keypress', function () {
        socket.emit('typing', username.val());
    })


    socket.on('typing', function (msg, err) {
        //  console.log(err);
        $('#typing').html(msg + " is typing a message...");
        setTimeout(function () {
            $("#typing").html('');
        }, 2000);
    })



    socket.on('offline', function () {

    })
    socket.on('chat message', function (msg) {
        // $('#messages').append($('<li>').text(msg));
        console.log(msg.split(" : ")[0])
        if (username.val() == msg.split(" : ")[0]) {
            $('#messages').append($('<li style="padding:5px;border-radius:10px;background-color:deepskyblue;margin-left:340px;margin-top:30px;">').text(msg));
        } else {
            $('#messages').append($('<li style="padding:5px;border-radius:10px;background-color:white;color:deepskyblue;margin-right:340px;margin-top:30px; ">').text(msg));
        }
    });


});
window.scrollTo(0, document.body.scrollHeight);


