/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";


@Component({
    selector: 'administration-ftsmanager-fields-add',
    templateUrl: './src/admincomponents/templates/administrationftsmanagerfieldsadd.html'
})
export class AdministrationFTSManagerFieldsAdd {

    public links: any[] = [];
    public self: any = {};
    public fields: any[] = [];
    public ConnectedToDragLists: any[] = ['administration-fts-manager-field-add-drag-table'];
    public ConnectedToDropLists: any[] = ['administration-fts-manager-field-add-drop-table'];
    /**
     * array with the fields for the module of the current selected node
     */
    public nodefields: any[] = [];
    private path: any[] = [];
    private selectedFields: any = {};
    /**
     * holds the path to the current selected tree node
     */
    private nodepath: string = '';

    constructor(private metadata: metadata, private language: language, private ftsconfiguration: ftsconfiguration, private backend: backend, private modelutilities: modelutilities) {
        /*
        this.path.push({
            type: 'root',
            module: this.ftsconfiguration.module,
            path: 'root:' + this.ftsconfiguration.module
        });
        */
        // this.getLinks();

        this.getModuleFields(this.ftsconfiguration.module);

        // this.getFields();
    }

    private chooseBreadcrumb(i) {
        this.path = this.path.slice(0, i + 1);
        this.getLinks();
        this.getFields();
    }

    private getLinks() {
        this.links = [];
        this.backend.getRequest('ftsmanager/core/nodes', {
            node: 'root',
            nodeid: this.buildNodeid()
        }).subscribe(links => {
            this.links = links;
        });
    }

    private setLink(link) {
        this.path.push(link);
        this.getLinks();
        this.getFields();
    }

    private getFields() {
        this.fields = [];
        this.backend.getRequest('ftsmanager/core/fields', {nodeid: this.buildNodeid()}).subscribe(fields => {
            let nodeid = this.buildNodeid();
            for (let field of fields) {
                if (this.ftsconfiguration.searchPath(nodeid + '::field:' + field.name)) {
                    field.exists = true;
                }

                this.fields.push(field);
            }
        });
    }

    private buildNodeid() {
        let nodeArray = [];
        for (let path of this.path) {
            nodeArray.push(path.path);
        }
        return nodeArray.join('::');
    }

    private getFieldLabel(field) {
        let path = this.path[this.path.length - 1].path.split(':');
        return this.language.getFieldDisplayName(path[1], field);
    }

    private selectField(field) {
        if (this.selectedFields[this.buildNodeid() + '::field:' + field.name]) {
            delete (this.selectedFields[this.buildNodeid() + '::field:' + field.name]);
        } else {
            let displaypath = '';
            for (let path of this.path) {
                if (displaypath != '') displaypath += '->';
                displaypath += path.module;
            }
            field.displaypath = displaypath;
            field.fieldname = field.name;
            field.name = this.getFieldLabel(field.name);

            this.selectedFields[this.buildNodeid() + '::field:' + field.fieldname] = field;
        }
    }

    private fieldSelected(fieldname) {
        return !!this.selectedFields[this.buildNodeid() + '::field:' + fieldname];
    }


    private canSave() {
        let itemcount = 0;
        for (let field in this.selectedFields) {
            itemcount++;
        }
        return itemcount > 0;
    }


    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * save the settings
     */
    private save() {
        for (let field in this.selectedFields) {
            if (!this.selectedFields.hasOwnProperty(field)) continue;
            let fieldid = this.modelutilities.generateGuid();

            let fieldpath = '';
            let fieldpathitems = field.split('::');
            for (let fieldpathitem of fieldpathitems) {
                let fieldpathitemelements = fieldpathitem.split(':');
                if (fieldpathitemelements && fieldpathitemelements.length === 3) {
                    fieldpath += fieldpathitemelements[2] + '->';
                }
            }

            this.ftsconfiguration.moduleFtsFields.push({
                id: fieldid,
                fieldid: fieldid,
                fieldname: this.selectedFields[field].fieldname,
                name: this.selectedFields[field].name,
                indexfieldname: fieldpath + this.selectedFields[field].fieldname,
                displaypath: this.selectedFields[field].displaypath,
                path: field,
                search: true,
                indextype: 'string',
                index: 'analyzed'
            });
        }
        this.self.destroy();
    }

    /**
     * triggered when an item in the tree is selected
     *
     * @param eventData
     */
    private itemSelected(eventData) {
        console.log(eventData);
        this.nodepath = eventData.path;
        this.getModuleFields(eventData.module);
    }

    /**
     * loads the fields for a given module
     *
     * @param module the module
     */
    private getModuleFields(module) {
        this.nodefields = [];

        this.backend.getRequest('/dictionary/browser/' + module + '/fields').subscribe(items => {
            this.nodefields = items;
        });
    }


    private rightDrop(dragEvent: CdkDragDrop<any>) {
        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
        } else {
            let targetArray = [];

            /*
            * this will handle removing the item from the left list and put it in the temporary targetArray
            * we do this because the dragged item does not have the same structure as the items in the drop list
            */
            transferArrayItem(dragEvent.previousContainer.data,
                targetArray,
                dragEvent.previousIndex,
                dragEvent.currentIndex);
            console.log(this.nodefields);
            console.log(targetArray);
            let dropItem = targetArray[0];
            // ToDo: Push the dropItem to the right List
        }
    }

    private leftDrop(dragEvent: CdkDragDrop<any>) {
        moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
    }

    private trackByFn(i, item) {
        return item.id;
    }
}

