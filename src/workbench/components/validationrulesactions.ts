/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'validationrules-actions',
    templateUrl: './src/workbench/templates/validationrulesactions.html',
})
export class ValidationRulesActions implements OnInit
{
    @Input() data; // validation rule data
    readonly action_options = [
        'set_value',
        'set_model_state',
        'set_stati',
        'set_message',
        'error',
        'warning',
        'notice',
        'hide',
        'show',
        'require',
    ];
    fieldname_options:any[] = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
    ) {

    }

    // @Inputs are only loaded here...???
    ngOnInit()
    {
        for(let opt in this.metadata.getModuleFields(this.data.module))
        {
            this.fieldname_options.push(opt);
        }
    }

    get actions()
    {
        return this.data.actions.filter((e) => {return e.deleted != 1});
    }

    addAction()
    {
        return this.data.actions.push({
            id: this.utils.generateGuid(),
            sysuimodelvalidation_id: this.data.id,
            isnewrecord: true,
        });
    }

    removeAction(id)
    {
        let idx = this.data.actions.findIndex((e) => {return e.id == id});
        if( this.data.actions[idx].isnewrecord )
        {
            this.data.actions.splice(idx,1);
        }
        else {
            this.data.actions[idx].deleted = 1;
        }
        return true;
        //return this.data.actions.splice(idx,1);
    }

}
