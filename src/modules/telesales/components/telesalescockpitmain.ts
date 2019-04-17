/**
 * @module ModuleTeleSales
 */
import {Component, Input, OnChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {telecockpitservice} from "../services/telecockpit.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'tele-sales-cockpit-main',
    templateUrl: './src/modules/telesales/templates/telesalescockpitmain.html',
})
export class TeleSalesCockpitMain implements OnChanges {

    @ViewChild('maincontainer', {read: ViewContainerRef}) private maincontainer: ViewContainerRef;
    @Input() private selectedListItemId: string;

    constructor(private language: language,
                private model: model,
                private teleSalesCockpit: telecockpitservice) {
    }

    get mainStyle() {
        let rect = this.maincontainer.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    public ngOnChanges() {
        this.teleSalesCockpit.renderMainView(this.model.module, this.maincontainer);
    }
}
