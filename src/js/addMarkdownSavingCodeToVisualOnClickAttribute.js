var pulseStormSetOnPage = function (e, t) {
    var n = document.getElementById(e);
    if (!n) {
        n = document.createElement('input');
        n.setAttribute('type', 'hidden');
        n.setAttribute('name', e);
        n.setAttribute('id', e);
        document.getElementsByTagName('body')[0].appendChild(n);
    }
    n.setAttribute('value', t);
};

pulseStormSetOnPage('pulseStormMarkdownHoldingArea', document.forms.post.content.value);