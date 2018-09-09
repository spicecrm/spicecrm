import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input,
    OnChanges
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from "../../../services/view.service";

@Component({
    templateUrl: './app/modules/acl/templates/aclprofilesmanageraddprofilemodal.html',
    providers: [model, view]
})
export class ACLProfilesManagerAddProfileModal {

    self: any = {};
    fieldset: string = '';
    @Input() spiceacltype_id: string = '';

    @Output() newObjectData: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private model: model, private view: view, private language: language) {
        // initialize the model
        this.model.module = 'SpiceACLProfiles';
        this.model.initialize();

        this.model.setFieldValue('status', 'd');

        // set the view as editable
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the config
        let componentconfig = this.metadata.getComponentConfig('ACLProfilesManagerAddProfileModal', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }

    ngOnInit(){
        this.model.setFieldValue('spiceacltype_id', this.spiceacltype_id);
    }

    close(){
        this.self.destroy();
    }

    save(){
        this.model.save().subscribe(success => {
            this.newObjectData.emit(this.model.data);
            this.close();
        })

    }
}