<?php

/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 * 
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 * 
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

class KRESTSpiceCRMMobileHandler {

    var $genericSettings = '{
            "syncInterval" : 15, 
            "mapsProvider" : "googlemap"
        }';
    var $metadataObjects = '{
	"kreports" : {
		"objectdata" : {
			"objectname" : "Reports",
			"objectlabel" : "LBL_KREPORTS",
			"objecticlass" : "Currency-Exchange",
			"displayObject" : false,
			"enableAdd" : false,
			"enableOffline" : false
		},
		"backenddata" : {
			"module" : "KReports"
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"name" : {
				"type" : "char",
				"len" : 20,
				"search" : true
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}
							]
						}
					]
				}
			}
		},
		"viewallocation" : {
			"picker" : "default"
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
        "leads" : {
		"objectdata" : {
			"objectname" : "Leads",
			"objectlabel" : "LBL_LEADS",
			"objecticlass" : "Center-Direction",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : true,
			"enableOfflineEdit" : true,
			"offlinelimit" : 500
		},
		"backenddata" : {
			"module" : "Leads"
		},
                "objectHooks" : {
                    "getDisplayName": "(_object.first_name ? _object.first_name + \' \' : \'\') + (_object.last_name ? _object.last_name : \'\')",
                    "onCreate": "if (!_object.status) _object.status = \'New\'; if (!_object.lead_source) _object.lead_source = \'Self Generated\';"
                },
                "integration" : {
			"vcard" : {
                            "fields" :{
                                "title": "TITLE",
                                "website" : "URL",
                                "account_name" : "ORG"
                            },
                            "name" : {
                                "first_name" : "firstName", 
                                "last_name" : "lastName", 
                                "title" : "title"
                            }, 
                            "addresses" : {
                                "primary" : "WORK, OTHER"
                            }, 
                            "communication": {
                                "home" : "HOME", 
                                "mobile" : "CELL", 
                                "work": "WORK"
                            }, 
                            "emailaddresses" : true
			}
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
                        "account_name" : {
				"vname" : "LBL_ACCOUNT_NAME",
				"type" : "char",
				"len" : 50,
				"search" : true, 
                                "sortable" : true
			},
			"salutation" : {
				"vname" : "LBL_SALUTATION",
				"type" : "enum",
				"domain" : "salutation_dom",
				"len" : 3,
				"required" : true
			},
			"first_name" : {
				"vname" : "LBL_FIRST_NAME",
				"type" : "char",
				"len" : 50,
				"search" : true,
				"required" : true, 
                                "sortable" : true
			},
			"last_name" : {
				"vname" : "LBL_LAST_NAME",
				"type" : "char",
				"len" : 50,
				"search" : true,
				"required" : true, 
                                "sortable" : true
			},
			"title" : {
				"vname" : "LBL_TITLE",
				"type" : "char",
				"len" : 50
			},
                        "website" : {
				"vname" : "LBL_WEBSITE",
				"type" : "char",
				"len" : 50
			},
                        "department": {
                            "vname": "LBL_DEPARTMENT",
                            "type": "char",
                            "len": 50, 
                                "sortable" : true
                        },
                        "lead_source": {
                            "vname": "LBL_LEAD_SOURCE",
                            "required" : true,
                            "type": "enum",
                            "domain": "lead_source_dom",
                            "len": 50
                        },
                        "status": {
                            "vname": "LBL_STATUS",
                            "required" : true,
                            "type": "enum",
                            "domain": "lead_status_dom",
                            "len": 20
                        },
			"assigned_user_id" : {
				"vname" : "LBL_ASSIGNED_TO_NAME",
				"type" : "user",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"communication" : {
			"home" : {
				"field" : "phone_home",
				"communication_type" : "home",
				"vcard_type" : "HOME",
				"icon" : "SpiceCRM-Phone"
			},
			"mobile" : {
				"field" : "phone_mobile",
				"required" : false,
				"communication_type" : "mobile",
				"vcard_type" : "CELL",
				"icon" : "SpiceCRM-Android"
			},
			"work" : {
				"field" : "phone_work",
				"required" : true,
				"communication_type" : "work",
				"vcard_type" : "WORK",
				"icon" : "SpiceCRM-Office-Phone"
			},
			"fax" : {
				"field" : "phone_fax",
				"communication_type" : "fax",
				"icon" : "SpiceCRM-Fax"
			},
			"other" : {
				"field" : "phone_other",
				"communication_type" : "other",
				"icon" : "SpiceCRM-Phone"
			}
		},
		"addresses" : {
			"primary" : {
				"vname" : "LBL_PRIMARY",
				"prefix" : "primary_address",
				"vcard_type" : "WORK,OTHER",
				"required" : false
			},
			"alt" : {
				"vname" : "LBL_ALTADDR",
				"prefix" : "alt_address"
			}
		},
		"links" : {
			"meetings" : {
				"name" : "meetings",
				"relationship" : "leads_meetings",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"calls" : {
				"name" : "calls",
				"relationship" : "leads_calls",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"tasks" : {
				"name" : "tasks",
				"relationship" : "leads_tasks",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"notes" : {
				"name" : "notes",
				"relationship" : "leads_notes",
				"subpanel" : true,
				"listdefs" : "default"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "last_name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "first_name"
								}, {
									"name" : "last_name"
								}, {
									"name" : "salutation"
								}
							]
						}, {
							"style" : "main",
							"elements" : [{
									"name" : "account_name"
								}
							]
						}, {
							"elements" : [{
									"name" : "status"
								} , {
                                                                        "name" : "lead_source"
                                                                }
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "email",
									"type" : "email",
									"params" : {
										"filter" : ["primary"]
									}
								}
							]
						}, {
							"elements" : [{
									"name" : "communication",
									"type" : "communication",
									"params" : {
										"communication" : ["mobile", "phone", "work"]
									}
								}
							]
						}
					]
				},
				"picker" : {
					"sort" : {
						"sortfield" : "last_name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "salutation"
								}, {
									"name" : "first_name"
								}, {
									"name" : "last_name"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "status"
								} , {
                                                                        "name" : "lead_source"
                                                                }
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "status"
					}, {
						"name" : "lead_source"
					}, {
						"name" : "salutation"
					}, {
						"name" : "account_name"
					}, {
						"name" : "first_name"
					}, {
						"name" : "last_name"
					}, {
						"name" : "title"
					}, {
                                                "name" : "website"
                                        }, {
						"name" : "communication",
						"type" : "communication"
					}, {
						"name" : "email",
						"type" : "email",
						"params" : {
							"required" : true
						}
					}, {
						"name" : "address",
						"type" : "address"
					}, {
						"name" : "assigned_user_id"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "picker",
			"history" : "picker",
			"edit" : "default"
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"contacts" : {
		"objectdata" : {
			"objectname" : "Contacts",
			"objectlabel" : "LBL_CONTACTS",
			"objecticlass" : "Contacts-Filled",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : true,
			"enableOfflineEdit" : true,
			"offlinelimit" : 3000
		},
		"backenddata" : {
			"module" : "Contacts"
		},
		"objectHooks" : {
                    "getDisplayName": "(_object.first_name ? _object.first_name + \' \' : \'\') + (_object.last_name ? _object.last_name : \'\')"
                },
                "integration" : {
			"vcard" : {
                            "fields" :{
                                "title": "TITLE"
                            },
                            "name" : {
                                "first_name" : "firstName", 
                                "last_name" : "lastName", 
                                "title" : "title"
                            }, 
                            "addresses" : {
                                "primary" : "WORK, OTHER"
                            }, 
                            "communication": {
                                "home" : "HOME", 
                                "mobile" : "CELL", 
                                "work": "WORK"
                            }, 
                            "emailaddresses" : true
			}, 
                        "devicecontacts" : {
                            "fields" :{
                                "title": "TITLE"
                            },
                            "name" : {
                                "first_name" : "givenName", 
                                "last_name" : "familyName"
                            }, 
                            "addresses" : {
                                "primary" : "work", 
                                "alt" : "home"
                            }, 
                            "communication": {
                                "home" : "home", 
                                "mobile" : "mobile", 
                                "work": "work"
                            }, 
                            "emailaddresses" : true
                        }
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"salutation" : {
				"vname" : "LBL_SALUTATION",
				"type" : "enum",
				"domain" : "salutation_dom",
				"len" : 3,
				"required" : true
			},
			"first_name" : {
				"vname" : "LBL_FIRST_NAME",
				"type" : "char",
				"len" : 50,
				"search" : true,
				"required" : true, 
                                "sortable" : true
			},
			"last_name" : {
				"vname" : "LBL_LAST_NAME",
				"type" : "char",
				"len" : 50,
				"search" : true,
				"required" : true, 
                                "sortable" : true
			},
			"title" : {
				"vname" : "LBL_TITLE",
				"type" : "char",
				"len" : 50
			},
			"account_id" : {
				"type" : "char",
				"len" : 36
			},
			"account_name" : {
				"vname" : "LBL_ACCOUNT_NAME",
				"type" : "relate",
				"id_name" : "account_id",
				"link" : "accounts",
				"display" : "name",
				"source" : "non-db",
				"required" : true
			},
			"assigned_user_id" : {
				"vname" : "LBL_USER",
				"type" : "user",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"communication" : {
			"home" : {
				"field" : "phone_home",
				"communication_type" : "home",
				"vcard_type" : "HOME",
				"icon" : "SpiceCRM-Phone"
			},
			"mobile" : {
				"field" : "phone_mobile",
				"required" : true,
				"communication_type" : "mobile",
				"vcard_type" : "CELL",
				"icon" : "SpiceCRM-Android"
			},
			"work" : {
				"field" : "phone_work",
				"required" : true,
				"communication_type" : "work",
				"vcard_type" : "WORK",
				"icon" : "SpiceCRM-Phone-Office"
			},
			"fax" : {
				"field" : "phone_fax",
				"communication_type" : "fax",
				"icon" : "SpiceCRM-Fax"
			},
			"skype" : {
				"field" : "phone_other",
				"communication_type" : "skype",
				"icon" : "SpiceCRM-Skype"
			}
		},
		"addresses" : {
			"primary" : {
				"vname" : "LBL_PRIMARY",
				"prefix" : "primary_address",
				"vcard_type" : "WORK,OTHER",
				"required" : true
			},
			"alt" : {
				"vname" : "LBL_ALTADDR",
				"prefix" : "alt_address"
			}
		},
		"links" : {
			"accounts" : {
				"name" : "accounts",
				"relationship" : "accounts_contacts",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"meetings" : {
				"name" : "meetings",
				"relationship" : "contact_meetings",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"calls" : {
				"name" : "calls",
				"relationship" : "contact_calls",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"tasks" : {
				"name" : "tasks",
				"relationship" : "contact_tasks",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"notes" : {
				"name" : "notes",
				"relationship" : "contact_notes",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"opportunities" : {
				"name" : "opportunities",
				"relationship" : "opportunities_contacts",
				"subpanel" : true,
				"listdefs" : "default"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "last_name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "salutation"
								}, {
									"name" : "first_name"
								}, {
									"name" : "last_name"
								}
							]
						}, {
							"elements" : [{
									"name" : "account_name"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "email",
									"type" : "email",
									"params" : {
										"filter" : ["primary"]
									}
								}
							]
						}, {
							"elements" : [{
									"name" : "communication",
									"type" : "communication",
									"params" : {
										"communication" : ["mobile", "phone", "work"]
									}
								}
							]
						}
					]
				},
				"picker" : {
					"sort" : {
						"sortfield" : "last_name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "salutation"
								}, {
									"name" : "first_name"
								}, {
									"name" : "last_name"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "account_name"
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "salutation"
					}, {
						"name" : "first_name"
					}, {
						"name" : "last_name"
					}, {
						"name" : "title"
					}, {
						"name" : "account_name"
					}, {
						"name" : "communication",
						"type" : "communication"
					}, {
						"name" : "email",
						"type" : "email",
						"params" : {
							"required" : true
						}
					}, {
						"name" : "address",
						"type" : "address"
					}, {
						"name" : "assigned_user_id"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "picker",
			"history" : "picker",
			"edit" : "default"
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"accounts" : {
		"objectdata" : {
			"objectname" : "Accounts",
			"objectlabel" : "LBL_ACCOUNTS",
			"objecticlass" : "Organization-Filled",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : false,
			"enableOfflineEdit" : false,
			"offlinelimit" : 2500
		},
		"backenddata" : {
			"module" : "Accounts"
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"name" : {
				"vname" : "LBL_NAME",
				"type" : "char",
				"len" : 50,
				"search" : true
			},
			"account_type" : {
				"vname" : "LBL_ACCOUNT_TYPE",
				"type" : "enum",
                                "required" : true,
				"domain" : "account_type_dom",
				"len" : 3
			},
			"assigned_user_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"communication" : {
			"office" : {
				"field" : "phone_office",
				"communication_type" : "office",
				"icon" : "SpiceCRM-Phone-Office",
				"required" : true
			},
			"fax" : {
				"field" : "phone_fax",
				"communication_type" : "fax",
				"icon" : "SpiceCRM-Fax"
			},
			"alternate" : {
				"field" : "phone_alternate",
				"communication_type" : "other",
				"icon" : "SpiceCRM-Phone"
			}
		},
		"addresses" : {
			"billing" : {
				"vname" : "LBL_BILLING",
				"prefix" : "billing_address",
				"required" : true
			},
			"shipping" : {
				"vname" : "LBL_SHIPPING",
				"prefix" : "shipping_address"
			}
		},
		"links" : {
			"contacts" : {
				"name" : "contacts",
				"relationship" : "accounts_contacts",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"opportunities" : {
				"name" : "opportunities",
				"relationship" : "accounts_opportunities",
				"subpanel" : true,
				"listdefs" : "foraccounts"
			},
			"cases" : {
				"name" : "cases",
				"relationship" : "account_cases",
				"subpanel" : true,
				"listdefs" : "foraccounts"
			},
			"meetings" : {
				"name" : "meetings",
				"relationship" : "account_meetings",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"calls" : {
				"name" : "calls",
				"relationship" : "account_calls",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"tasks" : {
				"name" : "tasks",
				"relationship" : "account_tasks",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"notes" : {
				"name" : "notes",
				"relationship" : "account_notes",
				"subpanel" : true,
				"listdefs" : "default"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"style" : "sub",
							"elements" : [{
									"name" : "account_type"
								}
							]
						}, {
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}
							]
						}, {
							"elements" : [{
									"name" : "communication",
									"type" : "communication",
									"params" : {
										"communication" : ["office", "fax"]
									}
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "account_type"
					}, {
						"name" : "name"
					}, {
						"name" : "communication",
						"type" : "communication"
					}, {
						"name" : "address",
						"type" : "address"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "default",
			"history" : "default",
			"edit" : "default"
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"opportunities" : {
		"objectdata" : {
			"objectname" : "Opportunities",
			"objectlabel" : "LBL_OPPORTUNITIES",
			"objecticlass" : "Money-Bag",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : true,
			"enableOfflineEdit" : true,
			"offlinelimit" : 300
		},
		"backenddata" : {
			"module" : "Opportunities"
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"account_id" : {
				"type" : "char",
				"source" : "non-db",
				"len" : 36
			},
			"account_name" : {
				"vname" : "LBL_ACCOUNT_NAME",
				"type" : "relate",
				"id_name" : "account_id",
				"link" : "accounts",
				"display" : "name",
				"source" : "non-db",
				"required" : true
			},
			"name" : {
				"vname" : "LBL_NAME",
				"type" : "char",
				"len" : 50,
				"required" : true
			},
			"sales_stage" : {
				"vname" : "LBL_SALES_STAGE",
				"type" : "enum",
				"domain" : "sales_stage_dom",
				"len" : 20,
				"required" : true
			},
			"date_closed" : {
				"vname" : "LBL_DATE_CLOSED",
				"type" : "date",
				"required" : true
			},
			"amount" : {
				"vname" : "LBL_AMOUNT",
				"type" : "currency",
				"required" : true, 
                                "currency_id" : "currency_id"
			},
                        "currency_id" : {
				"vname" : "LBL_AMOUNT",
				"type" : "char",
                                "len" : 36
			},
			"assigned_user_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"links" : {
			"accounts" : {
				"name" : "accounts",
				"relationship" : "accounts_opportunities",
				"subpanel" : false
			},
			"contacts" : {
				"name" : "contacts",
				"relationship" : "opportunities_contacts",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"meetings" : {
				"name" : "meetings",
				"relationship" : "opportunities_meetings",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"calls" : {
				"name" : "calls",
				"relationship" : "opportunities_calls",
				"subpanel" : true,
				"listdefs" : "default"
			},
			"notes" : {
				"name" : "notes",
				"relationship" : "opportunities_notes",
				"subpanel" : true,
				"listdefs" : "default"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "account_name"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "amount"
								}
							]
						}, {
							"elements" : [{
									"name" : "sales_stage"
								}, {
									"name" : "date_closed"
								}
							]
						}
					]
				},
				"foraccounts" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "amount"
								}
							]
						}, {
							"elements" : [{
									"name" : "sales_stage"
								}, {
									"name" : "date_closed"
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "name"
					}, {
						"name" : "account_name"
					}, {
						"name" : "amount"
					}, {
						"name" : "sales_stage"
					}, {
						"name" : "date_closed"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "default",
			"history" : "default",
			"edit" : "default"
		},
		"dashlets" : {
			"openopportunities" : {
				"vname" : "LBL_OPEN_OPPORTUNITIES",
				"filter" : {
					"conditions" : {
						"field" : "sales_stage",
						"operator" : "not like",
						"value" : "Closed%"
					}
				},
				"sort" : {
					"sortfield" : "name",
					"sortdirection" : "ASC"
				},
				"view" : "default"
			}
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"meetings" : {
		"objectdata" : {
			"objectname" : "Meetings",
			"objectlabel" : "LBL_MEETINGS",
			"objecticlass" : "Calendar",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : true,
			"enableOfflineEdit" : true,
			"offlinelimit" : 500
		},
		"backenddata" : {
			"module" : "Meetings"
		},
		"integration" : {
			"calendar" : {
				"type" : "calevent",
				"start" : "date_start",
				"end" : "date_end",
				"infocolor" : "#fff",
                                "color" : "#009688",
				"enableadd" : true
			}
		},
		"objectHooks" : {
                        "onCreate": "if (!_object.date_start) {_object.date_start = new Date(); _object.date_start.setMinutes(Math.round(_object.date_start.getMinutes() / 5) * 5);_object.date_start.setSeconds(0); _object.date_end = new Date(_object.date_start); _object.date_end.setHours(_object.date_start.getHours() + 1);}if (!_object.status)_object.status = \'Planned\';",
                        "beforeSave" : "var _start = moment(_object.date_start), _end = moment(_object.date_end); var _diff = moment.duration(_end.diff(_start)); _object.duration_hours = Math.round(_diff.asHours()); _object.duration_minutes = _diff.minutes();", 
                        "onChange": "if (!angular.equals(_objectOld.date_start,_objectNew.date_start)) {var _old = moment(_objectOld.date_start);var _new = moment(_objectNew.date_start);var _oldEnd = moment(_objectOld.date_end);_oldEnd.add(_new.diff(_old), \'ms\');_objectNew.date_end = _oldEnd.toDate(); }"
                },
                "links" : {
			"notes" : {
				"name" : "notes",
				"relationship" : "meetings_notes",
				"subpanel" : true,
				"listdefs" : "default"
			},
                        "contacts" : {
				"name" : "contacts",
				"relationship" : "meetings_contacts",
				"subpanel" : true,
				"listdefs" : "default"
			}
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"name" : {
				"vname" : "LBL_SUBJECT",
				"type" : "char",
				"len" : 50
			},
			"parent_id" : {
				"type" : "char",
				"len" : 36
			},
			"parent_type" : {
				"type" : "parent_type",
				"len" : 50,
				"parent_objects" : ["accounts", "contacts", "opportunities", "leads"]
			},
			"parent_name" : {
				"vname" : "LBL_LIST_RELATED_TO",
				"type" : "parent",
				"id_name" : "parent_id",
				"type_name" : "parent_type",
				"source" : "non-db"
			},
			"description" : {
				"vname" : "LBL_DESCRIPTION",
				"type" : "text"
			},
			"locations" : {
				"vname" : "LBL_LOCATION",
				"type" : "char",
				"len" : 50
			},
			"date_start" : {
				"vname" : "LBL_START_DATE",
				"type" : "datetime"
			},
			"date_end" : {
				"vname" : "LBL_DATE_END",
				"type" : "datetime"
			},
			"duration_hours" : {
				"type" : "int"
			},
			"duration_minutes" : {
				"type" : "int"
			},
			"status" : {
				"vname" : "LBL_STATUS",
				"type" : "enum",
				"domain" : "meeting_status_dom",
				"len" : 7
			},
			"type" : {
				"vname" : "LBL_TYPE",
				"type" : "enum",
				"domain" : "eapm_list",
				"len" : 15
			},
			"assigned_user_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "date_start",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"style" : "sub",
							"elements" : [{
									"name" : "status"
								}, {
									"name" : "type"
								}
							]
						}, {
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "parent_name"
								}
							]
						}, {
							"elements" : [{
									"name" : "date_start"
								}, {
									"name" : "date_end"
								}
							]
						}
					]
				},
				"picker" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "status"
								}, {
									"name" : "date_start"
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "type"
					}, {
						"name" : "status"
					}, {
						"name" : "name"
					}, {
						"name" : "parent_name"
					}, {
						"name" : "date_start"
					}, {
						"name" : "date_end"
					}, {
						"name" : "description"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "picker",
			"history" : "picker",
			"edit" : "default"
		},
		"dashlets" : {
			"openmeetings" : {
				"vname" : "LBL_OPEN_MEETINGS",
				"collapsed" : false,
				"filter" : {
					"conditions" : {
						"field" : "status",
						"operator" : "=",
						"value" : "Planned"
					}
				},
				"sort" : {
					"sortfield" : "name",
					"sortdirection" : "ASC"
				},
				"view" : "default"
			},
			"ovdmeetings" : {
				"vname" : "LBL_OVD_MEETINGS",
				"collapsed" : false,
				"filter" : {
					"conditions" : {
						"join" : "AND",
						"conditions" : [{
								"field" : "status",
								"operator" : "=",
								"value" : "Planned"
							}, {
								"field" : "date_start",
								"operator" : "<",
								"value" : "2015-08-13T07:05:15.736Z"
							}
						]
					},
					"myitems" : true,
					"favorites" : true
				},
				"sort" : {
					"sortfield" : "name",
					"sortdirection" : "ASC"
				},
				"view" : "default"
			}
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"calls" : {
		"objectdata" : {
			"objectname" : "Calls",
			"objectlabel" : "LBL_CALLS",
			"objecticlass" : "Phone",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : true,
			"enableOfflineEdit" : true,
			"offlinelimit" : 500
		},
		"backenddata" : {
			"module" : "Calls"
		},
		"integration" : {
			"calendar" : {
				"type" : "calevent",
				"start" : "date_start",
				"end" : "date_end",
				"infocolor" : "#fff",
                                "color" : "#03A9F4",
				"enableadd" : true
			}
		},
		"objectHooks" : {
                        "onCreate": "if (!_object.date_start) {_object.date_start = new Date(); _object.date_start.setMinutes(Math.round(_object.date_start.getMinutes() / 5) * 5);_object.date_start.setSeconds(0); _object.date_end = new Date(_object.date_start); _object.date_end.setMinutes(_object.date_start.getMinutes() + 30);}if (!_object.status)_object.status = \'Planned\';",
                        "beforeSave" : "var _start = moment(_object.date_start), _end = moment(_object.date_end); var _diff = moment.duration(_end.diff(_start)); _object.duration_hours = Math.round(_diff.asHours()); _object.duration_minutes = _diff.minutes();", 
                        "onChange": "if (!angular.equals(_objectOld.date_start,_objectNew.date_start)) {var _old = moment(_objectOld.date_start);var _new = moment(_objectNew.date_start);var _oldEnd = moment(_objectOld.date_end);_oldEnd.add(_new.diff(_old), \'ms\');_objectNew.date_end = _oldEnd.toDate(); }"                
                },
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"name" : {
				"vname" : "LBL_SUBJECT",
				"type" : "char",
				"len" : 50
			},
			"parent_id" : {
				"type" : "char",
				"len" : 36
			},
			"parent_type" : {
				"type" : "parent_type",
				"len" : 50,
				"parent_objects" : ["accounts", "contacts", "opportunities", "leads"]
			},
			"parent_name" : {
				"vname" : "LBL_LIST_RELATED_TO",
				"type" : "parent",
				"id_name" : "parent_id",
				"type_name" : "parent_type",
				"source" : "non-db"
			},
			"description" : {
				"vname" : "LBL_DESCRIPTION",
				"type" : "text"
			},
			"locations" : {
				"vname" : "LBL_LOCATION",
				"type" : "char",
				"len" : 50
			},
			"date_start" : {
				"vname" : "LBL_START_DATE",
				"type" : "datetime"
			},
			"date_end" : {
				"vname" : "LBL_DATE_END",
				"type" : "datetime"
			},
			"duration_hours" : {
				"type" : "int"
			},
			"duration_minutes" : {
				"type" : "int"
			},
			"status" : {
				"vname" : "LBL_STATUS",
				"type" : "enum",
				"domain" : "meeting_status_dom",
				"len" : 7
			},
			"assigned_user_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "date_start",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"style" : "sub",
							"elements" : [{
									"name" : "status"
								}
							]
						}, {
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}
							]
						}, {
							"elements" : [{
									"name" : "date_start"
								}, {
									"name" : "date_end"
								}
							]
						}
					]
				},
				"picker" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "status"
								}, {
									"name" : "date_start"
								}
							]
						}
					]
				},
				"dashlet" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "parent_name"
								}
							]
						}, {
							"elements" : [{
									"name" : "status"
								}, {
									"name" : "date_start"
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "status"
					}, {
						"name" : "name"
					}, {
						"name" : "parent_name"
					}, {
						"name" : "date_start"
					}, {
						"name" : "date_end"
					}, {
						"name" : "description"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "picker",
			"history" : "picker",
			"edit" : "default"
		},
		"dashlets" : {
			"opencalls" : {
				"vname" : "LBL_OPEN_CALLS",
				"collapsed" : false,
				"filter" : {
					"conditions" : {
						"field" : "status",
						"operator" : "=",
						"value" : "Planned"
					}
				},
				"sort" : {
					"sortfield" : "date_start",
					"sortdirection" : "ASC"
				},
				"view" : "dashlet"
			}
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"tasks" : {
		"objectdata" : {
			"objectname" : "Tasks",
			"objectlabel" : "LBL_TASKS",
			"objecticlass" : "To-Do",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : true,
			"enableOfflineEdit" : true,
			"offlinelimit" : 500
		},
		"backenddata" : {
			"module" : "Tasks"
		},
		"integration" : {
			"calendar" : {
				"type" : "aldevent",
				"date" : "date_due",
				"listdefs" : "picker",
				"color" : "green",
				"enableadd" : true
			}
		},
		"objectHooks" : {},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"name" : {
				"vname" : "LBL_SUBJECT",
				"type" : "char",
				"len" : 50
			},
			"parent_id" : {
				"type" : "char",
				"len" : 36
			},
			"parent_type" : {
				"type" : "parent_type",
				"len" : 50,
				"parent_objects" : ["accounts", "contacts", "opportunities", "leads"]
			},
			"parent_name" : {
				"vname" : "LBL_LIST_RELATED_TO",
				"type" : "parent",
				"id_name" : "parent_id",
				"type_name" : "parent_type",
				"source" : "non-db"
			},
			"description" : {
				"vname" : "LBL_DESCRIPTION",
				"type" : "text"
			},
			"date_start" : {
				"vname" : "LBL_START_DATE",
				"type" : "datetime"
			},
			"date_due" : {
				"vname" : "LBL_DATE_DUE",
				"type" : "datetime"
			},
			"status" : {
				"vname" : "LBL_STATUS",
				"type" : "enum",
				"domain" : "task_status_dom",
				"len" : 15
			},
			"assigned_user_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "date_start",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"style" : "sub",
							"elements" : [{
									"name" : "status"
								}
							]
						}, {
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}
							]
						}, {
							"elements" : [{
									"name" : "date_start"
								}, {
									"name" : "date_due"
								}
							]
						}
					]
				},
				"picker" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "status"
								}, {
									"name" : "date_due"
								}
							]
						}
					]
				},
				"calendar" : {
					"sort" : {
						"sortfield" : "name",
						"sortdirection" : "ASC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "status"
								}
							]
						}, {
							"elements" : [{
									"name" : "parent_name"
								}
							]
						}
					]
				},
				"dashlet" : {
					"sort" : {
						"sortfield" : "date_due",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "parent_name"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "status"
								}, {
									"name" : "date_due"
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "status"
					}, {
						"name" : "name"
					}, {
						"name" : "parent_name"
					}, {
						"name" : "date_start"
					}, {
						"name" : "date_due"
					}, {
						"name" : "description"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "picker",
			"history" : "picker",
			"edit" : "default",
			"calendar" : "calendar"
		},
		"dashlets" : {
			"opentasks" : {
				"vname" : "LBL_OPEN_TASKS",
				"collapsed" : false,
				"filter" : {
					"conditions" : {
						"field" : "status",
						"operator" : "<>",
						"value" : "Completed"
					}
				},
				"sort" : {
					"sortfield" : "date_due",
					"sortdirection" : "ASC"
				},
				"view" : "dashlet"
			}
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"notes" : {
		"objectdata" : {
			"objectname" : "Notes",
			"objectlabel" : "LBL_NOTES",
			"objecticlass" : "Note",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : true,
			"enableOfflineEdit" : true,
			"offlinelimit" : 500
		},
		"backenddata" : {
			"module" : "Notes"
		},
                "integration" : {
			"image" : true
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"name" : {
				"vname" : "LBL_SUBJECT",
				"type" : "char",
				"len" : 50
			},
			"parent_id" : {
				"type" : "char",
				"len" : 36
			},
			"parent_type" : {
				"type" : "parent_type",
				"len" : 50,
				"parent_objects" : ["accounts", "contacts", "opportunities", "leads", "meetings", "calls", "tasks", "cases"]
			},
			"parent_name" : {
				"vname" : "LBL_LIST_RELATED_TO",
				"type" : "parent",
				"id_name" : "parent_id",
				"type_name" : "parent_type",
				"source" : "non-db"
			},
			"filename" : {
				"vname" : "LBL_FILENAME",
				"type" : "char",
				"len" : 100
			},
			"file_mime_type" : {
				"vname" : "LBL_FILE_MIME_TYPE",
				"type" : "char",
				"len" : 100
			},
			"description" : {
				"vname" : "LBL_DESCRIPTION",
				"type" : "text"
			},
			"date_entered" : {
				"vname" : "LBL_DATE_ENTERED",
				"type" : "date"
			},
			"assigned_user_id" : {
				"vname" : "LBL_ASSIGNED_TO_NAME",
				"type" : "user",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "date_entered",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "parent_name"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "date_entered"
								}
							]
						}, {
							"elements" : [{
									"name" : "filename"
								}
							]
						}
					]
				},
				"picker" : {
					"sort" : {
						"sortfield" : "date_entered",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "date_entered"
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "name"
					}, {
						"name" : "parent_name"
					}, {
						"name" : "description"
					}, {
                                                "name" : "assigned_user_id"
                                        }, {
                                                "name" : "attachment",
						"type" : "attachment"
                                        }
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "picker",
			"history" : "picker",
			"edit" : "default"
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	},
	"cases" : {
		"objectdata" : {
			"objectname" : "Cases",
			"objectlabel" : "LBL_CASES",
			"objecticlass" : "Warning-Shield",
			"displayObject" : true,
			"enableAdd" : true,
			"enableOffline" : true,
			"enableOfflineAdd" : false,
			"enableOfflineEdit" : true,
			"offlinelimit" : 500
		},
		"backenddata" : {
			"module" : "Cases"
		},
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"name" : {
				"vname" : "LBL_NAME",
				"type" : "char",
				"len" : 50
			},
			"case_number" : {
				"vname" : "LBL_CASE_NUMBER",
				"type" : "char",
				"len" : 50
			},
			"account_id" : {
				"type" : "char",
				"len" : 36
			},
			"account_name" : {
				"vname" : "LBL_ACCOUNT_NAME",
				"type" : "relate",
				"id_name" : "account_id",
				"link" : "accounts",
				"display" : "name",
				"source" : "non-db",
				"required" : true
			},
			"description" : {
				"vname" : "LBL_DESCRIPTION",
				"type" : "text"
			},
			"date_entered" : {
				"vname" : "LBL_DATE_ENTERED",
				"type" : "date"
			},
			"assigned_user_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			},
			"favorite" : {
				"type" : "tinyint"
			}
		},
		"links" : {
			"accounts" : {
				"name" : "accounts",
				"relationship" : "account_cases",
				"subpanel" : false
			},
                        "notes" : {
				"name" : "notes",
				"relationship" : "case_notes",
				"subpanel" : true,
				"listdefs" : "default"
			}
		},
		"viewdefinition" : {
			"listbased" : {
				"default" : {
					"sort" : {
						"sortfield" : "date_entered",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "case_number"
								}, {
									"name" : "account_name"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "date_entered"
								}
							]
						}
					]
				},
				"foraccounts" : {
					"sort" : {
						"sortfield" : "date_entered",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"style" : "main",
							"elements" : [{
									"name" : "case_number"
								}
							]
						}, {
							"style" : "sub",
							"elements" : [{
									"name" : "date_entered"
								}
							]
						}
					]
				},
				"picker" : {
					"sort" : {
						"sortfield" : "date_entered",
						"sortdirection" : "DESC"
					},
					"lines" : [{
							"elements" : [{
									"name" : "name"
								}, {
									"name" : "date_entered"
								}
							]
						}
					]
				}
			},
			"fieldbased" : {
				"default" : [{
						"name" : "name"
					}, {
						"name" : "account_name"
					}, {
						"name" : "description"
					}
				]
			}
		},
		"viewallocation" : {
			"list" : "default",
			"detail" : "default",
			"picker" : "picker",
			"history" : "picker",
			"edit" : "default"
		},
		"acl" : {
			"enabled" : true,
			"list" : true,
			"view" : true,
			"edit" : true
		}
	}
}
';
    var $metadataRelationships = '{
	"accounts_opportunities" : {
		"robject" : "accounts",
		"rkey" : "id",
		"lobject" : "opportunities",
		"lkey" : "id",
		"reltable" : "accounts_opportunities",
		"relrkey" : "account_id",
		"rellkey" : "opportunity_id",
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"account_id" : {
				"type" : "char",
				"len" : 36
			},
			"opportunity_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			}
		}
	},
	"accounts_contacts" : {
		"robject" : "accounts",
		"rkey" : "id",
		"lobject" : "contacts",
		"lkey" : "id",
		"reltable" : "accounts_contacts",
		"relrkey" : "account_id",
		"rellkey" : "contact_id",
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"account_id" : {
				"type" : "char",
				"len" : 36
			},
			"contact_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			}
		}
	},
	"account_meetings" : {
		"robject" : "accounts",
		"rkey" : "id",
		"lobject" : "meetings",
		"lkey" : "parent_id"
	},
	"account_cases" : {
		"robject" : "accounts",
		"rkey" : "id",
		"lobject" : "cases",
		"lkey" : "account_id"
	},
	"account_calls" : {
		"robject" : "accounts",
		"rkey" : "id",
		"lobject" : "calls",
		"lkey" : "parent_id"
	},
	"account_notes" : {
		"robject" : "accounts",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
	"account_tasks" : {
		"robject" : "accounts",
		"rkey" : "id",
		"lobject" : "tasks",
		"lkey" : "parent_id"
	},
	"contact_meetings" : {
		"robject" : "contacts",
		"rkey" : "id",
		"lobject" : "meetings",
		"lkey" : "parent_id"
	},
	"contact_calls" : {
		"robject" : "contacts",
		"rkey" : "id",
		"lobject" : "calls",
		"lkey" : "parent_id"
	},
	"contact_notes" : {
		"robject" : "contacts",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
	"contact_tasks" : {
		"robject" : "contacts",
		"rkey" : "id",
		"lobject" : "tasks",
		"lkey" : "parent_id"
	},
        "leads_meetings" : {
		"robject" : "leads",
		"rkey" : "id",
		"lobject" : "meetings",
		"lkey" : "parent_id"
	},
	"leads_calls" : {
		"robject" : "leads",
		"rkey" : "id",
		"lobject" : "calls",
		"lkey" : "parent_id"
	},
	"leads_notes" : {
		"robject" : "leads",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
	"leads_tasks" : {
		"robject" : "leads",
		"rkey" : "id",
		"lobject" : "tasks",
		"lkey" : "parent_id"
	},
	"opportunities_meetings" : {
		"robject" : "opportunities",
		"rkey" : "id",
		"lobject" : "meetings",
		"lkey" : "parent_id"
	},
	"opportunities_calls" : {
		"robject" : "opportunities",
		"rkey" : "id",
		"lobject" : "calls",
		"lkey" : "parent_id"
	},
	"opportunities_notes" : {
		"robject" : "opportunities",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
	"opportunities_tasks" : {
		"robject" : "opportunities",
		"rkey" : "id",
		"lobject" : "tasks",
		"lkey" : "parent_id"
	},
	"opportunities_contacts" : {
		"robject" : "opportunities",
		"rkey" : "id",
		"lobject" : "contacts",
		"lkey" : "id",
		"reltable" : "opportunities_contacts",
		"relrkey" : "opportunity_id",
		"rellkey" : "contact_id",
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"opportunity_id" : {
				"type" : "char",
				"len" : 36
			},
			"contact_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			}
		}
	}, 
        "meetings_notes" : {
		"robject" : "meetings",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
        "calls_notes" : {
		"robject" : "calls",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
        "tasks_notes" : {
		"robject" : "tasks",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
        "case_notes" : {
		"robject" : "cases",
		"rkey" : "id",
		"lobject" : "notes",
		"lkey" : "parent_id"
	},
        "meetings_contacts" : {
		"robject" : "meetings",
		"rkey" : "id",
		"lobject" : "contacts",
		"lkey" : "id",
		"reltable" : "meetings_contacts",
		"relrkey" : "meeting_id",
		"rellkey" : "contact_id",
		"datadictionary" : {
			"id" : {
				"type" : "char",
				"len" : 36
			},
			"meeting_id" : {
				"type" : "char",
				"len" : 36
			},
			"contact_id" : {
				"type" : "char",
				"len" : 36
			},
			"deleted" : {
				"type" : "tinyint"
			},
			"synced" : {
				"type" : "tinyint"
			}
		}
	}
}';
    var $dashboardconfig = '{
                "enableconfig" : true, 
                "dashboards" : [{
                    "id" : "dcf8c456-1dbe-f1a8-ce5e-a2df2e98c21f",
                    "name" : "Sales",
                    "dashlets" : [{
                                    "id" : "f023f671-0c9e-e3b1-3f86-2e383d8a3a03",
                                    "dashletType" : "moduledashlet",
                                    "dashletId" : "openopportunities",
                                    "dashletObject" : "opportunities",
                                    "vname" : "LBL_OPEN_OPPORTUNITIES"
                            }, {
                                    "id" : "77aa0740-be6c-5c66-cc37-e30d55c4b0af",
                                    "dashletType" : "krepvis",
                                    "reportId" : "8391593e-f643-3d39-c76c-5582bb80c664",
                                    "name" : "Opportunites 1x2"
                            }
                    ]
                },
                {
                    "id" : "0e450133-79d7-24b6-abb9-6997d820bacc",
                    "name" : "Support",
                    "dashlets" : [{
                                    "id" : "41713895-2007-bc93-41f9-a2df07f8695f",
                                    "dashletType" : "krepvis",
                                    "reportId" : "42a697f4-2da4-c101-991d-555ce2d5b69c",
                                    "name" : "Support Report"
                            }, {
                                    "id" : "03c448ac-42f1-bd8c-cc92-06e1b2f62b98",
                                    "dashletType" : "moduledashlet",
                                    "dashletId" : "opencalls",
                                    "dashletObject" : "calls"
                            }
                    ]
                }]
        }';
    
    var $spiceFavoritesClass = null;
    
    public function getMetadata() {

        $retArray = array(
            'syssettings' => json_decode($this->genericSettings, true),
            'objects' => json_decode($this->metadataObjects, true),
            'relationships' => json_decode($this->metadataRelationships, true),
            'dashboards' => json_decode($this->dashboardconfig, true)
        );

        $retArray['md5'] = md5(json_encode($retArray));

        if ($_REQUEST['md5'] && $_REQUEST['md5'] == $retArray['md5'])
            $retArray = array('md5' => $_REQUEST['md5']);

        return $retArray;
    }

    public function determineSync($module, $remoteData) {
        global $db;
        $retArray = [];
        $remoteObjects = isset($remoteData['objects']) ? $remoteData['objects'] : $remoteData;
        $defaultSyncs = isset($remoteData['default']) ? $remoteData['default'] : [];
        if (count($remoteObjects) > 0 || $defaultSyncs) {
            $module = BeanFactory::getBean($module);
            $defaultRecordsFromIntegration = [];
            if($defaultSyncs) {
                $defaultRecordsFromIntegration = $this->getDefaultSyncFromDb($module, $defaultSyncs);
            }
            foreach($defaultRecordsFromIntegration as $id => $timestamp) {
                $sync = !isset($remoteObjects[$id]) || $timestamp > $remoteObjects[$id];
                if($sync) {
                    $retArray[] = $id;
                }
            }
            $remainingRemoteObjects = array_diff_key($remoteObjects, $defaultRecordsFromIntegration);
            $whereClause = '';
            $i = 0;
            foreach ($remainingRemoteObjects as $id => $changeDate) {
                if ($whereClause != '')
                    $whereClause .= ' OR ';
                $whereClause .= "(id = '" . $id . "' AND date_modified > '" . gmdate('Y-m-d H:i:s', $changeDate) . "')";
                $i++;
                if ($i >= 50) {
                    $retArray = array_merge($retArray, $this->getRecords($module, $whereClause));
                    $whereClause = '';
                    $i = 0;
                }
            }
            $retArray = array_merge($retArray, $this->getRecords($module, $whereClause));
        }
        return $retArray;
    }

    private function getRecords($module, $whereClause) {
        global $db;
        $retArray = [];
        if ($whereClause != '') {
            $sql = "SELECT id FROM " . $module->table_name . " WHERE " . $whereClause;
            $recordObj = $db->query($sql);
            while ($record = $db->fetchByAssoc($recordObj))
                $retArray[] = $record['id'];
        }
        return $retArray;
    }
        
    private function getDefaultSyncFromDb($thisBean, $defaultDefinitions) {
        
        global $current_user, $db;
        
        $defaults = [];
        $whereClause = '';
        $addJoins = '';
        if (!empty($defaultDefinitions['filter'])) {
            $searchConditions = $defaultDefinitions['filter'];
            if (is_array($searchConditions) && count($searchConditions) > 0) {
                $searchConditionWhereClause = $this->buildConditionsWhereClause($thisBean, $searchConditions, $addJoins);
                if ($searchConditionWhereClause) {
                    $whereClause .= '(' . $searchConditionWhereClause . ')';
                }
            }
        }

        // set the favorite as mandatory if search by favortes is set
        if ($defaultDefinitions['myitems']) {
            if ($whereClause != '') {
                $whereClause .= ' AND ';                
            }               

            $whereClause .= $thisBean->table_name . ".assigned_user_id='" . $current_user->id . "'";
        }

        // $beanList = $thisBean->get_list($searchParams['orderby'], $searchParams['whereclause'], $searchParams['offset'], $searchParams['limit']);
        $queryArray = $thisBean->create_new_list_query('', $whereClause, array('id','date_modified'), array(), false, '', true, null, false);
        
        $spiceFavoritesClass = $this->getSpiceFavoritesClass();
        $favoritesQueryParts = $spiceFavoritesClass::getBeanListQueryParts($thisBean, $searchParams['searchfavorites']);
        // add the favorites we need 
        $queryArray['from'] .= $favoritesQueryParts['from'];

        // any additional joins we might have gotten
        $queryArray['from'] .= ' ' . $addJoins;

        // $queryArray['where'] .= " AND (spicefavorites.user_id = '" . $current_user->id . "' OR spicefavorites.user_id IS NULL)";
        $queryArray['where'] .= $favoritesQueryParts['where'];

        // build the query
        $query = $queryArray['select'] . $queryArray['from'] . $queryArray['where'] . $queryArray['order_by'];
        
        $dbResult = $db->query($query);
        
        while($row = $db->fetchByAssoc($dbResult)) {
            $defaults[$row['id']] = strtotime($row['date_modified'] . " UTC");
        }
        
        return $defaults;
    }
    
    private function buildConditionsWhereClause($bean, $conditions, &$addJoins)
    {
        $condWhereClause = '';
        if (!empty($conditions['join'])) {
            foreach ($conditions['conditions'] as $condition) {
                if ($condWhereClause != '')
                    $condWhereClause .= ' ' . $conditions['join'] . ' ';

                if (!empty($condition['join']))
                    $condWhereClause .= '(' . $this->buildConditionsWhereClause($bean, $condition, $addJoins) . ')';
                else
                    $condWhereClause .= $this->buildConditionWhereClause($bean, $condition, $addJoins);
            }
        } else
            $condWhereClause .= $this->buildConditionWhereClause($bean, $conditions, $addJoins);

        return $condWhereClause;
    }

    function buildConditionWhereClause($bean, $condition, &$addJoins)
    {
        global $db;
        // check if we have to add the table to the field name
        $fieldName = $condition['field'];
        if(strpos($condition['field'], '.') === false)
            $fieldName = $bean->table_name . '.' . $condition['field'];

        // check if we have an aadditonal join
        if(is_array(($condition['addjoin']))){

            $addJoins .= ' ' . $condition['addjoin']['jointype'] . ' JOIN ' . $condition['addjoin']['jointable'] . ' ON ' . $bean->table_name . '.' .
                $condition['addjoin']['joinid'] . ' = ' . $condition['addjoin']['jointable'] . '.' . $condition['addjoin']['jointableid'] . ' AND ' .
                $condition['addjoin']['jointable'] . '.deleted = 0';

        }

        switch ($condition['operator']) {
            case 'doy>=':
                return 'DAYOFYEAR(' . $fieldName . ') >= ' . $condition['value'];
                break;
            case 'doy<=':
                return 'DAYOFYEAR(' . $fieldName . ') <= ' . $condition['value'];
                break;
            case 'in':
            case 'not in':
                return $fieldName . ' ' . $condition['operator'] . ' (' . $condition['value'] . ') ';
                break;
            case 'currentuser':
                return $fieldName . ' = \'' . $GLOBALS['current_user']->id . '\'';
                break;
            case '>interval':
                $now = new SugarDateTime();
                $interval = DateInterval::createFromDateString($condition['value']);
                return $fieldName . ' > ' . $db->convert($db->quoted($now->add($interval)->asDb()), 'datetime');
                break;
            case '<interval':
                $now = new SugarDateTime();
                $interval = DateInterval::createFromDateString($condition['value']);
                return $fieldName . ' < ' . $db->convert($db->quoted($now->add($interval)->asDb()), 'datetime');                
                break;
            default:
                return $fieldName . ' ' . $condition['operator'] . ' \'' . $condition['value'] . '\'';
                break;
        }
    }
    
    private function getSpiceFavoritesClass() {
        global $sugar_flavor;
        
        if($this->spiceFavoritesClass === null) {
            if($sugar_flavor === 'PRO') {
                require_once 'include/SpiceFavorites/SpiceFavoritesSugarFavoritesWrapper.php';
                $this->spiceFavoritesClass = 'SpiceFavoritesSugarFavoritesWrapper';
            } else {
                require_once 'include/SpiceFavorites/SpiceFavorites.php';
                $this->spiceFavoritesClass = 'SpiceFavorites';
            }
        }
        return $this->spiceFavoritesClass;        
    }    

    public function setRelationshipsMultiple($tablename, $syncdata) {
        global $db;

        $retArray = array();

        $rkey = $syncdata['reldata']['relrkey'];
        $lkey = $syncdata['reldata']['rellkey'];

        foreach ($syncdata['relitems'] as $relationshipitem) {
            // if we delete the record 
            if ($relationshipitem['deleted']) {
                $db->query("UPDATE $tablename SET deleted = 1 WHERE id = '" . $relationshipitem['id'] . "' AND deleted = 0");
                $retArray[$relationshipitem['id']] = array(
                    'deleted' => true,
                    'synced' => true
                );
            } else {
                // check if we have the relationship
                if ($existingRecord = $db->fetchByAssoc($db->query("SELECT id FROM $tablename WHERE $rkey = '" . $relationshipitem[$rkey] . "' AND $lkey='" . $relationshipitem[$lkey] . "' AND id <> '" . $relationshipitem['id'] . "' deleted = 0"))) {
                    $retArray[$relationshipitem['id']] = array(
                        'newid' => $existingRecord['id'],
                        'synced' => true
                    );
                } else {
                    $db->query("INSERT INTO $tablename (id, $rkey, $lkey, date_modified, deleted) VALUES('" . $relationshipitem['id'] . "', '" . $relationshipitem[$rkey] . "', '" . $relationshipitem[$lkey] . "', '" . TimeDate::getInstance()->nowDb() . "', 0)");
                    $retArray[$relationshipitem['id']] = array(
                        'synced' => true
                    );
                }
            }
        }

        return $retArray;
    }

    function getRelationshipsChanges($tablename, $syncdata) {
        global $db;

        $retArray = array();

        $deletedRecords = $db->query("SELECT id, deleted FROM $tablename WHERE id in ('" . implode("','", $syncdata) . "')");
        // echo "SELECT id FROM $tablename WHERE deleted = 1 AND id in ('" . implode("','", $syncdata) . "')";
        while ($deletedRecord = $db->fetchByAssoc($deletedRecords)) {
            if ($idIndex = array_search($deletedRecord['id'], $syncdata)) {
                unset($syncdata[$idIndex]);
            }

            if ($deletedRecord['deleted'])
                $retArray[] = $deletedRecord['id'];
        }

        // add all ids we have not found to the removal
        if (is_array($syncdata))
            $retArray = array_merge($retArray, $syncdata);

        return $retArray;
    }

    function getMassRelationships($tablename, $syncdata) {
        global $db;
        $retArray = array();

        $rkey = $syncdata['reldata']['relrkey'];
        $lkey = $syncdata['reldata']['rellkey'];

        $foundRecords = $db->query("SELECT id, $rkey, $lkey FROM $tablename WHERE $rkey in ('" . implode("','", $syncdata['ids'][$rkey]) . "') AND $lkey in ('" . implode("','", $syncdata['ids'][$lkey]) . "') ");

        while ($foundRecord = $db->fetchByAssoc($foundRecords)) {
            $retArray[] = $foundRecord;
        }

        return $retArray;
    }
    
    public function getReminders($requestParams) {
        
        global $current_user, $db;
        
        $tableName = 'spicereminders';
        $whereClause = '';
        
        if($requestParams['startdate']) {
            $whereClause .= "reminder_date >= " . $db->convert($db->quoted($requestParams['startdate'], "date"));
        }
        
        if($requestParams['enddate']) {
            if($whereClause) {
                $whereClause .= ' AND ';
            }
            $whereClause .= "reminder_date <= " . $db->convert($db->quoted($requestParams['enddate'], "date"));
        }
        
        $query = "SELECT user_id, bean, bean_id, reminder_date FROM " . $tableName . " WHERE user_id='" . $current_user->id . "'";
        if($whereClause) {
            $query .= " AND " . $whereClause;
        }
        
        $reminders = [];
        
        $result = $db->query($query);
        while($row = $db->fetchByAssoc($result)) {
            $reminder = $row;
            $reminderBean = BeanFactory::getBean($reminder['bean']);
            $reminderBean->retrieve($reminder['bean_id']);
//            $reminderBean->retrieve('4711');
            $reminder['summary'] = $reminderBean->get_summary_text();
            $reminder['object'] = $this->mapBeanToArray($reminder['bean'], $reminderBean);
            $reminders[] = $reminder;
        }
        
        return $reminders;
    }
    
    public function addReminder($beanModule, $beanId, $data) {

        global $current_user, $db;

        $reminderDate = $data['reminder_date'];
        $spiceReminderTable = $this->getSpiceReminderTable();
        if ($GLOBALS['db']->dbType == 'mysql') {
            $db->query("INSERT INTO $spiceReminderTable SET user_id = '$current_user->id', bean='$beanModule', bean_id = '$beanId', reminder_date='$reminderDate' ON DUPLICATE KEY UPDATE reminder_date='$reminderDate'");
        } else {
            $reminderRecordObj = $db->query("SELECT * FROM $spiceReminderTable WHERE user_id='$current_user->id' AND bean_id='$beanId'");
            if ($reminderRecord = $db->fetchByAssoc($reminderRecordObj))
                $db->query("UPDATE $spiceReminderTable SET reminder_date='$reminderDate'WHERE user_id='$current_user->id' AND bean_id='$beanId'");
            else
                $db->query("INSERT INTO $spiceReminderTable (user_id, bean, bean_id, reminder_date) VALUES ('$current_user->id','$beanModule', '$beanId', '$reminderDate' )");
        }
        $reminderBean = BeanFactory::getBean($beanModule);
        $reminderBean->retrieve($beanId);
        $reminder = [
            'bean' => $beanModule,
            'bean_id' => $beanId,
            'user_id' => $current_user->id,
            'reminder_date' => $reminderDate,
            'summary' => $reminderBean->get_summary_text()
        ];
        return $reminder;
    }
    
    public function removeReminder($beanName, $beanId) {

        global $current_user, $db;
        $query = "DELETE FROM {$this->getSpiceReminderTable()} WHERE user_id='$current_user->id' AND bean_id='$beanId' AND bean='$beanName'";
        return $db->query($query);
    }
    
    private function mapBeanToArray($beanModule, $thisBean, $returnFields = array()) {

        $beanDataArray = array();
        foreach ($thisBean->field_name_map as $fieldId => $fieldData) {
            if ($fieldId == 'id' || ($fieldData['type'] != 'link' && (count($returnFields) == 0 || (count($returnFields) > 0 && in_array($fieldId, $returnFields))))) {
                $beanDataArray[$fieldId] = html_entity_decode($thisBean->$fieldId, ENT_QUOTES);
            }
        }

        // get the summary text
        $beanDataArray['summary_text'] = $thisBean->get_summary_text();

        $beanDataArray['favorite'] = $this->get_favorite($beanModule, $thisBean->id) ? 1 : 0;

        // get the email addresses
        $beanDataArray['emailaddresses'] = $this->getEmailAddresses($beanModule, $thisBean->id);

        // get the ACL Array
        $beanDataArray['acl'] = $this->get_acl_actions($thisBean);

        return $beanDataArray;
    }

    private function getEmailAddresses($beanObject, $beanId) {

        $emailAddresses = BeanFactory::getBean('EmailAddresses');
        return $emailAddresses->getAddressesByGUID($beanId, $beanObject);
    }
    
    private function get_acl_actions($bean) {
        $aclArray = [];
        $aclActions = ['list', 'detail', 'edit', 'delete'];
        foreach ($aclActions as $aclAction) {
            $aclArray[$aclAction] = $bean->ACLAccess($aclAction);
        }
        return $aclArray;
    }

    private function get_favorite($beanModule, $beanId) {
        $spiceFavoriteClass = $this->getSpiceFavoritesClass();
        return $spiceFavoriteClass::get_favorite($beanModule, $beanId);
    }
    
    private function getSpiceReminderTable() {
        
        if(!$this->spiceReminderTable) {
            if ($sugar_config['spiceremindertable']) {
                $this->spiceReminderTable = $sugar_config['spiceremindertable'];
            } else {
                $this->spiceReminderTable = 'spicereminders';
            }
        }
        return $this->spiceReminderTable;
    }
}
