import {Component, Input, SimpleChanges, ViewChild, ViewContainerRef, OnChanges} from '@angular/core';
import {metadata} from "../../services/metadata.service";
import {ComponentsetManagerComponentsetDetails} from "./componentsetmanagercomponentsetdetails";
import {language} from "../../services/language.service";
import {backend} from "../../services/backend.service";
import {view} from '../../services/view.service';

@Component({
    templateUrl: './src/workbench/templates/workbenchconfig.html',
    selector: 'workbench-config'
})

    export class WorkbenchConfig implements OnChanges {

    @ViewChild('optionscontainer', {read: ViewContainerRef}) optionscontainer: ViewContainerRef;

    @Input() inputObj: any = {};
    configOptions: Array<any> = [];

    optionsElements: Array<any> = [];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private view: view
    ) {}

    ngOnChanges(changes: SimpleChanges) {

        let objType = "component";
        if ('field' in this.inputObj){
            objType = "field";
        }

        // remove any options elements in case some exist
        for (let option of this.optionsElements) {
            option.destroy();
        }
        this.optionsElements = [];

        // build new config options
        this.configOptions = [];

        if(typeof this.inputObj !== 'undefined') {
            if ('component' in this.inputObj) {
                let options = this.metadata.getComponentConfigOptions(this.inputObj.component);
                for (let option in options) {
                    this.configOptions.push({
                        option: option,
                        type: options[option].type ? options[option].type : 'string'
                    });
                }
            }
            if ('field' in this.inputObj) {
                let fieldComponent = this.metadata.getFieldTypeComponent(this.inputObj.fieldconfig.fieldtype);
                let options = this.metadata.getComponentConfigOptions(fieldComponent);
                for (let option in options) {
                    this.configOptions.push({
                        option: option,
                        type: options[option].type ? options[option].type : 'string'
                    });
                }
            }
        }
        // add the elements dynamically
        for (let option of this.configOptions)
        {
            let component = '';
            let type = option.type.charAt(0).toUpperCase() + option.type.slice(1);
            component = 'WorkbenchConfigOption' + type;

            //check availability
            if(!this.metadata.checkComponent(component)){
                component = 'WorkbenchConfigOptionDefault';
            }

            this.metadata.addComponent(component, this.optionscontainer).subscribe(

                cmpref => {

                    this.optionsElements.push(cmpref);
                    cmpref.instance.option = option;            // dirty!
                    cmpref.instance.component = this.inputObj; // dirty!

                    if(component == 'LabelSelectorComponent')
                    {
                        let val = "";
                        if ('field' in this.inputObj) {
                            val = this.inputObj.fieldconfig[option.option];
                        }else{
                            val = this.inputObj.componentconfig[option.option];
                        }
                        if(val && this.language.languagedata.applang[val])
                        {
                            // fake a label object...
                            cmpref.instance._selected_item = {name: val};
                        }

                        cmpref.instance.select$.subscribe(
                            item =>
                            {
                                if ('field' in this.inputObj) {
                                    this.inputObj.fieldconfig[option.option] = item.name;
                                }else{
                                    this.inputObj.componentconfig[option.option] = item.name;
                                }
                            }
                        )
                    }
                }
            );
        }
    }

    // getInputObjConfig() {
    //     if (this.inputObj.componentconfig)
    //         return JSON.stringify(this.inputObj.componentconfig);
    // }
}