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
    templateUrl: './src/modules/acl/templates/aclprofilesmanageraddprofilemodal.html',
    providers: [model, view]
})
export class ACLProfilesManagerAddProfileModal {

    private self: any = {};
    private fieldset: string = '';
    @Input() private sysmodule_id: string = '';

    @Output() private newObjectData: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private model: model, private view: view, private language: language) {
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

    private close() {
        this.self.destroy();
    }

    private save() {
        this.model.save().subscribe(success => {
            this.newObjectData.emit(this.model.data);
            this.close();
        });
    }
}
