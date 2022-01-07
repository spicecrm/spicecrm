/**
 * @module ModuleActivities
 */
import {
    Component,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 */
@Component({
    templateUrl: '../templates/activitiespopoveraddbar.html',
})
export class ActivitiesPopoverAddBar implements OnInit{

    /**
     * the component config
     */
    public componentconfig: any;

    /**
     * an array with the names of the mopdules to be displayxed as quick add buttons
     */
    public modules: string[] = [];

    constructor(public model: model, public language: language, public metadata: metadata) {
    }

    public ngOnInit(): void {
        if(this.componentconfig.modules){
            let modules = this.componentconfig.modules.split(',');
            for(let module of modules){
                if(this.metadata.checkModuleAcl(module, 'create')){
                    this.modules.push(module);
                }
            }
        }
    }
}
