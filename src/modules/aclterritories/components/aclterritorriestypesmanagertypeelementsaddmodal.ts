/**
 * @module ModuleACLTerritories
 */
import {
    Component,
    ElementRef,
    Output,
    EventEmitter
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from "../../../services/language.service";

@Component({
    selector: 'aclterritorries-types-manager-type-elements-add-modal',
    templateUrl: '../templates/aclterritorriestypesmanagertypeelementsaddmodal.html',
})
export class ACLTerritorriesTypesmanagerTypeelementsAddModal {

    public self: any = {};
    public loading: boolean = true;
    public elements: any[] = [];
    public selectedElementId: any = '';
    public currentelements: any[] = [];
    @Output() public newelementid: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend, public language: language, public elementRef: ElementRef) {
        this.backend.getRequest('module/SpiceACLTerritories/core/territoryelements').subscribe(elements => {
            for(let element of elements) {
                if(this.currentelements.indexOf(element.id) < 0) {
                    this.elements.push(element);
                }
            }

            this.elements.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            this.loading = false;
        });
    }

    public close() {
        this.self.destroy();
    }

    public save() {
        let newElement = {
            id: this.selectedElementId,
            name: ''
        };

        this.elements.some(element => {
            if(element.id == this.selectedElementId) {
                newElement.name = element.name;
                return true;
            }
        });

        this.newelementid.emit(newElement);
        this.close();
    }

}
