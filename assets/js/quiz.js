// add string trim function
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

// functions for verifying whether an answer is correct (true) or wrong (false)
function isTextCorrect(elt) {
    if (elt.val().trim().toLowerCase() == elt.attr("name")) {
        return true
    } else {
        return false
    }
}

// TODO: functions for checkboxes and radio buttons

// functions for marking an answer right or wrong
function markCorrect(elt) {
    elt.parent().children(".result").html("&#10003;").addClass("big").css("color","green");
};

function markWrong(elt) {
    elt.parent().children(".result").html("&#x2717;").addClass("big").css("color","red");
};

$(document).ready(function() {

    $("form").submit(function() {
        return false;
    })
    
    $(":text").blur(function() {
        if ($(this).val() != "") {
           if(isTextCorrect($(this))) {
               markCorrect($(this));
           } else {
               markWrong($(this));
           };
        };
    });
});
