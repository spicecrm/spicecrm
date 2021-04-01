'use strict';

// var Transform = require('readable-stream/transform');
var Transform = require('stream').Transform;

module.exports = function(options, module, modules) {
    return new Transform({
        objectMode: true,
        transform: function(file, enc, callback) {
            if (file.isNull()) {
                return callback(null, file);
            }

            function doReplace() {

                var content = String(file.contents);
                //var module_subdirectories = ['components','directives'];
                var exportregex = /export\s+[\w]+\s+([\w]+)\s*/g;
                var match;
                // find all export declarations (aka embedded components) to ignore import statements which are importing these components...
                var exports = [];
                while((match = exportregex.exec(content)) !== null) {
                    exports.push(match[1]);
                }
                //console.log(exports);

                var importregex = /import\s+{?\s*([\w,\s\*]+?)\s*}?(as\s+[\w])?\s+from\s+["']([\w\/\.\@\-]+)["']\s*;/g;
                var import_replaces = {};
                while((match = importregex.exec(content)) !== null){
                    //console.log(match[0], match[1], match[3]);
                    // step 1: normalize path...
                    var path = match[3];

                    if(path == 'ts-md5') debugger;

                    var normalized_path = path.replace(/\.+\//g, '');
                    //console.log(normalized_path);
                    // step 2: replace module subdirecotries with the module path instead...
                    for(var _module of modules)
                    {
                        if(normalized_path.includes(_module.directory+'/'))
                        {
                            normalized_path = `${_module.directory}/${_module.file_name}`;
                        }
                    }
                    /*
                    for(var key of module_subdirectories){
                        var regex = new RegExp(`\/?(\\w+)\/(${key}\/.+)`, 'g');
                        var key_match = regex.exec(normalized_path);

                        if(key_match)
                        {
                            console.log('key match found!!!');
                            normalized_path = normalized_path.replace(key_match[2], key_match[1]);
                            console.log(normalized_path);
                            break;
                        }
                    }
                    */
                    // step 3: refactor services...
                    if(normalized_path.includes('services/'))
                    {
                        normalized_path = 'services/services';
                        //console.log(normalized_path);
                    }
                    //console.log(path, normalized_path);
                    var classes = match[1];
                    classes = classes.split(/\s*,\s*/g);
                    //console.log(match[1], classes);

                    for(var cl of classes) {
                        if(!cl)
                            break;
                        // check if class is already embedded...
                        if(exports.includes(cl))
                        {
                            //console.log(cl, 'not needed to import...');
                            break;
                        }
                        if(!import_replaces[normalized_path])
                            import_replaces[normalized_path] = {
                                classes: [cl],
                                path: normalized_path
                            }
                        else{
                            if(!import_replaces[normalized_path].classes.includes(cl))
                                import_replaces[normalized_path].classes.push(cl);
                        }
                    }
                    //console.log(import_replaces[normalized_path]);
                }

                // remove all import statements ... use another regex to find also statements with /**/ quotes
                content = content.replace(/import\s+[a-zA-Z0-9-\s{}\'",.\/\n\r@_\*]+;/g, '');

                var import_content = '';
                for(var prop in import_replaces)
                {
                    // check so we do not import from the same module
                    if(prop == module.directory+'/'+module.file_name) continue;

                    var replace = import_replaces[prop];
                    path = replace.path;
                    if(module.relative_path && !path.includes('@') && !path.includes('rxjs') && !path.includes('ts-md5'))
                        path = module.relative_path+path;
                    //console.log(path);
                    import_content += `import {${replace.classes}} from '${path}';\n`
                }

                // add the @module header
                let header = "/**\n* @module "+module.module+"\n*/\n"


                file.contents = new Buffer.from(header+import_content+content);

                console.log('built module ' + module.module);

                callback(null, file);
            }

            doReplace();
        }
    });
};
