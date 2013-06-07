var id = 'content';
var dom = tinymce.DOM;
dom.removeClass('wp-' + id + '-wrap', 'html-active');
dom.removeClass('wp-' + id + '-wrap', 'tmce-active');
dom.addClass('wp-' + id + '-wrap', 'markdown-active');
var ed = tinyMCE.get(id);
if (ed) {
    ed.hide();
}
