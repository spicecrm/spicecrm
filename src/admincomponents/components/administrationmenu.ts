import {
    Component,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';



@Component({
    selector: '[administration-menu]',
    templateUrl: './src/admincomponents/templates/administrationmenu.html'
})
export class AdministrationMenu
{
    @ViewChild('admincontentcontainer', {read: ViewContainerRef}) admincontentcontainer: ViewContainerRef;
    @ViewChild('adminitemscontainer', {read: ViewContainerRef}) adminitemscontainer: ViewContainerRef;

    admincontentObject: any = null;
    adminNavigation: any = {};
    itemfilter: string = '';
    opened_item:any = {};

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private navigation: navigation,
        private elementref: ElementRef
    ) {
        this.backend.getRequest('spiceui/admin/navigation').subscribe(
            nav => {
                this.adminNavigation = nav;
                // default open version control...
                this.openContent('Versioning','Version Control');
            }
        );

        this.navigation.setActiveModule('Administration');

    }

    getContainerStyle(){
        return {
            height: 'calc(100vh - ' + this.elementref.nativeElement.offsetTop + 'px)'
        }
    }

    getItemsStyle(){
        return {
            height: 'calc(100vh - ' + this.adminitemscontainer.element.nativeElement.offsetTop + 'px)'
        }
    }

    getNavigationBlocks() {
        let blocks = [];
        for (let block in this.adminNavigation) {

            let isRelevant = this.itemfilter == '';

            // check if we find an item
            if(!isRelevant){
                this.adminNavigation[block].some(item => {
                    let name = item.adminaction;
                    if(item.admin_label)
                        name = this.language.getLabel(item.admin_label);
                    if(name.toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0){
                        isRelevant = true;
                        return true;
                    }
                })
            }

            if(isRelevant)
                blocks.push(block);

        }

        return blocks.sort();
    }

    getNavigationItems(block)
    {
        let items = [];

        for (let item of this.adminNavigation[block])
        {
            item.name = item.adminaction;
            if(item.admin_label)
                item.name = this.language.getLabel(item.admin_label);

            if(this.itemfilter == '' || item.name.toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0)
            {
                items.push(item);
            }

        }
        return items;
    }

    openContent(block: string, item)
    {
        // already loaded?
        if( this.opened_item == item )
            return true;

        this.opened_item = item;
        if (this.admincontentObject)
            this.admincontentObject.destroy();

        let adminItem: any = {};

        if( !this.adminNavigation[block] )
            return false;

        this.adminNavigation[block].some(blockAction => {
                if (blockAction.id == item.id) {
                    adminItem = blockAction;
                    return true;
                }
            }
        );

        if (adminItem.component)
            this.metadata.addComponent(adminItem.component, this.admincontentcontainer).subscribe(admObject => {
                admObject.instance.componentconfig = adminItem.componentconfig;
                this.admincontentObject = admObject;
            })
    }

    openDictionaryManager(item: string) {
        if (this.admincontentObject) this.admincontentObject.destroy();

        this.metadata.addComponent("AdministrationDictionaryManager", this.admincontentcontainer).subscribe(admObject => {
            admObject.instance['dictionaryitem'] = item;
            this.admincontentObject = admObject;
        })
    }
}