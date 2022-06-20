/**
 * @module ModuleHome
 */
import {Component,ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {assistant} from '../../../services/assistant.service';

@Component({
    selector: 'home-assistant',
    templateUrl: '../templates/homeassistant.html'
})
export class HomeAssistant {

    constructor(public assistant: assistant, public navigationtab: navigationtab, public language: language) {
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_ASSISTANT'), displaymodule: 'Home'});
    }

    public reload(e: MouseEvent) {
        e.stopPropagation();
        this.assistant.loadItems(false);
    }

    get loading() {
        return this.assistant.loading;
    }

    get noActivities() {
        return !this.assistant.loading && this.assistant.assitantItems.length == 0;
    }

    public trackByFn(index, item) {
        return item.id;
    }
}
