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

SpiceSideBarWidgetCombo = {
		show: function(item){
			$('#'+item).addClass('combo_item_active');
			$('#'+item).removeClass('combo_item');
			$('#combo_item_title').text($('#'+item).attr('label'));
			if($('#'+item).length == 0){
				$('#combo_item_title').text(item);
			}
		},
		initialize: function(item){
			$("#combo_next").click(function(){
				var $toHighlight = $('.combo_item_active').next().length > 0 ? $('.combo_item_active').next() : $('#combo_container .combo_item').first();
			    $('.combo_item_active').fadeOut('fast',function(){
			        $('.combo_item_active').addClass('combo_item');
			        $('.combo_item_active').removeClass('combo_item_active');
			        $('#combo_item_title').text($toHighlight.attr('label'));
			        $toHighlight.fadeIn('fast',function(){
			            $toHighlight.addClass('combo_item_active');
			            $toHighlight.removeClass('combo_item');
			        });
			        SpiceSideBarWidgetCombo.save($toHighlight.attr('id'));
			    });

			});

			$("#combo_prev").click(function(){
	            var $toHighlight = $('.combo_item_active').prev().length > 0 ? $('.combo_item_active').prev() : $('#combo_container .combo_item').last();
	            $('.combo_item_active').fadeOut('fast',function(){
	            	$('.combo_item_active').addClass('combo_item');
			        $('.combo_item_active').removeClass('combo_item_active');
	            	$('#combo_item_title').text($toHighlight.attr('label'));
	            	$toHighlight.fadeIn('fast',function(){
	            		$toHighlight.addClass('combo_item_active');
	            		$toHighlight.removeClass('combo_item');
	            	});
	            	SpiceSideBarWidgetCombo.save($toHighlight.attr('id'));
	            });

			});

			this.show(item);
		},
		save: function(item){
			$.ajax({
	            url:"index.php?module=SpiceThemeController&action=ajaxController&ajaxAction=setWidgetUserConfig&param=combo_active_element&value="+item+"&to_pdf=true",
	            success:function(result){
	            }
	        });
		}
}