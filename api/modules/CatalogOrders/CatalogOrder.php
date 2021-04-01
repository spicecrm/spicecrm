<?php
namespace SpiceCRM\modules\CatalogOrders;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SpiceNumberRanges\SpiceNumberRanges;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class CatalogOrder extends SugarBean
{
    // tabellennamen bestimmen, usw.
    var $table_name = 'catalogorders';
    var $object_name = 'CatalogOrder';
    var $module_dir = 'CatalogOrders';

    var $email_sent = false;

    public function bean_implements($interface)
    {
        switch($interface)
        {
            case 'ACL':return true;
        }

        return false;
    }

    public function get_summary_text(){
        //todo: a ticket number or something???
        return $this->name;
    }

    /**
     * overwritten to populate the contact_address field...
     * @param int|string $id
     * @param bool $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return SugarBean
     */
    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $result = parent::retrieve($id, $encode, $deleted, $relationships);
        $contact = BeanFactory::getBean('Contacts', $this->contact_id);

        $this->contact_address_street = $contact->primary_address_street;
        $this->contact_address_postalcode = $contact->primary_address_postalcode;
        $this->contact_address_city = $contact->primary_address_city;

        $this->contact_salutation = $contact->salutation;
        $this->contact_first_name = $contact->first_name;
        $this->contact_last_name = $contact->last_name;
        $this->contact_degree1 = $contact->degree1;
        $this->contact_degree2 = $contact->degree2;

        return $result;
    }

    public function save($check_notify = false)
    {
        

        if(empty($this->name) || $this->new_with_id === true){
            $this->name = SpiceNumberRanges::getNextNumberForField('CatalogOrders', 'name');

            //if linked to an inquiry, close it!
            $this->closeRelatedInquiry();
        }

        return parent::save($check_notify);
    }


    private function closeRelatedInquiry()
    {
        if(!$this->inquiry_id)
            return false;

        $inquiry = BeanFactory::getBean('Inquiries', $this->inquiry_id);
        $inquiry->status = 'closed';
        return $inquiry->save();
    }

    private function populateInterests(){
        $interests = [];
        $catalogs = json_decode(html_entity_decode($this->catalogs));
        foreach($catalogs as $catalog){
            // load the product
            $product = BeanFactory::getBean('Products', $catalog->product_id);
            if($product && !empty($product->personal_interests)){
                //$pinterests = explode('^,^',$product->personal_interests);
                $pinterests = unencodeMultienum($product->personal_interests);
                foreach($pinterests as $interest){
                    //$interest = trim($interest, '^');

                    //if(!empty($interest) && array_search($interest, $interests) === false){
                    if($interest && !in_array($interest, $interests)){
                        $interests[] = $interest;
                    }
                }
            }
        }
        if(count($interests) > 0){
            $contact = BeanFactory::getBean('Contacts', $this->contact_id);
            if($contact){
                $added = false;
                if($contact->personal_interests != '')
                    //$contactInterests = explode('^,^',$contact->personal_interests);
                    $contactInterests = unencodeMultienum($contact->personal_interests);
                else
                    $contactInterests = [];

                foreach($interests as $interest){
                    //$interest = trim($interest, '^');
                    //if(!empty($interest) && array_search($interest, $contactInterests) === false){
                    if($interest && !in_array($interest, $contactInterests)){
                        $contactInterests[] = $interest;
                        $added = true;
                    }
                }
                if($added){
                    //$contact->personal_interests = '^'.implode('^,^', $contactInterests).'^';
                    $contact->personal_interests = encodeMultienumValue($contactInterests);
                    $contact->save(false);
                }
            }
        }
    }

    /**
     * @return string
     */
    public function currentDate(){
        $now = new \DateTime();
        return $now->format("d.m.Y");
    }

    public function getCatalogsAsHtmlList()
    {
        $catalogs = json_decode(html_entity_decode($this->catalogs), true);
        $html = '<ul>';
        foreach($catalogs as $cat)
        {
            $product = BeanFactory::getBean('Products');
            $product->retrieve($cat['product_id']);
            if( $product )
                $html .= '<li>'.$product->name.'&nbsp;('.$cat['quantity'].')</li>';
        }
        $html .= '</ul>';
        return $html;
    }


    public function sendAsEmail()
    {
        try{
            $email = $this->toEmail();
            $email->save();
            $result = $email->sendEmail();
            //todo: check result???
        }
        catch(Exception $e){
            LoggerManager::getLogger()->error("Error while sending CatalogOrder as Email: ".$e->getMessage());
        }
        return $result;
    }

    public function toEmail($tmpl_id = null)
    {
        

        if(!$tmpl_id)
            $tmpl_id = SpiceConfig::getInstance()->config['catalogorders']['email_templ_id'];

        // load the consumer
        $contact = $this->get_linked_beans('contact', 'Contact')[0];
        if(!$contact || !$contact->email1)
            throw new Exception("Consumer #$contact->id has no email address to use!");

        // check if we have a language specific template set
        /*
        if($contact->language && \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['catalogorders']['email_templ_id_'.$contact->language])
            $tmpl_id = \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['catalogorders']['email_templ_id_'.$contact->language];
        */
        $con_templ_id = SpiceConfig::getInstance()->config['catalogorders']['email_templ_id_'.$contact->language];
        if($con_templ_id)
            $tmpl_id = $con_templ_id;

        if(!$tmpl_id)
            throw new Exception("No Template-ID found to use!");

        $tpl = BeanFactory::getBean('EmailTemplates', $tmpl_id);
        if(!$tpl || $tpl->id != $tmpl_id)
            throw new Exception("Given Template ID: $tmpl_id could not find a Template to create an E-Mail!");

        $parsedTpl = $tpl->parse($this);
        $email = BeanFactory::getBean('Emails');
        $email->name = $parsedTpl['subject'];
        $email->body = $parsedTpl['body_html'];
        $email->addEmailAddress('to', $contact->email1);
        // add the from address
        $mailbox = BeanFactory::getBean('Mailboxes');
        $mailbox = $mailbox::getDefaultMailbox();
        $email->mailbox_id = $mailbox->id;
        $email->addEmailAddress('from', $mailbox->getEmailAddress());
        // link email to this bean?
        $email->setParent($this);
        //$email->save();
        return $email;
    }

    public function toSpiceAttachment()
    {
        
        $otempl = BeanFactory::getBean('OutputTemplates',$this->outputtemplate_id);
        if($otempl->id != $this->outputtemplate_id)
            return false;

        $otempl->bean_id = $this->id;

        $file = [
            'filename' => $this->id.'.pdf',
            'file' => base64_encode($otempl->getPdfContent()),
            'filemimetype' => 'application/pdf'
        ];

        return SpiceAttachments::saveAttachmentHashFiles($this->module_dir, $this->id, $file);
    }

    public function getSpiceAttachment()
    {
        $attachments = SpiceAttachments::getAttachmentsForBean($this->module_dir, $this->id, 1, false);
        return (object) $attachments[0];
    }
}
