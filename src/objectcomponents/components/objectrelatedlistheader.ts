/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {relatedmodels} from '../../services/relatedmodels.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-relatedlist-header',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistheader.html'
})
export class ObjectRelatedlistHeader {

    @Input() private module: string = '';
    @Input() private actionset: string = '';
    @Input() private title: string = '';
    public isopen: boolean = true;

    constructor(private language: language, private relatedmodels: relatedmodels) {

    }

    get panelTitle() {
        return this.title != '' ? this.language.getLabel(this.title, this.module) : this.language.getModuleName(this.module)
    }

    private toggleOpen() {
        this.isopen = !this.isopen;
    }

    get iconStyle() {
        if (!this.isopen) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }
}
