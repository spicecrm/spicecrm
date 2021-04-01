<?php
namespace SpiceCRM\modules\CatalogOrders\loader;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class CatalogsLoader
{

    public function loadCatalogs()
    {

        

        if(!SpiceConfig::getInstance()->config['catalogorders']['productgroup_id']) return [];

        $group = BeanFactory::getBean('ProductGroups', SpiceConfig::getInstance()->config['catalogorders']['productgroup_id']);

        $products = [];
        $group->load_relationship('products');
        // performance increase doing a quick direct related
        // $relatedProducts = $group->get_linked_beans('products', 'Products', [], 0, 100);
        $catalog = BeanFactory::getBean('Products');
        $catalogList = $catalog->get_full_list('name', "products.productgroup_id ='{$group->id}'");
        foreach ($catalogList as $relatedProduct) {
            $products[] = [
                'id' => $relatedProduct->id,
                'name' => html_entity_decode($relatedProduct->name, ENT_QUOTES),
                'product_status' => $relatedProduct->product_status,
                'external_id' => $relatedProduct->external_id
            ];
        }
        return $products;
    }
}
