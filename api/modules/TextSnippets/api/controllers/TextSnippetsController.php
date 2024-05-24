<?php

namespace SpiceCRM\modules\TextSnippets\api\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\TextSnippets\TextSnippet;

class TextSnippetsController
{
    /**
     * live compile text snippet
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function liveCompile(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        /** @var TextSnippet $textSnippet */
        $textSnippet = BeanFactory::getBean('TextSnippets', $args['id'] );
        if ( !$textSnippet )
            throw ( new NotFoundException('TextSnippet not found.'))
                ->setLookedFor([ 'id' => $args['parentId'], 'module' => 'TextSnippets' ]);

        if ( !empty($params['modelData'] ))
        {
            $bean = BeanFactory::getBean($params['module']);
            foreach ( $params['modelData'] as $field => $value ) $bean->$field = $value;

            $this->liveCompileHandleLinkedBeans($bean);

            BeanFactory::registerBean( $params['module'], $bean, $bean->id );
        }

        return $res->withJson([ 'html' => $textSnippet->parse($bean), 'params'=>$params ]);
    }

    public function liveCompilePlainText(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        /** @var TextSnippet $textSnippet */
        $textSnippet = BeanFactory::getBean('TextSnippets', $args['id'] );
        if ( !$textSnippet )
            throw ( new NotFoundException('TextSnippet not found.'))
                ->setLookedFor([ 'id' => $args['parentId'], 'module' => 'TextSnippets' ]);

        if ( !empty($params['modelData'] ))
        {
            $bean = BeanFactory::getBean($params['module']);
            foreach ( $params['modelData'] as $field => $value ) $bean->$field = $value;

            $this->liveCompileHandleLinkedBeans($bean);

            BeanFactory::registerBean( $params['module'], $bean, $bean->id );
        }

        return $res->withJson(['html' => $textSnippet->parsePlainText($bean)]);
    }

    /**
     * load related beans
     * only one-to-many for now
     * @param $bean
     * @return void
     */
    public function liveCompileHandleLinkedBeans($bean){
        $links = $bean->get_linked_fields();
        foreach ( $links as $link ) {
            if($bean->load_relationship( $link['name'] )){
                if ( $bean->{$link['name']}->relationship->type === 'one-to-many' ) {
                    $linkedBeanModule = $bean->{$link['name']}->relationship->def['lhs_module'];
                    $linkedBeanId = $bean->{$link['name']}->relationship->def['rhs_key'];
                    if($bean->{$linkedBeanId} && $linkedBeanModule){
                        $bean->{$link['name']}->addBean( BeanFactory::getBean( $linkedBeanModule,  $bean->{$linkedBeanId}, ['relationships' => false] ));
                    }
                }
            }
        }
    }


}