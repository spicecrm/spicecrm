/**
 * global variables
 * basic settings for gulp tasks
 * this file will be included in backend gulp jobs
 * keep it here
 */

// ----------- build information ------------- //
global.build = {
    releaseNumber: '2021.01.001',
    buildNumber: ''
};


// ----------- exclude files ------------- //
global.releasePathsFE = {};
global.releasePathsFE.excludeAppCoreFE = [
    '!./app/portalcomponents/**',
    '!./app/modules/aclterritories/**',
    '!./app/modules/alcatel/**',
    '!./app/modules/asterisk/**',
    '!./app/modules/catalogs/**',
    '!./app/modules/deployment/**',
    '!./app/modules/potentials/**/*',
    '!./app/modules/priceconditions/**',
    '!./app/modules/products/**',
    '!./app/modules/projects/**',
    '!./app/modules/questionnaires/**',
    '!./app/modules/reportsdesignermore/**/*',
    '!./app/modules/reportsmore/**/*',
    '!./app/modules/salesdocs/**',
    '!./app/modules/salesplanning/**',
    '!./app/modules/sap/**',
    '!./app/modules/sapidocs/**',
    '!./app/modules/servicecomponents/**',
    '!./app/modules/starface/**',
    '!./app/modules/telephony/**',
    '!./app/modules/telesales/**',
    '!./app/modules/workflow/**',
    '!./app/modules/knowledge/**',
    '!./app/include/cleverreach/**',
    '!./app/include/dialogmail/**',
    '!./app/include/evalanche/**',
    '!./app/include/gsuite/**',
    '!./app/include/gsuitesettings/**',
    '!./app/include/mailchimp/**',
    '!./app/include/outlook/**',
    '!./app/include/pipl/**',
    '!./app/include/quilleditor/**',
//    '!./app/include/groupware/**',
    '!./app/include/spicebcardreader/**/*'
];
global.releasePathsFE.excludeSrcCoreFE = [
    '!./src/portalcomponents/**/*',
    '!./src/workbench/**/*',
    '!./src/modules/aclterritories/**/*',
    '!./src/modules/alcatel/**/*',
    '!./src/modules/asterisk/**/*',
    '!./src/modules/catalogs/**/*',
    '!./src/modules/deployment/**/*',
    '!./src/modules/potentials/**/*',
    '!./src/modules/priceconditions/**/*',
    '!./src/modules/products/**/*',
    '!./src/modules/projects/**/*',
    '!./src/modules/questionnaires/**/*',
    '!./src/modules/reportsdesignermore/**/*',
    '!./src/modules/reportsmore/**/*',
    '!./src/modules/reportsdesignermore/**/*',
    '!./src/modules/salesdocs/**/*',
    '!./src/modules/salesplanning/**',
    '!./src/modules/sap/**',
    '!./src/modules/sapidocs/**',
    '!./src/modules/servicecomponents/**/*',
    '!./src/modules/starface/**/*',
    '!./src/modules/telephony/**/*',
    '!./src/modules/telesales/**/*',
    '!./src/modules/workflow/**/*',
    '!./src/modules/knowledge/**/*',
    '!./src/include/cleverreach/**/*',
    '!./src/include/dialogmail/**/*',
    '!./src/include/evalanche/**/*',
    '!./src/include/gsuite/**/*',
    '!./src/include/gsuitesettings/**/*',
    '!./src/include/mailchimp/**/*',
    '!./src/include/pipl/**/*',
//    '!./src/include/groupware/**/*',
    '!./src/include/outlook/**/*',
    '!./src/include/spicebcardreader/**/*'
];
