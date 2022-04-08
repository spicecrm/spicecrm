/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';

@Component({
    selector: 'administration-ftsmanager-fields-add',
    templateUrl: '../templates/administrationftsmanagerfieldsadd.html'
})
export class AdministrationFTSManagerFieldsAdd {

    public links: any[] = [];
    public self: any = {};
    public fields: any[] = [];
    public dragPlaceHolderNode: Node;
    public filterKey: string;
    /**
     * array with the fields for the module of the current selected node
     */
    public nodefields: any[] = [];
    public path: any[] = [];
    /**
     * holds the path to the current selected tree node
     */
    public nodePath: string = '';

    constructor(public metadata: metadata,
                public language: language,
                public ftsconfiguration: ftsconfiguration,
                public backend: backend) {
    }

    get filteredNodeFields() {
        return this.filterKey ? this.nodefields
            .filter(nodeFiled => {
                return nodeFiled.name.toLowerCase().includes(this.filterKey.toLowerCase()) ||
                    (nodeFiled.label && nodeFiled.label.toLowerCase().includes(this.filterKey.toLowerCase()));
            }) : this.nodefields;
    }

    get fieldsDropList() {
        return this.ftsconfiguration.fieldsDropList || '';
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * triggered when an item in the tree is selected
     *
     * @param eventData
     */
    public itemSelected(eventData) {
        window.setTimeout(()=> this.nodePath = eventData.path);
        this.getModuleFields(eventData.module);
    }

    /**
     * loads the fields for a given module
     *
     * @param module the module
     */
    public getModuleFields(module) {
        this.nodefields = [];

        this.backend.getRequest('dictionary/browser/' + module + '/fields').subscribe(items => {
            this.nodefields = items;
        });
    }


    public dropExited(e) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.colSpan = 10;
        td.innerHTML = '&nbsp;';
        td.style.background = '#fff';
        tr.appendChild(td);
        this.dragPlaceHolderNode = tr;
        let index = e.container.data.findIndex(item => item.id == e.item.data.id);
        if (index > -1) {
            e.container.element.nativeElement.insertBefore(tr, e.container.element.nativeElement.children[index]);
        }
    }

    public dropEntered(e) {
        this.removePlaceHolderElement(e.container.element.nativeElement);
    }

    public removePlaceHolderElement(containerElement) {
        if (this.dragPlaceHolderNode) {
            containerElement.removeChild(this.dragPlaceHolderNode);
            this.dragPlaceHolderNode = undefined;
        }
    }

    /**
     * track by function for the list for performance
     *
     * @param i
     * @param item
     */
    public trackByFn(i, item) {
        return item.id;
    }
}

