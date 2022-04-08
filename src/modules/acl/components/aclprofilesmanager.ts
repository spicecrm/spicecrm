/**
 * @module ModuleACL
 */
import {
    Component,
    ElementRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: '../templates/aclprofilesmanager.html',
})
export class ACLProfilesManager {

    public activeprofileid: string = '';
    public activeprofile: any;

    constructor(public backend: backend, public modelutilities: modelutilities, public elementRef: ElementRef) {

    }

    public setProfile(profile: any) {
        this.activeprofile = profile;
        this.activeprofileid = profile.id;
    }
}
