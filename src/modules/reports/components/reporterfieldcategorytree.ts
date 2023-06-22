import {ChangeDetectionStrategy, Component} from "@angular/core";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'reporter-field-category-tree',
    templateUrl: '../templates/reporterfieldcategorytree.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldCategoryTree {

    /**
     * the complete record
     */
    public record: any = {};
    /**
     * the field
     */
    public field: any = {};

    constructor(
        public config: configurationService,
    ) {
    }


    // get the display value
    get display_value() {

        let categories = this.config.getData('categories');

        let catArray:any[] = Object.values(categories);
        console.log(categories);

        let cat = catArray[0].find(c => {
            if(c.node_key != this.record[this.field.fieldid]) return false;

            if(c.parent_id != '' && !!c.parent_id) return false;

            return !c.id || c.parent_id == c.id;
        })


        // let cat = this.categories.find(c => {
        //     if(c.node_key != levelvalue) return false;
        //
        //     if(!lastId && c.parent_id != '' && !!c.parent_id) return false;
        //
        //     return !lastId || c.parent_id == lastId;
        // });

        return cat?.node_name;

    }


}
