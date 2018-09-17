import { AfterViewInit, Component, OnDestroy, Input, NgZone, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var _;

@Component({
    selector: 'field-html',
    templateUrl: './src/objectfields/templates/fieldhtml.html',
})
export class fieldHtml extends fieldGeneric
{
    stylesheetField: string = '';
    useStylesheets: boolean;
    useStylesheetSwitcher: boolean;
    stylesheets: Array<any>;
    stylesheetToUse: string = '';
    private _cached_html_value; // the cached sanitized html object to prevent "filckering" of the iframe
    private _cached_value; // for change detection reasons...

    @ViewChild('printframe', {read: ViewContainerRef}) printframe: ViewContainerRef;

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private zone: NgZone, public sanitized: DomSanitizer, private modal:modal ) {
        super( model, view, language, metadata, router );
        this.stylesheets = this.metadata.getHtmlStylesheetNames();
    }

    ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs( this.model.module, this.fieldname );
        if ( !_.isEmpty( fieldDefs.stylesheet_id_field )) this.stylesheetField = fieldDefs.stylesheet_id_field;
        this.useStylesheets = !_.isEmpty( this.stylesheetField ) && !_.isEmpty( this.stylesheets );
        if ( this.useStylesheets ) {
            if ( this.stylesheets.length === 1 ) this.stylesheetToUse = this.stylesheets[0].id;
            else if ( !_.isEmpty( this.fieldconfig.stylesheetId ) ) this.stylesheetToUse = this.fieldconfig.stylesheetId;
            else this.stylesheetToUse = this.metadata.getHtmlStylesheetToUse( this.model.module, this.fieldname );
        }
        this.useStylesheetSwitcher = this.useStylesheets && _.isEmpty( this.stylesheetToUse );
    }

    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should be rebuild on change
     * @returns {any}
     */
    get htmlValue()
    {
        // if value changed, generate html value
        if(this.value != this._cached_value)
        {
            this._cached_html_value = this.sanitized.bypassSecurityTrustHtml(
                '<html><head>'+( this.useStylesheets && !_.isEmpty( this.model.data[this.stylesheetField] ) ? '<style>' + this.metadata.getHtmlStylesheetCode(this.model.data[this.stylesheetField]) + '</style>':'')+'</head><body class="spice">'+this.value+'</body></html>'
            );
            this._cached_value = this.value;
        }
        return this._cached_html_value;
    }

    get stylesheetId(): string {
        if ( !_.isEmpty( this.model.data[this.stylesheetField] )) return this.model.data[this.stylesheetField];
        return this.stylesheetId = this.stylesheetToUse;
    }
    set stylesheetId( id: string ) {
        if(id) this.model.setField( this.stylesheetField, id );
    }

    get asiframe() {
        return this.fieldconfig.asiframe || !_.isEmpty( this.fieldconfig.stylesheetId ) || !_.isEmpty( this.stylesheetField ) ? true : false;
    }

    updateField(newVal){
        // set the model
        this.value = newVal;

        // make sure we propagate the change
        this.zone.run(() => {});
    }

    updateStylesheet(stylesheetId) {
        if ( !_.isEmpty( this.stylesheetField ) && _.isString( stylesheetId )) this.model.setField( this.stylesheetField, stylesheetId );
    }

    expand(){
        this.modal.openModal('SystemTinyMCEModal',false ).subscribe(componentRef => {
            componentRef.instance.title = this.getLabel();
            componentRef.instance.content = this.value;
            componentRef.instance.stylesheetId = this.stylesheetId;
            componentRef.instance.updateContent.subscribe(update => {
                this.value = update;
            })
        });
    }

    eventHandler(event){
        this.value = event.srcElement.innerHTML;
        // console.log(event);
    }

    // Code from fieldlabel.ts
    getLabel() {
        if (this.fieldconfig.label)
            if(this.fieldconfig.label.indexOf(':') > 0){
                let fielddetails = this.fieldconfig.label.split(':');
                return this.language.getLabel(fielddetails[1], fielddetails[0], this.view.labels)
            } else {
                return this.language.getLabel(this.fieldconfig.label, this.model.module, this.view.labels)
            }
        else {
            return this.language.getFieldDisplayName(this.model.module, this.fieldname,this.fieldconfig, this.view.labels)
        }
    }

    print() {
        this.printframe.element.nativeElement.contentWindow.print();
    }

}