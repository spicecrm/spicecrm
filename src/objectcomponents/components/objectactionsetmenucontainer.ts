/**
 * @module ObjectComponents
 */
import {
    Component, ElementRef, Input, Output, EventEmitter, ViewChild,
    ViewContainerRef, AfterViewInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {helper} from '../../services/helper.service';

@Component({
    selector: 'object-actionset-menu-container',
    templateUrl: '../templates/objectactionsetmenucontainer.html',
    providers: [popup, helper]
})
export class ObjectActionsetMenuContainer implements AfterViewInit {

    @ViewChild('acionsetcontainer', {read: ViewContainerRef, static: true}) acionsetcontainer: ViewContainerRef;

    @Input() actionset: string = '';
    @Output() action: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public model: model, public metadata: metadata, public elementRef: ElementRef, public popup: popup, public helper: helper) {

    }

    ngAfterViewInit() {
        // add the menu items
        if (this.actionset != '') {
            let actionsetItems = this.metadata.getActionSetItems(this.actionset);
            for (let actionsetItem of actionsetItems) {
                if (actionsetItem.component) {
                    this.metadata.addComponent(actionsetItem.component, this.acionsetcontainer);
                } else {
                    switch(actionsetItem.action){
                        case 'EDIT':
                            this.metadata.addComponent('ObjectActionsetMenuContainerEdit', this.acionsetcontainer);
                            break;
                        case 'DELETE':
                            this.metadata.addComponent('ObjectActionsetMenuContainerDelete', this.acionsetcontainer);
                            break;
                    }
                }
            }
        }
    }


}
