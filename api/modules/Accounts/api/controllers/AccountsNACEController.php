<?php
namespace SpiceCRM\modules\Accounts\api\controllers;

use SimpleXMLElement;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;


class AccountsNACEController{

    /**
     * get the response of an url
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */
    public function getNACECodeFiles(Request $req, SpiceResponse $res, array $args): SpiceResponse
    {
        $files = scandir('modules/Accounts/siccodefiles');

        foreach($files as $index => $file){
            if($file == '.' || $file == '..') unset($files[$index]);
        }

        // return
        return $res->withJson(array_values($files));
    }

    /**
     * get the response of an url
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */
    public function getNACECodeFile(Request $req, SpiceResponse $res, array $args): SpiceResponse
    {
        // return
        return $res->withJson(['content' => file_get_contents("modules/Accounts/siccodefiles/{$args['filename']}")]);
    }

    /**
     * get the response of an url
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */
    public function postNACECodes(Request $req, SpiceResponse $res, array $args): SpiceResponse
    {
        $body = $req->getParsedBody();

        $db = DBManagerFactory::getInstance();

        $tree = $db->fetchOne("SELECT * FROM syscategorytrees WHERE name = '{$body['treename']}'");
        if($tree){
            throw new BadRequestException('tree with the name exists already');
        }

        $treeGuid = SpiceUtils::createGuid();
        $newTree = $db->insertQuery('syscategorytrees', ['id' => $treeGuid, 'name' => $body['treename']]);

        // add the level one codes
        foreach ($body['nacecodes'] as $nacecode){
            if($nacecode['level'] == 1) {
                $this->addNACECode($treeGuid, '', $nacecode, $body['nacecodes']);
            }
        }

        // return
        return $res->withJson(['true']);
    }

    private function addNACECode($treeguid, $parent_id, $naceCode, $nacecodes){
        $db = DBManagerFactory::getInstance();
        $naceGuid = SpiceUtils::createGuid();
        $db->insertQuery('syscategorytreenodes', [
            'id' => $naceGuid,
            'node_name' => $naceCode['label'],
            'node_key' => $naceCode['nace'],
            'selectable' => 1,
            'parent_id' => $parent_id,
            'syscategorytree_id' => $treeguid,
            'valid_from' => TimeDate::getInstance()->nowDb(),
            'valid_to' => '2099-12-31 23:59:59',
            'node_status' => 'a',
            'deleted' => 0
        ]);

        // call adding subnodes
        $this->addSubNodes($treeguid, $naceGuid, $naceCode, $nacecodes);
    }

    private function addSubNodes($treeguid, $parent_id, $naceCode, $nacecodes){
        foreach($nacecodes as $nCode){
            if($nCode['nace'] != $naceCode['nace'] && $nCode['level'] == $naceCode['level'] + 1 && strpos($nCode['nace'],$naceCode['nace']) === 0){
                $this->addNACECode($treeguid, $parent_id, $nCode, $nacecodes);
            }
        }
    }
}