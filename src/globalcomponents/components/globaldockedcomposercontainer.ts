/**
 * Created by christian on 08.11.2016.
 */
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
    templateUrl: './app/globalcomponents/templates/globaldockedcomposercontainer.html',
})
export class GlobalDockedComposerContainer {

    constructor(private dockedComposer: dockedComposer) {

    }

    closeComposer() {
        this.dockedComposer.showComposer = false;
    }

    // function to return the style if multiple composers are shown .. to stack them
    getComposerStyle(composerindex) : any {
        if(composerindex >= this.dockedComposer.maxComposers){
            return {
                display: 'none'
            }
        }
    }

    get displayOverflow() : boolean {
        return this.dockedComposer.composers.length > this.dockedComposer.maxComposers ? true : false;
    }
}