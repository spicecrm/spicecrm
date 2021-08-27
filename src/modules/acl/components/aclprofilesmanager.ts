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
    templateUrl: './src/modules/acl/templates/aclprofilesmanager.html',
})
export class ACLProfilesManager {

    private activeprofileid: string = '';
    private activeprofile: any;

    constructor(private backend: backend, private modelutilities: modelutilities, private elementRef: ElementRef) {

    }

    private setProfile(profile: any) {
        this.activeprofile = profile;
        this.activeprofileid = profile.id;
    }
}
