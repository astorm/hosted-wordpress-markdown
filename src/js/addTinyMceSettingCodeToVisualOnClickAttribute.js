setTimeout(function () {
    var e = document.getElementById('pulseStormHtmlHoldingArea'),
        ed;
    if (!e) {
        //console.log('no element');
        return;
    }
    if (e.value === 'no_action') {
        //console.log('no value is no_action');
        return;
    }
    if (!e.value) {
        //console.log('no e.value');
        return;
    }
    document.forms.post.content = e.value;
    ed = tinyMCE.get('content');
    if (ed) {
        //console.log('founs editor');
        ed.setContent(e.value);
    }
    e.value = 'no_action';
}, 1000);
