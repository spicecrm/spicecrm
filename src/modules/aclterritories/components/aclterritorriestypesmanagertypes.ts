/**
 * @module ModuleACLTerritories
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'aclterritorries-typesmanager-types',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriestypesmanagertypes.html',
})
export class AclterritorriesTypesmanagerTypes {

    loading: boolean = false;
    types: Array<any> = [];
    _selectedType: any = {};
    @Output() selectedType: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.loadElements();
    }

    loadElements() {
        this.loading = true;
        this.backend.getRequest('spiceaclterritories/core/orgobjecttypes').subscribe(types => {
            this.loading = false;
            this.types = types;

            this.types.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            })
        })
    }

    selectType(type) {
        this._selectedType = type;
        this.selectedType.emit(type.id);
    }

    deleteType(type) {
        this.modal.confirm('Delete Type', 'Delete').subscribe(response => {
            if (response) {
                this.backend.deleteRequest('spiceaclterritories/core/orgobjecttypes/' + type.id).subscribe(success => {
                    this.types.some((element, index) => {
                        if (element.id == type.id) {
                            this.types.splice(index, 1);

                            if (this._selectedType.id == element.id) {
                                this._selectedType = undefined;
                                this.selectType('');
                            }

                            return true;
                        }
                    })
                })
            }
        });
    }

    addType() {
        this.modal.openModal('ACLTerritorriesElementmanagerElementsAddModal').subscribe(modalRef => {
            modalRef.instance.newelementname.subscribe(newName => {

                let newType = {
                    id: this.modelutilities.generateGuid(),
                    name: newName
                };

                this.backend.postRequest('spiceaclterritories/core/orgobjecttypes/' + newType.id, {}, newType).subscribe(elements => {
                    this.types.push(newType);
                    this.selectType(newType);
                });
            })
        })
    }
}