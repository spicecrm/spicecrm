import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    OnInit,
    OnDestroy,
    AfterViewInit,
    Renderer2
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {listfilters} from '../services/listfilters.service';

@Component({
    selector: '[object-listview-filter-panel-filter-item]',
    templateUrl: './app/objectcomponents/templates/objectlistviewfilterpanelfilteritem.html'
})
export class ObjectListViewFilterPanelFilterItem implements OnInit, OnDestroy {
    @ViewChild('popover', {read: ViewContainerRef}) popover: ViewContainerRef;
    showPopover: boolean = false;
    listFields: Array<any> = [];
    @Input() filter: any = {};
    clickListener: any = null;

    currentFieldType: string = 'text';

    constructor(private listfilters: listfilters, private elementRef: ElementRef, private metadata: metadata, private language: language, private modellist: modellist, private renderer: Renderer2) {
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        let allListFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allListFields) {
            listField.displayName = this.language.getFieldDisplayName(this.modellist.module, listField.field);
            this.listFields.push(listField);
        }
        this.listFields = this.listFields.sort((a, b) => {
            return a.displayName === b.displayName ? 0 : a.displayName > b.displayName ? 1 : -1;
        })
    }

    ngOnInit() {
        // if no filter field is set .. popup the filter with short delay
        if (this.filter.field === '')
            window.setTimeout(() => this.showPopover = true, 250);

        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));

        // determine the field type
        this.getFieldType();

    }

    ngOnDestroy() {
        this.clickListener();
    }

    onClick() {
        if (!this.showPopover) {
            this.showPopover = true;
            return;
        }
    }

    onFocus(event) {
        window.setTimeout(function () {
            event.target.blur();
        }, 250);
    }

    get operator() {
        if (this.filter.operator)
            return this.language.getLabel('LBL_' + this.filter.operator.toUpperCase());
        else
            return '';
    }

    closePopover() {
        this.showPopover = false;
    }

    onDocumentClick(event: MouseEvent): void {
        if (this.showPopover) {
            const clickedInside = this.elementRef.nativeElement.contains(event.target);
            if (!clickedInside) {
                this.showPopover = false;
            }
        }
    }

    getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ( (rect.height - poprect.height) / 2 )) + 'px',
            left: (rect.left - poprect.width - 15) + 'px',
            display: (this.showPopover ? '' : 'none')
        }
    }

    /*
     for the filter handling
     */

    getDisplayName() {
        if (this.filter.field)
            return this.language.getFieldDisplayName(this.modellist.module, this.filter.field);
        else
            return 'new Filter';
    }

    deleteFilter() {
        this.listfilters.filters.some((filter, index) => {
            if (filter.id == this.filter.id) {
                this.listfilters.filters.splice(index, 1);
                return true;
            }
        })
    }

    fieldChanged() {
        // clear hte operator
        this.filter.operator = '';
        this.filter.filtervalue = '';

        // set the field type
        this.getFieldType();
    }

    getFieldType() {
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
