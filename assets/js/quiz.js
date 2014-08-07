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
    if (elt.val().trim().toLowerCase() == elt.attr("answer")) {
        return true
    } else {
        return false
    }
}

function isCheckboxCorrect(elt) {
    
}

// TODO: functions for checkboxes and radio buttons

// functions for marking an answer right or wrong
function markCorrect(elt) {
    // mark it with a green checkmark
    elt.siblings(".result").html("&#10003;").addClass("big").css("color","green");
    // put discussion text in hint div
    elt.siblings(".hint").html(elt.attr("discuss"));
};

function markWrong(elt) {
    // mark it with a red cross
    elt.siblings(".result").html("&#x2717;").addClass("big").css("color","red");
    // put hint text in hint div
    elt.siblings(".hint").html("Hint: " + elt.attr("hint"))
};

$(document).ready(function() {

    $("form.textType").submit(function() {
       var answerElt = $(this).children(":text");
       if(isTextCorrect(answerElt)) {
           markCorrect(answerElt);
       } else {
           markWrong(answerElt);
       };
       return false;
    });
});
