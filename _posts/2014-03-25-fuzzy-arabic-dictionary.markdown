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

Arabic is hard!
---------------

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
the writing system. Not only does it go right-to-left, with letters
changing shape according to their surroundings (these are all 
the same letter: عـ ـعـ ـع ع), they have to master
a very different phonemic inventory with plenty of unfamiliar sounds.

Here's ق /q/, the voiceless uvular stop, which to an English speaker
might as well be /k/:

<center>
<audio controls>
  <source src="http://upload.wikimedia.org/wikipedia/commons/1/19/Voiceless_uvular_plosive.ogg" type="audio/ogg">
  Your browser does not support the audio tag.
</audio>
*Source: <a href="http://en.wikipedia.org/wiki/Voiceless_uvular_stop">Wikipedia</a>*
</center>

The pharyngeal fricative ع /ʕ/ sounds like an /a/ with a sore throat:

<center>
<audio controls>
  <source src="http://upload.wikimedia.org/wikipedia/commons/c/cd/Voiced_pharyngeal_fricative.ogg" type="audio/ogg">
  Your browser does not support the audio tag.
</audio>
*Source: <a href="http://en.wikipedia.org/wiki/Voiced_pharyngeal_fricative">Wikipedia</a>*
</center>

The "emphatic" consonants such as ط /tˤ/ are pronounced with a 
secondary constriction of the pharynx, which sounds like a normal /t/
followed by a backer, rounder, lower vowel; there's a short vs long vowel
distinction that English lacks...the list goes on.

The dictionaries are crazy
--------------------------

Well, actually, they're very well-constructed, but you need to be intimately
familiar with Arabic morphology to use them. Arabic words are constructed
on a non-concatenative, root-and-pattern schema. 
For example, the following words are all related:

<center>
<table>
<tr><td>kataba</td><td>he wrote</td></tr>
<tr><td>kutiba</td><td>it was written</td></tr>
<tr><td>maktab</td><td>office</td></tr>
<tr><td>kita:b</td><td>book</td></tr>
<tr><td>ka:tib</td><td>writer</td></tr>
<tr><td>mikta:b</td><td>typewriter</td></tr>
</table>
</center>

Notice that none of them share a contiguous sequence of letters.
However, they all share the discontiguous subsequence k-t-b.
This is called the root. When a root like k-t-b is combined with a pattern
such as CiCa:C, the root consonants are substituted for the C slots
to form kita:b. That's how Arabic morphology works, it's super neat,
and a bit of a puzzle as to how it's learned (which is something I'm working on
as part of my linguistics research).

To return to dictionaries: all of the words in the table above would be
listed together,under the root k-t-b, because most Arabic dictionaries 
are organised by root.
So in order to look up a word in a dictionary, you need to split a word
into a root and pattern. Again, not an easy task for the beginning learner.

Enter the Fuzzy Arabic Dictionary
---------------------------------

This was actually the first webapp I ever built, probably around 2007, using
CGI/Perl. When a user entered a word in English transliteration such as 
\<kitab\>, I'd match each letter with possible variants, for example \<k\>
could match /k/ or /q/, \<i\> could match a long or short vowel, \<t\> could
match /t/ or /tˤ/, etc. I'd take all the possible combinations and pass them
through the free <a href="http://catalog.ldc.upenn.edu/LDC2002L49">Buckwalter 
Arabic Morphological Analyzer</a>, which consists of a Perl script with several
dictionary files, giving glosses and part-of-speech information.

It worked pretty well for my very first webapp, but recently I stumbled across 
<a href="http://yamli.com">Yamli</a>, which develops tools to help Arabic users
access the internet more easily. One of these is a 
<a href="http://www.yamli.com/arabic-keyboard/">smart Arabic keyboard</a>,
which lets you type words in English transliteration of Arabic chat alphabet
and instantly suggests Arabic words they might correspond to.
You can try it in the Yamlified textbox below.

<center>
<input type="text" id="arabictextbox">
</center>  

But there didn't seem to be a tool that combined those suggestions with
an Arabic-English dictionary. 
<a href="http://fuzzyarabic.herokuapp.com/">So I built it</a>
as a second-generation, snazzier version of the earlier (now defunct)
Fuzzy Arabic Dictionary. 

It's a pretty simple Flask app deployed on Heroku, which takes Yamli's
suggested words and sends them via Ajax to a Python port of the Buckwalter
Arabic Morphological Analyzer. 
<a href="https://github.com/michelleful/FuzzyArabicDict">The code is 
here.</a>

It's not perfect: the Buckwalter Arabic Morphological Analyzer was updated
a couple of times after the free 1.0 version, but those versions 
require a licence fee.
So there are a few errors in terms of part of speech, etc. 
Also, there are times when Yamli
doesn't suggest a word I might expect, for example "ab" doesn't give me 
August (آب). On the whole, though, I'm pretty pleased with the result.

<image src="{{ site.baseurl }}/assets/fuzzy_madrasa.png" width="100%"
       alt="Screenshot of the Fuzzy Arabic Dictionary with the word 'madrasa'">

<a href="http://fuzzyarabic.herokuapp.com/">Give it a try</a>, 
and if you have bug reports*, suggestions, etc., 
let me know in the comments.

*I probably won't do anything if it's an IE problem, though. Sorry.


<!-- YAMLI CODE START -->
<script type="text/javascript" src="http://api.yamli.com/js/yamli_api.js"></script>
<script type="text/javascript">
  if (typeof(Yamli) == "object" && Yamli.init( { uiLanguage: "en" , startMode: "onOrUserDefault" } ))
  {
    Yamli.yamlify( "arabictextbox", { settingsPlacement: "inside" } );
  }
</script>
<!-- YAMLI CODE END -->
