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
    templateUrl: "./src/modules/outputtemplates/templates/outputtemplatespreview.html"
})
export class OutputTemplatesPreview {

    constructor(private language: language, private metadata: metadata, private model: model) {

    }

}
