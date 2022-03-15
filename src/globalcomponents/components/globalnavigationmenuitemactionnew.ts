/**
 * @module GlobalComponents
 */
import {
    Component,
    OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-navigation-menu-item-action-new',
    templateUrl: '../templates/globalnavigationmenuitemactionnew.html'
})
export class GlobalNavigationMenuItemActionNew implements OnInit {

    public disabled: boolean = true;

    constructor(public language: language, public model: model, public metadata: metadata) {
    }

    public execute() {
        this.model.id = '';
        this.model.addModel();
    }

    public ngOnInit() {
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }
    }
}
