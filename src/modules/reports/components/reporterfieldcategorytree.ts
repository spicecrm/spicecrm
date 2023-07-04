import {ChangeDetectionStrategy, Component} from "@angular/core";
import {configurationService} from "../../../services/configuration.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

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
    public field: {fieldid: string, fieldname: string};
    /**
     * category nodes for a spefcific level object key category node_key value node_name
     * @private
     */
    private categoryNodes: {[key: string]: {node_name: string, node_key: string}} = {};
    /**
     * holds the category field name
     * @private
     */
    private categoryField: string;

    constructor(
        public config: configurationService,
        private metadata: metadata,
        private backend: backend,
    ) {
    }

    // get the display value
    get display_value(): string {

        // if we do not have a value break
        if (!this.record[this.field.fieldid]) return '';

        return this.categoryNodes[this.record[this.field.fieldid]]?.node_name ?? this.record[this.field.fieldid];
    }

    public ngOnInit() {

        const treeId = this.setCategoryField();

        if (!treeId) return;

        // get the categories
        let categories = this.config.getData('categories');
        this.setCategoryNodes(categories[treeId]);

        if (categories && categories[treeId]) return;

        if (!categories) {
            categories = {};
        }

        categories[treeId] = [];

        this.config.setData('categories', categories);

        // load all categories which are needed to display the choosen categories...
        this.backend.getRequest(`configuration/spiceui/core/categorytrees/${treeId}/categorytreenodes`).subscribe(
            (res: any) => {
                categories[treeId] = res;
                this.setCategoryNodes(categories[treeId])
                this.config.setData('categories', categories);
            }
        );
    }

    /**
     * set category field and return tree id
     * @private
     */
    private setCategoryField(): string {

        let treeId;
        const moduleDefs = this.metadata.getModuleDefs(this.record.sugarRecordModule);

        if (!moduleDefs?.categorytrees) return treeId;

        moduleDefs.categorytrees.some(t => {
            const moduleField = Object.keys(t).find(key => t[key] == this.field.fieldname);
            if (moduleField) {
                treeId = t.syscategorytree_id;
                this.categoryField = moduleField;
                return true;
            } else {
                return false;
            }
        });

        return treeId;
    }

    /**
     * set category nodes by level
     * @param categories
     * @private
     */
    private setCategoryNodes(categories) {

        if (!categories || categories.length == 0) return;

        let level = 2;
        const categoriesByLevel = {1: categories.filter(c => !c.parent_id)};

        // if the category field is level 1 no need to use while set the category nodes immediately
        if (this.categoryField.endsWith('1')) {
            this.categoryNodes = window._.object(
                categoriesByLevel[1].map(n => n.node_key),
                categoriesByLevel[1]
            );
            return;
        }

        // start from level 2, level 1 is already set
        while (level <= 4) {

            categoriesByLevel[level] = [];

            categoriesByLevel[level - 1].forEach(parentCat => {
                categoriesByLevel[level] = categoriesByLevel[level].concat(categories.filter(c => c.parent_id == parentCat.id));
            });

            if (this.categoryField.endsWith(String(level))) {
                this.categoryNodes = window._.object(
                    categoriesByLevel[level].map(n => n.node_key),
                    categoriesByLevel[level]
                );

                break;
            }
            level++;
        }
    }
}
