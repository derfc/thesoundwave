$(document).ready(() => {
    $("#facebook").click((e) => {
        location.href = '/auth/facebook'
    });

    $("#google").click((e) => {
        location.href = '/auth/google'
    });

    $('#registerbutton').click((e) => {

        console.log('hi')

        let username = $('#username').val();
        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val()

        console.log(username, password, confirmPassword)

        if (confirmPassword !== password) {
            return
        } else if (username === '' || password === '' || confirmPassword === '') {
            return
        } else {
            $.ajax({
                type: "POST",
                url: `/auth/register`,
                data: { username: username, password: confirmPassword },
                success: function () {
                    console.log("success");
                },
            }).done(function () {
                console.log('done')
            }).fail(function () {
                console.log('failed')
            })
        }
    })

    $('#loginButton').click((e) => {
        let username = $('#loginUsername').val();
        let password = $('#loginPassword').val();

        $.ajax({
            type: "POST",
            url: `/auth/login`,
            data: { username: username, password: password },
            success: function () {
                console.log("success");
            },
        }).done(function () {
            console.log('done')
        }).fail(function () {
            console.log('failed')
        })
    })

    $('#cancelButton').click((e) => {
        $('#loginUsername').val('')
        $('#loginPassword').val('')
    })

});