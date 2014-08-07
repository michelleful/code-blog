---
layout: post
title:  A gentle introduction to fold and reduce
tags: 
- functional-programming
- fold
- reduce
- programming
---

**Summary**: A few months ago, I took Martin Odersky's Coursera course
["Functional Programming Principles in Scala"](https://www.coursera.org/course/progfun)
(which was great, by the way - I totally recommend it!).
One thing I had some trouble wrapping my head around was the function `fold`
(and the associated `reduce`), so I went online and read quite a few articles
about how it works. Here's my own gentle introduction synthesising what I learned,
featuring visualisations and quizzes to cement your own understanding.
Examples are in Scala, but should generalise to any functional programming
language.


### What is `fold`?

Suppose you have a function that takes two arguments and combines them to
give a result. You know lots of functions like this -- addition `+` is one,
multiplication `*` is another. How can you generalise this function to handle
more than two arguments, specifically, a whole list of elements? [1]

This is where `fold` comes in. `fold` is a higher-order function
that takes a binary function and an accumulator (we'll get to what this means
soon), and returns a function capable of processing a whole list of elements
in a logical way.

<br/>
**Quiz 1**

(1) If you apply `fold` to `+`, what array function do you get?

<form class="textType">
  <input type="text" name="qn1" answer="sum" hint="The answer starts with 's'." discuss="">
  <span class="result">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <input type="submit" value="Check">
  <div class="hint"></div>
</form>
<br/>

(2) If you apply `fold` to `*`, what array function do you get?

<form class="textType">
  <input type="text" name="qn2" answer="product" hint="The answer starts with 'p'." discuss="">
  <span class="result">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <input type="submit" value="Check">
  <div class="hint"></div>
</form>
<br/>

Now let's talk about what `fold` needs in order to be defined:

* the binary function
* an initial value for the accumulator. Think of this as the zero-value --
  the value you want returned if the array is empty. Another way to think
  of it is as the identity value of the binary function.

In the case of `sum`, these will be:

* binary addition, `(a,b) => a+b`
* `0`

The full definition is as follows:

`def sum(list: List[Int]): Int = list.fold(0)((a,b) => a+b)`

The following visualisation shows how `fold` works. Specifically, 
it shows how a variant of `fold` called `foldLeft` works, so named
because it goes from left to right:

TODO: animation

By now, it should be clear why `fold` and *accumulator* are called what they are.
Here's another way of picturing what's going on.

TODO: diagram

So the accumulator starts at the zero-value, gradually accumulates
the intermediate values, and is returned when the array is finished.

(Confused about `fold` vs `foldLeft`? Don't worry, 
it will be explained in the third section.
I'll use `foldLeft` until then.)

**Quiz 2**

(3) What should the initial accumulator value be when defining `product`?

<form class="textType">
  <input type="text" name="qn3" answer="1" hint="n * x = n" discuss="">
  <span class="result">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <input type="submit" value="Check">
  <div class="hint"></div></form>
<br/>

The complete definition of `product` is:

`def product(list: List[Int]): Int = list.foldLeft(1)((a,b) => a*b)`

(4) What does `product(List())` give us? Check all correct answers.

<form>
  <input type="checkbox" name="product-empty-list" value="wrong">&nbsp;0</input><br/>
  <input type="checkbox" name="product-empty-list" value="correct">&nbsp;1</input><br/>
  <input type="checkbox" name="product-empty-list" value="correct">&nbsp;The initial value of the accumulator</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>

(5) What does `product(List(2))` give us? Check all correct answers.

<form>
  <input type="checkbox" name="product-empty-list" value="correct">&nbsp;0</input><br/>
  <input type="checkbox" name="product-empty-list" value="correct">&nbsp;1</input><br/>
  <input type="checkbox" name="product-empty-list" value="correct">&nbsp;2</input><br/>
  <input type="checkbox" name="product-empty-list" value="correct">&nbsp;The initial value of the accumulator</input><br/>
  <input type="checkbox" name="product-empty-list" value="correct">&nbsp;The initial value of the accumulator * the value of the first element</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>

When the result of a `fold` function is applied to an empty array,
we just get the accumulator back. When it is applied to an array
of length 1, we get the result of the binary function applied to the
accumulator and that element.

(6) True or False? With `foldLeft`, 
the initial value of the accumulator must be of the same
type as the return value of the array function.

<form>
  <input type="radio" name="True" value="True">&nbsp;True</input><br/>
  <input type="radio" name="True" value="False">&nbsp;False</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>

(7) True or False? With `foldLeft`, an accumulator must be of the same type as the elements
of the array.

<form>
  <input type="radio" name="False" value="True">&nbsp;True</input><br/>
  <input type="radio" name="False" value="False">&nbsp;False</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>

### More advanced examples

That last question was a bit tricky, so don't feel bad if you didn't get it
right. So far, the two examples we've seen have involved binary functions
that accept two elements of the same type. However, that doesn't need to be
the case. Let's go through two examples where the accumulator is of a different
type from the elements of the array (examples from [2]).

The first example is `count`. Using `foldLeft`, we'll write a function that
returns the length of the array. We'll need to specify the binary function
as well as the initial value of the accumulator.

**Quiz 3**

(8) What should the initial accumulator value of the `count` function be?

<form class="textType">
  <input type="text" name="qn8" answer="0" hint="What should be returned if the list is empty?" discuss="">
  <span class="result">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <input type="submit" value="Check">
  <div class="hint"></div></form>
<br/>

(9) Complete the binary function:

<form class="textType">
  (sum, _) => <input type="text" name="qn2" answer="sum + 1" hint="Increment the operator by 1. Put spaces around the operator." discuss="">
  <span class="result">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <input type="submit" value="Check">
  <div class="hint"></div>
</form>
<br/>

If you're not familiar with Scala syntax, the expression above
specifies an anonymous function that accepts two arguments: `sum`, 
the accumulator, and an unnamed argument `_`. This unnamed argument
represents an element of the array. The return value is on the right
hand side of `=>`.

The complete `count` function is: `def count(list: List[Any]): Int = list.foldLeft(0)((sum, _) => sum + 1)`.

<br/>

Okay, great work! Now let's parse out another example: converting a 
list into a set. This can also be done using `foldLeft`! In fact, here's how.

`def toSet[A](list: List[A]): Set[A] = list.foldLeft(Set[A]())((set, elt) => set + elt)`

There may be a lot here you're unfamiliar with, if you don't know Scala.
`[A]` simply represents the datatype of the elements of the list. If you're supplied 
with a `List` of type `A`, you'll get back a set with elements of type `A`.

First we need the initial accumulator value. That's easy: it should be the empty set.
Next we need the binary function combining the accumulator (the set built so far)
and the next element of the array. This is simply set addition, which you see
on the right.


### `fold`, `foldLeft` and `foldRight`, what gives?

So far, we've been using `foldLeft` to specify our functions,
rather than `fold` or `foldRight`. These aren't interchangeable:
if we try to substitute `foldLeft` in the definition of `count` with
either of the other alternatives, we get compilation errors.

`def count(list: List[Any]): Int = list.fold(0)((sum,_) => sum + 1)` DOESN'T WORK!
`def count(list: List[Any]): Int = list.foldRight(0)((sum,_) => sum + 1)` DOESN'T WORK!

To understand why, we'll need to delve into the concept of *associativity*,
which basically means: we don't have to worry about bracketing.

Consider a simple addition: `1 + 2 + 3`. No matter where we insert brackets,
we get same result. `(1 + 2) + 3 = 1 + 2 + 3 = 1 + (2 + 3)`. 
Addition is therefore associative.

**Quiz 4**

(10) Check all the associative functions below.

<form>
<input type="checkbox" name="correct" value="plus">&nbsp;+<br/>
<input type="checkbox" name="wrong" value="minus">&nbsp;-</br/> 
<input type="checkbox" name="correct" value="plus">&nbsp;*<br/>
<input type="checkbox" name="wrong" value="minus">&nbsp;/</br/> 
<input type="checkbox" name="wrong" value="plus">&nbsp;(sum,_) => sum + 1<br/>
<input type="submit" value="Check">
</form>

<br/>

That last one is tricky, because it looks just like addition. But
the types of the two arguments are different. `sum` is an integer, but `_`
is an element of any type. `(sum + _) + _` does not equal `sum + (_ + _)`
because the latter is not necessarily even defined.
The same goes for the binary function in `toSet`.

Plain `fold` requires that the binary function supplied to it be 
associative. Hence why `def count(list: List[Any]): Int = list.fold(0)((sum,_) => sum + 1)`
didn't work: `(sum,_) => sum + 1` wasn't associative.

Now let's talk about left- and right-associativity.

Left-associative functions are simply those that normally run from left
to right: `x op y op z = (x op y) op z`. The binary function `sum + _`
is left-associative because `(sum + _) + _` makes sense: the inner
parenthesis yields a new sum, which then combines with the next element.
`foldLeft` operates from left to right, and hence requires that 
the binary function supplied to it be at least 
left-associative.

TODO: diagram

Right-associative functions, consequently, are those that normally run 
from right to left: `x op y op z = x op (y op z)`. `foldRight` can only
operate with right-associative functions.

**Quiz 5**

(11) True or False? `count` cannot be implemented with `foldRight`.

<form>
  <input type="radio" name="True" value="True">&nbsp;True</input><br/>
  <input type="radio" name="True" value="False">&nbsp;False</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>

In fact, it can:
`def count(list: List[Any]): Int = list.foldRight(0)((_, sum) => sum + 1)`

<br/>

Now we know how `foldLeft` and `foldRight` process the elements, but what
about `fold`? In fact, `fold` does not guarantee the order in which it 
processes the elements. It could go left-to-right. It could go right-to-left.
It could do this:

TODO: diagram

All of these are possibilities because the binary function supplied to it is associative.
There is no difference in result, whichever way it goes.
This means that instead of processing the elements one by one, we can actually run many
of the computations in parallel, and speed up the whole function considerably.

**Quiz 5**

(11) True or False? With `foldRight`, an accumulator must be of the same type as the elements
of the array.

<form>
  <input type="radio" name="False" value="True">&nbsp;True</input><br/>
  <input type="radio" name="False" value="False">&nbsp;False</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>

(12) True or False? With `fold`, an accumulator must be of the same type as the elements
of the array.

<form>
  <input type="radio" name="True" value="True">&nbsp;True</input><br/>
  <input type="radio" name="True" value="False">&nbsp;False</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>


You may now be asking yourself, which of the three functions should I use?
`fold`, `foldLeft`, or `foldRight`?
Here's a rule-of-thumb:

- If it's associative, use `fold`, so that the compiler can parallelise the
computation as shown above.
- Otherwise, use `foldLeft` and try avoiding `
foldRight` whenever you can.
[Matt Malone explains why.](http://oldfashionedsoftware.com/2009/07/10/scala-code-review-foldleft-and-foldright/) [3]

One caveat to this is that `foldRight` can actually be applied to infinite lists
in Haskell and any language that does lazy evaluation (not in standard Scala, but see Scalaz), 
while `foldLeft` cannot. For more on this, read [anrizal's article.](http://voidmainargs.blogspot.com/2011/08/folding-stream-with-scala.html) [4]

### But what about `reduce`?

If you come from a non-functional programming background like me, you might never have
heard of `fold`, and only about `reduce`, made famous by Google's MapReduce paradigm.
`reduce` is actually a special case of `fold`, in which the initial accumulator value
is set to be the first (or last) value of the array, and the rest of the array is then
processed accordingly.

`reduceLeft = list.tail.foldLeft(list.head)` [5]

The following animation gives an example.

TODO: animation

**Quiz 6**

(13) True or False? A function defined with `reduce` must return the same type
as the elements in the array.

<form>
  <input type="radio" name="True" value="True">&nbsp;True</input><br/>
  <input type="radio" name="True" value="False">&nbsp;False</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>

(14) Suppose we implement `sum` as: `def sum3(list: List[Int]): Int = list.reduce((r,c) => r+c)`.
What does `sum(List())` return?

<form>
  <input type="radio" name="error" value="0">&nbsp;0</input><br/>
  <input type="radio" name="error" value="1">&nbsp;1</input><br/>
  <input type="radio" name="error" value="error">&nbsp;Throws an error</input>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="submit" value="Check">
</form>
<br/>


**Further reading**

I hope that by now you've acquired a better intuition for `fold`, and
will go forth and wield it with confidence. If you'd like to read further, 
I recommend these articles, which I found the most helpful in my reading.

[1] <br/>
[2] Matt Malone, [Lots And Lots Of foldLeft Examples](http://oldfashionedsoftware.com/2009/07/30/lots-and-lots-of-foldleft-examples/) (great resource!) <br/>
[3] Matt Malone, [Scala Code Review: foldLeft and foldRight](http://oldfashionedsoftware.com/2009/07/10/scala-code-review-foldleft-and-foldright/) <br/>
[4] <br/>
[5] <br/>
