
{* the group items *}

<div id="currentModule">{$MODULE_TAB}</div>
{foreach from=$groupTabs item=entries key=group}
	    {if $group == $currentGroupTab}
	        {assign var=modules value='modules'}
	   		{foreach from=$entries.$modules item=itemtext key=thismodule}
	   		{if $thismodule != 'Home'}
                            {if $thismodule == $MODULE_TAB}
                                    <li class="newsubmenuitem" id="{$thismodule}tab"><span class="currentTab">{sugar_link id="moduleTab_$thismodule" module=$thismodule data=$thismodule}</span></li>
                            {else}
                                    <li class="newsubmenuitem" id="{$thismodule}tab"><span class="notCurrentTab">{sugar_link id="moduleTab_$thismodule" module=$thismodule data=$thismodule}</span></li>
                            {/if}
	   		{/if}
	   		{/foreach}
	   		{assign var=extramodules value='extra'}
	   		{if count($entries.$extramodules) > 0}
	   		 <li id="MoreModules"><a href="#" onclick="spicetheme.toggleMoreModules();">{$APP.LBL_LINK_MORE}<span class="moreModuleItemsArrow"></span></a>
		    	<div id="moreModuleItems">
			    	<ol class="moreModulesUl">
				    	{assign var="itemCounter" value=0}
                        {foreach from=$entries.$extramodules item=itemtext key=thismodule}
							{if ($itemCounter == 15 || $itemCounter == 30 || $itemCounter == 45) && $itemCounter != 0}</ol><ol>{/if}
							<li>{sugar_link id="moduleTab_$itemtext" module=$thismodule data=$thismodule}</li>
							{assign var="itemCounter" value=$itemCounter+1}
                        {/foreach}

			        </ol>  
		        </div>
		    </li>
	   		{/if}
	    {/if}
{/foreach}
