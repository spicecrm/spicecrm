/**
 * @module GlobalComponents
 */
import {
    Component, Input
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigation, objectTab} from '../../services/navigation.service';
import {InputNamesRule} from "@angular/cdk/schematics/ng-update/upgrade-rules/input-names-rule";

@Component({
    selector: 'global-navigation-tabbed-subtabs',
    templateUrl: './src/globalcomponents/templates/globalnavigationtabbedsubtabs.html'
})
export class GlobalNavigationTabbedSubtabs {

    @Input() private parenttab: objectTab;

    constructor(private metadata: metadata, private language: language, private navigation: navigation) {

    }

    /**
     * returns the subtabs
     */
    get subtabs() {
        return this.navigation.getSubTabs(this.parenttab?.id).sort((t1, t2)=> {
            if((t1.pinned && t2.pinned) || (!t1.pinned && !t2.pinned) ) return 0;
            if(t1.pinned) return -1;
            if(t2.pinned) return 1;
        });
    }

    /**
     * a tracker function for the for loop
     *
     * @param index
     * @param item
     */
    private trackByFn(index, item) {
        return item.id;
    }

}
