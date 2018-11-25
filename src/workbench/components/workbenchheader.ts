import {
    Component, Input
} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'workbench-header',
    templateUrl: './src/workbench/templates/workbenchheader.html',
})
export class WorkbenchHeader {

    @Input() private titlelabel: string;
    @Input() private icon: string = 'custom';

    constructor(
        private language: language,
    ) {

    }

}
