var mailboxesEditView = {
    test_connection_imap_pop3: function () {
        var host = $("#imap_pop3_host").val();
        var imap_pop3_port = $("#imap_pop3_port").val();
        var username = $("#imap_pop3_username").val();
        var password = $("#imap_pop3_password").val();
        var imap_pop3_protocol_type = $("#imap_pop3_protocol_type").val();
        var imap_pop3_encryption = $("#imap_pop3_encryption").val();
        var status = $('#imap_pop3_data_valid').val();
        var imap_dir;
        var parameters = {

            "imap_pop3_host": host,
            "imap_pop3_port": imap_pop3_port,
            "imap_pop3_username": username,
            "imap_pop3_password": password,
            "imap_pop3_protocol_type": imap_pop3_protocol_type,
            "imap_pop3_encryption": imap_pop3_encryption,
            "imap_dir": imap_dir,
        };

        $.ajax({
            url: "index.php?module=Mailboxes&action=test_connection_imap_pop3&to_pdf=true",
            type: 'GET',
            data: parameters,
            success: function (result) {
                if (result.length > 0) {

                    var res = JSON.parse(result);
                    dirs = res['dirs'];
                    if (res['valid'] == false) {
                        $('#imap_pop3_data_valid').val(false);
                        $('#succes_msg').text('');
                        $('#error_msg').text('Problem with the connection or validation');
                        $("#choose_dir_div").append('<a>You are not connected to the mailbox.</a>');
                    }
                    else {
                        $('#imap_pop3_data_valid').val(true);
                        $('#error_msg').text('');
                        $('#succes_msg').text('Test succesful.');

                        $("#choose_dir_div").empty();
                        $("#choose_dir_div").append('<select onchange="mailboxesEditView.accept_dir(value)">');
                        for (var i = 0; i < dirs.length; i++) {
                            $("#choose_dir_div select").append('<option value = '+dirs[i]+' id="chan_dir">'+dirs[i]+'</option><br>')
                        }
                        $("#choose_dir_div").append('</select>');

                    }

                }

                return false;
            },
            error: function (result) {
                console.log("Fail to GET test_connection of imap")
            },
            failure: function (result) {
                console.log("Unable to use Ajax in this moment.")
            }
        });
    },
    test_connection_smtp: function () {
        if (!mailboxesEditView.is_smtp_data_valid()) {
            var parameters = {
                "smtp_host": $("#smtp_host").val(),
                "smtp_port": $("#smtp_port").val(),
                "smtp_username": $("#smtp_username").val(),
                "smtp_password": $("#smtp_password").val(),
                "smtp_auth_type": $("#smtp_auth_type").val().toUpperCase(),
                "smtp_debug": $("#smtp_debug").val()
            };
            return $.ajax({
                url: "index.php?module=Mailboxes&action=test_connection_smtp&to_pdf=true",
                type: "GET",
                data: parameters,
                success: function (connected) {
                    var error_msg = $("#error_msg");
                    error_msg.text(connected ? "SMTP connection: OK" : "SMTP connection: ERROR - not connected");
                    error_msg.css('color', connected ? 'green' : 'red');
                    $("#smtp_data_valid").val(connected ? 1 : 0);
                    return false;
                }
            });
        }
        return false;
    },

    send_email_dialog: function () {
        var dialog = $('#email_dialog_div');
        dialog.css('display', 'block');
        dialog.dialog({
            autoOpen: false,
            title: SUGAR.language.get('Mailboxes', 'LBL_SEND_EMAIL_DIALOG'),
            minWidth: 200
        });
        return dialog;
    },

    send_email: function () {
        var smtp_not_validated = mailboxesEditView.test_connection_smtp();
        if (smtp_not_validated) {
            smtp_not_validated.then(function () {
                if (mailboxesEditView.is_smtp_data_valid()) {
                    mailboxesEditView.send_email_dialog().dialog("open");
                }
            });
        } else {
            mailboxesEditView.send_email_dialog().dialog("open");
        }
    },

    confirm_send_email: function () {
        var parameters = {
            'smtp_host': $('#smtp_host').val(),
            'smtp_port': $('#smtp_port').val(),
            'smtp_username': $('#smtp_username').val(),
            'smtp_password': $('#smtp_password').val(),
            'smtp_auth_type': $('#smtp_auth_type').val().toUpperCase(),
            'smtp_debug': $('#smtp_debug').val(),
            'email_address': $('#email_address').val()
        };
        $.ajax({
            url: 'index.php?module=Mailboxes&action=send_email&to_pdf=true',
            type: 'GET',
            data: parameters
        });
        $('#email_dialog_div').dialog('close');
    }
    ,

    is_smtp_data_valid: function () {
        var smtp_data_valid = $("#smtp_data_valid");
        return smtp_data_valid.val() && smtp_data_valid.val() === "1";
    },

    accept_dir: function (value) {
        $('#imap_inbox_dir').val(value);
    },

};

