angular.module('leukemiapp')

    .factory('ModuleManagementService', function () {

        var service = {};

        service.activeModules = [];
        service.modules = {};

        for (moduleNumber = 0; moduleNumber < Modules.length; moduleNumber++) {
            var moduleName = Modules[moduleNumber].name;

            service.modules[moduleName] = true;
        }

        const handle = Meteor.subscribe('userSettings');
        Tracker.autorun(() => {
            const isReady = handle.ready();
            console.log(`Handle is ${isReady ? 'ready' : 'not ready'}`);
            if (isReady) {
                startup();
            }
        });

        service.toggleModule = (moduleName) => {
            if (!!Meteor.userId()) {
                if (moduleName !== undefined) {
                    setTimeout(Meteor.call('setActiveModule', moduleName, service.modules[moduleName]), 1000);
                }
            }

            setActiveModules();
        };

        function startup() {
            userModules = UserSettings.findOne({});  //userId: Meteor.userId()
            console.log("USER MODULES of " + Meteor.userId() + " " + JSON.stringify(userModules));
            if (!!Meteor.userId()) {
                if (userModules === undefined) { // no settings => default settings (turn all modules on)
                    for (var module in service.modules) {
                        service.modules[module] = true;
                        console.log("userIDDD " + Meteor.userId());
                        if (!!Meteor.userId()) {
                            setTimeout(Meteor.call('setActiveModule', module, true), 1000);
                        }
                    }
                } else { // otherwise load existing settings
                    userModules = userModules.modules;
                    for (var module in service.modules) {
                        if (userModules.hasOwnProperty(module) && module !== undefined) {
                            service.modules[module] = userModules[module];
                        }
                    }
                }
            } else { // user not logged in, show all modules
                for (var module in service.modules) {
                    service.modules[module] = true;
                }
            }

            setActiveModules();
        }

        function setActiveModules() {
            console.log('service.modules is ', service.modules);
            var activeModules = [];

            for (var module in service.modules) {
                if (service.modules.hasOwnProperty(module) && module !== undefined) {
                    if (service.modules[module] == true) {
                        activeModules.push(module);
                    }
                }
            }

            service.activeModules.length = 0;
            angular.extend(service.activeModules, activeModules);

            console.log('active modules are ', service.activeModules);
        }

        return service;
    });