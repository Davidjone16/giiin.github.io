function soloNumeri(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function soloNumeriVirgola(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode === 46)
        return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function apriPopMsgSubmit(nome) {
    window.open("", nome, 'toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no,scrollbars=no');
}

function apriPopMsg(nome) {
    window.open(nome, 'Messaggio', 'toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no,scrollbars=no');
}

function checkAll(formname, checktoggle, checkname) {
    var checkboxes = new Array();
    checkboxes = document[formname].getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type === 'checkbox' && checkboxes[i].name === checkname) {
            checkboxes[i].checked = checktoggle;
        }
    }
}

//aggiungi mail selezionate in listiscritti.php
function addMailto() {
    var but = document.getElementById("listMailto"),
        butRif = document.getElementById("listMailtoRif"),
        form = document.getElementById("listaTipo"),
        l = [],
        lRif = [],
        list = form.querySelectorAll(":checked");
    for (i = 0; i < list.length; i++) {
        if (list[i].hasAttribute("data-value-email"))
            l.push(list[i].getAttribute("data-value-email"));
        if (list[i].hasAttribute("data-value-emailRif"))
            lRif.push(list[i].getAttribute("data-value-emailRif"));
    }

    but.href = "mailto:?bcc=" + l.join(", ");
    butRif.href = "mailto:?bcc=" + lRif.join(", ");
}

function checklunghezza(objCampo, prossimoCampo) {
    if ((objCampo.value).length >= objCampo.maxLength)
        eval(prossimoCampo).focus();
}

//aggiunta automatica quote in editIniziativa
$(document).ready(function() {
    var fieldset_parent = $("#insertQuota:eq(0)").clone();
    $("a#addQuote").click(function(e) {
        e.preventDefault();
        $("#insertQuotaHide:last").before($(fieldset_parent).clone());
        $('.flexdatalistQuota').flexdatalist();
        $('.flexdatalistIniziativa').flexdatalist();
    });
});

//aggiunta automatica campi in editIniziativa
$(document).ready(function() {
    var fieldset_parent = $("#insertCampo:eq(0)").clone();
    $("a#addCampi").click(function(e) {
        e.preventDefault();
        $("#insertCampoHide:last").before($(fieldset_parent).clone());
    });
});

