import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {metadata} from '../../../services/metadata.service';
@Component({
    // selector: 'object-home',
    templateUrl: './app/modules/home/templates/home.html',
})
export class Home {
    componentconfig: any = {};

    constructor(private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private metadata: metadata) {
        // set theenavigation paradigm
        this.navigation.setActiveModule('Home');

        //get config
        let componentconfig = this.metadata.getComponentConfig('Home', 'Home');
        if (componentconfig && componentconfig.HomeAssistant)
            this.componentconfig = componentconfig.HomeAssistant;

    }

    getHomeStyle(){
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        return {
             'height': 'calc(100vh - ' + (rect.top ) + 'px)',
            'overflow': 'auto'
        }
    }

    displayHomeAssistant(){
        if(this.componentconfig.HomeAssistant !== undefined)
            return this.componentconfig.HomeAssistant;
        return true;
    }
}