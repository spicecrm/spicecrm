/**
 * @module ModuleActivities
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit,
    OnDestroy
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';


@Component({
    templateUrl: '../templates/emailspopoverbody.html',
})
export class EmailsPopoverBody {

    /**
     *
     */
    public _sanitizedValue;

    /**
     * the cached full html code to prevent "flickering" of the iframe (change detection)
     */
    public fullValue_cached: string;
    public fullValue: string = '';

    constructor(public model: model, public language: language, public sanitized: DomSanitizer) {
    }


    /**
     * get the html representation of the corresponding value
     * SPICEUI-88 - to prevent "flickering" of the iframe displaying this value, the value will be cached and should be rebuild on change
     * @returns {any}
     */
    get emailbody() {
        return this.model.getFieldValue('body');
    }

    get sanitizedValue() {
        if (this.emailbody) {
            if (this.emailbody.includes('</html>')) {
                this.fullValue = this.emailbody;
            } else {
                // added <base target="_blank"> so all links open in new window
                this.fullValue = `<html><body class="spice">${this.emailbody}</body></html>`;
            }
        }

        // if value changed, generate sanitized html value
        if (this.fullValue != this.fullValue_cached) {
            this._sanitizedValue = this.sanitized.bypassSecurityTrustResourceUrl(this.fullValue ? 'data:text/html;charset=UTF-8,' + encodeURIComponent(this.fullValue) : '');
            this.fullValue_cached = this.fullValue;
        }
        return this._sanitizedValue;
    }
}
