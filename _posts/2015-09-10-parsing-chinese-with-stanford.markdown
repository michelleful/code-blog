---
layout: post
title: Parsing Chinese text with Stanford NLP
subtitle:
author: Michelle Fullwood
header-img: "img/chinese.jpg"
header-img-credit: <a href="https://commons.wikimedia.org/wiki/File:LantingXu.jpg">Excerpt of the Lantingji Xu, Wikimedia Commons</a>
tags:
- natural language processing
- java
- stanford-nlp
- parsing
- chinese
- mandarin
---

I'm doing some natural language processing on (Mandarin) Chinese text right now,
using Stanford's NLP tools, and I'm documenting the steps here.
I'm just calling the tools from the command line, in a Unix environment, so
if your use case is different from that, this probably won't help you.

The tools we'll be using are:

* The [Stanford Word Segmenter, version 3.5.2](http://nlp.stanford.edu/software/segmenter.shtml)
* The [Stanford Parser, version 3.5.2](http://nlp.stanford.edu/software/lex-parser.shtml)

### Step 1: Segmenting Chinese text

Mandarin Chinese is written without spaces between words, for example:

世界就是一个疯子的囚笼<br/>
"The world is a den of crazies."

That's a sentence from the [Tatoeba sentence corpus](http://tatoeba.org/eng/),
which is what I'm working on parsing, by the way.

Unsurprisingly, all natural language processing on Chinese text
starts with word segmentation -- we won't get far by trying to interpret
that whole string as a single element. There are lots
of segmenters out there, including `jieba` in Python, which I like, but they
may have different conventions for how they split things up. So if we're going
to use the output of the segmentation in another Stanford tool downstream, it's
best to stick to the Stanford Word Segmenter, whose usage is simple enough
with the script provided:

{% highlight bash %}
./segment.sh pku path/to/input.file UTF-8 0 > path/to/segmented.file
{% endhighlight %}

The first argument can be either `pku` (for Beijing (Peking) University)
or `ctb` (for Chinese Treebank). According to the docs, `pku` results
in "smaller vocabulary sizes and OOV rates on test data than CTB models",
so I went with that.
"0" at the end indicates that we want the single best guess at the segmentation,
without printing its associated probability.

If you're curious, the output of the segmenter on the sentence above is:

世界&nbsp;&nbsp;&nbsp;就&nbsp;&nbsp;&nbsp;是&nbsp;&nbsp;&nbsp;一个
&nbsp;&nbsp;&nbsp;疯子&nbsp;&nbsp;&nbsp;的&nbsp;&nbsp;&nbsp;囚笼

which is an eminently sensible segmentation.

The load times on the segmenter are pretty horrible, so it's worth it to stuff
all your text into a single file and segment everything at one go.

### Step 2: Parsing

The Stanford parser gives two different kinds of outputs, a constituency
parse, which shows the syntactic structure of the sentence:

    (ROOT
      (IP
        (NP (NN 世界))
        (VP
          (ADVP (AD 就))
          (VP (VC 是)
            (NP
              (DNP
                (NP
                  (QP (CD 一)
                    (CLP (M 个)))
                  (NP (NN 疯子)))
                (DEG 的))
              (NP (NN 囚笼)))))))

And a dependency parse, which shows, broadly speaking, the grammatical relations
the words have to each other:

    nsubj(囚笼-8, 世界-1)
    advmod(囚笼-8, 就-2)
    cop(囚笼-8, 是-3)
    nummod(个-5, 一-4)
    clf(疯子-6, 个-5)
    assmod(囚笼-8, 疯子-6)
    case(疯子-6, 的-7)
    root(ROOT-0, 囚笼-8)

There are specialized dependency parsers out there, but the Stanford parser first
does a constituency parse and converts it to a dependency parse. This
approach [seems to work better in general](http://nlp.stanford.edu/pubs/lrecstanforddeps_final_final.pdf).

There are five Chinese parsing models supplied with the software, which
you can see by `less`-ing the `stanford-parser-3.5.2-models.jar` file.

* edu/stanford/nlp/models/lexparser/chinesePCFG.ser.gz
* edu/stanford/nlp/models/lexparser/chineseFactored.ser.gz
* edu/stanford/nlp/models/lexparser/xinhuaFactoredSegmenting.ser.gz
* edu/stanford/nlp/models/lexparser/xinhuaFactored.ser.gz
* edu/stanford/nlp/models/lexparser/xinhuaPCFG.ser.gz

[The FAQ](http://nlp.stanford.edu/software/parser-faq.shtml#o)
says that the PCFG grammars are the fastest, but the factored grammars are the
most performant. So choosing either `xinhuaFactored` or `chineseFactored`
is the way to go. The `xinhua` models are trained on newswire data, while
the `chinese` models include more varied types of text including some from
other regions, so select the model that best fits your data.

In addition, there is a `xinhuaFactoredSegmenting` model. This works on
unsegmented text, allowing us to bypass the segmentation procedure in Step 1.
However, this isn't recommended as it doesn't perform as well as the standalone
Segmenter.

Now that we've chosen our model, it's time to actually do the parsing.
There is a `lexparser-lang.sh` helper script, but it assumes you're using
GB18030 encoding for your Chinese text. It's simple to edit the script
to include an `-encoding utf-8` flag, but it's not that much more difficult
to just construct the Java call yourself.

Here's how to get the constituency parse:

    java
    -mx500m
    -cp stanford-parser.jar:stanford-parser-3.5.2-models.jar edu.stanford.nlp.parser.lexparser.LexicalizedParser
    -encoding utf-8
    edu/stanford/nlp/models/lexparser/chineseFactored.ser.gz
    path/to/segmented.file > path/to/constituency.parsed.file

To get the dependency parse, just add an `outputFormat` flag, and specify
`typedDependencies`:

    java
    -mx500m
    -cp stanford-parser.jar:stanford-parser-3.5.2-models.jar edu.stanford.nlp.parser.lexparser.LexicalizedParser
    -encoding utf-8
    -outputFormat typedDependencies
    edu/stanford/nlp/models/lexparser/chineseFactored.ser.gz
    path/to/segmented.file > path/to/dependency.parsed.file

Incidentally, the parse that was chosen for this sentence is *not*
the intended reading -- it's interpreting the sentence as
"The world is the den of a single (unspecified) crazy person".
Which seems scarily close to truth.

You might want to consider the possibility of multiple parses, therefore.
To get multiple parses, we need to use one of the PCFG parsers
(not the factored parsers), and
add the flag `-printPCFGkBest n`, where `n` is 2 or more.


### Troubleshooting

The two errors I got while trying to do the parsing step had to do with
getting the appropriate Java version running, and supplying the correct
classPath.

Version 3.5.2 requires Java 8. If you don't have it, it will turn up the
error `Unsupported major.minor version 52.0`. If you get this error,
make sure that (a) you have Java 8 installed, and that
(b) `java` invokes Java 8. To do the latter, do

{% highlight bash %}
sudo update-alternatives --config java
{% endhighlight %}

and select Java 8.

The second error you may come across if you follow the commands supplied in
the docs is `Unable to resolve
"edu/stanford/nlp/models/lexparser/chineseFactored.ser.gz"
as either class path, filename or URL`.

If you get this, check the classPath (`-cp`) argument you're passing to Java.
It should have two parts: the parser `.jar`, and the models `.jar`, separated
by a colon (a semi-colon in some other OSes).

{% highlight bash %}
-cp stanford-parser.jar:stanford-parser-3.5.2-models.jar
{% endhighlight %}

### Conclusion

I'm really grateful that Stanford makes all this great software available,
and particularly for non-English languages. I hope this guide saves someone
some time in getting the Chinese parser working. If all goes well, I'll be
sharing what I've been using it for soon.
