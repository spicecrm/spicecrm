import {
    Component, OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Subject, Observable} from 'rxjs';

import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

declare var moment: any;

@Component({
    templateUrl: './src/objectcomponents/templates/objectoptimisticlockingmodal.html',
    providers: [view]
})
export class ObjectOptimisticLockingModal implements OnInit {

    private self: any = {};
    private componentconfig: any = {};
    public conflicts: any = {};

    constructor(
        private language: language,
        private model: model,
        private view: view,
        private metadata: metadata,
        private modal: modal
    ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.model.module);
    }

    private close() {
        // destroy the component
        this.self.destroy();
    }


    private save(goDetail: boolean = false) {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';

            // set the date modified to now
            this.model.setField('date_modified', new moment());

            this.model.save().subscribe(status => {
                if (status) {

                    /// if go Detail go to record)
                    if (goDetail) {
                        this.model.goDetail();
                    }

                    // destroy the component
                    this.self.destroy();
                }
                modalRef.instance.self.destroy();
            });
        });
    }

}
