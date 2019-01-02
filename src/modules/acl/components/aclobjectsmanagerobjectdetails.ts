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
    OnChanges,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclobjects-manager-object-details',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjectdetails.html',
    providers: [view]
})
export class ACLObjectsManagerObjectDetails implements OnInit {

    private fieldset: string = '';

    private standardactions = [
        {id: 0, action: 'LBL_LIST'},
        {id: 1, action: 'LBL_DETAIL'},
        {id: 2, action: 'LBL_EDIT'},
        {id: 3, action: 'LBL_CREATE'},
        {id: 4, action: 'LBL_DELETE'},
        {id: 5, action: 'LBL_EXPORT'},
        {id: 6, action: 'LBL_IMPORT'},
        {id: 7, action: 'LBL_MASSUPDATE'}
    ];

    private objectactions = [];

    constructor(private view: view, private metadata: metadata, private model: model, private language: language, private backend: backend) {
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerObjectDetails', 'SpiceACLObjects');
        this.fieldset = componentconfig.fieldset;
    }

    public ngOnInit() {
        this.backend.getRequest('spiceaclobjects/authtypes/' + this.model.getFieldValue('spiceacltype_id') + '/authtypeactions').subscribe(objectactions => {
            this.objectactions = objectactions;
        });
    }

    get showActions() {
        return this.model.getFieldValue('spiceaclobjecttype') == '0' || this.model.getFieldValue('spiceaclobjecttype') == '3'
    }

    private getActionValue(actionid) {
        let objectactions = this.model.getFieldValue('objectactions');

        for (let objectaction of objectactions) {
            if (objectaction.spiceaclaction_id == actionid) {
                return true;
            }
        }

        return false;
    }

    private setActionValue(actionid, event) {
        // stop propagation
        event.preventDefault();

        // search for the value
        let objectactions = this.model.getFieldValue('objectactions');
        let i = 0;
        for (let objectaction of objectactions) {
            if (objectaction.spiceaclaction_id == actionid) {
                objectactions.splice(i, 1);
                this.model.setFieldValue('objectactions', objectactions);
                return;
            }
            i++;
        }

        // if not found add it
        objectactions.push({
            spiceaclobject_id: this.model.id,
            spiceaclaction_id: actionid
        });

    }
}
