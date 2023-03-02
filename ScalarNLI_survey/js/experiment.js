function getURLParameter(name, def) {
  return decodeURIComponent(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||["", def])[1]
  );
}



var LIST = parseInt(getURLParameter("list", "0"));
var stim_set = parseInt(getURLParameter("stims", "0"));

var all_stims = stims[stim_set];


// set up experiment logic for each slide
function make_slides(f) {
var slides = {};

// set up initial slide
slides.i0 = slide({
  name: "i0",
  start: function() {
    exp.startT = Date.now();
  }
});


// set up slide with instructions for main experiment
slides.startExp = slide({
  name: "startExp",
  start: function() {
  },
  button: function() {
    exp.go(); //use exp.go() if and only if there is no "present" data.
  },
});

slides.intermission = slide({
  name: "intermission",
  start: function() {
  },
  button: function() {
    exp.go(); //use exp.go() if and only if there is no "present" data.
  },
});

slides.practice_1 = slide({
  name: "practice_1",
  start: function() {
    this.correct_answer = false;
    utils.make_slider("#practice_1-slider", function() {
      var changed_val = !$("#practice_1-slider .ui-slider-handle").is(":hidden");
      if (!changed_val) {
        $("#practice_1-slider-val").text("--");
        return;
      }
      var val = $(this).slider("option", "value");
      var transformed_val = ((100/(1 + Math.pow((-1 + 1/val), 1.5)))).toFixed(2);
      $("#practice_1-slider-val").text(transformed_val);
    });
    $(".err").hide();
    $(".correct").hide();
    $("#practice_1-slider-val").text("--");
  },
  button: function() {
    if (this.correct_answer) {
      exp.go();
      return;
    }
    $(".err").hide();
    this.log_responses();
    var changed_val = !$("#practice_1-slider .ui-slider-handle").is(":hidden");
    if (!changed_val) {
      $("#practice_1 .no-response-err").show();
    } else if (parseFloat($("#practice_1-slider-val").text()) < 99.0) {
      $("#practice_1 .incorrect-val-err").show();
    } else {
      $("#practice_1 .correct").show();
      this.correct_answer = true;
    }
  },
  log_responses: function() {
    exp.data_trials.push({
      "premise": "",
      "statement": "",
      "trial": exp.phase, //exp.phase is a built-in trial number tracker
      "response": $("#practice_1-slider-val").text(),
      "confusing": 0,
      "type": "practice"
    });
  }
});

slides.practice_2 = slide({
  name: "practice_2",
  start: function() {
    this.correct_answer = false;
    utils.make_slider("#practice_2-slider", function() {
      var changed_val = !$("#practice_2-slider .ui-slider-handle").is(":hidden");
      if (!changed_val) {
        $("#practice_2-slider-val").text("--");
        return;
      }
      var val = $(this).slider("option", "value");
      var transformed_val = ((100/(1 + Math.pow((-1 + 1/val), 1.5)))).toFixed(2);
      $("#practice_2-slider-val").text(transformed_val);
    });
    $(".err").hide();
    $(".correct").hide();
    $("#practice_2-slider-val").text("--");
  },
  button: function() {
    if (this.correct_answer) {
      exp.go();
      return;
    }
    $(".err").hide();
    this.log_responses();
    var changed_val = !$("#practice_2-slider .ui-slider-handle").is(":hidden");
    if (!changed_val) {
      $("#practice_2 .no-response-err").show();
    } else if (parseFloat($("#practice_2-slider-val").text()) > 1.0) {
      $("#practice_2 .incorrect-val-err1").show();
    } else if (parseFloat($("#practice_2-slider-val").text()) == 0.0) {
      $("#practice_2 .incorrect-val-err2").show();
    } else {
      $("#practice_2 .correct").show();
      this.correct_answer = true;
    }
  },
  log_responses: function() {
    exp.data_trials.push({
      "premise": "",
      "statement": "",
      "trial": exp.phase, //exp.phase is a built-in trial number tracker
      "response": $("#practice_2-slider-val").text(),
      "confusing": 0,
      "type": "practice"
    });
  }
});

slides.practice_3 = slide({
  name: "practice_3",
  start: function() {
    this.correct_answer = false;
    utils.make_slider("#practice_3-slider", function() {
      var changed_val = !$("#practice_3-slider .ui-slider-handle").is(":hidden");
      if (!changed_val) {
        $("#practice_3-slider-val").text("--");
        return;
      }
      var val = $(this).slider("option", "value");
      var transformed_val = ((100/(1 + Math.pow((-1 + 1/val), 1.5)))).toFixed(2);
      $("#practice_3-slider-val").text(transformed_val);
    });
    $(".err").hide();
    $(".correct").hide();
    $("#practice_3-slider-val").text("--");
  },
  button: function() {
    if (this.correct_answer) {
      exp.go();
      return;
    }
    $(".err").hide();
    this.log_responses();
    var changed_val = !$("#practice_3-slider .ui-slider-handle").is(":hidden");
    if (!changed_val) {
      $("#practice_3 .no-response-err").show();
    } else if (parseFloat($("#practice_3-slider-val").text()) == 100.0) {
      $("#practice_3 .incorrect-val-err1").show();
    } else if (parseFloat($("#practice_3-slider-val").text()) == 0.0) {
      $("#practice_3 .incorrect-val-err2").show();
    } else {
      $("#practice_3 .correct").show();
      this.correct_answer = true;
    }
  },
  log_responses: function() {
    exp.data_trials.push({
      "premise": "",
      "statement": "",
      "trial": exp.phase, //exp.phase is a built-in trial number tracker
      "response": $("#practice_3-slider-val").text(),
      "confusing": 0,
      "type": "practice"
    });
  }
});


slides.trial = slide({
  name: "trial",
   present: exp.stimuli,
   present_handle : function(stim) {

     $("#trial-confusing").prop("checked", false);
     $("#trial-confusing-reason").val("");
     $("#reason-container").hide();
     $(".reason-err").hide();

    // store stimulus data
    this.stim = stim;

    function build_premise(stim) {


 
        var premise = stim.premise;
      

        return premise;

      }


      this.stim.premise = build_premise(stim);
      if (this.stim.premise.length < 3) {
        this.stim.premise = "<i>(No context.)</i>";
      }
      this.stim.statement = stim.hypothesis;
      





    $("#trial-premise").html(stim.premise);

    $("#trial-statement").text(stim.hypothesis);
    utils.make_slider("#trial-slider", function() {
      var changed_val = !$("#trial-slider .ui-slider-handle").is(":hidden");
      if (!changed_val) {
        $("#slider-val").text("--");
        return;
      }
      var val = $(this).slider("option", "value");
      var transformed_val = ((100/(1 + Math.pow((-1 + 1/val), 1.5)))).toFixed(2);
      $("#slider-val").text(transformed_val);
    });
    $(".err").hide();
    $("#slider-val").text("--");
  },

  // handle click on "Continue" button
  button: function() {
    var changed_val = !$("#trial-slider .ui-slider-handle").is(":hidden");
    $('.err').hide();
    $(".reason-err").hide();

    if (changed_val) {
      var confusing = $("#trial-confusing").is(":checked");
      if (!confusing || $("#trial-confusing-reason").val().length > 3) {
        this.log_responses();
         _stream.apply(this);
      } else {
        $(".reason-err").show();
      }
    } else {
      $('.err').show();
    }
  },

  // save response
  log_responses: function() {

    exp.data_trials.push({
      "premise": this.stim.premise,
      "statement": this.stim.hypothesis,
      "trial": exp.phase, //exp.phase is a built-in trial number tracker
      "response": $("#slider-val").text(),
      "confusing": $("#trial-confusing").is(":checked") ? 1 : 0,
      "confusing_reason": $("#trial-confusing-reason").val(),
      
    });
  },
});

// slide to collect subject information
slides.subj_info = slide({
  name: "subj_info",
  submit: function(e) {
    exp.subj_data = {
      enjoyment: $("#enjoyment").val(),
      asses: $('input[name="assess"]:checked').val(),
      fairprice: $("#fairprice").val(),
      comments: $("#comments").val()
    };
    exp.go(); //use exp.go() if and only if there is no "present" data.
  }
});

//
slides.thanks = slide({
  name: "thanks",
  start: function() {
    exp.data = {
      "trials": exp.data_trials,
      "system": exp.system,
      "condition": exp.condition,
      "subject_information": exp.subj_data,
      "time_in_minutes": (Date.now() - exp.startT) / 60000
    };
    setTimeout(function () {
      turk.submit(exp.data);
    }, 1000);
  }
});

return slides;
}

