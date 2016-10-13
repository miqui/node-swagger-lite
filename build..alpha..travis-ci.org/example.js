




















































































/*
example.js

this script will run a standalone swagger-ui server backed by nedb

instruction
    1. save this script as example.js
    2. run the shell command:
        $ npm install "kaizhu256/node-swagger-lite#alpha" && export PORT=8081 && node example.js
    3. open a browser to http://localhost:8081
    4. interact with the swagger-ui server
*/
/* istanbul instrument in package swagger-lite */
/*jslint
    bitwise: true,
    browser: true,
    maxerr: 8,
    maxlen: 96,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var local;



    // run shared js-env code - pre-init
    (function () {
        // init local
        local = {};
        // init modeJs
        local.modeJs = (function () {
            try {
                return typeof navigator.userAgent === 'string' &&
                    typeof document.querySelector('body') === 'object' &&
                    typeof XMLHttpRequest.prototype.open === 'function' &&
                    'browser';
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
        /* istanbul ignore next */
        // re-init local
        local = local.modeJs === 'browser'
            ? window.swgg.local
            : module.isRollup
            ? module
            : require('swagger-lite').local;
        // export local
        local.global.local = local;
        local.middlewareCrudCustom = function (request, response, nextMiddleware) {
        /*
         * this function will run the middleware that will run custom-crud-operations
         */
            var crud, options, result;
            options = {};
            local.utility2.onNext(options, function (error, data) {
                switch (options.modeNext) {
                case 1:
                    crud = request.swgg.crud;
                    switch (crud.operationId.split('.')[0]) {
                    // coverage-hack - test error handling-behavior
                    case 'crudErrorPre':
                        options.onNext(local.utility2.errorDefault);
                        return;
                    case 'getInventory':
                        local.nedb.dbTableFindMany(crud.dbTable, {
                            query: {},
                            projection: { status: 1 }
                        }, options.onNext);
                        break;
                    default:
                        options.modeNext = Infinity;
                        options.onNext();
                    }
                    break;
                case 2:
                    switch (crud.operationId.split('.')[0]) {
                    case 'getInventory':
                        result = {};
                        data.forEach(function (element) {
                            result[element.status] = result[element.status] || 0;
                            result[element.status] += 1;
                        });
                        options.onNext(null, result);
                        break;
                    }
                    break;
                case 3:
                    local.swgg.serverRespondJsonapi(request, response, error, data);
                    break;
                default:
                    nextMiddleware(error, data);
                }
            });
            options.modeNext = 0;
            options.onNext();
        };
        local.middlewareInitCustom = function (request, response, nextMiddleware) {
        /*
         * this function will run the middleware that will custom-init the request and response
         */
            // enable cors
            // http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
            response.setHeader(
                'Access-Control-Allow-Methods',
                'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
            );
            response.setHeader('Access-Control-Allow-Origin', '*');
            // init content-type
            response.setHeader('Content-Type', 'application/json; charset=UTF-8');
            // ignore .map files
            if (request.urlParsed.pathname.slice(-4) === '.map') {
                local.utility2.serverRespondDefault(request, response, 404);
                return;
            }
            nextMiddleware();
        };
        // init middleware
        local.middleware = local.utility2.middlewareGroupCreate([
            local.utility2.middlewareInit,
            local.utility2.middlewareAssetsCached,
            local.swgg.middlewareRouter,
            local.swgg.middlewareUserLogin,
            local.middlewareInitCustom,
            local.swgg.middlewareJsonpStateInit,
            local.utility2.middlewareBodyRead,
            local.swgg.middlewareBodyParse,
            local.swgg.middlewareValidate,
            local.middlewareCrudCustom,
            local.swgg.middlewareCrudBuiltin,
            local.swgg.middlewareCrudEnd
        ]);
        // init error-middleware
        local.middlewareError = local.swgg.middlewareError;
        // run test-server
        local.utility2.testRunServer(local);
    }());
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        /* istanbul ignore next */
        local.testRun = function (event) {
            var reader, tmp;
            switch (event && event.currentTarget.id) {
            case 'nedbExportButton1':
                tmp = window.URL.createObjectURL(new window.Blob([local.nedb.dbExport()]));
                document.querySelector('#nedbExportA1').href = tmp;
                document.querySelector('#nedbExportA1').click();
                setTimeout(function () {
                    window.URL.revokeObjectURL(tmp);
                }, 30000);
                break;
            case 'nedbImportButton1':
                document.querySelector('#nedbImportInput1').click();
                break;
            case 'nedbImportInput1':
                local.utility2.ajaxProgressShow();
                reader = new window.FileReader();
                tmp = document.querySelector('#nedbImportInput1').files[0];
                if (!tmp) {
                    return;
                }
                reader.addEventListener('load', function () {
                    local.nedb.dbImport(reader.result, local.utility2.ajaxProgressUpdate);
                });
                reader.readAsText(tmp);
                break;
            case 'nedbResetButton1':
                local.utility2.dbReset();
                break;
            case 'testRunButton1':
                if (document.querySelector('.testReportDiv').style.display === 'none') {
                    document.querySelector('.testReportDiv').style.display = 'block';
                    document.querySelector('#testRunButton1').innerText = 'hide internal test';
                    local.modeTest = true;
                    local.utility2.testRun(local);
                } else {
                    document.querySelector('.testReportDiv').style.display = 'none';
                    document.querySelector('#testRunButton1').innerText = 'run internal test';
                }
                break;
            }
        };
        // init event-handling
        ['change', 'click'].forEach(function (event) {
            Array.prototype.slice.call(
                document.querySelectorAll('.on' + event)
            ).forEach(function (element) {
                element.addEventListener(event, local.testRun);
            });
        });
        // init ui
        local.swgg.uiEventListenerDict['.onEventUiReload']();
        // run tests
        [local.utility2.modeTest].filter(local.utility2.echo).forEach(function () {
            document.querySelector('#testRunButton1').innerText = 'hide internal test';
        });
        break;



    // run node js-env code - post-init
    case 'node':
        // export local
        module.exports = local;
        // init assets
        local.utility2.tryCatchOnError(function () {
            local.utility2.assetsDict['/assets.example.js'] =
                local.fs.readFileSync(__filename, 'utf8');
        }, local.utility2.nop);
        /* jslint-ignore-begin */
        // https://github.com/swagger-api/swagger-ui/blob/v2.1.3/dist/index.html
        local.templateIndexHtml = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>\n{{envDict.npm_package_name}} v{{envDict.npm_package_version}}\n</title>\n<link href="assets.swgg.css" rel="stylesheet">\n<link href="assets.utility2.css" rel="stylesheet">\n<style>\n/*csslint\n    box-sizing: false,\n    universal-selector: false\n*/\n* {\n    box-sizing: border-box;\n}\nbody {\n    background-color: #fff;\n    font-family: Arial, Helvetica, sans-serif;\n}\nbody > * {\n    margin-bottom: 1rem;\n}\nbody > button {\n    width: 15rem;\n}\n.zeroPixel {\n    border: 0;\n    height: 0;\n    margin: 0;\n    padding: 0;\n    width: 0;\n}\n</style>\n</head>\n<body>\n    <div class="ajaxProgressDiv" style="display: block;">\n        <div class="ajaxProgressBarDiv ajaxProgressBarDivLoading">loading</div>\n    </div>\n    <h1>\n        <a\n            {{#if envDict.npm_package_homepage}}\n            href="{{envDict.npm_package_homepage}}"\n            {{/if envDict.npm_package_homepage}}\n            target="_blank"\n        >{{envDict.npm_package_name}} v{{envDict.npm_package_version}}</a>\n    </h1>\n    <h3>{{envDict.npm_package_description}}</h3>\n    <h4><a download href="assets.app.js">download standalone app</a></h4>\n    <button class="onclick" id="testRunButton1">run internal test</button><br>\n    <div class="testReportDiv" style="display: none;"></div>\n    <button class="onclick" id="nedbResetButton1">reset nedb-database</button><br>\n    <button class="onclick" id="nedbExportButton1">save nedb-database to file</button><br>\n    <a download="nedb.persistence.json" href="" id="nedbExportA1"></a>\n    <button class="onclick" id="nedbImportButton1">load nedb-database from file</button><br>\n    <input class="onchange zeroPixel" type="file" id="nedbImportInput1">\n\n    <div class="swggUiContainer">\n    <form class="header tr">\n        <a class="td1" href="http://swagger.io" target="_blank">swagger</a>\n        <input\n            class="flex1 td2"\n            placeholder="http://petstore.swagger.io/v2/swagger.json"\n            type="text"\n            value="api/v0/swagger.json"\n        >\n    </form>\n    <div class="reset"></div>\n    </div>\n    {{#if isRollup}}\n    <script src="assets.app.min.js"></script>\n    {{#unless isRollup}}\n    <script src="assets.utility2.rollup.js"></script>\n    <script src="assets.swgg.js"></script>\n    <script src="assets.swgg.lib.swagger-ui.js"></script>\n    <script src="jsonp.swgg.stateInit?callback=window.swgg.stateInit"></script>\n    <script>window.utility2.onResetBefore.counter += 1;</script>\n    <script src="assets.example.js"></script>\n    <script src="assets.test.js"></script>\n    <script>window.utility2.onResetBefore();</script>\n    {{/if isRollup}}\n</body>\n</html>\n';






















































































        /* jslint-ignore-end */
        local.utility2.assetsDict['/'] = local.utility2.templateRender(
            local.templateIndexHtml,
            { envDict: local.utility2.envDict }
        );
        break;
    }



    // run shared js-env code - post-init
    (function () {
        // init petstore-api - frontend
        local.tmp =
            JSON.parse(local.utility2.assetsDict['/assets.swgg.lib.swagger.petstore.json']);
        delete local.tmp.basePath;
        delete local.tmp.host;
        delete local.tmp.schemes;
        local.swgg.apiDictUpdate(local.tmp);
        // init petstore-api - backend
        local.swgg.apiDictUpdate({
            definitions: {
                File: {
                    allOf: [{ $ref: '#/definitions/BuiltinFile' }]
                },
                Pet: {
                    properties: {
                        _id: { readOnly: true, type: 'string' },
                        createdAt: { format: 'date-time', readOnly: true, type: 'string' },
                        id: { default: 1, minimum: 1 },
                        updatedAt: { format: 'date-time', readOnly: true, type: 'string' }
                    }
                },
                Order: {
                    properties: {
                        _id: { readOnly: true, type: 'string' },
                        createdAt: { format: 'date-time', readOnly: true, type: 'string' },
                        id: { default: 1, minimum: 1 },
                        updatedAt: { format: 'date-time', readOnly: true, type: 'string' }
                    }
                },
                User: {
                    allOf: [{ $ref: '#/definitions/BuiltinUser' }],
                    properties: {
                        _id: { readOnly: true, type: 'string' },
                        createdAt: { format: 'date-time', readOnly: true, type: 'string' },
                        email: { default: 'a@a.com', format: 'email' },
                        id: { default: 1, minimum: 1 },
                        updatedAt: { format: 'date-time', readOnly: true, type: 'string' }
                    }
                }
            },
            tags: [{ description: 'builtin-file model', name: 'file' }],
            'x-swgg-apiDict': {
                'file crudCountManyByQuery': {
                    _schemaName: 'File'
                },
                'file crudCreateOrReplaceOneByKeyUnique.id.id': {
                    _schemaName: 'File'
                },
                'file crudGetManyByQuery': {
                    _schemaName: 'File'
                },
                'file crudRemoveOneByKeyUnique.id.id': {
                    _schemaName: 'File'
                },
                'file crudUpdateOneByKeyUnique.id.id': {
                    _schemaName: 'File'
                },
                'file fileGetOneByKeyUnique.id.id': {
                    _schemaName: 'File'
                },
                'file fileUploadManyByForm.1': {
                    _schemaName: 'File'
                },
                'pet addPet': {
                    _operationId: 'crudCreateOrReplaceOneByKeyUnique.petId.id',
                    _schemaName: 'Pet'
                },
                'pet crudGetManyByQuery': {
                    _schemaName: 'Pet'
                },
                'pet deletePet': {
                    _operationId: 'crudRemoveOneByKeyUnique.petId.id',
                    _schemaName: 'Pet'
                },
                'pet findPetsByStatus': {
                    _operationId: 'crudGetManyByQuery',
                    _queryWhere: '{"status":{"$in":{{status jsonStringify}}}}',
                    _schemaName: 'Pet'
                },
                'pet findPetsByTags': {
                    _operationId: 'crudGetManyByQuery',
                    _queryWhere: '{"tags.name":{"$in":{{tags jsonStringify}}}}',
                    _schemaName: 'Pet'
                },
                'pet getPetById': {
                    _operationId: 'crudGetOneByKeyUnique.petId.id',
                    _schemaName: 'Pet'
                },
                'pet updatePet': {
                    _operationId: 'crudUpdateOneByKeyUnique.petId.id',
                    _schemaName: 'Pet'
                },
                'pet updatePetWithForm': {
                    _operationId: 'crudUpdateOneByKeyUnique.petId.id',
                    _schemaName: 'Pet'
                },
                'pet uploadFile': {
                    _operationId: 'fileUploadManyByForm',
                    _schemaName: 'User'
                },
                'store crudGetManyByQuery': {
                    _schemaName: 'Order'
                },
                'store crudUpdateOneByKeyUnique.id.id': {
                    _schemaName: 'Order'
                },
                'store deleteOrder': {
                    _operationId: 'crudRemoveOneByKeyUnique.orderId.id',
                    _schemaName: 'Order'
                },
                'store getInventory': {
                    _schemaName: 'Order'
                },
                'store getOrderById': {
                    _operationId: 'crudGetOneByKeyUnique.orderId.id',
                    _schemaName: 'Order'
                },
                'store placeOrder': {
                    _operationId: 'crudCreateOrReplaceOneByKeyUnique.orderId.id',
                    _schemaName: 'Order'
                },
                'user createUser': {
                    _operationId: 'crudCreateOrReplaceOneByKeyUnique.username.username',
                    _schemaName: 'User'
                },
                'user createUsersWithArrayInput': {
                    _operationId: 'crudCreateOrReplaceMany',
                    _schemaName: 'User'
                },
                'user createUsersWithListInput': {
                    _operationId: 'crudCreateOrReplaceMany',
                    _schemaName: 'User'
                },
                'user crudCountManyByQuery': {
                    _schemaName: 'User'
                },
                'user crudCreateOrReplaceOneByKeyUnique.username.username': {
                    _schemaName: 'User'
                },
                'user crudRemoveOneByKeyUnique.username.username': {
                    _schemaName: 'User'
                },
                'user crudGetManyByQuery': {
                    _schemaName: 'User'
                },
                'user crudUpdateOneByKeyUnique.username.username': {
                    _schemaName: 'User'
                },
                'user deleteUser': {
                    _operationId: 'crudRemoveOneByKeyUnique.username.username',
                    _schemaName: 'User'
                },
                'user getUserByName': {
                    _operationId: 'crudGetOneByKeyUnique.username.username',
                    _schemaName: 'User'
                },
                'user loginUser': {
                    _operationId: 'userLoginByPassword',
                    _schemaName: 'User'
                },
                'user logoutUser': {
                    _operationId: 'userLogout',
                    _schemaName: 'User'
                },
                'user updateUser': {
                    _operationId: 'crudUpdateOneByKeyUnique.username.username',
                    _schemaName: 'User'
                },
                'user userLoginByPassword': {
                    _schemaName: 'User'
                },
                'user userLogout': {
                    _schemaName: 'User'
                }
            },
            'x-swgg-datatableDict': {
                file: {
                    crudCreateOrReplaceOneByKeyUnique:
                        'file crudCreateOrReplaceOneByKeyUnique.id.id',
                    crudRemoveOneByKeyUnique:
                        'file crudRemoveOneByKeyUnique.id.id',
                    crudGetManyByQuery: 'file crudGetManyByQuery',
                    keyUnique: 'id',
                    queryLimit: 20,
                    schema: { $ref: '#/definitions/File' }
                },
                pet: {
                    crudCreateOrReplaceOneByKeyUnique: 'pet addPet',
                    crudRemoveOneByKeyUnique: 'pet deletePet',
                    crudGetManyByQuery: 'pet crudGetManyByQuery',
                    keyUnique: 'id',
                    queryLimit: 20,
                    schema: { $ref: '#/definitions/Pet' }
                },
                store: {
                    crudCreateOrReplaceOneByKeyUnique: 'store placeOrder',
                    crudRemoveOneByKeyUnique: 'store deleteOrder',
                    crudGetManyByQuery: 'store crudGetManyByQuery',
                    keyUnique: 'id',
                    queryLimit: 20,
                    schema: { $ref: '#/definitions/Order' }
                },
                user: {
                    crudCreateOrReplaceOneByKeyUnique: 'user createUser',
                    crudRemoveOneByKeyUnique: 'user deleteUser',
                    crudGetManyByQuery: 'user crudGetManyByQuery',
                    keyUnique: 'username',
                    queryLimit: 20,
                    schema: { $ref: '#/definitions/User' }
                }
            }
        });
        // init dbSeedList
        local.utility2.dbSeedList = [{
            dbIndexCreateList: [{
                fieldName: 'id',
                unique: true
            }],
            dbRowList: [{
                id: '00_test_swaggerUiLogoSmall',
                fileBlob: local.swgg.templateSwaggerUiLogoSmallBase64,
                fileContentType: 'image/png',
                fileDescription: 'swagger-ui logo',
                fileFilename: 'swaggerUiLogoSmall.png'
            }],
            name: 'File'
        }, {
            dbIndexCreateList: [{
                fieldName: 'id',
                isInteger: true,
                unique: true
            }],
            dbRowList: local.swgg.dbRowListRandomCreate({
                dbRowList: [{
                    id: 0,
                    name: 'birdie',
                    photoUrls: [],
                    status: 'available',
                    tags: [{ name: 'bird'}]
                }, {
                    id: 1,
                    name: 'doggie',
                    status: 'pending',
                    photoUrls: [],
                    tags: [{ name: 'dog'}]
                }, {
                    id: 2,
                    name: 'fishie',
                    photoUrls: [],
                    status: 'sold',
                    tags: [{ name: 'fish'}]
                }],
                // init 100 extra random pets
                length: 100,
                override: function (options) {
                    return {
                        id: options.ii + 100,
                        name: local.utility2.listGetElementRandom(
                            ['birdie', 'doggie', 'fishie']
                        ) + '-' + (options.ii + 100),
                        tags: [
                            { name: local.utility2.listGetElementRandom(['female', 'male']) },
                            { name: Math.random().toString(36).slice(2) }
                        ]
                    };
                },
                properties: local.swgg.swaggerJson.definitions.Pet.properties
            }),
            name: 'Pet'
        }, {
            dbIndexCreateList: [{
                fieldName: 'id',
                isInteger: true,
                unique: true
            }],
            dbRowList: local.swgg.dbRowListRandomCreate({
                dbRowList: [{
                    id: 0,
                    petId: 0,
                    status: 'available'
                }, {
                    id: 1,
                    petId: 1,
                    status: 'pending'
                }, {
                    id: 2,
                    petId: 2,
                    status: 'sold'
                }],
                // init 100 extra random orders
                length: 100,
                override: function (options) {
                    return {
                        id: options.ii + 100,
                        petId: options.ii + 100
                    };
                },
                properties: local.swgg.swaggerJson.definitions.Order.properties
            }),
            name: 'Order'
        }, {
            dbIndexCreateList: [{
                fieldName: 'email',
                unique: true
            }, {
                fieldName: 'id',
                isInteger: true,
                unique: true
            }, {
                fieldName: 'username',
                unique: true
            }],
            dbRowList: local.swgg.dbRowListRandomCreate({
                dbRowList: [{
                    email: 'admin@admin.com',
                    firstName: 'admin',
                    id: 0,
                    lastName: '',
                    password: local.utility2.sjclHashScryptCreate('secret'),
                    phone: '1234-5678',
                    username: 'admin'
                }, {
                    email: 'jane@doe.com',
                    firstName: 'jane',
                    id: 1,
                    lastName: 'doe',
                    password: local.utility2.sjclHashScryptCreate('secret'),
                    phone: '1234-5678',
                    username: 'jane.doe'
                }, {
                    email: 'john@doe.com',
                    firstName: 'john',
                    id: 2,
                    lastName: 'doe',
                    password: local.utility2.sjclHashScryptCreate('secret'),
                    phone: '1234-5678',
                    username: 'john.doe'
                }],
                // init 100 extra random users
                length: 100,
                override: function (options) {
                    return {
                        firstName: local.utility2.listGetElementRandom(
                            ['alice', 'bob', 'jane', 'john']
                        ) + '-' + (options.ii + 100),
                        id: options.ii + 100,
                        lastName: local.utility2.listGetElementRandom(['doe', 'smith']) +
                            '-' + (options.ii + 100),
                        password: local.utility2.sjclHashScryptCreate('secret'),
                        tags: [
                            { name: local.utility2.listGetElementRandom(['female', 'male']) },
                            { name: Math.random().toString(36).slice(2) }
                        ]
                    };
                },
                properties: local.swgg.swaggerJson.definitions.User.properties
            }),
            name: 'User'
        }];
        local.utility2.onReadyBefore.counter += 1;
        local.utility2.dbSeedListUpsert(
            local.utility2.dbSeedList,
            local.utility2.onReadyBefore
        );
    }());
}());