hosted-wordpress-markdown
=========================

Google Chrome extension to inject a markdown aware editor into WordPress.com's main post editor.

This is beta software, use at your own risk.

Building inject.js
--------------------------------------------------
Because WordPress uses a number of `onclick` attribute handlers and events setup in the Chrome plugin Sandbox fire **after** these `onclick` handlers, there are times where we need to inject additional code directly into the DOM. This is done with a syntax that looks like

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
    
[... explain build system here after you've written it ...]    
    
    

Lint for Javascript Files
--------------------------------------------------
We're passing all the Javascript fragments though JSLint (via NPM's nodelint)

    $ nodelint --config src/js/config.js src/js/*.js


Versions of Markdown
--------------------------------------------------
Our current version to convert markdown into HTML before saving is Pagedown.

    https://code.google.com/p/pagedown/
    
We're also using to-markdown to convert the saved HTML back into Markdown for editing

    https://github.com/domchristie/to-markdown
    
Computability problems are anticipated.  Please report any problems in the GitHub issue tracker, and if you know of a version of Markdown implemented in Javascript that can be safely round tripped, please let us know.  