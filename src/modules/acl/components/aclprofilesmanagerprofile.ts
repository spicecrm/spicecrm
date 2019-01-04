import {
    Component,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclprofiles-manager-profile',
    templateUrl: './src/modules/acl/templates/aclprofilesmanagerprofile.html',
})
export class ACLProfilesManagerProfile implements OnChanges {

    @Input() private profileid: string = '';
    private loaded: boolean = false;
    private loadingobjects: boolean = false;
    private loadingusers: boolean = false;
    private activetab: string = 'profiles';

    @ViewChild('header', {read: ViewContainerRef}) private header: ViewContainerRef;

    private aclobjects: any[] = [];
    private aclusers: any[] = [];

    constructor(private modal: modal, private language: language, private backend: backend) {

    }

    public ngOnChanges() {
        this.loaded = false;
        if (this.profileid) {
            this.loadingobjects = true;
            this.aclobjects = [];
            this.loadingusers = true;
            this.aclusers = [];
            this.backend.getRequest('spiceaclprofiles/' + this.profileid + '/aclobjects').subscribe(aclobjects => {
                this.aclobjects = aclobjects;
                this.loadingobjects = false;
            });

            this.backend.getRequest('spiceaclprofiles/' + this.profileid + '/aclusers').subscribe(aclusers => {
                this.aclusers = aclusers;
                this.loadingusers = false;
            });
        }
    }

    private selectProfile() {
        this.modal.openModal('ACLProfilesManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.aclobject.subscribe(aclobject => {
                this.backend.postRequest('spiceaclprofiles/' + this.profileid + '/aclobjects/' + aclobject.id).subscribe(status => {
                    this.aclobjects.push(aclobject);
                });
            });
        });
    }

    private removeProfile(objectId) {
        this.backend.deleteRequest('spiceaclprofiles/' + this.profileid + '/aclobjects/' + objectId).subscribe(status => {
            let i = 0;
            for (let aclobject of this.aclobjects) {
                if (aclobject.id == objectId) {
                    this.aclobjects.splice(i, 1);
                    return;
                }
                i++;
            }
        });
    }

    private removeUser(userId) {
        this.backend.deleteRequest('spiceaclprofiles/' + this.profileid + '/aclusers/' + userId).subscribe(status => {
            let i = 0;
            for (let aclusers of this.aclusers) {
                if (aclusers.id == userId) {
                    this.aclusers.splice(i, 1);
                    return;
                }
                i++;
            }
        });
    }

    private selectUser() {
        /*
        this.modal.openModal('ACLProfilesManagerAddObjectModal').subscribe(modalRef => {
            modalRef.instance.aclobject.subscribe(aclobject => {
                this.backend.postRequest('spiceaclprofiles/'+this.profileid+'/aclobjects/'+aclobject.id).subscribe(status => {
                    this.aclobjects.push(aclobject);
                });
            });
        });
        */
    }
}
