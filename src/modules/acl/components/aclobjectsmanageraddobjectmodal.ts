/**
 * @module ModuleACL
 */
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
    templateUrl: '../templates/aclobjectsmanageraddobjectmodal.html',
    providers: [model, view]
})
export class ACLObjectsManagerAddObjectModal implements OnInit {

    public self: any = {};
    public fieldset: string = '';
    @Input() public sysmodule_id: string = '';

    @Output() public newObjectData: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, public model: model, public view: view, public language: language) {
        // initialize the model
        this.model.module = 'SpiceACLObjects';
        this.model.initialize();

        this.model.setField('status', 'd');

        // set the view as editable
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerAddObjectModal');
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
