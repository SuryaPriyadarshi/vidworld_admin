/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here.
    // For complete reference see:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.toolbarGroups = [
        { name: 'tools' },
		{ name: 'clipboard', groups: ['clipboard', 'undo'] },
		//{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'forms' },
		{ name: 'insert' },
        { name: 'others' },
		//'/',
		{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
		{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
	     { name: 'styles', groups: ['format'] },
		//{ name: 'colors' },
		 { name: 'about' },
         { name: 'document', groups: ['mode', 'document', 'doctools'] }

    ];
    config.allowedContent = true;
    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.
    config.removeButtons = 'RemoveFormat,spellchecker,Cut,Copy,Paste,Subscript,Superscript,Maximize,Table,Image,Anchor,Strike,PasteFromWord,PasteText,About,Blockquote,Source,Styles';

    // Set the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';

    // Simplify the dialog windows.
    config.removeDialogTabs = 'image:advanced;link:advanced';

    // choose your custom bare with the button
  //  config.toolbar = 'TinyBare';
    // teel to the plugin howmany carateres you want
    config.MaxLength = 400;
    // and add the external plugin ;)
   // config.extraPlugins = 'charcount';
};
