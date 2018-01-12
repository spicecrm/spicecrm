<div id="{{$vardef.name}}_canvaDiv"></div>
<input type="hidden" id="{{$vardef.name}}" name="{{$vardef.name}}" value="{$fields.{{$vardef.name}}.value}"/>
<button id="{{$vardef.name}}_canvaOpenBtn" onclick="if(typeof {{$vardef.name}}_canvaPopup == 'undefined') var {{$vardef.name}}_canvaPopup = window.open('{{$displayParams.modalTpl}}?canvaHeader={{$displayParams.header}}&canvaField={{$vardef.name}}&canvaDivWidth={{$displayParams.width}}&canvaDivHeight={{$displayParams.height}}', 'callScriptPopup', 'width = {{$displayParams.winWidth}}, height = {{$displayParams.winHeight}}'); {{$vardef.name}}_canvaPopup.focus();return false">{$APP.LBL_OPEN_SIGNATURE_POPUP}</button>
<script type="text/javascript">
        if (typeof canvaSetData == 'undefined') {
            var canvaSetData = function (elemId, data) {
                document.getElementById(elemId).value = data;
            };
        }
        if (typeof canvaSetImg == 'undefined') {
            var canvaSetImg = function (varname, data) {
                if(data != "")
                {
                    //hide button
                    document.getElementById(varname + "_canvaOpenBtn").style.display = 'none';
                    //append image tag
                    _canvaDivImg = document.createElement("img");
                    _canvaDivImg.setAttribute('src', data);
                    document.getElementById(varname + '_canvaDiv').appendChild(_canvaDivImg);
                }
            };
        }
        canvaSetImg('{{$vardef.name}}', '{$fields.{{$vardef.name}}.value}');
</script>
