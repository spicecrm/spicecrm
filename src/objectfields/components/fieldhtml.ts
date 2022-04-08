/**
 * @module ObjectFields
 */
import {Component, NgZone, ViewContainerRef, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'field-html',
    templateUrl: '../templates/fieldhtml.html',
})
export class fieldHtml extends fieldGeneric {
    public stylesheetField: string = '';
    public useStylesheets: boolean;
    public useStylesheetSwitcher: boolean;
    public stylesheets: any[];
    public stylesheetToUse: string = '';
    public _sanitizedValue;
    public fullValue_cached: string; // the cached full html code to prevent "flickering" of the iframe (change detection)
    public fullValue: string = '';

    @ViewChild('printframe', {read: ViewContainerRef, static: true}) public printframe: ViewContainerRef;

    constructor(
        public model: model,
        public view: view,
        public language: language, public metadata: metadata, public router: Router, public zone: NgZone, public sanitized: DomSanitizer, public modal: modal) {
        super(model, view, language, metadata, router);
        this.stylesheets = this.metadata.getHtmlStylesheetNames();
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (!_.isEmpty(fieldDefs.stylesheet_id_field)) {
            this.stylesheetField = fieldDefs.stylesheet_id_field;
        }
        this.useStylesheets = !_.isEmpty(this.stylesheetField) && !_.isEmpty(this.stylesheets);
        if (this.useStylesheets) {
            if (this.stylesheets.length === 1) {
                this.stylesheetToUse = this.stylesheets[0].id;
            } else if (!_.isEmpty(this.fieldconfig.stylesheetId)) {
                this.stylesheetToUse = this.fieldconfig.stylesheetId;
            } else {
                this.stylesheetToUse = this.metadata.getHtmlStylesheetToUse(this.model.module, this.fieldname);
            }
        }
        this.useStylesheetSwitcher = this.useStylesheets && _.isEmpty(this.stylesheetToUse);
    }

    get styleTag() {
        return ( this.useStylesheets && !_.isEmpty( this.model.getField(this.stylesheetField) )) ?
            '<style>' + this.metadata.getHtmlStylesheetCode( this.model.getField(this.stylesheetField) ) + '</style>' : '';
    }

    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should only be rebuild on change
     * @returns {any}
     */
    get sanitizedValue()
    {
        if(this.value)
        {
            if(this.value.includes('</html>')) {
                this.fullValue = this.value;
            } else {
                this.fullValue = `<html><head>${this.styleTag}</head><body class="spice">${this.value}</body></html>`;
            }
        }

        // if value changed, generate sanitized html value
        if ( this.fullValue != this.fullValue_cached ) {
            this._sanitizedValue = this.sanitized.bypassSecurityTrustResourceUrl(this.fullValue ? 'data:text/html;charset=UTF-8,' + encodeURIComponent(this.fullValue) : '');
            this.fullValue_cached = this.fullValue;
        }
        return this._sanitizedValue;
    }

    get stylesheetId(): string {
        if (!_.isEmpty(this.model.getField(this.stylesheetField))) {
            return this.model.getField(this.stylesheetField);
        }
        return this.stylesheetId = this.stylesheetToUse;
    }

    set stylesheetId(id: string) {
        if (id) {
            this.model.setField(this.stylesheetField, id);
        }
    }

    get asiframe() {
        return this.fieldconfig.asiframe || !_.isEmpty(this.fieldconfig.stylesheetId) || !_.isEmpty(this.stylesheetField) ? true : false;
    }

    public updateField(newVal) {
        // set the model
        this.value = newVal;

        // make sure we propagate the change
        this.zone.run(() => { 1; });
    }

    public updateStylesheet(stylesheetId) {
        if (!_.isEmpty(this.stylesheetField) && _.isString(stylesheetId)) {
            this.model.setField(this.stylesheetField, stylesheetId);
        }
    }

    public expand() {
        this.modal.openModal('SystemTinyMCEModal', false).subscribe(componentRef => {
            componentRef.instance.title = this.getLabel();
            componentRef.instance.content = this.value;
            componentRef.instance.stylesheetId = this.stylesheetId;
            componentRef.instance.updateContent.subscribe(update => {
                this.value = update;
            });
        });
    }

    public eventHandler(event) {
        this.value = event.srcElement.innerHTML;
        // console.log(event);
    }

    // Code from fieldlabel.ts
    public getLabel() {
        if (this.fieldconfig.label) {
            if (this.fieldconfig.label.indexOf(':') > 0) {
                let fielddetails = this.fieldconfig.label.split(':');
                return this.language.getLabel(fielddetails[1], fielddetails[0], this.view.labels);
            } else {
                return this.language.getLabel(this.fieldconfig.label, this.model.module, this.view.labels);
            }
        } else {
            return this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig, this.view.labels);
        }
    }

    /**
     * removed .. this does in this way not make sense
     */
    /*
    public print() {
        this.printframe.element.nativeElement.contentWindow.print();
    }
   */

}
