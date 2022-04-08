/**
 * @module ModuleACL
 */
import {
    Component,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'aclobjects-manager-object-details',
    templateUrl: '../templates/aclobjectsmanagerobjectdetails.html',
    providers: [view]
})
export class ACLObjectsManagerObjectDetails implements OnInit {

    public fieldset: string = '';

    public standardactions = [
        {id: 'list', action: 'LBL_LIST'},
        {id: 'listrelated', action: 'LBL_LISTRELATED'},
        {id: 'view', action: 'LBL_VIEW'},
        {id: 'editrelated', action: 'LBL_EDITRELATION'},
        {id: 'edit', action: 'LBL_EDIT'},
        {id: 'create', action: 'LBL_CREATE'},
        {id: 'deleterelated', action: 'LBL_REMOVERELATION'},
        {id: 'delete', action: 'LBL_DELETE'},
        {id: 'export', action: 'LBL_EXPORT'},
        {id: 'import', action: 'LBL_IMPORT'},
        {id: 'massupdate', action: 'LBL_MASSUPDATE'}
        // {id: 8, action: 'LBL_REASSIGN'},
        // {id: 9, action: 'LBL_CHANGE_TERRITORY'}
    ];

    public objectactions = [];

    constructor(public view: view, public metadata: metadata, public model: model, public language: language, public backend: backend) {
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerObjectDetails', 'SpiceACLObjects');
        this.fieldset = componentconfig.fieldset;
    }

    public ngOnInit() {
        this.backend.getRequest('module/SpiceACLObjects/modules/' + this.model.getFieldValue('sysmodule_id') + '/actions').subscribe(objectactions => {
            this.objectactions = objectactions;
            this.objectactions.sort((a, b) => a.action.localeCompare(b.action));
        });
    }

    get showActions() {
        return this.model.getFieldValue('spiceaclobjecttype') == '0' || this.model.getFieldValue('spiceaclobjecttype') == '3';
    }

    public getActionValue(actionid) {
        let objectactions = this.model.getFieldValue('objectactions');

        for (let objectaction of objectactions) {
            if (objectaction.spiceaclaction_id == actionid) {
                return true;
            }
        }

        return false;
    }

    public setActionValue(actionid, event) {
        let objectactions = this.model.getFieldValue('objectactions');
        if(event){
            objectactions.push({
                spiceaclobject_id: this.model.id,
                spiceaclaction_id: actionid
            });
        } else {
            let i = objectactions.findIndex(a => a.spiceaclaction_id == actionid);
            objectactions.splice(i, 1);
        }
    }
}
