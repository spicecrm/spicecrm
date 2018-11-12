import {
    Component,
    Input,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
    OnChanges
} from '@angular/core';
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {backend} from "../../services/backend.service";

@Component({
    templateUrl: './src/workbench/templates/workbenchconfig.html',
    selector: 'workbench-config'
})

export class WorkbenchConfig implements OnChanges {

    @ViewChild('optionscontainer', {read: ViewContainerRef}) public optionscontainer: ViewContainerRef;

    @Input() public component: string = "";
    @Input() public configValues: any = {};

    public configOptions: Array<any> = [];
    public optionsElements: Array<any> = [];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language
    ) {
    }

    public ngOnChanges(changes: SimpleChanges) {

        // remove any options elements in case some exist
        for (let option of this.optionsElements) {
            option.destroy();
        }
        this.optionsElements = [];

        // build new config options
        this.configOptions = [];


        let options = this.metadata.getComponentConfigOptions(this.component);
        for (let option in options) {
            this.configOptions.push({
                option: option,
                type: options[option].type ? options[option].type : 'string',
                description: options[option].description ? options[option].description : ''
            });
        }

        // add the elements dynamically
        for (let fieldconfig of this.configOptions) {
            let component = '';
            let type = fieldconfig.type.charAt(0).toUpperCase() + fieldconfig.type.slice(1);
            component = 'WorkbenchConfigOption' + type;

            // check availability
            if (!this.metadata.checkComponent(component)) {

                if(fieldconfig.type == "label") {
                    component = 'LabelSelectorComponent';
                }else {
                    component = 'WorkbenchConfigOptionDefault';
                }
            }

            this.metadata.addComponent(component, this.optionscontainer).subscribe(
                cmpref => {

                    this.optionsElements.push(cmpref);

                    cmpref.instance.option = fieldconfig;
                    cmpref.instance.configValues = this.configValues;

                    if (component == 'LabelSelectorComponent') {
                        console.log("1", fieldconfig);
                        console.log("1", this.configValues);
                        let val = "";
                        val = this.configValues[fieldconfig.option];

                        if (val && this.language.languagedata.applang[val]) {
                            // fake a label object...
                            cmpref.instance._selected_item = {name: val};
                        }
                        cmpref.instance.select$.subscribe(
                            item => {
                                this.configValues[fieldconfig.option] = item.name;
                            }
                        );
                    }
                }
            );
        }
    }
}
