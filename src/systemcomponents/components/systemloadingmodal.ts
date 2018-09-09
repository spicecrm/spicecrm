import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef,
    OnInit, EventEmitter
} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './app/systemcomponents/templates/systemloadingmodal.html'
})
export class SystemLoadingModal {

    messagelabel: string = 'LBL_LOADING';

    constructor(private language: language) {

    }

}