$(function () {

    mailboxesEditView.dialog = $('<div id="choose_dir_div"></div>')
        .dialog({
            autoOpen: false,
            title: SUGAR.language.get('Mailboxes', 'LBL_IMAP_DIR'),
            maxHeight: 100,

        });

    // initialize port number (protocole type IMAP, enable SSL)
    $('#imap_pop3_port').val("993");

    $('#imap_pop3_protocol_type').change(function () {
        $('#imap_pop3_data_valid').val(false);
        $('#imap_inbox_dir').val('');

        if ($('#imap_pop3_protocol_type').val() == 'pop3') {
            $('#imap_inbox_dir').parent().parent().hide()
            $('#imap_inbox_dir').val('')

            if ($('#imap_pop3_encryption').val() == 'ssl_enable') {
                $('#imap_pop3_port').val("995")
            }
            else $('#imap_pop3_port').val("110")
        }
        if ($('#imap_pop3_protocol_type').val() == 'imap') {
            $('#imap_inbox_dir').parent().parent().show()

            if ($('#imap_pop3_encryption').val() == 'ssl_enable') {
                $('#imap_pop3_port').val("993")
            }
            else $('#imap_pop3_port').val("143")
        }
    });

    $('#imap_pop3_encryption').change(function () {
        $('#imap_pop3_data_valid').val(false);
        $('#imap_inbox_dir').val('');

        if ($('#imap_pop3_encryption').val() == 'ssl_disable') {
            if ($('#imap_pop3_protocol_type').val() == 'imap') {
                $('#imap_pop3_port').val("143")
            }
            else $('#imap_pop3_port').val("110")
        }
        if ($('#imap_pop3_encryption').val() == 'ssl_enable') {
            if ($('#imap_pop3_protocol_type').val() == 'imap') {
                $('#imap_pop3_port').val("993")
            }
            else $('#imap_pop3_port').val("995")
        }
    });

    $('#imap_pop3_protocol_type').change(function () {
        $('#imap_pop3_data_valid').val(false);
        $('#imap_inbox_dir').val('');
    });

    $('#imap_pop3_port').change(function () {
        $('#imap_pop3_data_valid').val(false);
        $('#imap_inbox_dir').val('');
    });

    $('#imap_inbox_dir_button').click(function () {
        ($('#imap_pop3_data_valid').val())
        if ($('#imap_pop3_data_valid').val() == "false"){
            $("#choose_dir_div").empty();
            $("#choose_dir_div").append('<a>You are not connectet to mailbox.</a>');
        }
        mailboxesEditView.dialog.dialog('open');
    });

    $('#smtp_host').change(function () {
        invalidateConnectionFlag();
    });
    $('#smtp_port').change(function () {
        invalidateConnectionFlag();
    });
    $('#smtp_username').change(function () {
        invalidateConnectionFlag();
    });
    $('#smtp_password').change(function () {
        invalidateConnectionFlag();
    });
    $('#smtp_auth_type').change(function () {
        invalidateConnectionFlag();
    });

    function invalidateConnectionFlag() {
        $('#smtp_data_valid').val(0);
    }

    var relais_dropdown = $('#relais');
    var elementIds = [
        '#detailpanel_3',
        'test_connection_smtp',
        'send_email'];

    if (relais_dropdown.val() !== '') {
        hideSMTPElements(elementIds);
    }

    relais_dropdown.change(function () {
        if ($(this).val() === '') {
            showSMTPElements(elementIds);
        } else {
            hideSMTPElements(elementIds);
        }
    });

    function hideSMTPElements(elements) {
        toggleSMTPElements(function (element) {
            element.hide();
        }, elements);
    }

    function showSMTPElements(elements) {
        toggleSMTPElements(function (element) {
            element.show();
        }, elements);
    }

    function toggleSMTPElements(action, elements) {
        elements.forEach(function (element) {
            if (element[0] !== '#') {
                element = '[name="' + element + '"]';
            }
            action($(element));
        });
    }


});

function accept_dir(value) {
    $('#imap_inbox_dir').val(value);
}








