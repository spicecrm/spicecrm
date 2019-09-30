/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    OnInit,
    OnDestroy,
    Renderer2,
    EventEmitter,
    Output
} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {listfilters} from '../services/listfilters.service';

import {SystemFilterBuilderFilterExpression} from "../../systemcomponents/components/systemfilterbuilderfilterexpression";

/**
 * displays a filter item
 */
@Component({
    selector: 'object-listview-filter-panel-filter-item',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfilteritem.html',
    animations: [
        trigger('animatepopover', [
            transition(':enter', [
                style({opacity: 0}),
                animate('.25s', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: '1'}),
                animate('.25s', style({opacity: 0}))
            ])
        ])
    ]
})
export class ObjectListViewFilterPanelFilterItem extends SystemFilterBuilderFilterExpression implements OnInit, OnDestroy {
    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;

    /**
     * boolean if the popover is open
     */
    private showPopover: boolean = false;

    /**
     * helper listener to close the popup when a click happens outside
     */
    private clickListener: any = null;

    /**
     * list of fieldtypes that shoudl not be allowed for filtering
     */
    private excludedFieldtypes: string[] = ['link', 'relate', 'email'];

    @Output() public deleteItem: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        private listfilters: listfilters,
        private elementRef: ElementRef,
        private modellist: modellist,
        private renderer: Renderer2
    ) {
        super(backend, language, metadata);
    }

    get operatorLabel() {
        if (this.operator) {
            return this.operators[this.operatortype].find(item => item.operator == this.operator).name;
        } else {
            return '';
        }
    }

    public ngOnInit() {
        // set the module from the model
        this.module = this.modellist.module;

        // run the super ngOnInit
        super.ngOnInit();

    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private onClick() {
        if (!this.showPopover) {
            this.showPopover = true;
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
            return;
        }
    }

    private onFocus(event) {
        window.setTimeout(() => {
            event.target.blur();
        }, 250);
    }


    private closePopover() {
        this.showPopover = false;
    }

    private onDocumentClick(event: MouseEvent): void {
        if (this.showPopover) {
            if (!this.elementRef.nativeElement.contains(event.target)) {
                this.showPopover = false;
                this.clickListener();
            }
        }
    }

    private getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: (rect.left - poprect.width - 15) + 'px'
        };
    }

    /*
     for the filter handling
     */

    private getDisplayName() {
        return this.field ? this.language.getFieldDisplayName(this.modellist.module, this.field) : this.language.getLabel('LBL_NEW_FILTER');
    }

    private deleteFilter() {
        this.deleteItem.emit(true);
    }


}
