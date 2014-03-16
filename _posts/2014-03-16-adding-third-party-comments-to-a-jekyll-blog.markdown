---
layout: post
title:  Adding third party comments to a Jekyll blog (on Github Pages)
tags: 
- jekyll 
- howto 
- github
---

Yay comments!
-------------
Look at the bottom of any of the posts on this blog and you'll see a
brand new box for comments! It was pretty easy to set this up on Jekyll.
(Whether or not it's hosted on Github Pages)

**Step 1:** Signing up for a third party commenting system.

There are a number of third party commenting systems out there.
I've gone with <a href="http://livefyre.com">livefyre</a>, but
to be honest, either <a href="http://disqus.com">Disqus</a> or
<a href="http://intensedebate.com"</a>Intense Debate</a> would
probably have done just as well.

Once you've gone through the sign-up and installation process, 
you'll be given some embed code to paste into your website.
The only thing we have to do is to put it in the right place.

**Step 2:** Adding comments to posts.

We want to have a separate comments box on each post. Therefore,
we'll need to modify `_layout/posts.html` to include comments.
But to keep the comments logic separate from the posts logic, I'll put
the embed code in a separate HTML file, and tell `_layout/posts.html`
to include the comments HTML when it displays.

{% highlight html %}
...
{% raw %}
<div class="post">{{ content }}</div>

<!-- Comments will go underneath the post -->
{% include comments.html %}
{% endraw %}
{% endhighlight %}

Now, Jekyll is going to look for a file called `comments.html` in 
`_includes/`. So create `_includes/comments.html` and paste the HTML
embed code supplied to you by the third party commenting system,
and you're done! When you push the code, you'll see a comment box
on each of your posts.

Please make full use of this feature by contributing your thoughts,
either on this post or on future ones!
