/**
 * Created by christian on 08.11.2016.
 */
import {AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {dockedComposer} from '../../services/dockedcomposer.service';

@Component({
    selector: 'global-compose-button',
    templateUrl: './src/globalcomponents/templates/globalcomposebutton.html'
})
export class GlobalComposeButton {

    @Input() module: string = '';

    constructor(private dockedComposer: dockedComposer) {

    }

    showComposer(){
        this.dockedComposer.addComposer(this.module);
    }

}