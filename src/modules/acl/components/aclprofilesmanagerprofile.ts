import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input,
    OnChanges
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {ACLProfilesManagerAddObjectModal} from "./aclprofilesmanageraddobjectmodal";

@Component({
    selector: 'aclprofiles-manager-profile',
    templateUrl: './app/modules/acl/templates/aclprofilesmanagerprofile.html',
})
export class ACLProfilesManagerProfile implements OnChanges {

    @Input() profileid: string = '';
    loaded: boolean = false;

    @ViewChild('header', {read: ViewContainerRef}) header: ViewContainerRef;

    aclobjects: Array<any> = [];

    constructor(private modal: modal, private language: language, private backend: backend) {

    }

    ngOnChanges() {
        this.loaded = false;
        if (this.profileid) {
            this.backend.getRequest('spiceaclprofiles/'+this.profileid+'/aclobjects').subscribe(aclobjects => {
                this.aclobjects = aclobjects;
            })
        }
    }

    selectProfile(){
        this.modal.openModal('ACLProfilesManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.aclobject.subscribe(aclobject => {
                this.backend.postRequest('spiceaclprofiles/'+this.profileid+'/aclobjects/'+aclobject.id).subscribe(status => {
                    this.aclobjects.push(aclobject);
                })
            })
        })
    }

    removeProfile(objectId){
        this.backend.deleteRequest('spiceaclprofiles/'+this.profileid+'/aclobjects/'+objectId).subscribe(status => {
            let i = 0;
            for(let aclobject of this.aclobjects){
                if(aclobject.id == objectId){
                    this.aclobjects.splice(i, 1);
                    return;
                }
                i++;
            }
        })
    }
}