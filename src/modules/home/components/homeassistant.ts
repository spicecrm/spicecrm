import {AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {assistant} from '../../../services/assistant.service';

@Component({
    selector: 'home-assistant',
    templateUrl: './app/modules/home/templates/homeassistant.html'
})
export class HomeAssistant {
    constructor(private assistant: assistant, private navigation: navigation, private language: language) {
        this.assistant.initlaize();
    }

    reload(){
        this.assistant.loadItems();
    }

    get loading(){
        return this.assistant.loading;
    }

    get noActivities(){
        return !this.assistant.loading && this.assistant.assitantItems.length == 0;
    }
}