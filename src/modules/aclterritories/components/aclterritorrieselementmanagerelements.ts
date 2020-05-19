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
    templateUrl: './src/modules/aclterritories/templates/aclterritorrieselementmanagerelements.html',
})
export class ACLTerritorriesElementmanagerElements {

    private loading: boolean = false;
    private elements: any[] = [];
    private _selectedElement: any = {};
    @Output() private selectedElement: EventEmitter<any> = new EventEmitter<any>();

    constructor(private navigationtab: navigationtab, private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.loadElements();

        this.setTabTitle();
    }

    /**
     * sets the tab title
     */
    private setTabTitle() {
        this.navigationtab.setTabInfo({displayicon: 'settings', displayname: this.language.getLabel('LBL_TERRITORY_ELEMENTS')});
    }

    /**
     * loads the elements
     */
    private loadElements() {
        this.loading = true;
        this.backend.getRequest('spiceaclterritories/core/orgelements').subscribe(elements => {
            this.elements = elements;

            this.elements.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            this.loading = false;
        });
    }

    private selectElement(element) {
        this._selectedElement = element;
        this.selectedElement.emit(element.id);
    }

    private deleteElement(element) {
        this.modal.confirm('Delete Element', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('spiceaclterritories/core/orgelements/' + element.id).subscribe(success => {
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

    private addElement() {
        this.modal.openModal('ACLTerritorriesElementmanagerElementsAddModal').subscribe(modalRef => {
            modalRef.instance.newelementname.subscribe(newName => {

                let newElement = {
                    id: this.modelutilities.generateGuid(),
                    name: newName
                };

                this.backend.postRequest('spiceaclterritories/core/orgelements/' + newElement.id, {}, newElement).subscribe(elements => {
                    this.elements.push(newElement);
                    this.selectElement(newElement);
                });
            });
        });
    }
}
