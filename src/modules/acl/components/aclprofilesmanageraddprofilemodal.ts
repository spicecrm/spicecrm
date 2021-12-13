/**
 * @module ModuleACL
 */
import {
    Component,
    Output,
    EventEmitter,
    Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";

@Component({
    templateUrl: '../templates/aclprofilesmanageraddprofilemodal.html',
    providers: [model, view]
})
export class ACLProfilesManagerAddProfileModal {

    public self: any = {};
    public fieldset: string = '';
    @Input() public sysmodule_id: string = '';

    @Output() public newObjectData: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, public model: model, public view: view, public language: language) {
        // initialize the model
        this.model.module = 'SpiceACLProfiles';
        this.model.initialize();

        this.model.setField('status', 'd');

        // set the view as editable
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the config
        let componentconfig = this.metadata.getComponentConfig('ACLProfilesManagerAddProfileModal', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }

    public ngOnInit() {
        this.model.setField('sysmodule_id', this.sysmodule_id);
    }

    public close() {
        this.self.destroy();
    }

    public save() {
        this.model.save().subscribe(success => {
            this.newObjectData.emit(this.model.data);
            this.close();
        });
    }
}
