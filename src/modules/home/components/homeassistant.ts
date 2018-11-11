import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    NgModule,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {assistant} from '../../../services/assistant.service';

@Component({
    selector: 'home-assistant',
    templateUrl: './src/modules/home/templates/homeassistant.html'
})
export class HomeAssistant {

    @ViewChild('itemcontainer', {read: ViewContainerRef}) private  itemcontainer: ViewContainerRef;

    constructor(private assistant: assistant, private navigation: navigation, private language: language) {
        this.assistant.initlaize();
    }

    private reload() {
        this.assistant.loadItems();
    }

    get containerstyle() {
        let rect = this.itemcontainer.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    get loading() {
        return this.assistant.loading;
    }

    get noActivities() {
        return !this.assistant.loading && this.assistant.assitantItems.length == 0;
    }
}