/**
 * @module ModuleACLTerritories
 */
import {Component, ElementRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';

@Component({
    selector: 'aclterritorries-element-manager',
    templateUrl: '../templates/aclterritorrieselementmanager.html',
})
export class ACLTerritorriesElementmanager {

    public activeElement: string = '';

    constructor(public backend: backend, public navigation: navigation, public elementRef: ElementRef) {
    }

    public setActiveElement(element){
        this.activeElement = element;
    }


}
