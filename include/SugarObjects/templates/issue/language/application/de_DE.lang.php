<?php
/*********************************************************************************
 * This file is part of the twentyreasons German language pack.
 * Copyright (C) 2012 twentyreasons business solutions.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 ********************************************************************************/

$object_name = strtolower($object_name);
 $app_list_strings = array (

  $object_name.'_type_dom' =>
  array (
  	'Administration' => 'Administration',
    'Product' => 'Produkt',
    'User' => 'Benutzer',
  ),
   $object_name.'_status_dom' =>
  array (
    'New' => 'Neu',
    'Assigned' => 'Zugewiesen',
    'Closed' => 'Abgeschlossen',
    'Pending Input' => 'Rückmeldung ausstehend',
    'Rejected' => 'Abgelehnt',
    'Duplicate' => 'Duplikat',
  ),
  $object_name.'_priority_dom' =>
  array (
    'P1' => 'Hoch',
    'P2' => 'Mittel',
    'P3' => 'Niedrig',
  ),
  $object_name.'_resolution_dom' =>
  array (
  	'' => '',
  	'Accepted' => 'Akzeptiert',
    'Duplicate' => 'Duplikat',
    'Closed' => 'Geschlossen',
    'Out of Date' => 'Nicht mehr gültig',
    'Invalid' => 'Ungültig',
  ),
  );
?>