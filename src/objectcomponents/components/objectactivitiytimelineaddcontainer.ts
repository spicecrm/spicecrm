import {AfterViewInit, Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline-add-container',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineaddcontainer.html'
})
export class ObjectActivitiyTimelineAddContainer implements OnInit{

    currenttab: string = '';
    tabs: Array<any> = [];

    constructor(private model: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService, private metadata: metadata) {

    }

    ngOnInit(){
        let config = this.metadata.getComponentConfig('ObjectActivitiyTimelineAddContainer', this.model.module);
        if(config && config.componentset){
            let componentsetComponents = this.metadata.getComponentSetObjects(config.componentset);
            for(let componentsetComponent of componentsetComponents){
                // check if we have erdit right on the module
                if(componentsetComponent.componentconfig.module && this.metadata.checkModuleAcl(componentsetComponent.componentconfig.module, 'edit')) {
                    this.tabs.push({
                        module: componentsetComponent.componentconfig.module,
                        component: componentsetComponent.component,
                        componentconfig: componentsetComponent.componentconfig
                    });
                }
            };
            this.currenttab = this.tabs[0].module;
        } else if(config && config.tabs && config.tabs.length > 0) {
            this.tabs = config.tabs;
            this.currenttab = config.tabs[0].module;
        }
    }

    setTab(object) {
        this.currenttab = object;
    }

    checkTab(object){
        return this.currenttab == object;
    }

    tabClass(object){
        return this.currenttab == object.module ? 'slds-show' : 'slds-hide';
    }

}