//validazione form
$(document).ready(function() {
    jQuery.validator.addMethod("codiceFiscale", function(value) {
        if (value == "")
            return true;
        else
            return value.toUpperCase().match(/[A-Z]{6}[\d]{2}[A-Z][\d]{2}[A-Z][\d]{3}[A-Z]/);
    }, "Codice fiscale non valido");
    jQuery.validator.addMethod("numCellulare", function(value) {
        if (value == "")
            return true;
        else
            return value.toUpperCase().match(/3[\d]{9}/);
    }, "Numero mobile non valido");
    jQuery.validator.addMethod("numFisso", function(value) {
        if (value == "")
            return true;
        else
            return value.toUpperCase().match(/0[\d]{7,10}/);
    }, "Numero fisso non valido");
    $("#registrazione, #editProfilo").validate({
        rules: {
            cognome: "required",
            nome: "required",
            maggiorenne: "required",
            privacy: "required",
            indirizzo: "required",
            citta: "required",
            cap: {
                required: true,
                number: true,
                maxlength: 5
            },
            provincia: {
                required: true,
                maxlength: 4
            },
            stato: "required",
            telefono1: {
                maxlength: 11,
                numFisso: true
            },
            telefono2: {
                maxlength: 11,
                numFisso: true
            },
            telefono3: {
                maxlength: 11,
                numFisso: true
            },
            cellulare1: {
                required: true,
                maxlength: 10,
                numCellulare: true
            },
            cellulare2: {
                maxlength: 10,
                numCellulare: true
            },
            email: {
                required: true,
                email: true
            },
            password: "required",
            password2: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            password2: {
                equalTo: "Password non corrispondente"
            }
        },
        highlight: function(element) {
            $(element).closest('.form-control').addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).closest('.form-control').removeClass('is-invalid');
        },
        errorElement: 'div',
        errorClass: 'invalid-feedback',
        errorPlacement: function(error, element) {
            return true;
        },
        invalidHandler: function() {
                alert('I dati inseriti sono errati o incompleti, ricontrollare i campi evidenziati di rosso');
            }
            /*submitHandler: function(form) {
             alert('I dati sono stati inseriti correttamente');
             form.submit();
             },
             invalidHandler: function() {
             alert('I dati inseriti non sono corretti, ricontrollarli');
             }*/
    });
    $("#cambioCredenziali").validate({
        rules: {
            attuale: "required",
            nuova1: "required",
            nuova2: {
                required: true,
                equalTo: "#nuova1"
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            nuova2: {
                equalTo: "Password non corrispondente"
            }
        },
        highlight: function(element) {
            $(element).closest('.form-control').addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).closest('.form-control').removeClass('is-invalid');
        },
        errorElement: 'div',
        errorClass: 'invalid-feedback',
        errorPlacement: function(error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });
    $("#partecipante").validate({
        rules: {
            cognome: "required",
            nome: "required",
            idUtente: "required",
            sex: {
                required: true
            },
            dNascita: {
                required: true,
                number: true,
                range: [1, 31]
            },
            mNascita: {
                required: true,
                number: true,
                range: [1, 12]
            },
            yNascita: {
                required: true,
                number: true,
                maxlength: 4
            },
            luogoNascita: "required",
            statoNascita: "required",
            codiceFiscale: {
                required: true,
                codiceFiscale: true,
            },
            taglia: "required",
            indirizzo: "required",
            citta: "required",
            cap: {
                required: true,
                number: true,
                maxlength: 5
            },
            provincia: {
                required: true,
                maxlength: 4
            },
            stato: "required",
            cellulare: {
                maxlength: 10,
                numCellulare: true
            },
            email: {
                email: true
            },
            uscitaAutonoma: "required",
            consensoGdpr1: "required",
            consensoGdpr2: "required",
            consensoGdpr3: "required",
            consensoGdpr4: "required",
            consensoGdpr5: "required",
            consensoGdpr6: "required",
            consensoGdpr7: "required",
            consensoGdpr8: "required"
        },
        highlight: function(element) {
            $(element).closest('.form-control').addClass('is-invalid');
            $(element).closest('.form-check-input').addClass('is-invalid');
            $(element).closest('.form-check-inline').addClass('is-invalid');
            $(element).next('.flexdatalist-alias').addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).closest('.form-control').removeClass('is-invalid');
            $(element).closest('.form-check-input').removeClass('is-invalid');
            $(element).closest('.form-check-inline').removeClass('is-invalid');
            $(element).next('.flexdatalist-alias').removeClass('is-invalid');
        },
        errorElement: 'div',
        errorClass: 'invalid-feedback',
        errorPlacement: function(error, element) {
            return true;
        },
        invalidHandler: function() {
            alert('I dati inseriti sono errati o incompleti, ricontrollare i campi evidenziati di rosso');
        }
    });
    $('.form-check-input[name*="consenso"]').each(function() {
        $(this).rules('add', {
            require_from_group: [1, ".form-check-input"]
        });
    });
    $('.form-check-input[name="uscitaAutonoma"]').each(function() {
        $(this).rules('add', {
            require_from_group: [1, ".form-check-input"]
        });
    });
    $('.form-check-input[name="sex"]').each(function() {
        $(this).rules('add', {
            require_from_group: [1, ".form-check-input"]
        });
    });
    $('.form-check-input[name="taglia"]').each(function() {
        $(this).rules('add', {
            require_from_group: [1, ".form-check-input"]
        });
    });

    /* Commentato perchè con più figli non funzionerebbe
    $("#iscrizione").validate({
        highlight: function(element) {
            $(element).closest('.form-control').addClass('is-invalid');
            $(element).closest('.form-check-input').addClass('is-invalid');
            $(element).closest('.form-check-inline').addClass('is-invalid');
            $(element).next('.flexdatalist-alias').addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).closest('.form-control').removeClass('is-invalid');
            $(element).closest('.form-check-input').removeClass('is-invalid');
            $(element).closest('.form-check-inline').removeClass('is-invalid');
            $(element).next('.flexdatalist-alias').removeClass('is-invalid');
        },
        errorElement: 'div',
        errorClass: 'invalid-feedback',
        errorPlacement: function(error, element) {
            return true;
        },
        invalidHandler: function() {
            alert('I dati inseriti sono errati o incompleti, ricontrollare i campi evidenziati di rosso');
        }
    });
    $('.campoObbligatorio[name*="campi"]').each(function() {
        $(this).rules('add', {
            require_from_group: [1, ".campoObbligatorio"]
        });
    });*/

    /*$("#incassoData").validate({
        rules: {
            dataInizio: {
                required: true,
                dateITA: true
            },
            dataFine: {
                required: true,
                dateITA: true
            }
        },
        highlight: function(element) {
            $(element).closest('.form-control').addClass('is-invalid');
        },
        unhighlight: function(element) {
            $(element).closest('.form-control').removeClass('is-invalid');
        },
        errorElement: 'div',
        errorClass: 'invalid-feedback',
        errorPlacement: function(error, element) {
            return true;
        }
    });*/
});

$(document).ready(function() {
    $('#incassoData .form_datetime').datetimepicker({
        language: 'it',
        format: 'dd-mm-yyyy hh:ii',
        autoclose: true,
        todayBtn: true,
        minuteStep: 10
    });

    $('#iscrizioniData .form_datetime').datetimepicker({
        language: 'it',
        format: 'dd-mm-yyyy hh:ii',
        autoclose: true,
        todayBtn: true,
        minuteStep: 10
    });
});

//per fare il chek e assegnare il valore N alle quote non selezionate nel form editIniziativa e cambia il campo in hidden
$(document).ready(function() {
    $("#editIniziativa").submit(function() {

        var form = $(this);

        form.find('input[type="checkbox"]').each(function() {
            var checkbox_this = $(this);

            if (checkbox_this.is(":checked") == true) {
                checkbox_this.attr('value', 'S');
            } else {
                checkbox_this.prop('type', 'hidden');
                checkbox_this.attr('value', 'N');
                //checkbox_this.prop('checked', true);
                //DONT' ITS JUST CHECK THE CHECKBOX TO SUBMIT FORM DATA    
                //checkbox_this.attr('value', 'N');
            }
        })
    })
});

//disabilita fancybox su mobile
$(document).ready(function() {
    if ($.fancybox.isMobile) {
        $.fancybox.destroy();
    }
});


//avvia flexdatalist per i campi quota e iniziativa bloccante
//va fatto così per evitare che compaiano gli input text doppi
$(document).ready(function() {
    $('.flexdatalistQuota').flexdatalist();
    $('.flexdatalistIniziativa').flexdatalist();
});