/// initialize experiment
function init() {

exp.trials = [];
exp.catch_trials = [];
var stimuli = all_stims;

//exp.stimuli = _.shuffle(stimuli); //call _.shuffle(stimuli) to randomize the order;
exp.n_trials = exp.stimuli.length;

exp.condition = LIST; //can randomize between subjects conditions here

exp.system = {
  Browser: BrowserDetect.browser,
  OS: BrowserDetect.OS,
  screenH: screen.height,
  screenUH: exp.height,
  screenW: screen.width,
  screenUW: exp.width
};

//blocks of the experiment:
exp.structure = [
  "i0",
  //"startExp",
  //"practice_1",
  //"practice_2",
  //"practice_3",
  "intermission",
  "trial",
  "subj_info",
  "thanks"
];

exp.data_trials = [];

//make corresponding slides:
exp.slides = make_slides(exp);

exp.nQs = utils.get_exp_length();
//this does not work if there are stacks of stims (but does work for an experiment with this structure)
//relies on structure and slides being defined

$('.slide').hide(); //hide everything

$("#start_button").click(function() {
  exp.go();
});

$("#trial-confusing").change(function() {
  if ($(this).is(":checked")) {
    $("#reason-container").show();
  } else {
    $("#reason-container").hide();
  }
})

exp.go(); //show first slide
}
