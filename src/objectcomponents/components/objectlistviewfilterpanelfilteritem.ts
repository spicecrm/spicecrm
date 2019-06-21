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
    Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {listfilters} from '../services/listfilters.service';

/**
 * displays a filter item
 */
@Component({
    selector: '[object-listview-filter-panel-filter-item]',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfilteritem.html'
})
export class ObjectListViewFilterPanelFilterItem implements OnInit, OnDestroy {
    @ViewChild('popover', {read: ViewContainerRef, static: false}) private popover: ViewContainerRef;

    /**
     * boolean if the popover is open
     */
    private showPopover: boolean = false;

    /**
     * the aray of fileds to be available to the user
     */
    private listFields: any[] = [];

    /**
     * the filter in focus
     */
    @Input() private filter: any = {};

    /**
     * helper listener to close the popup when a click happens outside
     */
    private clickListener: any = null;

    /**
     * the fieldtype determined by the field selected
     */
    private currentFieldType: string = 'text';

    /**
     * list of fieldtypes that shoudl not be allowed for filtering
     */
    private excludedFieldtypes: string[] = ['link', 'relate', 'email'];

    constructor(private listfilters: listfilters, private elementRef: ElementRef, private metadata: metadata, private language: language, private modellist: modellist, private renderer: Renderer2) {

        /**
         * build the field list
         *
         * ToDo: build a nicer logic here
         */
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        let allListFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allListFields) {
            let fieldtype = this.metadata.getFieldType(this.modellist.module, listField.field);
            if (this.excludedFieldtypes.indexOf(fieldtype) == -1 && this.metadata.getFieldSource(this.modellist.module, listField.field) != 'non-db') {
                listField.displayName = this.language.getFieldDisplayName(this.modellist.module, listField.field);
                this.listFields.push(listField);
            }
        }
        this.listFields = this.listFields.sort((a, b) => {
            return a.displayName === b.displayName ? 0 : a.displayName > b.displayName ? 1 : -1;
        });
    }

    public ngOnInit() {
        // if no filter field is set .. popup the filter with short delay
        if (this.filter.field === '') {
            window.setTimeout(() => this.showPopover = true, 250);
        }

        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));

        // determine the field type
        this.getFieldType();

    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private onClick() {
        if (!this.showPopover) {
            this.showPopover = true;
            return;
        }
    }

    private onFocus(event) {
        window.setTimeout(() => {
            event.target.blur();
        }, 250);
    }

    get operator() {
        if (this.filter.operator) {
            return this.language.getLabel('LBL_' + this.filter.operator.toUpperCase());
        } else {
            return '';
        }
    }

    private closePopover() {
        this.showPopover = false;
    }

    private onDocumentClick(event: MouseEvent): void {
        if (this.showPopover) {
            const clickedInside = this.elementRef.nativeElement.contains(event.target);
            if (!clickedInside) {
                this.showPopover = false;
            }
        }
    }

    private getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: (rect.left - poprect.width - 15) + 'px',
            display: (this.showPopover ? '' : 'none')
        };
    }

    /*
     for the filter handling
     */

    private getDisplayName() {
        if (this.filter.field) {
            return this.language.getFieldDisplayName(this.modellist.module, this.filter.field);
        } else {
            return 'new Filter';
        }
    }

    private deleteFilter() {
        this.listfilters.filters.some((filter, index) => {
            if (filter.id == this.filter.id) {
                this.listfilters.filters.splice(index, 1);
                return true;
            }
        });
    }

    private fieldChanged() {
        // clear hte operator
        this.filter.operator = '';
        this.filter.filtervalue = '';

        // set the field type
        this.getFieldType();
    }

    private getFieldType() {
        // if we have no field set text by default
        if (!this.filter.field) {
            this.currentFieldType = 'text';
            return;
        }

        // try to determine the field type
        switch (this.metadata.getFieldType(this.modellist.module, this.filter.field)) {
            case 'enum':
                this.currentFieldType = 'enum';
                break;
            case 'bool':
            case 'boolean':
                this.currentFieldType = 'bool';
                break;
            case 'date':
            case 'datetime':
                this.currentFieldType = 'date';
                break;
            default:
                this.currentFieldType = 'text';
        }
    }

}
