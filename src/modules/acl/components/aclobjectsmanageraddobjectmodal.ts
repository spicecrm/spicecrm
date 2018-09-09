import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit,
    Output,
    Input,
    EventEmitter
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'aclobjects-manager-add-object-modal',
    templateUrl: './src/modules/acl/templates/aclobjectsmanageraddobjectmodal.html',
    providers: [model, view]
})
export class ACLObjectsManagerAddObjectModal implements OnInit{

    self: any = {};
    fieldset: string = '';
    @Input() spiceacltype_id: string = '';

    @Output() newObjectData: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private model: model, private view: view, private language: language) {
        // initialize the model
        this.model.module = 'SpiceACLObjects';
        this.model.initialize();

        this.model.setFieldValue('status', 'd');

        // set the view as editable
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerAddObjectModal');
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