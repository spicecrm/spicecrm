import {Pipe, PipeTransform} from '@angular/core';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

@Pipe({
    name: 'dictionaryFilterRelationshipTemplate'
})

export class DictionaryFilterRelationshipTemplatePipe implements PipeTransform {
    transform(relationships: any, currentDictionaryDefinition: string, dictionaryItems: DictionaryItem[]): any {
        let relatedRelationships: any[] = [];

        for(let item of dictionaryItems.filter(d =>  d.sysdictionary_ref_id && d.sysdictionarydefinition_id == currentDictionaryDefinition)){
            let relRelationships = relationships.filter(d => d.deleted == 0 && (d.lhs_sysdictionarydefinition_id == item.sysdictionary_ref_id || d.rhs_sysdictionarydefinition_id == item.sysdictionary_ref_id));
            if(relRelationships.length > 0) {
                relatedRelationships.push({
                    relatedTemplateId: item.sysdictionary_ref_id,
                    relationships: relRelationships
                });
            }
        }

        return relatedRelationships;
    }
}