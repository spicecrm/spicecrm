/**
 * @module ModuleHome
 */
import {Component,ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {assistant} from '../../../services/assistant.service';

@Component({
    selector: 'home-assistant',
    templateUrl: './src/modules/home/templates/homeassistant.html'
})
export class HomeAssistant {

    @ViewChild('itemcontainer', {read: ViewContainerRef, static: true}) private  itemcontainer: ViewContainerRef;

    constructor(private assistant: assistant, private navigationtab: navigationtab, private language: language) {

        this.assistant.initialize();

        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_ASSISTANT'), displaymodule: 'Home'});
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
