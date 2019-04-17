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
    templateUrl: './src/modules/activities/templates/emailspopoverbody.html',
})
export class EmailsPopoverBody {

    constructor(private model: model, private language: language, private domSanitizer: DomSanitizer) {
    }

    get emailbody() {
        return this.domSanitizer.bypassSecurityTrustHtml(this.model.getFieldValue('body'));
    }
}
