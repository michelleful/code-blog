// add string trim function
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

// add equals to check for equality between two jQuery collections
$.fn.equals = function(compareTo) {
  if (!compareTo || this.length != compareTo.length) {
    return false;
  }
  for (var i = 0; i < this.length; ++i) {
    if (this[i] !== compareTo[i]) {
      return false;
    }
  }
  return true;
};

// functions for verifying whether an answer is correct (true) or wrong (false)
function gradeText(elt) {
    if (elt.val().trim().toLowerCase() == elt.attr("answer")) {
        markCorrect(elt);
    } else {
        markWrong(elt);
    }
}

function gradeCheckbox(form) {
    if (form.children("[value='correct']").equals(form.children(":checked"))) {
        markCorrect(form.children().first());
    } else {
        markWrong(form.children().first());
    }
}

// functions for marking an answer right or wrong
function markCorrect(elt) {
    // mark it with a green checkmark
    elt.siblings(".result").html("&#10003;").addClass("big").css("color","green");
    // put discussion text in hint div (if any)
    elt.siblings(".hint").html(elt.attr("discuss"));
};

function markWrong(elt) {
    // mark it with a red cross
    elt.siblings(".result").html("&#x2717;").addClass("big").css("color","red");
    // put hint text in hint div (if any)
    elt.siblings(".hint").html("Hint: " + elt.attr("hint"))
};

$(document).ready(function() {

    $("form.textType").submit(function() {
        var answerElt = $(this).children(":text");
        gradeText(answerElt);
        return false; // prevent form from submitting
    });

    $("form.checkboxType").submit(function(event) {
        gradeCheckbox($(this));
        return false; // prevent form from submitting
    });
});
