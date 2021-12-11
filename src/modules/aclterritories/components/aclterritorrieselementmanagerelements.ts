/**
 * @module ModuleACLTerritories
 */
import {
    Component,
    Output,
    EventEmitter
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigationtab} from '../../../services/navigationtab.service';

@Component({
    selector: 'aclterritorries-elementmanager-elements',
    templateUrl: '../templates/aclterritorrieselementmanagerelements.html',
})
export class ACLTerritorriesElementmanagerElements {

    public loading: boolean = false;
    public elements: any[] = [];
    public _selectedElement: any = {};
    @Output() public selectedElement: EventEmitter<any> = new EventEmitter<any>();

    constructor(public navigationtab: navigationtab, public backend: backend, public modal: modal, public language: language, public modelutilities: modelutilities) {
        this.loadElements();

        this.setTabTitle();
    }

    /**
     * sets the tab title
     */
    public setTabTitle() {
        this.navigationtab.setTabInfo({displayicon: 'settings', displayname: this.language.getLabel('LBL_TERRITORY_ELEMENTS')});
    }

    /**
     * loads the elements
     */
    public loadElements() {
        this.loading = true;
        this.backend.getRequest('module/SpiceACLTerritories/core/territoryelements').subscribe(elements => {
            this.elements = elements;

            this.elements.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            this.loading = false;
        });
    }

    public selectElement(element) {
        this._selectedElement = element;
        this.selectedElement.emit(element.id);
    }

    public deleteElement(element) {
        this.modal.confirm('Delete Element', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('module/SpiceACLTerritories/core/territoryelements/' + element.id).subscribe(success => {
                    this.elements.some((thiselement, index) => {
                        if (thiselement.id == element.id) {
                            this.elements.splice(index, 1);
                            this.selectElement({id: ''});
                            return true;
                        }
                    });
                });
            }
        });
    }

    public addElement() {
        this.modal.openModal('ACLTerritorriesElementmanagerElementsAddModal').subscribe(modalRef => {
            modalRef.instance.newelementname.subscribe(newName => {

                let newElement = {
                    id: this.modelutilities.generateGuid(),
                    name: newName
                };

                this.backend.postRequest('module/SpiceACLTerritories/core/territoryelements/' + newElement.id, {}, newElement).subscribe(elements => {
                    this.elements.push(newElement);
                    this.selectElement(newElement);
                });
            });
        });
    }
}
