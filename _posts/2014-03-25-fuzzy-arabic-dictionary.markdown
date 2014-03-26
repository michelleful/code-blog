---
layout: post
title:  Introducing the Fuzzy Arabic Dictionary
tags: 
- arabic
- language-learning
- projects
---

**Summary:** I built an Arabic dictionary that you can look up words
in even if you don't know how to spell them in Arabic.
<a href="http://fuzzyarabic.herokuapp.com/">The dictionary is here</a>
and <a href="https://github.com/michelleful/FuzzyArabicDict">the code is 
here</a>. Below, I discuss my motivations for building the dictionary
and the tools I used to put it together.  

### Arabic is hard!

Arabic is a difficult language to learn for English speakers.
<a href="http://www.effectivelanguagelearning.com/language-guide/language-difficulty">
The Foreign Service Institute classifies it as a Category V
language</a> alongside Chinese, Japanese and Korean, 
requiring 88 weeks or 2200 hours of class instruction
to achieve fluency -- compare this with Category I languages
like Spanish, which take 24 weeks or 600 hours.
When I was studying Arabic in college, the course was worth six
credits rather than the usual four to "compensate" us for getting
less far for the same amount of study than if we'd taken most
other languages.

One of the major difficulties beginning learners face is mastering
the writing system. It goes right-to-left. Letters change shape
according to their surroundings. For example, these are all the same
letter:

<div>
<center>
<image src="{{ site.baseurl }}/assets/images/201403/3ayn_four_shapes.png"
       alt="Four shapes of the Arabic letter 3ayn">
</center>
</div>

Even more challenging, a large number of the sounds that these letters 
represent are unfamiliar, and easily confused with other sounds.

Here's ق /q/, the voiceless uvular stop, which to an English speaker
might be an odd-sounding /k/:

<div class="topspace bottomspace">
<center>
<audio controls>
  <source src="http://upload.wikimedia.org/wikipedia/commons/1/19/Voiceless_uvular_plosive.ogg" type="audio/ogg">
  Your browser does not support the audio tag.
</audio>
<em>Source: <a href="http://en.wikipedia.org/wiki/Voiceless_uvular_stop">Wikipedia</a></em>
</center>
</div>

The pharyngeal fricative ع /ʕ/ sounds like an /a/ with a sore throat:

<div class="topspace bottomspace">
<center>
<audio controls>
  <source src="http://upload.wikimedia.org/wikipedia/commons/c/cd/Voiced_pharyngeal_fricative.ogg" type="audio/ogg">
  Your browser does not support the audio tag.
</audio>
<em>Source: <a href="http://en.wikipedia.org/wiki/Voiced_pharyngeal_fricative">Wikipedia</a></em>
</center>
</div>

The "emphatic" consonants such as ط /tˤ/ are pronounced with a 
secondary constriction of the pharynx, which sounds like a normal /t/
followed by a backer, rounder, lower vowel; there's a short vs long vowel
distinction that English lacks...the list goes on.

### Enter the Fuzzy Arabic Dictionary

This was actually the first webapp I ever built, probably around 2007, using
Perl's CGI module. When a user entered a word in English transliteration such as 
\<kitab\>, I'd match each letter with possible variants, for example \<k\>
could match /k/ or /q/, \<i\> could match a long /i:/ or a short vowel /i/, 
\<t\> could match /t/ or /tˤ/, etc. 
I'd take all the possible combinations and pass them
through the free <a href="http://catalog.ldc.upenn.edu/LDC2002L49">Buckwalter 
Arabic Morphological Analyzer</a>, which consists of a Perl script with several
dictionary files, giving glosses and part-of-speech information.

It worked pretty well for my very first webapp, and was decently fast,
but it was searching through a lot of impossible words, and could wind up
pretty far away from where the user's input started. 

I've now replaced this
part of the logic with a web service from 
<a href="http://yamli.com">Yamli</a>, which develops tools to help Arabic users
access the internet more easily. One of these is a 
<a href="http://www.yamli.com/arabic-keyboard/">smart Arabic keyboard</a>,
which lets you type words in English transliteration or 
<a href="http://en.wikipedia.org/wiki/Arabic_chat_alphabet">Arabic chat 
alphabet</a> and instantly suggests Arabic words they might correspond to.
You can try it in the Yamlified textbox below.

<div class="topspace bottomspace">
<center>
<input type="text" id="arabictextbox">
</center>
</div>

At the same time, I replaced the Perl/CGI script with a simple Flask app
deployed on Heroku. It takes Yamli's suggested words and sends them via 
Ajax (JQuery) to a Python port of the Buckwalter Arabic Morphological Analyzer.
<a href="https://github.com/michelleful/FuzzyArabicDict">The code is 
here.</a>

It's not perfect: the Buckwalter Arabic Morphological Analyzer was updated
a couple of times after the free 1.0 version, but those versions 
require a licence fee.
So there are a few errors in parts of speech, etc. 
Also, there are times when Yamli
doesn't suggest a word I might expect, for example "ab" doesn't give me 
August (آب). On the whole, though, I'm pretty pleased with the result.

<div class="topspace bottomspace">
<image src="{{ site.baseurl }}/assets/images/201403/fuzzy_madrasa.png" width="100%"
       alt="Screenshot of the Fuzzy Arabic Dictionary with the word 'madrasa'">
</div>

<a href="http://fuzzyarabic.herokuapp.com/">Give it a try</a>, 
and if you have any comments, bug reports, or suggestions, 
let me know below.


<!-- YAMLI CODE START -->
<script type="text/javascript" src="http://api.yamli.com/js/yamli_api.js"></script>
<script type="text/javascript">
  if (typeof(Yamli) == "object" && Yamli.init( { uiLanguage: "en" , startMode: "onOrUserDefault" } ))
  {
    Yamli.yamlify( "arabictextbox", { settingsPlacement: "inside" } );
  }
</script>
<!-- YAMLI CODE END -->
