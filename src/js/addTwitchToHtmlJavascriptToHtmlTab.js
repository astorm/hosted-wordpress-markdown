var dom = tinymce.DOM;
dom.removeClass('wp-content-wrap', 'tmce-active');
dom.addClass('wp-content-wrap', 'html-active');
setUserSetting('editor', 'html');
