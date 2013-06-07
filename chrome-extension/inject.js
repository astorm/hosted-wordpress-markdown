// The MIT License (MIT)
// 
// Copyright (c) 2013 Pulse Storm LLC. 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var bailFromMain = function () {
    if (!document.forms.post) {
        return true;
    }
    if (!document.getElementById('wpbody-content')) {
        return true;
    }
    return false;
};

var isMarkdownTabSelected = function () {
    return document.getElementById('wp-content-wrap').className.indexOf('markdown-active') !== -1;
};

var pulseStormInjectOnClick = function (name, before, after) {
    var element = document.getElementById(name),
        matches,
        script_original,
        script_new;
    if (!element) {
        return;
    }
    matches = document.getElementById(name).outerHTML.match(/onclick="(.+?)"/);
    if (!matches) {
        return;
    }
    script_original = matches[1];
    script_original += ';';
    if (before) {
        before += ';';
    }
    if (after) {
        after += ';';
    }
    script_new = 'onclick="' + before + script_original + after + '"';
    element.outerHTML = element.outerHTML.replace(/onclick=".+?"/, script_new);
};

var setOnPage = function (name, value) {
    var element = document.getElementById(name);
    if (!element) {
        element = document.createElement('input');
        element.setAttribute('type', 'hidden');
        element.setAttribute('name', name);
        element.setAttribute('id', name);
        document.getElementsByTagName('body')[0].appendChild(element);
    }
    element.setAttribute('value', value);
};
var getOnPage = function (name) {
    var element = document.getElementById(name);
    if (!element) {
        return false;
    }
    return element.value;
};

var addMarkdownTab = function () {
    //Add the Markdown Tab
    var h = document.getElementById('wp-content-editor-tools').innerHTML,
        n;
    n =  '<a id="content-markdown" class="wp-switch-editor switch-markdown" onclick=" ">';
    n += 'Markdown</a>';
    document.getElementById('wp-content-editor-tools').innerHTML = n + h;
    //end Add the tab
};

var addStyleRules = function () {
    //add style rules for switch-markdown and markdown-active class
    var css = '.markdown-active .switch-markdown { border-color: #ccc #ccc #f4f4f4;background-color: #f4f4f4;color: #555;}' + "\n",
        head,
        style;
    css = css + ".markdown-active .quicktags-toolbar {display: none;}";
    head = document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    //END: add style rules for switch-markdown and markdown-active class
};

var addOnClickJsToMarkdownTab = function () {
    var js = 'var id=\'content\';var dom=tinymce.DOM;dom.removeClass(\'wp-\'+id+\'-wrap\',\'html-active\');dom.removeClass(\'wp-\'+id+\'-wrap\',\'tmce-active\');dom.addClass(\'wp-\'+id+\'-wrap\',\'markdown-active\');var ed=tinyMCE.get(id);if(ed){ed.hide()}';
    pulseStormInjectOnClick('content-markdown', js, '');
};

var getContentFromEditor = function () {
    var theFrame = window.frames.content_ifr,
        html;
    html = document.getElementById('content').value;
    if (theFrame) {
        html = theFrame.document.getElementsByTagName('body')[0].innerHTML;
    }
    return html;
};

var addRemoveMarkdownClassJavascriptToOriginalTabs = function () {
    var js = 'var id = \'content\';var dom = tinymce.DOM;dom.removeClass(\'wp-\'+id+\'-wrap\',\'markdown-active\');';
    pulseStormInjectOnClick('content-tmce', js, '');
    pulseStormInjectOnClick('content-html', js, '');
};

//need to do this manually to avoid "editor is hidden" problem
var addShowEditorWhenClickingOnTextJavascript = function () {
    var js = 'var ed = tinyMCE.get(\'content\');if(ed){ed.show()};';
    pulseStormInjectOnClick('content-html', js, '');
};


