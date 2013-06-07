hosted-wordpress-markdown
=========================

Google Chrome extension to inject a markdown aware editor into WordPress.com's main post editor.

This is beta software, use at your own risk.

Install
--------------------------------------------------
The file for installation are located in the 

    chrome-extension
    
directory.  You may install the extension by following the <a head="https://developer.chrome.com/extensions/getstarted.html">Load the extension instructions on this page</a>. 

There's also a packaged chrome extension in 

    builds/chrome-extension.crx

To install this file

1. Download the <a href="https://github.com/astorm/hosted-wordpress-markdown/blob/master/builds/chrome-extension.crx?raw=true">raw binary</a>

2. Open the `chrome://extensions/` page/preference window in Google Chrome

3. Drag and drop the `chrome-extension.crx` file into your browser

Building inject.js
--------------------------------------------------
Because WordPress uses a number of `onclick` attribute handlers, and events setup in the Chrome plugin Sandbox fire **after** these `onclick` handlers, there are times where we need to inject additional code directly into the DOM. This is done with a syntax that looks like

    var addTwitchToHtmlJavascriptToHtmlTab = function()
    {
        var js = 'dom=tinymce.DOM;dom.removeClass(\'wp-content-wrap\', \'tmce-active\');dom.addClass(\'wp-content-wrap\', \'html-active\');setUserSetting(\'editor\', \'html\');';			
        pulseStormInjectOnClick('content-html',js,'');
    };

The `pulseStormInjectOnClick` function is a custom function that injects code before or after existing code in an `onclick` handler.  

    var pulseStormInjectOnClick = function(name, before, after)
    
The `name` paramater is the DOM id of the element.  The `before` attribute is the string of Javascript to be inserted before the existing code.  The `after` attribute is the string of javascript to be inserted after the existing code. **Important**: This method currently (unintentionally) removes any events added via `addEventListener`.      

Because debugging and writing Javascript in string files is tedious, each code fragment in a `var js = ''` file has been broken out into an individual file in 

    src/js/*.js
    
The file at `src/inject-preprocessed.js` is the main source code file.  When you've finished editing this file, run

    bin/build-inject.php > chrome-extension/inject.js 

This PHP shell script shell, which requires the additional command line tool <a href="https://npmjs.org/package/uglify-js">`uglify-js`</a>, will output a version of `inject.js` to standard out with a generated `pulsestormBuildGetContentScript` function.  This fucntion contains the Javascript strings tobe inserted into the DOM.  

Suggestions and pull requests for a better build system [are welcome](https://github.com/astorm/hosted-wordpress-markdown/issues/7).

Lint for Javascript Files
--------------------------------------------------
We're passing all the Javascript fragments though JSLint (via NPM's nodelint)

    $ nodelint --config config/config.js src/js/*.js

There's a bash script to run the lint at

    bin/run-list.bash
    
Versions of Markdown
--------------------------------------------------
Our current version to convert markdown into HTML before saving is Pagedown.

https://code.google.com/p/pagedown/
    
We're also using to-markdown to convert the saved HTML back into Markdown for editing

https://github.com/domchristie/to-markdown
    
Compatibility problems are anticipated.  Please [report any problems in the GitHub issue tracker](https://github.com/astorm/hosted-wordpress-markdown/issues/8), and if you know of a version of Markdown implemented in Javascript that can be safely round tripped, please let us know.  