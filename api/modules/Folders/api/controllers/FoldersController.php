<?php
namespace SpiceCRM\modules\Folders\api\controllers;

use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class FoldersController
{
    public function __construct()
    {
    }

    public function getFoldersForModule( Request $req, Response $res, array $args ): Response
    {
        $list = [];
        $folderBean = BeanFactory::getBean('Folders');
        if ( $dummy = $folderBean->get_full_list( null, 'module="Documents"')) {
            foreach ( $dummy as $v ) {
                $list[] = [
                    'id' => $v->id,
                    'name' => $v->name,
                    'parent_id' => $v->parent_id
                ];
            }
        };
        return $res->withJson(['list'=>$list]);
    }

}
