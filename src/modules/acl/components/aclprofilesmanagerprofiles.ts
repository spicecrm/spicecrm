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
import {Http, RequestOptions, Headers} from '@angular/http';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';
import {ACLObjectsManagerAddObjectModal} from "./aclobjectsmanageraddobjectmodal";


@Component({
    selector: 'aclprofiles-manager-profiles',
    templateUrl: './app/modules/acl/templates/aclprofilesmanagerprofiles.html',
})
export class ACLProfilesManagerProfiles {

    @ViewChild('header', {read: ViewContainerRef}) header: ViewContainerRef;

    loading: boolean = false;

    aclprofiles: Array<any> = [];
    activeProfileId: String = '';
    searchterm: String = '';

    @Output() profileselected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {
        this.getProfiles();
    }

    keyUp(_e) {
        switch (_e.key) {
            case 'Enter':
                this.getProfiles();
                break;
        }
    }

    getProfiles() {
        this.loading = true;
        this.aclprofiles = [];

        // reset the selection
        this.activeProfileId = '';
        this.profileselected.emit(this.activeProfileId);

        let params = {fields: ['id', 'name', 'description', 'status'], searchterm: this.searchterm};

        this.backend.getRequest('module/SpiceACLProfiles', params).subscribe(aclprofiles => {
            this.aclprofiles = aclprofiles.list;
            this.loading = false;
        })
    }

    get contentStyle() {
        let rect = this.header.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        }
    }

    addProfile(){
        this.modal.openModal('ACLProfilesManagerAddProfileModal').subscribe(modalRef => {

            modalRef.instance.newObjectData.subscribe(modelData => {
                if(modelData){
                    this.aclprofiles.push(modelData);
                    this.selectProfile(modelData);
                }
            })
        })
    }

    selectProfile(aclprofile) {
        this.activeProfileId = aclprofile.id;
        this.profileselected.emit(this.activeProfileId);
    }

    activateProfile(profileid){
        this.backend.postRequest('spiceaclprofiles/'+profileid+'/activate').subscribe(aclobjects => {
            this.aclprofiles.some(profile => {
                if(profile.id == profileid){
                    profile.status = 'r';
                    return true;
                }
            })
        })
    }

    deactivateProfile(profileid){
        this.backend.postRequest('spiceaclprofiles/'+profileid+'/deactivate').subscribe(aclobjects => {
            this.aclprofiles.some(profile => {
                if(profile.id == profileid){
                    profile.status = 'd';
                    return true;
                }
            })
        })
    }

}