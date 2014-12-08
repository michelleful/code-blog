---
layout: post
title:  Getting a Kivy app from Ubuntu 14.04 onto your Android device
subtitle: A guide to the hoops you have to jump through
author: Michelle Fullwood
header-img: "img/post-bg-05.jpg"
tags: 
- howto
- kivy
- ubuntu
- buildozer
---

**Summary**: I've started experimenting with Kivy, following along with 
[this Kivy crash course](http://inclem.net/pages/kivy-crash-course/).
And this morning, I finally managed to get my very first Kivy app
from my 64-bit Ubuntu 14.04 installation to
my (newly-won, at a tech meetup) Kindle Fire, an Android device \*<em>dances happy dance</em>\*.
There were quite a few installation hoops to jump through, so I'm
writing them up here.

### Installing buildozer

The biggest roadblock was finding updated instructions for installing
`buildozer`, which is the recommended way to package your Kivy python
files to an Android package (with the `.apk` extension), onto Ubuntu 14.04. 
The online instructions call for installing a deprecated Ubuntu package called `ia32-libs`.
The solution was to follow the following instructions from Ben Rousch's
[Kivy installation scripts](https://github.com/brousch/kivy-installer).

{% highlight bash %}
sudo dpkg --add-architecture i386
sudo apt-get update
sudo apt-get install -y build-essential ccache git zlib1g-dev python2.7 python2.7-dev libncurses5:i386 libstdc++6:i386 zlib1g:i386 openjdk-7-jdk unzip
{% endhighlight %}

Then `pip install buildozer`.

### Compiling to .apk

This step is quite easy. First run `buildozer init` and modify whatever
variables you want to in the resultant `buildozer.spec` file, such
as the title, package name, and version number (choose one of the two
versioning methods). If you want to see a boatload of output while the Android
package is being compiled, select `Log level = 2`.

Then run `buildozer android debug`. This step may take a few minutes in
the beginning as some Android SDKs will be downloaded for you.

To run these steps, you will need to rename your main Kivy script 
to `main.py`. This is the first thing launched when your app is opened.

### Getting the .apk onto the Android device

The next step is to get Ubuntu to recognise your Android device when it's plugged in!
You may be lucky and have it work out of the box, but I wasn't that fortunate.
Luckily, there's a quick fix, which is to install the MTPfs package.

{% highlight bash %}
sudo apt-get install mtpfs
{% endhighlight %}

Now, when you connect the Android device via the USB cable, the Android
filesystem should appear on Ubuntu. Just copy the `.apk` file created
in the previous step, which will be in the `bin/` directory, 
to somewhere on the device.

Lastly, open up the Easy Installer app on your Android device (I installed
it from the Kindle App Store, for free). It will locate all `.apk` files
on your device.
Select the one(s) you want to install and click Install. You may need
to modify a setting: `Settings > Applications > Apps from Unknown Sources` should be `On`.

That's it! Your Kivy app is installed just like any other app. You can hold
down the icon and select `Remove from device` to remove it when you're done playing with it.
Have fun!
