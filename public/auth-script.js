$(document).ready(() => {
    $("#facebook").click((e) => {
        location.href = '/auth/facebook'
    });

    $("#google").click((e) => {
        location.href = '/auth/google'
    });

    $('#registerbutton').click((e) => {
        e.preventDefault();
        console.log('hi')

        let username = $('#username').val();
        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val()

        console.log(username, password, confirmPassword)

        if (confirmPassword !== password) {
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
});