/**
 * @module ModuleActivities
 */
import {
    Component, Input,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 */
@Component({
    templateUrl: '../templates/fieldactivitiesaddactions.html',
})
export class fieldActivitiesAddActions {

    /**
     * the fieldconfig .. typically passed in from the fieldset
     */
    @Input() public fieldconfig: any = {};

    /**
     * an array with the names of the mopdules to be displayxed as quick add buttons
     */
    public modules: string[] = [];

    constructor(public model: model, public language: language, public metadata: metadata) {
    }

    public ngOnInit(): void {
        if(this.fieldconfig.modules){
            let modules = this.fieldconfig.modules.split(',');
            for(let module of modules){
                if(this.metadata.checkModuleAcl(module, 'create')){
                    this.modules.push(module);
                }
            }
        }
    }
}
