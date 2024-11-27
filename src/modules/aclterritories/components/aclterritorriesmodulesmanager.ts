/**
 * @module ModuleACLTerritories
 */
import { Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'aclterritorries-modules-manager',
    templateUrl: '../templates/aclterritorriesmodulesmanager.html',
})
export class ACLTerritorriesModulessmanager {

    @ViewChild('modulesmanagercontent', {read: ViewContainerRef, static: true}) elementmanagercontent: ViewContainerRef;

    activeType: string = '';

    constructor(public backend: backend, public navigation: navigation, public elementRef: ElementRef) {
    }

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px'
        }
    }

    setType(newType){
        this.activeType = newType;
    }

}
