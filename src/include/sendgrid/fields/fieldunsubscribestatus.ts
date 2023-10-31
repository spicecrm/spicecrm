import {ChangeDetectorRef, Component, EventEmitter, OnChanges, OnInit, Output, SkipSelf} from "@angular/core";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'field-unsubscribe-status',
    templateUrl: '../templates/fieldunsubscribestatus.html',

})

export class fieldUnsubscribeStatus implements OnInit {

    public subscribed;
    public unsubscribed;

    public self: any;

    constructor(
        public model: model,
        public relatedmodels: relatedmodels,
        public backend: backend,
        public toast: toast,
        public modelutilities: modelutilities,
        public configurationService:configurationService,
        public cdRef: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        if(this.model.getField('prospectlists_contacts_unsubscribegroup_status')==0){
        this.subscribed = true;
        }
        else{
            this.subscribed = false;
        }
        // this.subscribed = this.model.getField('prospectlists_contacts_unsubscribegroup_status');
    }

    // public execute() {
    //     this.model.setField('prospectlists_contacts_unsubscribegroup_status', this.subscribed);
    //
    //     let changedData: any = this.model.getDirtyFields();
    //
    //     changedData.prospectlists_contacts_unsubscribegroup_status = this.model.getField('prospectlists_contacts_unsubscribegroup_status');
    //     changedData.id = this.model.id;
    //
    //     // save related model
    //     this.relatedmodels.setItem(changedData);
    //     this.model.save(true).subscribe(success=>
    //         this.data.emit(changedData)
    //     );
    // }
    public execute(){
            this.unsubscribed = this.subscribed == false ? 1 : 0;

            this.model.setField('prospectlists_contacts_unsubscribegroup_status', this.unsubscribed);
            let changedData: any = this.model.getDirtyFields();

            changedData.prospectlists_contacts_unsubscribegroup_status = this.model.getField('prospectlists_contacts_unsubscribegroup_status');
            changedData.id = this.model.id;

            // save related model
            this.relatedmodels.setItem(changedData);
        let body = {
            unsubscribe_status: this.unsubscribed
        }
        this.backend.postRequest(`channels/emarketing/sendgrid/ProspectListUnsubscribes/${this.relatedmodels.id}/status/${this.model.id}`, null, body).subscribe(response => {
            if(response) {
                this.toast.sendToast('LBL_SUCCESS', 'success');
            } else {
                // this.toast.sendToast('LBL_ERROR', 'error');
            }
        })
    }

    public destroy() {
        this.self.destroy();
    }


}