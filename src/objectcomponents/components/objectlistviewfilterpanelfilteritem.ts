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
    Output, AfterViewInit
} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {listfilters} from '../services/listfilters.service';
import {SystemFilterBuilderFilterExpression} from "../../systemcomponents/components/systemfilterbuilderfilterexpression";

declare var _: any;

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
export class ObjectListViewFilterPanelFilterItem extends SystemFilterBuilderFilterExpression implements OnDestroy, AfterViewInit {
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

    /**
     * an emitter to indicate that the current item should be deleted by the user
     */
    @Output() public deleteItem: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        private listfilters: listfilters,
        private elementRef: ElementRef,
        private modellist: modellist,
        private renderer: Renderer2,
        private userpreferences: userpreferences
    ) {
        super(backend, language, metadata);
    }

    /**
     * a simple getter as helper to get the module from the modellist
     */
    get module() {
        return this.modellist.module;
    }

    /**
     * returns the operator label
     */
    get operatorLabel() {
        if (this.operator) {
            return this.operators[this.operatortype].find(item => item.operator == this.operator).name;
        } else {
            return '';
        }
    }

    public ngAfterViewInit() {

        // if we do not have a fieldvalue open the popover
        if (!this.field || this.field == '') this.openPopover();
    }

    /**
     * ensure the clicklistener is destoryed if the component is desctored if we have an active listener
     */
    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * show the popover
     */
    private onClick() {
        this.openPopover();
    }

    /**
     * opens the popover
     */
    private openPopover() {
        if (!this.showPopover) {
            this.showPopover = true;
            // this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
            return;
        }
    }

    private onFocus(event) {
        window.setTimeout(() => {
            event.target.blur();
        }, 250);
    }

    /**
     * closes the popover
     */
    private closePopover() {
        this.showPopover = false;
    }

    /**
     * registers a listener top the click on the document and checks wehter the clock was in the popover or outside
     *
     * @param event
     */
    private onDocumentClick(event: MouseEvent): void {
        if (this.showPopover) {
            if (!this.elementRef.nativeElement.contains(event.target)) {
                this.showPopover = false;
                this.clickListener();
            }
        }
    }

    /**
     * positions the popover properly
     */
    private getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: (rect.left - poprect.width - 15) + 'px'
        };
    }

    /**
     * display the name oif the field used for the filter resp the labe that it is a new filter
     */
    private getDisplayName() {
        return this.field ? this.language.getFieldDisplayName(this.modellist.module, this.field) : this.language.getLabel('LBL_NEW_FILTER');
    }

    /**
     * emits that the filter shopudl be deleted
     */
    private deleteFilter() {
        this.deleteItem.emit(true);
    }

    /**
     * returns a proper formated value for the filter value field
     *
     * @param value
     */
    private interpretvalue(value) {
        try {
            let operator = this.operators[this.operatortype].find(item => item.operator == this.operator);
            switch (operator.value1) {
                case 'date':
                    return this.userpreferences.formatDate(value);
                    break;
                case 'enum':
                    return this.language.getFieldDisplayOptionValue(this.module, this.field, value);
                    break;
                case 'multienum':
                    let retvalues = [];
                    let values = _.isArray(value) ? value : value.split(',');
                    for (let thisvalue of values) {
                        retvalues.push(this.language.getFieldDisplayOptionValue(this.module, this.field, thisvalue));
                    }
                    return retvalues.join(', ');
                    break;
                default:
                    return value;
            }
        } catch (e) {
            return value;
        }
    }

}
