import {AfterViewChecked, ChangeDetectorRef, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {telecockpitservice} from '../services/telecockpit.service';
import {backend} from '../../../services/backend.service';
import {modellist} from '../../../services/modellist.service';
import {model} from '../../../services/model.service';
import {view} from "../../../services/view.service";

@Component({
    selector: 'tele_sales_cockpit_list',
    templateUrl: './src/modules/telesales/templates/telesalescockpitlist.html',
    providers: [
        view, model, modellist
    ]
})
export class TeleSalesCockpitList implements AfterViewChecked {

    @ViewChild('listcontainer', {read: ViewContainerRef}) listcontainer: ViewContainerRef;
    @ViewChild('itemscontainer', {read: ViewContainerRef}) itemscontainer: ViewContainerRef;

    items: Array<any>;
    showButton: boolean = false;

    constructor(private backend: backend,
                private modellist: modellist,
                private language: language,
                private metadata: metadata,
                private cdr: ChangeDetectorRef,
                private model: model,
                private telecockpitservice: telecockpitservice) {
    }

    get isloading() {
        return this.telecockpitservice.isloading;
    }

    get listStyle() {
        let rect = this.listcontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)'
        }
    }

    ngAfterViewChecked() {
        let itemsContainerHeight = this.itemscontainer.element.nativeElement.getBoundingClientRect().height;
        this.canShowMoreButton(itemsContainerHeight);
    }

    canShowMoreButton(itemsContainerHeight) {
        if (itemsContainerHeight) {
            let listContainerHeight = this.listcontainer.element.nativeElement.getBoundingClientRect().height;
            if (itemsContainerHeight < listContainerHeight) {
                this.showButton = true;
            } else {
                this.showButton = false;
            }
            this.cdr.detectChanges();

        }
    }

    onScroll(e) {
        let element = this.listcontainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.telecockpitservice.loadMoreData();
        }
    }

}