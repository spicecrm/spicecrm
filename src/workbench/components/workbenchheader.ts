/**
 * @module WorkbenchModule
 */
import {
    Component, Input
} from '@angular/core';
import {language} from '../../services/language.service';

/**
 * a generic component that renders a header over workbench element
 */
@Component({
    selector: 'workbench-header',
    templateUrl: '../templates/workbenchheader.html',
})
export class WorkbenchHeader {

    /**
     * the label to be used as title. This is translated with the languaghe service
     */
    @Input() public titlelabel: string;

    /**
     * an icon to be used and rendered
     */
    @Input() public icon: string = 'custom';

    constructor(
        public language: language,
    ) {

    }

}
