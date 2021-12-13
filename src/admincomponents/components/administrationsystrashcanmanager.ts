/**
 * @module AdminComponentsModule
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {userpreferences} from '../../services/userpreferences.service';
import {footer} from '../../services/footer.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'administration-systrashcan-manager',
    templateUrl: '../templates/administrationsystrashcanmanager.html'
})
export class AdministrationSysTrashcanManager implements OnInit {

    public records: any[] = [];
    public loaddate: any = {};
    public loading: boolean = true;

    constructor(public metadata: metadata, public modal: modal, public backend: backend, public language: language, public userpreferences: userpreferences, public footer: footer) {
    }

    public ngOnInit() {
        this.getEntries();
    }

    public getEntries() {
        this.backend.getRequest('admin/systrashcan').subscribe(records => {
            this.records = records;
            this.loaddate = new moment();
            this.loading = false;
        });
    }

    public reload() {
        this.loading = true;
        this.records = [];
        this.getEntries();
    }

    public getUserDate(date) {
        return this.userpreferences.formatDateTime(date);
    }

    public recoverRecord(record) {
        this.modal.openModal('AdministrationSysTrashcanRecover').subscribe(componentRef =>{
            componentRef.instance.record = record;
            // subscribe to recovered event and if it is treu remove from the list
            componentRef.instance.recovered.subscribe(recovered => {
                if (recovered) {
                    this.records.some((thisRecord, thisIndex) => {
                        if (thisRecord.id == record.id) {
                            this.records.splice(thisIndex, 1);
                            return true;
                        }
                    });
                }
            });
        });
    }

    public getModule(singular) {
        return this.metadata.getModuleFromSingular(singular)
    }

    get loadDate() {
        if (this.loaddate) {
            return this.getUserDate(this.loaddate);
        } else {
            return '---';
        }
    }
}
