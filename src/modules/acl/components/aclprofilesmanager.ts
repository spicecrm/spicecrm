import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {modellist} from '../../../services/modellist.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from "../../../services/broadcast.service";


@Component({
    templateUrl: './src/modules/acl/templates/aclprofilesmanager.html',
})
export class ACLProfilesManager {

    @ViewChild('managercontent', {read: ViewContainerRef}) elementmanagercontent: ViewContainerRef;

    activeprofileid: string = '';

    constructor(private backend: backend, private modelutilities: modelutilities, private elementRef: ElementRef) {

    }

    get contentStyle(){
        let rect = this.elementmanagercontent.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.top + 'px'
        }
    }

    setProfile(profileid){
        this.activeprofileid = profileid;
    }


}