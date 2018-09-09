import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit,
    EventEmitter
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {userpreferences} from '../../services/userpreferences.service';
import {toast} from '../../services/toast.service';

declare var moment: any;

@Component({
    templateUrl: './src/admincomponents/templates/administrationsystrashcanrecover.html'
})
export class AdministrationSysTrashcanRecover implements OnInit {

    @Input() record: any = {};
    self: any = {};
    relatedRecords: Array<any> = [];
    loading: boolean = true;
    recoverrelated: boolean = false;
    recovering: boolean = false;
    recovered: EventEmitter<boolean> = new EventEmitter<boolean>();


    constructor(private metadata: metadata, private backend: backend, private language: language, private toast: toast) {
    }

    ngOnInit() {
        this.backend.getRequest('/systrashcan/related/'+this.record.transactionid+'/'+this.record.recordid).subscribe(related => {
            this.relatedRecords = related;

            if(this.relatedRecords.length > 0)
                this.recoverrelated = true;

            this.loading = false;
        });
    }

    close(){
        this.recovered.emit(false);
        this.self.destroy();
    }

    getModule(singular){
        return this.metadata.getModuleFromSingular(singular)
    }

    get recorverDisabled(){
        return this.relatedRecords.length == 0
    }

    doRecover(){
        this.recovering = true;
        this.backend.postRequest('/systrashcan/recover/'+this.record.id, {recoverrelated: this.recoverrelated}).subscribe(result => {
            this.toast.sendToast('record '+ this.record.recordname +' recovered')
            this.recovered.emit(true);
            this.self.destroy();
        })
    }

}