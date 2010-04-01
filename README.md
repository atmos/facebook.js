Facebook Connect for Express
============================

[Facebook Connect][fbconnect] for [express][express].

You Need
========

* [kiwi][kiwi]
* [hashlib][hashlib]

Install Kiwi Dependencies
=========================

    % kiwi install node
    % kiwi install express

Examples
========

* See [examples/fb_connect][example] for an example.
* [webhooks][webhooks] for a use case

Running
=======

    % export FB_API_KEY="your api key from facebook"
    % export FB_SECRET_KEY="your secret key from facebook"
    % node examples/fb_connect/app.js

Based On
========
* [node-facebook][nodefb] article on [how-to-node][howtonode]

[kiwi]: http://github.com/visionmedia/kiwi
[nodefb]: http://github.com/dominiek/node-facebook
[hashlib]: http://github.com/brainfucker/hashlib
[express]: http://github.com/visionmedia/express
[example]: node-facebook/blob/master/examples/fb_connect
[webhooks]: http://github.com/atmos/webhooks.js
[fbconnect]: http://developers.facebook.com/connect.php
[howtonode]: http://howtonode.org/facebook-connect
