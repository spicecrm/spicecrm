/**
 * @module moduleProjects
 */
import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {session} from '../../../services/session.service';
import {broadcast} from '../../../services/broadcast.service';
import {fieldGeneric} from '../../../objectfields/components/fieldgeneric';

/**
 * @ignore
 */
declare var moment: any;
declare var _: any;

@Component({
    selector: 'field-project-activity-startdate',
    templateUrl: '../templates/fieldprojectactivitystartdate.html',

})
export class fieldProjectActivityStartdate extends fieldGeneric {

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public session: session,
        public modal: modal,
        public broadcast: broadcast,
        public injector: Injector
    ) {
        super(model, view, language, metadata, router);
    }

    get canManage() {
        return !this.model.isEditing && this.model.getField('assigned_user_id') == this.session.authData.userId;
    }

    public start() {
        this.model.startEdit();
        this.value = new moment();
        this.model.save();
    }

    /**
     * records a new activity record
     * @private
     */
    public record() {
        this.modal.openModal('ProjectActivityConfirmation', true, this.injector).subscribe(modalRef => {
            modalRef.instance.action.subscribe(action => {
                if (action == 'save') {
                    // mimick a changed message so the Kanban board updates properly
                    let backupData = this.model.buildBackup(this.model.data);
                    this.model.getData().subscribe(data => {
                        // buld the changed object
                        let d = {};
                        for (let property in data) {
                            // if (property && (!this.backupData || _.isObject(this.data[property]) || _.isArray(this.data[property]) || !_.isEqual(this.data[property], this.backupData[property]) || this.isFieldARelationLink(property))) {
                            if (property && (!backupData || !_.isEqual(data[property], backupData[property]))) {
                                d[property] = data[property];
                            }
                        }

                        // emit the broadcast
                        this.broadcast.broadcastMessage("model.save", {
                            id: this.model.id,
                            module: this.model.module,
                            data: data,
                            changed: d,
                            backupdata: backupData
                        });
                    });
                }
            });
        });
    }

    /**
     * cancel the time recording
     * @private
     */
    public cancel() {
        this.modal.confirm('MSG_CANCEL_ACTIVITY', 'MSG_CANCEL_ACTIVITY').subscribe(response => {
            if (response) {
                this.model.startEdit();
                this.value = null;
                this.model.save();
            }
        })
    }

    /**
     * stops the recording if a start date is set
     * @private
     */
    public stop() {
        this.modal.openModal('ProjectActivityConfirmation', true, this.injector).subscribe(modalRef => {
            modalRef.instance.action.subscribe(action => {
                if (action == 'save') {
                    this.model.startEdit();
                    this.value = null;
                    this.model.save();
                }
            });
        });
    }

}
