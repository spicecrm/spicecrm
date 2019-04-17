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
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from "../../../services/broadcast.service";
import {language} from "../../../services/language.service";


@Component({
    templateUrl: './src/modules/aclterritories/templates/aclterritorriestypesmanagertypeelementsaddmodal.html',
})
export class ACLTerritorriesTypesmanagerTypeelementsAddModal {

    self: any = {};
    loading: boolean = true;
    elements: Array<any> = [];
    selectedElementId: any = '';
    currentelements: Array<any> = [];
    @Output() newelementid: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private language: language, private elementRef: ElementRef) {
        this.backend.getRequest('spiceaclterritories/core/orgelements').subscribe(elements => {
            for(let element of elements){
                if(this.currentelements.indexOf(element.id) < 0){
                    this.elements.push(element);
                }
            }

            this.elements.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            })

            this.loading = false;
        })
    }

    close() {
        this.self.destroy();
    }

    save() {
        let newElement = {
            id: this.selectedElementId,
            name: ''
        }

        this.elements.some(element => {
            if(element.id == this.selectedElementId){
                newElement.name = element.name;
                return true;
            }
        })

        this.newelementid.emit(newElement);
        this.close();
    }

}