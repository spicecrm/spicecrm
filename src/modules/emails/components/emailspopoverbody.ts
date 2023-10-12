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
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';


@Component({
    templateUrl: '../templates/emailspopoverbody.html',
})
export class EmailsPopoverBody {

    /**
     * blob url for the iframe
     */
    public iframeUrl: SafeResourceUrl;
    /**
     * is loading content flag
     */
    public isLoading: boolean = false;

    constructor(public model: model, public language: language, public sanitized: DomSanitizer) {
    }

    /**
     * generate field html content blob url from the backend
     */
    public ngOnInit() {

        this.isLoading = true;

        this.model.generateFieldHtmlContentBlobUrl('body').subscribe((blob: SafeResourceUrl) => {
            this.isLoading = false;
            this.iframeUrl = blob;
        });
    }
}
