/**
 * @module ModuleOutputTenmplates
 */
import {
    Component
} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

declare var moment: any;

/**
 * renders a tabbed view for body, header and footer of a template
 */
@Component({
    templateUrl: "../templates/outputtemplateseditor.html"
})
export class OutputTemplatesEditor {

    /**
     * the currently selected tab
     */
    public selectedTab: 'body' | 'header' | 'footer' | 'preview' = 'body';

    /**
     * the component config as passed in
     */
    public componentconfig: any = {};

    constructor(public language: language, public metadata: metadata, public model: model) {

    }

    /**
     * getter fo tthe body fieldset
     */
    get bodyfieldset() {
        return this.componentconfig.body;
    }

    /**
     * getter for the header fieldset
     */
    get headerfieldset() {
        return this.componentconfig.header;
    }

    /**
     * getter fot the footer fieldset
     */
    get footerfieldset() {
        return this.componentconfig.footer;
    }

}
