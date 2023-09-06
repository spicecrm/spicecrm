/**
 * @module ModuleSpiceUrls
 */
import {ChangeDetectionStrategy, Component, ChangeDetectorRef} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
 import {modelurls} from "../../../services/modelurls.service";

@Component({
    selector: 'spice-urls-list',
    templateUrl: '../templates/spiceurlslist.html',
    providers: [modelurls],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceUrlsList {

    /**
     * @ignore
     *
     * passed in component config
     */
    public componentconfig: any = {};

    /**
     * contructor sets the module and id for the laoder
     * @param modelurls
     * @param language
     * @param model
     * @param cdRef
     */
    constructor(
        public modelurls: modelurls,
        public language: language,
        public model: model,
        public cdRef: ChangeDetectorRef) {
        this.modelurls.module = this.model.module;
        this.modelurls.id = this.model.id;
    }


    /**
     * initializes the model urls service and loads the urls
     */
    public loadFiles() {
        this.modelurls.getUrls().subscribe(urls => {
            this.cdRef.detectChanges();
        });
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        setTimeout(() => this.loadFiles(), 10);
    }

    /**
     * Component style according to the component config property "horizontal".
     */
    public getCompStyle() {
        return {
            marginRight: this.componentconfig.horizontal ? '-16px' : undefined,
            marginBottom: this.componentconfig.horizontal ? '-8px' : undefined,
        }
    }

    /**
     * Item classes according to the component config property "horizontal".
     */
    public getItemClass() {
        return this.componentconfig.horizontal ? 'slds-m-right_medium slds-m-bottom_x-small':'slds-size--1-of-1';
    }

}
