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

    @ViewChild('optionscontainer', {read: ViewContainerRef}) optionscontainer: ViewContainerRef;

    @Input() component: string = "";
    @Input() configValues: any = {};

    configOptions: Array<any> = [];
    optionsElements: Array<any> = [];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {

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
                type: options[option].type ? options[option].type : 'string'
            });
        }

        // add the elements dynamically
        for (let option of this.configOptions) {
            let component = '';
            let type = option.type.charAt(0).toUpperCase() + option.type.slice(1);
            component = 'WorkbenchConfigOption' + type;

            //check availability
            if (!this.metadata.checkComponent(component)) {
                component = 'WorkbenchConfigOptionDefault';
            }

            this.metadata.addComponent(component, this.optionscontainer).subscribe(
                cmpref => {

                    this.optionsElements.push(cmpref);

                    cmpref.instance.option = option;
                    cmpref.instance.configValues = this.configValues;

                    if (component == 'LabelSelectorComponent') {
                        let val = "";
                        val = this.configValues[option.option];

                        if (val && this.language.languagedata.applang[val]) {
                            // fake a label object...
                            cmpref.instance._selected_item = {name: val};
                        }
                        cmpref.instance.select$.subscribe(
                            item => {
                                this.configValues[option.option] = item.name;
                            }
                        )
                    }
                }
            );
        }
    }

}