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
    console.log("Correct!")
    console.log($(this).parent().children(".result"))
    $(this).parent().children(".result").text("Correct!")
};

function markWrong(elt) {
    $(this).parent().children(".result").text("Wrong!")
};

$(document).ready(function() {

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
