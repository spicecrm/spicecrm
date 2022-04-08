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
import {SystemFilterBuilderFilterExpression} from "../../systemcomponents/components/systemfilterbuilderfilterexpression";

declare var _: any;

/**
 * displays a filter item
 */
@Component({
    selector: 'object-listview-filter-panel-filter-item',
    templateUrl: '../templates/objectlistviewfilterpanelfilteritem.html',
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
    @ViewChild('popover', {read: ViewContainerRef, static: true}) public popover: ViewContainerRef;

    /**
     * boolean if the popover is open
     */
    public showPopover: boolean = false;

    /**
     * helper listener to close the popup when a click happens outside
     */
    public clickListener: any = null;

    /**
     * list of fieldtypes that shoudl not be allowed for filtering
     */
    public excludedFieldtypes: string[] = ['link', 'relate', 'email'];

    /**
     * an emitter to indicate that the current item should be deleted by the user
     */
    @Output() public deleteItem: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public elementRef: ElementRef,
        public modellist: modellist,
        public renderer: Renderer2,
        public userpreferences: userpreferences
    ) {
        super(backend, language, metadata);

        // set the module from the modellist
        this.module = this.modellist.module;
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
    public onClick() {
        this.openPopover();
    }

    /**
     * opens the popover
     */
    public openPopover() {
        if (!this.showPopover) {
            this.showPopover = true;
            // this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
            return;
        }
    }

    public onFocus(event) {
        window.setTimeout(() => {
            event.target.blur();
        }, 250);
    }

    /**
     * closes the popover
     */
    public closePopover() {
        this.showPopover = false;
    }

    /**
     * registers a listener top the click on the document and checks wehter the clock was in the popover or outside
     *
     * @param event
     */
    public onDocumentClick(event: MouseEvent): void {
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
    public getPopoverStyle() {
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
    public getDisplayName() {
        return this.field ? this.language.getFieldDisplayName(this.modellist.module, this.field) : this.language.getLabel('LBL_NEW_FILTER');
    }

    /**
     * emits that the filter shopudl be deleted
     */
    public deleteFilter() {
        this.deleteItem.emit(true);
    }

    /**
     * returns a proper formated value for the filter value field
     *
     * @param value
     */
    public interpretvalue(value) {
        try {
            let operator = this.operators[this.operatortype].find(item => item.operator == this.operator);
            switch (operator.value1) {
                case 'date':
                    return this.userpreferences.formatDate(value);
                    break;
                case 'integer':
                    return this.userpreferences.formatMoney(parseInt(value, 10));
                    break;
                case 'enum':
                    return this.language.getFieldDisplayOptionValue(this.module, this.field, value);
                    break;
                case 'relate':
                    if(!value) return '';
                    let valueitems = value.split('::');
                    if(valueitems.length < 2) return value;
                    return valueitems[1];
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
