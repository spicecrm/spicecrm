import {Component, Input, OnInit, EventEmitter, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-delete-button',
    templateUrl: './src/objectcomponents/templates/objectactiondeletebutton.html',
    providers: [helper]
})
export class ObjectActionDeleteButton implements OnInit {

    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private helper: helper) {

        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public ngOnInit() {
        setTimeout(() => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    get canDelete() {
        try {
            return this.model.data.acl.delete;
        } catch (e) {
            return false;
        }
    }

    public execute() {

        // this.showDialog = true;
        this.helper.confirm(this.language.getAppLanglabel('MSG_DELETE_RECORD'), this.language.getAppLanglabel('MSG_DELETE_RECORD', 'long')).subscribe(answer => {
            if (answer) {
                this.delete();
            }
        });
    }


    private delete() {
        this.model.delete().subscribe(status => {
            this.router.navigate(['/module/' + this.model.module]);
        });
    }

    private handleDisabled(mode) {
        if (!this.canDelete) this.disabled = true;
        this.disabled = mode == 'edit' ? true : false;
    }
}
