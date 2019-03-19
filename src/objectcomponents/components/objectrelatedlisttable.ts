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

/**
 * a generic component that displays a list for a set of related models. Requiies to b embedded ina  component that provides a [[relatedmodels]] service
 */
@Component({
    selector: 'object-relatedlist-table',
    templateUrl: './src/objectcomponents/templates/objectrelatedlisttable.html'
})
export class ObjectRelatedlistTable implements OnInit {

    /**
     * an array with the fields to be displayed in the table
     */
    @Input() public listfields: any[] = [];


    /**
     * set to true if inline editing shoudlbe enabled for the table
     */
    @Input() private editable: boolean = false;

    /**
     * define a separate edit componentset that will be rendered with the edit dialog if the user chooses to edit a record
     *
     * typical usecase is to add fields fromt eh linkl (e.g. in teh buying center) to the fieldset. Those fields are specific to a relationship and can only be added as part of that
     */
    @Input() private editcomponentset: boolean = false;

    /**
     * set one field as the one holding a sequence
     */
    @Input() private sequencefield: string = null;

    /**
     * set to true to hide the actionset menu item being display
     */
    @Input() private hideActions: boolean = false;

    /**
     * @ignore
     *
     * ToDo: check why theese are public
     */
    public nowDragging = false;
    public isSequenced = false;

    constructor(public language: language, public metadata: metadata, public relatedmodels: relatedmodels, public model: model, public layout: layout, public backend: backend) {
    }

    public ngOnInit() {
        if (!this.sequencefield && this.model.fields[this.relatedmodels._linkName].sequence_field) {
            this.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }
        if (this.sequencefield) this.isSequenced = true;
    }

    get isloading() {
        return this.relatedmodels.isloading;
    }

    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    get module() {
        return this.relatedmodels.relatedModule;
    }

    private isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    private setSortField(field): void {
        if (this.isSortable(field)) {
            this.relatedmodels.sortfield = field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field;
        }
    }

    private getSortIcon(field): string {
        if (this.relatedmodels.sortfield == (field.fieldconfig && field.fieldconfig.sortfield ? field.fieldconfig.sortfield : field.field)) {
            if (this.relatedmodels.sort.sortdirection === 'ASC') {
                return 'arrowdown';
            } else {
                return 'arrowup';
            }
        }
    }

    private getIdOfRow(index, item) {
        return item.id;
    }

    private drop(event) {
        let previousItem = this.relatedmodels.items.splice(event.previousIndex, 1);
        this.relatedmodels.items.splice(event.currentIndex, 0, previousItem[0]);

        let updateArray = [];
        let i = 0;
        for (let item of this.relatedmodels.items) {
            item[this.sequencefield] = i;
            updateArray.push({id: item.id, sequence_number: i});
            i++;
        }

        this.backend.postRequest('module/' + this.relatedmodels.relatedModule, {}, updateArray);
    }

    private dragStarted(e) {
        this.nowDragging = true;
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    private dragEnded(e) {
        this.nowDragging = false;
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
