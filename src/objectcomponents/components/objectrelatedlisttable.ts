/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {backend} from '../../services/backend.service';
import {loggerService} from '../../services/logger.service';

/**
 * A generic component that displays a list for a set of related models. Requires to be embedded in a component that provides a [[relatedmodels]] service.
 */
@Component({
    selector: 'object-relatedlist-table',
    templateUrl: '../templates/objectrelatedlisttable.html'
})
export class ObjectRelatedlistTable implements OnInit {

    /**
     * an array with the fields to be displayed in the table
     */
    @Input() public listfields: any[] = [];

    /**
     * set to true if inline editing shoudlbe enabled for the table
     */
    @Input() public editable: boolean = false;

    /**
     * define a separate edit componentset that will be rendered with the edit dialog if the user chooses to edit a record
     *
     * typical usecase is to add fields fromt eh linkl (e.g. in the buying center) to the fieldset. Those fields are specific to a relationship and can only be added as part of that
     */
    @Input() public editcomponentset = '';

    /**
     * set one field as the one holding a sequence
     */
    @Input() public sequencefield: string = null;

    /**
     * set to true to hide the actionset menu item being display
     */
    @Input() public hideActions: boolean = false;

    /**
     * the list item actionset
     */
    @Input() public listitemactionset: string;

    /**
     * set to true if list is displayed in ObjectRelatedDuplicate panel
     */
    @Input() public duplicateTable: boolean = false;

    /**
     * set if no access to the related odule is allowed
     */
    public noAccess: boolean = false;

    public nowDragging = false;
    public isSequenced = false;

    /**
     * info whether the listitemactionset has a single button
     */
    public singlebutton: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public layout: layout,
        public backend: backend,
        public logger: loggerService) {
    }

    public ngOnInit() {

        // check access
        if (!(this.metadata.checkModuleAcl(this.relatedmodels.relatedModule, 'listrelated') || this.metadata.checkModuleAcl(this.relatedmodels.relatedModule, 'list'))) {
            this.noAccess = true;
            return;
        }

        if (!this.metadata.fieldDefs[this.model.module][this.relatedmodels._linkName] && ! this.relatedmodels.linkEndPoint && !this.duplicateTable) {
            this.logger.error('Missing link or wrong link name ("' + this.relatedmodels._linkName + '")!');
        } else {
            if (!this.sequencefield && this.metadata.fieldDefs[this.model.module][this.relatedmodels._linkName]?.sequence_field) {
                this.sequencefield = this.metadata.fieldDefs[this.model.module][this.relatedmodels._linkName].sequence_field;
            }
        }
        if (this.sequencefield) this.isSequenced = true;

        this.getActionsetData();
    }

    get isloading() {
        return this.relatedmodels.isloading;
    }

    get isSmall() {
        return this.layout.screenwidth === 'small';
    }

    get module() {
        return this.relatedmodels.relatedModule;
    }

    /**
     * reads the field defs and returns a style attribute that can be appield to the head if set in the config
     *
     * @param column
     * @private
     */
    public getColumnStyle(column) {

        // check that we have a dimension
        if (column.fieldconfig?.widthdimension && column.fieldconfig?.width) {
            return {
                width: column.fieldconfig?.width + column.fieldconfig.widthdimension
            };
        }

        return {};

    }

    /**
     * set fix column width if we've got a single/icon button
     */
    public getButtonColumnStyle(): string {
        return this.singlebutton ? 'slds-size_1-of-6' : 'slds-size_1-of-12';
    }

    public isSortable(field): boolean {
        if (this.relatedmodels.sortBySequencefield) return false;
        return field.fieldconfig.sortable === true;
    }

    public setSortField(field): void {
        if (this.relatedmodels.sortBySequencefield) return;
        if (this.isSortable(field)) {
            this.relatedmodels.sortfield = field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field;
        }
    }

    public getSortIcon(field): string {
        if (this.relatedmodels.sortfield == (field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field)) {
            return this.relatedmodels.sort.sortdirection === 'ASC' ? 'arrowup' : 'arrowdown';
        }
        return 'sort';
    }

    public getIdOfRow(index, item) {
        return item.id;
    }

    public drop(event) {
        let previousItem = this.relatedmodels.items.splice(event.previousIndex, 1);
        this.relatedmodels.items.splice(event.currentIndex, 0, previousItem[0]);

        let updateArray = [];
        let i = 0;
        for (let item of this.relatedmodels.items) {
            item[this.sequencefield] = i;
            updateArray.push({id: item.id, [this.sequencefield]: i});
            i++;
        }

        this.relatedmodels.updateItems(updateArray);
    }

    public dragStarted(e) {
        this.nowDragging = true;
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    public dragEnded(e) {
        this.nowDragging = false;
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

    private getActionsetData() {

        let actionitems = this.metadata.getActionSetItems(this.listitemactionset);

        for (let actionitem of actionitems) {
            if (actionitem.actionconfig.singlebutton || actionitem.actionconfig.displayasicon) {
                this.singlebutton = true;
            }
        }
    }

}
