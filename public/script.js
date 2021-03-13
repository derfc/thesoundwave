$(document).ready(() => {
    $("#registerbutton").click((e) => {
        e.preventDefault();
        let email = $('#email').val()
        let password = $('#password').val()
        console.log(email)
        console.log(password)

        $.ajax({
            type: "POST",
            url: `/register`,
            data: { email: email, password: password },
            success: function () {
                console.log("success");
            },
        }).done(function () {
            window.location.reload();
        }).fail(function () {
            console.log('failed')
        })
    });

    $(".button-login").click((e) => {
        // e.preventDefault();
        console.log("hello");
    });

})