var addTwitchToHtmlJavascriptToHtmlTab = function () {
    var js = 'dom=tinymce.DOM;dom.removeClass(\'wp-content-wrap\', \'tmce-active\');dom.addClass(\'wp-content-wrap\', \'html-active\');setUserSetting(\'editor\', \'html\');';
    pulseStormInjectOnClick('content-html', js, '');
};

var addMarkdownSavingCodeToVisualOnClickAttribute = function () {
    var jsSetOnPage = 'var pulseStormSetOnPage=function(e,t){var n=document.getElementById(e);if(!n){var n=document.createElement(\'input\');n.setAttribute(\'type\',\'hidden\');n.setAttribute(\'name\',e);n.setAttribute(\'id\',e);document.getElementsByTagName(\'body\')[0].appendChild(n)}n.setAttribute(\'value\',t)};',
        js;
    js = jsSetOnPage + 'pulseStormSetOnPage(\'pulseStormMarkdownHoldingArea\',document.forms[\'post\'][\'content\'].value)';
    pulseStormInjectOnClick('content-tmce', js, '');
};

var addTinyMceSettingCodeToVisualOnClickAttribute = function () {
    var js = 'setTimeout(function(){e=document.getElementById(\'pulseStormHtmlHoldingArea\');if(!e){console.log(\'no element\');return}if(e.value==\'no_action\'){console.log(\'no value is no_action\');return}if(!e.value){console.log(\'no e.value\');return}document.forms[\'post\'][\'content\']=e.value;ed=tinyMCE.get(\'content\');if(ed){console.log(\'founs editor\');ed.setContent(e.value)}e.value=\'no_action\'},1000);';
    pulseStormInjectOnClick('content-tmce', '', js);
};

var handlerSetupForMarkdownTab = function () {
    var pulseStormSwitchToMarkdown = function () {
        //moved most of this into onclick event handler aboveso it could access the page information.        
        document.forms.post.content.value = toMarkdown(getContentFromEditor());
    };
    document.getElementById('content-markdown').addEventListener('click', function () {
        pulseStormSwitchToMarkdown();
    }, false);
};

var handlerSetupForHtmlTab = function () {
    var contentToHtmlFromMarkdownForClickOnTextTab = function () {
        var text = document.forms.post.content.value,
            converter,
            html;
        converter = new Markdown.Converter();
        html = converter.makeHtml(text);
        // setOnPage('pulseStormMarkdownHoldingArea', html);
        document.forms.post.content.value = html;
    };
    document.getElementById('content-html').addEventListener('click', contentToHtmlFromMarkdownForClickOnTextTab, false);
};

var handlerSetupForVisualTab = function () {
    var contentToHtmlFromMarkdownForClickOnVisualTab = function () {
        var text = getOnPage('pulseStormMarkdownHoldingArea'),
            converter,
            html;
        converter = new Markdown.Converter();
        html = converter.makeHtml(text);
        setOnPage('pulseStormHtmlHoldingArea', html);
    };
    document.getElementById('content-tmce').addEventListener('click', contentToHtmlFromMarkdownForClickOnVisualTab, false);
};

var handlerSetupForPublishButton = function () {
    document.getElementById('publish').addEventListener('click', function () {
        if (isMarkdownTabSelected()) {
            var text = document.forms.post.content.value,
                converter,
                html;
            converter = new Markdown.Converter();
            html = converter.makeHtml(text);
            // setOnPage('pulseStormMarkdownHoldingArea', html);
            document.forms.post.content.value = html;
        }
    });
};

var main = function () {
    if (bailFromMain()) {
        return;
    }
    addMarkdownTab();
    addStyleRules();
    addOnClickJsToMarkdownTab();
    addRemoveMarkdownClassJavascriptToOriginalTabs();
    addTwitchToHtmlJavascriptToHtmlTab();
    addMarkdownSavingCodeToVisualOnClickAttribute();
    addTinyMceSettingCodeToVisualOnClickAttribute();
    handlerSetupForMarkdownTab();
    handlerSetupForHtmlTab();
    handlerSetupForVisualTab();
    handlerSetupForPublishButton();
};
main();