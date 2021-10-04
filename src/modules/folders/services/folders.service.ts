import {Injectable} from "@angular/core";

declare var _;


@Injectable()

export class FoldersService {
     public sourceList: any[] = [];
    //
    // public addNew() {
    //     this.sourceList.push({
    //         id: 8,
    //         parent_id: 2,
    //         parent_sequence: 0,
    //         name: 'Child 3',
    //         clickable: true
    //     });
    //     console.log(this.sourceList);
    // }
    // public removeFolder() {
    //
    // }
    //
    // /*
    //  * group the sourceList items by parent_id to succeed sorting the children by parent_sequence without
    //  * loosing the parent children order
    //  * @sort by name
    //  * @group by parent_id
    //  * @reset sourceList
    //  * @sort by parent_sequence
    //  */
    // public sortBySequence() {
    //     this.sourceList.sort((a, b) => a.name && b.name ? a.name > b.name ? 1 : -1 : 0);
    //     let groupedByParent = _.groupBy(this.sourceList, item => item.parent_id);
    //     this.sourceList = [];
    //     for (let parentId in groupedByParent) {
    //         if (groupedByParent.hasOwnProperty(parentId)) {
    //             groupedByParent[parentId].sort((a, b) => a.parent_sequence && b.parent_sequence ? +a.parent_sequence > +b.parent_sequence ? 1 : -1 : 0);
    //             this.sourceList = [...this.sourceList, ...groupedByParent[parentId]];
    //         }
    //     }
    // }
}


