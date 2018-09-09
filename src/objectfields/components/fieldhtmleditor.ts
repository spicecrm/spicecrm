import { AfterViewInit, Component, OnDestroy, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {configurationService} from '../../services/configuration.service';
import {footer} from '../../services/footer.service';

declare var tinymce: any;
declare var _;

@Component({
    selector: 'field-html-editor',
    templateUrl: './src/objectfields/templates/fieldhtmleditor.html',
    styles: [
        ':host >>> .mce-ico{font-size: 12px; color: #54698d;}',
        ':host >>> .mce-text{font-size: 12px; color: #54698d;}',
        ':host >>> .mce-btn button{font-size: 12px; color: #54698d;}',
        ':host >>> .mce-tinymce{border-radius: 4px}',
        ':host >>> .mce-widget{font-family: \'Titillium Web\', sans-serif;}'
    ]
})
export class fieldHtmlEditor implements AfterViewInit, OnDestroy, OnChanges, OnInit {

    @Input() fieldvalue: string = '';
    @Input() fieldid: string = '';
    @Input() fieldconfig: any = {};
    @Input() useStylesheetSwitcher: boolean;
    @Input() useStylesheets: boolean;
    editor: any = null;
    stylesheets: Array<any>;
    stylesheetIdValue: string = '';

    tinymceConfig = <any>{
        remove_script_host: true,
        relative_urls: false,
        menubar: false,
        statusbar: true,
        resize: true,
        browser_spellcheck: true,
        image_advtab: true,
        paste_as_text: true,
        paste_filter_drop: true,
        plugins: ['link', 'code', 'image', 'lists', 'paste', 'table'],
        toolbar: 'undo redo | formatselect | styleselect bold italic removeformat | bullist numlist | link image table | code',
        skin_url: 'vendor/tinymce/skins/lightgray',
        setup: editor => {
            this.editor = editor;
            editor.on('change', () => {
                const content = editor.getContent();
                this.content = content;
            });
            editor.on("init", () => {
                    if (this.fieldvalue)
                        this.editor.setContent(this.fieldvalue);
                }
            );
        },
        formats: {
            alignleft: {
                selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
                classes: 'align-left'
            },
            aligncenter: {
                selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
                classes: 'align-center'
            },
            alignright: {
                selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
                classes: 'align-right'
            },
            alignjustify: {
                selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
                classes: 'align-justify'
            },
            strikethrough: {inline: 'del'}
        },
        style_formats: [
                { title: 'Inline', items: [
                        {title: 'fett', icon: 'bold', format: 'bold'},
                        {title: 'kursiv', icon: 'italic', format: 'italic'},
                        {title: 'unterstrichen', icon: 'underline', format: 'underline'},
                        {title: 'strikethrough', icon: 'strikethrough', format: 'strikethrough'},
                        {title: 'hochgestellt', icon: 'superscript', format: 'superscript'},
                        {title: 'tiefgestellt', icon: 'subscript', format: 'subscript'}
                ]},
                { title: 'Ausrichtung', items: [
                        {title: 'links', icon: 'alignleft', format: 'alignleft'},
                        {title: 'mittig', icon: 'aligncenter', format: 'aligncenter'},
                        {title: 'rechts', icon: 'alignright', format: 'alignright'},
                        {title: 'Blocksatz', icon: 'alignjustify', format: 'alignjustify'}
                ]}
        ],
        style_formats_merge: false,
        body_class: 'spice',
    };

    get content() {
        return this.fieldvalue;
    }
    set content(val) {
        this.fieldvalue = val;
        this.contentchange.emit(val);
    }

    @Input('stylesheetId')
    set input_stylesheetId( id: string ) {
        this.stylesheetIdValue = id;
    }
    set stylesheetId( id: string ) {
        this.stylesheetIdValue = id;
        this.stylesheetIdChange.emit( id );
    }
    get stylesheetId(): string {
        return this.stylesheetIdValue;
    }

    oldStylesheetId: string = '';

    @Output() contentchange: EventEmitter<any> = new EventEmitter<any>();
    @Output() stylesheetIdChange: EventEmitter<any> = new EventEmitter<any>();

    constructor( private metadata: metadata, private footer: footer, private configurationService: configurationService, private modal: modal ) {
        this.stylesheets = this.metadata.getHtmlStylesheetNames();
    }

    ngOnInit() {
        this.tinymceConfig.selector = '#' + this.fieldid;
        this.tinymceConfig.document_base_url = this.configurationService.getFrontendUrl();
    }

    ngAfterViewInit() {
        this.metadata.loadLibs('tinymce').subscribe(
            (next) => {
                let addButtons = '';
                if ( this.useStylesheets ) this.setStylesheet();
                tinymce.init( this.tinymceConfig );
            }
        );
    }

    changeStylesheet() {
        if ( this.editor ) tinymce.remove( this.editor );
        this.setStylesheet();
        tinymce.init( this.tinymceConfig );
    }

    setStylesheet() {
        let formats = [];
        this.oldStylesheetId = this.stylesheetId;
        if ( !_.isEmpty( this.stylesheetId )) {
            formats = this.metadata.getHtmlFormats( this.stylesheetId );
            if ( formats.length ) {
                let formatcounter = 0;
                this.tinymceConfig.block_formats = '';
                this.tinymceConfig.extended_valid_elements = [];
                this.tinymceConfig.custom_elements = [];
                this.tinymceConfig.block_formats += 'Absatz=p;';
                this.tinymceConfig.style_formats.push({ title: 'Weiteres', items: [] });
                for ( let format of formats ) {
                    if ( !_.isEmpty( format.block )) {
                        formatcounter++;
                        let xy;
                        this.tinymceConfig.formats[xy = 'custom_format_' + formatcounter] = {
                            title: format.name,
                            inline: format.inline,
                            block: format.block,
                            classes: format.classes,
                            styles: format.styles,
                            wrapper: Boolean( Number( format.wrapper ) )
                        };
                        this.tinymceConfig.block_formats += format.name + '=' + xy + ';';
                        if ( this.tinymceConfig.extended_valid_elements.indexOf( format.block )) this.tinymceConfig.extended_valid_elements.push( format.block );
                        if ( this.tinymceConfig.custom_elements.indexOf( format.block )) this.tinymceConfig.custom_elements.push( format.block );
                    } else {
                        this.tinymceConfig.style_formats[2].items.push({
                            title: format.name,
                            inline: format.inline,
                            classes: format.classes,
                            styles: format.styles
                        });
                    }
                }
                if ( this.tinymceConfig.style_formats[2].items.length === 0 )
                    this.tinymceConfig.style_formats.splice(2, 1);
            }
            this.tinymceConfig.content_style = this.metadata.getHtmlStylesheetCode( this.stylesheetId );
        } else {
            delete this.tinymceConfig.content_style;
        }
    }

    fullScreen() {
        this.modal.openModal('SystemTinyMCEModal').subscribe(componentRef => {
            componentRef.instance.content = this.fieldvalue;
            componentRef.instance.updateContent.subscribe(update => {
                this.fieldvalue = update;
                this.editor.setContent(update);
            })
        });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }

    ngOnChanges() {
        // our own little change detection
        if ( this.editor && this.fieldvalue && this.editor.getContent() !== this.fieldvalue )
            this.editor.setContent(this.fieldvalue);
        if ( this.oldStylesheetId.length && this.oldStylesheetId != this.stylesheetId ) this.changeStylesheet();
    }
}