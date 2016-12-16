{*
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
*}

<ul {if $closed == true}style="display:none"{/if}>
    {foreach from=$reminders item=reminder key=reminderitem name=reminderList}

        <li id='reminder{$reminder.bean_id}'>
            <div class='favitemDetails'>
                <img class="closeIcon" src={sugar_getimagepath file="close_inline.gif"} onclick="spicetheme.removeReminderById('{$reminder.bean_id}');"></img>&nbsp;
                <span style="float:left">{$reminder.reminder_date}
            </div>  
            <div>
                <a title="{$reminder.bean}: {$reminder.summary}" href="index.php?module={$reminder.bean}&action=DetailView&record={$reminder.bean_id}">
                    <span>{$reminder.summary}</span>
                </a>
                <div class="moduleIcon">
                    <img src={sugar_getimagepath file=$reminder.bean|cat:".gif"}>
                </div>
                <div class="changeIcon">
                    <a title="{$reminder.bean}: {$reminder.summary}"href="index.php?module={$reminder.bean}&action=EditView&record={$reminder.bean_id}">
                        <img src={sugar_getimagepath file="edit_inline.gif"}>
                    </a>
                </div>
            </div>  
        </li>
    {/foreach}
</ul>