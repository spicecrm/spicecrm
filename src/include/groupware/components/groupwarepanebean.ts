import {Component, Input, OnInit} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

/**
 * GroupwarePaneBean test
 *
 * * Codeblocks are great for examples
 *
 * ```
 * <my-custom-element>Highlight JS will autodetect the language</my-custom-element>
 * ```
 *
 * ```typescript
 * // Or you can specify the language explicitly
 * const instance = new MyClass();
 * ```
 * This comment _supports_ [Markdown](https://marked.js.org/)
 *
 */
@Component({
    selector: 'groupware-pane-bean',
    templateUrl: './src/include/groupware/templates/groupwarepanebean.html',
    providers: [view]
})
export class GroupwarePaneBean implements OnInit {

    @Input() private bean: any;

    private mainfieldsetfields: any[];
    private subfieldsetfields: any[];

    constructor(
        private groupware: GroupwareService,
        private language: language,
        private metadata: metadata,
        private model: model,
    ) {
    }

    public ngOnInit() {
        // get the fieldconfig
        let componentconfig = this.metadata.getComponentConfig(
            'GlobalHeaderSearchResultsItem',
            this.model.module
        );
        if (componentconfig && componentconfig.mainfieldset) {
            this.mainfieldsetfields = this.metadata.getFieldSetItems(componentconfig.mainfieldset);
        }
        if (componentconfig && componentconfig.subfieldset) {
            this.subfieldsetfields = this.metadata.getFieldSetItems(componentconfig.subfieldset);
        }
    }

    /**
     * Toggles checkbox selection.
     *
     * @param event
     */
    private onClick(event) {
        if (event.target.checked) {
            this.groupware.addBean(this.bean);
        } else {
            this.groupware.removeBean(this.bean);
        }
    }
}
