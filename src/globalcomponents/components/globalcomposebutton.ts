/**
 * @module GlobalComponents
 */
import {AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {dockedComposer} from '../../services/dockedcomposer.service';

@Component({
    selector: 'global-compose-button',
    templateUrl: '../templates/globalcomposebutton.html'
})
export class GlobalComposeButton {

    @Input()public module: string = '';

    constructor(public dockedComposer: dockedComposer) {

    }

   public showComposer(){
        this.dockedComposer.addComposer(this.module);
    }

}
