UPDATE sysuiobjectrepository SET module = '6e85f8b8-44a2-a772-4deb-62fff136168c', object = REPLACE(object, 'ObjectActivitiy', 'Activity'),  component = REPLACE(component, 'ObjectActivitiy', 'Activity') WHERE object LIKE 'ObjectActivitiy%';
UPDATE sysuicomponentsetscomponents SET component = REPLACE(component, 'ObjectActivitiy', 'Activity') WHERE component LIKE 'ObjectActivitiy%';
UPDATE sysuicomponentmoduleconf SET component = REPLACE(component, 'ObjectActivitiy', 'Activity') WHERE component LIKE 'ObjectActivitiy%';
UPDATE sysuicomponentdefaultconf SET component = REPLACE(component, 'ObjectActivitiy', 'Activity') WHERE component LIKE 'ObjectActivitiy%';
UPDATE sysuicustomcomponentsetscomponents SET component = REPLACE(component, 'ObjectActivitiy', 'Activity') WHERE component LIKE 'ObjectActivitiy%';
UPDATE sysuicustomcomponentmoduleconf SET component = REPLACE(component, 'ObjectActivitiy', 'Activity') WHERE component LIKE 'ObjectActivitiy%';
UPDATE sysuicustomcomponentdefaultconf SET component = REPLACE(component, 'ObjectActivitiy', 'Activity') WHERE component LIKE 'ObjectActivitiy%';