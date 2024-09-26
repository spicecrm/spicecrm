/**
 * @module ModuleTeleSales
 */
import {ChangeDetectorRef, Component, Input, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";
import {TeleSalesCockpitListItem} from "./telesalescockpitlistitem";

@Component({
    selector: 'tele-sales-cockpit-list',
    templateUrl: '../templates/telesalescockpitlist.html',
    providers: [view, model, modellist]
})
export class TeleSalesCockpitList {

    @ViewChild('listcontainer', {read: ViewContainerRef, static: true}) public listcontainer: ViewContainerRef;
    @ViewChild('itemscontainer', {read: ViewContainerRef, static: true}) public itemscontainer: ViewContainerRef;
    @ViewChildren(TeleSalesCockpitListItem) public itemsComponents: QueryList<TeleSalesCockpitListItem>;
    @Input() public selectedListItemId: string;

    constructor(public language: language,
                public telecockpitservice: telecockpitservice) {
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

    public setSelectedItem() {
        if (this.selectedListItemId) {
            this.itemsComponents.forEach(listItem => listItem.isSelected = listItem.item.data.id == this.selectedListItemId);
        }
    }

    public loadMore(e){
        this.telecockpitservice.loadMoreData();
    }

    public trackByFn(index, item) {
        return item.data;
    }
}
