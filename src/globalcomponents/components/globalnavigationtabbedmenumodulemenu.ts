/**
 * @module GlobalComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core';
import {Router} from "@angular/router";
import {metadata} from '../../services/metadata.service';
import {recent} from '../../services/recent.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {favorite} from '../../services/favorite.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {GlobalNavigationMenuItemActionContainer} from "./globalnavigationmenuitemactioncontainer";


@Component({
    selector: 'global-navigation-tabbed-module-menu',
    templateUrl: '../templates/globalnavigationtabbedmenumodulemenu.html',
    providers: [model],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalNavigationTabbedMenuModuleMenu implements OnChanges {

    /**
     * reference to the container item where the indivvidual components can be rendered into dynamically
     */
    @ViewChildren(GlobalNavigationMenuItemActionContainer)public menuItemlist: QueryList<GlobalNavigationMenuItemActionContainer>;

    /**
     * the module to display the menu for
     */
    @Input()public module: string;

    /**
     * emits if the users select an action or navigates away
     */
    @Output()public actionTriggered: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the menuitems loaded from the compnentconfig
     */
   public itemMenu: any[] = [];

    /**
     * indicator if the recent items are loaded
     */
   public loadingRecent: boolean = false;

    /**
     * the list of recent items for the module
     */
   public recentitems: any[] = [];

    /**
     * the list of favorites for the module
     */
   public favorites: any[] = [];

    constructor(
       public metadata: metadata,
       public model: model,
       public broadcast: broadcast,
       public navigation: navigation,
       public router: Router,
       public language: language,
       public recent: recent,
       public favorite: favorite,
       public cdRef: ChangeDetectorRef
    ) {

    }

    /**
     * set to true when the model is tracking and thus has recent items
     */
    get trackRecent() {
        if (this.module) {
            return this.metadata.getModuleDefs(this.module)?.track == '1';
        }

        return false;
    }

    /**
     * when the module changes reload the menu, recent items and favorites
     */
    public ngOnChanges(): void {
        // set the module
        this.model.module = this.module;

        // get the config and the menu for the module
        let componentconfig = this.metadata.getComponentConfig('GlobalNavigationMenuItem', this.module);
        if (componentconfig.actionset) {
            this.itemMenu = this.metadata.getActionSetItems(componentconfig.actionset);
        } else {
            this.itemMenu = this.metadata.getModuleMenu(this.module);
        }

        // load the recent items
        this.recentitems = [];
        if (this.trackRecent) {
            if (this.recent.moduleItems[this.module]) {
                this.recentitems = this.recent.moduleItems[this.module];
            } else {
                this.loadingRecent = true;
                this.recent.getModuleRecent(this.module).subscribe(
                    loaded => {
                        this.loadingRecent = false;
                        let recentitems = this.recent.moduleItems[this.module];
                        this.recentitems = recentitems ? recentitems : [];
                        this.cdRef.detectChanges();
                    },
                    error => {
                        this.loadingRecent = false;
                    });
            }
        } else {
            this.recentitems = [];
        }

        // load the favorites
        this.favorites = this.favorite.getFavorites(this.module);
    }

    /**
     * propagets the click to the respective item
     * @param actionid
     */
   public propagateclick(actionid) {
        // trigger the click
        this.menuItemlist.find(actionitem => actionitem.id == actionid)?.execute();

        // emit that a click has happened so the menu can be closed
        this.actionTriggered.emit(true);
    }

    /**
     * determines based on the action ID if the component embedded in the container item is disabled
     *
     * @param actionid the action id
     */
   public isDisabled(actionid) {
        let disabled = true;
        if (this.menuItemlist) {
            this.menuItemlist.some((actionitem: any) => {
                if (actionitem.id == actionid) {
                    disabled = actionitem.disabled;
                    return true;
                }
            });
        }
        return disabled;
    }

    /**
     * open a record with the given id from either tha favorites or the recent items
     *
     * @param recentid
     */
   public openRecord(recentid) {
        // route to the record
        this.router.navigate(['/module/' + this.module + '/' + recentid]);

        // emit that a click has happened so the menu can be closed
        this.actionTriggered.emit(true);
    }

}
