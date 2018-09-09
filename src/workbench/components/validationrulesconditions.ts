import {
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {AppDataService} from "../../services/appdata.service";

@Component({
    selector: 'validationrules-conditions',
    templateUrl: './src/workbench/templates/validationrulesconditions.html',
})
export class ValidationRulesConditions implements OnInit
{
    @Input() data; // validation rule data
    comparator_options:any[] = [];
    fieldname_options:any[] = [];

    constructor(
        private appdata: AppDataService,
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
    ) {

    }

    // @Inputs are only loaded here...???
    ngOnInit()
    {
        // get options...
        this.comparator_options = this.language.getDisplayOptions('comparators_dom', true);

        for(let opt in this.metadata.getModuleFields(this.data.module))
        {
            this.fieldname_options.push(opt);
        }
        //console.log(this.data,this.fieldname_options);

    }

    get conditions()
    {
        return this.data.conditions.filter((e) => {return e.deleted != 1});
    }

    addCondition()
    {
        return this.data.conditions.push({
            id: this.utils.generateGuid(),
            sysuimodelvalidation_id: this.data.id,
            _is_new_record: true,
        });
    }

    removeCondition(id)
    {
        let idx = this.data.conditions.findIndex((e) => {return e.id == id});
        if( this.data.conditions[idx]._is_new_record )
        {
            this.data.conditions.splice(idx,1);
        }
        else {
            this.data.conditions[idx].deleted = 1;
        }
        //console.log(this.data.conditions);
        return true;
    }

}