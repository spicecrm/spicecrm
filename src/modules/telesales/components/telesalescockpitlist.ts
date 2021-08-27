/**
 * @module ModuleTeleSales
 */
import {Component, Input, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";
import {TeleSalesCockpitListItem} from "./telesalescockpitlistitem";

@Component({
    selector: 'tele-sales-cockpit-list',
    templateUrl: './src/modules/telesales/templates/telesalescockpitlist.html',
    providers: [view, model, modellist]
})
export class TeleSalesCockpitList {

    @ViewChild('listcontainer', {read: ViewContainerRef, static: true}) private listcontainer: ViewContainerRef;
    @ViewChild('itemscontainer', {read: ViewContainerRef, static: true}) private itemscontainer: ViewContainerRef;
    @ViewChildren(TeleSalesCockpitListItem) private itemsComponents: QueryList<TeleSalesCockpitListItem>;
    @Input() private selectedListItemId: string;

    constructor(private language: language,
                private telecockpitservice: telecockpitservice) {
    }

    get isLoading() {
        return this.telecockpitservice.isloading;
    }

    get listItems() {
        return this.telecockpitservice.listItems;
    }

    get listStyle() {
        let rect = this.listcontainer.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        };
    }

    public ngOnChanges() {
        this.setSelectedItem();
    }

    private setSelectedItem() {
        if (this.selectedListItemId) {
            this.itemsComponents.forEach(listItem => listItem.isSelected = listItem.item.data.id == this.selectedListItemId);
        }
    }

    private onScroll(e) {
        let element = this.listcontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.telecockpitservice.loadMoreData();
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
