import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {dockedComposer} from '../../services/dockedcomposer.service';


@Component({
    selector: 'global-docked-composer-container',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposercontainer.html',
    host: {
        '[class.slds-docked_container]': 'isVisible',
        'style': 'z-index: 9999'
    }
})
export class GlobalDockedComposerContainer {

    constructor(private dockedComposer: dockedComposer) {

    }

    get isVisible() {
        return this.dockedComposer.composers.length > 0 || this.dockedComposer.calls.length > 0;
    }

    private closeComposer() {
        this.dockedComposer.showComposer = false;
    }

    // function to return the style if multiple composers are shown .. to stack them
    private getComposerStyle(composerindex): any {
        if (composerindex >= this.dockedComposer.maxComposers) {
            return {
                display: 'none'
            };
        }
    }

    get displayOverflow(): boolean {
        return this.dockedComposer.composers.length > this.dockedComposer.maxComposers ? true : false;
    }
}
