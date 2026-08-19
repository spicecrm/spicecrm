<?php

namespace SpiceCRM\includes\SpiceDictionary\relationships;

use Exception;
use SpiceCRM\includes\SpiceBeans\SpiceBean;

class M2MSelfRelationship extends M2MRelationship
{
    public $type = 'many-to-many-self';

    /**
     * after adding the row to the database.
     * add another row to the opposite side.
     * add the beans to the link instance.
     * call the after-add logic hook.
     * reindex the beans
     * @param array $dataToInsert
     * @param SpiceBean $lhs
     * @param SpiceBean $rhs
     * @param array $additionalFields
     * @return void
     * @throws Exception
     */
    protected function afterRowAdd(array $dataToInsert, SpiceBean $lhs, SpiceBean $rhs, array $additionalFields = []): void
    {
        if ($rhs->id != $lhs->id) {
            $dataToInsert = $this->getRowToInsert($rhs, $lhs, $additionalFields);
            $this->addRow($dataToInsert);
        }

        parent::afterRowAdd($dataToInsert, $lhs, $rhs, $additionalFields);
    }

    /**
     * after removing the row from the database.
     * remove the opposite side row too.
     * reload the rows from the link instance.
     * call the after-remove logic hook.
     * @param SpiceBean $lhs
     * @param SpiceBean $rhs
     * @return void
     */
    protected function afterRowRemove(SpiceBean $lhs, SpiceBean $rhs): void
    {
        if ($rhs->id != $lhs->id) {
            $dataToRemove = [
                $this->def['join_key_lhs'] => $rhs->id,
                $this->def['join_key_rhs'] => $lhs->id
            ];
            $this->removeRow($dataToRemove);
        }

        parent::afterRowRemove($lhs, $rhs);
    }
}