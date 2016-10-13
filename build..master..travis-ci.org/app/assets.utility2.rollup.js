// /assets.utility2.rollup.begin.js
/* utility2.rollup.js begin */
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
    "use strict";
    if (typeof module === "object") {
        module.isRollup = true;
    }
}());




// /assets.utility2.lib.istanbul.js
///usr/bin/env node
/* istanbul instrument in package all */
/* !istanbul instrument in package istanbul-lite */
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
(function (local) {
    'use strict';
    var __dirname, nop, process, require;



    // run shared js-env code - init
    (function () {
        // init var
        __dirname = '';
        nop = function () {
        /*
         * this function will do nothing
         */
            return;
        };
        process = local.modeJs === 'browser'
            ? {
                cwd: function () {
                    return '';
                },
                stdout: {}
            }
            : local.process;
        require = function (key) {
            try {
                return local[key] || local.require2(key);
            } catch (ignore) {
            }
        };
        // jslint-hack
        nop(__dirname);
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        // init local properties
        local['./package.json'] = {};
        local.codeDict = local.codeDict || {};
        local.coverageReportCreate = function (options) {
        /*
         * this function will
         * 1. print coverage in text-format to stdout
         * 2. write coverage in html-format to filesystem
         * 3. return coverage in html-format as single document
         */
            if (!options.coverage) {
                return '';
            }
            options.collector = local.collectorCreate(options);
            options.dir = process.cwd() + '/tmp/build/coverage.html';
            options.sourceStore = {};
            options.writer = local.writerCreate(options);
            // 1. print coverage in text-format to stdout
            if (local.modeJs === 'node') {
                new local.TextReport(options).writeReport(options.collector);
            }
            // 2. write coverage in html-format to filesystem
            new local.HtmlReport(options).writeReport(options.collector);
            options.writer.writeFile('', nop);
            // write coverage-summary.json
            local.fsWriteFileWithMkdirpSync(options.dir +
                '/coverage-summary.json', JSON.stringify(local.coverageReportSummary));
            // write coverage.json
            local.fsWriteFileWithMkdirpSync(options.dir +
                '/coverage.json', JSON.stringify(options.coverage));
            // write coverage.badge.svg
            options.pct = local.coverageReportSummary.root.metrics.lines.pct;
            local.fsWriteFileWithMkdirpSync(local.path.dirname(options.dir) +
                '/coverage.badge.svg', local.templateCoverageBadgeSvg
                // edit coverage badge percent
                .replace((/100.0/g), options.pct)
                // edit coverage badge color
                .replace(
                    (/0d0/g),
                    ('0' + Math.round((100 - options.pct) * 2.21).toString(16)).slice(-2) +
                        ('0' + Math.round(options.pct * 2.21).toString(16)).slice(-2) + '00'
                ));
            console.log('created coverage file://' + options.dir + '/index.html');
            // 3. return coverage in html-format as a single document
            if (local.modeJs === 'browser' && document.querySelector('.istanbulCoverageDiv')) {
                document.querySelector('.istanbulCoverageDiv').innerHTML =
                    options.coverageReportHtml;
            }
            return options.coverageReportHtml;
        };
        local.fs = {
            readFileSync: function (file) {
                // return head.txt or foot.txt
                file = local[file.slice(-8)];
                if (local.modeJs === 'browser') {
                    file = file
                        .replace((/\bhtml\b/g), 'x-istanbul-html')
                        .replace((/<style>[\S\s]+?<\/style>/), function (match0) {
                            return match0
                                .replace((/\S.*?\{/g), function (match0) {
                                    return 'x-istanbul-html ' + match0
                                        .replace((/,/g), ', x-istanbul-html ');
                                });
                        })
                        .replace('position: fixed;', 'position: static;')
                        .replace('margin-top: 170px;', 'margin-top: 10px;');
                }
                if (local.modeJs === 'node' && process.env.npm_package_homepage) {
                    file = file
                        .replace(
                            '{{envDict.npm_package_homepage}}',
                            process.env.npm_package_homepage
                        )
                        .replace(
                            '{{envDict.npm_package_name}}',
                            process.env.npm_package_name
                        )
                        .replace(
                            '{{envDict.npm_package_version}}',
                            process.env.npm_package_version
                        );
                } else {
                    file = file.replace((/<h1 [\S\s]*<\/h1>/), '<h1>&nbsp;</h1>');
                }
                return file;
            },
            readdirSync: function () {
                return [];
            }
        };
        local.fsWriteFileWithMkdirpSync = function (file, data) {
        /*
         * this function will synchronously 'mkdir -p' and write the data to file
         */
            if (!local._fs || !file) {
                return;
            }
            // try to write to file
            try {
                local._fs.writeFileSync(file, data);
            } catch (errorCaught) {
                // mkdir -p
                require('child_process').spawnSync(
                    'mkdir',
                    ['-p', local.path.dirname(file)],
                    { stdio: ['ignore', 1, 2] }
                );
                // re-write to file
                local._fs.writeFileSync(file, data);
            }
        };
        /* istanbul ignore next */
        local.instrumentInPackage = function (code, file) {
        /*
         * this function will instrument the code
         * only if if the macro /\* istanbul instrument in package $npm_package_name *\/
         * exists in the code
         */
            return process.env.npm_config_mode_coverage && (
                code.indexOf('/* istanbul instrument in package ' +
                    process.env.npm_package_name + ' */') >= 0 ||
                    code.indexOf('/* istanbul instrument in package ' +
                        process.env.npm_config_mode_coverage + ' */') >= 0
            )
                ? local.instrumentSync(code, file)
                : code;
        };
        local.instrumentSync = function (code, file, coverageVariable) {
        /*
         * this function will
         * 1. normalize the file
         * 2. save code to codeDict[file] for future html-report
         * 3. return instrumented code
         */
            // 1. normalize the file
            file = local.path.resolve('/', file);
            // 2. save code to codeDict[file] for future html-report
            local.codeDict[file] = code;
            // 3. return instrumented code
            return new local.Instrumenter({
                coverageVariable: coverageVariable,
                embedSource: true,
                noAutoWrap: true
            }).instrumentSync(code, file);
        };
        local.util = { inherits: nop };
    }());
    switch (local.modeJs) {



    // run browser js-env code - init
    case 'browser':
        // init exports
        local.global.utility2_istanbul = local;
        // init local properties
        local.path = {
            dirname: function (file) {
                return file.replace((/\/[\w\-\.]+?$/), '');
            },
            resolve: function () {
                return arguments[arguments.length - 1];
            }
        };
        break;



    // run node js-env code - init
    case 'node':
        // init exports
        module.exports = module['./lib.istanbul.js'] = local;
        // init local properties
        local._fs = local.require2('fs');
        local.path = local.require2('path');
        break;
    }



/* istanbul ignore next */
// init lib esprima
/* jslint-ignore-begin */
// https://github.com/jquery/esprima/blob/2.5.0/esprima.js
// utility2-uglifyjs https://raw.githubusercontent.com/jquery/esprima/2.5.0/esprima.js
(function () { var exports; exports = local.esprima = {};
(function(e,t){"use strict";typeof define=="function"&&define.amd?define(["exports"],t):typeof exports!="undefined"?t(exports):t(e.esprima={})})(this,function(e){"use strict";function A(e,t){if(!e)throw new Error("ASSERT: "+t)}function O(e){return e>=48&&e<=57
}function M(e){return"0123456789abcdefABCDEF".indexOf(e)>=0}function _(e){return"01234567".indexOf(e)>=0}function D(e){var t=e!=="0",n="01234567".indexOf(e);return c<S&&_(a[c])&&(t=!0,n=n*8+"01234567".indexOf(a[c++]),"0123".indexOf(e)>=0&&c<S&&_(a[c])&&(n=n*8+"01234567"
.indexOf(a[c++]))),{code:n,octal:t}}function P(e){return e===32||e===9||e===11||e===12||e===160||e>=5760&&[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279].indexOf(e)>=0}function H(e){return e===10||e===13||e===8232||e===8233
}function B(e){return e<65536?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10))+String.fromCharCode(56320+(e-65536&1023))}function j(e){return e===36||e===95||e>=65&&e<=90||e>=97&&e<=122||e===92||e>=128&&u.NonAsciiIdentifierStart.test(B(e))}function F
(e){return e===36||e===95||e>=65&&e<=90||e>=97&&e<=122||e>=48&&e<=57||e===92||e>=128&&u.NonAsciiIdentifierPart.test(B(e))}function I(e){switch(e){case"enum":case"export":case"import":case"super":return!0;default:return!1}}function q(e){switch(e){case"implements"
:case"interface":case"package":case"private":case"protected":case"public":case"static":case"yield":case"let":return!0;default:return!1}}function R(e){return e==="eval"||e==="arguments"}function U(e){switch(e.length){case 2:return e==="if"||e==="in"||e==="do"
;case 3:return e==="var"||e==="for"||e==="new"||e==="try"||e==="let";case 4:return e==="this"||e==="else"||e==="case"||e==="void"||e==="with"||e==="enum";case 5:return e==="while"||e==="break"||e==="catch"||e==="throw"||e==="const"||e==="yield"||e==="class"||
e==="super";case 6:return e==="return"||e==="typeof"||e==="delete"||e==="switch"||e==="export"||e==="import";case 7:return e==="default"||e==="finally"||e==="extends";case 8:return e==="function"||e==="continue"||e==="debugger";case 10:return e==="instanceof"
;default:return!1}}function z(e,t,n,r,i){var s;A(typeof n=="number","Comment must have valid position"),T.lastCommentStart=n,s={type:e,value:t},N.range&&(s.range=[n,r]),N.loc&&(s.loc=i),N.comments.push(s),N.attachComment&&(N.leadingComments.push(s),N.trailingComments
.push(s))}function W(e){var t,n,r,i;t=c-e,n={start:{line:h,column:c-p-e}};while(c<S){r=a.charCodeAt(c),++c;if(H(r)){d=!0,N.comments&&(i=a.slice(t+e,c-1),n.end={line:h,column:c-p-1},z("Line",i,t,c-1,n)),r===13&&a.charCodeAt(c)===10&&++c,++h,p=c;return}}N.comments&&
(i=a.slice(t+e,c),n.end={line:h,column:c-p},z("Line",i,t,c,n))}function X(){var e,t,n,r;N.comments&&(e=c-2,t={start:{line:h,column:c-p-2}});while(c<S){n=a.charCodeAt(c);if(H(n))n===13&&a.charCodeAt(c+1)===10&&++c,d=!0,++h,++c,p=c;else if(n===42){if(a.charCodeAt
(c+1)===47){++c,++c,N.comments&&(r=a.slice(e+2,c-2),t.end={line:h,column:c-p},z("Block",r,e,c,t));return}++c}else++c}N.comments&&(t.end={line:h,column:c-p},r=a.slice(e+2,c),z("Block",r,e,c,t)),At()}function V(){var e,t;d=!1,t=c===0;while(c<S){e=a.charCodeAt
(c);if(P(e))++c;else if(H(e))d=!0,++c,e===13&&a.charCodeAt(c)===10&&++c,++h,p=c,t=!0;else if(e===47){e=a.charCodeAt(c+1);if(e===47)++c,++c,W(2),t=!0;else{if(e!==42)break;++c,++c,X()}}else if(t&&e===45){if(a.charCodeAt(c+1)!==45||a.charCodeAt(c+2)!==62)break;
c+=3,W(3)}else{if(e!==60)break;if(a.slice(c+1,c+4)!=="!--")break;++c,++c,++c,++c,W(4)}}}function $(e){var t,n,r,i=0;n=e==="u"?4:2;for(t=0;t<n;++t){if(!(c<S&&M(a[c])))return"";r=a[c++],i=i*16+"0123456789abcdef".indexOf(r.toLowerCase())}return String.fromCharCode
(i)}function J(){var e,t;e=a[c],t=0,e==="}"&&Lt();while(c<S){e=a[c++];if(!M(e))break;t=t*16+"0123456789abcdef".indexOf(e.toLowerCase())}return(t>1114111||e!=="}")&&Lt(),B(t)}function K(e){var t,n,r;return t=a.charCodeAt(e),t>=55296&&t<=56319&&(r=a.charCodeAt
(e+1),r>=56320&&r<=57343&&(n=t,t=(n-55296)*1024+r-56320+65536)),t}function Q(){var e,t,n;e=K(c),n=B(e),c+=n.length,e===92&&(a.charCodeAt(c)!==117&&Lt(),++c,a[c]==="{"?(++c,t=J()):(t=$("u"),e=t.charCodeAt(0),(!t||t==="\\"||!j(e))&&Lt()),n=t);while(c<S){e=K(c
);if(!F(e))break;t=B(e),n+=t,c+=t.length,e===92&&(n=n.substr(0,n.length-1),a.charCodeAt(c)!==117&&Lt(),++c,a[c]==="{"?(++c,t=J()):(t=$("u"),e=t.charCodeAt(0),(!t||t==="\\"||!F(e))&&Lt()),n+=t)}return n}function G(){var e,t;e=c++;while(c<S){t=a.charCodeAt(c)
;if(t===92)return c=e,Q();if(t>=55296&&t<57343)return c=e,Q();if(!F(t))break;++c}return a.slice(e,c)}function Y(){var e,n,r;return e=c,n=a.charCodeAt(c)===92?Q():G(),n.length===1?r=t.Identifier:U(n)?r=t.Keyword:n==="null"?r=t.NullLiteral:n==="true"||n==="false"?
r=t.BooleanLiteral:r=t.Identifier,{type:r,value:n,lineNumber:h,lineStart:p,start:e,end:c}}function Z(){var e,n;e={type:t.Punctuator,value:"",lineNumber:h,lineStart:p,start:c,end:c},n=a[c];switch(n){case"(":N.tokenize&&(N.openParenToken=N.tokens.length),++c;
break;case"{":N.tokenize&&(N.openCurlyToken=N.tokens.length),T.curlyStack.push("{"),++c;break;case".":++c,a[c]==="."&&a[c+1]==="."&&(c+=2,n="...");break;case"}":++c,T.curlyStack.pop();break;case")":case";":case",":case"[":case"]":case":":case"?":case"~":++c
;break;default:n=a.substr(c,4),n===">>>="?c+=4:(n=n.substr(0,3),n==="==="||n==="!=="||n===">>>"||n==="<<="||n===">>="?c+=3:(n=n.substr(0,2),n==="&&"||n==="||"||n==="=="||n==="!="||n==="+="||n==="-="||n==="*="||n==="/="||n==="++"||n==="--"||n==="<<"||n===">>"||
n==="&="||n==="|="||n==="^="||n==="%="||n==="<="||n===">="||n==="=>"?c+=2:(n=a[c],"<>=!+-*%&|^/".indexOf(n)>=0&&++c)))}return c===e.start&&Lt(),e.end=c,e.value=n,e}function et(e){var n="";while(c<S){if(!M(a[c]))break;n+=a[c++]}return n.length===0&&Lt(),j(a.
charCodeAt(c))&&Lt(),{type:t.NumericLiteral,value:parseInt("0x"+n,16),lineNumber:h,lineStart:p,start:e,end:c}}function tt(e){var n,r;r="";while(c<S){n=a[c];if(n!=="0"&&n!=="1")break;r+=a[c++]}return r.length===0&&Lt(),c<S&&(n=a.charCodeAt(c),(j(n)||O(n))&&Lt
()),{type:t.NumericLiteral,value:parseInt(r,2),lineNumber:h,lineStart:p,start:e,end:c}}function nt(e,n){var r,i;_(e)?(i=!0,r="0"+a[c++]):(i=!1,++c,r="");while(c<S){if(!_(a[c]))break;r+=a[c++]}return!i&&r.length===0&&Lt(),(j(a.charCodeAt(c))||O(a.charCodeAt(
c)))&&Lt(),{type:t.NumericLiteral,value:parseInt(r,8),octal:i,lineNumber:h,lineStart:p,start:n,end:c}}function rt(){var e,t;for(e=c+1;e<S;++e){t=a[e];if(t==="8"||t==="9")return!1;if(!_(t))return!0}return!0}function it(){var e,n,r;r=a[c],A(O(r.charCodeAt(0))||
r===".","Numeric literal must start with a decimal digit or a decimal point"),n=c,e="";if(r!=="."){e=a[c++],r=a[c];if(e==="0"){if(r==="x"||r==="X")return++c,et(n);if(r==="b"||r==="B")return++c,tt(n);if(r==="o"||r==="O")return nt(r,n);if(_(r)&&rt())return nt
(r,n)}while(O(a.charCodeAt(c)))e+=a[c++];r=a[c]}if(r==="."){e+=a[c++];while(O(a.charCodeAt(c)))e+=a[c++];r=a[c]}if(r==="e"||r==="E"){e+=a[c++],r=a[c];if(r==="+"||r==="-")e+=a[c++];if(O(a.charCodeAt(c)))while(O(a.charCodeAt(c)))e+=a[c++];else Lt()}return j(a
.charCodeAt(c))&&Lt(),{type:t.NumericLiteral,value:parseFloat(e),lineNumber:h,lineStart:p,start:n,end:c}}function st(){var e="",n,r,i,s,o,u=!1;n=a[c],A(n==="'"||n==='"',"String literal must starts with a quote"),r=c,++c;while(c<S){i=a[c++];if(i===n){n="";break}
if(i==="\\"){i=a[c++];if(!i||!H(i.charCodeAt(0)))switch(i){case"u":case"x":if(a[c]==="{")++c,e+=J();else{s=$(i);if(!s)throw Lt();e+=s}break;case"n":e+="\n";break;case"r":e+="\r";break;case"t":e+="	";break;case"b":e+="\b";break;case"f":e+="\f";break;case"v":
e+="";break;case"8":case"9":e+=i,At();break;default:_(i)?(o=D(i),u=o.octal||u,e+=String.fromCharCode(o.code)):e+=i}else++h,i==="\r"&&a[c]==="\n"&&++c,p=c}else{if(H(i.charCodeAt(0)))break;e+=i}}return n!==""&&Lt(),{type:t.StringLiteral,value:e,octal:u,lineNumber
:b,lineStart:w,start:r,end:c}}function ot(){var e="",n,r,i,s,u,f,l,d;s=!1,f=!1,r=c,u=a[c]==="`",i=2,++c;while(c<S){n=a[c++];if(n==="`"){i=1,f=!0,s=!0;break}if(n==="$"){if(a[c]==="{"){T.curlyStack.push("${"),++c,s=!0;break}e+=n}else if(n==="\\"){n=a[c++];if(!
H(n.charCodeAt(0)))switch(n){case"n":e+="\n";break;case"r":e+="\r";break;case"t":e+="	";break;case"u":case"x":a[c]==="{"?(++c,e+=J()):(l=c,d=$(n),d?e+=d:(c=l,e+=n));break;case"b":e+="\b";break;case"f":e+="\f";break;case"v":e+="";break;default:n==="0"?(O(a.
charCodeAt(c))&&Nt(o.TemplateOctalLiteral),e+="\0"):_(n)?Nt(o.TemplateOctalLiteral):e+=n}else++h,n==="\r"&&a[c]==="\n"&&++c,p=c}else H(n.charCodeAt(0))?(++h,n==="\r"&&a[c]==="\n"&&++c,p=c,e+="\n"):e+=n}return s||Lt(),u||T.curlyStack.pop(),{type:t.Template,value
:{cooked:e,raw:a.slice(r+1,c-i)},head:u,tail:f,lineNumber:h,lineStart:p,start:r,end:c}}function ut(e,t){var n="\uffff",r=e;t.indexOf("u")>=0&&(r=r.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g,function(e,t,r){var i=parseInt(t||r,16);return i>1114111&&
Lt(null,o.InvalidRegExp),i<=65535?String.fromCharCode(i):n}).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,n));try{RegExp(r)}catch(i){Lt(null,o.InvalidRegExp)}try{return new RegExp(e,t)}catch(s){return null}}function at(){var e,t,n,r,i;e=a[c],A(e==="/","Regular expression literal must start with a slash"
),t=a[c++],n=!1,r=!1;while(c<S){e=a[c++],t+=e;if(e==="\\")e=a[c++],H(e.charCodeAt(0))&&Lt(null,o.UnterminatedRegExp),t+=e;else if(H(e.charCodeAt(0)))Lt(null,o.UnterminatedRegExp);else if(n)e==="]"&&(n=!1);else{if(e==="/"){r=!0;break}e==="["&&(n=!0)}}return r||
Lt(null,o.UnterminatedRegExp),i=t.substr(1,t.length-2),{value:i,literal:t}}function ft(){var e,t,n,r;t="",n="";while(c<S){e=a[c];if(!F(e.charCodeAt(0)))break;++c;if(e==="\\"&&c<S){e=a[c];if(e==="u"){++c,r=c,e=$("u");if(e){n+=e;for(t+="\\u";r<c;++r)t+=a[r]}else c=
r,n+="u",t+="\\u";At()}else t+="\\",At()}else n+=e,t+=e}return{value:n,literal:t}}function lt(){E=!0;var e,n,r,i;return x=null,V(),e=c,n=at(),r=ft(),i=ut(n.value,r.value),E=!1,N.tokenize?{type:t.RegularExpression,value:i,regex:{pattern:n.value,flags:r.value
},lineNumber:h,lineStart:p,start:e,end:c}:{literal:n.literal+r.literal,value:i,regex:{pattern:n.value,flags:r.value},start:e,end:c}}function ct(){var e,t,n,r;return V(),e=c,t={start:{line:h,column:c-p}},n=lt(),t.end={line:h,column:c-p},N.tokenize||(N.tokens
.length>0&&(r=N.tokens[N.tokens.length-1],r.range[0]===e&&r.type==="Punctuator"&&(r.value==="/"||r.value==="/=")&&N.tokens.pop()),N.tokens.push({type:"RegularExpression",value:n.literal,regex:n.regex,range:[e,c],loc:t})),n}function ht(e){return e.type===t.Identifier||
e.type===t.Keyword||e.type===t.BooleanLiteral||e.type===t.NullLiteral}function pt(){var e,t;e=N.tokens[N.tokens.length-1];if(!e)return ct();if(e.type==="Punctuator"){if(e.value==="]")return Z();if(e.value===")")return t=N.tokens[N.openParenToken-1],!t||t.type!=="Keyword"||
t.value!=="if"&&t.value!=="while"&&t.value!=="for"&&t.value!=="with"?Z():ct();if(e.value==="}"){if(N.tokens[N.openCurlyToken-3]&&N.tokens[N.openCurlyToken-3].type==="Keyword"){t=N.tokens[N.openCurlyToken-4];if(!t)return Z()}else{if(!N.tokens[N.openCurlyToken-4
]||N.tokens[N.openCurlyToken-4].type!=="Keyword")return Z();t=N.tokens[N.openCurlyToken-5];if(!t)return ct()}return r.indexOf(t.value)>=0?Z():ct()}return ct()}return e.type==="Keyword"&&e.value!=="this"?ct():Z()}function dt(){var e,n;if(c>=S)return{type:t.EOF
,lineNumber:h,lineStart:p,start:c,end:c};e=a.charCodeAt(c);if(j(e))return n=Y(),f&&q(n.value)&&(n.type=t.Keyword),n;if(e===40||e===41||e===59)return Z();if(e===39||e===34)return st();if(e===46)return O(a.charCodeAt(c+1))?it():Z();if(O(e))return it();if(N.tokenize&&
e===47)return pt();if(e===96||e===125&&T.curlyStack[T.curlyStack.length-1]==="${")return ot();if(e>=55296&&e<57343){e=K(c);if(j(e))return Y()}return Z()}function vt(){var e,r,i,s;return e={start:{line:h,column:c-p}},r=dt(),e.end={line:h,column:c-p},r.type!==
t.EOF&&(i=a.slice(r.start,r.end),s={type:n[r.type],value:i,range:[r.start,r.end],loc:e},r.regex&&(s.regex={pattern:r.regex.pattern,flags:r.regex.flags}),N.tokens.push(s)),r}function mt(){var e;return E=!0,v=c,m=h,g=p,V(),e=x,y=c,b=h,w=p,x=typeof N.tokens!="undefined"?
vt():dt(),E=!1,e}function gt(){E=!0,V(),v=c,m=h,g=p,y=c,b=h,w=p,x=typeof N.tokens!="undefined"?vt():dt(),E=!1}function yt(){this.line=b,this.column=y-w}function bt(){this.start=new yt,this.end=null}function wt(e){this.start={line:e.lineNumber,column:e.start-
e.lineStart},this.end=null}function Et(){N.range&&(this.range=[y,0]),N.loc&&(this.loc=new bt)}function St(e){N.range&&(this.range=[e.start,0]),N.loc&&(this.loc=new wt(e))}function xt(e){var t,n;for(t=0;t<N.errors.length;t++){n=N.errors[t];if(n.index===e.index&&
n.message===e.message)return}N.errors.push(e)}function Tt(e,t,n){var r=new Error("Line "+e+": "+n);return r.index=t,r.lineNumber=e,r.column=t-(E?p:g)+1,r.description=n,r}function Nt(e){var t,n;throw t=Array.prototype.slice.call(arguments,1),n=e.replace(/%(\d)/g
,function(e,n){return A(n<t.length,"Message reference must be in range"),t[n]}),Tt(m,v,n)}function Ct(e){var t,n,r;t=Array.prototype.slice.call(arguments,1),n=e.replace(/%(\d)/g,function(e,n){return A(n<t.length,"Message reference must be in range"),t[n]}),
r=Tt(h,v,n);if(!N.errors)throw r;xt(r)}function kt(e,n){var r,i=n||o.UnexpectedToken;return e?(n||(i=e.type===t.EOF?o.UnexpectedEOS:e.type===t.Identifier?o.UnexpectedIdentifier:e.type===t.NumericLiteral?o.UnexpectedNumber:e.type===t.StringLiteral?o.UnexpectedString
:e.type===t.Template?o.UnexpectedTemplate:o.UnexpectedToken,e.type===t.Keyword&&(I(e.value)?i=o.UnexpectedReserved:f&&q(e.value)&&(i=o.StrictReservedWord))),r=e.type===t.Template?e.value.raw:e.value):r="ILLEGAL",i=i.replace("%0",r),e&&typeof e.lineNumber=="number"?
Tt(e.lineNumber,e.start,i):Tt(E?h:m,E?c:v,i)}function Lt(e,t){throw kt(e,t)}function At(e,t){var n=kt(e,t);if(!N.errors)throw n;xt(n)}function Ot(e){var n=mt();(n.type!==t.Punctuator||n.value!==e)&&Lt(n)}function Mt(){var e;N.errors?(e=x,e.type===t.Punctuator&&
e.value===","?mt():e.type===t.Punctuator&&e.value===";"?(mt(),At(e)):At(e,o.UnexpectedToken)):Ot(",")}function _t(e){var n=mt();(n.type!==t.Keyword||n.value!==e)&&Lt(n)}function Dt(e){return x.type===t.Punctuator&&x.value===e}function Pt(e){return x.type===
t.Keyword&&x.value===e}function Ht(e){return x.type===t.Identifier&&x.value===e}function Bt(){var e;return x.type!==t.Punctuator?!1:(e=x.value,e==="="||e==="*="||e==="/="||e==="%="||e==="+="||e==="-="||e==="<<="||e===">>="||e===">>>="||e==="&="||e==="^="||e==="|="
)}function jt(){if(a.charCodeAt(y)===59||Dt(";")){mt();return}if(d)return;v=y,m=b,g=w,x.type!==t.EOF&&!Dt("}")&&Lt(x)}function Ft(e){var t=C,n=k,r=L,i;return C=!0,k=!0,L=null,i=e(),L!==null&&Lt(L),C=t,k=n,L=r,i}function It(e){var t=C,n=k,r=L,i;return C=!0,k=!0
,L=null,i=e(),C=C&&t,k=k&&n,L=r||L,i}function qt(e){var t=new Et,n=[],r,i;Ot("[");while(!Dt("]"))if(Dt(","))mt(),n.push(null);else{if(Dt("...")){i=new Et,mt(),e.push(x),r=kn(e),n.push(i.finishRestElement(r));break}n.push(Wt(e)),Dt("]")||Ot(",")}return Ot("]"
),t.finishArrayPattern(n)}function Rt(e){var n=new Et,r,i,s=Dt("["),o;if(x.type===t.Identifier){i=x,r=kn();if(Dt("="))return e.push(i),mt(),o=Sn(),n.finishProperty("init",r,!1,(new St(i)).finishAssignmentPattern(r,o),!1,!1);if(!Dt(":"))return e.push(i),n.finishProperty
("init",r,!1,r,!1,!0)}else r=Jt(e);return Ot(":"),o=Wt(e),n.finishProperty("init",r,s,o,!1,!1)}function Ut(e){var t=new Et,n=[];Ot("{");while(!Dt("}"))n.push(Rt(e)),Dt("}")||Ot(",");return mt(),t.finishObjectPattern(n)}function zt(e){return Dt("[")?qt(e):Dt
("{")?Ut(e):(e.push(x),kn())}function Wt(e){var t=x,n,r,i;return n=zt(e),Dt("=")&&(mt(),r=T.allowYield,T.allowYield=!0,i=Ft(Sn),T.allowYield=r,n=(new St(t)).finishAssignmentPattern(n,i)),n}function Xt(){var e=[],t=new Et,n;Ot("[");while(!Dt("]"))Dt(",")?(mt
(),e.push(null)):Dt("...")?(n=new Et,mt(),n.finishSpreadElement(It(Sn)),Dt("]")||(k=C=!1,Ot(",")),e.push(n)):(e.push(It(Sn)),Dt("]")||Ot(","));return mt(),t.finishArrayExpression(e)}function Vt(e,t,n){var r,i;return k=C=!1,r=f,i=Ft(Yn),f&&t.firstRestricted&&
At(t.firstRestricted,t.message),f&&t.stricted&&At(t.stricted,t.message),f=r,e.finishFunctionExpression(null,t.params,t.defaults,i,n)}function $t(){var e,t,n=new Et,r=T.allowYield;return T.allowYield=!1,e=tr(),T.allowYield=r,T.allowYield=!1,t=Vt(n,e,!1),T.allowYield=
r,t}function Jt(){var e,n=new Et,r;e=mt();switch(e.type){case t.StringLiteral:case t.NumericLiteral:return f&&e.octal&&At(e,o.StrictOctalLiteral),n.finishLiteral(e);case t.Identifier:case t.BooleanLiteral:case t.NullLiteral:case t.Keyword:return n.finishIdentifier
(e.value);case t.Punctuator:if(e.value==="[")return r=Ft(Sn),Ot("]"),r}Lt(e)}function Kt(){switch(x.type){case t.Identifier:case t.StringLiteral:case t.BooleanLiteral:case t.NullLiteral:case t.NumericLiteral:case t.Keyword:return!0;case t.Punctuator:return x
.value==="["}return!1}function Qt(e,n,r,i){var s,o,u,a,f=T.allowYield;if(e.type===t.Identifier){if(e.value==="get"&&Kt())return r=Dt("["),n=Jt(),u=new Et,Ot("("),Ot(")"),T.allowYield=!1,s=Vt(u,{params:[],defaults:[],stricted:null,firstRestricted:null,message
:null},!1),T.allowYield=f,i.finishProperty("get",n,r,s,!1,!1);if(e.value==="set"&&Kt())return r=Dt("["),n=Jt(),u=new Et,Ot("("),o={params:[],defaultCount:0,defaults:[],firstRestricted:null,paramSet:{}},Dt(")")?At(x):(T.allowYield=!1,er(o),T.allowYield=f,o.defaultCount===0&&
(o.defaults=[])),Ot(")"),T.allowYield=!1,s=Vt(u,o,!1),T.allowYield=f,i.finishProperty("set",n,r,s,!1,!1)}else if(e.type===t.Punctuator&&e.value==="*"&&Kt())return r=Dt("["),n=Jt(),u=new Et,T.allowYield=!0,a=tr(),T.allowYield=f,T.allowYield=!1,s=Vt(u,a,!0),T
.allowYield=f,i.finishProperty("init",n,r,s,!0,!1);return n&&Dt("(")?(s=$t(),i.finishProperty("init",n,r,s,!0,!1)):null}function Gt(e){var n=x,r=new Et,s,u,a,f,l;s=Dt("["),Dt("*")?mt():u=Jt(),a=Qt(n,u,s,r);if(a)return a;u||Lt(x),s||(f=u.type===i.Identifier&&
u.name==="__proto__"||u.type===i.Literal&&u.value==="__proto__",e.value&&f&&Ct(o.DuplicateProtoProperty),e.value|=f);if(Dt(":"))return mt(),l=It(Sn),r.finishProperty("init",u,s,l,!1,!1);if(n.type===t.Identifier)return Dt("=")?(L=x,mt(),l=Ft(Sn),r.finishProperty
("init",u,s,(new St(n)).finishAssignmentPattern(u,l),!1,!0)):r.finishProperty("init",u,s,u,!1,!0);Lt(x)}function Yt(){var e=[],t={value:!1},n=new Et;Ot("{");while(!Dt("}"))e.push(Gt(t)),Dt("}")||Mt();return Ot("}"),n.finishObjectExpression(e)}function Zt(e)
{var t;switch(e.type){case i.Identifier:case i.MemberExpression:case i.RestElement:case i.AssignmentPattern:break;case i.SpreadElement:e.type=i.RestElement,Zt(e.argument);break;case i.ArrayExpression:e.type=i.ArrayPattern;for(t=0;t<e.elements.length;t++)e.elements
[t]!==null&&Zt(e.elements[t]);break;case i.ObjectExpression:e.type=i.ObjectPattern;for(t=0;t<e.properties.length;t++)Zt(e.properties[t].value);break;case i.AssignmentExpression:e.type=i.AssignmentPattern,Zt(e.left);break;default:}}function en(e){var n,r;return(
x.type!==t.Template||e.head&&!x.head)&&Lt(),n=new Et,r=mt(),n.finishTemplateElement({raw:r.value.raw,cooked:r.value.cooked},r.tail)}function tn(){var e,t,n,r=new Et;e=en({head:!0}),t=[e],n=[];while(!e.tail)n.push(xn()),e=en({head:!1}),t.push(e);return r.finishTemplateLiteral
(t,n)}function nn(){var e,t,n,r,o=[];Ot("(");if(Dt(")"))return mt(),Dt("=>")||Ot("=>"),{type:s.ArrowParameterPlaceHolder,params:[],rawParams:[]};n=x;if(Dt("..."))return e=Pn(o),Ot(")"),Dt("=>")||Ot("=>"),{type:s.ArrowParameterPlaceHolder,params:[e]};C=!0,e=
It(Sn);if(Dt(",")){k=!1,t=[e];while(y<S){if(!Dt(","))break;mt();if(Dt("...")){C||Lt(x),t.push(Pn(o)),Ot(")"),Dt("=>")||Ot("=>"),C=!1;for(r=0;r<t.length;r++)Zt(t[r]);return{type:s.ArrowParameterPlaceHolder,params:t}}t.push(It(Sn))}e=(new St(n)).finishSequenceExpression
(t)}Ot(")");if(Dt("=>")){if(e.type===i.Identifier&&e.name==="yield")return{type:s.ArrowParameterPlaceHolder,params:[e]};C||Lt(x);if(e.type===i.SequenceExpression)for(r=0;r<e.expressions.length;r++)Zt(e.expressions[r]);else Zt(e);e={type:s.ArrowParameterPlaceHolder
,params:e.type===i.SequenceExpression?e.expressions:[e]}}return C=!1,e}function rn(){var e,n,r,i;if(Dt("("))return C=!1,It(nn);if(Dt("["))return It(Xt);if(Dt("{"))return It(Yt);e=x.type,i=new Et;if(e===t.Identifier)l==="module"&&x.value==="await"&&At(x),r=i
.finishIdentifier(mt().value);else if(e===t.StringLiteral||e===t.NumericLiteral)k=C=!1,f&&x.octal&&At(x,o.StrictOctalLiteral),r=i.finishLiteral(mt());else if(e===t.Keyword){if(!f&&T.allowYield&&Pt("yield"))return on();k=C=!1;if(Pt("function"))return rr();if(
Pt("this"))return mt(),i.finishThisExpression();if(Pt("class"))return or();Lt(mt())}else e===t.BooleanLiteral?(k=C=!1,n=mt(),n.value=n.value==="true",r=i.finishLiteral(n)):e===t.NullLiteral?(k=C=!1,n=mt(),n.value=null,r=i.finishLiteral(n)):Dt("/")||Dt("/=")?
(k=C=!1,c=y,typeof N.tokens!="undefined"?n=ct():n=lt(),mt(),r=i.finishLiteral(n)):e===t.Template?r=tn():Lt(mt());return r}function sn(){var e=[],t;Ot("(");if(!Dt(")"))while(y<S){Dt("...")?(t=new Et,mt(),t.finishSpreadElement(Ft(Sn))):t=Ft(Sn),e.push(t);if(Dt
(")"))break;Mt()}return Ot(")"),e}function on(){var e,t=new Et;return e=mt(),ht(e)||Lt(e),t.finishIdentifier(e.value)}function un(){return Ot("."),on()}function an(){var e;return Ot("["),e=Ft(xn),Ot("]"),e}function fn(){var e,n,r=new Et;_t("new");if(Dt(".")
){mt();if(x.type===t.Identifier&&x.value==="target"&&T.inFunctionBody)return mt(),r.finishMetaProperty("new","target");Lt(x)}return e=Ft(cn),n=Dt("(")?sn():[],k=C=!1,r.finishNewExpression(e,n)}function ln(){var e,n,r,i,s,o=T.allowIn;s=x,T.allowIn=!0,Pt("super"
)&&T.inFunctionBody?(n=new Et,mt(),n=n.finishSuper(),!Dt("(")&&!Dt(".")&&!Dt("[")&&Lt(x)):n=It(Pt("new")?fn:rn);for(;;)if(Dt("."))C=!1,k=!0,i=un(),n=(new St(s)).finishMemberExpression(".",n,i);else if(Dt("("))C=!1,k=!1,r=sn(),n=(new St(s)).finishCallExpression
(n,r);else if(Dt("["))C=!1,k=!0,i=an(),n=(new St(s)).finishMemberExpression("[",n,i);else{if(x.type!==t.Template||!x.head)break;e=tn(),n=(new St(s)).finishTaggedTemplateExpression(n,e)}return T.allowIn=o,n}function cn(){var e,n,r,i;A(T.allowIn,"callee of new expression always allow in keyword."
),i=x,Pt("super")&&T.inFunctionBody?(n=new Et,mt(),n=n.finishSuper(),!Dt("[")&&!Dt(".")&&Lt(x)):n=It(Pt("new")?fn:rn);for(;;)if(Dt("["))C=!1,k=!0,r=an(),n=(new St(i)).finishMemberExpression("[",n,r);else if(Dt("."))C=!1,k=!0,r=un(),n=(new St(i)).finishMemberExpression
(".",n,r);else{if(x.type!==t.Template||!x.head)break;e=tn(),n=(new St(i)).finishTaggedTemplateExpression(n,e)}return n}function hn(){var e,n,r=x;return e=It(ln),!d&&x.type===t.Punctuator&&(Dt("++")||Dt("--"))&&(f&&e.type===i.Identifier&&R(e.name)&&Ct(o.StrictLHSPostfix
),k||Ct(o.InvalidLHSInAssignment),k=C=!1,n=mt(),e=(new St(r)).finishPostfixExpression(n.value,e)),e}function pn(){var e,n,r;return x.type!==t.Punctuator&&x.type!==t.Keyword?n=hn():Dt("++")||Dt("--")?(r=x,e=mt(),n=It(pn),f&&n.type===i.Identifier&&R(n.name)&&
Ct(o.StrictLHSPrefix),k||Ct(o.InvalidLHSInAssignment),n=(new St(r)).finishUnaryExpression(e.value,n),k=C=!1):Dt("+")||Dt("-")||Dt("~")||Dt("!")?(r=x,e=mt(),n=It(pn),n=(new St(r)).finishUnaryExpression(e.value,n),k=C=!1):Pt("delete")||Pt("void")||Pt("typeof"
)?(r=x,e=mt(),n=It(pn),n=(new St(r)).finishUnaryExpression(e.value,n),f&&n.operator==="delete"&&n.argument.type===i.Identifier&&Ct(o.StrictDelete),k=C=!1):n=hn(),n}function dn(e,n){var r=0;if(e.type!==t.Punctuator&&e.type!==t.Keyword)return 0;switch(e.value
){case"||":r=1;break;case"&&":r=2;break;case"|":r=3;break;case"^":r=4;break;case"&":r=5;break;case"==":case"!=":case"===":case"!==":r=6;break;case"<":case">":case"<=":case">=":case"instanceof":r=7;break;case"in":r=n?7:0;break;case"<<":case">>":case">>>":r=8
;break;case"+":case"-":r=9;break;case"*":case"/":case"%":r=11;break;default:}return r}function vn(){var e,t,n,r,i,s,o,u,a,f;e=x,a=It(pn),r=x,i=dn(r,T.allowIn);if(i===0)return a;k=C=!1,r.prec=i,mt(),t=[e,x],o=Ft(pn),s=[a,r,o];while((i=dn(x,T.allowIn))>0){while(
s.length>2&&i<=s[s.length-2].prec)o=s.pop(),u=s.pop().value,a=s.pop(),t.pop(),n=(new St(t[t.length-1])).finishBinaryExpression(u,a,o),s.push(n);r=mt(),r.prec=i,s.push(r),t.push(x),n=Ft(pn),s.push(n)}f=s.length-1,n=s[f],t.pop();while(f>1)n=(new St(t.pop())).
finishBinaryExpression(s[f-1].value,s[f-2],n),f-=2;return n}function mn(){var e,t,n,r,i;return i=x,e=It(vn),Dt("?")&&(mt(),t=T.allowIn,T.allowIn=!0,n=Ft(Sn),T.allowIn=t,Ot(":"),r=Ft(Sn),e=(new St(i)).finishConditionalExpression(e,n,r),k=C=!1),e}function gn(
){return Dt("{")?Yn():Ft(Sn)}function yn(e,t){var n;switch(t.type){case i.Identifier:Zn(e,t,t.name);break;case i.RestElement:yn(e,t.argument);break;case i.AssignmentPattern:yn(e,t.left);break;case i.ArrayPattern:for(n=0;n<t.elements.length;n++)t.elements[n]!==
null&&yn(e,t.elements[n]);break;case i.YieldExpression:break;default:A(t.type===i.ObjectPattern,"Invalid type");for(n=0;n<t.properties.length;n++)yn(e,t.properties[n].value)}}function bn(e){var t,n,r,u,a,l,c,h;a=[],l=0,u=[e];switch(e.type){case i.Identifier
:break;case s.ArrowParameterPlaceHolder:u=e.params;break;default:return null}c={paramSet:{}};for(t=0,n=u.length;t<n;t+=1){r=u[t];switch(r.type){case i.AssignmentPattern:u[t]=r.left,r.right.type===i.YieldExpression&&(r.right.argument&&Lt(x),r.right.type=i.Identifier
,r.right.name="yield",delete r.right.argument,delete r.right.delegate),a.push(r.right),++l,yn(c,r.left);break;default:yn(c,r),u[t]=r,a.push(null)}}if(f||!T.allowYield)for(t=0,n=u.length;t<n;t+=1)r=u[t],r.type===i.YieldExpression&&Lt(x);return c.message===o.
StrictParamDupe&&(h=f?c.stricted:c.firstRestricted,Lt(h,c.message)),l===0&&(a=[]),{params:u,defaults:a,stricted:c.stricted,firstRestricted:c.firstRestricted,message:c.message}}function wn(e,t){var n,r,s;return d&&At(x),Ot("=>"),n=f,r=T.allowYield,T.allowYield=!0
,s=gn(),f&&e.firstRestricted&&Lt(e.firstRestricted,e.message),f&&e.stricted&&At(e.stricted,e.message),f=n,T.allowYield=r,t.finishArrowFunctionExpression(e.params,e.defaults,s,s.type!==i.BlockStatement)}function En(){var e,n,r,i;return e=null,n=new Et,_t("yield"
),d||(i=T.allowYield,T.allowYield=!1,r=Dt("*"),r?(mt(),e=Sn()):!Dt(";")&&!Dt("}")&&!Dt(")")&&x.type!==t.EOF&&(e=Sn()),T.allowYield=i),n.finishYieldExpression(e,r)}function Sn(){var e,t,n,r,u;return u=x,e=x,!T.allowYield&&Pt("yield")?En():(t=mn(),t.type===s.
ArrowParameterPlaceHolder||Dt("=>")?(k=C=!1,r=bn(t),r?(L=null,wn(r,new St(u))):t):(Bt()&&(k||Ct(o.InvalidLHSInAssignment),f&&t.type===i.Identifier&&R(t.name)&&At(e,o.StrictLHSAssignment),Dt("=")?Zt(t):k=C=!1,e=mt(),n=Ft(Sn),t=(new St(u)).finishAssignmentExpression
(e.value,t,n),L=null),t))}function xn(){var e,t=x,n;e=Ft(Sn);if(Dt(",")){n=[e];while(y<S){if(!Dt(","))break;mt(),n.push(Ft(Sn))}e=(new St(t)).finishSequenceExpression(n)}return e}function Tn(){if(x.type===t.Keyword)switch(x.value){case"export":return l!=="module"&&
At(x,o.IllegalExportDeclaration),hr();case"import":return l!=="module"&&At(x,o.IllegalImportDeclaration),gr();case"const":case"let":return Dn({inFor:!1});case"function":return nr(new Et);case"class":return sr()}return Gn()}function Nn(){var e=[];while(y<S){
if(Dt("}"))break;e.push(Tn())}return e}function Cn(){var e,t=new Et;return Ot("{"),e=Nn(),Ot("}"),t.finishBlockStatement(e)}function kn(){var e,n=new Et;return e=mt(),e.type===t.Keyword&&e.value==="yield"?(f&&At(e,o.StrictReservedWord),T.allowYield||Lt(e)):
e.type!==t.Identifier?f&&e.type===t.Keyword&&q(e.value)?At(e,o.StrictReservedWord):Lt(e):l==="module"&&e.type===t.Identifier&&e.value==="await"&&At(e),n.finishIdentifier(e.value)}function Ln(){var e=null,t,n=new Et,r=[];return t=zt(r),f&&R(t.name)&&Ct(o.StrictVarName
),Dt("=")?(mt(),e=Ft(Sn)):t.type!==i.Identifier&&Ot("="),n.finishVariableDeclarator(t,e)}function An(){var e=[];do{e.push(Ln());if(!Dt(","))break;mt()}while(y<S);return e}function On(e){var t;return _t("var"),t=An(),jt(),e.finishVariableDeclaration(t)}function Mn
(e,t){var n=null,r,s=new Et,u=[];r=zt(u),f&&r.type===i.Identifier&&R(r.name)&&Ct(o.StrictVarName);if(e==="const")!Pt("in")&&!Ht("of")&&(Ot("="),n=Ft(Sn));else if(!t.inFor&&r.type!==i.Identifier||Dt("="))Ot("="),n=Ft(Sn);return s.finishVariableDeclarator(r,n
)}function _n(e,t){var n=[];do{n.push(Mn(e,t));if(!Dt(","))break;mt()}while(y<S);return n}function Dn(e){var t,n,r=new Et;return t=mt().value,A(t==="let"||t==="const","Lexical declaration must be either let or const"),n=_n(t,e),jt(),r.finishLexicalDeclaration
(n,t)}function Pn(e){var t,n=new Et;return mt(),Dt("{")&&Nt(o.ObjectPatternAsRestParameter),e.push(x),t=kn(),Dt("=")&&Nt(o.DefaultRestParameter),Dt(")")||Nt(o.ParameterAfterRestParameter),n.finishRestElement(t)}function Hn(e){return Ot(";"),e.finishEmptyStatement
()}function Bn(e){var t=xn();return jt(),e.finishExpressionStatement(t)}function jn(e){var t,n,r;return _t("if"),Ot("("),t=xn(),Ot(")"),n=Gn(),Pt("else")?(mt(),r=Gn()):r=null,e.finishIfStatement(t,n,r)}function Fn(e){var t,n,r;return _t("do"),r=T.inIteration
,T.inIteration=!0,t=Gn(),T.inIteration=r,_t("while"),Ot("("),n=xn(),Ot(")"),Dt(";")&&mt(),e.finishDoWhileStatement(t,n)}function In(e){var t,n,r;return _t("while"),Ot("("),t=xn(),Ot(")"),r=T.inIteration,T.inIteration=!0,n=Gn(),T.inIteration=r,e.finishWhileStatement
(t,n)}function qn(e){var t,n,r,i,s,u,a,f,l,c,h,p,d=T.allowIn;t=s=u=null,n=!0,_t("for"),Ot("(");if(Dt(";"))mt();else if(Pt("var"))t=new Et,mt(),T.allowIn=!1,t=t.finishVariableDeclaration(An()),T.allowIn=d,t.declarations.length===1&&Pt("in")?(mt(),a=t,f=xn(),
t=null):t.declarations.length===1&&t.declarations[0].init===null&&Ht("of")?(mt(),a=t,f=Sn(),t=null,n=!1):Ot(";");else if(Pt("const")||Pt("let"))t=new Et,l=mt().value,T.allowIn=!1,c=_n(l,{inFor:!0}),T.allowIn=d,c.length===1&&c[0].init===null&&Pt("in")?(t=t.finishLexicalDeclaration
(c,l),mt(),a=t,f=xn(),t=null):c.length===1&&c[0].init===null&&Ht("of")?(t=t.finishLexicalDeclaration(c,l),mt(),a=t,f=Sn(),t=null,n=!1):(jt(),t=t.finishLexicalDeclaration(c,l));else{i=x,T.allowIn=!1,t=It(Sn),T.allowIn=d;if(Pt("in"))k||Ct(o.InvalidLHSInForIn)
,mt(),Zt(t),a=t,f=xn(),t=null;else if(Ht("of"))k||Ct(o.InvalidLHSInForLoop),mt(),Zt(t),a=t,f=Sn(),t=null,n=!1;else{if(Dt(",")){r=[t];while(Dt(","))mt(),r.push(Ft(Sn));t=(new St(i)).finishSequenceExpression(r)}Ot(";")}}return typeof a=="undefined"&&(Dt(";")||
(s=xn()),Ot(";"),Dt(")")||(u=xn())),Ot(")"),p=T.inIteration,T.inIteration=!0,h=Ft(Gn),T.inIteration=p,typeof a=="undefined"?e.finishForStatement(t,s,u,h):n?e.finishForInStatement(a,f,h):e.finishForOfStatement(a,f,h)}function Rn(e){var n=null,r;return _t("continue"
),a.charCodeAt(y)===59?(mt(),T.inIteration||Nt(o.IllegalContinue),e.finishContinueStatement(null)):d?(T.inIteration||Nt(o.IllegalContinue),e.finishContinueStatement(null)):(x.type===t.Identifier&&(n=kn(),r="$"+n.name,Object.prototype.hasOwnProperty.call(T.labelSet
,r)||Nt(o.UnknownLabel,n.name)),jt(),n===null&&!T.inIteration&&Nt(o.IllegalContinue),e.finishContinueStatement(n))}function Un(e){var n=null,r;return _t("break"),a.charCodeAt(v)===59?(mt(),!T.inIteration&&!T.inSwitch&&Nt(o.IllegalBreak),e.finishBreakStatement
(null)):d?(!T.inIteration&&!T.inSwitch&&Nt(o.IllegalBreak),e.finishBreakStatement(null)):(x.type===t.Identifier&&(n=kn(),r="$"+n.name,Object.prototype.hasOwnProperty.call(T.labelSet,r)||Nt(o.UnknownLabel,n.name)),jt(),n===null&&!T.inIteration&&!T.inSwitch&&
Nt(o.IllegalBreak),e.finishBreakStatement(n))}function zn(e){var n=null;return _t("return"),T.inFunctionBody||Ct(o.IllegalReturn),a.charCodeAt(v)===32&&j(a.charCodeAt(v+1))?(n=xn(),jt(),e.finishReturnStatement(n)):d?e.finishReturnStatement(null):(Dt(";")||!
Dt("}")&&x.type!==t.EOF&&(n=xn()),jt(),e.finishReturnStatement(n))}function Wn(e){var t,n;return f&&Ct(o.StrictModeWith),_t("with"),Ot("("),t=xn(),Ot(")"),n=Gn(),e.finishWithStatement(t,n)}function Xn(){var e,t=[],n,r=new Et;Pt("default")?(mt(),e=null):(_t("case"
),e=xn()),Ot(":");while(y<S){if(Dt("}")||Pt("default")||Pt("case"))break;n=Tn(),t.push(n)}return r.finishSwitchCase(e,t)}function Vn(e){var t,n,r,i,s;_t("switch"),Ot("("),t=xn(),Ot(")"),Ot("{"),n=[];if(Dt("}"))return mt(),e.finishSwitchStatement(t,n);i=T.inSwitch
,T.inSwitch=!0,s=!1;while(y<S){if(Dt("}"))break;r=Xn(),r.test===null&&(s&&Nt(o.MultipleDefaultsInSwitch),s=!0),n.push(r)}return T.inSwitch=i,Ot("}"),e.finishSwitchStatement(t,n)}function $n(e){var t;return _t("throw"),d&&Nt(o.NewlineAfterThrow),t=xn(),jt(),
e.finishThrowStatement(t)}function Jn(){var e,t=[],n={},r,i,s,u=new Et;_t("catch"),Ot("("),Dt(")")&&Lt(x),e=zt(t);for(i=0;i<t.length;i++)r="$"+t[i].value,Object.prototype.hasOwnProperty.call(n,r)&&Ct(o.DuplicateBinding,t[i].value),n[r]=!0;return f&&R(e.name
)&&Ct(o.StrictCatchVariable),Ot(")"),s=Cn(),u.finishCatchClause(e,s)}function Kn(e){var t,n=null,r=null;return _t("try"),t=Cn(),Pt("catch")&&(n=Jn()),Pt("finally")&&(mt(),r=Cn()),!n&&!r&&Nt(o.NoCatchOrFinally),e.finishTryStatement(t,n,r)}function Qn(e){return _t
("debugger"),jt(),e.finishDebuggerStatement()}function Gn(){var e=x.type,n,r,s,u;e===t.EOF&&Lt(x);if(e===t.Punctuator&&x.value==="{")return Cn();k=C=!0,u=new Et;if(e===t.Punctuator)switch(x.value){case";":return Hn(u);case"(":return Bn(u);default:}else if(e===
t.Keyword)switch(x.value){case"break":return Un(u);case"continue":return Rn(u);case"debugger":return Qn(u);case"do":return Fn(u);case"for":return qn(u);case"function":return nr(u);case"if":return jn(u);case"return":return zn(u);case"switch":return Vn(u);case"throw"
:return $n(u);case"try":return Kn(u);case"var":return On(u);case"while":return In(u);case"with":return Wn(u);default:}return n=xn(),n.type===i.Identifier&&Dt(":")?(mt(),s="$"+n.name,Object.prototype.hasOwnProperty.call(T.labelSet,s)&&Nt(o.Redeclaration,"Label"
,n.name),T.labelSet[s]=!0,r=Gn(),delete T.labelSet[s],u.finishLabeledStatement(n,r)):(jt(),u.finishExpressionStatement(n))}function Yn(){var e,n=[],r,s,u,l,c,h,p,d,v=new Et;Ot("{");while(y<S){if(x.type!==t.StringLiteral)break;r=x,e=Tn(),n.push(e);if(e.expression
.type!==i.Literal)break;s=a.slice(r.start+1,r.end-1),s==="use strict"?(f=!0,u&&At(u,o.StrictOctalLiteral)):!u&&r.octal&&(u=r)}l=T.labelSet,c=T.inIteration,h=T.inSwitch,p=T.inFunctionBody,d=T.parenthesizedCount,T.labelSet={},T.inIteration=!1,T.inSwitch=!1,T.
inFunctionBody=!0,T.parenthesizedCount=0;while(y<S){if(Dt("}"))break;n.push(Tn())}return Ot("}"),T.labelSet=l,T.inIteration=c,T.inSwitch=h,T.inFunctionBody=p,T.parenthesizedCount=d,v.finishBlockStatement(n)}function Zn(e,t,n){var r="$"+n;f?(R(n)&&(e.stricted=
t,e.message=o.StrictParamName),Object.prototype.hasOwnProperty.call(e.paramSet,r)&&(e.stricted=t,e.message=o.StrictParamDupe)):e.firstRestricted||(R(n)?(e.firstRestricted=t,e.message=o.StrictParamName):q(n)?(e.firstRestricted=t,e.message=o.StrictReservedWord
):Object.prototype.hasOwnProperty.call(e.paramSet,r)&&(e.stricted=t,e.message=o.StrictParamDupe)),e.paramSet[r]=!0}function er(e){var t,n,r=[],s,o;t=x;if(t.value==="...")return n=Pn(r),Zn(e,n.argument,n.argument.name),e.params.push(n),e.defaults.push(null),!1
;n=Wt(r);for(s=0;s<r.length;s++)Zn(e,r[s],r[s].value);return n.type===i.AssignmentPattern&&(o=n.right,n=n.left,++e.defaultCount),e.params.push(n),e.defaults.push(o),!Dt(")")}function tr(e){var t;t={params:[],defaultCount:0,defaults:[],firstRestricted:e},Ot("("
);if(!Dt(")")){t.paramSet={};while(y<S){if(!er(t))break;Ot(",")}}return Ot(")"),t.defaultCount===0&&(t.defaults=[]),{params:t.params,defaults:t.defaults,stricted:t.stricted,firstRestricted:t.firstRestricted,message:t.message}}function nr(e,t){var n=null,r=[
],i=[],s,u,a,l,c,h,p,d,v;v=T.allowYield,_t("function"),d=Dt("*"),d&&mt();if(!t||!Dt("("))u=x,n=kn(),f?R(u.value)&&At(u,o.StrictFunctionName):R(u.value)?(c=u,h=o.StrictFunctionName):q(u.value)&&(c=u,h=o.StrictReservedWord);return T.allowYield=!d,l=tr(c),r=l.
params,i=l.defaults,a=l.stricted,c=l.firstRestricted,l.message&&(h=l.message),p=f,s=Yn(),f&&c&&Lt(c,h),f&&a&&At(a,h),f=p,T.allowYield=v,e.finishFunctionDeclaration(n,r,i,s,d)}function rr(){var e,t=null,n,r,i,s,u=[],a=[],l,c,h=new Et,p,d;return d=T.allowYield
,_t("function"),p=Dt("*"),p&&mt(),T.allowYield=!p,Dt("(")||(e=x,t=!f&&!p&&Pt("yield")?on():kn(),f?R(e.value)&&At(e,o.StrictFunctionName):R(e.value)?(r=e,i=o.StrictFunctionName):q(e.value)&&(r=e,i=o.StrictReservedWord)),s=tr(r),u=s.params,a=s.defaults,n=s.stricted
,r=s.firstRestricted,s.message&&(i=s.message),c=f,l=Yn(),f&&r&&Lt(r,i),f&&n&&At(n,i),f=c,T.allowYield=d,h.finishFunctionExpression(t,u,a,l,p)}function ir(){var e,t,n,r=!1,s,u,a,f;e=new Et,Ot("{"),s=[];while(!Dt("}"))Dt(";")?mt():(u=new Et,t=x,n=!1,a=Dt("[")
,Dt("*")?mt():(f=Jt(),f.name==="static"&&(Kt()||Dt("*"))&&(t=x,n=!0,a=Dt("["),Dt("*")?mt():f=Jt())),u=Qt(t,f,a,u),u?(u["static"]=n,u.kind==="init"&&(u.kind="method"),n?!u.computed&&(u.key.name||u.key.value.toString())==="prototype"&&Lt(t,o.StaticPrototype):!
u.computed&&(u.key.name||u.key.value.toString())==="constructor"&&((u.kind!=="method"||!u.method||u.value.generator)&&Lt(t,o.ConstructorSpecialMethod),r?Lt(t,o.DuplicateConstructor):r=!0,u.kind="constructor"),u.type=i.MethodDefinition,delete u.method,delete
u.shorthand,s.push(u)):Lt(x));return mt(),e.finishClassBody(s)}function sr(e){var n=null,r=null,i=new Et,s,o=f;f=!0,_t("class");if(!e||x.type===t.Identifier)n=kn();return Pt("extends")&&(mt(),r=Ft(ln)),s=ir(),f=o,i.finishClassDeclaration(n,r,s)}function or(
){var e=null,n=null,r=new Et,i,s=f;return f=!0,_t("class"),x.type===t.Identifier&&(e=kn()),Pt("extends")&&(mt(),n=Ft(ln)),i=ir(),f=s,r.finishClassExpression(e,n,i)}function ur(){var e=new Et;return x.type!==t.StringLiteral&&Nt(o.InvalidModuleSpecifier),e.finishLiteral
(mt())}function ar(){var e,t,n=new Et,r;return Pt("default")?(r=new Et,mt(),t=r.finishIdentifier("default")):t=kn(),Ht("as")&&(mt(),e=on()),n.finishExportSpecifier(t,e)}function fr(e){var n=null,r,i=null,s=[];if(x.type===t.Keyword)switch(x.value){case"let":
case"const":case"var":case"class":case"function":return n=Tn(),e.finishExportNamedDeclaration(n,s,null)}Ot("{");while(!Dt("}")){r=r||Pt("default"),s.push(ar());if(!Dt("}")){Ot(",");if(Dt("}"))break}}return Ot("}"),Ht("from")?(mt(),i=ur(),jt()):r?Nt(x.value?
o.UnexpectedToken:o.MissingFromClause,x.value):jt(),e.finishExportNamedDeclaration(n,s,i)}function lr(e){var t=null,n=null;return _t("default"),Pt("function")?(t=nr(new Et,!0),e.finishExportDefaultDeclaration(t)):Pt("class")?(t=sr(!0),e.finishExportDefaultDeclaration
(t)):(Ht("from")&&Nt(o.UnexpectedToken,x.value),Dt("{")?n=Yt():Dt("[")?n=Xt():n=Sn(),jt(),e.finishExportDefaultDeclaration(n))}function cr(e){var t;return Ot("*"),Ht("from")||Nt(x.value?o.UnexpectedToken:o.MissingFromClause,x.value),mt(),t=ur(),jt(),e.finishExportAllDeclaration
(t)}function hr(){var e=new Et;return T.inFunctionBody&&Nt(o.IllegalExportDeclaration),_t("export"),Pt("default")?lr(e):Dt("*")?cr(e):fr(e)}function pr(){var e,t,n=new Et;return t=on(),Ht("as")&&(mt(),e=kn()),n.finishImportSpecifier(e,t)}function dr(){var e=
[];Ot("{");while(!Dt("}")){e.push(pr());if(!Dt("}")){Ot(",");if(Dt("}"))break}}return Ot("}"),e}function vr(){var e,t=new Et;return e=on(),t.finishImportDefaultSpecifier(e)}function mr(){var e,t=new Et;return Ot("*"),Ht("as")||Nt(o.NoAsAfterImportNamespace)
,mt(),e=on(),t.finishImportNamespaceSpecifier(e)}function gr(){var e=[],n,r=new Et;return T.inFunctionBody&&Nt(o.IllegalImportDeclaration),_t("import"),x.type===t.StringLiteral?n=ur():(Dt("{")?e=e.concat(dr()):Dt("*")?e.push(mr()):ht(x)&&!Pt("default")?(e.push
(vr()),Dt(",")&&(mt(),Dt("*")?e.push(mr()):Dt("{")?e=e.concat(dr()):Lt(x))):Lt(mt()),Ht("from")||Nt(x.value?o.UnexpectedToken:o.MissingFromClause,x.value),mt(),n=ur()),jt(),r.finishImportDeclaration(e,n)}function yr(){var e,n=[],r,s,u;while(y<S){r=x;if(r.type!==
t.StringLiteral)break;e=Tn(),n.push(e);if(e.expression.type!==i.Literal)break;s=a.slice(r.start+1,r.end-1),s==="use strict"?(f=!0,u&&At(u,o.StrictOctalLiteral)):!u&&r.octal&&(u=r)}while(y<S){e=Tn();if(typeof e=="undefined")break;n.push(e)}return n}function br
(){var e,t;return gt(),t=new Et,e=yr(),t.finishProgram(e)}function wr(){var e,t,n,r=[];for(e=0;e<N.tokens.length;++e)t=N.tokens[e],n={type:t.type,value:t.value},t.regex&&(n.regex={pattern:t.regex.pattern,flags:t.regex.flags}),N.range&&(n.range=t.range),N.loc&&
(n.loc=t.loc),r.push(n);N.tokens=r}function Er(e,n){var r,i;r=String,typeof e!="string"&&!(e instanceof String)&&(e=r(e)),a=e,c=0,h=a.length>0?1:0,p=0,y=c,b=h,w=p,S=a.length,x=null,T={allowIn:!0,allowYield:!0,labelSet:{},inFunctionBody:!1,inIteration:!1,inSwitch
:!1,lastCommentStart:-1,curlyStack:[]},N={},n=n||{},n.tokens=!0,N.tokens=[],N.tokenize=!0,N.openParenToken=-1,N.openCurlyToken=-1,N.range=typeof n.range=="boolean"&&n.range,N.loc=typeof n.loc=="boolean"&&n.loc,typeof n.comment=="boolean"&&n.comment&&(N.comments=
[]),typeof n.tolerant=="boolean"&&n.tolerant&&(N.errors=[]);try{gt();if(x.type===t.EOF)return N.tokens;mt();while(x.type!==t.EOF)try{mt()}catch(s){if(N.errors){xt(s);break}throw s}wr(),i=N.tokens,typeof N.comments!="undefined"&&(i.comments=N.comments),typeof
N.errors!="undefined"&&(i.errors=N.errors)}catch(o){throw o}finally{N={}}return i}function Sr(e,t){var n,r;r=String,typeof e!="string"&&!(e instanceof String)&&(e=r(e)),a=e,c=0,h=a.length>0?1:0,p=0,y=c,b=h,w=p,S=a.length,x=null,T={allowIn:!0,allowYield:!0,labelSet
:{},inFunctionBody:!1,inIteration:!1,inSwitch:!1,lastCommentStart:-1,curlyStack:[]},l="script",f=!1,N={},typeof t!="undefined"&&(N.range=typeof t.range=="boolean"&&t.range,N.loc=typeof t.loc=="boolean"&&t.loc,N.attachComment=typeof t.attachComment=="boolean"&&
t.attachComment,N.loc&&t.source!==null&&t.source!==undefined&&(N.source=r(t.source)),typeof t.tokens=="boolean"&&t.tokens&&(N.tokens=[]),typeof t.comment=="boolean"&&t.comment&&(N.comments=[]),typeof t.tolerant=="boolean"&&t.tolerant&&(N.errors=[]),N.attachComment&&
(N.range=!0,N.comments=[],N.bottomRightStack=[],N.trailingComments=[],N.leadingComments=[]),t.sourceType==="module"&&(l=t.sourceType,f=!0));try{n=br(),typeof N.comments!="undefined"&&(n.comments=N.comments),typeof N.tokens!="undefined"&&(wr(),n.tokens=N.tokens
),typeof N.errors!="undefined"&&(n.errors=N.errors)}catch(i){throw i}finally{N={}}return n}var t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L;t={BooleanLiteral:1,EOF:2,Identifier:3,Keyword:4,NullLiteral:5,NumericLiteral:6,Punctuator:7,StringLiteral
:8,RegularExpression:9,Template:10},n={},n[t.BooleanLiteral]="Boolean",n[t.EOF]="<end>",n[t.Identifier]="Identifier",n[t.Keyword]="Keyword",n[t.NullLiteral]="Null",n[t.NumericLiteral]="Numeric",n[t.Punctuator]="Punctuator",n[t.StringLiteral]="String",n[t.RegularExpression
]="RegularExpression",n[t.Template]="Template",r=["(","{","[","in","typeof","instanceof","new","return","case","delete","throw","void","=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","&=","|=","^=",",","+","-","*","/","%","++","--","<<",">>",">>>","&","|","^"
,"!","~","&&","||","?",":","===","==",">=","<=","<",">","!=","!=="],i={AssignmentExpression:"AssignmentExpression",AssignmentPattern:"AssignmentPattern",ArrayExpression:"ArrayExpression",ArrayPattern:"ArrayPattern",ArrowFunctionExpression:"ArrowFunctionExpression"
,BlockStatement:"BlockStatement",BinaryExpression:"BinaryExpression",BreakStatement:"BreakStatement",CallExpression:"CallExpression",CatchClause:"CatchClause",ClassBody:"ClassBody",ClassDeclaration:"ClassDeclaration",ClassExpression:"ClassExpression",ConditionalExpression
:"ConditionalExpression",ContinueStatement:"ContinueStatement",DoWhileStatement:"DoWhileStatement",DebuggerStatement:"DebuggerStatement",EmptyStatement:"EmptyStatement",ExportAllDeclaration:"ExportAllDeclaration",ExportDefaultDeclaration:"ExportDefaultDeclaration"
,ExportNamedDeclaration:"ExportNamedDeclaration",ExportSpecifier:"ExportSpecifier",ExpressionStatement:"ExpressionStatement",ForStatement:"ForStatement",ForOfStatement:"ForOfStatement",ForInStatement:"ForInStatement",FunctionDeclaration:"FunctionDeclaration"
,FunctionExpression:"FunctionExpression",Identifier:"Identifier",IfStatement:"IfStatement",ImportDeclaration:"ImportDeclaration",ImportDefaultSpecifier:"ImportDefaultSpecifier",ImportNamespaceSpecifier:"ImportNamespaceSpecifier",ImportSpecifier:"ImportSpecifier"
,Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",MetaProperty:"MetaProperty",MethodDefinition:"MethodDefinition",NewExpression:"NewExpression",ObjectExpression:"ObjectExpression"
,ObjectPattern:"ObjectPattern",Program:"Program",Property:"Property",RestElement:"RestElement",ReturnStatement:"ReturnStatement",SequenceExpression:"SequenceExpression",SpreadElement:"SpreadElement",Super:"Super",SwitchCase:"SwitchCase",SwitchStatement:"SwitchStatement"
,TaggedTemplateExpression:"TaggedTemplateExpression",TemplateElement:"TemplateElement",TemplateLiteral:"TemplateLiteral",ThisExpression:"ThisExpression",ThrowStatement:"ThrowStatement",TryStatement:"TryStatement",UnaryExpression:"UnaryExpression",UpdateExpression
:"UpdateExpression",VariableDeclaration:"VariableDeclaration",VariableDeclarator:"VariableDeclarator",WhileStatement:"WhileStatement",WithStatement:"WithStatement",YieldExpression:"YieldExpression"},s={ArrowParameterPlaceHolder:"ArrowParameterPlaceHolder"},
o={UnexpectedToken:"Unexpected token %0",UnexpectedNumber:"Unexpected number",UnexpectedString:"Unexpected string",UnexpectedIdentifier:"Unexpected identifier",UnexpectedReserved:"Unexpected reserved word",UnexpectedTemplate:"Unexpected quasi %0",UnexpectedEOS
:"Unexpected end of input",NewlineAfterThrow:"Illegal newline after throw",InvalidRegExp:"Invalid regular expression",UnterminatedRegExp:"Invalid regular expression: missing /",InvalidLHSInAssignment:"Invalid left-hand side in assignment",InvalidLHSInForIn:"Invalid left-hand side in for-in"
,InvalidLHSInForLoop:"Invalid left-hand side in for-loop",MultipleDefaultsInSwitch:"More than one default clause in switch statement",NoCatchOrFinally:"Missing catch or finally after try",UnknownLabel:"Undefined label '%0'",Redeclaration:"%0 '%1' has already been declared"
,IllegalContinue:"Illegal continue statement",IllegalBreak:"Illegal break statement",IllegalReturn:"Illegal return statement",StrictModeWith:"Strict mode code may not include a with statement",StrictCatchVariable:"Catch variable may not be eval or arguments in strict mode"
,StrictVarName:"Variable name may not be eval or arguments in strict mode",StrictParamName:"Parameter name eval or arguments is not allowed in strict mode",StrictParamDupe:"Strict mode function may not have duplicate parameter names",StrictFunctionName:"Function name may not be eval or arguments in strict mode"
,StrictOctalLiteral:"Octal literals are not allowed in strict mode.",StrictDelete:"Delete of an unqualified identifier in strict mode.",StrictLHSAssignment:"Assignment to eval or arguments is not allowed in strict mode",StrictLHSPostfix:"Postfix increment/decrement may not have eval or arguments operand in strict mode"
,StrictLHSPrefix:"Prefix increment/decrement may not have eval or arguments operand in strict mode",StrictReservedWord:"Use of future reserved word in strict mode",TemplateOctalLiteral:"Octal literals are not allowed in template strings.",ParameterAfterRestParameter
:"Rest parameter must be last formal parameter",DefaultRestParameter:"Unexpected token =",ObjectPatternAsRestParameter:"Unexpected token {",DuplicateProtoProperty:"Duplicate __proto__ fields are not allowed in object literals",ConstructorSpecialMethod:"Class constructor may not be an accessor"
,DuplicateConstructor:"A class may only have one constructor",StaticPrototype:"Classes may not have static property named prototype",MissingFromClause:"Unexpected token",NoAsAfterImportNamespace:"Unexpected token",InvalidModuleSpecifier:"Unexpected token",IllegalImportDeclaration
:"Unexpected token",IllegalExportDeclaration:"Unexpected token",DuplicateBinding:"Duplicate binding %0"},u={NonAsciiIdentifierStart:/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/
,NonAsciiIdentifierPart:/[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
},St.prototype=Et.prototype={processComment:function(){var e,t,n,r=N.bottomRightStack,s,o,u=r[r.length-1];if(this.type===i.Program&&this.body.length>0)return;if(N.trailingComments.length>0){n=[];for(s=N.trailingComments.length-1;s>=0;--s)o=N.trailingComments
[s],o.range[0]>=this.range[1]&&(n.unshift(o),N.trailingComments.splice(s,1));N.trailingComments=[]}else u&&u.trailingComments&&u.trailingComments[0].range[0]>=this.range[1]&&(n=u.trailingComments,delete u.trailingComments);while(u&&u.range[0]>=this.range[0]
)e=r.pop(),u=r[r.length-1];if(e){if(e.leadingComments){t=[];for(s=e.leadingComments.length-1;s>=0;--s)o=e.leadingComments[s],o.range[1]<=this.range[0]&&(t.unshift(o),e.leadingComments.splice(s,1));e.leadingComments.length||(e.leadingComments=undefined)}}else if(
N.leadingComments.length>0){t=[];for(s=N.leadingComments.length-1;s>=0;--s)o=N.leadingComments[s],o.range[1]<=this.range[0]&&(t.unshift(o),N.leadingComments.splice(s,1))}t&&t.length>0&&(this.leadingComments=t),n&&n.length>0&&(this.trailingComments=n),r.push
(this)},finish:function(){N.range&&(this.range[1]=v),N.loc&&(this.loc.end={line:m,column:v-g},N.source&&(this.loc.source=N.source)),N.attachComment&&this.processComment()},finishArrayExpression:function(e){return this.type=i.ArrayExpression,this.elements=e,
this.finish(),this},finishArrayPattern:function(e){return this.type=i.ArrayPattern,this.elements=e,this.finish(),this},finishArrowFunctionExpression:function(e,t,n,r){return this.type=i.ArrowFunctionExpression,this.id=null,this.params=e,this.defaults=t,this
.body=n,this.generator=!1,this.expression=r,this.finish(),this},finishAssignmentExpression:function(e,t,n){return this.type=i.AssignmentExpression,this.operator=e,this.left=t,this.right=n,this.finish(),this},finishAssignmentPattern:function(e,t){return this
.type=i.AssignmentPattern,this.left=e,this.right=t,this.finish(),this},finishBinaryExpression:function(e,t,n){return this.type=e==="||"||e==="&&"?i.LogicalExpression:i.BinaryExpression,this.operator=e,this.left=t,this.right=n,this.finish(),this},finishBlockStatement
:function(e){return this.type=i.BlockStatement,this.body=e,this.finish(),this},finishBreakStatement:function(e){return this.type=i.BreakStatement,this.label=e,this.finish(),this},finishCallExpression:function(e,t){return this.type=i.CallExpression,this.callee=
e,this.arguments=t,this.finish(),this},finishCatchClause:function(e,t){return this.type=i.CatchClause,this.param=e,this.body=t,this.finish(),this},finishClassBody:function(e){return this.type=i.ClassBody,this.body=e,this.finish(),this},finishClassDeclaration
:function(e,t,n){return this.type=i.ClassDeclaration,this.id=e,this.superClass=t,this.body=n,this.finish(),this},finishClassExpression:function(e,t,n){return this.type=i.ClassExpression,this.id=e,this.superClass=t,this.body=n,this.finish(),this},finishConditionalExpression
:function(e,t,n){return this.type=i.ConditionalExpression,this.test=e,this.consequent=t,this.alternate=n,this.finish(),this},finishContinueStatement:function(e){return this.type=i.ContinueStatement,this.label=e,this.finish(),this},finishDebuggerStatement:function(
){return this.type=i.DebuggerStatement,this.finish(),this},finishDoWhileStatement:function(e,t){return this.type=i.DoWhileStatement,this.body=e,this.test=t,this.finish(),this},finishEmptyStatement:function(){return this.type=i.EmptyStatement,this.finish(),this
},finishExpressionStatement:function(e){return this.type=i.ExpressionStatement,this.expression=e,this.finish(),this},finishForStatement:function(e,t,n,r){return this.type=i.ForStatement,this.init=e,this.test=t,this.update=n,this.body=r,this.finish(),this},finishForOfStatement
:function(e,t,n){return this.type=i.ForOfStatement,this.left=e,this.right=t,this.body=n,this.finish(),this},finishForInStatement:function(e,t,n){return this.type=i.ForInStatement,this.left=e,this.right=t,this.body=n,this.each=!1,this.finish(),this},finishFunctionDeclaration
:function(e,t,n,r,s){return this.type=i.FunctionDeclaration,this.id=e,this.params=t,this.defaults=n,this.body=r,this.generator=s,this.expression=!1,this.finish(),this},finishFunctionExpression:function(e,t,n,r,s){return this.type=i.FunctionExpression,this.id=
e,this.params=t,this.defaults=n,this.body=r,this.generator=s,this.expression=!1,this.finish(),this},finishIdentifier:function(e){return this.type=i.Identifier,this.name=e,this.finish(),this},finishIfStatement:function(e,t,n){return this.type=i.IfStatement,this
.test=e,this.consequent=t,this.alternate=n,this.finish(),this},finishLabeledStatement:function(e,t){return this.type=i.LabeledStatement,this.label=e,this.body=t,this.finish(),this},finishLiteral:function(e){return this.type=i.Literal,this.value=e.value,this
.raw=a.slice(e.start,e.end),e.regex&&(this.regex=e.regex),this.finish(),this},finishMemberExpression:function(e,t,n){return this.type=i.MemberExpression,this.computed=e==="[",this.object=t,this.property=n,this.finish(),this},finishMetaProperty:function(e,t)
{return this.type=i.MetaProperty,this.meta=e,this.property=t,this.finish(),this},finishNewExpression:function(e,t){return this.type=i.NewExpression,this.callee=e,this.arguments=t,this.finish(),this},finishObjectExpression:function(e){return this.type=i.ObjectExpression
,this.properties=e,this.finish(),this},finishObjectPattern:function(e){return this.type=i.ObjectPattern,this.properties=e,this.finish(),this},finishPostfixExpression:function(e,t){return this.type=i.UpdateExpression,this.operator=e,this.argument=t,this.prefix=!1
,this.finish(),this},finishProgram:function(e){return this.type=i.Program,this.body=e,l==="module"&&(this.sourceType=l),this.finish(),this},finishProperty:function(e,t,n,r,s,o){return this.type=i.Property,this.key=t,this.computed=n,this.value=r,this.kind=e,
this.method=s,this.shorthand=o,this.finish(),this},finishRestElement:function(e){return this.type=i.RestElement,this.argument=e,this.finish(),this},finishReturnStatement:function(e){return this.type=i.ReturnStatement,this.argument=e,this.finish(),this},finishSequenceExpression
:function(e){return this.type=i.SequenceExpression,this.expressions=e,this.finish(),this},finishSpreadElement:function(e){return this.type=i.SpreadElement,this.argument=e,this.finish(),this},finishSwitchCase:function(e,t){return this.type=i.SwitchCase,this.
test=e,this.consequent=t,this.finish(),this},finishSuper:function(){return this.type=i.Super,this.finish(),this},finishSwitchStatement:function(e,t){return this.type=i.SwitchStatement,this.discriminant=e,this.cases=t,this.finish(),this},finishTaggedTemplateExpression
:function(e,t){return this.type=i.TaggedTemplateExpression,this.tag=e,this.quasi=t,this.finish(),this},finishTemplateElement:function(e,t){return this.type=i.TemplateElement,this.value=e,this.tail=t,this.finish(),this},finishTemplateLiteral:function(e,t){return this
.type=i.TemplateLiteral,this.quasis=e,this.expressions=t,this.finish(),this},finishThisExpression:function(){return this.type=i.ThisExpression,this.finish(),this},finishThrowStatement:function(e){return this.type=i.ThrowStatement,this.argument=e,this.finish
(),this},finishTryStatement:function(e,t,n){return this.type=i.TryStatement,this.block=e,this.guardedHandlers=[],this.handlers=t?[t]:[],this.handler=t,this.finalizer=n,this.finish(),this},finishUnaryExpression:function(e,t){return this.type=e==="++"||e==="--"?
i.UpdateExpression:i.UnaryExpression,this.operator=e,this.argument=t,this.prefix=!0,this.finish(),this},finishVariableDeclaration:function(e){return this.type=i.VariableDeclaration,this.declarations=e,this.kind="var",this.finish(),this},finishLexicalDeclaration
:function(e,t){return this.type=i.VariableDeclaration,this.declarations=e,this.kind=t,this.finish(),this},finishVariableDeclarator:function(e,t){return this.type=i.VariableDeclarator,this.id=e,this.init=t,this.finish(),this},finishWhileStatement:function(e,
t){return this.type=i.WhileStatement,this.test=e,this.body=t,this.finish(),this},finishWithStatement:function(e,t){return this.type=i.WithStatement,this.object=e,this.body=t,this.finish(),this},finishExportSpecifier:function(e,t){return this.type=i.ExportSpecifier
,this.exported=t||e,this.local=e,this.finish(),this},finishImportDefaultSpecifier:function(e){return this.type=i.ImportDefaultSpecifier,this.local=e,this.finish(),this},finishImportNamespaceSpecifier:function(e){return this.type=i.ImportNamespaceSpecifier,this
.local=e,this.finish(),this},finishExportNamedDeclaration:function(e,t,n){return this.type=i.ExportNamedDeclaration,this.declaration=e,this.specifiers=t,this.source=n,this.finish(),this},finishExportDefaultDeclaration:function(e){return this.type=i.ExportDefaultDeclaration
,this.declaration=e,this.finish(),this},finishExportAllDeclaration:function(e){return this.type=i.ExportAllDeclaration,this.source=e,this.finish(),this},finishImportSpecifier:function(e,t){return this.type=i.ImportSpecifier,this.local=e||t,this.imported=t,this
.finish(),this},finishImportDeclaration:function(e,t){return this.type=i.ImportDeclaration,this.specifiers=e,this.source=t,this.finish(),this},finishYieldExpression:function(e,t){return this.type=i.YieldExpression,this.argument=e,this.delegate=t,this.finish
(),this}},e.version="2.5.0",e.tokenize=Er,e.parse=Sr,e.Syntax=function(){var e,t={};typeof Object.create=="function"&&(t=Object.create(null));for(e in i)i.hasOwnProperty(e)&&(t[e]=i[e]);return typeof Object.freeze=="function"&&Object.freeze(t),t}()})
}());
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib estraverse
/* jslint-ignore-begin */
(function () { var exports; exports = local.estraverse = {};
// https://github.com/estools/estraverse/blob/1.9.3/estraverse.js
// utility2-uglifyjs https://raw.githubusercontent.com/estools/estraverse/1.9.3/estraverse.js
(function(e,t){"use strict";typeof define=="function"&&define.amd?define(["exports"],t):typeof exports!="undefined"?t(exports):t(e.estraverse={})})(this,function e(t){"use strict";function c(){}function h(e){var t={},n,r;for(n in e)e.hasOwnProperty(n)&&(r=e
[n],typeof r=="object"&&r!==null?t[n]=h(r):t[n]=r);return t}function p(e){var t={},n;for(n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function d(e,t){var n,r,i,s;r=e.length,i=0;while(r)n=r>>>1,s=i+n,t(e[s])?r=n:(i=s+1,r-=n+1);return i}function v(e,t){var n
,r,i,s;r=e.length,i=0;while(r)n=r>>>1,s=i+n,t(e[s])?(i=s+1,r-=n+1):r=n;return i}function m(e,t){var n=u(t),r,i,s;for(i=0,s=n.length;i<s;i+=1)r=n[i],e[r]=t[r];return e}function g(e,t){this.parent=e,this.key=t}function y(e,t,n,r){this.node=e,this.path=t,this.
wrap=n,this.ref=r}function b(){}function w(e){return e==null?!1:typeof e=="object"&&typeof e.type=="string"}function E(e,t){return(e===n.ObjectExpression||e===n.ObjectPattern)&&"properties"===t}function S(e,t){var n=new b;return n.traverse(e,t)}function x(e
,t){var n=new b;return n.replace(e,t)}function T(e,t){var n;return n=d(t,function(n){return n.range[0]>e.range[0]}),e.extendedRange=[e.range[0],e.range[1]],n!==t.length&&(e.extendedRange[1]=t[n].range[0]),n-=1,n>=0&&(e.extendedRange[0]=t[n].range[1]),e}function N
(e,t,n){var r=[],s,o,u,a;if(!e.range)throw new Error("attachComments needs range information");if(!n.length){if(t.length){for(u=0,o=t.length;u<o;u+=1)s=h(t[u]),s.extendedRange=[0,e.range[0]],r.push(s);e.leadingComments=r}return e}for(u=0,o=t.length;u<o;u+=1
)r.push(T(h(t[u]),n));return a=0,S(e,{enter:function(e){var t;while(a<r.length){t=r[a];if(t.extendedRange[1]>e.range[0])break;t.extendedRange[1]===e.range[0]?(e.leadingComments||(e.leadingComments=[]),e.leadingComments.push(t),r.splice(a,1)):a+=1}if(a===r.length
)return i.Break;if(r[a].extendedRange[0]>e.range[1])return i.Skip}}),a=0,S(e,{leave:function(e){var t;while(a<r.length){t=r[a];if(e.range[1]<t.extendedRange[0])break;e.range[1]===t.extendedRange[0]?(e.trailingComments||(e.trailingComments=[]),e.trailingComments
.push(t),r.splice(a,1)):a+=1}if(a===r.length)return i.Break;if(r[a].extendedRange[0]>e.range[1])return i.Skip}}),e}var n,r,i,s,o,u,a,f,l;return r=Array.isArray,r||(r=function(t){return Object.prototype.toString.call(t)==="[object Array]"}),c(p),c(v),o=Object
.create||function(){function e(){}return function(t){return e.prototype=t,new e}}(),u=Object.keys||function(e){var t=[],n;for(n in e)t.push(n);return t},n={AssignmentExpression:"AssignmentExpression",ArrayExpression:"ArrayExpression",ArrayPattern:"ArrayPattern"
,ArrowFunctionExpression:"ArrowFunctionExpression",AwaitExpression:"AwaitExpression",BlockStatement:"BlockStatement",BinaryExpression:"BinaryExpression",BreakStatement:"BreakStatement",CallExpression:"CallExpression",CatchClause:"CatchClause",ClassBody:"ClassBody"
,ClassDeclaration:"ClassDeclaration",ClassExpression:"ClassExpression",ComprehensionBlock:"ComprehensionBlock",ComprehensionExpression:"ComprehensionExpression",ConditionalExpression:"ConditionalExpression",ContinueStatement:"ContinueStatement",DebuggerStatement
:"DebuggerStatement",DirectiveStatement:"DirectiveStatement",DoWhileStatement:"DoWhileStatement",EmptyStatement:"EmptyStatement",ExportBatchSpecifier:"ExportBatchSpecifier",ExportDeclaration:"ExportDeclaration",ExportSpecifier:"ExportSpecifier",ExpressionStatement
:"ExpressionStatement",ForStatement:"ForStatement",ForInStatement:"ForInStatement",ForOfStatement:"ForOfStatement",FunctionDeclaration:"FunctionDeclaration",FunctionExpression:"FunctionExpression",GeneratorExpression:"GeneratorExpression",Identifier:"Identifier"
,IfStatement:"IfStatement",ImportDeclaration:"ImportDeclaration",ImportDefaultSpecifier:"ImportDefaultSpecifier",ImportNamespaceSpecifier:"ImportNamespaceSpecifier",ImportSpecifier:"ImportSpecifier",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression
:"LogicalExpression",MemberExpression:"MemberExpression",MethodDefinition:"MethodDefinition",ModuleSpecifier:"ModuleSpecifier",NewExpression:"NewExpression",ObjectExpression:"ObjectExpression",ObjectPattern:"ObjectPattern",Program:"Program",Property:"Property"
,ReturnStatement:"ReturnStatement",SequenceExpression:"SequenceExpression",SpreadElement:"SpreadElement",SwitchStatement:"SwitchStatement",SwitchCase:"SwitchCase",TaggedTemplateExpression:"TaggedTemplateExpression",TemplateElement:"TemplateElement",TemplateLiteral
:"TemplateLiteral",ThisExpression:"ThisExpression",ThrowStatement:"ThrowStatement",TryStatement:"TryStatement",UnaryExpression:"UnaryExpression",UpdateExpression:"UpdateExpression",VariableDeclaration:"VariableDeclaration",VariableDeclarator:"VariableDeclarator"
,WhileStatement:"WhileStatement",WithStatement:"WithStatement",YieldExpression:"YieldExpression"},s={AssignmentExpression:["left","right"],ArrayExpression:["elements"],ArrayPattern:["elements"],ArrowFunctionExpression:["params","defaults","rest","body"],AwaitExpression
:["argument"],BlockStatement:["body"],BinaryExpression:["left","right"],BreakStatement:["label"],CallExpression:["callee","arguments"],CatchClause:["param","body"],ClassBody:["body"],ClassDeclaration:["id","body","superClass"],ClassExpression:["id","body","superClass"
],ComprehensionBlock:["left","right"],ComprehensionExpression:["blocks","filter","body"],ConditionalExpression:["test","consequent","alternate"],ContinueStatement:["label"],DebuggerStatement:[],DirectiveStatement:[],DoWhileStatement:["body","test"],EmptyStatement
:[],ExportBatchSpecifier:[],ExportDeclaration:["declaration","specifiers","source"],ExportSpecifier:["id","name"],ExpressionStatement:["expression"],ForStatement:["init","test","update","body"],ForInStatement:["left","right","body"],ForOfStatement:["left","right"
,"body"],FunctionDeclaration:["id","params","defaults","rest","body"],FunctionExpression:["id","params","defaults","rest","body"],GeneratorExpression:["blocks","filter","body"],Identifier:[],IfStatement:["test","consequent","alternate"],ImportDeclaration:["specifiers"
,"source"],ImportDefaultSpecifier:["id"],ImportNamespaceSpecifier:["id"],ImportSpecifier:["id","name"],Literal:[],LabeledStatement:["label","body"],LogicalExpression:["left","right"],MemberExpression:["object","property"],MethodDefinition:["key","value"],ModuleSpecifier
:[],NewExpression:["callee","arguments"],ObjectExpression:["properties"],ObjectPattern:["properties"],Program:["body"],Property:["key","value"],ReturnStatement:["argument"],SequenceExpression:["expressions"],SpreadElement:["argument"],SwitchStatement:["discriminant"
,"cases"],SwitchCase:["test","consequent"],TaggedTemplateExpression:["tag","quasi"],TemplateElement:[],TemplateLiteral:["quasis","expressions"],ThisExpression:[],ThrowStatement:["argument"],TryStatement:["block","handlers","handler","guardedHandlers","finalizer"
],UnaryExpression:["argument"],UpdateExpression:["argument"],VariableDeclaration:["declarations"],VariableDeclarator:["id","init"],WhileStatement:["test","body"],WithStatement:["object","body"],YieldExpression:["argument"]},a={},f={},l={},i={Break:a,Skip:f,
Remove:l},g.prototype.replace=function(t){this.parent[this.key]=t},g.prototype.remove=function(){return r(this.parent)?(this.parent.splice(this.key,1),!0):(this.replace(null),!1)},b.prototype.path=function(){function a(e,t){if(r(t))for(i=0,s=t.length;i<s;++
i)e.push(t[i]);else e.push(t)}var t,n,i,s,o,u;if(!this.__current.path)return null;o=[];for(t=2,n=this.__leavelist.length;t<n;++t)u=this.__leavelist[t],a(o,u.path);return a(o,this.__current.path),o},b.prototype.type=function(){var e=this.current();return e.type||
this.__current.wrap},b.prototype.parents=function(){var t,n,r;r=[];for(t=1,n=this.__leavelist.length;t<n;++t)r.push(this.__leavelist[t].node);return r},b.prototype.current=function(){return this.__current.node},b.prototype.__execute=function(t,n){var r,i;return i=
undefined,r=this.__current,this.__current=n,this.__state=null,t&&(i=t.call(this,n.node,this.__leavelist[this.__leavelist.length-1].node)),this.__current=r,i},b.prototype.notify=function(t){this.__state=t},b.prototype.skip=function(){this.notify(f)},b.prototype
["break"]=function(){this.notify(a)},b.prototype.remove=function(){this.notify(l)},b.prototype.__initialize=function(e,t){this.visitor=t,this.root=e,this.__worklist=[],this.__leavelist=[],this.__current=null,this.__state=null,this.__fallback=t.fallback==="iteration"
,this.__keys=s,t.keys&&(this.__keys=m(o(this.__keys),t.keys))},b.prototype.traverse=function(t,n){var i,s,o,l,c,h,p,d,v,m,g,b;this.__initialize(t,n),b={},i=this.__worklist,s=this.__leavelist,i.push(new y(t,null,null,null)),s.push(new y(null,null,null,null))
;while(i.length){o=i.pop();if(o===b){o=s.pop(),h=this.__execute(n.leave,o);if(this.__state===a||h===a)return;continue}if(o.node){h=this.__execute(n.enter,o);if(this.__state===a||h===a)return;i.push(b),s.push(o);if(this.__state===f||h===f)continue;l=o.node,c=
o.wrap||l.type,m=this.__keys[c];if(!m){if(!this.__fallback)throw new Error("Unknown node type "+c+".");m=u(l)}d=m.length;while((d-=1)>=0){p=m[d],g=l[p];if(!g)continue;if(r(g)){v=g.length;while((v-=1)>=0){if(!g[v])continue;if(E(c,m[d]))o=new y(g[v],[p,v],"Property"
,null);else{if(!w(g[v]))continue;o=new y(g[v],[p,v],null,null)}i.push(o)}}else w(g)&&i.push(new y(g,p,null,null))}}}},b.prototype.replace=function(t,n){function i(e){var t,n,r,i;if(e.ref.remove()){n=e.ref.key,i=e.ref.parent,t=s.length;while(t--){r=s[t];if(r
.ref&&r.ref.parent===i){if(r.ref.key<n)break;--r.ref.key}}}}var s,o,c,h,p,d,v,m,b,S,x,T,N;this.__initialize(t,n),x={},s=this.__worklist,o=this.__leavelist,T={root:t},d=new y(t,null,null,new g(T,"root")),s.push(d),o.push(d);while(s.length){d=s.pop();if(d===x
){d=o.pop(),p=this.__execute(n.leave,d),p!==undefined&&p!==a&&p!==f&&p!==l&&d.ref.replace(p),(this.__state===l||p===l)&&i(d);if(this.__state===a||p===a)return T.root;continue}p=this.__execute(n.enter,d),p!==undefined&&p!==a&&p!==f&&p!==l&&(d.ref.replace(p),
d.node=p);if(this.__state===l||p===l)i(d),d.node=null;if(this.__state===a||p===a)return T.root;c=d.node;if(!c)continue;s.push(x),o.push(d);if(this.__state===f||p===f)continue;h=d.wrap||c.type,b=this.__keys[h];if(!b){if(!this.__fallback)throw new Error("Unknown node type "+
h+".");b=u(c)}v=b.length;while((v-=1)>=0){N=b[v],S=c[N];if(!S)continue;if(r(S)){m=S.length;while((m-=1)>=0){if(!S[m])continue;if(E(h,b[v]))d=new y(S[m],[N,m],"Property",new g(S,m));else{if(!w(S[m]))continue;d=new y(S[m],[N,m],null,new g(S,m))}s.push(d)}}else w
(S)&&s.push(new y(S,N,null,new g(c,N)))}}return T.root},t.version="1.8.1-dev",t.Syntax=n,t.traverse=S,t.replace=x,t.attachComments=N,t.VisitorKeys=s,t.VisitorOption=i,t.Controller=b,t.cloneEnvironment=function(){return e({})},t})
}());
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib esutils.code
/* jslint-ignore-begin */
// https://github.com/estools/esutils/blob/2.0.2/lib/code.js
// utility2-uglifyjs https://raw.githubusercontent.com/estools/esutils/2.0.2/lib/code.js
(function () { var module; module = {};
(function(){"use strict";function o(e){return 48<=e&&e<=57}function u(e){return 48<=e&&e<=57||97<=e&&e<=102||65<=e&&e<=70}function a(e){return e>=48&&e<=55}function f(e){return e===32||e===9||e===11||e===12||e===160||e>=5760&&n.indexOf(e)>=0}function l(e){return e===10||
e===13||e===8232||e===8233}function c(e){if(e<=65535)return String.fromCharCode(e);var t=String.fromCharCode(Math.floor((e-65536)/1024)+55296),n=String.fromCharCode((e-65536)%1024+56320);return t+n}function h(e){return e<128?r[e]:t.NonAsciiIdentifierStart.test
(c(e))}function p(e){return e<128?i[e]:t.NonAsciiIdentifierPart.test(c(e))}function d(t){return t<128?r[t]:e.NonAsciiIdentifierStart.test(c(t))}function v(t){return t<128?i[t]:e.NonAsciiIdentifierPart.test(c(t))}var e,t,n,r,i,s;t={NonAsciiIdentifierStart:/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
,NonAsciiIdentifierPart:/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
},e={NonAsciiIdentifierStart:/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/
,NonAsciiIdentifierPart:/[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
},n=[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279],r=new Array(128);for(s=0;s<128;++s)r[s]=s>=97&&s<=122||s>=65&&s<=90||s===36||s===95;i=new Array(128);for(s=0;s<128;++s)i[s]=s>=97&&s<=122||s>=65&&s<=90||s>=48&&s<=57||
s===36||s===95;module.exports={isDecimalDigit:o,isHexDigit:u,isOctalDigit:a,isWhiteSpace:f,isLineTerminator:l,isIdentifierStartES5:h,isIdentifierPartES5:p,isIdentifierStartES6:d,isIdentifierPartES6:v}})()
local.esutils = { code: module.exports }; }());
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib escodegen
/* jslint-ignore-begin */
// https://github.com/estools/escodegen/blob/1.7.1/escodegen.js
// utility2-uglifyjs https://raw.githubusercontent.com/estools/escodegen/1.7.1/escodegen.js
(function () { var exports; exports = local.escodegen = {};
(function(){"use strict";function k(e){return bt.Expression.hasOwnProperty(e.type)}function L(e){return bt.Statement.hasOwnProperty(e.type)}function V(){return{indent:null,base:null,parse:null,comment:!1,format:{indent:{style:"    ",base:0,adjustMultilineComment
:!1},newline:"\n",space:" ",json:!1,renumber:!1,hexadecimal:!1,quotes:"single",escapeless:!1,compact:!1,parentheses:!0,semicolons:!0,safeConcatenation:!1,preserveBlankLines:!1},moz:{comprehensionExpressionStartsWithAssignment:!1,starlessGenerator:!1},sourceMap
:null,sourceMapRoot:null,sourceMapWithCode:!1,directive:!1,raw:!0,verbatim:null,sourceCode:null}}function $(e,t){var n="";for(t|=0;t>0;t>>>=1,e+=e)t&1&&(n+=e);return n}function J(e){return/[\r\n]/g.test(e)}function K(e){var t=e.length;return t&&s.code.isLineTerminator
(e.charCodeAt(t-1))}function Q(e,t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function G(e,t){function i(e){return typeof e=="object"&&e instanceof Object&&!(e instanceof RegExp)}var n,r;for(n in t)t.hasOwnProperty(n)&&(r=t[n],i(r)?i(e[n])?
G(e[n],r):e[n]=G({},r):e[n]=r);return e}function Y(e){var t,n,r,i,s;if(e!==e)throw new Error("Numeric literal whose value is NaN");if(e<0||e===0&&1/e<0)throw new Error("Numeric literal whose value is negative");if(e===1/0)return f?"null":l?"1e400":"1e+400";
t=""+e;if(!l||t.length<3)return t;n=t.indexOf("."),!f&&t.charCodeAt(0)===48&&n===1&&(n=0,t=t.slice(1)),r=t,t=t.replace("e+","e"),i=0,(s=r.indexOf("e"))>0&&(i=+r.slice(s+1),r=r.slice(0,s)),n>=0&&(i-=r.length-n-1,r=+(r.slice(0,n)+r.slice(n+1))+""),s=0;while(r
.charCodeAt(r.length+s-1)===48)--s;return s!==0&&(i-=s,r=r.slice(0,s)),i!==0&&(r+="e"+i),(r.length<t.length||c&&e>1e12&&Math.floor(e)===e&&(r="0x"+e.toString(16)).length<t.length)&&+r===e&&(t=r),t}function Z(e,t){return(e&-2)===8232?(t?"u":"\\u")+(e===8232?"2028"
:"2029"):e===10||e===13?(t?"":"\\")+(e===10?"n":"r"):String.fromCharCode(e)}function et(e){var t,n,r,i,s,o,u,a;n=e.toString();if(e.source){t=n.match(/\/([^/]*)$/);if(!t)return n;r=t[1],n="",u=!1,a=!1;for(i=0,s=e.source.length;i<s;++i)o=e.source.charCodeAt(i
),a?(n+=Z(o,a),a=!1):(u?o===93&&(u=!1):o===47?n+="\\":o===91&&(u=!0),n+=Z(o,a),a=o===92);return"/"+n+"/"+r}return n}function tt(e,t){var n;return e===8?"\\b":e===12?"\\f":e===9?"\\t":(n=e.toString(16).toUpperCase(),f||e>255?"\\u"+"0000".slice(n.length)+n:e===0&&!
s.code.isDecimalDigit(t)?"\\0":e===11?"\\x0B":"\\x"+"00".slice(n.length)+n)}function nt(e){if(e===92)return"\\\\";if(e===10)return"\\n";if(e===13)return"\\r";if(e===8232)return"\\u2028";if(e===8233)return"\\u2029";throw new Error("Incorrectly classified character"
)}function rt(e){var t,n,r,i;i=h==="double"?'"':"'";for(t=0,n=e.length;t<n;++t){r=e.charCodeAt(t);if(r===39){i='"';break}if(r===34){i="'";break}r===92&&++t}return i+e+i}function it(e){var t="",n,r,i,o=0,u=0,a,l;for(n=0,r=e.length;n<r;++n){i=e.charCodeAt(n);
if(i===39)++o;else if(i===34)++u;else if(i===47&&f)t+="\\";else{if(s.code.isLineTerminator(i)||i===92){t+=nt(i);continue}if(!s.code.isIdentifierPartES5(i)&&(f&&i<32||!f&&!p&&(i<32||i>126))){t+=tt(i,e.charCodeAt(n+1));continue}}t+=String.fromCharCode(i)}a=!(
h==="double"||h==="auto"&&u<o),l=a?"'":'"';if(a?!o:!u)return l+t+l;e=t,t=l;for(n=0,r=e.length;n<r;++n){i=e.charCodeAt(n);if(i===39&&a||i===34&&!a)t+="\\";t+=String.fromCharCode(i)}return t+l}function st(e){var t,n,r,i="";for(t=0,n=e.length;t<n;++t)r=e[t],i+=
o(r)?st(r):r;return i}function ot(e,t){if(!S)return o(e)?st(e):e;if(t==null){if(e instanceof r)return e;t={}}return t.loc==null?new r(null,null,S,e,t.name||null):new r(t.loc.start.line,t.loc.start.column,S===!0?t.loc.source||null:S,e,t.name||null)}function ut
(){return v?v:" "}function at(e,t){var n,r,i,o;return n=ot(e).toString(),n.length===0?[t]:(r=ot(t).toString(),r.length===0?[e]:(i=n.charCodeAt(n.length-1),o=r.charCodeAt(0),(i===43||i===45)&&i===o||s.code.isIdentifierPartES5(i)&&s.code.isIdentifierPartES5(o
)||i===47&&o===105?[e,ut(),t]:s.code.isWhiteSpace(i)||s.code.isLineTerminator(i)||s.code.isWhiteSpace(o)||s.code.isLineTerminator(o)?[e,t]:[e,v,t]))}function ft(e){return[u,e]}function lt(e){var t;t=u,u+=a,e(u),u=t}function ct(e){var t;for(t=e.length-1;t>=0
;--t)if(s.code.isLineTerminator(e.charCodeAt(t)))break;return e.length-1-t}function ht(e,t){var n,r,i,o,a,f,l,c;n=e.split(/\r\n|[\r\n]/),f=Number.MAX_VALUE;for(r=1,i=n.length;r<i;++r){o=n[r],a=0;while(a<o.length&&s.code.isWhiteSpace(o.charCodeAt(a)))++a;f>a&&
(f=a)}typeof t!="undefined"?(l=u,n[1][f]==="*"&&(t+=" "),u=t):(f&1&&--f,l=u);for(r=1,i=n.length;r<i;++r)c=ot(ft(n[r].slice(f))),n[r]=S?c.join(""):c;return u=l,n.join("\n")}function pt(e,t){if(e.type==="Line"){if(K(e.value))return"//"+e.value;var n="//"+e.value
;return T||(n+="\n"),n}return w.format.indent.adjustMultilineComment&&/[\n\r]/.test(e.value)?ht("/*"+e.value+"*/",t):"/*"+e.value+"*/"}function dt(t,n){var r,i,s,o,f,l,c,h,p,d,v,m,g,b;if(t.leadingComments&&t.leadingComments.length>0){o=n;if(T){s=t.leadingComments
[0],n=[],h=s.extendedRange,p=s.range,v=x.substring(h[0],p[0]),b=(v.match(/\n/g)||[]).length,b>0?(n.push($("\n",b)),n.push(ft(pt(s)))):(n.push(v),n.push(pt(s))),d=p;for(r=1,i=t.leadingComments.length;r<i;r++)s=t.leadingComments[r],p=s.range,m=x.substring(d[1
],p[0]),b=(m.match(/\n/g)||[]).length,n.push($("\n",b)),n.push(ft(pt(s))),d=p;g=x.substring(p[1],h[1]),b=(g.match(/\n/g)||[]).length,n.push($("\n",b))}else{s=t.leadingComments[0],n=[],y&&t.type===e.Program&&t.body.length===0&&n.push("\n"),n.push(pt(s)),K(ot
(n).toString())||n.push("\n");for(r=1,i=t.leadingComments.length;r<i;++r)s=t.leadingComments[r],c=[pt(s)],K(ot(c).toString())||c.push("\n"),n.push(ft(c))}n.push(ft(o))}if(t.trailingComments)if(T)s=t.trailingComments[0],h=s.extendedRange,p=s.range,v=x.substring
(h[0],p[0]),b=(v.match(/\n/g)||[]).length,b>0?(n.push($("\n",b)),n.push(ft(pt(s)))):(n.push(v),n.push(pt(s)));else{f=!K(ot(n).toString()),l=$(" ",ct(ot([u,n,a]).toString()));for(r=0,i=t.trailingComments.length;r<i;++r)s=t.trailingComments[r],f?(r===0?n=[n,a
]:n=[n,l],n.push(pt(s,l))):n=[n,ft(pt(s))],r!==i-1&&!K(ot(n).toString())&&(n=[n,"\n"])}return n}function vt(e,t,n){var r,i=0;for(r=e;r<t;r++)x[r]==="\n"&&i++;for(r=1;r<i;r++)n.push(d)}function mt(e,t,n){return t<n?["(",e,")"]:e}function gt(e){var t,n,r;r=e.
split(/\r\n|\n/);for(t=1,n=r.length;t<n;t++)r[t]=d+u+r[t];return r}function yt(e,n){var r,i,s;return r=e[w.verbatim],typeof r=="string"?i=mt(gt(r),t.Sequence,n):(i=gt(r.content),s=r.precedence!=null?r.precedence:t.Sequence,i=mt(i,s,n)),ot(i,e)}function bt()
{}function wt(e){return ot(e.name,e)}function Et(e,t){return e.async?"async"+(t?ut():v):""}function St(e){var t=e.generator&&!w.moz.starlessGenerator;return t?"*"+v:""}function xt(e){var t=e.value;return t.async?Et(t,!e.computed):St(t)?"*":""}function Tt(e)
{var n;n=new bt;if(L(e))return n.generateStatement(e,R);if(k(e))return n.generateExpression(e,t.Sequence,j);throw new Error("Unknown node type: "+e.type)}function Nt(e,t){var n=V(),i,s;return t!=null?(typeof t.indent=="string"&&(n.format.indent.style=t.indent
),typeof t.base=="number"&&(n.format.indent.base=t.base),t=G(n,t),a=t.format.indent.style,typeof t.base=="string"?u=t.base:u=$(a,t.format.indent.base)):(t=n,a=t.format.indent.style,u=$(a,t.format.indent.base)),f=t.format.json,l=t.format.renumber,c=f?!1:t.format
.hexadecimal,h=f?"double":t.format.quotes,p=t.format.escapeless,d=t.format.newline,v=t.format.space,t.format.compact&&(d=v=a=u=""),m=t.format.parentheses,g=t.format.semicolons,y=t.format.safeConcatenation,b=t.directive,E=f?null:t.parse,S=t.sourceMap,x=t.sourceCode
,T=t.format.preserveBlankLines&&x!==null,w=t,S&&(exports.browser?r=global.sourceMap.SourceNode:r=require("source-map").SourceNode),i=Tt(e),S?(s=i.toStringWithSourceMap({file:t.file,sourceRoot:t.sourceMapRoot}),t.sourceContent&&s.map.setSourceContent(t.sourceMap
,t.sourceContent),t.sourceMapWithCode?s:s.map.toString()):(s={code:i.toString(),map:null},t.sourceMapWithCode?s:s.code)}var e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C;i=require("estraverse"),s=require("esutils"),e=i.Syntax,t={Sequence:0,Yield:1,Await
:1,Assignment:1,Conditional:2,ArrowFunction:2,LogicalOR:3,LogicalAND:4,BitwiseOR:5,BitwiseXOR:6,BitwiseAND:7,Equality:8,Relational:9,BitwiseSHIFT:10,Additive:11,Multiplicative:12,Unary:13,Postfix:14,Call:15,New:16,TaggedTemplate:17,Member:18,Primary:19},n={"||"
:t.LogicalOR,"&&":t.LogicalAND,"|":t.BitwiseOR,"^":t.BitwiseXOR,"&":t.BitwiseAND,"==":t.Equality,"!=":t.Equality,"===":t.Equality,"!==":t.Equality,is:t.Equality,isnt:t.Equality,"<":t.Relational,">":t.Relational,"<=":t.Relational,">=":t.Relational,"in":t.Relational
,"instanceof":t.Relational,"<<":t.BitwiseSHIFT,">>":t.BitwiseSHIFT,">>>":t.BitwiseSHIFT,"+":t.Additive,"-":t.Additive,"*":t.Multiplicative,"%":t.Multiplicative,"/":t.Multiplicative};var A=1,O=2,M=4,_=8,D=16,P=32,H=O|M,B=A|O,j=A|O|M,F=A,I=M,q=A|M,R=A,U=A|P,z=0
,W=A|D,X=A|_;o=Array.isArray,o||(o=function(t){return Object.prototype.toString.call(t)==="[object Array]"}),bt.prototype.maybeBlock=function(t,n){var r,i,s=this;return i=!w.comment||!t.leadingComments,t.type===e.BlockStatement&&i?[v,this.generateStatement(
t,n)]:t.type===e.EmptyStatement&&i?";":(lt(function(){r=[d,ft(s.generateStatement(t,n))]}),r)},bt.prototype.maybeBlockSuffix=function(t,n){var r=K(ot(n).toString());return t.type===e.BlockStatement&&(!w.comment||!t.leadingComments)&&!r?[n,v]:r?[n,u]:[n,d,u]
},bt.prototype.generatePattern=function(t,n,r){return t.type===e.Identifier?wt(t):this.generateExpression(t,n,r)},bt.prototype.generateFunctionParams=function(n){var r,i,s,o;o=!1;if(n.type===e.ArrowFunctionExpression&&!n.rest&&(!n.defaults||n.defaults.length===0
)&&n.params.length===1&&n.params[0].type===e.Identifier)s=[Et(n,!0),wt(n.params[0])];else{s=n.type===e.ArrowFunctionExpression?[Et(n,!1)]:[],s.push("("),n.defaults&&(o=!0);for(r=0,i=n.params.length;r<i;++r)o&&n.defaults[r]?s.push(this.generateAssignment(n.params
[r],n.defaults[r],"=",t.Assignment,j)):s.push(this.generatePattern(n.params[r],t.Assignment,j)),r+1<i&&s.push(","+v);n.rest&&(n.params.length&&s.push(","+v),s.push("..."),s.push(wt(n.rest))),s.push(")")}return s},bt.prototype.generateFunctionBody=function(n
){var r,i;return r=this.generateFunctionParams(n),n.type===e.ArrowFunctionExpression&&(r.push(v),r.push("=>")),n.expression?(r.push(v),i=this.generateExpression(n.body,t.Assignment,j),i.toString().charAt(0)==="{"&&(i=["(",i,")"]),r.push(i)):r.push(this.maybeBlock
(n.body,X)),r},bt.prototype.generateIterationForStatement=function(n,r,i){var s=["for"+v+"("],o=this;return lt(function(){r.left.type===e.VariableDeclaration?lt(function(){s.push(r.left.kind+ut()),s.push(o.generateStatement(r.left.declarations[0],z))}):s.push
(o.generateExpression(r.left,t.Call,j)),s=at(s,n),s=[at(s,o.generateExpression(r.right,t.Sequence,j)),")"]}),s.push(this.maybeBlock(r.body,i)),s},bt.prototype.generatePropertyKey=function(e,n){var r=[];return n&&r.push("["),r.push(this.generateExpression(e,
t.Sequence,j)),n&&r.push("]"),r},bt.prototype.generateAssignment=function(e,n,r,i,s){return t.Assignment<i&&(s|=A),mt([this.generateExpression(e,t.Call,s),v+r+v,this.generateExpression(n,t.Assignment,s)],t.Assignment,i)},bt.prototype.semicolon=function(e){return!
g&&e&P?"":";"},bt.Statement={BlockStatement:function(e,t){var n,r,i=["{",d],s=this;return lt(function(){e.body.length===0&&T&&(n=e.range,n[1]-n[0]>2&&(r=x.substring(n[0]+1,n[1]-1),r[0]==="\n"&&(i=["{"]),i.push(r)));var o,u,a,f;f=R,t&_&&(f|=D);for(o=0,u=e.body
.length;o<u;++o)T&&(o===0&&(e.body[0].leadingComments&&(n=e.body[0].leadingComments[0].extendedRange,r=x.substring(n[0],n[1]),r[0]==="\n"&&(i=["{"])),e.body[0].leadingComments||vt(e.range[0],e.body[0].range[0],i)),o>0&&!e.body[o-1].trailingComments&&!e.body
[o].leadingComments&&vt(e.body[o-1].range[1],e.body[o].range[0],i)),o===u-1&&(f|=P),e.body[o].leadingComments&&T?a=s.generateStatement(e.body[o],f):a=ft(s.generateStatement(e.body[o],f)),i.push(a),K(ot(a).toString())||(T&&o<u-1?e.body[o+1].leadingComments||
i.push(d):i.push(d)),T&&o===u-1&&(e.body[o].trailingComments||vt(e.body[o].range[1],e.range[1],i))}),i.push(ft("}")),i},BreakStatement:function(e,t){return e.label?"break "+e.label.name+this.semicolon(t):"break"+this.semicolon(t)},ContinueStatement:function(
e,t){return e.label?"continue "+e.label.name+this.semicolon(t):"continue"+this.semicolon(t)},ClassBody:function(e,n){var r=["{",d],i=this;return lt(function(n){var s,o;for(s=0,o=e.body.length;s<o;++s)r.push(n),r.push(i.generateExpression(e.body[s],t.Sequence
,j)),s+1<o&&r.push(d)}),K(ot(r).toString())||r.push(d),r.push(u),r.push("}"),r},ClassDeclaration:function(e,n){var r,i;return r=["class "+e.id.name],e.superClass&&(i=at("extends",this.generateExpression(e.superClass,t.Assignment,j)),r=at(r,i)),r.push(v),r.push
(this.generateStatement(e.body,U)),r},DirectiveStatement:function(e,t){return w.raw&&e.raw?e.raw+this.semicolon(t):rt(e.directive)+this.semicolon(t)},DoWhileStatement:function(e,n){var r=at("do",this.maybeBlock(e.body,R));return r=this.maybeBlockSuffix(e.body
,r),at(r,["while"+v+"(",this.generateExpression(e.test,t.Sequence,j),")"+this.semicolon(n)])},CatchClause:function(e,n){var r,i=this;return lt(function(){var n;r=["catch"+v+"(",i.generateExpression(e.param,t.Sequence,j),")"],e.guard&&(n=i.generateExpression
(e.guard,t.Sequence,j),r.splice(2,0," if ",n))}),r.push(this.maybeBlock(e.body,R)),r},DebuggerStatement:function(e,t){return"debugger"+this.semicolon(t)},EmptyStatement:function(e,t){return";"},ExportDeclaration:function(n,r){var i=["export"],s,o=this;return s=
r&P?U:R,n["default"]?(i=at(i,"default"),L(n.declaration)?i=at(i,this.generateStatement(n.declaration,s)):i=at(i,this.generateExpression(n.declaration,t.Assignment,j)+this.semicolon(r)),i):n.declaration?at(i,this.generateStatement(n.declaration,s)):(n.specifiers&&
(n.specifiers.length===0?i=at(i,"{"+v+"}"):n.specifiers[0].type===e.ExportBatchSpecifier?i=at(i,this.generateExpression(n.specifiers[0],t.Sequence,j)):(i=at(i,"{"),lt(function(e){var r,s;i.push(d);for(r=0,s=n.specifiers.length;r<s;++r)i.push(e),i.push(o.generateExpression
(n.specifiers[r],t.Sequence,j)),r+1<s&&i.push(","+d)}),K(ot(i).toString())||i.push(d),i.push(u+"}")),n.source?i=at(i,["from"+v,this.generateExpression(n.source,t.Sequence,j),this.semicolon(r)]):i.push(this.semicolon(r))),i)},ExportDefaultDeclaration:function(
e,t){return e.default=!0,this.ExportDeclaration(e,t)},ExportNamedDeclaration:function(e,t){return this.ExportDeclaration(e,t)},ExpressionStatement:function(n,r){function u(e){var t;return e.slice(0,5)!=="class"?!1:(t=e.charCodeAt(5),t===123||s.code.isWhiteSpace
(t)||s.code.isLineTerminator(t))}function a(e){var t;return e.slice(0,8)!=="function"?!1:(t=e.charCodeAt(8),t===40||s.code.isWhiteSpace(t)||t===42||s.code.isLineTerminator(t))}function f(e){var t,n,r;if(e.slice(0,5)!=="async")return!1;if(!s.code.isWhiteSpace
(e.charCodeAt(5)))return!1;for(n=6,r=e.length;n<r;++n)if(!s.code.isWhiteSpace(e.charCodeAt(n)))break;return n===r?!1:e.slice(n,n+8)!=="function"?!1:(t=e.charCodeAt(n+8),t===40||s.code.isWhiteSpace(t)||t===42||s.code.isLineTerminator(t))}var i,o;return i=[this
.generateExpression(n.expression,t.Sequence,j)],o=ot(i).toString(),o.charCodeAt(0)===123||u(o)||a(o)||f(o)||b&&r&D&&n.expression.type===e.Literal&&typeof n.expression.value=="string"?i=["(",i,")"+this.semicolon(r)]:i.push(this.semicolon(r)),i},ImportDeclaration
:function(n,r){var i,s,o=this;return n.specifiers.length===0?["import",v,this.generateExpression(n.source,t.Sequence,j),this.semicolon(r)]:(i=["import"],s=0,n.specifiers[s].type===e.ImportDefaultSpecifier&&(i=at(i,[this.generateExpression(n.specifiers[s],t.
Sequence,j)]),++s),n.specifiers[s]&&(s!==0&&i.push(","),n.specifiers[s].type===e.ImportNamespaceSpecifier?i=at(i,[v,this.generateExpression(n.specifiers[s],t.Sequence,j)]):(i.push(v+"{"),n.specifiers.length-s===1?(i.push(v),i.push(this.generateExpression(n.
specifiers[s],t.Sequence,j)),i.push(v+"}"+v)):(lt(function(e){var r,u;i.push(d);for(r=s,u=n.specifiers.length;r<u;++r)i.push(e),i.push(o.generateExpression(n.specifiers[r],t.Sequence,j)),r+1<u&&i.push(","+d)}),K(ot(i).toString())||i.push(d),i.push(u+"}"+v))
)),i=at(i,["from"+v,this.generateExpression(n.source,t.Sequence,j),this.semicolon(r)]),i)},VariableDeclarator:function(e,n){var r=n&A?j:H;return e.init?[this.generateExpression(e.id,t.Assignment,r),v,"=",v,this.generateExpression(e.init,t.Assignment,r)]:this
.generatePattern(e.id,t.Assignment,r)},VariableDeclaration:function(e,t){function a(){s=e.declarations[0],w.comment&&s.leadingComments?(n.push("\n"),n.push(ft(u.generateStatement(s,o)))):(n.push(ut()),n.push(u.generateStatement(s,o)));for(r=1,i=e.declarations
.length;r<i;++r)s=e.declarations[r],w.comment&&s.leadingComments?(n.push(","+d),n.push(ft(u.generateStatement(s,o)))):(n.push(","+v),n.push(u.generateStatement(s,o)))}var n,r,i,s,o,u=this;return n=[e.kind],o=t&A?R:z,e.declarations.length>1?lt(a):a(),n.push(
this.semicolon(t)),n},ThrowStatement:function(e,n){return[at("throw",this.generateExpression(e.argument,t.Sequence,j)),this.semicolon(n)]},TryStatement:function(e,t){var n,r,i,s;n=["try",this.maybeBlock(e.block,R)],n=this.maybeBlockSuffix(e.block,n);if(e.handlers
)for(r=0,i=e.handlers.length;r<i;++r){n=at(n,this.generateStatement(e.handlers[r],R));if(e.finalizer||r+1!==i)n=this.maybeBlockSuffix(e.handlers[r].body,n)}else{s=e.guardedHandlers||[];for(r=0,i=s.length;r<i;++r){n=at(n,this.generateStatement(s[r],R));if(e.
finalizer||r+1!==i)n=this.maybeBlockSuffix(s[r].body,n)}if(e.handler)if(o(e.handler))for(r=0,i=e.handler.length;r<i;++r){n=at(n,this.generateStatement(e.handler[r],R));if(e.finalizer||r+1!==i)n=this.maybeBlockSuffix(e.handler[r].body,n)}else n=at(n,this.generateStatement
(e.handler,R)),e.finalizer&&(n=this.maybeBlockSuffix(e.handler.body,n))}return e.finalizer&&(n=at(n,["finally",this.maybeBlock(e.finalizer,R)])),n},SwitchStatement:function(e,n){var r,i,s,o,u,a=this;lt(function(){r=["switch"+v+"(",a.generateExpression(e.discriminant
,t.Sequence,j),")"+v+"{"+d]});if(e.cases){u=R;for(s=0,o=e.cases.length;s<o;++s)s===o-1&&(u|=P),i=ft(this.generateStatement(e.cases[s],u)),r.push(i),K(ot(i).toString())||r.push(d)}return r.push(ft("}")),r},SwitchCase:function(n,r){var i,s,o,u,a,f=this;return lt
(function(){n.test?i=[at("case",f.generateExpression(n.test,t.Sequence,j)),":"]:i=["default:"],o=0,u=n.consequent.length,u&&n.consequent[0].type===e.BlockStatement&&(s=f.maybeBlock(n.consequent[0],R),i.push(s),o=1),o!==u&&!K(ot(i).toString())&&i.push(d),a=R
;for(;o<u;++o)o===u-1&&r&P&&(a|=P),s=ft(f.generateStatement(n.consequent[o],a)),i.push(s),o+1!==u&&!K(ot(s).toString())&&i.push(d)}),i},IfStatement:function(n,r){var i,s,o,u=this;return lt(function(){i=["if"+v+"(",u.generateExpression(n.test,t.Sequence,j),")"
]}),o=r&P,s=R,o&&(s|=P),n.alternate?(i.push(this.maybeBlock(n.consequent,R)),i=this.maybeBlockSuffix(n.consequent,i),n.alternate.type===e.IfStatement?i=at(i,["else ",this.generateStatement(n.alternate,s)]):i=at(i,at("else",this.maybeBlock(n.alternate,s)))):
i.push(this.maybeBlock(n.consequent,s)),i},ForStatement:function(n,r){var i,s=this;return lt(function(){i=["for"+v+"("],n.init?n.init.type===e.VariableDeclaration?i.push(s.generateStatement(n.init,z)):(i.push(s.generateExpression(n.init,t.Sequence,H)),i.push
(";")):i.push(";"),n.test?(i.push(v),i.push(s.generateExpression(n.test,t.Sequence,j)),i.push(";")):i.push(";"),n.update?(i.push(v),i.push(s.generateExpression(n.update,t.Sequence,j)),i.push(")")):i.push(")")}),i.push(this.maybeBlock(n.body,r&P?U:R)),i},ForInStatement
:function(e,t){return this.generateIterationForStatement("in",e,t&P?U:R)},ForOfStatement:function(e,t){return this.generateIterationForStatement("of",e,t&P?U:R)},LabeledStatement:function(e,t){return[e.label.name+":",this.maybeBlock(e.body,t&P?U:R)]},Program
:function(e,t){var n,r,i,s,o;s=e.body.length,n=[y&&s>0?"\n":""],o=W;for(i=0;i<s;++i)!y&&i===s-1&&(o|=P),T&&(i===0&&(e.body[0].leadingComments||vt(e.range[0],e.body[i].range[0],n)),i>0&&!e.body[i-1].trailingComments&&!e.body[i].leadingComments&&vt(e.body[i-1
].range[1],e.body[i].range[0],n)),r=ft(this.generateStatement(e.body[i],o)),n.push(r),i+1<s&&!K(ot(r).toString())&&(T?e.body[i+1].leadingComments||n.push(d):n.push(d)),T&&i===s-1&&(e.body[i].trailingComments||vt(e.body[i].range[1],e.range[1],n));return n},FunctionDeclaration
:function(e,t){return[Et(e,!0),"function",St(e)||ut(),wt(e.id),this.generateFunctionBody(e)]},ReturnStatement:function(e,n){return e.argument?[at("return",this.generateExpression(e.argument,t.Sequence,j)),this.semicolon(n)]:["return"+this.semicolon(n)]},WhileStatement
:function(e,n){var r,i=this;return lt(function(){r=["while"+v+"(",i.generateExpression(e.test,t.Sequence,j),")"]}),r.push(this.maybeBlock(e.body,n&P?U:R)),r},WithStatement:function(e,n){var r,i=this;return lt(function(){r=["with"+v+"(",i.generateExpression(
e.object,t.Sequence,j),")"]}),r.push(this.maybeBlock(e.body,n&P?U:R)),r}},Q(bt.prototype,bt.Statement),bt.Expression={SequenceExpression:function(e,n,r){var i,s,o;t.Sequence<n&&(r|=A),i=[];for(s=0,o=e.expressions.length;s<o;++s)i.push(this.generateExpression
(e.expressions[s],t.Assignment,r)),s+1<o&&i.push(","+v);return mt(i,t.Sequence,n)},AssignmentExpression:function(e,t,n){return this.generateAssignment(e.left,e.right,e.operator,t,n)},ArrowFunctionExpression:function(e,n,r){return mt(this.generateFunctionBody
(e),t.ArrowFunction,n)},ConditionalExpression:function(e,n,r){return t.Conditional<n&&(r|=A),mt([this.generateExpression(e.test,t.LogicalOR,r),v+"?"+v,this.generateExpression(e.consequent,t.Assignment,r),v+":"+v,this.generateExpression(e.alternate,t.Assignment
,r)],t.Conditional,n)},LogicalExpression:function(e,t,n){return this.BinaryExpression(e,t,n)},BinaryExpression:function(e,t,r){var i,o,u,a;return o=n[e.operator],o<t&&(r|=A),u=this.generateExpression(e.left,o,r),a=u.toString(),a.charCodeAt(a.length-1)===47&&
s.code.isIdentifierPartES5(e.operator.charCodeAt(0))?i=[u,ut(),e.operator]:i=at(u,e.operator),u=this.generateExpression(e.right,o+1,r),e.operator==="/"&&u.toString().charAt(0)==="/"||e.operator.slice(-1)==="<"&&u.toString().slice(0,3)==="!--"?(i.push(ut()),
i.push(u)):i=at(i,u),e.operator==="in"&&!(r&A)?["(",i,")"]:mt(i,o,t)},CallExpression:function(e,n,r){var i,s,o;i=[this.generateExpression(e.callee,t.Call,B)],i.push("(");for(s=0,o=e.arguments.length;s<o;++s)i.push(this.generateExpression(e.arguments[s],t.Assignment
,j)),s+1<o&&i.push(","+v);return i.push(")"),r&O?mt(i,t.Call,n):["(",i,")"]},NewExpression:function(e,n,r){var i,s,o,u,a;s=e.arguments.length,a=r&M&&!m&&s===0?q:F,i=at("new",this.generateExpression(e.callee,t.New,a));if(!(r&M)||m||s>0){i.push("(");for(o=0,u=
s;o<u;++o)i.push(this.generateExpression(e.arguments[o],t.Assignment,j)),o+1<u&&i.push(","+v);i.push(")")}return mt(i,t.New,n)},MemberExpression:function(n,r,i){var o,u;return o=[this.generateExpression(n.object,t.Call,i&O?B:F)],n.computed?(o.push("["),o.push
(this.generateExpression(n.property,t.Sequence,i&O?j:q)),o.push("]")):(n.object.type===e.Literal&&typeof n.object.value=="number"&&(u=ot(o).toString(),u.indexOf(".")<0&&!/[eExX]/.test(u)&&s.code.isDecimalDigit(u.charCodeAt(u.length-1))&&!(u.length>=2&&u.charCodeAt
(0)===48)&&o.push(".")),o.push("."),o.push(wt(n.property))),mt(o,t.Member,r)},UnaryExpression:function(e,n,r){var i,o,u,a,f;return o=this.generateExpression(e.argument,t.Unary,j),v===""?i=at(e.operator,o):(i=[e.operator],e.operator.length>2?i=at(i,o):(a=ot(
i).toString(),f=a.charCodeAt(a.length-1),u=o.toString().charCodeAt(0),(f===43||f===45)&&f===u||s.code.isIdentifierPartES5(f)&&s.code.isIdentifierPartES5(u)?(i.push(ut()),i.push(o)):i.push(o))),mt(i,t.Unary,n)},YieldExpression:function(e,n,r){var i;return e.
delegate?i="yield*":i="yield",e.argument&&(i=at(i,this.generateExpression(e.argument,t.Yield,j))),mt(i,t.Yield,n)},AwaitExpression:function(e,n,r){var i=at(e.all?"await*":"await",this.generateExpression(e.argument,t.Await,j));return mt(i,t.Await,n)},UpdateExpression
:function(e,n,r){return e.prefix?mt([e.operator,this.generateExpression(e.argument,t.Unary,j)],t.Unary,n):mt([this.generateExpression(e.argument,t.Postfix,j),e.operator],t.Postfix,n)},FunctionExpression:function(e,t,n){var r=[Et(e,!0),"function"];return e.id?
(r.push(St(e)||ut()),r.push(wt(e.id))):r.push(St(e)||v),r.push(this.generateFunctionBody(e)),r},ExportBatchSpecifier:function(e,t,n){return"*"},ArrayPattern:function(e,t,n){return this.ArrayExpression(e,t,n,!0)},ArrayExpression:function(e,n,r,i){var s,o,a=this
;return e.elements.length?(o=i?!1:e.elements.length>1,s=["[",o?d:""],lt(function(n){var r,i;for(r=0,i=e.elements.length;r<i;++r)e.elements[r]?(s.push(o?n:""),s.push(a.generateExpression(e.elements[r],t.Assignment,j))):(o&&s.push(n),r+1===i&&s.push(",")),r+1<
i&&s.push(","+(o?d:v))}),o&&!K(ot(s).toString())&&s.push(d),s.push(o?u:""),s.push("]"),s):"[]"},RestElement:function(e,t,n){return"..."+this.generatePattern(e.argument)},ClassExpression:function(e,n,r){var i,s;return i=["class"],e.id&&(i=at(i,this.generateExpression
(e.id,t.Sequence,j))),e.superClass&&(s=at("extends",this.generateExpression(e.superClass,t.Assignment,j)),i=at(i,s)),i.push(v),i.push(this.generateStatement(e.body,U)),i},MethodDefinition:function(e,t,n){var r,i;return e["static"]?r=["static"+v]:r=[],e.kind==="get"||
e.kind==="set"?i=[at(e.kind,this.generatePropertyKey(e.key,e.computed)),this.generateFunctionBody(e.value)]:i=[xt(e),this.generatePropertyKey(e.key,e.computed),this.generateFunctionBody(e.value)],at(r,i)},Property:function(e,n,r){return e.kind==="get"||e.kind==="set"?
[e.kind,ut(),this.generatePropertyKey(e.key,e.computed),this.generateFunctionBody(e.value)]:e.shorthand?this.generatePropertyKey(e.key,e.computed):e.method?[xt(e),this.generatePropertyKey(e.key,e.computed),this.generateFunctionBody(e.value)]:[this.generatePropertyKey
(e.key,e.computed),":"+v,this.generateExpression(e.value,t.Assignment,j)]},ObjectExpression:function(e,n,r){var i,s,o,a=this;return e.properties.length?(i=e.properties.length>1,lt(function(){o=a.generateExpression(e.properties[0],t.Sequence,j)}),!i&&!J(ot(o
).toString())?["{",v,o,v,"}"]:(lt(function(n){var r,u;s=["{",d,n,o];if(i){s.push(","+d);for(r=1,u=e.properties.length;r<u;++r)s.push(n),s.push(a.generateExpression(e.properties[r],t.Sequence,j)),r+1<u&&s.push(","+d)}}),K(ot(s).toString())||s.push(d),s.push(
u),s.push("}"),s)):"{}"},ObjectPattern:function(n,r,i){var s,o,a,f,l,c=this;if(!n.properties.length)return"{}";f=!1;if(n.properties.length===1)l=n.properties[0],l.value.type!==e.Identifier&&(f=!0);else for(o=0,a=n.properties.length;o<a;++o){l=n.properties[o
];if(!l.shorthand){f=!0;break}}return s=["{",f?d:""],lt(function(e){var r,i;for(r=0,i=n.properties.length;r<i;++r)s.push(f?e:""),s.push(c.generateExpression(n.properties[r],t.Sequence,j)),r+1<i&&s.push(","+(f?d:v))}),f&&!K(ot(s).toString())&&s.push(d),s.push
(f?u:""),s.push("}"),s},ThisExpression:function(e,t,n){return"this"},Super:function(e,t,n){return"super"},Identifier:function(e,t,n){return wt(e)},ImportDefaultSpecifier:function(e,t,n){return wt(e.id||e.local)},ImportNamespaceSpecifier:function(e,t,n){var r=
["*"],i=e.id||e.local;return i&&r.push(v+"as"+ut()+wt(i)),r},ImportSpecifier:function(e,t,n){return this.ExportSpecifier(e,t,n)},ExportSpecifier:function(e,t,n){var r=(e.id||e.imported).name,i=[r],s=e.name||e.local;return s&&s.name!==r&&i.push(ut()+"as"+ut(
)+wt(s)),i},Literal:function(t,n,r){var i;if(t.hasOwnProperty("raw")&&E&&w.raw)try{i=E(t.raw).body[0].expression;if(i.type===e.Literal&&i.value===t.value)return t.raw}catch(s){}return t.value===null?"null":typeof t.value=="string"?it(t.value):typeof t.value=="number"?
Y(t.value):typeof t.value=="boolean"?t.value?"true":"false":et(t.value)},GeneratorExpression:function(e,t,n){return this.ComprehensionExpression(e,t,n)},ComprehensionExpression:function(n,r,i){var s,o,u,a,f=this;return s=n.type===e.GeneratorExpression?["("]
:["["],w.moz.comprehensionExpressionStartsWithAssignment&&(a=this.generateExpression(n.body,t.Assignment,j),s.push(a)),n.blocks&&lt(function(){for(o=0,u=n.blocks.length;o<u;++o)a=f.generateExpression(n.blocks[o],t.Sequence,j),o>0||w.moz.comprehensionExpressionStartsWithAssignment?
s=at(s,a):s.push(a)}),n.filter&&(s=at(s,"if"+v),a=this.generateExpression(n.filter,t.Sequence,j),s=at(s,["(",a,")"])),w.moz.comprehensionExpressionStartsWithAssignment||(a=this.generateExpression(n.body,t.Assignment,j),s=at(s,a)),s.push(n.type===e.GeneratorExpression?")"
:"]"),s},ComprehensionBlock:function(n,r,i){var s;return n.left.type===e.VariableDeclaration?s=[n.left.kind,ut(),this.generateStatement(n.left.declarations[0],z)]:s=this.generateExpression(n.left,t.Call,j),s=at(s,n.of?"of":"in"),s=at(s,this.generateExpression
(n.right,t.Sequence,j)),["for"+v+"(",s,")"]},SpreadElement:function(e,n,r){return["...",this.generateExpression(e.argument,t.Assignment,j)]},TaggedTemplateExpression:function(e,n,r){var i=B;r&O||(i=F);var s=[this.generateExpression(e.tag,t.Call,i),this.generateExpression
(e.quasi,t.Primary,I)];return mt(s,t.TaggedTemplate,n)},TemplateElement:function(e,t,n){return e.value.raw},TemplateLiteral:function(e,n,r){var i,s,o;i=["`"];for(s=0,o=e.quasis.length;s<o;++s)i.push(this.generateExpression(e.quasis[s],t.Primary,j)),s+1<o&&(
i.push("${"+v),i.push(this.generateExpression(e.expressions[s],t.Sequence,j)),i.push(v+"}"));return i.push("`"),i},ModuleSpecifier:function(e,t,n){return this.Literal(e,t,n)}},Q(bt.prototype,bt.Expression),bt.prototype.generateExpression=function(t,n,r){var i
,s;return s=t.type||e.Property,w.verbatim&&t.hasOwnProperty(w.verbatim)?yt(t,n):(i=this[s](t,n,r),w.comment&&(i=dt(t,i)),ot(i,t))},bt.prototype.generateStatement=function(t,n){var r,i;return r=this[t.type](t,n),w.comment&&(r=dt(t,r)),i=ot(r).toString(),t.type===
e.Program&&!y&&d===""&&i.charAt(i.length-1)==="\n"&&(r=S?ot(r).replaceRight(/\s+$/,""):i.replace(/\s+$/,"")),ot(r,t)},N={indent:{style:"",base:0},renumber:!0,hexadecimal:!0,quotes:"auto",escapeless:!0,compact:!0,parentheses:!1,semicolons:!1},C=V().format,exports
.version=require("./package.json").version,exports.generate=Nt,exports.attachComments=i.attachComments,exports.Precedence=G({},t),exports.browser=!1,exports.FORMAT_MINIFY=N,exports.FORMAT_DEFAULTS=C})()
}());
/* jslint-ignore-end */



    // init lib handlebars
    (function () {
        // https://github.com/components/handlebars.js/blob/v1.2.1/handlebars.js
        local.handlebars = {};
        local.handlebars.compile = function (template) {
        /*
         * this function will return a function that will render the template with a given dict
         */
            return function (dict) {
                var result;
                result = template;
                // render triple-curly-brace
                result = result.replace((/\{\{\{/g), '{{').replace((/\}\}\}/g), '}}');
                // render with-statement
                result = result.replace(
                    (/\{\{#with (.+?)\}\}([\S\s]+?)\{\{\/with\}\}/g),
                    function (match0, match1, match2) {
                        // jslint-hack
                        nop(match0);
                        return local.handlebars.replace(match2, dict, match1 + '.');
                    }
                );
                // render helper
                result = result.replace(
                    '{{#show_ignores metrics}}{{/show_ignores}}',
                    function () {
                        return local.handlebars.show_ignores(dict.metrics);
                    }
                );
                result = result.replace('{{#show_line_execution_counts fileCoverage}}' +
                    '{{maxLines}}{{/show_line_execution_counts}}', function () {
                        return local.handlebars.show_line_execution_counts(
                            dict.fileCoverage,
                            { fn: function () {
                                return dict.maxLines;
                            } }
                        );
                    });
                result = result.replace(
                    '{{#show_lines}}{{maxLines}}{{/show_lines}}',
                    function () {
                        return local.handlebars.show_lines({ fn: function () {
                            return dict.maxLines;
                        } });
                    }
                );
                result = result.replace(
                    '{{#show_picture}}{{metrics.statements.pct}}{{/show_picture}}',
                    function () {
                        return local.handlebars.show_picture({ fn: function () {
                            return dict.metrics.statements.pct;
                        } });
                    }
                );
                result = local.handlebars.replace(result, dict, '');
                // show code last
                result = result.replace(
                    '{{#show_code structured}}{{/show_code}}',
                    function () {
                        return local.handlebars.show_code(dict.structured);
                    }
                );
                return result;
            };
        };
        local.handlebars.registerHelper = function (key, helper) {
        /*
         * this function will register the helper-function
         */
            local.handlebars[key] = function () {
                try {
                    return helper.apply(null, arguments);
                } catch (ignore) {
                }
            };
        };
        local.handlebars.replace = function (template, dict, withPrefix) {
        /*
         * this function will replace the keys in the template with the dict's key / value
         */
            var value;
            // search for keys in the template
            return template.replace((/\{\{.+?\}\}/g), function (match0) {
                value = dict;
                // iteratively lookup nested values in the dict
                (withPrefix + match0.slice(2, -2)).split('.').forEach(function (key) {
                    value = value && value[key];
                });
                return value === undefined
                    ? match0
                    : String(value);
            });
        };
    }());



    // init lib istanbul.collector
    (function () {
        // https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/collector.js
        local.collectorCreate = function (options) {
            return {
                fileCoverageFor: function (file) {
                    return options.coverage[file];
                },
                files: function () {
                    return Object.keys(options.coverage).filter(function (key) {
                        // remove derived info
                        delete options.coverage[key].l;
                        return local.codeDict[key];
                    });
                }
            };
        };
    }());



/* istanbul ignore next */
// init lib istanbul.insertion-text
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/util/insertion-text.js
// utility2-uglifyjs https://raw.githubusercontent.com/gotwarlost/istanbul/v0.2.16/lib/util/insertion-text.js
(function () { var module; module = {};
function InsertionText(e,t){this.text=e,this.origLength=e.length,this.offsets=[],this.consumeBlanks=t,this.startPos=this.findFirstNonBlank(),this.endPos=this.findLastNonBlank()}var WHITE_RE=/[ \f\n\r\t\v\u00A0\u2028\u2029]/;InsertionText.prototype={findFirstNonBlank
:function(){var e=-1,t=this.text,n=t.length,r;for(r=0;r<n;r+=1)if(!t.charAt(r).match(WHITE_RE)){e=r;break}return e},findLastNonBlank:function(){var e=this.text,t=e.length,n=e.length+1,r;for(r=t-1;r>=0;r-=1)if(!e.charAt(r).match(WHITE_RE)){n=r;break}return n
},originalLength:function(){return this.origLength},insertAt:function(e,t,n,r){r=typeof r=="undefined"?this.consumeBlanks:r,e=e>this.originalLength()?this.originalLength():e,e=e<0?0:e,r&&(e<=this.startPos&&(e=0),e>this.endPos&&(e=this.origLength));var i=t.length
,s=this.findOffset(e,i,n),o=e+s,u=this.text;return this.text=u.substring(0,o)+t+u.substring(o),this},findOffset:function(e,t,n){var r=this.offsets,i,s=0,o;for(o=0;o<r.length;o+=1){i=r[o];if(i.pos<e||i.pos===e&&!n)s+=i.len;if(i.pos>=e)break}return i&&i.pos===
e?i.len+=t:r.splice(o,0,{pos:e,len:t}),s},wrap:function(e,t,n,r,i){return this.insertAt(e,t,!0,i),this.insertAt(n,r,!1,i),this},wrapLine:function(e,t){this.wrap(0,e,this.originalLength(),t)},toString:function(){return this.text}},module.exports=InsertionText
local['../util/insertion-text'] = module.exports; }());
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib istanbul.instrumenter
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.3.20/lib/instrumenter.js
// utility2-uglifyjs https://raw.githubusercontent.com/gotwarlost/istanbul/v0.3.20/lib/instrumenter.js
// replace '(t?"":r)' with 'Math.random().toString(16).slice(2)'
(function () { var escodegen, esprima, module, window; escodegen = local.escodegen; esprima = local.esprima; module = undefined; window = local;
(function(e){"use strict";function p(e,t){var n,r;return s!==null?(n=s.createHash("md5"),n.update(e),r=n.digest("base64"),r=r.replace(new RegExp("=","g"),"").replace(new RegExp("\\+","g"),"_").replace(new RegExp("/","g"),"$")):(window.__cov_seq=window.__cov_seq||0
,window.__cov_seq+=1,r=window.__cov_seq),"__cov_"+Math.random().toString(16).slice(2)}function d(e,t){h(t)||(t=[t]),Array.prototype.push.apply(e,t)}function v(e,t,n,r){this.walkMap=e,this.preprocessor=t,this.scope=n,this.debug=r,this.debug&&(this.level=0,this.seq=!0)}function m(e,n){
var r=e.type,i,s,o=t[r],u=!!e.loc||e.type===t.Program.name,a=u?n.walkMap[r]:null,f,l,c,p,v,m,g,y,b,w,E;if(!t[r]){console.error(e),console.error("Unsupported node type:"+r);return}o=t[r].children;if(e.walking)throw new Error("Infinite regress: Custom walkers may NOT call walker.apply(node)"
);e.walking=!0,m=n.apply(e,n.preprocessor),i=m.preprocessor,i&&(delete m.preprocessor,m=n.apply(e,i));if(h(a))for(c=0;c<a.length;c+=1){E=c===a.length-1,m=n.apply(m,a[c]);if(m.type!==r&&!E)throw new Error("Only the last walker is allowed to change the node type: [type was: "+
r+" ]")}else a&&(m=n.apply(e,a));for(f=0;f<o.length;f+=1){p=o[f],v=e[p];if(v&&!v.skipWalk){b={node:e,property:p};if(h(v)){g=[];for(l=0;l<v.length;l+=1)y=v[l],b.index=l,y?(w=n.apply(y,null,b),h(w.prepend)&&(d(g,w.prepend),delete w.prepend)):w=undefined,d(g,w
);e[p]=g}else{w=n.apply(v,null,b);if(h(w.prepend))throw new Error("Internal error: attempt to prepend statements in disallowed (non-array) context");e[p]=w}}}return s=m.postprocessor,s&&(delete m.postprocessor,m=n.apply(m,s)),delete e.walking,m}function g(e
){this.opts=e||{debug:!1,walkDebug:!1,coverageVariable:"__coverage__",codeGenerationOptions:undefined,noAutoWrap:!1,noCompact:!1,embedSource:!1,preserveComments:!1},this.walker=new v({ArrowFunctionExpression:[this.arrowBlockConverter],ExpressionStatement:this
.coverStatement,BreakStatement:this.coverStatement,ContinueStatement:this.coverStatement,DebuggerStatement:this.coverStatement,ReturnStatement:this.coverStatement,ThrowStatement:this.coverStatement,TryStatement:[this.paranoidHandlerCheck,this.coverStatement
],VariableDeclaration:this.coverStatement,IfStatement:[this.ifBlockConverter,this.coverStatement,this.ifBranchInjector],ForStatement:[this.skipInit,this.loopBlockConverter,this.coverStatement],ForInStatement:[this.skipLeft,this.loopBlockConverter,this.coverStatement
],ForOfStatement:[this.skipLeft,this.loopBlockConverter,this.coverStatement],WhileStatement:[this.loopBlockConverter,this.coverStatement],DoWhileStatement:[this.loopBlockConverter,this.coverStatement],SwitchStatement:[this.coverStatement,this.switchBranchInjector
],SwitchCase:[this.switchCaseInjector],WithStatement:[this.withBlockConverter,this.coverStatement],FunctionDeclaration:[this.coverFunction,this.coverStatement],FunctionExpression:this.coverFunction,LabeledStatement:this.coverStatement,ConditionalExpression:
this.conditionalBranchInjector,LogicalExpression:this.logicalExpressionBranchInjector,ObjectExpression:this.maybeAddType},this.extractCurrentHint,this,this.opts.walkDebug),this.opts.backdoor&&this.opts.backdoor.omitTrackerSuffix&&(this.omitTrackerSuffix=!0)
}var t,n,r=e?require("esprima"):esprima,i=e?require("escodegen"):escodegen,s=e?require("crypto"):null,o="(function () { ",u="\n}());",a=/^\s*istanbul\s+ignore\s+(if|else|next)(?=\W|$)/,f,l,c,h=Array.isArray;h||(h=function(e){return e&&Object.prototype.toString
.call(e)==="[object Array]"});if(!e){l={"Could not find esprima":r,"Could not find escodegen":i,"JSON object not in scope":JSON,"Array does not implement push":[].push,"Array does not implement unshift":[].unshift};for(c in l)if(l.hasOwnProperty(c)&&!l[c])throw new
Error(c)}t={AssignmentExpression:["left","right"],AssignmentPattern:["left","right"],ArrayExpression:["elements"],ArrayPattern:["elements"],ArrowFunctionExpression:["params","body"],AwaitExpression:["argument"],BlockStatement:["body"],BinaryExpression:["left"
,"right"],BreakStatement:["label"],CallExpression:["callee","arguments"],CatchClause:["param","body"],ClassBody:["body"],ClassDeclaration:["id","superClass","body"],ClassExpression:["id","superClass","body"],ComprehensionBlock:["left","right"],ComprehensionExpression
:["blocks","filter","body"],ConditionalExpression:["test","consequent","alternate"],ContinueStatement:["label"],DebuggerStatement:[],DirectiveStatement:[],DoWhileStatement:["body","test"],EmptyStatement:[],ExportAllDeclaration:["source"],ExportDefaultDeclaration
:["declaration"],ExportNamedDeclaration:["declaration","specifiers","source"],ExportSpecifier:["exported","local"],ExpressionStatement:["expression"],ForStatement:["init","test","update","body"],ForInStatement:["left","right","body"],ForOfStatement:["left","right"
,"body"],FunctionDeclaration:["id","params","body"],FunctionExpression:["id","params","body"],GeneratorExpression:["blocks","filter","body"],Identifier:[],IfStatement:["test","consequent","alternate"],ImportDeclaration:["specifiers","source"],ImportDefaultSpecifier
:["local"],ImportNamespaceSpecifier:["local"],ImportSpecifier:["imported","local"],Literal:[],LabeledStatement:["label","body"],LogicalExpression:["left","right"],MemberExpression:["object","property"],MethodDefinition:["key","value"],ModuleSpecifier:[],NewExpression
:["callee","arguments"],ObjectExpression:["properties"],ObjectPattern:["properties"],Program:["body"],Property:["key","value"],RestElement:["argument"],ReturnStatement:["argument"],SequenceExpression:["expressions"],SpreadElement:["argument"],Super:[],SwitchStatement
:["discriminant","cases"],SwitchCase:["test","consequent"],TaggedTemplateExpression:["tag","quasi"],TemplateElement:[],TemplateLiteral:["quasis","expressions"],ThisExpression:[],ThrowStatement:["argument"],TryStatement:["block","handler","finalizer"],UnaryExpression
:["argument"],UpdateExpression:["argument"],VariableDeclaration:["declarations"],VariableDeclarator:["id","init"],WhileStatement:["test","body"],WithStatement:["object","body"],YieldExpression:["argument"]};for(n in t)t.hasOwnProperty(n)&&(t[n]={name:n,children
:t[n]});f={variable:function(e){return{type:t.Identifier.name,name:e}},stringLiteral:function(e){return{type:t.Literal.name,value:String(e)}},numericLiteral:function(e){return{type:t.Literal.name,value:Number(e)}},statement:function(e){return{type:t.ExpressionStatement
.name,expression:e}},dot:function(e,n){return{type:t.MemberExpression.name,computed:!1,object:e,property:n}},subscript:function(e,n){return{type:t.MemberExpression.name,computed:!0,object:e,property:n}},postIncrement:function(e){return{type:t.UpdateExpression
.name,operator:"++",prefix:!1,argument:e}},sequence:function(e,n){return{type:t.SequenceExpression.name,expressions:[e,n]}},returnStatement:function(e){return{type:t.ReturnStatement.name,argument:e}}},v.prototype={startWalk:function(e){this.path=[],this.apply
(e)},apply:function(e,t,n){var r,i,s,o;t=t||m;if(this.debug){this.seq+=1,this.level+=1,s=this.seq,o="";for(i=0;i<this.level;i+=1)o+="    ";console.log(o+"Enter ("+s+"):"+e.type)}return n&&this.path.push(n),r=t.call(this.scope,e,this),n&&this.path.pop(),this
.debug&&(this.level-=1,console.log(o+"Return ("+s+"):"+e.type)),r||e},startLineForNode:function(e){return e&&e.loc&&e.loc.start?e.loc.start.line:null},ancestor:function(e){return this.path.length>e-1?this.path[this.path.length-e]:null},parent:function(){return this
.ancestor(1)},isLabeled:function(){var e=this.parent();return e&&e.node.type===t.LabeledStatement.name}},g.prototype={instrumentSync:function(e,n){var s;if(typeof e!="string")throw new Error("Code must be string");return e.charAt(0)==="#"&&(e="//"+e),this.opts
.noAutoWrap||(e=o+e+u),s=r.parse(e,{loc:!0,range:!0,tokens:this.opts.preserveComments,comment:!0}),this.opts.preserveComments&&(s=i.attachComments(s,s.comments,s.tokens)),this.opts.noAutoWrap||(s={type:t.Program.name,body:s.body[0].expression.callee.body.body
,comments:s.comments}),this.instrumentASTSync(s,n,e)},filterHints:function(e){var t=[],n,r,i;if(!e||!h(e))return t;for(n=0;n<e.length;n+=1)r=e[n],r&&r.value&&r.range&&h(r.range)&&(i=String(r.value).match(a),i&&t.push({type:i[1],start:r.range[0],end:r.range[1
]}));return t},extractCurrentHint:function(e){if(!e.range)return;var t=this.currentState.lastHintPosition+1,n=this.currentState.hints,r=e.range[0],i;this.currentState.currentHint=null;while(t<n.length){i=n[t];if(!(i.end<r))break;this.currentState.currentHint=
i,this.currentState.lastHintPosition=t,t+=1}},instrumentASTSync:function(e,t,n){var r=!1,s,o,u,a,f;t=t||String((new Date).getTime())+".js",this.sourceMap=null,this.coverState={path:t,s:{},b:{},f:{},fnMap:{},statementMap:{},branchMap:{}},this.currentState={trackerVar
:p(t,this.omitTrackerSuffix),func:0,branch:0,variable:0,statement:0,hints:this.filterHints(e.comments),currentHint:null,lastHintPosition:-1,ignoring:0},e.body&&e.body.length>0&&this.isUseStrictExpression(e.body[0])&&(e.body.shift(),r=!0),this.walker.startWalk
(e),s=this.opts.codeGenerationOptions||{format:{compact:!this.opts.noCompact}},s.comment=this.opts.preserveComments,o=i.generate(e,s),u=this.getPreamble(n||"",r);if(o.map&&o.code){a=u.split(/\r\n|\r|\n/).length;for(f=0;f<o.map._mappings._array.length;f+=1)o
.map._mappings._array[f].generatedLine+=a;this.sourceMap=o.map,o=o.code}return u+"\n"+o+"\n"},instrument:function(e,t,n){!n&&typeof t=="function"&&(n=t,t=null);try{n(null,this.instrumentSync(e,t))}catch(r){n(r)}},lastFileCoverage:function(){return this.coverState
},lastSourceMap:function(){return this.sourceMap},fixColumnPositions:function(e){var t=o.length,n=function(e){e.start.line===1&&(e.start.column-=t),e.end.line===1&&(e.end.column-=t)},r,i,s,u;i=e.statementMap;for(r in i)i.hasOwnProperty(r)&&n(i[r]);i=e.fnMap
;for(r in i)i.hasOwnProperty(r)&&n(i[r].loc);i=e.branchMap;for(r in i)if(i.hasOwnProperty(r)){u=i[r].locations;for(s=0;s<u.length;s+=1)n(u[s])}},getPreamble:function(e,t){var n=this.opts.coverageVariable||"__coverage__",r=this.coverState.path.replace(/\\/g,"\\\\"
),i=this.currentState.trackerVar,s,o=t?'"use strict";':"",u=function(e){return function(){return e}},a;return this.opts.noAutoWrap||this.fixColumnPositions(this.coverState),this.opts.embedSource&&(this.coverState.code=e.split(/(?:\r?\n)|\r/)),s=this.opts.debug?
JSON.stringify(this.coverState,undefined,4):JSON.stringify(this.coverState),a=["%STRICT%","var %VAR% = (Function('return this'))();","if (!%VAR%.%GLOBAL%) { %VAR%.%GLOBAL% = {}; }","%VAR% = %VAR%.%GLOBAL%;","if (!(%VAR%['%FILE%'])) {","   %VAR%['%FILE%'] = %OBJECT%;"
,"}","%VAR% = %VAR%['%FILE%'];"].join("\n").replace(/%STRICT%/g,u(o)).replace(/%VAR%/g,u(i)).replace(/%GLOBAL%/g,u(n)).replace(/%FILE%/g,u(r)).replace(/%OBJECT%/g,u(s)),a},startIgnore:function(){this.currentState.ignoring+=1},endIgnore:function(){this.currentState
.ignoring-=1},convertToBlock:function(e){return e?e.type==="BlockStatement"?e:{type:"BlockStatement",body:[e]}:{type:"BlockStatement",body:[]}},arrowBlockConverter:function(e){var t;e.expression&&(t=f.returnStatement(e.body),t.loc=e.body.loc,e.body=this.convertToBlock
(t),e.expression=!1)},paranoidHandlerCheck:function(e){!e.handler&&e.handlers&&(e.handler=e.handlers[0])},ifBlockConverter:function(e){e.consequent=this.convertToBlock(e.consequent),e.alternate=this.convertToBlock(e.alternate)},loopBlockConverter:function(e
){e.body=this.convertToBlock(e.body)},withBlockConverter:function(e){e.body=this.convertToBlock(e.body)},statementName:function(e,t){var n,r=!!this.currentState.ignoring;return e.skip=r||undefined,t=t||0,this.currentState.statement+=1,n=this.currentState.statement
,this.coverState.statementMap[n]=e,this.coverState.s[n]=t,n},skipInit:function(e){e.init&&(e.init.skipWalk=!0)},skipLeft:function(e){e.left.skipWalk=!0},isUseStrictExpression:function(e){return e&&e.type===t.ExpressionStatement.name&&e.expression&&e.expression
.type===t.Literal.name&&e.expression.value==="use strict"},maybeSkipNode:function(e,t){var n=!!this.currentState.ignoring,r=this.currentState.currentHint,i=!n&&r&&r.type===t;return i?(this.startIgnore(),e.postprocessor=this.endIgnore,!0):!1},coverStatement:
function(e,n){var r,i,s;this.maybeSkipNode(e,"next");if(this.isUseStrictExpression(e)){s=n.ancestor(2);if(s&&(s.node.type===t.FunctionExpression.name||s.node.type===t.FunctionDeclaration.name)&&n.parent().node.body[0]===e)return}e.type===t.FunctionDeclaration
.name?r=this.statementName(e.loc,1):(r=this.statementName(e.loc),i=f.statement(f.postIncrement(f.subscript(f.dot(f.variable(this.currentState.trackerVar),f.variable("s")),f.stringLiteral(r)))),this.splice(i,e,n))},splice:function(e,t,n){var r=n.isLabeled()?
n.parent().node:t;r.prepend=r.prepend||[],d(r.prepend,e)},functionName:function(e,t,n){this.currentState.func+=1;var r=this.currentState.func,i=!!this.currentState.ignoring,s=e.id?e.id.name:"(anonymous_"+r+")",o=function(e){var t=n[e]||{};return{line:t.line
,column:t.column}};return this.coverState.fnMap[r]={name:s,line:t,loc:{start:o("start"),end:o("end")},skip:i||undefined},this.coverState.f[r]=0,r},coverFunction:function(e,t){var n,r=e.body,i=r.body,s;this.maybeSkipNode(e,"next"),n=this.functionName(e,t.startLineForNode
(e),{start:e.loc.start,end:{line:e.body.loc.start.line,column:e.body.loc.start.column}}),i.length>0&&this.isUseStrictExpression(i[0])&&(s=i.shift()),i.unshift(f.statement(f.postIncrement(f.subscript(f.dot(f.variable(this.currentState.trackerVar),f.variable("f"
)),f.stringLiteral(n))))),s&&i.unshift(s)},branchName:function(e,t,n){var r,i=[],s=[],o,u=!!this.currentState.ignoring;this.currentState.branch+=1,r=this.currentState.branch;for(o=0;o<n.length;o+=1)n[o].skip=n[o].skip||u||undefined,s.push(n[o]),i.push(0);return this
.coverState.b[r]=i,this.coverState.branchMap[r]={line:t,type:e,locations:s},r},branchIncrementExprAst:function(e,t,n){var r=f.postIncrement(f.subscript(f.subscript(f.dot(f.variable(this.currentState.trackerVar),f.variable("b")),f.stringLiteral(e)),f.numericLiteral
(t)),n);return r},locationsForNodes:function(e){var t=[],n;for(n=0;n<e.length;n+=1)t.push(e[n].loc);return t},ifBranchInjector:function(e,t){var n=!!this.currentState.ignoring,r=this.currentState.currentHint,i=!n&&r&&r.type==="if",s=!n&&r&&r.type==="else",o=
e.loc.start.line,u=e.loc.start.column,a=function(){return{line:o,column:u}},l=this.branchName("if",t.startLineForNode(e),[{start:a(),end:a(),skip:i||undefined},{start:a(),end:a(),skip:s||undefined}]),c=e.consequent.body,h=e.alternate.body,p;c.unshift(f.statement
(this.branchIncrementExprAst(l,0))),h.unshift(f.statement(this.branchIncrementExprAst(l,1))),i&&(p=e.consequent,p.preprocessor=this.startIgnore,p.postprocessor=this.endIgnore),s&&(p=e.alternate,p.preprocessor=this.startIgnore,p.postprocessor=this.endIgnore)
},branchLocationFor:function(e,t){return this.coverState.branchMap[e].locations[t]},switchBranchInjector:function(e,t){var n=e.cases,r,i;if(!(n&&n.length>0))return;r=this.branchName("switch",t.startLineForNode(e),this.locationsForNodes(n));for(i=0;i<n.length
;i+=1)n[i].branchLocation=this.branchLocationFor(r,i),n[i].consequent.unshift(f.statement(this.branchIncrementExprAst(r,i)))},switchCaseInjector:function(e){var t=e.branchLocation;delete e.branchLocation,this.maybeSkipNode(e,"next")&&(t.skip=!0)},conditionalBranchInjector
:function(e,t){var n=this.branchName("cond-expr",t.startLineForNode(e),this.locationsForNodes([e.consequent,e.alternate])),r=this.branchIncrementExprAst(n,0),i=this.branchIncrementExprAst(n,1);e.consequent.preprocessor=this.maybeAddSkip(this.branchLocationFor
(n,0)),e.alternate.preprocessor=this.maybeAddSkip(this.branchLocationFor(n,1)),e.consequent=f.sequence(r,e.consequent),e.alternate=f.sequence(i,e.alternate)},maybeAddSkip:function(e){return function(t){var n=!!this.currentState.ignoring,r=this.currentState.
currentHint,i=!n&&r&&r.type==="next";i&&(this.startIgnore(),t.postprocessor=this.endIgnore);if(i||n)e.skip=!0}},logicalExpressionBranchInjector:function(e,n){var r=n.parent(),i=[],s,o,u;this.maybeSkipNode(e,"next");if(r&&r.node.type===t.LogicalExpression.name
)return;this.findLeaves(e,i),s=this.branchName("binary-expr",n.startLineForNode(e),this.locationsForNodes(i.map(function(e){return e.node})));for(u=0;u<i.length;u+=1)o=i[u],o.parent[o.property]=f.sequence(this.branchIncrementExprAst(s,u),o.node),o.node.preprocessor=
this.maybeAddSkip(this.branchLocationFor(s,u))},findLeaves:function(e,n,r,i){e.type===t.LogicalExpression.name?(this.findLeaves(e.left,n,e,"left"),this.findLeaves(e.right,n,e,"right")):n.push({node:e,parent:r,property:i})},maybeAddType:function(e){var n=e.properties
,r,i;for(r=0;r<n.length;r+=1)i=n[r],i.type||(i.type=t.Property.name)}},e?module.exports=g:window.Instrumenter=g})(typeof module!="undefined"&&typeof module.exports!="undefined"&&typeof exports!="undefined")
}());
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib istanbul.object-utils
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/object-utils.js
// utility2-uglifyjs https://raw.githubusercontent.com/gotwarlost/istanbul/v0.2.16/lib/object-utils.js
(function () { var module, window; module = undefined; window = local;
(function(e){function t(e){var t=e.statementMap,n=e.s,r;e.l||(e.l=r={},Object.keys(n).forEach(function(e){var i=t[e].start.line,s=n[e],o=r[i];s===0&&t[e].skip&&(s=1);if(typeof o=="undefined"||o<s)r[i]=s}))}function n(e){Object.keys(e).forEach(function(n){t(
e[n])})}function r(e){Object.keys(e).forEach(function(t){delete e[t].l})}function i(e,t){var n;return t>0?(n=1e5*e/t+5,Math.floor(n/10)/100):100}function s(e,t,n){var r=e[t],s=n?e[n]:null,o={total:0,covered:0,skipped:0};return Object.keys(r).forEach(function(
e){var t=!!r[e],n=s&&s[e].skip;o.total+=1;if(t||n)o.covered+=1;!t&&n&&(o.skipped+=1)}),o.pct=i(o.covered,o.total),o}function o(e){var t=e.b,n=e.branchMap,r={total:0,covered:0,skipped:0};return Object.keys(t).forEach(function(e){var i=t[e],s=n[e],o,u,a;for(a=0
;a<i.length;a+=1){o=i[a]>0,u=s.locations&&s.locations[a]&&s.locations[a].skip;if(o||u)r.covered+=1;!o&&u&&(r.skipped+=1)}r.total+=i.length}),r.pct=i(r.covered,r.total),r}function u(){return{lines:{total:0,covered:0,skipped:0,pct:"Unknown"},statements:{total
:0,covered:0,skipped:0,pct:"Unknown"},functions:{total:0,covered:0,skipped:0,pct:"Unknown"},branches:{total:0,covered:0,skipped:0,pct:"Unknown"}}}function a(e){var n=u();return t(e),n.lines=s(e,"l"),n.functions=s(e,"f","fnMap"),n.statements=s(e,"s","statementMap"
),n.branches=o(e),n}function f(e,t){var n=JSON.parse(JSON.stringify(e)),r;return delete n.l,Object.keys(t.s).forEach(function(e){n.s[e]+=t.s[e]}),Object.keys(t.f).forEach(function(e){n.f[e]+=t.f[e]}),Object.keys(t.b).forEach(function(e){var i=n.b[e],s=t.b[e
];for(r=0;r<i.length;r+=1)i[r]+=s[r]}),n}function l(){var e=u(),t=Array.prototype.slice.call(arguments),n=["lines","statements","branches","functions"],r=function(t){t&&n.forEach(function(n){e[n].total+=t[n].total,e[n].covered+=t[n].covered,e[n].skipped+=t[
n].skipped})};return t.forEach(function(e){r(e)}),n.forEach(function(t){e[t].pct=i(e[t].covered,e[t].total)}),e}function c(e){var t=[];return Object.keys(e).forEach(function(n){t.push(a(e[n]))}),l.apply(null,t)}function h(e){var t={};return n(e),Object.keys
(e).forEach(function(n){var r=e[n],i=r.l,s=r.f,o=r.fnMap,u;u=t[n]={lines:{},calledLines:0,coveredLines:0,functions:{},calledFunctions:0,coveredFunctions:0},Object.keys(i).forEach(function(e){u.lines[e]=i[e],u.coveredLines+=1,i[e]>0&&(u.calledLines+=1)}),Object
.keys(s).forEach(function(e){var t=o[e].name+":"+o[e].line;u.functions[t]=s[e],u.coveredFunctions+=1,s[e]>0&&(u.calledFunctions+=1)})}),t}var p={addDerivedInfo:n,addDerivedInfoForFile:t,removeDerivedInfo:r,blankSummary:u,summarizeFileCoverage:a,summarizeCoverage
:c,mergeFileCoverage:f,mergeSummaryObjects:l,toYUICoverage:h};e?module.exports=p:window.coverageUtils=p})(typeof module!="undefined"&&typeof module.exports!="undefined"&&typeof exports!="undefined")
local['../object-utils'] = window.coverageUtils; }());
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib istanbul.report.common.defaults
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/report/common/defaults.js
// utility2-uglifyjs https://raw.githubusercontent.com/gotwarlost/istanbul/v0.2.16/lib/report/common/defaults.js
(function () { var module; module = {};
module.exports={watermarks:function(){return{statements:[50,80],lines:[50,80],functions:[50,80],branches:[50,80]}},classFor:function(e,t,n){var r=n[e],i=t[e].pct;return i>=r[1]?"high":i>=r[0]?"medium":"low"},colorize:function(e,t){if(process.stdout.isTTY)switch(
t){case"low":e="\x1B[91m"+e+"\x1B[0m";break;case"medium":e="\x1B[93m"+e+"\x1B[0m";break;case"high":e="\x1B[92m"+e+"\x1B[0m"}return e}}
local['./common/defaults'] = module.exports; }());
/* jslint-ignore-end */



    // init lib istanbul.report.index
    (function () {
        // https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/report/index.js
        local['./index'] = {
            call: nop,
            mix: function (klass, prototype) {
                klass.prototype = prototype;
            }
        };
    }());



// init lib istanbul.report.templates.foot
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/report/templates/foot.txt
local['foot.txt'] = '\
</div>\n\
<div class="footer">\n\
    <div class="meta">Generated by <a href="http://istanbul-js.org/" target="_blank">istanbul</a> at {{datetime}}</div>\n\
</div>\n\
</body>\n\
</html>\n\
';



// init lib istanbul.report.templates.head
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/report/templates/head.txt
local['head.txt'] = '\
<!doctype html>\n\
<html lang="en">\n\
<head>\n\
    <title>Code coverage report for {{entity}}</title>\n\
    <meta charset="utf-8">\n\
    <style>\n\
        body, html {\n\
            margin:0; padding: 0;\n\
        }\n\
        body {\n\
            font-family: Helvetica Neue, Helvetica,Arial;\n\
            font-size: 10pt;\n\
        }\n\
        div.header, div.footer {\n\
            background: #eee;\n\
            padding: 1em;\n\
        }\n\
        div.header {\n\
            height: 160px;\n\
            padding: 0 1em 0 1em;\n\
            z-index: 100;\n\
            position: fixed;\n\
            top: 0;\n\
            border-bottom: 1px solid #666;\n\
            width: 100%;\n\
        }\n\
        div.footer {\n\
            border-top: 1px solid #666;\n\
        }\n\
        div.body {\n\
            margin-top: 170px;\n\
        }\n\
        div.meta {\n\
            font-size: 90%;\n\
            text-align: center;\n\
        }\n\
        h1, h2, h3 {\n\
            font-weight: normal;\n\
        }\n\
        h1 {\n\
            font-size: 12pt;\n\
        }\n\
        h2 {\n\
            font-size: 10pt;\n\
        }\n\
        pre {\n\
            font-family: Menlo, Monaco, Consolas, Courier New, monospace;\n\
            margin: 0;\n\
            padding: 0;\n\
            font-size: 14px;\n\
            tab-size: 2;\n\
        }\n\
\n\
        div.path { font-size: 110%; }\n\
        div.path a:link, div.path a:visited { color: #000; }\n\
        table.coverage { border-collapse: collapse; margin:0; padding: 0 }\n\
\n\
        table.coverage td {\n\
            margin: 0;\n\
            padding: 0;\n\
            color: #111;\n\
            vertical-align: top;\n\
        }\n\
        table.coverage td.line-count {\n\
            width: 50px;\n\
            text-align: right;\n\
            padding-right: 5px;\n\
        }\n\
        table.coverage td.line-coverage {\n\
            color: #777 !important;\n\
            text-align: right;\n\
            border-left: 1px solid #666;\n\
            border-right: 1px solid #666;\n\
        }\n\
\n\
        table.coverage td.text {\n\
        }\n\
\n\
        table.coverage td span.cline-any {\n\
            display: inline-block;\n\
            padding: 0 5px;\n\
            width: 40px;\n\
        }\n\
        table.coverage td span.cline-neutral {\n\
            background: #eee;\n\
        }\n\
        table.coverage td span.cline-yes {\n\
            background: #b5d592;\n\
            color: #999;\n\
        }\n\
        table.coverage td span.cline-no {\n\
            background: #fc8c84;\n\
        }\n\
\n\
        .cstat-yes { color: #111; }\n\
        .cstat-no { background: #fc8c84; color: #111; }\n\
        .fstat-no { background: #ffc520; color: #111 !important; }\n\
        .cbranch-no { background:  yellow !important; color: #111; }\n\
\n\
        .cstat-skip { background: #ddd; color: #111; }\n\
        .fstat-skip { background: #ddd; color: #111 !important; }\n\
        .cbranch-skip { background: #ddd !important; color: #111; }\n\
\n\
        .missing-if-branch {\n\
            display: inline-block;\n\
            margin-right: 10px;\n\
            position: relative;\n\
            padding: 0 4px;\n\
            background: black;\n\
            color: yellow;\n\
        }\n\
\n\
        .skip-if-branch {\n\
            display: none;\n\
            margin-right: 10px;\n\
            position: relative;\n\
            padding: 0 4px;\n\
            background: #ccc;\n\
            color: white;\n\
        }\n\
\n\
        .missing-if-branch .typ, .skip-if-branch .typ {\n\
            color: inherit !important;\n\
        }\n\
\n\
        .entity, .metric { font-weight: bold; }\n\
        .metric { display: inline-block; border: 1px solid #333; padding: 0.3em; background: white; }\n\
        .metric small { font-size: 80%; font-weight: normal; color: #666; }\n\
\n\
        div.coverage-summary table { border-collapse: collapse; margin: 3em; font-size: 110%; }\n\
        div.coverage-summary td, div.coverage-summary table  th { margin: 0; padding: 0.25em 1em; border-top: 1px solid #666; border-bottom: 1px solid #666; }\n\
        div.coverage-summary th { text-align: left; border: 1px solid #666; background: #eee; font-weight: normal; }\n\
        div.coverage-summary th.file { border-right: none !important; }\n\
        div.coverage-summary th.pic { border-left: none !important; text-align: right; }\n\
        div.coverage-summary th.pct { border-right: none !important; }\n\
        div.coverage-summary th.abs { border-left: none !important; text-align: right; }\n\
        div.coverage-summary td.pct { text-align: right; border-left: 1px solid #666; }\n\
        div.coverage-summary td.abs { text-align: right; font-size: 90%; color: #444; border-right: 1px solid #666; }\n\
        div.coverage-summary td.file { text-align: right; border-left: 1px solid #666; white-space: nowrap;  }\n\
        div.coverage-summary td.pic { min-width: 120px !important;  }\n\
        div.coverage-summary a:link { color: #000; }\n\
        div.coverage-summary a:visited { color: #333; }\n\
        div.coverage-summary tfoot td { border-top: 1px solid #666; }\n\
\n\
        div.coverage-summary .yui3-datatable-sort-indicator, div.coverage-summary .dummy-sort-indicator {\n\
            height: 10px;\n\
            width: 7px;\n\
            display: inline-block;\n\
            margin-left: 0.5em;\n\
        }\n\
        div.coverage-summary .yui3-datatable-sort-indicator {\n\
            background: no-repeat scroll 0 0 transparent;\n\
        }\n\
        div.coverage-summary .yui3-datatable-sorted .yui3-datatable-sort-indicator {\n\
            background-position: 0 -20px;\n\
        }\n\
        div.coverage-summary .yui3-datatable-sorted-desc .yui3-datatable-sort-indicator {\n\
            background-position: 0 -10px;\n\
        }\n\
\n\
        .high { background: #b5d592 !important; }\n\
        .medium { background: #ffe87c !important; }\n\
        .low { background: #fc8c84 !important; }\n\
\n\
        span.cover-fill, span.cover-empty {\n\
            display:inline-block;\n\
            border:1px solid #444;\n\
            background: white;\n\
            height: 12px;\n\
        }\n\
        span.cover-fill {\n\
            background: #ccc;\n\
            border-right: 1px solid #444;\n\
        }\n\
        span.cover-empty {\n\
            background: white;\n\
            border-left: none;\n\
        }\n\
        span.cover-full {\n\
            border-right: none !important;\n\
        }\n\
        pre.prettyprint {\n\
            border: none !important;\n\
            padding: 0 !important;\n\
            margin: 0 !important;\n\
        }\n\
        .com { color: #999 !important; }\n\
        .ignore-none { color: #999; font-weight: normal; }\n\
\n\
    </style>\n\
</head>\n\
<body>\n\
<div class="header {{reportClass}}">\n\
    <h1 style="font-weight: bold;">\n\
        <a href="{{envDict.npm_package_homepage}}">{{envDict.npm_package_name}} v{{envDict.npm_package_version}}</a>\n\
    </h1>\n\
    <h1>Code coverage report for <span class="entity">{{entity}}</span></h1>\n\
    <h2>\n\
        {{#with metrics.statements}}\n\
        Statements: <span class="metric">{{pct}}% <small>({{covered}} / {{total}})</small></span> &nbsp;&nbsp;&nbsp;&nbsp;\n\
        {{/with}}\n\
        {{#with metrics.branches}}\n\
        Branches: <span class="metric">{{pct}}% <small>({{covered}} / {{total}})</small></span> &nbsp;&nbsp;&nbsp;&nbsp;\n\
        {{/with}}\n\
        {{#with metrics.functions}}\n\
        Functions: <span class="metric">{{pct}}% <small>({{covered}} / {{total}})</small></span> &nbsp;&nbsp;&nbsp;&nbsp;\n\
        {{/with}}\n\
        {{#with metrics.lines}}\n\
        Lines: <span class="metric">{{pct}}% <small>({{covered}} / {{total}})</small></span> &nbsp;&nbsp;&nbsp;&nbsp;\n\
        {{/with}}\n\
        Ignored: <span class="metric">{{#show_ignores metrics}}{{/show_ignores}}</span> &nbsp;&nbsp;&nbsp;&nbsp;\n\
    </h2>\n\
    {{{pathHtml}}}\n\
</div>\n\
<div class="body">\n\
';
/* jslint-ignore-end */



    /* istanbul ignore next */
    // init lib istanbul.util.file-writer
    (function () {
        // https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/util/file-writer.js
        local.writerCreate = function (options) {
            options.coverageReportHtml = '';
            options.writerData = '';
            return {
                write: function (data) {
                    options.writerData += data;
                },
                writeFile: function (file, onError) {
                    options.coverageReportHtml += options.writerData + '\n\n';
                    local.fsWriteFileWithMkdirpSync(options.writerFile, options.writerData);
                    options.writerData = '';
                    options.writerFile = file;
                    onError(options.writer);
                }
            };
        };
    }());



    /* istanbul ignore next */
    // init lib istanbul.util.tree-summarizer
    (function () {
        var module;
        module = {};
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/util/tree-summarizer.js
// utility2-uglifyjs https://raw.githubusercontent.com/gotwarlost/istanbul/v0.2.16/lib/util/tree-summarizer.js
function commonArrayPrefix(e,t){var n=e.length<t.length?e.length:t.length,r,i=[];for(r=0;r<n;r+=1){if(e[r]!==t[r])break;i.push(e[r])}return i}function findCommonArrayPrefix(e){if(e.length===0)return[];var t=e.map(function(e){return e.split(SEP)}),n=t.pop();
return t.length===0?n.slice(0,n.length-1):t.reduce(commonArrayPrefix,n)}function Node(e,t,n){this.name=e,this.fullName=e,this.kind=t,this.metrics=n||null,this.parent=null,this.children=[]}function TreeSummary(e,t){this.prefix=t,this.convertToTree(e,t)}function TreeSummarizer
(){this.summaryMap={}}var path=require("path"),SEP=path.sep||"/",utils=require("../object-utils");Node.prototype={displayShortName:function(){return this.relativeName},fullPath:function(){return this.fullName},addChild:function(e){this.children.push(e),e.parent=
this},toJSON:function(){return{name:this.name,relativeName:this.relativeName,fullName:this.fullName,kind:this.kind,metrics:this.metrics,parent:this.parent===null?null:this.parent.name,children:this.children.map(function(e){return e.toJSON()})}}},TreeSummary
.prototype={getNode:function(e){return this.map[e]},convertToTree:function(e,t){var n=[],r=t.join(SEP)+SEP,i=new Node(r,"dir"),s,o,u={},a=!1;u[r]=i,Object.keys(e).forEach(function(t){var r=e[t],s,o,f;s=new Node(t,"file",r),u[t]=s,n.push(s),o=path.dirname(t)+
SEP,o===SEP+SEP&&(o=SEP+"__root__"+SEP),f=u[o],f||(f=new Node(o,"dir"),i.addChild(f),u[o]=f),f.addChild(s),f===i&&(a=!0)}),a&&t.length>0&&(t.pop(),s=i,o=s.children,s.children=[],i=new Node(t.join(SEP)+SEP,"dir"),i.addChild(s),o.forEach(function(e){e.kind==="dir"?
i.addChild(e):s.addChild(e)})),this.fixupNodes(i,t.join(SEP)+SEP),this.calculateMetrics(i),this.root=i,this.map={},this.indexAndSortTree(i,this.map)},fixupNodes:function(e,t,n){var r=this;e.name.indexOf(t)===0&&(e.name=e.name.substring(t.length)),e.name.charAt
(0)===SEP&&(e.name=e.name.substring(1)),n?n.name!=="__root__/"?e.relativeName=e.name.substring(n.name.length):e.relativeName=e.name:e.relativeName=e.name.substring(t.length),e.children.forEach(function(n){r.fixupNodes(n,t,e)})},calculateMetrics:function(e){
var t=this,n;if(e.kind!=="dir")return;e.children.forEach(function(e){t.calculateMetrics(e)}),e.metrics=utils.mergeSummaryObjects.apply(null,e.children.map(function(e){return e.metrics})),n=e.children.filter(function(e){return e.kind!=="dir"}),n.length>0?e.packageMetrics=
utils.mergeSummaryObjects.apply(null,n.map(function(e){return e.metrics})):e.packageMetrics=null},indexAndSortTree:function(e,t){var n=this;t[e.name]=e,e.children.sort(function(e,t){return e=e.relativeName,t=t.relativeName,e<t?-1:e>t?1:0}),e.children.forEach
(function(e){n.indexAndSortTree(e,t)})},toJSON:function(){return{prefix:this.prefix,root:this.root.toJSON()}}},TreeSummarizer.prototype={addFileCoverageSummary:function(e,t){this.summaryMap[e]=t},getTreeSummary:function(){var e=findCommonArrayPrefix(Object.
keys(this.summaryMap));return new TreeSummary(this.summaryMap,e)}},module.exports=TreeSummarizer
/* jslint-ignore-end */
        local['../util/tree-summarizer'] = module.exports;
        module.exports.prototype._getTreeSummary = module.exports.prototype.getTreeSummary;
        module.exports.prototype.getTreeSummary = function () {
            local.coverageReportSummary = this._getTreeSummary();
            return local.coverageReportSummary;
        };
    }());



/* istanbul ignore next */
// init lib istanbul.report.html
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/report/html.js
// utility2-uglifyjs https://raw.githubusercontent.com/gotwarlost/istanbul/v0.2.16/lib/report/html.js
(function () { var module; module = {};
function customEscape(e){return e=e.toString(),e.replace(RE_AMP,"&amp;").replace(RE_LT,"&lt;").replace(RE_GT,"&gt;").replace(RE_lt,"<").replace(RE_gt,">")}function title(e){return' title="'+e+'" '}function annotateLines(e,t){var n=e.l;if(!n)return;Object.keys
(n).forEach(function(e){var r=n[e];t[e].covered=r>0?"yes":"no"}),t.forEach(function(e){e.covered===null&&(e.covered="neutral")})}function annotateStatements(e,t){var n=e.s,r=e.statementMap;Object.keys(n).forEach(function(e){var i=n[e],s=r[e],o=i>0?"yes":"no"
,u=s.start.column,a=s.end.column+1,f=s.start.line,l=s.end.line,c=lt+'span class="'+(s.skip?"cstat-skip":"cstat-no")+'"'+title("statement not covered")+gt,h=lt+"/span"+gt,p;o==="no"&&(l!==f&&(l=f,a=t[f].text.originalLength()),p=t[f].text,p.wrap(u,c,f===l?a:p
.originalLength(),h))})}function annotateFunctions(e,t){var n=e.f,r=e.fnMap;if(!n)return;Object.keys(n).forEach(function(e){var i=n[e],s=r[e],o=i>0?"yes":"no",u=s.loc.start.column,a=s.loc.end.column+1,f=s.loc.start.line,l=s.loc.end.line,c=lt+'span class="'+
(s.skip?"fstat-skip":"fstat-no")+'"'+title("function not covered")+gt,h=lt+"/span"+gt,p;o==="no"&&(l!==f&&(l=f,a=t[f].text.originalLength()),p=t[f].text,p.wrap(u,c,f===l?a:p.originalLength(),h))})}function annotateBranches(e,t){var n=e.b,r=e.branchMap;if(!n
)return;Object.keys(n).forEach(function(e){var i=n[e],s=i.reduce(function(e,t){return e+t},0),o=r[e].locations,u,a,f,l,c,h,p,d,v,m,g;if(s>0)for(u=0;u<i.length;u+=1)a=i[u],f=o[u],l=a>0?"yes":"no",c=f.start.column,h=f.end.column+1,p=f.start.line,d=f.end.line,
v=lt+'span class="branch-'+u+" "+(f.skip?"cbranch-skip":"cbranch-no")+'"'+title("branch not covered")+gt,m=lt+"/span"+gt,a===0&&(d!==p&&(d=p,h=t[p].text.originalLength()),g=t[p].text,r[e].type==="if"?g.insertAt(c,lt+'span class="'+(f.skip?"skip-if-branch":"missing-if-branch"
)+'"'+title((u===0?"if":"else")+" path not taken")+gt+(u===0?"I":"E")+lt+"/span"+gt,!0,!1):g.wrap(c,v,p===d?h:g.originalLength(),m))})}function getReportClass(e,t){var n=e.pct,r=1;return n*r===n?n>=t[1]?"high":n>=t[0]?"medium":"low":""}function HtmlReport(e
){Report.call(this),this.opts=e||{},this.opts.dir=this.opts.dir||path.resolve(process.cwd(),"html-report"),this.opts.sourceStore=this.opts.sourceStore||Store.create("fslookup"),this.opts.linkMapper=this.opts.linkMapper||this.standardLinkMapper(),this.opts.writer=
this.opts.writer||null,this.opts.templateData={datetime:Date()},this.opts.watermarks=this.opts.watermarks||defaults.watermarks()}var handlebars=require("handlebars"),defaults=require("./common/defaults"),path=require("path"),SEP=path.sep||"/",fs=require("fs"
),util=require("util"),FileWriter=require("../util/file-writer"),Report=require("./index"),Store=require("../store"),InsertionText=require("../util/insertion-text"),TreeSummarizer=require("../util/tree-summarizer"),utils=require("../object-utils"),templateFor=
function(e){return handlebars.compile(fs.readFileSync(path.resolve(__dirname,"templates",e+".txt"),"utf8"))},headerTemplate=templateFor("head"),footerTemplate=templateFor("foot"),pathTemplate=handlebars.compile('<div class="path">{{{html}}}</div>'),detailTemplate=
handlebars.compile(["<tr>",'<td class="line-count">{{#show_lines}}{{maxLines}}{{/show_lines}}</td>','<td class="line-coverage">{{#show_line_execution_counts fileCoverage}}{{maxLines}}{{/show_line_execution_counts}}</td>','<td class="text"><pre class="prettyprint lang-js">{{#show_code structured}}{{/show_code}}</pre></td>'
,"</tr>\n"].join("")),summaryTableHeader=['<div class="coverage-summary">',"<table>","<thead>","<tr>",'   <th data-col="file" data-fmt="html" data-html="true" class="file">File</th>','   <th data-col="pic" data-type="number" data-fmt="html" data-html="true" class="pic"></th>'
,'   <th data-col="statements" data-type="number" data-fmt="pct" class="pct">Statements</th>','   <th data-col="statements_raw" data-type="number" data-fmt="html" class="abs"></th>','   <th data-col="branches" data-type="number" data-fmt="pct" class="pct">Branches</th>'
,'   <th data-col="branches_raw" data-type="number" data-fmt="html" class="abs"></th>','   <th data-col="functions" data-type="number" data-fmt="pct" class="pct">Functions</th>','   <th data-col="functions_raw" data-type="number" data-fmt="html" class="abs"></th>'
,'   <th data-col="lines" data-type="number" data-fmt="pct" class="pct">Lines</th>','   <th data-col="lines_raw" data-type="number" data-fmt="html" class="abs"></th>',"</tr>","</thead>","<tbody>"].join("\n"),summaryLineTemplate=handlebars.compile(["<tr>",'<td class="file {{reportClasses.statements}}" data-value="{{file}}"><a href="{{output}}">{{file}}</a></td>'
,'<td data-value="{{metrics.statements.pct}}" class="pic {{reportClasses.statements}}">{{#show_picture}}{{metrics.statements.pct}}{{/show_picture}}</td>','<td data-value="{{metrics.statements.pct}}" class="pct {{reportClasses.statements}}">{{metrics.statements.pct}}%</td>'
,'<td data-value="{{metrics.statements.total}}" class="abs {{reportClasses.statements}}">({{metrics.statements.covered}}&nbsp;/&nbsp;{{metrics.statements.total}})</td>','<td data-value="{{metrics.branches.pct}}" class="pct {{reportClasses.branches}}">{{metrics.branches.pct}}%</td>'
,'<td data-value="{{metrics.branches.total}}" class="abs {{reportClasses.branches}}">({{metrics.branches.covered}}&nbsp;/&nbsp;{{metrics.branches.total}})</td>','<td data-value="{{metrics.functions.pct}}" class="pct {{reportClasses.functions}}">{{metrics.functions.pct}}%</td>'
,'<td data-value="{{metrics.functions.total}}" class="abs {{reportClasses.functions}}">({{metrics.functions.covered}}&nbsp;/&nbsp;{{metrics.functions.total}})</td>','<td data-value="{{metrics.lines.pct}}" class="pct {{reportClasses.lines}}">{{metrics.lines.pct}}%</td>'
,'<td data-value="{{metrics.lines.total}}" class="abs {{reportClasses.lines}}">({{metrics.lines.covered}}&nbsp;/&nbsp;{{metrics.lines.total}})</td>',"</tr>\n"].join("\n	")),summaryTableFooter=["</tbody>","</table>","</div>"].join("\n"),lt="",gt="",RE_LT=/</g
,RE_GT=/>/g,RE_AMP=/&/g,RE_lt=/\u0001/g,RE_gt=/\u0002/g;handlebars.registerHelper("show_picture",function(e){var t=Number(e.fn(this)),n,r="";return isFinite(t)?(t===100&&(r=" cover-full"),t=Math.floor(t),n=100-t,'<span class="cover-fill'+r+'" style="width: '+
t+'px;"></span>'+'<span class="cover-empty" style="width:'+n+'px;"></span>'):""}),handlebars.registerHelper("show_ignores",function(e){var t=e.statements.skipped,n=e.functions.skipped,r=e.branches.skipped,i;return t===0&&n===0&&r===0?'<span class="ignore-none">none</span>'
:(i=[],t>0&&i.push(t===1?"1 statement":t+" statements"),n>0&&i.push(n===1?"1 function":n+" functions"),r>0&&i.push(r===1?"1 branch":r+" branches"),i.join(", "))}),handlebars.registerHelper("show_lines",function(e){var t=Number(e.fn(this)),n,r=[];for(n=0;n<t
;n+=1)r[n]=n+1;return r.join("\n")}),handlebars.registerHelper("show_line_execution_counts",function(e,t){var n=e.l,r=Number(t.fn(this)),i,s,o=[],u,a="";for(i=0;i<r;i+=1)s=i+1,a="&nbsp;",u="neutral",n.hasOwnProperty(s)&&(n[s]>0?(u="yes",a=n[s]):u="no"),o.push
('<span class="cline-any cline-'+u+'">'+a+"</span>");return o.join("\n")}),handlebars.registerHelper("show_code",function(e){var t=[];return e.forEach(function(e){t.push(customEscape(e.text)||"&nbsp;")}),t.join("\n")}),HtmlReport.TYPE="html",util.inherits(HtmlReport
,Report),Report.mix(HtmlReport,{getPathHtml:function(e,t){var n=e.parent,r=[],i=[],s;while(n)r.push(n),n=n.parent;for(s=0;s<r.length;s+=1)i.push('<a href="'+t.ancestor(e,s+1)+'">'+(r[s].relativeName||"All files")+"</a>");return i.reverse(),i.length>0?i.join
(" &#187; ")+" &#187; "+e.displayShortName():""},fillTemplate:function(e,t){var n=this.opts,r=n.linkMapper;t.entity=e.name||"All files",t.metrics=e.metrics,t.reportClass=getReportClass(e.metrics.statements,n.watermarks.statements),t.pathHtml=pathTemplate({html
:this.getPathHtml(e,r)}),t.prettify={js:r.asset(e,"prettify.js"),css:r.asset(e,"prettify.css")}},writeDetailPage:function(e,t,n){var r=this.opts,i=r.sourceStore,s=r.templateData,o=n.code&&Array.isArray(n.code)?n.code.join("\n")+"\n":i.get(n.path),u=o.split(/(?:\r?\n)|\r/
),a=0,f=u.map(function(e){return a+=1,{line:a,covered:null,text:new InsertionText(e,!0)}}),l;f.unshift({line:0,covered:null,text:new InsertionText("")}),this.fillTemplate(t,s),e.write(headerTemplate(s)),e.write('<pre><table class="coverage">\n'),annotateLines
(n,f),annotateBranches(n,f),annotateFunctions(n,f),annotateStatements(n,f),f.shift(),l={structured:f,maxLines:f.length,fileCoverage:n},e.write(detailTemplate(l)),e.write("</table></pre>\n"),e.write(footerTemplate(s))},writeIndexPage:function(e,t){var n=this
.opts.linkMapper,r=this.opts.templateData,i=Array.prototype.slice.apply(t.children),s=this.opts.watermarks;i.sort(function(e,t){return e.name<t.name?-1:1}),this.fillTemplate(t,r),e.write(headerTemplate(r)),e.write(summaryTableHeader),i.forEach(function(t){var r=
t.metrics,i={statements:getReportClass(r.statements,s.statements),lines:getReportClass(r.lines,s.lines),functions:getReportClass(r.functions,s.functions),branches:getReportClass(r.branches,s.branches)},o={metrics:r,reportClasses:i,file:t.displayShortName(),
output:n.fromParent(t)};e.write(summaryLineTemplate(o)+"\n")}),e.write(summaryTableFooter),e.write(footerTemplate(r))},writeFiles:function(e,t,n,r){var i=this,s=path.resolve(n,"index.html"),o;this.opts.verbose&&console.error("Writing "+s),e.writeFile(s,function(
e){i.writeIndexPage(e,t)}),t.children.forEach(function(t){t.kind==="dir"?i.writeFiles(e,t,path.resolve(n,t.relativeName),r):(o=path.resolve(n,t.relativeName+".html"),i.opts.verbose&&console.error("Writing "+o),e.writeFile(o,function(e){i.writeDetailPage(e,t
,r.fileCoverageFor(t.fullPath()))}))})},standardLinkMapper:function(){return{fromParent:function(e){var t=0,n=e.relativeName,r;if(SEP!=="/"){n="";for(t=0;t<e.relativeName.length;t+=1)r=e.relativeName.charAt(t),r===SEP?n+="/":n+=r}return e.kind==="dir"?n+"index.html"
:n+".html"},ancestorHref:function(e,t){var n="",r,i,s,o;for(s=0;s<t;s+=1){r=e.relativeName.split(SEP),i=r.length-1;for(o=0;o<i;o+=1)n+="../";e=e.parent}return n},ancestor:function(e,t){return this.ancestorHref(e,t)+"index.html"},asset:function(e,t){var n=0,
r=e.parent;while(r)n+=1,r=r.parent;return this.ancestorHref(e,n)+t}}},writeReport:function(e,t){var n=this.opts,r=n.dir,i=new TreeSummarizer,s=n.writer||new FileWriter(t),o;e.files().forEach(function(t){i.addFileCoverageSummary(t,utils.summarizeFileCoverage
(e.fileCoverageFor(t)))}),o=i.getTreeSummary(),fs.readdirSync(path.resolve(__dirname,"..","vendor")).forEach(function(e){var t=path.resolve(__dirname,"..","vendor",e),i=path.resolve(r,e),o=fs.statSync(t);o.isFile()&&(n.verbose&&console.log("Write asset: "+i
),s.copyFile(t,i))}),this.writeFiles(s,o.root,r,e)}}),module.exports=HtmlReport
local.HtmlReport = module.exports; }());
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib istanbul.report.text
/* jslint-ignore-begin */
// https://github.com/gotwarlost/istanbul/blob/v0.2.16/lib/report/text.js
// utility2-uglifyjs https://raw.githubusercontent.com/gotwarlost/istanbul/v0.2.16/lib/report/text.js
(function () { var module; module = {};
function TextReport(e){Report.call(this),e=e||{},this.dir=e.dir||process.cwd(),this.file=e.file,this.summary=e.summary,this.maxCols=e.maxCols||0,this.watermarks=e.watermarks||defaults.watermarks()}function padding(e,t){var n="",r;t=t||" ";for(r=0;r<e;r+=1)n+=
t;return n}function fill(e,t,n,r,i){r=r||0,e=String(e);var s=r*TAB_SIZE,o=t-s,u=padding(s),a="",f,l=e.length;return o>0&&(o>=l?(f=padding(o-l),a=n?f+e:e+f):(a=e.substring(l-o),a="... "+a.substring(4))),a=defaults.colorize(a,i),u+a}function formatName(e,t,n,
r){return fill(e,t,!1,n,r)}function formatPct(e,t){return fill(e,PCT_COLS,!0,0,t)}function nodeName(e){return e.displayShortName()||"All files"}function tableHeader(e){var t=[];return t.push(formatName("File",e,0)),t.push(formatPct("% Stmts")),t.push(formatPct
("% Branches")),t.push(formatPct("% Funcs")),t.push(formatPct("% Lines")),t.join(" |")+" |"}function tableRow(e,t,n,r){var i=nodeName(e),s=e.metrics.statements.pct,o=e.metrics.branches.pct,u=e.metrics.functions.pct,a=e.metrics.lines.pct,f=[];return f.push(formatName
(i,t,n,defaults.classFor("statements",e.metrics,r))),f.push(formatPct(s,defaults.classFor("statements",e.metrics,r))),f.push(formatPct(o,defaults.classFor("branches",e.metrics,r))),f.push(formatPct(u,defaults.classFor("functions",e.metrics,r))),f.push(formatPct
(a,defaults.classFor("lines",e.metrics,r))),f.join(DELIM)+DELIM}function findNameWidth(e,t,n){n=n||0,t=t||0;var r=TAB_SIZE*t+nodeName(e).length;return r>n&&(n=r),e.children.forEach(function(e){n=findNameWidth(e,t+1,n)}),n}function makeLine(e){var t=padding(
e,"-"),n=padding(PCT_COLS,"-"),r=[];return r.push(t),r.push(n),r.push(n),r.push(n),r.push(n),r.join(COL_DELIM)+COL_DELIM}function walk(e,t,n,r,i){var s;r===0?(s=makeLine(t),n.push(s),n.push(tableHeader(t)),n.push(s)):n.push(tableRow(e,t,r,i)),e.children.forEach
(function(e){walk(e,t,n,r+1,i)}),r===0&&(n.push(s),n.push(tableRow(e,t,r,i)),n.push(s))}var path=require("path"),mkdirp=require("mkdirp"),fs=require("fs"),defaults=require("./common/defaults"),Report=require("./index"),TreeSummarizer=require("../util/tree-summarizer"
),utils=require("../object-utils"),PCT_COLS=10,TAB_SIZE=3,DELIM=" |",COL_DELIM="-|";TextReport.TYPE="text",Report.mix(TextReport,{writeReport:function(e){var t=new TreeSummarizer,n,r,i,s=4*(PCT_COLS+2),o,u=[],a;e.files().forEach(function(n){t.addFileCoverageSummary
(n,utils.summarizeFileCoverage(e.fileCoverageFor(n)))}),n=t.getTreeSummary(),r=n.root,i=findNameWidth(r),this.maxCols>0&&(o=this.maxCols-s-2,i>o&&(i=o)),walk(r,i,u,0,this.watermarks),a=u.join("\n")+"\n",this.file?(mkdirp.sync(this.dir),fs.writeFileSync(path
.join(this.dir,this.file),a,"utf8")):console.log(a)}}),module.exports=TextReport
local.TextReport = module.exports; }());
/* jslint-ignore-end */



/* jslint-ignore-begin */
// https://img.shields.io/badge/coverage-100.0%-00dd00.svg?style=flat
local.templateCoverageBadgeSvg =
'<svg xmlns="http://www.w3.org/2000/svg" width="117" height="20"><linearGradient id="a" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><rect rx="0" width="117" height="20" fill="#555"/><rect rx="0" x="63" width="54" height="20" fill="#0d0"/><path fill="#0d0" d="M63 0h4v20h-4z"/><rect rx="0" width="117" height="20" fill="url(#a)"/><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="32.5" y="15" fill="#010101" fill-opacity=".3">coverage</text><text x="32.5" y="14">coverage</text><text x="89" y="15" fill="#010101" fill-opacity=".3">100.0%</text><text x="89" y="14">100.0%</text></g></svg>';
/* jslint-ignore-end */
    switch (local.modeJs) {



    // run node js-env code - post-init
    case 'node':
        /* istanbul ignore next */
        // run the cli
        local.cliRun = function (options) {
        /*
         * this function will run the cli
         */
            if ((module !== local.require2.main || module.isRollup) &&
                    !(options && options.runMain)) {
                return;
            }
            switch (process.argv[2]) {
            // transparently adds coverage information to a node command
            case 'cover':
                local.module = require('module');
                // add coverage hook to require
                local._moduleExtensionsJs = local.module._extensions['.js'];
                local.module._extensions['.js'] = function (module, file) {
                    if (typeof file === 'string' &&
                            file.indexOf(process.cwd()) === 0 &&
                            file.indexOf(process.cwd() + '/node_modules/') !== 0) {
                        module._compile(local.instrumentInPackage(
                            local._fs.readFileSync(file, 'utf8'),
                            file
                        ), file);
                        return;
                    }
                    local._moduleExtensionsJs(module, file);
                };
                // init process.argv
                process.argv.splice(1, 2);
                process.argv[1] = local.path.resolve(process.cwd(), process.argv[1]);
                console.log('\ncovering $ ' + process.argv.join(' '));
                // create coverage on exit
                process.on('exit', function () {
                    local.coverageReportCreate({ coverage: local.global.__coverage__ });
                });
                local.module.runMain();
                break;
            // instrument a file and print result to stdout
            case 'instrument':
                process.argv[3] = local.path.resolve(process.cwd(), process.argv[3]);
                process.stdout.write(local.instrumentSync(
                    local._fs.readFileSync(process.argv[3], 'utf8'),
                    process.argv[3]
                ));
                break;
            }
        };
        local.cliRun();
        break;
    }
}(
    (function () {
        'use strict';
        var local;
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
        local.local = local.istanbul = local;
        // init module
        if (local.modeJs === 'node') {
            local.__dirname = __dirname;
            local.process = process;
            local.require2 = require;
        }
        return local;
    }())
));




// /assets.utility2.lib.jslint.js
///usr/bin/env node
/* istanbul instrument in package all */
/* !istanbul instrument in package jslint-lite */
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
        local.local = local.jslint = local;
    }());



/* istanbul ignore next */
// init lib csslint
/* jslint-ignore-begin */
// https://github.com/CSSLint/csslint/blob/v0.10.0/release/csslint.js
// utility2-uglifyjs https://raw.githubusercontent.com/CSSLint/csslint/v0.10.0/release/csslint.js
(function () { var CSSLint, JSLINT;
var exports=exports||{},CSSLint=function(){function Reporter(e,t){this.messages=[],this.stats=[],this.lines=e,this.ruleset=t}var parserlib={};(function(){function e(){this._listeners={}}function t(e){this._input=e.replace(/\n\r?/g,"\n"),this._line=1,this._col=1
,this._cursor=0}function n(e,t,n){this.col=n,this.line=t,this.message=e}function r(e,t,n,r){this.col=n,this.line=t,this.text=e,this.type=r}function i(e,n){this._reader=e?new t(e.toString()):null,this._token=null,this._tokenData=n,this._lt=[],this._ltIndex=0
,this._ltIndexCache=[]}e.prototype={constructor:e,addListener:function(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)},fire:function(e){typeof e=="string"&&(e={type:e}),typeof e.target!="undefined"&&(e.target=this);if(typeof e.type=="undefined"
)throw new Error("Event object missing 'type' property.");if(this._listeners[e.type]){var t=this._listeners[e.type].concat();for(var n=0,r=t.length;n<r;n++)t[n].call(this,e)}},removeListener:function(e,t){if(this._listeners[e]){var n=this._listeners[e];for(
var r=0,i=n.length;r<i;r++)if(n[r]===t){n.splice(r,1);break}}}},t.prototype={constructor:t,getCol:function(){return this._col},getLine:function(){return this._line},eof:function(){return this._cursor==this._input.length},peek:function(e){var t=null;return e=typeof
e=="undefined"?1:e,this._cursor<this._input.length&&(t=this._input.charAt(this._cursor+e-1)),t},read:function(){var e=null;return this._cursor<this._input.length&&(this._input.charAt(this._cursor)=="\n"?(this._line++,this._col=1):this._col++,e=this._input.charAt
(this._cursor++)),e},mark:function(){this._bookmark={cursor:this._cursor,line:this._line,col:this._col}},reset:function(){this._bookmark&&(this._cursor=this._bookmark.cursor,this._line=this._bookmark.line,this._col=this._bookmark.col,delete this._bookmark)}
,readTo:function(e){var t="",n;while(t.length<e.length||t.lastIndexOf(e)!=t.length-e.length){n=this.read();if(!n)throw new Error('Expected "'+e+'" at line '+this._line+", col "+this._col+".");t+=n}return t},readWhile:function(e){var t="",n=this.read();while(
n!==null&&e(n))t+=n,n=this.read();return t},readMatch:function(e){var t=this._input.substring(this._cursor),n=null;return typeof e=="string"?t.indexOf(e)===0&&(n=this.readCount(e.length)):e instanceof RegExp&&e.test(t)&&(n=this.readCount(RegExp.lastMatch.length
)),n},readCount:function(e){var t="";while(e--)t+=this.read();return t}},n.prototype=new Error,r.fromToken=function(e){return new r(e.value,e.startLine,e.startCol)},r.prototype={constructor:r,valueOf:function(){return this.toString()},toString:function(){return this
.text}},i.createTokenData=function(e){var t=[],n={},r=e.concat([]),i=0,s=r.length+1;r.UNKNOWN=-1,r.unshift({name:"EOF"});for(;i<s;i++)t.push(r[i].name),r[r[i].name]=i,r[i].text&&(n[r[i].text]=i);return r.name=function(e){return t[e]},r.type=function(e){return n
[e]},r},i.prototype={constructor:i,match:function(e,t){e instanceof Array||(e=[e]);var n=this.get(t),r=0,i=e.length;while(r<i)if(n==e[r++])return!0;return this.unget(),!1},mustMatch:function(e,t){var r;e instanceof Array||(e=[e]);if(!this.match.apply(this,arguments
))throw r=this.LT(1),new n("Expected "+this._tokenData[e[0]].name+" at line "+r.startLine+", col "+r.startCol+".",r.startLine,r.startCol)},advance:function(e,t){while(this.LA(0)!==0&&!this.match(e,t))this.get();return this.LA(0)},get:function(e){var t=this.
_tokenData,n=this._reader,r,i=0,s=t.length,o=!1,u,a;if(this._lt.length&&this._ltIndex>=0&&this._ltIndex<this._lt.length){i++,this._token=this._lt[this._ltIndex++],a=t[this._token.type];while(a.channel!==undefined&&e!==a.channel&&this._ltIndex<this._lt.length
)this._token=this._lt[this._ltIndex++],a=t[this._token.type],i++;if((a.channel===undefined||e===a.channel)&&this._ltIndex<=this._lt.length)return this._ltIndexCache.push(i),this._token.type}return u=this._getToken(),u.type>-1&&!t[u.type].hide&&(u.channel=t[
u.type].channel,this._token=u,this._lt.push(u),this._ltIndexCache.push(this._lt.length-this._ltIndex+i),this._lt.length>5&&this._lt.shift(),this._ltIndexCache.length>5&&this._ltIndexCache.shift(),this._ltIndex=this._lt.length),a=t[u.type],a&&(a.hide||a.channel!==
undefined&&e!==a.channel)?this.get(e):u.type},LA:function(e){var t=e,n;if(e>0){if(e>5)throw new Error("Too much lookahead.");while(t)n=this.get(),t--;while(t<e)this.unget(),t++}else if(e<0){if(!this._lt[this._ltIndex+e])throw new Error("Too much lookbehind."
);n=this._lt[this._ltIndex+e].type}else n=this._token.type;return n},LT:function(e){return this.LA(e),this._lt[this._ltIndex+e-1]},peek:function(){return this.LA(1)},token:function(){return this._token},tokenName:function(e){return e<0||e>this._tokenData.length?"UNKNOWN_TOKEN"
:this._tokenData[e].name},tokenType:function(e){return this._tokenData[e]||-1},unget:function(){if(!this._ltIndexCache.length)throw new Error("Too much lookahead.");this._ltIndex-=this._ltIndexCache.pop(),this._token=this._lt[this._ltIndex-1]}},parserlib.util=
{StringReader:t,SyntaxError:n,SyntaxUnit:r,EventTarget:e,TokenStreamBase:i}})(),function(){function Combinator(e,t,n){SyntaxUnit.call(this,e,t,n,Parser.COMBINATOR_TYPE),this.type="unknown",/^\s+$/.test(e)?this.type="descendant":e==">"?this.type="child":e=="+"?
this.type="adjacent-sibling":e=="~"&&(this.type="sibling")}function MediaFeature(e,t){SyntaxUnit.call(this,"("+e+(t!==null?":"+t:"")+")",e.startLine,e.startCol,Parser.MEDIA_FEATURE_TYPE),this.name=e,this.value=t}function MediaQuery(e,t,n,r,i){SyntaxUnit.call
(this,(e?e+" ":"")+(t?t:"")+(t&&n.length>0?" and ":"")+n.join(" and "),r,i,Parser.MEDIA_QUERY_TYPE),this.modifier=e,this.mediaType=t,this.features=n}function Parser(e){EventTarget.call(this),this.options=e||{},this._tokenStream=null}function PropertyName(e,
t,n,r){SyntaxUnit.call(this,e,n,r,Parser.PROPERTY_NAME_TYPE),this.hack=t}function PropertyValue(e,t,n){SyntaxUnit.call(this,e.join(" "),t,n,Parser.PROPERTY_VALUE_TYPE),this.parts=e}function PropertyValueIterator(e){this._i=0,this._parts=e.parts,this._marks=
[],this.value=e}function PropertyValuePart(text,line,col){SyntaxUnit.call(this,text,line,col,Parser.PROPERTY_VALUE_PART_TYPE),this.type="unknown";var temp;if(/^([+\-]?[\d\.]+)([a-z]+)$/i.test(text)){this.type="dimension",this.value=+RegExp.$1,this.units=RegExp
.$2;switch(this.units.toLowerCase()){case"em":case"rem":case"ex":case"px":case"cm":case"mm":case"in":case"pt":case"pc":case"ch":case"vh":case"vw":case"vm":this.type="length";break;case"deg":case"rad":case"grad":this.type="angle";break;case"ms":case"s":this.
type="time";break;case"hz":case"khz":this.type="frequency";break;case"dpi":case"dpcm":this.type="resolution"}}else/^([+\-]?[\d\.]+)%$/i.test(text)?(this.type="percentage",this.value=+RegExp.$1):/^([+\-]?[\d\.]+)%$/i.test(text)?(this.type="percentage",this.value=+
RegExp.$1):/^([+\-]?\d+)$/i.test(text)?(this.type="integer",this.value=+RegExp.$1):/^([+\-]?[\d\.]+)$/i.test(text)?(this.type="number",this.value=+RegExp.$1):/^#([a-f0-9]{3,6})/i.test(text)?(this.type="color",temp=RegExp.$1,temp.length==3?(this.red=parseInt
(temp.charAt(0)+temp.charAt(0),16),this.green=parseInt(temp.charAt(1)+temp.charAt(1),16),this.blue=parseInt(temp.charAt(2)+temp.charAt(2),16)):(this.red=parseInt(temp.substring(0,2),16),this.green=parseInt(temp.substring(2,4),16),this.blue=parseInt(temp.substring
(4,6),16))):/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(text)?(this.type="color",this.red=+RegExp.$1,this.green=+RegExp.$2,this.blue=+RegExp.$3):/^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)?(this.type="color",this.red=+RegExp.$1*255/100
,this.green=+RegExp.$2*255/100,this.blue=+RegExp.$3*255/100):/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/i.test(text)?(this.type="color",this.red=+RegExp.$1,this.green=+RegExp.$2,this.blue=+RegExp.$3,this.alpha=+RegExp.$4):/^rgba\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i
.test(text)?(this.type="color",this.red=+RegExp.$1*255/100,this.green=+RegExp.$2*255/100,this.blue=+RegExp.$3*255/100,this.alpha=+RegExp.$4):/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)?(this.type="color",this.hue=+RegExp.$1,this.saturation=+
RegExp.$2/100,this.lightness=+RegExp.$3/100):/^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text)?(this.type="color",this.hue=+RegExp.$1,this.saturation=+RegExp.$2/100,this.lightness=+RegExp.$3/100,this.alpha=+RegExp.$4):/^url\(["']?([^\)"']+)["']?\)/i
.test(text)?(this.type="uri",this.uri=RegExp.$1):/^([^\(]+)\(/i.test(text)?(this.type="function",this.name=RegExp.$1,this.value=text):/^["'][^"']*["']/.test(text)?(this.type="string",this.value=eval(text)):Colors[text.toLowerCase()]?(this.type="color",temp=
Colors[text.toLowerCase()].substring(1),this.red=parseInt(temp.substring(0,2),16),this.green=parseInt(temp.substring(2,4),16),this.blue=parseInt(temp.substring(4,6),16)):/^[\,\/]$/.test(text)?(this.type="operator",this.value=text):/^[a-z\-\u0080-\uFFFF][a-z0-9\-\u0080-\uFFFF]*$/i
.test(text)&&(this.type="identifier",this.value=text)}function Selector(e,t,n){SyntaxUnit.call(this,e.join(" "),t,n,Parser.SELECTOR_TYPE),this.parts=e,this.specificity=Specificity.calculate(this)}function SelectorPart(e,t,n,r,i){SyntaxUnit.call(this,n,r,i,Parser
.SELECTOR_PART_TYPE),this.elementName=e,this.modifiers=t}function SelectorSubPart(e,t,n,r){SyntaxUnit.call(this,e,n,r,Parser.SELECTOR_SUB_PART_TYPE),this.type=t,this.args=[]}function Specificity(e,t,n,r){this.a=e,this.b=t,this.c=n,this.d=r}function isHexDigit
(e){return e!==null&&h.test(e)}function isDigit(e){return e!==null&&/\d/.test(e)}function isWhitespace(e){return e!==null&&/\s/.test(e)}function isNewLine(e){return e!==null&&nl.test(e)}function isNameStart(e){return e!==null&&/[a-z_\u0080-\uFFFF\\]/i.test(
e)}function isNameChar(e){return e!==null&&(isNameStart(e)||/[0-9\-\\]/.test(e))}function isIdentStart(e){return e!==null&&(isNameStart(e)||/\-\\/.test(e))}function mix(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function TokenStream(e){TokenStreamBase
.call(this,e,Tokens)}function ValidationError(e,t,n){this.col=n,this.line=t,this.message=e}var EventTarget=parserlib.util.EventTarget,TokenStreamBase=parserlib.util.TokenStreamBase,StringReader=parserlib.util.StringReader,SyntaxError=parserlib.util.SyntaxError
,SyntaxUnit=parserlib.util.SyntaxUnit,Colors={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a"
,burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen
:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet
:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080"
,green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral
:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0"
,lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a"
,mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500"
,orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown
:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f"
,steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32",activeBorder:"Active window border.",activecaption
:"Active window caption.",appworkspace:"Background color of multiple document interface.",background:"Desktop background.",buttonface:"The face background color for 3-D elements that appear 3-D due to one layer of surrounding border.",buttonhighlight:"The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border."
,buttonshadow:"The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border.",buttontext:"Text on push buttons.",captiontext:"Text in caption, size box, and scrollbar arrow box.",graytext:"Grayed (disabled) text. This color is set to #000 if the current display driver does not support a solid gray color."
,highlight:"Item(s) selected in a control.",highlighttext:"Text of item(s) selected in a control.",inactiveborder:"Inactive window border.",inactivecaption:"Inactive window caption.",inactivecaptiontext:"Color of text in an inactive caption.",infobackground
:"Background color for tooltip controls.",infotext:"Text color for tooltip controls.",menu:"Menu background.",menutext:"Text in menus.",scrollbar:"Scroll bar gray area.",threeddarkshadow:"The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border."
,threedface:"The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",threedhighlight:"The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border."
,threedlightshadow:"The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",threedshadow:"The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border."
,window:"Window background.",windowframe:"Window frame.",windowtext:"Text in windows."};Combinator.prototype=new SyntaxUnit,Combinator.prototype.constructor=Combinator,MediaFeature.prototype=new SyntaxUnit,MediaFeature.prototype.constructor=MediaFeature,MediaQuery
.prototype=new SyntaxUnit,MediaQuery.prototype.constructor=MediaQuery,Parser.DEFAULT_TYPE=0,Parser.COMBINATOR_TYPE=1,Parser.MEDIA_FEATURE_TYPE=2,Parser.MEDIA_QUERY_TYPE=3,Parser.PROPERTY_NAME_TYPE=4,Parser.PROPERTY_VALUE_TYPE=5,Parser.PROPERTY_VALUE_PART_TYPE=6
,Parser.SELECTOR_TYPE=7,Parser.SELECTOR_PART_TYPE=8,Parser.SELECTOR_SUB_PART_TYPE=9,Parser.prototype=function(){var e=new EventTarget,t,n={constructor:Parser,DEFAULT_TYPE:0,COMBINATOR_TYPE:1,MEDIA_FEATURE_TYPE:2,MEDIA_QUERY_TYPE:3,PROPERTY_NAME_TYPE:4,PROPERTY_VALUE_TYPE
:5,PROPERTY_VALUE_PART_TYPE:6,SELECTOR_TYPE:7,SELECTOR_PART_TYPE:8,SELECTOR_SUB_PART_TYPE:9,_stylesheet:function(){var e=this._tokenStream,t=null,n,r,i;this.fire("startstylesheet"),this._charset(),this._skipCruft();while(e.peek()==Tokens.IMPORT_SYM)this._import
(),this._skipCruft();while(e.peek()==Tokens.NAMESPACE_SYM)this._namespace(),this._skipCruft();i=e.peek();while(i>Tokens.EOF){try{switch(i){case Tokens.MEDIA_SYM:this._media(),this._skipCruft();break;case Tokens.PAGE_SYM:this._page(),this._skipCruft();break;
case Tokens.FONT_FACE_SYM:this._font_face(),this._skipCruft();break;case Tokens.KEYFRAMES_SYM:this._keyframes(),this._skipCruft();break;case Tokens.VIEWPORT_SYM:this._viewport(),this._skipCruft();break;case Tokens.UNKNOWN_SYM:e.get();if(!!this.options.strict
)throw new SyntaxError("Unknown @ rule.",e.LT(0).startLine,e.LT(0).startCol);this.fire({type:"error",error:null,message:"Unknown @ rule: "+e.LT(0).value+".",line:e.LT(0).startLine,col:e.LT(0).startCol}),n=0;while(e.advance([Tokens.LBRACE,Tokens.RBRACE])==Tokens
.LBRACE)n++;while(n)e.advance([Tokens.RBRACE]),n--;break;case Tokens.S:this._readWhitespace();break;default:if(!this._ruleset())switch(i){case Tokens.CHARSET_SYM:throw r=e.LT(1),this._charset(!1),new SyntaxError("@charset not allowed here.",r.startLine,r.startCol
);case Tokens.IMPORT_SYM:throw r=e.LT(1),this._import(!1),new SyntaxError("@import not allowed here.",r.startLine,r.startCol);case Tokens.NAMESPACE_SYM:throw r=e.LT(1),this._namespace(!1),new SyntaxError("@namespace not allowed here.",r.startLine,r.startCol
);default:e.get(),this._unexpectedToken(e.token())}}}catch(s){if(!(s instanceof SyntaxError&&!this.options.strict))throw s;this.fire({type:"error",error:s,message:s.message,line:s.line,col:s.col})}i=e.peek()}i!=Tokens.EOF&&this._unexpectedToken(e.token()),this
.fire("endstylesheet")},_charset:function(e){var t=this._tokenStream,n,r,i,s;t.match(Tokens.CHARSET_SYM)&&(i=t.token().startLine,s=t.token().startCol,this._readWhitespace(),t.mustMatch(Tokens.STRING),r=t.token(),n=r.value,this._readWhitespace(),t.mustMatch(
Tokens.SEMICOLON),e!==!1&&this.fire({type:"charset",charset:n,line:i,col:s}))},_import:function(e){var t=this._tokenStream,n,r,i,s=[];t.mustMatch(Tokens.IMPORT_SYM),i=t.token(),this._readWhitespace(),t.mustMatch([Tokens.STRING,Tokens.URI]),r=t.token().value
.replace(/(?:url\()?["']([^"']+)["']\)?/,"$1"),this._readWhitespace(),s=this._media_query_list(),t.mustMatch(Tokens.SEMICOLON),this._readWhitespace(),e!==!1&&this.fire({type:"import",uri:r,media:s,line:i.startLine,col:i.startCol})},_namespace:function(e){var t=
this._tokenStream,n,r,i,s;t.mustMatch(Tokens.NAMESPACE_SYM),n=t.token().startLine,r=t.token().startCol,this._readWhitespace(),t.match(Tokens.IDENT)&&(i=t.token().value,this._readWhitespace()),t.mustMatch([Tokens.STRING,Tokens.URI]),s=t.token().value.replace
(/(?:url\()?["']([^"']+)["']\)?/,"$1"),this._readWhitespace(),t.mustMatch(Tokens.SEMICOLON),this._readWhitespace(),e!==!1&&this.fire({type:"namespace",prefix:i,uri:s,line:n,col:r})},_media:function(){var e=this._tokenStream,t,n,r;e.mustMatch(Tokens.MEDIA_SYM
),t=e.token().startLine,n=e.token().startCol,this._readWhitespace(),r=this._media_query_list(),e.mustMatch(Tokens.LBRACE),this._readWhitespace(),this.fire({type:"startmedia",media:r,line:t,col:n});for(;;)if(e.peek()==Tokens.PAGE_SYM)this._page();else if(e.peek
()==Tokens.FONT_FACE_SYM)this._font_face();else if(!this._ruleset())break;e.mustMatch(Tokens.RBRACE),this._readWhitespace(),this.fire({type:"endmedia",media:r,line:t,col:n})},_media_query_list:function(){var e=this._tokenStream,t=[];this._readWhitespace(),(
e.peek()==Tokens.IDENT||e.peek()==Tokens.LPAREN)&&t.push(this._media_query());while(e.match(Tokens.COMMA))this._readWhitespace(),t.push(this._media_query());return t},_media_query:function(){var e=this._tokenStream,t=null,n=null,r=null,i=[];e.match(Tokens.IDENT
)&&(n=e.token().value.toLowerCase(),n!="only"&&n!="not"?(e.unget(),n=null):r=e.token()),this._readWhitespace(),e.peek()==Tokens.IDENT?(t=this._media_type(),r===null&&(r=e.token())):e.peek()==Tokens.LPAREN&&(r===null&&(r=e.LT(1)),i.push(this._media_expression
()));if(t===null&&i.length===0)return null;this._readWhitespace();while(e.match(Tokens.IDENT))e.token().value.toLowerCase()!="and"&&this._unexpectedToken(e.token()),this._readWhitespace(),i.push(this._media_expression());return new MediaQuery(n,t,i,r.startLine
,r.startCol)},_media_type:function(){return this._media_feature()},_media_expression:function(){var e=this._tokenStream,t=null,n,r=null;return e.mustMatch(Tokens.LPAREN),t=this._media_feature(),this._readWhitespace(),e.match(Tokens.COLON)&&(this._readWhitespace
(),n=e.LT(1),r=this._expression()),e.mustMatch(Tokens.RPAREN),this._readWhitespace(),new MediaFeature(t,r?new SyntaxUnit(r,n.startLine,n.startCol):null)},_media_feature:function(){var e=this._tokenStream;return e.mustMatch(Tokens.IDENT),SyntaxUnit.fromToken
(e.token())},_page:function(){var e=this._tokenStream,t,n,r=null,i=null;e.mustMatch(Tokens.PAGE_SYM),t=e.token().startLine,n=e.token().startCol,this._readWhitespace(),e.match(Tokens.IDENT)&&(r=e.token().value,r.toLowerCase()==="auto"&&this._unexpectedToken(
e.token())),e.peek()==Tokens.COLON&&(i=this._pseudo_page()),this._readWhitespace(),this.fire({type:"startpage",id:r,pseudo:i,line:t,col:n}),this._readDeclarations(!0,!0),this.fire({type:"endpage",id:r,pseudo:i,line:t,col:n})},_margin:function(){var e=this._tokenStream
,t,n,r=this._margin_sym();return r?(t=e.token().startLine,n=e.token().startCol,this.fire({type:"startpagemargin",margin:r,line:t,col:n}),this._readDeclarations(!0),this.fire({type:"endpagemargin",margin:r,line:t,col:n}),!0):!1},_margin_sym:function(){var e=
this._tokenStream;return e.match([Tokens.TOPLEFTCORNER_SYM,Tokens.TOPLEFT_SYM,Tokens.TOPCENTER_SYM,Tokens.TOPRIGHT_SYM,Tokens.TOPRIGHTCORNER_SYM,Tokens.BOTTOMLEFTCORNER_SYM,Tokens.BOTTOMLEFT_SYM,Tokens.BOTTOMCENTER_SYM,Tokens.BOTTOMRIGHT_SYM,Tokens.BOTTOMRIGHTCORNER_SYM
,Tokens.LEFTTOP_SYM,Tokens.LEFTMIDDLE_SYM,Tokens.LEFTBOTTOM_SYM,Tokens.RIGHTTOP_SYM,Tokens.RIGHTMIDDLE_SYM,Tokens.RIGHTBOTTOM_SYM])?SyntaxUnit.fromToken(e.token()):null},_pseudo_page:function(){var e=this._tokenStream;return e.mustMatch(Tokens.COLON),e.mustMatch
(Tokens.IDENT),e.token().value},_font_face:function(){var e=this._tokenStream,t,n;e.mustMatch(Tokens.FONT_FACE_SYM),t=e.token().startLine,n=e.token().startCol,this._readWhitespace(),this.fire({type:"startfontface",line:t,col:n}),this._readDeclarations(!0),this
.fire({type:"endfontface",line:t,col:n})},_viewport:function(){var e=this._tokenStream,t,n;e.mustMatch(Tokens.VIEWPORT_SYM),t=e.token().startLine,n=e.token().startCol,this._readWhitespace(),this.fire({type:"startviewport",line:t,col:n}),this._readDeclarations
(!0),this.fire({type:"endviewport",line:t,col:n})},_operator:function(e){var t=this._tokenStream,n=null;if(t.match([Tokens.SLASH,Tokens.COMMA])||e&&t.match([Tokens.PLUS,Tokens.STAR,Tokens.MINUS]))n=t.token(),this._readWhitespace();return n?PropertyValuePart
.fromToken(n):null},_combinator:function(){var e=this._tokenStream,t=null,n;return e.match([Tokens.PLUS,Tokens.GREATER,Tokens.TILDE])&&(n=e.token(),t=new Combinator(n.value,n.startLine,n.startCol),this._readWhitespace()),t},_unary_operator:function(){var e=
this._tokenStream;return e.match([Tokens.MINUS,Tokens.PLUS])?e.token().value:null},_property:function(){var e=this._tokenStream,t=null,n=null,r,i,s,o;return e.peek()==Tokens.STAR&&this.options.starHack&&(e.get(),i=e.token(),n=i.value,s=i.startLine,o=i.startCol
),e.match(Tokens.IDENT)&&(i=e.token(),r=i.value,r.charAt(0)=="_"&&this.options.underscoreHack&&(n="_",r=r.substring(1)),t=new PropertyName(r,n,s||i.startLine,o||i.startCol),this._readWhitespace()),t},_ruleset:function(){var e=this._tokenStream,t,n;try{n=this
._selectors_group()}catch(r){if(r instanceof SyntaxError&&!this.options.strict){this.fire({type:"error",error:r,message:r.message,line:r.line,col:r.col}),t=e.advance([Tokens.RBRACE]);if(t!=Tokens.RBRACE)throw r;return!0}throw r}return n&&(this.fire({type:"startrule"
,selectors:n,line:n[0].line,col:n[0].col}),this._readDeclarations(!0),this.fire({type:"endrule",selectors:n,line:n[0].line,col:n[0].col})),n},_selectors_group:function(){var e=this._tokenStream,t=[],n;n=this._selector();if(n!==null){t.push(n);while(e.match(
Tokens.COMMA))this._readWhitespace(),n=this._selector(),n!==null?t.push(n):this._unexpectedToken(e.LT(1))}return t.length?t:null},_selector:function(){var e=this._tokenStream,t=[],n=null,r=null,i=null;n=this._simple_selector_sequence();if(n===null)return null
;t.push(n);do{r=this._combinator();if(r!==null)t.push(r),n=this._simple_selector_sequence(),n===null?this._unexpectedToken(e.LT(1)):t.push(n);else{if(!this._readWhitespace())break;i=new Combinator(e.token().value,e.token().startLine,e.token().startCol),r=this
._combinator(),n=this._simple_selector_sequence(),n===null?r!==null&&this._unexpectedToken(e.LT(1)):(r!==null?t.push(r):t.push(i),t.push(n))}}while(!0);return new Selector(t,t[0].line,t[0].col)},_simple_selector_sequence:function(){var e=this._tokenStream,t=
null,n=[],r="",i=[function(){return e.match(Tokens.HASH)?new SelectorSubPart(e.token().value,"id",e.token().startLine,e.token().startCol):null},this._class,this._attrib,this._pseudo,this._negation],s=0,o=i.length,u=null,a=!1,f,l;f=e.LT(1).startLine,l=e.LT(1
).startCol,t=this._type_selector(),t||(t=this._universal()),t!==null&&(r+=t);for(;;){if(e.peek()===Tokens.S)break;while(s<o&&u===null)u=i[s++].call(this);if(u===null){if(r==="")return null;break}s=0,n.push(u),r+=u.toString(),u=null}return r!==""?new SelectorPart
(t,n,r,f,l):null},_type_selector:function(){var e=this._tokenStream,t=this._namespace_prefix(),n=this._element_name();return n?(t&&(n.text=t+n.text,n.col-=t.length),n):(t&&(e.unget(),t.length>1&&e.unget()),null)},_class:function(){var e=this._tokenStream,t;
return e.match(Tokens.DOT)?(e.mustMatch(Tokens.IDENT),t=e.token(),new SelectorSubPart("."+t.value,"class",t.startLine,t.startCol-1)):null},_element_name:function(){var e=this._tokenStream,t;return e.match(Tokens.IDENT)?(t=e.token(),new SelectorSubPart(t.value
,"elementName",t.startLine,t.startCol)):null},_namespace_prefix:function(){var e=this._tokenStream,t="";if(e.LA(1)===Tokens.PIPE||e.LA(2)===Tokens.PIPE)e.match([Tokens.IDENT,Tokens.STAR])&&(t+=e.token().value),e.mustMatch(Tokens.PIPE),t+="|";return t.length?
t:null},_universal:function(){var e=this._tokenStream,t="",n;return n=this._namespace_prefix(),n&&(t+=n),e.match(Tokens.STAR)&&(t+="*"),t.length?t:null},_attrib:function(){var e=this._tokenStream,t=null,n,r;return e.match(Tokens.LBRACKET)?(r=e.token(),t=r.value
,t+=this._readWhitespace(),n=this._namespace_prefix(),n&&(t+=n),e.mustMatch(Tokens.IDENT),t+=e.token().value,t+=this._readWhitespace(),e.match([Tokens.PREFIXMATCH,Tokens.SUFFIXMATCH,Tokens.SUBSTRINGMATCH,Tokens.EQUALS,Tokens.INCLUDES,Tokens.DASHMATCH])&&(t+=
e.token().value,t+=this._readWhitespace(),e.mustMatch([Tokens.IDENT,Tokens.STRING]),t+=e.token().value,t+=this._readWhitespace()),e.mustMatch(Tokens.RBRACKET),new SelectorSubPart(t+"]","attribute",r.startLine,r.startCol)):null},_pseudo:function(){var e=this
._tokenStream,t=null,n=":",r,i;return e.match(Tokens.COLON)&&(e.match(Tokens.COLON)&&(n+=":"),e.match(Tokens.IDENT)?(t=e.token().value,r=e.token().startLine,i=e.token().startCol-n.length):e.peek()==Tokens.FUNCTION&&(r=e.LT(1).startLine,i=e.LT(1).startCol-n.
length,t=this._functional_pseudo()),t&&(t=new SelectorSubPart(n+t,"pseudo",r,i))),t},_functional_pseudo:function(){var e=this._tokenStream,t=null;return e.match(Tokens.FUNCTION)&&(t=e.token().value,t+=this._readWhitespace(),t+=this._expression(),e.mustMatch
(Tokens.RPAREN),t+=")"),t},_expression:function(){var e=this._tokenStream,t="";while(e.match([Tokens.PLUS,Tokens.MINUS,Tokens.DIMENSION,Tokens.NUMBER,Tokens.STRING,Tokens.IDENT,Tokens.LENGTH,Tokens.FREQ,Tokens.ANGLE,Tokens.TIME,Tokens.RESOLUTION,Tokens.SLASH
]))t+=e.token().value,t+=this._readWhitespace();return t.length?t:null},_negation:function(){var e=this._tokenStream,t,n,r="",i,s=null;return e.match(Tokens.NOT)&&(r=e.token().value,t=e.token().startLine,n=e.token().startCol,r+=this._readWhitespace(),i=this
._negation_arg(),r+=i,r+=this._readWhitespace(),e.match(Tokens.RPAREN),r+=e.token().value,s=new SelectorSubPart(r,"not",t,n),s.args.push(i)),s},_negation_arg:function(){var e=this._tokenStream,t=[this._type_selector,this._universal,function(){return e.match
(Tokens.HASH)?new SelectorSubPart(e.token().value,"id",e.token().startLine,e.token().startCol):null},this._class,this._attrib,this._pseudo],n=null,r=0,i=t.length,s,o,u,a;o=e.LT(1).startLine,u=e.LT(1).startCol;while(r<i&&n===null)n=t[r].call(this),r++;return n===
null&&this._unexpectedToken(e.LT(1)),n.type=="elementName"?a=new SelectorPart(n,[],n.toString(),o,u):a=new SelectorPart(null,[n],n.toString(),o,u),a},_declaration:function(){var e=this._tokenStream,t=null,n=null,r=null,i=null,s=null,o="";t=this._property();
if(t!==null){e.mustMatch(Tokens.COLON),this._readWhitespace(),n=this._expr(),(!n||n.length===0)&&this._unexpectedToken(e.LT(1)),r=this._prio(),o=t.toString();if(this.options.starHack&&t.hack=="*"||this.options.underscoreHack&&t.hack=="_")o=t.text;try{this._validateProperty
(o,n)}catch(u){s=u}return this.fire({type:"property",property:t,value:n,important:r,line:t.line,col:t.col,invalid:s}),!0}return!1},_prio:function(){var e=this._tokenStream,t=e.match(Tokens.IMPORTANT_SYM);return this._readWhitespace(),t},_expr:function(e){var t=
this._tokenStream,n=[],r=null,i=null;r=this._term();if(r!==null){n.push(r);do{i=this._operator(e),i&&n.push(i),r=this._term();if(r===null)break;n.push(r)}while(!0)}return n.length>0?new PropertyValue(n,n[0].line,n[0].col):null},_term:function(){var e=this._tokenStream
,t=null,n=null,r,i,s;return t=this._unary_operator(),t!==null&&(i=e.token().startLine,s=e.token().startCol),e.peek()==Tokens.IE_FUNCTION&&this.options.ieFilters?(n=this._ie_function(),t===null&&(i=e.token().startLine,s=e.token().startCol)):e.match([Tokens.NUMBER
,Tokens.PERCENTAGE,Tokens.LENGTH,Tokens.ANGLE,Tokens.TIME,Tokens.FREQ,Tokens.STRING,Tokens.IDENT,Tokens.URI,Tokens.UNICODE_RANGE])?(n=e.token().value,t===null&&(i=e.token().startLine,s=e.token().startCol),this._readWhitespace()):(r=this._hexcolor(),r===null?
(t===null&&(i=e.LT(1).startLine,s=e.LT(1).startCol),n===null&&(e.LA(3)==Tokens.EQUALS&&this.options.ieFilters?n=this._ie_function():n=this._function())):(n=r.value,t===null&&(i=r.startLine,s=r.startCol))),n!==null?new PropertyValuePart(t!==null?t+n:n,i,s):null
},_function:function(){var e=this._tokenStream,t=null,n=null,r;if(e.match(Tokens.FUNCTION)){t=e.token().value,this._readWhitespace(),n=this._expr(!0),t+=n;if(this.options.ieFilters&&e.peek()==Tokens.EQUALS)do{this._readWhitespace()&&(t+=e.token().value),e.LA
(0)==Tokens.COMMA&&(t+=e.token().value),e.match(Tokens.IDENT),t+=e.token().value,e.match(Tokens.EQUALS),t+=e.token().value,r=e.peek();while(r!=Tokens.COMMA&&r!=Tokens.S&&r!=Tokens.RPAREN)e.get(),t+=e.token().value,r=e.peek()}while(e.match([Tokens.COMMA,Tokens
.S]));e.match(Tokens.RPAREN),t+=")",this._readWhitespace()}return t},_ie_function:function(){var e=this._tokenStream,t=null,n=null,r;if(e.match([Tokens.IE_FUNCTION,Tokens.FUNCTION])){t=e.token().value;do{this._readWhitespace()&&(t+=e.token().value),e.LA(0)==
Tokens.COMMA&&(t+=e.token().value),e.match(Tokens.IDENT),t+=e.token().value,e.match(Tokens.EQUALS),t+=e.token().value,r=e.peek();while(r!=Tokens.COMMA&&r!=Tokens.S&&r!=Tokens.RPAREN)e.get(),t+=e.token().value,r=e.peek()}while(e.match([Tokens.COMMA,Tokens.S]
));e.match(Tokens.RPAREN),t+=")",this._readWhitespace()}return t},_hexcolor:function(){var e=this._tokenStream,t=null,n;if(e.match(Tokens.HASH)){t=e.token(),n=t.value;if(!/#[a-f0-9]{3,6}/i.test(n))throw new SyntaxError("Expected a hex color but found '"+n+"' at line "+
t.startLine+", col "+t.startCol+".",t.startLine,t.startCol);this._readWhitespace()}return t},_keyframes:function(){var e=this._tokenStream,t,n,r,i="";e.mustMatch(Tokens.KEYFRAMES_SYM),t=e.token(),/^@\-([^\-]+)\-/.test(t.value)&&(i=RegExp.$1),this._readWhitespace
(),r=this._keyframe_name(),this._readWhitespace(),e.mustMatch(Tokens.LBRACE),this.fire({type:"startkeyframes",name:r,prefix:i,line:t.startLine,col:t.startCol}),this._readWhitespace(),n=e.peek();while(n==Tokens.IDENT||n==Tokens.PERCENTAGE)this._keyframe_rule
(),this._readWhitespace(),n=e.peek();this.fire({type:"endkeyframes",name:r,prefix:i,line:t.startLine,col:t.startCol}),this._readWhitespace(),e.mustMatch(Tokens.RBRACE)},_keyframe_name:function(){var e=this._tokenStream,t;return e.mustMatch([Tokens.IDENT,Tokens
.STRING]),SyntaxUnit.fromToken(e.token())},_keyframe_rule:function(){var e=this._tokenStream,t,n=this._key_list();this.fire({type:"startkeyframerule",keys:n,line:n[0].line,col:n[0].col}),this._readDeclarations(!0),this.fire({type:"endkeyframerule",keys:n,line
:n[0].line,col:n[0].col})},_key_list:function(){var e=this._tokenStream,t,n,r=[];r.push(this._key()),this._readWhitespace();while(e.match(Tokens.COMMA))this._readWhitespace(),r.push(this._key()),this._readWhitespace();return r},_key:function(){var e=this._tokenStream
,t;if(e.match(Tokens.PERCENTAGE))return SyntaxUnit.fromToken(e.token());if(e.match(Tokens.IDENT)){t=e.token();if(/from|to/i.test(t.value))return SyntaxUnit.fromToken(t);e.unget()}this._unexpectedToken(e.LT(1))},_skipCruft:function(){while(this._tokenStream.
match([Tokens.S,Tokens.CDO,Tokens.CDC]));},_readDeclarations:function(e,t){var n=this._tokenStream,r;this._readWhitespace(),e&&n.mustMatch(Tokens.LBRACE),this._readWhitespace();try{for(;;){if(!(n.match(Tokens.SEMICOLON)||t&&this._margin())){if(!this._declaration
())break;if(!n.match(Tokens.SEMICOLON))break}this._readWhitespace()}n.mustMatch(Tokens.RBRACE),this._readWhitespace()}catch(i){if(!(i instanceof SyntaxError&&!this.options.strict))throw i;this.fire({type:"error",error:i,message:i.message,line:i.line,col:i.col
}),r=n.advance([Tokens.SEMICOLON,Tokens.RBRACE]);if(r==Tokens.SEMICOLON)this._readDeclarations(!1,t);else if(r!=Tokens.RBRACE)throw i}},_readWhitespace:function(){var e=this._tokenStream,t="";while(e.match(Tokens.S))t+=e.token().value;return t},_unexpectedToken
:function(e){throw new SyntaxError("Unexpected token '"+e.value+"' at line "+e.startLine+", col "+e.startCol+".",e.startLine,e.startCol)},_verifyEnd:function(){this._tokenStream.LA(1)!=Tokens.EOF&&this._unexpectedToken(this._tokenStream.LT(1))},_validateProperty
:function(e,t){Validation.validate(e,t)},parse:function(e){this._tokenStream=new TokenStream(e,Tokens),this._stylesheet()},parseStyleSheet:function(e){return this.parse(e)},parseMediaQuery:function(e){this._tokenStream=new TokenStream(e,Tokens);var t=this._media_query
();return this._verifyEnd(),t},parsePropertyValue:function(e){this._tokenStream=new TokenStream(e,Tokens),this._readWhitespace();var t=this._expr();return this._readWhitespace(),this._verifyEnd(),t},parseRule:function(e){this._tokenStream=new TokenStream(e,
Tokens),this._readWhitespace();var t=this._ruleset();return this._readWhitespace(),this._verifyEnd(),t},parseSelector:function(e){this._tokenStream=new TokenStream(e,Tokens),this._readWhitespace();var t=this._selector();return this._readWhitespace(),this._verifyEnd
(),t},parseStyleAttribute:function(e){e+="}",this._tokenStream=new TokenStream(e,Tokens),this._readDeclarations()}};for(t in n)n.hasOwnProperty(t)&&(e[t]=n[t]);return e}();var Properties={"alignment-adjust":"auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | <percentage> | <length>"
,"alignment-baseline":"baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",animation:1,"animation-delay":{multi:"<time>",comma:!0},"animation-direction"
:{multi:"normal | alternate",comma:!0},"animation-duration":{multi:"<time>",comma:!0},"animation-iteration-count":{multi:"<number> | infinite",comma:!0},"animation-name":{multi:"none | <ident>",comma:!0},"animation-play-state":{multi:"running | paused",comma
:!0},"animation-timing-function":1,"-moz-animation-delay":{multi:"<time>",comma:!0},"-moz-animation-direction":{multi:"normal | alternate",comma:!0},"-moz-animation-duration":{multi:"<time>",comma:!0},"-moz-animation-iteration-count":{multi:"<number> | infinite"
,comma:!0},"-moz-animation-name":{multi:"none | <ident>",comma:!0},"-moz-animation-play-state":{multi:"running | paused",comma:!0},"-ms-animation-delay":{multi:"<time>",comma:!0},"-ms-animation-direction":{multi:"normal | alternate",comma:!0},"-ms-animation-duration"
:{multi:"<time>",comma:!0},"-ms-animation-iteration-count":{multi:"<number> | infinite",comma:!0},"-ms-animation-name":{multi:"none | <ident>",comma:!0},"-ms-animation-play-state":{multi:"running | paused",comma:!0},"-webkit-animation-delay":{multi:"<time>"
,comma:!0},"-webkit-animation-direction":{multi:"normal | alternate",comma:!0},"-webkit-animation-duration":{multi:"<time>",comma:!0},"-webkit-animation-iteration-count":{multi:"<number> | infinite",comma:!0},"-webkit-animation-name":{multi:"none | <ident>"
,comma:!0},"-webkit-animation-play-state":{multi:"running | paused",comma:!0},"-o-animation-delay":{multi:"<time>",comma:!0},"-o-animation-direction":{multi:"normal | alternate",comma:!0},"-o-animation-duration":{multi:"<time>",comma:!0},"-o-animation-iteration-count"
:{multi:"<number> | infinite",comma:!0},"-o-animation-name":{multi:"none | <ident>",comma:!0},"-o-animation-play-state":{multi:"running | paused",comma:!0},appearance:"icon | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal | none | inherit"
,azimuth:function(e){var t="<angle> | leftwards | rightwards | inherit",n="left-side | far-left | left | center-left | center | center-right | right | far-right | right-side",r=!1,i=!1,s;ValidationTypes.isAny(e,t)||(ValidationTypes.isAny(e,"behind")&&(r=!0,
i=!0),ValidationTypes.isAny(e,n)&&(i=!0,r||ValidationTypes.isAny(e,"behind")));if(e.hasNext())throw s=e.next(),i?new ValidationError("Expected end of value but found '"+s+"'.",s.line,s.col):new ValidationError("Expected (<'azimuth'>) but found '"+s+"'.",s.line
,s.col)},"backface-visibility":"visible | hidden",background:1,"background-attachment":{multi:"<attachment>",comma:!0},"background-clip":{multi:"<box>",comma:!0},"background-color":"<color> | inherit","background-image":{multi:"<bg-image>",comma:!0},"background-origin"
:{multi:"<box>",comma:!0},"background-position":{multi:"<bg-position>",comma:!0},"background-repeat":{multi:"<repeat-style>"},"background-size":{multi:"<bg-size>",comma:!0},"baseline-shift":"baseline | sub | super | <percentage> | <length>",behavior:1,binding
:1,bleed:"<length>","bookmark-label":"<content> | <attr> | <string>","bookmark-level":"none | <integer>","bookmark-state":"open | closed","bookmark-target":"none | <uri> | <attr>",border:"<border-width> || <border-style> || <color>","border-bottom":"<border-width> || <border-style> || <color>"
,"border-bottom-color":"<color> | inherit","border-bottom-left-radius":"<x-one-radius>","border-bottom-right-radius":"<x-one-radius>","border-bottom-style":"<border-style>","border-bottom-width":"<border-width>","border-collapse":"collapse | separate | inherit"
,"border-color":{multi:"<color> | inherit",max:4},"border-image":1,"border-image-outset":{multi:"<length> | <number>",max:4},"border-image-repeat":{multi:"stretch | repeat | round",max:2},"border-image-slice":function(e){var t=!1,n="<number> | <percentage>"
,r=!1,i=0,s=4,o;ValidationTypes.isAny(e,"fill")&&(r=!0,t=!0);while(e.hasNext()&&i<s){t=ValidationTypes.isAny(e,n);if(!t)break;i++}r?t=!0:ValidationTypes.isAny(e,"fill");if(e.hasNext())throw o=e.next(),t?new ValidationError("Expected end of value but found '"+
o+"'.",o.line,o.col):new ValidationError("Expected ([<number> | <percentage>]{1,4} && fill?) but found '"+o+"'.",o.line,o.col)},"border-image-source":"<image> | none","border-image-width":{multi:"<length> | <percentage> | <number> | auto",max:4},"border-left"
:"<border-width> || <border-style> || <color>","border-left-color":"<color> | inherit","border-left-style":"<border-style>","border-left-width":"<border-width>","border-radius":function(e){var t=!1,n="<length> | <percentage> | inherit",r=!1,i=!1,s=0,o=8,u;while(
e.hasNext()&&s<o){t=ValidationTypes.isAny(e,n);if(!t){if(!(e.peek()=="/"&&s>0&&!r))break;r=!0,o=s+5,e.next()}s++}if(e.hasNext())throw u=e.next(),t?new ValidationError("Expected end of value but found '"+u+"'.",u.line,u.col):new ValidationError("Expected (<'border-radius'>) but found '"+
u+"'.",u.line,u.col)},"border-right":"<border-width> || <border-style> || <color>","border-right-color":"<color> | inherit","border-right-style":"<border-style>","border-right-width":"<border-width>","border-spacing":{multi:"<length> | inherit",max:2},"border-style"
:{multi:"<border-style>",max:4},"border-top":"<border-width> || <border-style> || <color>","border-top-color":"<color> | inherit","border-top-left-radius":"<x-one-radius>","border-top-right-radius":"<x-one-radius>","border-top-style":"<border-style>","border-top-width"
:"<border-width>","border-width":{multi:"<border-width>",max:4},bottom:"<margin-width> | inherit","box-align":"start | end | center | baseline | stretch","box-decoration-break":"slice |clone","box-direction":"normal | reverse | inherit","box-flex":"<number>"
,"box-flex-group":"<integer>","box-lines":"single | multiple","box-ordinal-group":"<integer>","box-orient":"horizontal | vertical | inline-axis | block-axis | inherit","box-pack":"start | end | center | justify","box-shadow":function(e){var t=!1,n;if(!ValidationTypes
.isAny(e,"none"))Validation.multiProperty("<shadow>",e,!0,Infinity);else if(e.hasNext())throw n=e.next(),new ValidationError("Expected end of value but found '"+n+"'.",n.line,n.col)},"box-sizing":"content-box | border-box | inherit","break-after":"auto | always | avoid | left | right | page | column | avoid-page | avoid-column"
,"break-before":"auto | always | avoid | left | right | page | column | avoid-page | avoid-column","break-inside":"auto | avoid | avoid-page | avoid-column","caption-side":"top | bottom | inherit",clear:"none | right | left | both | inherit",clip:1,color:"<color> | inherit"
,"color-profile":1,"column-count":"<integer> | auto","column-fill":"auto | balance","column-gap":"<length> | normal","column-rule":"<border-width> || <border-style> || <color>","column-rule-color":"<color>","column-rule-style":"<border-style>","column-rule-width"
:"<border-width>","column-span":"none | all","column-width":"<length> | auto",columns:1,content:1,"counter-increment":1,"counter-reset":1,crop:"<shape> | auto",cue:"cue-after | cue-before | inherit","cue-after":1,"cue-before":1,cursor:1,direction:"ltr | rtl | inherit"
,display:"inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | box | inline-box | grid | inline-grid | none | inherit | -moz-box | -moz-inline-block | -moz-inline-box | -moz-inline-grid | -moz-inline-stack | -moz-inline-table | -moz-grid | -moz-grid-group | -moz-grid-line | -moz-groupbox | -moz-deck | -moz-popup | -moz-stack | -moz-marker | -webkit-box | -webkit-inline-box"
,"dominant-baseline":1,"drop-initial-after-adjust":"central | middle | after-edge | text-after-edge | ideographic | alphabetic | mathematical | <percentage> | <length>","drop-initial-after-align":"baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical"
,"drop-initial-before-adjust":"before-edge | text-before-edge | central | middle | hanging | mathematical | <percentage> | <length>","drop-initial-before-align":"caps-height | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical"
,"drop-initial-size":"auto | line | <length> | <percentage>","drop-initial-value":"initial | <integer>",elevation:"<angle> | below | level | above | higher | lower | inherit","empty-cells":"show | hide | inherit",filter:1,fit:"fill | hidden | meet | slice","fit-position"
:1,"float":"left | right | none | inherit","float-offset":1,font:1,"font-family":1,"font-size":"<absolute-size> | <relative-size> | <length> | <percentage> | inherit","font-size-adjust":"<number> | none | inherit","font-stretch":"normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | inherit"
,"font-style":"normal | italic | oblique | inherit","font-variant":"normal | small-caps | inherit","font-weight":"normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | inherit","grid-cell-stacking":"columns | rows | layer"
,"grid-column":1,"grid-columns":1,"grid-column-align":"start | end | center | stretch","grid-column-sizing":1,"grid-column-span":"<integer>","grid-flow":"none | rows | columns","grid-layer":"<integer>","grid-row":1,"grid-rows":1,"grid-row-align":"start | end | center | stretch"
,"grid-row-span":"<integer>","grid-row-sizing":1,"hanging-punctuation":1,height:"<margin-width> | inherit","hyphenate-after":"<integer> | auto","hyphenate-before":"<integer> | auto","hyphenate-character":"<string> | auto","hyphenate-lines":"no-limit | <integer>"
,"hyphenate-resource":1,hyphens:"none | manual | auto",icon:1,"image-orientation":"angle | auto","image-rendering":1,"image-resolution":1,"inline-box-align":"initial | last | <integer>",left:"<margin-width> | inherit","letter-spacing":"<length> | normal | inherit"
,"line-height":"<number> | <length> | <percentage> | normal | inherit","line-break":"auto | loose | normal | strict","line-stacking":1,"line-stacking-ruby":"exclude-ruby | include-ruby","line-stacking-shift":"consider-shifts | disregard-shifts","line-stacking-strategy"
:"inline-line-height | block-line-height | max-height | grid-height","list-style":1,"list-style-image":"<uri> | none | inherit","list-style-position":"inside | outside | inherit","list-style-type":"disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none | inherit"
,margin:{multi:"<margin-width> | inherit",max:4},"margin-bottom":"<margin-width> | inherit","margin-left":"<margin-width> | inherit","margin-right":"<margin-width> | inherit","margin-top":"<margin-width> | inherit",mark:1,"mark-after":1,"mark-before":1,marks
:1,"marquee-direction":1,"marquee-play-count":1,"marquee-speed":1,"marquee-style":1,"max-height":"<length> | <percentage> | none | inherit","max-width":"<length> | <percentage> | none | inherit","min-height":"<length> | <percentage> | inherit","min-width":"<length> | <percentage> | inherit"
,"move-to":1,"nav-down":1,"nav-index":1,"nav-left":1,"nav-right":1,"nav-up":1,opacity:"<number> | inherit",orphans:"<integer> | inherit",outline:1,"outline-color":"<color> | invert | inherit","outline-offset":1,"outline-style":"<border-style> | inherit","outline-width"
:"<border-width> | inherit",overflow:"visible | hidden | scroll | auto | inherit","overflow-style":1,"overflow-x":1,"overflow-y":1,padding:{multi:"<padding-width> | inherit",max:4},"padding-bottom":"<padding-width> | inherit","padding-left":"<padding-width> | inherit"
,"padding-right":"<padding-width> | inherit","padding-top":"<padding-width> | inherit",page:1,"page-break-after":"auto | always | avoid | left | right | inherit","page-break-before":"auto | always | avoid | left | right | inherit","page-break-inside":"auto | avoid | inherit"
,"page-policy":1,pause:1,"pause-after":1,"pause-before":1,perspective:1,"perspective-origin":1,phonemes:1,pitch:1,"pitch-range":1,"play-during":1,"pointer-events":"auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit"
,position:"static | relative | absolute | fixed | inherit","presentation-level":1,"punctuation-trim":1,quotes:1,"rendering-intent":1,resize:1,rest:1,"rest-after":1,"rest-before":1,richness:1,right:"<margin-width> | inherit",rotation:1,"rotation-point":1,"ruby-align"
:1,"ruby-overhang":1,"ruby-position":1,"ruby-span":1,size:1,speak:"normal | none | spell-out | inherit","speak-header":"once | always | inherit","speak-numeral":"digits | continuous | inherit","speak-punctuation":"code | none | inherit","speech-rate":1,src:1
,stress:1,"string-set":1,"table-layout":"auto | fixed | inherit","tab-size":"<integer> | <length>",target:1,"target-name":1,"target-new":1,"target-position":1,"text-align":"left | right | center | justify | inherit","text-align-last":1,"text-decoration":1,"text-emphasis"
:1,"text-height":1,"text-indent":"<length> | <percentage> | inherit","text-justify":"auto | none | inter-word | inter-ideograph | inter-cluster | distribute | kashida","text-outline":1,"text-overflow":1,"text-rendering":"auto | optimizeSpeed | optimizeLegibility | geometricPrecision | inherit"
,"text-shadow":1,"text-transform":"capitalize | uppercase | lowercase | none | inherit","text-wrap":"normal | none | avoid",top:"<margin-width> | inherit",transform:1,"transform-origin":1,"transform-style":1,transition:1,"transition-delay":1,"transition-duration"
:1,"transition-property":1,"transition-timing-function":1,"unicode-bidi":"normal | embed | bidi-override | inherit","user-modify":"read-only | read-write | write-only | inherit","user-select":"none | text | toggle | element | elements | all | inherit","vertical-align"
:"auto | use-script | baseline | sub | super | top | text-top | central | middle | bottom | text-bottom | <percentage> | <length>",visibility:"visible | hidden | collapse | inherit","voice-balance":1,"voice-duration":1,"voice-family":1,"voice-pitch":1,"voice-pitch-range"
:1,"voice-rate":1,"voice-stress":1,"voice-volume":1,volume:1,"white-space":"normal | pre | nowrap | pre-wrap | pre-line | inherit | -pre-wrap | -o-pre-wrap | -moz-pre-wrap | -hp-pre-wrap","white-space-collapse":1,widows:"<integer> | inherit",width:"<length> | <percentage> | auto | inherit"
,"word-break":"normal | keep-all | break-all","word-spacing":"<length> | normal | inherit","word-wrap":1,"z-index":"<integer> | auto | inherit",zoom:"<number> | <percentage> | normal"};PropertyName.prototype=new SyntaxUnit,PropertyName.prototype.constructor=
PropertyName,PropertyName.prototype.toString=function(){return(this.hack?this.hack:"")+this.text},PropertyValue.prototype=new SyntaxUnit,PropertyValue.prototype.constructor=PropertyValue,PropertyValueIterator.prototype.count=function(){return this._parts.length
},PropertyValueIterator.prototype.isFirst=function(){return this._i===0},PropertyValueIterator.prototype.hasNext=function(){return this._i<this._parts.length},PropertyValueIterator.prototype.mark=function(){this._marks.push(this._i)},PropertyValueIterator.prototype
.peek=function(e){return this.hasNext()?this._parts[this._i+(e||0)]:null},PropertyValueIterator.prototype.next=function(){return this.hasNext()?this._parts[this._i++]:null},PropertyValueIterator.prototype.previous=function(){return this._i>0?this._parts[--this
._i]:null},PropertyValueIterator.prototype.restore=function(){this._marks.length&&(this._i=this._marks.pop())},PropertyValuePart.prototype=new SyntaxUnit,PropertyValuePart.prototype.constructor=PropertyValuePart,PropertyValuePart.fromToken=function(e){return new
PropertyValuePart(e.value,e.startLine,e.startCol)};var Pseudos={":first-letter":1,":first-line":1,":before":1,":after":1};Pseudos.ELEMENT=1,Pseudos.CLASS=2,Pseudos.isElement=function(e){return e.indexOf("::")===0||Pseudos[e.toLowerCase()]==Pseudos.ELEMENT},
Selector.prototype=new SyntaxUnit,Selector.prototype.constructor=Selector,SelectorPart.prototype=new SyntaxUnit,SelectorPart.prototype.constructor=SelectorPart,SelectorSubPart.prototype=new SyntaxUnit,SelectorSubPart.prototype.constructor=SelectorSubPart,Specificity
.prototype={constructor:Specificity,compare:function(e){var t=["a","b","c","d"],n,r;for(n=0,r=t.length;n<r;n++){if(this[t[n]]<e[t[n]])return-1;if(this[t[n]]>e[t[n]])return 1}return 0},valueOf:function(){return this.a*1e3+this.b*100+this.c*10+this.d},toString
:function(){return this.a+","+this.b+","+this.c+","+this.d}},Specificity.calculate=function(e){function u(e){var t,n,r,a,f=e.elementName?e.elementName.text:"",l;f&&f.charAt(f.length-1)!="*"&&o++;for(t=0,r=e.modifiers.length;t<r;t++){l=e.modifiers[t];switch(
l.type){case"class":case"attribute":s++;break;case"id":i++;break;case"pseudo":Pseudos.isElement(l.text)?o++:s++;break;case"not":for(n=0,a=l.args.length;n<a;n++)u(l.args[n])}}}var t,n,r,i=0,s=0,o=0;for(t=0,n=e.parts.length;t<n;t++)r=e.parts[t],r instanceof SelectorPart&&
u(r);return new Specificity(0,i,s,o)};var h=/^[0-9a-fA-F]$/,nonascii=/^[\u0080-\uFFFF]$/,nl=/\n|\r\n|\r|\f/;TokenStream.prototype=mix(new TokenStreamBase,{_getToken:function(e){var t,n=this._reader,r=null,i=n.getLine(),s=n.getCol();t=n.read();while(t){switch(
t){case"/":n.peek()=="*"?r=this.commentToken(t,i,s):r=this.charToken(t,i,s);break;case"|":case"~":case"^":case"$":case"*":n.peek()=="="?r=this.comparisonToken(t,i,s):r=this.charToken(t,i,s);break;case'"':case"'":r=this.stringToken(t,i,s);break;case"#":isNameChar
(n.peek())?r=this.hashToken(t,i,s):r=this.charToken(t,i,s);break;case".":isDigit(n.peek())?r=this.numberToken(t,i,s):r=this.charToken(t,i,s);break;case"-":n.peek()=="-"?r=this.htmlCommentEndToken(t,i,s):isNameStart(n.peek())?r=this.identOrFunctionToken(t,i,
s):r=this.charToken(t,i,s);break;case"!":r=this.importantToken(t,i,s);break;case"@":r=this.atRuleToken(t,i,s);break;case":":r=this.notToken(t,i,s);break;case"<":r=this.htmlCommentStartToken(t,i,s);break;case"U":case"u":if(n.peek()=="+"){r=this.unicodeRangeToken
(t,i,s);break};default:isDigit(t)?r=this.numberToken(t,i,s):isWhitespace(t)?r=this.whitespaceToken(t,i,s):isIdentStart(t)?r=this.identOrFunctionToken(t,i,s):r=this.charToken(t,i,s)}break}return!r&&t===null&&(r=this.createToken(Tokens.EOF,null,i,s)),r},createToken
:function(e,t,n,r,i){var s=this._reader;return i=i||{},{value:t,type:e,channel:i.channel,hide:i.hide||!1,startLine:n,startCol:r,endLine:s.getLine(),endCol:s.getCol()}},atRuleToken:function(e,t,n){var r=e,i=this._reader,s=Tokens.CHAR,o=!1,u,a;i.mark(),u=this
.readName(),r=e+u,s=Tokens.type(r.toLowerCase());if(s==Tokens.CHAR||s==Tokens.UNKNOWN)r.length>1?s=Tokens.UNKNOWN_SYM:(s=Tokens.CHAR,r=e,i.reset());return this.createToken(s,r,t,n)},charToken:function(e,t,n){var r=Tokens.type(e);return r==-1&&(r=Tokens.CHAR
),this.createToken(r,e,t,n)},commentToken:function(e,t,n){var r=this._reader,i=this.readComment(e);return this.createToken(Tokens.COMMENT,i,t,n)},comparisonToken:function(e,t,n){var r=this._reader,i=e+r.read(),s=Tokens.type(i)||Tokens.CHAR;return this.createToken
(s,i,t,n)},hashToken:function(e,t,n){var r=this._reader,i=this.readName(e);return this.createToken(Tokens.HASH,i,t,n)},htmlCommentStartToken:function(e,t,n){var r=this._reader,i=e;return r.mark(),i+=r.readCount(3),i=="<!--"?this.createToken(Tokens.CDO,i,t,n
):(r.reset(),this.charToken(e,t,n))},htmlCommentEndToken:function(e,t,n){var r=this._reader,i=e;return r.mark(),i+=r.readCount(2),i=="-->"?this.createToken(Tokens.CDC,i,t,n):(r.reset(),this.charToken(e,t,n))},identOrFunctionToken:function(e,t,n){var r=this.
_reader,i=this.readName(e),s=Tokens.IDENT;return r.peek()=="("?(i+=r.read(),i.toLowerCase()=="url("?(s=Tokens.URI,i=this.readURI(i),i.toLowerCase()=="url("&&(s=Tokens.FUNCTION)):s=Tokens.FUNCTION):r.peek()==":"&&i.toLowerCase()=="progid"&&(i+=r.readTo("("),
s=Tokens.IE_FUNCTION),this.createToken(s,i,t,n)},importantToken:function(e,t,n){var r=this._reader,i=e,s=Tokens.CHAR,o,u;r.mark(),u=r.read();while(u){if(u=="/"){if(r.peek()!="*")break;o=this.readComment(u);if(o==="")break}else{if(!isWhitespace(u)){if(/i/i.test
(u)){o=r.readCount(8),/mportant/i.test(o)&&(i+=u+o,s=Tokens.IMPORTANT_SYM);break}break}i+=u+this.readWhitespace()}u=r.read()}return s==Tokens.CHAR?(r.reset(),this.charToken(e,t,n)):this.createToken(s,i,t,n)},notToken:function(e,t,n){var r=this._reader,i=e;return r
.mark(),i+=r.readCount(4),i.toLowerCase()==":not("?this.createToken(Tokens.NOT,i,t,n):(r.reset(),this.charToken(e,t,n))},numberToken:function(e,t,n){var r=this._reader,i=this.readNumber(e),s,o=Tokens.NUMBER,u=r.peek();return isIdentStart(u)?(s=this.readName
(r.read()),i+=s,/^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^vm$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(s)?o=Tokens.LENGTH:/^deg|^rad$|^grad$/i.test(s)?o=Tokens.ANGLE:/^ms$|^s$/i.test(s)?o=Tokens.TIME:/^hz$|^khz$/i.test(s)?o=Tokens.FREQ:/^dpi$|^dpcm$/i.test(s)?o=Tokens
.RESOLUTION:o=Tokens.DIMENSION):u=="%"&&(i+=r.read(),o=Tokens.PERCENTAGE),this.createToken(o,i,t,n)},stringToken:function(e,t,n){var r=e,i=e,s=this._reader,o=e,u=Tokens.STRING,a=s.read();while(a){i+=a;if(a==r&&o!="\\")break;if(isNewLine(s.peek())&&a!="\\"){
u=Tokens.INVALID;break}o=a,a=s.read()}return a===null&&(u=Tokens.INVALID),this.createToken(u,i,t,n)},unicodeRangeToken:function(e,t,n){var r=this._reader,i=e,s,o=Tokens.CHAR;return r.peek()=="+"&&(r.mark(),i+=r.read(),i+=this.readUnicodeRangePart(!0),i.length==2?
r.reset():(o=Tokens.UNICODE_RANGE,i.indexOf("?")==-1&&r.peek()=="-"&&(r.mark(),s=r.read(),s+=this.readUnicodeRangePart(!1),s.length==1?r.reset():i+=s))),this.createToken(o,i,t,n)},whitespaceToken:function(e,t,n){var r=this._reader,i=e+this.readWhitespace();
return this.createToken(Tokens.S,i,t,n)},readUnicodeRangePart:function(e){var t=this._reader,n="",r=t.peek();while(isHexDigit(r)&&n.length<6)t.read(),n+=r,r=t.peek();if(e)while(r=="?"&&n.length<6)t.read(),n+=r,r=t.peek();return n},readWhitespace:function(){
var e=this._reader,t="",n=e.peek();while(isWhitespace(n))e.read(),t+=n,n=e.peek();return t},readNumber:function(e){var t=this._reader,n=e,r=e==".",i=t.peek();while(i){if(isDigit(i))n+=t.read();else{if(i!=".")break;if(r)break;r=!0,n+=t.read()}i=t.peek()}return n
},readString:function(){var e=this._reader,t=e.read(),n=t,r=t,i=e.peek();while(i){i=e.read(),n+=i;if(i==t&&r!="\\")break;if(isNewLine(e.peek())&&i!="\\"){n="";break}r=i,i=e.peek()}return i===null&&(n=""),n},readURI:function(e){var t=this._reader,n=e,r="",i=
t.peek();t.mark();while(i&&isWhitespace(i))t.read(),i=t.peek();i=="'"||i=='"'?r=this.readString():r=this.readURL(),i=t.peek();while(i&&isWhitespace(i))t.read(),i=t.peek();return r===""||i!=")"?(n=e,t.reset()):n+=r+t.read(),n},readURL:function(){var e=this._reader
,t="",n=e.peek();while(/^[!#$%&\\*-~]$/.test(n))t+=e.read(),n=e.peek();return t},readName:function(e){var t=this._reader,n=e||"",r=t.peek();for(;;)if(r=="\\")n+=this.readEscape(t.read()),r=t.peek();else{if(!r||!isNameChar(r))break;n+=t.read(),r=t.peek()}return n
},readEscape:function(e){var t=this._reader,n=e||"",r=0,i=t.peek();if(isHexDigit(i))do n+=t.read(),i=t.peek();while(i&&isHexDigit(i)&&++r<6);return n.length==3&&/\s/.test(i)||n.length==7||n.length==1?t.read():i="",n+i},readComment:function(e){var t=this._reader
,n=e||"",r=t.read();if(r=="*"){while(r){n+=r;if(n.length>2&&r=="*"&&t.peek()=="/"){n+=t.read();break}r=t.read()}return n}return""}});var Tokens=[{name:"CDO"},{name:"CDC"},{name:"S",whitespace:!0},{name:"COMMENT",comment:!0,hide:!0,channel:"comment"},{name:"INCLUDES"
,text:"~="},{name:"DASHMATCH",text:"|="},{name:"PREFIXMATCH",text:"^="},{name:"SUFFIXMATCH",text:"$="},{name:"SUBSTRINGMATCH",text:"*="},{name:"STRING"},{name:"IDENT"},{name:"HASH"},{name:"IMPORT_SYM",text:"@import"},{name:"PAGE_SYM",text:"@page"},{name:"MEDIA_SYM"
,text:"@media"},{name:"FONT_FACE_SYM",text:"@font-face"},{name:"CHARSET_SYM",text:"@charset"},{name:"NAMESPACE_SYM",text:"@namespace"},{name:"VIEWPORT_SYM",text:"@viewport"},{name:"UNKNOWN_SYM"},{name:"KEYFRAMES_SYM",text:["@keyframes","@-webkit-keyframes","@-moz-keyframes"
,"@-o-keyframes"]},{name:"IMPORTANT_SYM"},{name:"LENGTH"},{name:"ANGLE"},{name:"TIME"},{name:"FREQ"},{name:"DIMENSION"},{name:"PERCENTAGE"},{name:"NUMBER"},{name:"URI"},{name:"FUNCTION"},{name:"UNICODE_RANGE"},{name:"INVALID"},{name:"PLUS",text:"+"},{name:"GREATER"
,text:">"},{name:"COMMA",text:","},{name:"TILDE",text:"~"},{name:"NOT"},{name:"TOPLEFTCORNER_SYM",text:"@top-left-corner"},{name:"TOPLEFT_SYM",text:"@top-left"},{name:"TOPCENTER_SYM",text:"@top-center"},{name:"TOPRIGHT_SYM",text:"@top-right"},{name:"TOPRIGHTCORNER_SYM"
,text:"@top-right-corner"},{name:"BOTTOMLEFTCORNER_SYM",text:"@bottom-left-corner"},{name:"BOTTOMLEFT_SYM",text:"@bottom-left"},{name:"BOTTOMCENTER_SYM",text:"@bottom-center"},{name:"BOTTOMRIGHT_SYM",text:"@bottom-right"},{name:"BOTTOMRIGHTCORNER_SYM",text:"@bottom-right-corner"
},{name:"LEFTTOP_SYM",text:"@left-top"},{name:"LEFTMIDDLE_SYM",text:"@left-middle"},{name:"LEFTBOTTOM_SYM",text:"@left-bottom"},{name:"RIGHTTOP_SYM",text:"@right-top"},{name:"RIGHTMIDDLE_SYM",text:"@right-middle"},{name:"RIGHTBOTTOM_SYM",text:"@right-bottom"
},{name:"RESOLUTION",state:"media"},{name:"IE_FUNCTION"},{name:"CHAR"},{name:"PIPE",text:"|"},{name:"SLASH",text:"/"},{name:"MINUS",text:"-"},{name:"STAR",text:"*"},{name:"LBRACE",text:"{"},{name:"RBRACE",text:"}"},{name:"LBRACKET",text:"["},{name:"RBRACKET"
,text:"]"},{name:"EQUALS",text:"="},{name:"COLON",text:":"},{name:"SEMICOLON",text:";"},{name:"LPAREN",text:"("},{name:"RPAREN",text:")"},{name:"DOT",text:"."}];(function(){var e=[],t={};Tokens.UNKNOWN=-1,Tokens.unshift({name:"EOF"});for(var n=0,r=Tokens.length
;n<r;n++){e.push(Tokens[n].name),Tokens[Tokens[n].name]=n;if(Tokens[n].text)if(Tokens[n].text instanceof Array)for(var i=0;i<Tokens[n].text.length;i++)t[Tokens[n].text[i]]=n;else t[Tokens[n].text]=n}Tokens.name=function(t){return e[t]},Tokens.type=function(
e){return t[e]||-1}})();var Validation={validate:function(e,t){var n=e.toString().toLowerCase(),r=t.parts,i=new PropertyValueIterator(t),s=Properties[n],o,u,a,f,l,c,h,p,d,v,m;if(!s){if(n.indexOf("-")!==0)throw new ValidationError("Unknown property '"+e+"'."
,e.line,e.col)}else typeof s!="number"&&(typeof s=="string"?s.indexOf("||")>-1?this.groupProperty(s,i):this.singleProperty(s,i,1):s.multi?this.multiProperty(s.multi,i,s.comma,s.max||Infinity):typeof s=="function"&&s(i))},singleProperty:function(e,t,n,r){var i=!1
,s=t.value,o=0,u;while(t.hasNext()&&o<n){i=ValidationTypes.isAny(t,e);if(!i)break;o++}if(!i)throw t.hasNext()&&!t.isFirst()?(u=t.peek(),new ValidationError("Expected end of value but found '"+u+"'.",u.line,u.col)):new ValidationError("Expected ("+e+") but found '"+
s+"'.",s.line,s.col);if(t.hasNext())throw u=t.next(),new ValidationError("Expected end of value but found '"+u+"'.",u.line,u.col)},multiProperty:function(e,t,n,r){var i=!1,s=t.value,o=0,u=!1,a;while(t.hasNext()&&!i&&o<r){if(!ValidationTypes.isAny(t,e))break;
o++;if(!t.hasNext())i=!0;else if(n){if(t.peek()!=",")break;a=t.next()}}if(!i)throw t.hasNext()&&!t.isFirst()?(a=t.peek(),new ValidationError("Expected end of value but found '"+a+"'.",a.line,a.col)):(a=t.previous(),n&&a==","?new ValidationError("Expected end of value but found '"+
a+"'.",a.line,a.col):new ValidationError("Expected ("+e+") but found '"+s+"'.",s.line,s.col));if(t.hasNext())throw a=t.next(),new ValidationError("Expected end of value but found '"+a+"'.",a.line,a.col)},groupProperty:function(e,t,n){var r=!1,i=t.value,s=e.
split("||").length,o={count:0},u=!1,a,f;while(t.hasNext()&&!r){a=ValidationTypes.isAnyOfGroup(t,e);if(!a)break;if(o[a])break;o[a]=1,o.count++,u=!0;if(o.count==s||!t.hasNext())r=!0}if(!r)throw u&&t.hasNext()?(f=t.peek(),new ValidationError("Expected end of value but found '"+
f+"'.",f.line,f.col)):new ValidationError("Expected ("+e+") but found '"+i+"'.",i.line,i.col);if(t.hasNext())throw f=t.next(),new ValidationError("Expected end of value but found '"+f+"'.",f.line,f.col)}};ValidationError.prototype=new Error;var ValidationTypes=
{isLiteral:function(e,t){var n=e.text.toString().toLowerCase(),r=t.split(" | "),i,s,o=!1;for(i=0,s=r.length;i<s&&!o;i++)n==r[i].toLowerCase()&&(o=!0);return o},isSimple:function(e){return!!this.simple[e]},isComplex:function(e){return!!this.complex[e]},isAny
:function(e,t){var n=t.split(" | "),r,i,s=!1;for(r=0,i=n.length;r<i&&!s&&e.hasNext();r++)s=this.isType(e,n[r]);return s},isAnyOfGroup:function(e,t){var n=t.split(" || "),r,i,s=!1;for(r=0,i=n.length;r<i&&!s;r++)s=this.isType(e,n[r]);return s?n[r-1]:!1},isType
:function(e,t){var n=e.peek(),r=!1;return t.charAt(0)!="<"?(r=this.isLiteral(n,t),r&&e.next()):this.simple[t]?(r=this.simple[t](n),r&&e.next()):r=this.complex[t](e),r},simple:{"<absolute-size>":function(e){return ValidationTypes.isLiteral(e,"xx-small | x-small | small | medium | large | x-large | xx-large"
)},"<attachment>":function(e){return ValidationTypes.isLiteral(e,"scroll | fixed | local")},"<attr>":function(e){return e.type=="function"&&e.name=="attr"},"<bg-image>":function(e){return this["<image>"](e)||this["<gradient>"](e)||e=="none"},"<gradient>":function(
e){return e.type=="function"&&/^(?:\-(?:ms|moz|o|webkit)\-)?(?:repeating\-)?(?:radial\-|linear\-)?gradient/i.test(e)},"<box>":function(e){return ValidationTypes.isLiteral(e,"padding-box | border-box | content-box")},"<content>":function(e){return e.type=="function"&&
e.name=="content"},"<relative-size>":function(e){return ValidationTypes.isLiteral(e,"smaller | larger")},"<ident>":function(e){return e.type=="identifier"},"<length>":function(e){return e.type=="function"&&/^(?:\-(?:ms|moz|o|webkit)\-)?calc/i.test(e)?!0:e.type=="length"||
e.type=="number"||e.type=="integer"||e=="0"},"<color>":function(e){return e.type=="color"||e=="transparent"},"<number>":function(e){return e.type=="number"||this["<integer>"](e)},"<integer>":function(e){return e.type=="integer"},"<line>":function(e){return e
.type=="integer"},"<angle>":function(e){return e.type=="angle"},"<uri>":function(e){return e.type=="uri"},"<image>":function(e){return this["<uri>"](e)},"<percentage>":function(e){return e.type=="percentage"||e=="0"},"<border-width>":function(e){return this
["<length>"](e)||ValidationTypes.isLiteral(e,"thin | medium | thick")},"<border-style>":function(e){return ValidationTypes.isLiteral(e,"none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset")},"<margin-width>":function(e){return this
["<length>"](e)||this["<percentage>"](e)||ValidationTypes.isLiteral(e,"auto")},"<padding-width>":function(e){return this["<length>"](e)||this["<percentage>"](e)},"<shape>":function(e){return e.type=="function"&&(e.name=="rect"||e.name=="inset-rect")},"<time>"
:function(e){return e.type=="time"}},complex:{"<bg-position>":function(e){var t=this,n=!1,r="<percentage> | <length>",i="left | right",s="top | bottom",o=0,u=function(){return e.hasNext()&&e.peek()!=","};while(e.peek(o)&&e.peek(o)!=",")o++;return o<3?ValidationTypes
.isAny(e,i+" | center | "+r)?(n=!0,ValidationTypes.isAny(e,s+" | center | "+r)):ValidationTypes.isAny(e,s)&&(n=!0,ValidationTypes.isAny(e,i+" | center")):ValidationTypes.isAny(e,i)?ValidationTypes.isAny(e,s)?(n=!0,ValidationTypes.isAny(e,r)):ValidationTypes
.isAny(e,r)&&(ValidationTypes.isAny(e,s)?(n=!0,ValidationTypes.isAny(e,r)):ValidationTypes.isAny(e,"center")&&(n=!0)):ValidationTypes.isAny(e,s)?ValidationTypes.isAny(e,i)?(n=!0,ValidationTypes.isAny(e,r)):ValidationTypes.isAny(e,r)&&(ValidationTypes.isAny(
e,i)?(n=!0,ValidationTypes.isAny(e,r)):ValidationTypes.isAny(e,"center")&&(n=!0)):ValidationTypes.isAny(e,"center")&&ValidationTypes.isAny(e,i+" | "+s)&&(n=!0,ValidationTypes.isAny(e,r)),n},"<bg-size>":function(e){var t=this,n=!1,r="<percentage> | <length> | auto"
,i,s,o;return ValidationTypes.isAny(e,"cover | contain")?n=!0:ValidationTypes.isAny(e,r)&&(n=!0,ValidationTypes.isAny(e,r)),n},"<repeat-style>":function(e){var t=!1,n="repeat | space | round | no-repeat",r;return e.hasNext()&&(r=e.next(),ValidationTypes.isLiteral
(r,"repeat-x | repeat-y")?t=!0:ValidationTypes.isLiteral(r,n)&&(t=!0,e.hasNext()&&ValidationTypes.isLiteral(e.peek(),n)&&e.next())),t},"<shadow>":function(e){var t=!1,n=0,r=!1,i=!1,s;if(e.hasNext()){ValidationTypes.isAny(e,"inset")&&(r=!0),ValidationTypes.isAny
(e,"<color>")&&(i=!0);while(ValidationTypes.isAny(e,"<length>")&&n<4)n++;e.hasNext()&&(i||ValidationTypes.isAny(e,"<color>"),r||ValidationTypes.isAny(e,"inset")),t=n>=2&&n<=4}return t},"<x-one-radius>":function(e){var t=!1,n="<length> | <percentage> | inherit"
;return ValidationTypes.isAny(e,n)&&(t=!0,ValidationTypes.isAny(e,n)),t}}};parserlib.css={Colors:Colors,Combinator:Combinator,Parser:Parser,PropertyName:PropertyName,PropertyValue:PropertyValue,PropertyValuePart:PropertyValuePart,MediaFeature:MediaFeature,MediaQuery
:MediaQuery,Selector:Selector,SelectorPart:SelectorPart,SelectorSubPart:SelectorSubPart,Specificity:Specificity,TokenStream:TokenStream,Tokens:Tokens,ValidationError:ValidationError}}(),function(){for(var e in parserlib)exports[e]=parserlib[e]}();var CSSLint=
function(){function i(e,t){var r,i=e&&e.match(n),s=i&&i[1];return s&&(r={"true":2,"":1,"false":0,2:2,1:1,0:0},s.toLowerCase().split(",").forEach(function(e){var n=e.split(":"),i=n[0]||"",s=n[1]||"";t[i.trim()]=r[s.trim()]})),t}var e=[],t=[],n=/\/\*csslint([^\*]*)\*\//
,r=new parserlib.util.EventTarget;return r.version="0.10.0",r.addRule=function(t){e.push(t),e[t.id]=t},r.clearRules=function(){e=[]},r.getRules=function(){return[].concat(e).sort(function(e,t){return e.id>t.id?1:0})},r.getRuleset=function(){var t={},n=0,r=e
.length;while(n<r)t[e[n++].id]=1;return t},r.addFormatter=function(e){t[e.id]=e},r.getFormatter=function(e){return t[e]},r.format=function(e,t,n,r){var i=this.getFormatter(n),s=null;return i&&(s=i.startFormat(),s+=i.formatResults(e,t,r||{}),s+=i.endFormat()
),s},r.hasFormat=function(e){return t.hasOwnProperty(e)},r.verify=function(t,r){var s=0,o=e.length,u,a,f,l=new parserlib.css.Parser({starHack:!0,ieFilters:!0,underscoreHack:!0,strict:!1});a=t.replace(/\n\r?/g,"$split$").split("$split$"),r||(r=this.getRuleset
()),n.test(t)&&(r=i(t,r)),u=new Reporter(a,r),r.errors=2;for(s in r)r.hasOwnProperty(s)&&r[s]&&e[s]&&e[s].init(l,u);try{l.parse(t)}catch(c){u.error("Fatal error, cannot continue: "+c.message,c.line,c.col,{})}return f={messages:u.messages,stats:u.stats,ruleset
:u.ruleset},f.messages.sort(function(e,t){return e.rollup&&!t.rollup?1:!e.rollup&&t.rollup?-1:e.line-t.line}),f},r}();return Reporter.prototype={constructor:Reporter,error:function(e,t,n,r){this.messages.push({type:"error",line:t,col:n,message:e,evidence:this
.lines[t-1],rule:r||{}})},warn:function(e,t,n,r){this.report(e,t,n,r)},report:function(e,t,n,r){this.messages.push({type:this.ruleset[r.id]==2?"error":"warning",line:t,col:n,message:e,evidence:this.lines[t-1],rule:r})},info:function(e,t,n,r){this.messages.push
({type:"info",line:t,col:n,message:e,evidence:this.lines[t-1],rule:r})},rollupError:function(e,t){this.messages.push({type:"error",rollup:!0,message:e,rule:t})},rollupWarn:function(e,t){this.messages.push({type:"warning",rollup:!0,message:e,rule:t})},stat:function(
e,t){this.stats[e]=t}},CSSLint._Reporter=Reporter,CSSLint.Util={mix:function(e,t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return n},indexOf:function(e,t){if(e.indexOf)return e.indexOf(t);for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1
},forEach:function(e,t){if(e.forEach)return e.forEach(t);for(var n=0,r=e.length;n<r;n++)t(e[n],n,e)}},CSSLint.addRule({id:"adjoining-classes",name:"Disallow adjoining classes",desc:"Don't use adjoining classes.",browsers:"IE6",init:function(e,t){var n=this;
e.addListener("startrule",function(r){var i=r.selectors,s,o,u,a,f,l,c;for(f=0;f<i.length;f++){s=i[f];for(l=0;l<s.parts.length;l++){o=s.parts[l];if(o.type==e.SELECTOR_PART_TYPE){a=0;for(c=0;c<o.modifiers.length;c++)u=o.modifiers[c],u.type=="class"&&a++,a>1&&
t.report("Don't use adjoining classes.",o.line,o.col,n)}}}})}}),CSSLint.addRule({id:"box-model",name:"Beware of broken box size",desc:"Don't use width or height when using padding or border.",browsers:"All",init:function(e,t){function u(){s={},o=!1}function a
(){var e,u;if(!o){if(s.height)for(e in i)i.hasOwnProperty(e)&&s[e]&&(u=s[e].value,(e!="padding"||u.parts.length!==2||u.parts[0].value!==0)&&t.report("Using height with "+e+" can sometimes make elements larger than you expect.",s[e].line,s[e].col,n));if(s.width
)for(e in r)r.hasOwnProperty(e)&&s[e]&&(u=s[e].value,(e!="padding"||u.parts.length!==2||u.parts[1].value!==0)&&t.report("Using width with "+e+" can sometimes make elements larger than you expect.",s[e].line,s[e].col,n))}}var n=this,r={border:1,"border-left"
:1,"border-right":1,padding:1,"padding-left":1,"padding-right":1},i={border:1,"border-bottom":1,"border-top":1,padding:1,"padding-bottom":1,"padding-top":1},s,o=!1;e.addListener("startrule",u),e.addListener("startfontface",u),e.addListener("startpage",u),e.
addListener("startpagemargin",u),e.addListener("startkeyframerule",u),e.addListener("property",function(e){var t=e.property.text.toLowerCase();i[t]||r[t]?!/^0\S*$/.test(e.value)&&(t!="border"||e.value!="none")&&(s[t]={line:e.property.line,col:e.property.col
,value:e.value}):/^(width|height)/i.test(t)&&/^(length|percentage)/.test(e.value.parts[0].type)?s[t]=1:t=="box-sizing"&&(o=!0)}),e.addListener("endrule",a),e.addListener("endfontface",a),e.addListener("endpage",a),e.addListener("endpagemargin",a),e.addListener
("endkeyframerule",a)}}),CSSLint.addRule({id:"box-sizing",name:"Disallow use of box-sizing",desc:"The box-sizing properties isn't supported in IE6 and IE7.",browsers:"IE6, IE7",tags:["Compatibility"],init:function(e,t){var n=this;e.addListener("property",function(
e){var r=e.property.text.toLowerCase();r=="box-sizing"&&t.report("The box-sizing property isn't supported in IE6 and IE7.",e.line,e.col,n)})}}),CSSLint.addRule({id:"bulletproof-font-face",name:"Use the bulletproof @font-face syntax",desc:"Use the bulletproof @font-face syntax to avoid 404's in old IE (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax)."
,browsers:"All",init:function(e,t){var n=this,r=0,i=!1,s=!0,o=!1,u,a;e.addListener("startfontface",function(e){i=!0}),e.addListener("property",function(e){if(!i)return;var t=e.property.toString().toLowerCase(),n=e.value.toString();u=e.line,a=e.col;if(t==="src"
){var r=/^\s?url\(['"].+\.eot\?.*['"]\)\s*format\(['"]embedded-opentype['"]\).*$/i;!n.match(r)&&s?(o=!0,s=!1):n.match(r)&&!s&&(o=!1)}}),e.addListener("endfontface",function(e){i=!1,o&&t.report("@font-face declaration doesn't follow the fontspring bulletproof syntax."
,u,a,n)})}}),CSSLint.addRule({id:"compatible-vendor-prefixes",name:"Require compatible vendor prefixes",desc:"Include all compatible vendor prefixes to reach a wider range of users.",browsers:"All",init:function(e,t){var n=this,r,i,s,o,u,a,f,l=!1,c=Array.prototype
.push,h=[];r={animation:"webkit moz","animation-delay":"webkit moz","animation-direction":"webkit moz","animation-duration":"webkit moz","animation-fill-mode":"webkit moz","animation-iteration-count":"webkit moz","animation-name":"webkit moz","animation-play-state"
:"webkit moz","animation-timing-function":"webkit moz",appearance:"webkit moz","border-end":"webkit moz","border-end-color":"webkit moz","border-end-style":"webkit moz","border-end-width":"webkit moz","border-image":"webkit moz o","border-radius":"webkit","border-start"
:"webkit moz","border-start-color":"webkit moz","border-start-style":"webkit moz","border-start-width":"webkit moz","box-align":"webkit moz ms","box-direction":"webkit moz ms","box-flex":"webkit moz ms","box-lines":"webkit ms","box-ordinal-group":"webkit moz ms"
,"box-orient":"webkit moz ms","box-pack":"webkit moz ms","box-sizing":"webkit moz","box-shadow":"webkit moz","column-count":"webkit moz ms","column-gap":"webkit moz ms","column-rule":"webkit moz ms","column-rule-color":"webkit moz ms","column-rule-style":"webkit moz ms"
,"column-rule-width":"webkit moz ms","column-width":"webkit moz ms",hyphens:"epub moz","line-break":"webkit ms","margin-end":"webkit moz","margin-start":"webkit moz","marquee-speed":"webkit wap","marquee-style":"webkit wap","padding-end":"webkit moz","padding-start"
:"webkit moz","tab-size":"moz o","text-size-adjust":"webkit ms",transform:"webkit moz ms o","transform-origin":"webkit moz ms o",transition:"webkit moz o","transition-delay":"webkit moz o","transition-duration":"webkit moz o","transition-property":"webkit moz o"
,"transition-timing-function":"webkit moz o","user-modify":"webkit moz","user-select":"webkit moz ms","word-break":"epub ms","writing-mode":"epub ms"};for(s in r)if(r.hasOwnProperty(s)){o=[],u=r[s].split(" ");for(a=0,f=u.length;a<f;a++)o.push("-"+u[a]+"-"+s
);r[s]=o,c.apply(h,o)}e.addListener("startrule",function(){i=[]}),e.addListener("startkeyframes",function(e){l=e.prefix||!0}),e.addListener("endkeyframes",function(e){l=!1}),e.addListener("property",function(e){var t=e.property;CSSLint.Util.indexOf(h,t.text
)>-1&&(!l||typeof l!="string"||t.text.indexOf("-"+l+"-")!==0)&&i.push(t)}),e.addListener("endrule",function(e){if(!i.length)return;var s={},o,u,a,f,l,c,h,p,d,v;for(o=0,u=i.length;o<u;o++){a=i[o];for(f in r)r.hasOwnProperty(f)&&(l=r[f],CSSLint.Util.indexOf(l
,a.text)>-1&&(s[f]||(s[f]={full:l.slice(0),actual:[],actualNodes:[]}),CSSLint.Util.indexOf(s[f].actual,a.text)===-1&&(s[f].actual.push(a.text),s[f].actualNodes.push(a))))}for(f in s)if(s.hasOwnProperty(f)){c=s[f],h=c.full,p=c.actual;if(h.length>p.length)for(
o=0,u=h.length;o<u;o++)d=h[o],CSSLint.Util.indexOf(p,d)===-1&&(v=p.length===1?p[0]:p.length==2?p.join(" and "):p.join(", "),t.report("The property "+d+" is compatible with "+v+" and should be included as well.",c.actualNodes[0].line,c.actualNodes[0].col,n))
}})}}),CSSLint.addRule({id:"display-property-grouping",name:"Require properties appropriate for display",desc:"Certain properties shouldn't be used with certain display property values.",browsers:"All",init:function(e,t){function s(e,s,o){i[e]&&(typeof r[e]!="string"||
i[e].value.toLowerCase()!=r[e])&&t.report(o||e+" can't be used with display: "+s+".",i[e].line,i[e].col,n)}function o(){i={}}function u(){var e=i.display?i.display.value:null;if(e)switch(e){case"inline":s("height",e),s("width",e),s("margin",e),s("margin-top"
,e),s("margin-bottom",e),s("float",e,"display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).");break;case"block":s("vertical-align",e);break;case"inline-block":s("float",e);break;default:e.indexOf("table-")===0&&
(s("margin",e),s("margin-left",e),s("margin-right",e),s("margin-top",e),s("margin-bottom",e),s("float",e))}}var n=this,r={display:1,"float":"none",height:1,width:1,margin:1,"margin-left":1,"margin-right":1,"margin-bottom":1,"margin-top":1,padding:1,"padding-left"
:1,"padding-right":1,"padding-bottom":1,"padding-top":1,"vertical-align":1},i;e.addListener("startrule",o),e.addListener("startfontface",o),e.addListener("startkeyframerule",o),e.addListener("startpagemargin",o),e.addListener("startpage",o),e.addListener("property"
,function(e){var t=e.property.text.toLowerCase();r[t]&&(i[t]={value:e.value.text,line:e.property.line,col:e.property.col})}),e.addListener("endrule",u),e.addListener("endfontface",u),e.addListener("endkeyframerule",u),e.addListener("endpagemargin",u),e.addListener
("endpage",u)}}),CSSLint.addRule({id:"duplicate-background-images",name:"Disallow duplicate background images",desc:"Every background-image should be unique. Use a common class for e.g. sprites.",browsers:"All",init:function(e,t){var n=this,r={};e.addListener
("property",function(e){var i=e.property.text,s=e.value,o,u;if(i.match(/background/i))for(o=0,u=s.parts.length;o<u;o++)s.parts[o].type=="uri"&&(typeof r[s.parts[o].uri]=="undefined"?r[s.parts[o].uri]=e:t.report("Background image '"+s.parts[o].uri+"' was used multiple times, first declared at line "+
r[s.parts[o].uri].line+", col "+r[s.parts[o].uri].col+".",e.line,e.col,n))})}}),CSSLint.addRule({id:"duplicate-properties",name:"Disallow duplicate properties",desc:"Duplicate properties must appear one after the other.",browsers:"All",init:function(e,t){function s
(e){r={}}var n=this,r,i;e.addListener("startrule",s),e.addListener("startfontface",s),e.addListener("startpage",s),e.addListener("startpagemargin",s),e.addListener("startkeyframerule",s),e.addListener("property",function(e){var s=e.property,o=s.text.toLowerCase
();r[o]&&(i!=o||r[o]==e.value.text)&&t.report("Duplicate property '"+e.property+"' found.",e.line,e.col,n),r[o]=e.value.text,i=o})}}),CSSLint.addRule({id:"empty-rules",name:"Disallow empty rules",desc:"Rules without any properties specified should be removed."
,browsers:"All",init:function(e,t){var n=this,r=0;e.addListener("startrule",function(){r=0}),e.addListener("property",function(){r++}),e.addListener("endrule",function(e){var i=e.selectors;r===0&&t.report("Rule is empty.",i[0].line,i[0].col,n)})}}),CSSLint.
addRule({id:"errors",name:"Parsing Errors",desc:"This rule looks for recoverable syntax errors.",browsers:"All",init:function(e,t){var n=this;e.addListener("error",function(e){t.error(e.message,e.line,e.col,n)})}}),CSSLint.addRule({id:"fallback-colors",name
:"Require fallback colors",desc:"For older browsers that don't support RGBA, HSL, or HSLA, provide a fallback color.",browsers:"IE6,IE7,IE8",init:function(e,t){function o(e){s={},r=null}var n=this,r,i={color:1,background:1,"border-color":1,"border-top-color"
:1,"border-right-color":1,"border-bottom-color":1,"border-left-color":1,border:1,"border-top":1,"border-right":1,"border-bottom":1,"border-left":1,"background-color":1},s;e.addListener("startrule",o),e.addListener("startfontface",o),e.addListener("startpage"
,o),e.addListener("startpagemargin",o),e.addListener("startkeyframerule",o),e.addListener("property",function(e){var s=e.property,o=s.text.toLowerCase(),u=e.value.parts,a=0,f="",l=u.length;if(i[o])while(a<l)u[a].type=="color"&&("alpha"in u[a]||"hue"in u[a]?
(/([^\)]+)\(/.test(u[a])&&(f=RegExp.$1.toUpperCase()),(!r||r.property.text.toLowerCase()!=o||r.colorType!="compat")&&t.report("Fallback "+o+" (hex or RGB) should precede "+f+" "+o+".",e.line,e.col,n)):e.colorType="compat"),a++;r=e})}}),CSSLint.addRule({id:"floats"
,name:"Disallow too many floats",desc:"This rule tests if the float property is used too many times",browsers:"All",init:function(e,t){var n=this,r=0;e.addListener("property",function(e){e.property.text.toLowerCase()=="float"&&e.value.text.toLowerCase()!="none"&&
r++}),e.addListener("endstylesheet",function(){t.stat("floats",r),r>=10&&t.rollupWarn("Too many floats ("+r+"), you're probably using them for layout. Consider using a grid system instead.",n)})}}),CSSLint.addRule({id:"font-faces",name:"Don't use too many web fonts"
,desc:"Too many different web fonts in the same stylesheet.",browsers:"All",init:function(e,t){var n=this,r=0;e.addListener("startfontface",function(){r++}),e.addListener("endstylesheet",function(){r>5&&t.rollupWarn("Too many @font-face declarations ("+r+")."
,n)})}}),CSSLint.addRule({id:"font-sizes",name:"Disallow too many font sizes",desc:"Checks the number of font-size declarations.",browsers:"All",init:function(e,t){var n=this,r=0;e.addListener("property",function(e){e.property=="font-size"&&r++}),e.addListener
("endstylesheet",function(){t.stat("font-sizes",r),r>=10&&t.rollupWarn("Too many font-size declarations ("+r+"), abstraction needed.",n)})}}),CSSLint.addRule({id:"gradients",name:"Require all gradient definitions",desc:"When using a vendor-prefixed gradient, make sure to use them all."
,browsers:"All",init:function(e,t){var n=this,r;e.addListener("startrule",function(){r={moz:0,webkit:0,oldWebkit:0,o:0}}),e.addListener("property",function(e){/\-(moz|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(e.value)?r[RegExp.$1]=1:/\-webkit\-gradient/i
.test(e.value)&&(r.oldWebkit=1)}),e.addListener("endrule",function(e){var i=[];r.moz||i.push("Firefox 3.6+"),r.webkit||i.push("Webkit (Safari 5+, Chrome)"),r.oldWebkit||i.push("Old Webkit (Safari 4+, Chrome)"),r.o||i.push("Opera 11.1+"),i.length&&i.length<4&&
t.report("Missing vendor-prefixed CSS gradients for "+i.join(", ")+".",e.selectors[0].line,e.selectors[0].col,n)})}}),CSSLint.addRule({id:"ids",name:"Disallow IDs in selectors",desc:"Selectors should not contain IDs.",browsers:"All",init:function(e,t){var n=
this;e.addListener("startrule",function(r){var i=r.selectors,s,o,u,a,f,l,c;for(f=0;f<i.length;f++){s=i[f],a=0;for(l=0;l<s.parts.length;l++){o=s.parts[l];if(o.type==e.SELECTOR_PART_TYPE)for(c=0;c<o.modifiers.length;c++)u=o.modifiers[c],u.type=="id"&&a++}a==1?
t.report("Don't use IDs in selectors.",s.line,s.col,n):a>1&&t.report(a+" IDs in the selector, really?",s.line,s.col,n)}})}}),CSSLint.addRule({id:"import",name:"Disallow @import",desc:"Don't use @import, use <link> instead.",browsers:"All",init:function(e,t)
{var n=this;e.addListener("import",function(e){t.report("@import prevents parallel downloads, use <link> instead.",e.line,e.col,n)})}}),CSSLint.addRule({id:"important",name:"Disallow !important",desc:"Be careful when using !important declaration",browsers:"All"
,init:function(e,t){var n=this,r=0;e.addListener("property",function(e){e.important===!0&&(r++,t.report("Use of !important",e.line,e.col,n))}),e.addListener("endstylesheet",function(){t.stat("important",r),r>=10&&t.rollupWarn("Too many !important declarations ("+
r+"), try to use less than 10 to avoid specificity issues.",n)})}}),CSSLint.addRule({id:"known-properties",name:"Require use of known properties",desc:"Properties should be known (listed in CSS3 specification) or be a vendor-prefixed property.",browsers:"All"
,init:function(e,t){var n=this;e.addListener("property",function(e){var r=e.property.text.toLowerCase();e.invalid&&t.report(e.invalid.message,e.line,e.col,n)})}}),CSSLint.addRule({id:"outline-none",name:"Disallow outline: none",desc:"Use of outline: none or outline: 0 should be limited to :focus rules."
,browsers:"All",tags:["Accessibility"],init:function(e,t){function i(e){e.selectors?r={line:e.line,col:e.col,selectors:e.selectors,propCount:0,outline:!1}:r=null}function s(e){r&&r.outline&&(r.selectors.toString().toLowerCase().indexOf(":focus")==-1?t.report
("Outlines should only be modified using :focus.",r.line,r.col,n):r.propCount==1&&t.report("Outlines shouldn't be hidden unless other visual changes are made.",r.line,r.col,n))}var n=this,r;e.addListener("startrule",i),e.addListener("startfontface",i),e.addListener
("startpage",i),e.addListener("startpagemargin",i),e.addListener("startkeyframerule",i),e.addListener("property",function(e){var t=e.property.text.toLowerCase(),n=e.value;r&&(r.propCount++,t=="outline"&&(n=="none"||n=="0")&&(r.outline=!0))}),e.addListener("endrule"
,s),e.addListener("endfontface",s),e.addListener("endpage",s),e.addListener("endpagemargin",s),e.addListener("endkeyframerule",s)}}),CSSLint.addRule({id:"overqualified-elements",name:"Disallow overqualified elements",desc:"Don't use classes or IDs with elements (a.foo or a#foo)."
,browsers:"All",init:function(e,t){var n=this,r={};e.addListener("startrule",function(i){var s=i.selectors,o,u,a,f,l,c;for(f=0;f<s.length;f++){o=s[f];for(l=0;l<o.parts.length;l++){u=o.parts[l];if(u.type==e.SELECTOR_PART_TYPE)for(c=0;c<u.modifiers.length;c++
)a=u.modifiers[c],u.elementName&&a.type=="id"?t.report("Element ("+u+") is overqualified, just use "+a+" without element name.",u.line,u.col,n):a.type=="class"&&(r[a]||(r[a]=[]),r[a].push({modifier:a,part:u}))}}}),e.addListener("endstylesheet",function(){var e
;for(e in r)r.hasOwnProperty(e)&&r[e].length==1&&r[e][0].part.elementName&&t.report("Element ("+r[e][0].part+") is overqualified, just use "+r[e][0].modifier+" without element name.",r[e][0].part.line,r[e][0].part.col,n)})}}),CSSLint.addRule({id:"qualified-headings"
,name:"Disallow qualified headings",desc:"Headings should not be qualified (namespaced).",browsers:"All",init:function(e,t){var n=this;e.addListener("startrule",function(r){var i=r.selectors,s,o,u,a;for(u=0;u<i.length;u++){s=i[u];for(a=0;a<s.parts.length;a++
)o=s.parts[a],o.type==e.SELECTOR_PART_TYPE&&o.elementName&&/h[1-6]/.test(o.elementName.toString())&&a>0&&t.report("Heading ("+o.elementName+") should not be qualified.",o.line,o.col,n)}})}}),CSSLint.addRule({id:"regex-selectors",name:"Disallow selectors that look like regexs"
,desc:"Selectors that look like regular expressions are slow and should be avoided.",browsers:"All",init:function(e,t){var n=this;e.addListener("startrule",function(r){var i=r.selectors,s,o,u,a,f,l;for(a=0;a<i.length;a++){s=i[a];for(f=0;f<s.parts.length;f++
){o=s.parts[f];if(o.type==e.SELECTOR_PART_TYPE)for(l=0;l<o.modifiers.length;l++)u=o.modifiers[l],u.type=="attribute"&&/([\~\|\^\$\*]=)/.test(u)&&t.report("Attribute selectors with "+RegExp.$1+" are slow!",u.line,u.col,n)}}})}}),CSSLint.addRule({id:"rules-count"
,name:"Rules Count",desc:"Track how many rules there are.",browsers:"All",init:function(e,t){var n=this,r=0;e.addListener("startrule",function(){r++}),e.addListener("endstylesheet",function(){t.stat("rule-count",r)})}}),CSSLint.addRule({id:"selector-max-approaching"
,name:"Warn when approaching the 4095 selector limit for IE",desc:"Will warn when selector count is >= 3800 selectors.",browsers:"IE",init:function(e,t){var n=this,r=0;e.addListener("startrule",function(e){r+=e.selectors.length}),e.addListener("endstylesheet"
,function(){r>=3800&&t.report("You have "+r+" selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.",0,0,n)})}}),CSSLint.addRule({id:"selector-max",name:"Error when past the 4095 selector limit for IE",desc:"Will error when selector count is > 4095."
,browsers:"IE",init:function(e,t){var n=this,r=0;e.addListener("startrule",function(e){r+=e.selectors.length}),e.addListener("endstylesheet",function(){r>4095&&t.report("You have "+r+" selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring."
,0,0,n)})}}),CSSLint.addRule({id:"shorthand",name:"Require shorthand properties",desc:"Use shorthand properties where possible.",browsers:"All",init:function(e,t){function f(e){u={}}function l(e){var r,i,s,o;for(r in a)if(a.hasOwnProperty(r)){o=0;for(i=0,s=
a[r].length;i<s;i++)o+=u[a[r][i]]?1:0;o==a[r].length&&t.report("The properties "+a[r].join(", ")+" can be replaced by "+r+".",e.line,e.col,n)}}var n=this,r,i,s,o={},u,a={margin:["margin-top","margin-bottom","margin-left","margin-right"],padding:["padding-top"
,"padding-bottom","padding-left","padding-right"]};for(r in a)if(a.hasOwnProperty(r))for(i=0,s=a[r].length;i<s;i++)o[a[r][i]]=r;e.addListener("startrule",f),e.addListener("startfontface",f),e.addListener("property",function(e){var t=e.property.toString().toLowerCase
(),n=e.value.parts[0].value;o[t]&&(u[t]=1)}),e.addListener("endrule",l),e.addListener("endfontface",l)}}),CSSLint.addRule({id:"star-property-hack",name:"Disallow properties with a star prefix",desc:"Checks for the star property hack (targets IE6/7)",browsers
:"All",init:function(e,t){var n=this;e.addListener("property",function(e){var r=e.property;r.hack=="*"&&t.report("Property with star prefix found.",e.property.line,e.property.col,n)})}}),CSSLint.addRule({id:"text-indent",name:"Disallow negative text-indent"
,desc:"Checks for text indent less than -99px",browsers:"All",init:function(e,t){function s(e){r=!1,i="inherit"}function o(e){r&&i!="ltr"&&t.report("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr."
,r.line,r.col,n)}var n=this,r,i;e.addListener("startrule",s),e.addListener("startfontface",s),e.addListener("property",function(e){var t=e.property.toString().toLowerCase(),n=e.value;t=="text-indent"&&n.parts[0].value<-99?r=e.property:t=="direction"&&n=="ltr"&&
(i="ltr")}),e.addListener("endrule",o),e.addListener("endfontface",o)}}),CSSLint.addRule({id:"underscore-property-hack",name:"Disallow properties with an underscore prefix",desc:"Checks for the underscore property hack (targets IE6)",browsers:"All",init:function(
e,t){var n=this;e.addListener("property",function(e){var r=e.property;r.hack=="_"&&t.report("Property with underscore prefix found.",e.property.line,e.property.col,n)})}}),CSSLint.addRule({id:"unique-headings",name:"Headings should only be defined once",desc
:"Headings should be defined only once.",browsers:"All",init:function(e,t){var n=this,r={h1:0,h2:0,h3:0,h4:0,h5:0,h6:0};e.addListener("startrule",function(e){var i=e.selectors,s,o,u,a,f;for(a=0;a<i.length;a++){s=i[a],o=s.parts[s.parts.length-1];if(o.elementName&&/(h[1-6])/i
.test(o.elementName.toString())){for(f=0;f<o.modifiers.length;f++)if(o.modifiers[f].type=="pseudo"){u=!0;break}u||(r[RegExp.$1]++,r[RegExp.$1]>1&&t.report("Heading ("+o.elementName+") has already been defined.",o.line,o.col,n))}}}),e.addListener("endstylesheet"
,function(e){var i,s=[];for(i in r)r.hasOwnProperty(i)&&r[i]>1&&s.push(r[i]+" "+i+"s");s.length&&t.rollupWarn("You have "+s.join(", ")+" defined in this stylesheet.",n)})}}),CSSLint.addRule({id:"universal-selector",name:"Disallow universal selector",desc:"The universal selector (*) is known to be slow."
,browsers:"All",init:function(e,t){var n=this;e.addListener("startrule",function(e){var r=e.selectors,i,s,o,u,a,f;for(u=0;u<r.length;u++)i=r[u],s=i.parts[i.parts.length-1],s.elementName=="*"&&t.report(n.desc,s.line,s.col,n)})}}),CSSLint.addRule({id:"unqualified-attributes"
,name:"Disallow unqualified attribute selectors",desc:"Unqualified attribute selectors are known to be slow.",browsers:"All",init:function(e,t){var n=this;e.addListener("startrule",function(r){var i=r.selectors,s,o,u,a,f,l;for(a=0;a<i.length;a++){s=i[a],o=s
.parts[s.parts.length-1];if(o.type==e.SELECTOR_PART_TYPE)for(l=0;l<o.modifiers.length;l++)u=o.modifiers[l],u.type=="attribute"&&(!o.elementName||o.elementName=="*")&&t.report(n.desc,o.line,o.col,n)}})}}),CSSLint.addRule({id:"vendor-prefix",name:"Require standard property with vendor prefix"
,desc:"When using a vendor-prefixed property, make sure to include the standard one.",browsers:"All",init:function(e,t){function o(){r={},i=1}function u(e){var i,o,u,a,f,l,c=[];for(i in r)s[i]&&c.push({actual:i,needed:s[i]});for(o=0,u=c.length;o<u;o++)f=c[o
].needed,l=c[o].actual,r[f]?r[f][0].pos<r[l][0].pos&&t.report("Standard property '"+f+"' should come after vendor-prefixed property '"+l+"'.",r[l][0].name.line,r[l][0].name.col,n):t.report("Missing standard property '"+f+"' to go along with '"+l+"'.",r[l][0
].name.line,r[l][0].name.col,n)}var n=this,r,i,s={"-webkit-border-radius":"border-radius","-webkit-border-top-left-radius":"border-top-left-radius","-webkit-border-top-right-radius":"border-top-right-radius","-webkit-border-bottom-left-radius":"border-bottom-left-radius"
,"-webkit-border-bottom-right-radius":"border-bottom-right-radius","-o-border-radius":"border-radius","-o-border-top-left-radius":"border-top-left-radius","-o-border-top-right-radius":"border-top-right-radius","-o-border-bottom-left-radius":"border-bottom-left-radius"
,"-o-border-bottom-right-radius":"border-bottom-right-radius","-moz-border-radius":"border-radius","-moz-border-radius-topleft":"border-top-left-radius","-moz-border-radius-topright":"border-top-right-radius","-moz-border-radius-bottomleft":"border-bottom-left-radius"
,"-moz-border-radius-bottomright":"border-bottom-right-radius","-moz-column-count":"column-count","-webkit-column-count":"column-count","-moz-column-gap":"column-gap","-webkit-column-gap":"column-gap","-moz-column-rule":"column-rule","-webkit-column-rule":"column-rule"
,"-moz-column-rule-style":"column-rule-style","-webkit-column-rule-style":"column-rule-style","-moz-column-rule-color":"column-rule-color","-webkit-column-rule-color":"column-rule-color","-moz-column-rule-width":"column-rule-width","-webkit-column-rule-width"
:"column-rule-width","-moz-column-width":"column-width","-webkit-column-width":"column-width","-webkit-column-span":"column-span","-webkit-columns":"columns","-moz-box-shadow":"box-shadow","-webkit-box-shadow":"box-shadow","-moz-transform":"transform","-webkit-transform"
:"transform","-o-transform":"transform","-ms-transform":"transform","-moz-transform-origin":"transform-origin","-webkit-transform-origin":"transform-origin","-o-transform-origin":"transform-origin","-ms-transform-origin":"transform-origin","-moz-box-sizing"
:"box-sizing","-webkit-box-sizing":"box-sizing","-moz-user-select":"user-select","-khtml-user-select":"user-select","-webkit-user-select":"user-select"};e.addListener("startrule",o),e.addListener("startfontface",o),e.addListener("startpage",o),e.addListener
("startpagemargin",o),e.addListener("startkeyframerule",o),e.addListener("property",function(e){var t=e.property.text.toLowerCase();r[t]||(r[t]=[]),r[t].push({name:e.property,value:e.value,pos:i++})}),e.addListener("endrule",u),e.addListener("endfontface",u
),e.addListener("endpage",u),e.addListener("endpagemargin",u),e.addListener("endkeyframerule",u)}}),CSSLint.addRule({id:"zero-units",name:"Disallow units for 0 values",desc:"You don't need to specify units when a value is 0.",browsers:"All",init:function(e,
t){var n=this;e.addListener("property",function(e){var r=e.value.parts,i=0,s=r.length;while(i<s)(r[i].units||r[i].type=="percentage")&&r[i].value===0&&r[i].type!="time"&&t.report("Values of 0 shouldn't have units specified.",r[i].line,r[i].col,n),i++})}}),function(
){var e=function(e){return!e||e.constructor!==String?"":e.replace(/[\"&><]/g,function(e){switch(e){case'"':return"&quot;";case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;"}})};CSSLint.addFormatter({id:"checkstyle-xml",name:"Checkstyle XML format"
,startFormat:function(){return'<?xml version="1.0" encoding="utf-8"?><checkstyle>'},endFormat:function(){return"</checkstyle>"},readError:function(t,n){return'<file name="'+e(t)+'"><error line="0" column="0" severty="error" message="'+e(n)+'"></error></file>'
},formatResults:function(t,n,r){var i=t.messages,s=[],o=function(e){return!!e&&"name"in e?"net.csslint."+e.name.replace(/\s/g,""):""};return i.length>0&&(s.push('<file name="'+n+'">'),CSSLint.Util.forEach(i,function(t,n){t.rollup||s.push('<error line="'+t.line+'" column="'+
t.col+'" severity="'+t.type+'"'+' message="'+e(t.message)+'" source="'+o(t.rule)+'"/>')}),s.push("</file>")),s.join("")}})}(),CSSLint.addFormatter({id:"compact",name:"Compact, 'porcelain' format",startFormat:function(){return""},endFormat:function(){return""
},formatResults:function(e,t,n){var r=e.messages,i="";n=n||{};var s=function(e){return e.charAt(0).toUpperCase()+e.slice(1)};return r.length===0?n.quiet?"":t+": Lint Free!":(CSSLint.Util.forEach(r,function(e,n){e.rollup?i+=t+": "+s(e.type)+" - "+e.message+"\n"
:i+=t+": "+"line "+e.line+", col "+e.col+", "+s(e.type)+" - "+e.message+"\n"}),i)}}),CSSLint.addFormatter({id:"csslint-xml",name:"CSSLint XML format",startFormat:function(){return'<?xml version="1.0" encoding="utf-8"?><csslint>'},endFormat:function(){return"</csslint>"
},formatResults:function(e,t,n){var r=e.messages,i=[],s=function(e){return!e||e.constructor!==String?"":e.replace(/\"/g,"'").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")};return r.length>0&&(i.push('<file name="'+t+'">'),CSSLint.Util.forEach
(r,function(e,t){e.rollup?i.push('<issue severity="'+e.type+'" reason="'+s(e.message)+'" evidence="'+s(e.evidence)+'"/>'):i.push('<issue line="'+e.line+'" char="'+e.col+'" severity="'+e.type+'"'+' reason="'+s(e.message)+'" evidence="'+s(e.evidence)+'"/>')})
,i.push("</file>")),i.join("")}}),CSSLint.addFormatter({id:"junit-xml",name:"JUNIT XML format",startFormat:function(){return'<?xml version="1.0" encoding="utf-8"?><testsuites>'},endFormat:function(){return"</testsuites>"},formatResults:function(e,t,n){var r=
e.messages,i=[],s={error:0,failure:0},o=function(e){return!!e&&"name"in e?"net.csslint."+e.name.replace(/\s/g,""):""},u=function(e){return!e||e.constructor!==String?"":e.replace(/\"/g,"'").replace(/</g,"&lt;").replace(/>/g,"&gt;")};return r.length>0&&(r.forEach
(function(e,t){var n=e.type==="warning"?"error":e.type;e.rollup||(i.push('<testcase time="0" name="'+o(e.rule)+'">'),i.push("<"+n+' message="'+u(e.message)+'"><![CDATA['+e.line+":"+e.col+":"+u(e.evidence)+"]]></"+n+">"),i.push("</testcase>"),s[n]+=1)}),i.unshift
('<testsuite time="0" tests="'+r.length+'" skipped="0" errors="'+s.error+'" failures="'+s.failure+'" package="net.csslint" name="'+t+'">'),i.push("</testsuite>")),i.join("")}}),CSSLint.addFormatter({id:"lint-xml",name:"Lint XML format",startFormat:function(
){return'<?xml version="1.0" encoding="utf-8"?><lint>'},endFormat:function(){return"</lint>"},formatResults:function(e,t,n){var r=e.messages,i=[],s=function(e){return!e||e.constructor!==String?"":e.replace(/\"/g,"'").replace(/&/g,"&amp;").replace(/</g,"&lt;"
).replace(/>/g,"&gt;")};return r.length>0&&(i.push('<file name="'+t+'">'),CSSLint.Util.forEach(r,function(e,t){e.rollup?i.push('<issue severity="'+e.type+'" reason="'+s(e.message)+'" evidence="'+s(e.evidence)+'"/>'):i.push('<issue line="'+e.line+'" char="'+
e.col+'" severity="'+e.type+'"'+' reason="'+s(e.message)+'" evidence="'+s(e.evidence)+'"/>')}),i.push("</file>")),i.join("")}}),CSSLint.addFormatter({id:"text",name:"Plain Text",startFormat:function(){return""},endFormat:function(){return""},formatResults:function(
e,t,n){var r=e.messages,i="";n=n||{};if(r.length===0)return n.quiet?"":"\n\ncsslint: No errors in "+t+".";i="\n\ncsslint: There are "+r.length+" problems in "+t+".";var s=t.lastIndexOf("/"),o=t;return s===-1&&(s=t.lastIndexOf("\\")),s>-1&&(o=t.substring(s+1
)),CSSLint.Util.forEach(r,function(e,t){i=i+"\n\n"+o,e.rollup?(i+="\n"+(t+1)+": "+e.type,i+="\n"+e.message):(i+="\n"+(t+1)+": "+e.type+" at line "+e.line+", col "+e.col,i+="\n"+e.message,i+="\n"+e.evidence)}),i}}),CSSLint}()
/* jslint-ignore-end */



/* istanbul ignore next */
// init lib jslint
/* jslint-ignore-begin */
// https://github.com/douglascrockford/JSLint/blob/394bf291bfa3881bb9827b9fc7b7d1112d83f313/jslint.js
// utility2-uglifyjs https://raw.githubusercontent.com/douglascrockford/JSLint/394bf291bfa3881bb9827b9fc7b7d1112d83f313/jslint.js
var JSLINT=function(){"use strict";function e(e,t){var n,r=e.length,i=Object.create(null);for(n=0;n<r;n+=1)i[e[n]]=t;return i}function it(e){return v[e]||"\\u"+("0000"+e.charCodeAt().toString(16)).slice(-4)}function st(e){Object.keys(e).forEach(function(t){
_[t]=e[t]})}function ot(){M.browser&&(st(o),M.browser=!1),M.closure&&st(a),M.couch&&(st(c),M.couch=!1),M.devel&&(st(p),M.devel=!1),M.node&&(st(k),M.node=!1,L=!0),M.rhino&&(st(I),M.rhino=!1)}function ut(e){return e||(e=O),e.id==="(number)"?e.number:e.string}
function at(e,t,n){throw{name:"JSLintError",line:t,character:n,message:u.scanned_a_b.supplant({a:u[e]||e,b:Math.floor(t/N.length*100)})}}function ft(e,t,n,r,i,s,o){var a={id:"(error)",raw:u[e]||e,code:e,evidence:N[t-1]||"",line:t,character:n,a:r||ut(this),b
:i,c:s,d:o};return a.reason=a.raw.supplant(a),S.errors.push(a),M.passfail&&at("stopping",t,n),J+=1,J>=M.maxerr&&at("too_many",t,n),a}function lt(e,t,n,r,i,s,o){var u=ft(e,t,n,r,i,s,o);at("stopping",u.line,u.character)}function ct(e){!M.white&&O.from!==e&&O.
warn("expected_a_at_b_c","",e,O.from)}function ht(e,t){var n=t.string,r=q[n];t.dead=!1,t.init=!1,t.kind=e,t.master=r,t.used=0,t.writeable=!0,e==="var"&&m===y?r||(_[n]===!1&&(t.writeable=!1),b[n]=t):(r&&(r.function===m?(r.kind!=="exception"||e!=="exception"||!
r.dead)&&t.warn("already_defined",n):r.function!==y&&e==="var"&&t.warn("redefinition_a_b",n,r.line)),q[n]=t,e==="var"&&s.push(n))}function pt(e){var t,n=0;e=e||0;while(n<=e)t=C[n],t||(t=C[n]=T.token()),n+=1;return t}function dt(e,t){if(E){if($&&O.line!==X.line
){if(($!==E||!O.edge)&&O.from===E.at-(O.edge?M.indent:0)){var r=E;for(;;){r.at-=M.indent;if(r===$)break;r=r.was}r.open=!1}$=null}O.id==="?"&&E.mode===":"&&X.line!==O.line&&(E.at-=M.indent),E.open?O.edge?O.edge==="label"?ct(1):O.edge==="case"||E.mode==="statement"?
ct(E.at-M.indent):(E.mode!=="array"||O.line!==X.line)&&ct(E.at):O.line!==X.line&&(O.from<E.at+(E.mode==="expression"?0:M.indent)&&ct(E.at+M.indent),E.wrap=!0):O.line!==X.line&&(O.edge?ct(E.at):(E.wrap=!0,E.mode==="statement"||E.mode==="var"?ct(E.at+M.indent
):O.from<E.at+(E.mode==="expression"?0:M.indent)&&ct(E.at+M.indent)))}switch(X.id){case"(number)":O.id==="."&&O.warn("trailing_decimal_a");break;case"-":(O.id==="-"||O.id==="--")&&O.warn("confusing_a");break;case"+":(O.id==="+"||O.id==="++")&&O.warn("confusing_a"
)}if(X.id==="(string)"||X.identifier)n=X.string;e&&O.id!==e&&(t?O.warn("expected_a_b_from_c_d",e,t.id,t.line,ut()):(!O.identifier||O.string!==e)&&O.warn("expected_a_b",e,ut())),P=X,X=O,O=C.shift()||T.token(),O.function=m,V.push(O)}function vt(){var e,t;for(
;;){if(O.id!=="(string)"&&!O.identifier)return;e=O.string,dt(),t=!1;if(O.id===":"){dt(":");switch(O.id){case"true":t=_[e]!==!1,dt("true");break;case"false":dt("false");break;default:O.stop("unexpected_a")}}_[e]=t;if(O.id!==",")return;dt(",")}}function mt(){
var e,n;while(O.id==="(string)"||O.identifier)e=O.string,t[e]||O.stop("unexpected_a"),dt(),O.id!==":"&&O.stop("expected_a_b",":",ut()),dt(":"),typeof t[e]=="number"?(n=O.number,(n>t[e]||n<=0||Math.floor(n)!==n)&&O.stop("expected_small_a"),M[e]=n):O.id==="true"?
M[e]=!0:O.id==="false"?M[e]=!1:O.stop("unexpected_a"),dt(),O.id===","&&dt(",");ot()}function gt(){var e;M.properties=!0;for(;;){if(O.id!=="(string)"&&!O.identifier)return;e=O.string,dt();if(O.id===":")for(;;){dt();if(O.id!=="(string)"&&!O.identifier)break}H
[e]=0;if(O.id!==",")return;dt(",")}}function yt(e){O.edge=E?E.open&&(e||"edge"):""}function bt(e){var t;typeof e=="number"?E={at:+e,open:!0,was:E}:E?e==="statement"?E={at:E.at,open:!0,was:E}:(t=e==="var"||O.line!==X.line,E={at:(t||e==="control"?E.at+M.indent
:E.at)+(E.wrap?M.indent:0),mode:e,open:t,was:E},e==="var"&&t&&($=E)):E={at:1,mode:"statement",open:!0}}function wt(e,t){e&&(E&&E.open&&(E.at-=M.indent,yt()),dt(e,t)),E&&(E=E.was)}function Et(e,t){e=e||X,t=t||O,t.id!=="(end)"&&!M.white&&(X.line!==t.line||X.thru+1!==
t.from)&&t.warn("expected_space_a_b",ut(X),ut(t))}function St(e,t){e=e||X,t=t||O,t.id!=="(end)"&&(e.line!==t.line||!M.white&&e.thru+1!==t.from)&&t.warn("expected_space_a_b",ut(e),ut(t))}function xt(e,t){e=e||X,t=t||O,!M.white&&e.thru!==t.from&&e.line===t.line&&
t.warn("unexpected_space_a_b",ut(e),ut(t))}function Tt(e,t){e=e||X,t=t||O,t.id!=="(end)"&&(e.line!==t.line||!M.white&&e.thru!==t.from)&&t.warn("unexpected_space_a_b",ut(e),ut(t))}function Nt(e,t){M.white||(e=e||X,t=t||O,e.thru===t.from&&e.line===t.line&&t.warn
("missing_space_a_b",ut(e),ut(t)))}function Ct(){O.id!==","?ft("expected_a_b",X.line,X.thru,",",ut()):(M.white||Tt(),dt(","),Nt())}function kt(){O.id!==";"?ft("expected_a_b",X.line,X.thru,";",ut()):(M.white||Tt(),dt(";"),R[O.id]!==!0&&Nt())}function Lt(){return O
.string==="use strict"?(z&&O.warn("unnecessary_use"),yt(),dt(),kt(),z=!0,!0):!1}function At(e,t){if(e===t)return!0;if(Array.isArray(e)){if(Array.isArray(t)&&e.length===t.length){var n;for(n=0;n<e.length;n+=1)if(!At(e[n],t[n]))return!1;return!0}return!1}if(Array
.isArray(t))return!1;if(e.id==="(number)"&&t.id==="(number)")return e.number===t.number;if(e.arity===t.arity&&e.string===t.string)switch(e.arity){case undefined:return e.string===t.string;case"prefix":case"suffix":return e.id===t.id&&At(e.first,t.first)&&e.
id!=="{"&&e.id!=="[";case"infix":return At(e.first,t.first)&&At(e.second,t.second);case"ternary":return At(e.first,t.first)&&At(e.second,t.second)&&At(e.third,t.third);case"function":case"regexp":return!1;default:return!0}return e.id==="."&&t.id==="["&&t.arity==="infix"?
e.second.string===t.second.string&&t.second.id==="(string)":e.id==="["&&e.arity==="infix"&&t.id==="."?e.second.string===t.second.string&&e.second.id==="(string)":!1}function Ot(e,t){var r;O.id==="(end)"&&X.stop("unexpected_a",O.id),dt(),t&&(n="anonymous");if(
t===!0&&X.fud)r=X.fud();else{if(X.nud)r=X.nud();else{if(O.id==="(number)"&&X.id===".")return X.warn("leading_decimal_a",ut()),dt(),X;X.stop("expected_identifier_a",ut(X))}while(e<O.lbp)dt(),r=X.led(r)}return r&&r.assign&&!t&&(M.ass||r.warn("assignment_expression"
),r.id!=="="&&r.first.master&&(r.first.master.used=!0)),r}function Mt(e,t){var n=W[e];return n||(n=Object.create(B),n.id=n.string=e,n.lbp=t||0,W[e]=n),n}function _t(e){return e.postscript=!0,e}function Dt(e){var t=Mt(e,0);return t.from=1,t.thru=1,t.line=0,t
.edge="edge",t.string=e,_t(t)}function Pt(e){var t=e.id.charAt(0);if(t>="a"&&t<="z"||t>="A"&&t<="Z")e.identifier=e.reserved=!0;return e}function Ht(e,t){var n=Mt(e);return n.fud=t,Pt(n)}function Bt(e,t){var n=Ht(e,t);n.disrupt=!0}function jt(e,t){var n=Ht(e
,function(){var n;return m.breakage?m.breakage.push(this):m.breakage=[this],n=t.apply(this),m.breakage.length>1?m.breakage.pop():delete m.breakage,n});n.labeled=!0}function Ft(e,t){var n=Mt(e,150);return Pt(n),n.nud=function(){var n=this;n.arity="prefix";if(typeof
t=="function"){n=t(n);if(n.arity!=="prefix")return n}else e==="typeof"?Et():Tt(),n.first=Ot(150);switch(n.id){case"++":case"--":M.plusplus?(!n.first.identifier||n.first.reserved)&&n.first.id!=="."&&n.first.id!=="["&&n.warn("bad_operand"):n.warn("unexpected_a"
);break;default:(n.first.arity==="prefix"||n.first.arity==="function")&&n.warn("unexpected_a")}return n},n}function It(e,t,n){var r=Mt(e);return r.arity=t,n&&(r.nud=n),r}function qt(e,t){var n=Mt(e);return n.identifier=n.reserved=!0,typeof t=="function"&&(n
.nud=t),n}function Rt(e){var t=qt(e);return t.string=e,t.nud=F,t}function Ut(e,t){return qt(e,function(){return typeof t=="function"&&t(this),this})}function zt(e,t,n,r){var i=Mt(e,t);return Pt(i),i.led=function(e){return this.arity="infix",r||(Nt(P,X),Nt()
),!M.bitwise&&this.bitwise&&this.warn("unexpected_a"),typeof n=="function"?n(e,this):(this.first=e,this.second=Ot(t),this)},i}function Wt(e,t){return e.assign&&e.warn(t||"conditional_assignment"),e}function Xt(e,t){switch(e.id){case"[":case"-":e.arity!=="infix"&&
e.warn(t||"weird_condition");break;case"false":case"function":case"Infinity":case"NaN":case"null":case"true":case"undefined":case"void":case"(number)":case"(regexp)":case"(string)":case"{":case"?":case"~":e.warn(t||"weird_condition");break;case"(":(e.first.
id==="new"||e.first.string==="Boolean"||e.first.id==="."&&A[e.first.second.string]===!0)&&e.warn(t||"weird_condition")}return e}function Vt(e){switch(e.arity){case"prefix":switch(e.id){case"{":case"[":e.warn("unexpected_a");break;case"!":e.warn("confusing_a"
)}break;case"function":case"regexp":e.warn("unexpected_a");break;default:e.id==="NaN"?e.warn("isNaN"):e.relation&&e.warn("weird_relation")}return e}function $t(e,t){var n=zt(e,100,function(e,n){Vt(e),t&&!M.eqeq&&n.warn("expected_a_b",t,n.id);var r=Ot(100);return!
At(e,r)&&(e.id!=="(string)"&&e.id!=="(number)"||r.id!=="(string)"&&r.id!=="(number)")?e.id==="typeof"?r.id!=="(string)"?r.warn("expected_string_a",ut(r)):(r.string==="undefined"||r.string==="null")&&e.warn("unexpected_typeof_a",r.string):r.id==="typeof"&&(e
.id!=="(string)"?e.warn("expected_string_a",ut(e)):(e.string==="undefined"||e.string==="null")&&r.warn("unexpected_typeof_a",e.string)):n.warn("weird_relation"),n.first=e,n.second=Vt(r),n});return n.relation=!0,n}function Jt(e,t){var n;e.identifier?(n=q[e.string
],n?(q[e.string].writeable!==!0&&e.warn("read_only"),n.used-=1,t==="="&&(n.init=!0)):e.reserved&&e.warn("expected_identifier_a_reserved")):e.id==="."||e.id==="["?(!e.first||e.first.string==="arguments")&&e.warn("bad_assignment"):e.warn("bad_assignment")}function Kt
(e,t){var n=zt(e,20,function(t,n){var r;n.first=t,Jt(t,e),n.second=Ot(20),n.id==="="&&At(n.first,n.second)&&n.warn("weird_assignment"),r=n;while(O.id==="=")Jt(r.second,"="),O.first=r.second,r.second=O,r=O,dt("="),r.second=Ot(20);return n});return n.assign=!0
,t&&W[t].bitwise&&(n.bitwise=!0),n}function Qt(e,t){var n=zt(e,t,"number");return n.bitwise=!0,n}function Gt(e){var t=Mt(e,150);return t.led=function(e){return Tt(P,X),M.plusplus?(!e.identifier||e.reserved)&&e.id!=="."&&e.id!=="["&&this.warn("bad_operand"):
this.warn("unexpected_a"),this.first=e,this.arity="suffix",this},t}function Yt(e){if(O.identifier)return dt(),X.reserved&&e&&X.warn("expected_identifier_a_reserved"),X.string}function Zt(e){var t=Yt(e);return t||O.stop(X.id==="function"&&O.id==="("?"name_function"
:"expected_identifier_a"),t}function en(){var e,t,n;if(O.id===";"){O.warn("unexpected_a"),kt();return}return O.identifier&&!O.reserved&&pt().id===":"&&(yt("label"),e=O,dt(),dt(":"),ht("label",e),O.labeled!==!0||m===y?e.stop("unexpected_label_a"):Y.test(e.string+":"
)&&e.warn("url"),O.label=e,e.init=!0,e.statement=O),t=O,X.id!=="else"&&yt(),bt("statement"),n=Ot(0,!0),n&&(n.arity==="statement"?n.id==="switch"||n.block&&n.id!=="do"?Nt():kt():(n.id==="("?n.first.id==="new"&&O.warn("bad_new"):n.id==="++"||n.id==="--"?Jt(n.
first):!n.assign&&n.id!=="delete"&&(!M.closure||!t.comments)&&t.warn("assignment_function_expression"),kt())),wt(),e&&(e.dead=!0),n}function tn(){var e=[],t,n;while(O.postscript!==!0)O.id===";"?(O.warn("unexpected_a"),kt()):(O.string==="use strict"&&((!L||m!==
y||e.length>0)&&O.warn("function_strict"),Lt()),t&&(O.warn("unreachable_a_b",O.string,t.string),t=null),n=en(),n&&(e.push(n),n.disrupt&&(t=n,e.disrupt=!0)));return e}function nn(e){var t,n=O,r=s,i=w,o=z;return w=e!=="function"&&e!=="try"&&e!=="catch",s=[],n
.id==="{"?(Nt(),dt("{"),bt(),e==="function"&&!Lt()&&!o&&!M.sloppy&&m.level===1&&O.warn("missing_use_strict"),t=tn(),z=o,wt("}",n)):w?n.stop("expected_a_b","{",ut()):(n.warn("expected_a_b","{",ut()),t=[en()],t.disrupt=t[0].disrupt),e!=="catch"&&t.length===0&&!
M.debug&&n.warn("empty_block"),s.forEach(function(e){q[e].dead=!0}),s=r,w=i,t}function rn(e){M.properties&&typeof H[e]!="number"&&X.warn("unexpected_property_a",e),H[e]?H[e]+=1:H[e]=1}function sn(e){return Tt(),e.first=Xt(Ot(150)),(r[e.first.id]===e||e.first
.assign)&&e.warn("confusing_a"),e}function on(){var e=Yt();return e||(O.id==="(string)"?(e=O.string,dt()):O.id==="(number)"&&(e=O.number.toString(),dt())),e}function un(){var e,t=[],n=O;dt("("),X.function=m,bt(),xt();if(O.id!==")")for(;;){yt(),e=Zt(),X.reserved&&
X.warn("expected_identifier_a_reserved"),ht("parameter",X),t.push(e),X.init=!0,X.writeable=!0;if(O.id!==",")break;Ct()}return xt(),wt(")",n),t}function an(e,t){var r=m,i=M,s=q;q=Object.create(s),m={closure:[],global:[],level:r.level+1,line:O.line,loopage:0,
name:t||"'"+(n||"").replace(et,it)+"'",outer:[],scope:q},m.parameter=un(),e.function=m,M=Object.create(i),g.push(m),t&&(e.name=t,e.string=t,ht("function",e),e.init=!0,e.used+=1),e.writeable=!1,Et(),e.block=nn("function"),Object.keys(q).forEach(function(e){var t=
q[e];!t.used&&t.kind!=="exception"&&(t.kind!=="parameter"||!M.unparam)?t.warn("unused_a"):t.init||t.warn("uninitialized_a")}),m=r,M=i,q=s}function fn(e){var t=O.string,n;return e.arity="statement",!m.breakage||!M.continue&&e.id==="continue"?e.warn("unexpected_a"
):O.identifier&&X.line===O.line?(St(),n=q[t],!n||n.kind!=="label"?O.warn("not_a_label"):n.dead||n.function!==m?O.warn("not_a_scope"):(n.used+=1,e.id==="break"&&(n.statement.break=!0),m.breakage[m.breakage.length-1]===n.statement&&O.warn("unexpected_a")),e.first=
O,dt()):e.id==="break"&&(m.breakage[m.breakage.length-1].break=!0),e}function ln(){function e(){var e=O,t=Object.create(null);dt("{");if(O.id!=="}")while(O.id!=="(end)"){while(O.id===",")O.warn("unexpected_a"),dt(",");O.id!=="(string)"&&O.warn("expected_string_a"
),t[O.string]===!0?O.warn("duplicate_a"):O.string==="__proto__"?O.warn("dangling_a"):t[O.string]=!0,dt(),dt(":"),ln();if(O.id!==",")break;dt(",");if(O.id==="}"){X.warn("unexpected_a");break}}dt("}",e)}function t(){var e=O;dt("[");if(O.id!=="]")while(O.id!=="(end)"
){while(O.id===",")O.warn("unexpected_a"),dt(",");ln();if(O.id!==",")break;dt(",");if(O.id==="]"){X.warn("unexpected_a");break}}dt("]",e)}switch(O.id){case"{":e();break;case"[":t();break;case"true":case"false":case"null":case"(number)":case"(string)":dt();break;
case"-":dt("-"),Tt(),dt("(number)");break;default:O.stop("unexpected_a")}}function cn(e){e=e.sort();var t,n=0,r,i;for(t=0;t<e.length;t+=1)i=e[t],i!==r&&(e[n]=i,r=i,n+=1);return e.length=n,e}var t={ass:!0,bitwise:!0,browser:!0,closure:!0,"continue":!0,couch:!0
,debug:!0,devel:!0,eqeq:!0,evil:!0,forin:!0,indent:10,maxerr:1e3,maxlen:256,newcap:!0,node:!0,nomen:!0,passfail:!0,plusplus:!0,properties:!0,regexp:!0,rhino:!0,unparam:!0,sloppy:!0,stupid:!0,sub:!0,todo:!0,vars:!0,white:!0},n,r={"<":!0,"<=":!0,"==":!0,"==="
:!0,"!==":!0,"!=":!0,">":!0,">=":!0,"+":!0,"-":!0,"*":!0,"/":!0,"%":!0},i,s,o=e(["clearInterval","clearTimeout","document","event","FormData","frames","history","Image","localStorage","location","name","navigator","Option","parent","screen","sessionStorage"
,"setInterval","setTimeout","Storage","window","XMLHttpRequest"],!1),u={a_label:"'{a}' is a statement label.",a_scope:"'{a}' used out of scope.",already_defined:"'{a}' is already defined.",and:"The '&&' subexpression should be wrapped in parens.",assignment_expression
:"Unexpected assignment expression.",assignment_function_expression:"Expected an assignment or function call and instead saw an expression.",avoid_a:"Avoid '{a}'.",bad_assignment:"Bad assignment.",bad_constructor:"Bad constructor.",bad_in_a:"Bad for in variable '{a}'."
,bad_invocation:"Bad invocation.",bad_new:"Do not use 'new' for side effects.",bad_number:"Bad number '{a}'.",bad_operand:"Bad operand.",bad_wrap:"Do not wrap function literals in parens unless they are to be immediately invoked.",combine_var:"Combine this with the previous 'var' statement."
,conditional_assignment:"Expected a conditional expression and instead saw an assignment.",confusing_a:"Confusing use of '{a}'.",confusing_regexp:"Confusing regular expression.",constructor_name_a:"A constructor name '{a}' should start with an uppercase letter."
,control_a:"Unexpected control character '{a}'.",dangling_a:"Unexpected dangling '_' in '{a}'.",deleted:"Only properties should be deleted.",duplicate_a:"Duplicate '{a}'.",empty_block:"Empty block.",empty_case:"Empty case.",empty_class:"Empty class.",evil:"eval is evil."
,expected_a_b:"Expected '{a}' and instead saw '{b}'.",expected_a_b_from_c_d:"Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",expected_a_at_b_c:"Expected '{a}' at column {b}, not column {c}.",expected_id_a:"Expected an id, and instead saw #{a}."
,expected_identifier_a:"Expected an identifier and instead saw '{a}'.",expected_identifier_a_reserved:"Expected an identifier and instead saw '{a}' (a reserved word).",expected_number_a:"Expected a number and instead saw '{a}'.",expected_operator_a:"Expected an operator and instead saw '{a}'."
,expected_positive_a:"Expected a positive number and instead saw '{a}'",expected_small_a:"Expected a small positive integer and instead saw '{a}'",expected_space_a_b:"Expected exactly one space between '{a}' and '{b}'.",expected_string_a:"Expected a string and instead saw '{a}'."
,for_if:"The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.",function_block:"Function statements should not be placed in blocks.Use a function expression or move the statement to the top of the outer function."
,function_eval:"The Function constructor is eval.",function_loop:"Don't make functions within a loop.",function_statement:"Function statements are not invocable. Wrap the whole function invocation in parens.",function_strict:"Use the function form of 'use strict'."
,identifier_function:"Expected an identifier in an assignment and instead saw a function invocation.",implied_evil:"Implied eval is evil. Pass a function instead of a string.",infix_in:"Unexpected 'in'. Compare with undefined, or use the hasOwnProperty method instead."
,insecure_a:"Insecure '{a}'.",isNaN:"Use the isNaN function to compare with NaN.",leading_decimal_a:"A leading decimal point can be confused with a dot: '.{a}'.",missing_a:"Missing '{a}'.",missing_a_after_b:"Missing '{a}' after '{b}'.",missing_property:"Missing property name."
,missing_space_a_b:"Missing space between '{a}' and '{b}'.",missing_use_strict:"Missing 'use strict' statement.",move_invocation:"Move the invocation into the parens that contain the function.",move_var:"Move 'var' declarations to the top of the function.",
name_function:"Missing name in function statement.",nested_comment:"Nested comment.",not:"Nested not.",not_a_constructor:"Do not use {a} as a constructor.",not_a_defined:"'{a}' has not been fully defined yet.",not_a_function:"'{a}' is not a function.",not_a_label
:"'{a}' is not a label.",not_a_scope:"'{a}' is out of scope.",not_greater:"'{a}' should not be greater than '{b}'.",octal_a:"Don't use octal: '{a}'. Use '\\u....' instead.",parameter_arguments_a:"Do not mutate parameter '{a}' when using 'arguments'.",parameter_a_get_b
:"Unexpected parameter '{a}' in get {b} function.",parameter_set_a:"Expected parameter (value) in set {a} function.",radix:"Missing radix parameter.",read_only:"Read only.",redefinition_a_b:"Redefinition of '{a}' from line {b}.",reserved_a:"Reserved name '{a}'."
,scanned_a_b:"{a} ({b}% scanned).",slash_equal:"A regular expression literal can be confused with '/='.",statement_block:"Expected to see a statement and instead saw a block.",stopping:"Stopping.",strange_loop:"Strange loop.",strict:"Strict violation.",subscript
:"['{a}'] is better written in dot notation.",sync_a:"Unexpected sync method: '{a}'.",tag_a_in_b:"A '<{a}>' must be within '<{b}>'.",todo_comment:"Unexpected TODO comment.",too_long:"Line too long.",too_many:"Too many errors.",trailing_decimal_a:"A trailing decimal point can be confused with a dot: '.{a}'."
,unclosed:"Unclosed string.",unclosed_comment:"Unclosed comment.",unclosed_regexp:"Unclosed regular expression.",unescaped_a:"Unescaped '{a}'.",unexpected_a:"Unexpected '{a}'.",unexpected_char_a:"Unexpected character '{a}'.",unexpected_comment:"Unexpected comment."
,unexpected_label_a:"Unexpected label '{a}'.",unexpected_property_a:"Unexpected /*property*/ '{a}'.",unexpected_space_a_b:"Unexpected space between '{a}' and '{b}'.",unexpected_typeof_a:"Unexpected 'typeof'. Use '===' to compare directly with {a}.",uninitialized_a
:"Uninitialized '{a}'.",unnecessary_else:"Unnecessary 'else' after disruption.",unnecessary_initialize:"It is not necessary to initialize '{a}' to 'undefined'.",unnecessary_use:"Unnecessary 'use strict'.",unreachable_a_b:"Unreachable '{a}' after '{b}'.",unsafe
:"Unsafe character.",unused_a:"Unused '{a}'.",url:"JavaScript URL.",use_array:"Use the array literal notation [].",use_braces:"Spaces are hard to count. Use {{a}}.",use_nested_if:"Expected 'else { if' and instead saw 'else if'.",use_object:"Use the object literal notation {} or Object.create(null)."
,use_or:"Use the || operator.",use_param:"Use a named parameter.",use_spaces:"Use spaces, not tabs.",used_before_a:"'{a}' was used before it was defined.",var_a_not:"Variable {a} was not declared correctly.",var_loop:"Don't declare variables in a loop.",weird_assignment
:"Weird assignment.",weird_condition:"Weird condition.",weird_new:"Weird construction. Delete 'new'.",weird_program:"Weird program.",weird_relation:"Weird relation.",weird_ternary:"Weird ternary.",wrap_immediate:"Wrap an immediate function invocation in parentheses to assist the reader in understanding that the expression is the result of a function, and not the function itself."
,wrap_regexp:"Wrap the /regexp/ literal in parens to disambiguate the slash operator.",write_is_wrong:"document.write can be a form of eval."},a=e(["goog"],!1),f,l,c=e(["emit","getRow","isArray","log","provides","registerType","require","send","start","sum"
,"toJSON"],!1),h={b:"\b",t:"	",n:"\n",f:"\f",r:"\r",'"':'"',"/":"/","\\":"\\","!":"!"},p=e(["alert","confirm","console","Debug","opera","prompt","WSH"],!1),d,v={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","'":"\\'",'"':'\\"',"/":"\\/","\\":"\\\\"}
,m,g,y,b,w,E,S,x,T,N,C,k=e(["Buffer","clearImmediate","clearInterval","clearTimeout","console","exports","global","module","process","require","setImmediate","setInterval","setTimeout","__dirname","__filename"],!1),L,A=e(["indexOf","lastIndexOf","search"],!0
),O,M,_,D,P,H,B,j=e(["g","i","m"],!0),F=function(){return this},I=e(["defineClass","deserialize","gc","help","load","loadClass","print","quit","readFile","readUrl","runCommand","seal","serialize","spawn","sync","toint32","version"],!1),q,R=e([";",'"',"'",")"
],!0),U=e(["Array","Boolean","Date","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","Error","eval","EvalError","Function","isFinite","isNaN","JSON","Map","Math","Number","Object","parseInt","parseFloat","Promise","Proxy","RangeError","ReferenceError"
,"Reflect","RegExp","Set","String","Symbol","SyntaxError","System","TypeError","URIError","WeakMap","WeakSet"],!1),z,W=Object.create(null),X,V,$,J,K=/\r\n?|\n/,Q=/[\u0000-\u0008\u000a-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/
,G=/^([a-zA-Z_$][a-zA-Z0-9_$]*)$/,Y=/^(?:javascript|jscript|ecmascript|vbscript)\s*:/i,Z=/\*\/|\/\*/,et=/[\u0000-\u001f'\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,tt=/Sync$/,nt=/^\W*to\s*do(?:\W|$)/i
,rt=/^\s*([(){}\[\]\?.,:;'"~#@`]|={1,3}|\/(\*(jslint|properties|property|members?|globals?)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|[\^%]=?|&[&=]?|\|[|=]?|>{1,3}=?|<(?:[\/=!]|\!(\[|--)?|<=?)?|\!(\!|==?)?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+(?:[xX][0-9a-fA-F]+|\.[0-9]*)?(?:[eE][+\-]?[0-9]+)?)/
;return typeof String.prototype.entityify!="function"&&(String.prototype.entityify=function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}),typeof String.prototype.isAlpha!="function"&&(String.prototype.isAlpha=function(){return this>="a"&&
this<="z\uffff"||this>="A"&&this<="Z\uffff"}),typeof String.prototype.isDigit!="function"&&(String.prototype.isDigit=function(){return this>="0"&&this<="9"}),typeof String.prototype.supplant!="function"&&(String.prototype.supplant=function(e){return this.replace
(/\{([^{}]*)\}/g,function(t,n){var r=e[n];return typeof r=="string"||typeof r=="number"?r:t})}),T=function(){function a(){var e;return t=1,u=N[s],s+=1,u===undefined?!1:(e=u.search(/\t/),e>=0&&(M.white?u=u.replace(/\t/g," "):ft("use_spaces",s,e+1)),e=u.search
(Q),e>=0&&ft("unsafe",s,e),M.maxlen&&M.maxlen<u.length&&ft("too_long",s,u.length),!0)}function c(e,n){var i,o;return e==="(string)"&&Y.test(n)&&ft("url",s,r),o=Object.create(W[e==="(punctuator)"||e==="(identifier)"&&Object.prototype.hasOwnProperty.call(W,n)?
n:e]||W["(error)"]),e==="(identifier)"&&(o.identifier=!0,n==="__iterator__"||n==="__proto__"?lt("reserved_a",s,r,n):!M.nomen&&(n.charAt(0)==="_"||n.charAt(n.length-1)==="_")&&ft("dangling_a",s,r,n)),e==="(number)"?o.number=+n:n!==undefined&&(o.string=String
(n)),o.line=s,o.from=r,o.thru=t,f.length&&(o.comments=f,f=[]),i=o.id,D=i&&("(,=:[!&|?{};~+-*%^<>".indexOf(i.charAt(i.length-1))>=0||i==="return"||i==="case"),o}function p(e){var o=e.exec(u),a;if(o)return i=o[0].length,a=o[1],n=a.charAt(0),u=u.slice(i),r=t+i-
a.length,t+=i,a;for(;;){if(!u){M.white||ft("unexpected_char_a",s,t-1,"(space)");return}n=u.charAt(0);if(n!==" ")break;u=u.slice(1),t+=1}lt("unexpected_char_a",s,t,n)}function d(e){function l(e){var r=parseInt(u.substr(i+1,e),16);i+=e,r>=32&&r<=126&&r!==34&&
r!==92&&r!==39&&ft("unexpected_a",s,t,"\\"),t+=e,n=String.fromCharCode(r)}var n,i=0,o="",f;x&&e!=='"'&&ft("expected_a_b",s,t,'"',e);for(;;){while(i>=u.length)i=0,a()||lt("unclosed",s-1,r);n=u.charAt(i);if(n===e)return t+=1,u=u.slice(i+1),f=c("(string)",o),f
.quote=e,f;if(n<" "){if(n==="\n"||n==="\r")break;ft("control_a",s,t+i,u.slice(0,i))}else if(n==="\\"){i+=1,t+=1,n=u.charAt(i);switch(n){case"":ft("unexpected_a",s,t,"\\"),a(),i=-1;break;case"'":x&&ft("unexpected_a",s,t,"\\'");break;case"u":l(4);break;case"v"
:x&&ft("unexpected_a",s,t,"\\v"),n="";break;case"x":x&&ft("unexpected_a",s,t,"\\x"),l(2);break;default:typeof h[n]!="string"?ft(n>="0"&&n<="7"?"octal_a":"unexpected_a",s,t,"\\"+n):n=h[n]}}o+=n,t+=1,i+=1}}function v(e){var r;return u.charAt(0).isAlpha()&&ft
("expected_space_a_b",s,t,n,u.charAt(0)),n==="0"&&(r=e.charAt(1),r.isDigit()?X.id!=="."&&ft("unexpected_a",s,t,e):x&&(r==="x"||r==="X")&&ft("unexpected_a",s,t,"0x")),e.slice(e.length-1)==="."&&ft("trailing_decimal_a",s,t,e),r=+e,isFinite(r)||ft("bad_number"
,s,t,e),e=r,c("(number)",e)}function m(e,n){l?ft("unexpected_comment",s,t):!M.todo&&nt.test(e)&&ft("todo_comment",s,t),f.push({id:n,from:r,thru:t,line:s,string:e})}function g(){var e=0,i,a,f=0,l="",h,p,d,v,m,g;for(;;){i=!0,n=u.charAt(e),e+=1;switch(n){case""
:lt("unclosed_regexp",s,r);return;case"/":f>0&&ft("unescaped_a",s,r+e,"/"),n=u.slice(0,e-1),v=Object.create(j);for(;;){p=u.charAt(e);if(v[p]!==!0)break;v[p]=!1,e+=1,l+=p}return u.charAt(e).isAlpha()&&lt("unexpected_a",s,r,u.charAt(e)),t+=e,u=u.slice(e),m=u.
charAt(0),(m==="/"||m==="*")&&lt("confusing_regexp",s,r),g=c("(regexp)",n),g.flag=l,g;case"\\":n=u.charAt(e),n<" "?ft("control_a",s,r+e,String(n)):n==="<"&&ft("unexpected_a",s,r+e,"\\"),e+=1;break;case"(":f+=1,i=!1;if(u.charAt(e)==="?"){e+=1;switch(u.charAt
(e)){case":":case"=":case"!":e+=1;break;default:ft("expected_a_b",s,r+e,":",u.charAt(e))}}break;case"|":i=!1;break;case")":f===0?ft("unescaped_a",s,r+e,")"):f-=1;break;case" ":o=1;while(u.charAt(e)===" ")e+=1,o+=1;o>1&&ft("use_braces",s,r+e,o);break;case"["
:n=u.charAt(e),n==="^"&&(e+=1,M.regexp?u.charAt(e)==="]"&&lt("unescaped_a",s,r+e,"^"):ft("insecure_a",s,r+e,n)),a=!1,n==="]"&&(ft("empty_class",s,r+e-1),a=!0);e:do{n=u.charAt(e),e+=1;switch(n){case"[":case"^":ft("unescaped_a",s,r+e,n),a=!0;break;case"-":a?a=!1
:(ft("unescaped_a",s,r+e,"-"),a=!0);break;case"]":a||ft("unescaped_a",s,r+e-1,"-");break e;case"\\":n=u.charAt(e),n<" "?ft("control_a",s,r+e,String(n)):n==="<"&&ft("unexpected_a",s,r+e,"\\"),e+=1,a=!0;break;case"/":ft("unescaped_a",s,r+e-1,"/"),a=!0;break;default:
a=!0}}while(n);break;case".":M.regexp||ft("insecure_a",s,r+e,n);break;case"]":case"?":case"{":case"}":case"+":case"*":ft("unescaped_a",s,r+e,n)}if(i)switch(u.charAt(e)){case"?":case"+":case"*":e+=1,u.charAt(e)==="?"&&(e+=1);break;case"{":e+=1,n=u.charAt(e),
(n<"0"||n>"9")&&ft("expected_number_a",s,r+e,n),e+=1,d=+n;for(;;){n=u.charAt(e);if(n<"0"||n>"9")break;e+=1,d=+n+d*10}h=d;if(n===","){e+=1,h=Infinity,n=u.charAt(e);if(n>="0"&&n<="9"){e+=1,h=+n;for(;;){n=u.charAt(e);if(n<"0"||n>"9")break;e+=1,h=+n+h*10}}}u.charAt
(e)!=="}"?ft("expected_a_b",s,r+e,"}",n):e+=1,u.charAt(e)==="?"&&(e+=1),d>h&&ft("not_greater",s,r+e,d,h)}}return n=u.slice(0,e-1),t+=e,u=u.slice(e),c("(regexp)",n)}var t,n,r,i,s,o,u;return{init:function(e){typeof e=="string"?N=e.split(K):N=e,s=0,a(),r=1},token
:function(){var e,n,i;for(;;){while(!u)if(!a())return c("(end)");i=p(rt);if(i){e=i.charAt(0);if(e.isAlpha()||e==="_"||e==="$")return c("(identifier)",i);if(e.isDigit())return v(i);switch(i){case'"':case"'":return d(i);case"//":m(u,"//"),u="";break;case"/*":
for(;;){n=u.search(Z);if(n>=0)break;t=u.length,m(u),r=0,a()||lt("unclosed_comment",s,t)}m(u.slice(0,n),"/*"),t+=n+2,u.charAt(n)==="/"&&lt("nested_comment",s,t),u=u.slice(n+2);break;case"":break;case"/":return X.id==="/="&&lt("slash_equal",s,r),D?g():c("(punctuator)"
,i);default:return c("(punctuator)",i)}}}}}}(),d=function(){var t=this.id,n=l,r=E;l=!0,E=null,O.line===X.line&&O.from===X.thru&&O.warn("missing_space_a_b",ut(X),ut()),C.length>0&&this.warn("unexpected_a");switch(t){case"/*properties":case"/*property":case"/*members"
:case"/*member":gt();break;case"/*jslint":mt();break;case"/*globals":case"/*global":vt();break;default:this.stop("unexpected_a")}l=n,dt("*/"),E=r},B={nud:function(){this.stop("unexpected_a")},led:function(){this.stop("expected_operator_a")},warn:function(e,
t,n,r,i){this.warning||(this.warning=ft(e,this.line||0,this.from||0,t||ut(this),n,r,i))},stop:function(e,t,n,r,i){return this.warning=undefined,this.warn(e,t,n,r,i),at("stopping",this.line,this.character)},lbp:0},function(){var e=Mt("(identifier)");e.nud=function(
){var e=this.string,t=q[e],n;return t?this.master=t:(n=_[e],typeof n=="boolean"?b[e]=t={dead:!1,"function":y,kind:"var",string:e,writeable:n}:X.warn("used_before_a")),t&&(t.kind==="label"?this.warn("a_label"):((t.dead===!0||t.dead===m)&&this.warn("a_scope")
,t.used+=1,t.function!==m&&(t.function===y?m.global.push(e):(t.function.closure.push(e),m.outer.push(e))))),this},e.identifier=!0}(),It("(array)","array"),It("(function)","function"),It("(number)","number",F),It("(object)","object"),It("(string)","string",F
),It("(boolean)","boolean",F),It("(regexp)","regexp",F),Dt("(begin)"),Dt("(end)"),Dt("(error)"),_t(Mt("}")),Mt(")"),Mt("]"),_t(Mt('"')),_t(Mt("'")),Mt(";"),Mt(":"),Mt(","),Mt("#"),Mt("@"),Mt("*/"),_t(qt("case")),qt("catch"),_t(qt("default")),qt("else"),qt("finally"
),Ut("arguments",function(e){z&&m===y&&e.warn("strict"),m.arguments=!0}),Ut("eval"),Rt("false","boolean"),Rt("Infinity","number"),Rt("NaN","number"),Rt("null",""),Ut("this",function(e){z&&m.statement&&m.name.charAt(0)>"Z"&&e.warn("strict")}),Rt("true","boolean"
),Rt("undefined",""),zt("?",30,function(e,t){bt("?"),t.first=Xt(Wt(e)),t.second=Ot(0),Nt(),wt();var n=O;return dt(":"),bt(":"),Nt(),t.third=Ot(10),t.arity="ternary",At(t.second,t.third)?n.warn("weird_ternary"):At(t.first,t.second)&&t.warn("use_or"),wt(),t})
,zt("||",40,function(e,t){function n(e){return e.id==="&&"&&!e.paren&&e.warn("and"),e}return t.first=n(Xt(Wt(e))),t.second=n(Wt(Ot(40))),At(t.first,t.second)&&t.warn("weird_condition"),t}),zt("&&",50,function(e,t){return t.first=Xt(Wt(e)),t.second=Wt(Ot(50)
),At(t.first,t.second)&&t.warn("weird_condition"),t}),Ft("void",function(e){return e.first=Ot(0),e.warn("expected_a_b","undefined","void"),e}),Qt("|",70),Qt("^",80),Qt("&",90),$t("==","==="),$t("==="),$t("!=","!=="),$t("!=="),$t("<"),$t(">"),$t("<="),$t(">="
),Qt("<<",120),Qt(">>",120),Qt(">>>",120),zt("in",120,function(e,t){return t.warn("infix_in"),t.left=e,t.right=Ot(130),t}),zt("instanceof",120),zt("+",130,function(e,t){e.id==="(number)"?e.number===0&&e.warn("unexpected_a","0"):e.id==="(string)"&&e.string===""&&
e.warn("expected_a_b","String","''");var n=Ot(130);n.id==="(number)"?n.number===0&&n.warn("unexpected_a","0"):n.id==="(string)"&&n.string===""&&n.warn("expected_a_b","String","''");if(e.id===n.id)if(e.id==="(string)"||e.id==="(number)")return e.id==="(string)"?
(e.string+=n.string,Y.test(e.string)&&e.warn("url")):e.number+=n.number,e.thru=n.thru,e;return t.first=e,t.second=n,t}),Ft("+"),Ft("+++",function(){return X.warn("confusing_a"),this.first=Ot(150),this.arity="prefix",this}),zt("+++",130,function(e){return X.
warn("confusing_a"),this.first=e,this.second=Ot(130),this}),zt("-",130,function(e,t){(e.id==="(number)"&&e.number===0||e.id==="(string)")&&e.warn("unexpected_a");var n=Ot(130);return(n.id==="(number)"&&n.number===0||n.id==="(string)")&&n.warn("unexpected_a"
),e.id===n.id&&e.id==="(number)"?(e.number-=n.number,e.thru=n.thru,e):(t.first=e,t.second=n,t)}),Ft("-"),Ft("---",function(){return X.warn("confusing_a"),this.first=Ot(150),this.arity="prefix",this}),zt("---",130,function(e){return X.warn("confusing_a"),this
.first=e,this.second=Ot(130),this}),zt("*",140,function(e,t){(e.id==="(number)"&&(e.number===0||e.number===1)||e.id==="(string)")&&e.warn("unexpected_a");var n=Ot(140);return(n.id==="(number)"&&(n.number===0||n.number===1)||n.id==="(string)")&&n.warn("unexpected_a"
),e.id===n.id&&e.id==="(number)"?(e.number*=n.number,e.thru=n.thru,e):(t.first=e,t.second=n,t)}),zt("/",140,function(e,t){(e.id==="(number)"&&e.number===0||e.id==="(string)")&&e.warn("unexpected_a");var n=Ot(140);return(n.id==="(number)"&&(n.number===0||n.number===1
)||n.id==="(string)")&&n.warn("unexpected_a"),e.id===n.id&&e.id==="(number)"?(e.number/=n.number,e.thru=n.thru,e):(t.first=e,t.second=n,t)}),zt("%",140,function(e,t){(e.id==="(number)"&&(e.number===0||e.number===1)||e.id==="(string)")&&e.warn("unexpected_a"
);var n=Ot(140);return(n.id==="(number)"&&n.number===0||n.id==="(string)")&&n.warn("unexpected_a"),e.id===n.id&&e.id==="(number)"?(e.number%=n.number,e.thru=n.thru,e):(t.first=e,t.second=n,t)}),Gt("++"),Ft("++"),Gt("--"),Ft("--"),Ft("delete",function(e){Et(
);var t=Ot(0);return(!t||t.id!=="."&&t.id!=="[")&&O.warn("deleted"),e.first=t,e}),Ft("~",function(e){return Tt(),M.bitwise||e.warn("unexpected_a"),e.first=Ot(150),e}),Ft("!",sn),Ft("!!",sn),Ft("typeof"),Ft("new",function(e){Et();var t=Ot(160),n,r,i;e.first=
t;if(t.id!=="function")if(t.identifier)switch(t.string){case"Object":X.warn("use_object");break;case"Array":if(O.id==="("){r=O,r.first=this,dt("(");if(O.id!==")"){n=Ot(0),r.second=[n],(n.id==="(string)"||O.id===",")&&r.warn("use_array");while(O.id===",")dt(","
),r.second.push(Ot(0))}else X.warn("use_array");return dt(")",r),r}X.warn("use_array");break;case"Number":case"String":case"Boolean":case"Math":case"JSON":t.warn("not_a_constructor");break;case"Function":M.evil||O.warn("function_eval");break;case"Date":case"RegExp"
:case"this":break;default:t.id!=="function"&&(i=t.string.charAt(0),!M.newcap&&(i<"A"||i>"Z")&&X.warn("constructor_name_a"))}else t.id!=="."&&t.id!=="["&&t.id!=="("&&X.warn("bad_constructor");else e.warn("weird_new");return O.id!=="("&&O.warn("missing_a","()"
),e}),zt("(",160,function(e,t){var n,r;E&&E.mode==="expression"?xt(P,X):Tt(P,X),!e.immed&&e.id==="function"&&O.warn("wrap_immediate"),r=[],e.identifier?e.string.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)?e.string!=="Number"&&e.string!=="String"&&e.string!=="Boolean"&&
e.string!=="Date"&&(e.string==="Math"?e.warn("not_a_function"):e.string==="Object"?X.warn("use_object"):(e.string==="Array"||!M.newcap)&&e.warn("missing_a","new")):e.string==="JSON"&&e.warn("not_a_function"):e.id==="."&&e.second.string==="split"&&e.first.id==="(string)"&&
e.second.warn("use_array"),bt();if(O.id!==")"){xt();for(;;){yt(),n=Ot(10),e.string==="Boolean"&&(n.id==="!"||n.id==="~")&&n.warn("weird_condition"),r.push(n);if(O.id!==",")break;Ct()}}return xt(),wt(")",t),typeof e=="object"&&(e.string==="parseInt"&&r.length===1?
e.warn("radix"):e.string==="String"&&r.length>=1&&r[0].id==="(string)"&&e.warn("unexpected_a"),M.evil||(e.string==="eval"||e.string==="Function"||e.string==="execScript"?e.warn("evil"):r[0]&&r[0].id==="(string)"&&(e.string==="setTimeout"||e.string==="setInterval"
)&&e.warn("implied_evil")),!e.identifier&&e.id!=="."&&e.id!=="["&&e.id!=="("&&e.id!=="&&"&&e.id!=="||"&&e.id!=="?"&&e.warn("bad_invocation"),e.id==="."&&(r.length>0&&e.first&&e.first.first&&At(r[0],e.first.first)&&(e.second.string==="call"||e.second.string==="apply"&&
(r.length===1||r[1].arity==="prefix"&&r[1].id==="["))&&e.second.warn("unexpected_a"),e.second.string==="toString"&&(e.first.id==="(string)"||e.first.id==="(number)")&&e.second.warn("unexpected_a"))),t.first=e,t.second=r,t},!0),Ft("(",function(e){bt("expression"
),xt(),yt(),O.id==="function"&&(O.immed=!0);var t=Ot(0);t.paren=!0,xt(),wt(")",e);if(t.id==="function")switch(O.id){case"(":O.warn("move_invocation");break;case".":case"[":O.warn("unexpected_a");break;default:e.warn("bad_wrap")}else t.arity||(!M.closure||!e
.comments)&&e.warn("unexpected_a");return t}),zt(".",170,function(e,t){xt(P,X),xt();var n=Zt();return typeof n=="string"&&rn(n),t.first=e,t.second=X,!e||e.string!=="arguments"||n!=="callee"&&n!=="caller"?!M.evil&&e&&e.string==="document"&&(n==="write"||n==="writeln"
)?e.warn("write_is_wrong"):!M.stupid&&tt.test(n)?X.warn("sync_a"):e&&e.id==="{"&&t.warn("unexpected_a"):e.warn("avoid_a","arguments."+n),!M.evil&&(n==="eval"||n==="execScript")&&O.warn("evil"),t},!0),zt("[",170,function(e,t){var n,r;Tt(P,X),xt(),bt(),yt(),n=
Ot(0);switch(n.id){case"(number)":n.id==="(number)"&&e.id==="arguments"&&e.warn("use_param");break;case"(string)":!!M.evil||n.string!=="eval"&&n.string!=="execScript"?!M.sub&&G.test(n.string)&&(r=W[n.string],(!r||!r.reserved)&&n.warn("subscript")):n.warn("evil"
),rn(n.string)}return e&&(e.id==="{"||e.id==="["&&e.arity==="prefix")&&t.warn("unexpected_a"),wt("]",t),xt(P,X),t.first=e,t.second=n,t},!0),Ft("[",function(e){e.first=[],bt("array");while(O.id!=="(end)"){while(O.id===",")O.warn("unexpected_a"),dt(",");if(O.
id==="]")break;E.wrap=!1,yt(),e.first.push(Ot(10));if(O.id!==",")break;Ct();if(O.id==="]"){X.warn("unexpected_a");break}}return wt("]",e),e},170),Kt("="),Kt("+=","+"),Kt("-=","-"),Kt("*=","*"),Kt("/=","/").nud=function(){O.stop("slash_equal")},Kt("%=","%"),
Kt("&=","&"),Kt("|=","|"),Kt("^=","^"),Kt("<<=","<<"),Kt(">>=",">>"),Kt(">>>=",">>>"),Ft("{",function(e){var t,n,r,i,s,o=Object.create(null);e.first=[],bt();while(O.id!=="}"){E.wrap=!1,yt(),O.string==="get"&&pt().id!==":"?(t=O,dt("get"),St(),i=O,n=on(),n||O
.stop("missing_property"),t.string="",an(t),m.loopage&&t.warn("function_loop"),t.function.parameter.length&&t.warn("parameter_a_get_b",t.function.parameter[0],n),Ct(),s=O,Nt(),yt(),dt("set"),s.string="",St(),r=on(),n!==r&&X.stop("expected_a_b",n,r||O.string
),an(s),s.block.length===0&&X.warn("missing_a","throw"),s.function.parameter.length===0?s.stop("parameter_set_a","value"):s.function.parameter[0]!=="value"&&s.stop("expected_a_b","value",s.function.parameter[0]),i.first=[t,s]):(i=O,n=on(),typeof n!="string"&&
O.stop("missing_property"),dt(":"),Nt(),i.first=Ot(10)),e.first.push(i),o[n]===!0&&O.warn("duplicate_a",n),o[n]=!0,rn(n);if(O.id!==",")break;for(;;){Ct();if(O.id!==",")break;O.warn("unexpected_a")}O.id==="}"&&X.warn("unexpected_a")}return wt("}",e),e}),Ht("{"
,function(){return O.warn("statement_block"),this.arity="statement",this.block=tn(),this.disrupt=this.block.disrupt,dt("}",this),this}),Ht("/*global",d),Ht("/*globals",d),Ht("/*jslint",d),Ht("/*member",d),Ht("/*members",d),Ht("/*property",d),Ht("/*properties"
,d),Ht("var",function(){var e,t,n;m.loopage?O.warn("var_loop"):m.varstatement&&!M.vars&&O.warn("combine_var"),m!==y&&(m.varstatement=!0),this.arity="statement",this.first=[],bt("var");for(;;){n=O,t=Zt(!0),ht("var",n),n.dead=m,O.id==="="?(m===y&&!n.writeable&&
n.warn("read_only"),e=O,e.first=n,Nt(),dt("="),Nt(),O.id==="undefined"&&X.warn("unnecessary_initialize",t),pt(0).id==="="&&O.identifier&&O.stop("var_a_not"),e.second=Ot(0),e.arity="infix",n.init=!0,this.first.push(e)):this.first.push(n),n.dead=!1,n.writeable=!0
;if(O.id!==",")break;Ct(),E.wrap=!1,$&&O.line===X.line&&this.first.length===1&&($=null,E.open=!1,E.at-=M.indent),Nt(),yt()}return $=null,wt(),this}),Ht("function",function(){Et(),w&&X.warn("function_block");var e=O,t=Zt(!0);return ht("var",e),e.writeable||e
.warn("read_only"),e.init=!0,e.statement=!0,xt(),this.arity="statement",an(this,t),O.id==="("&&O.line===X.line&&O.stop("function_statement"),this}),Ft("function",function(e){var t=Yt(!0),n;t?(n=X,xt()):(t="",Et()),an(e,t),n&&(n.function=e.function),m.loopage&&
e.warn("function_loop");switch(O.id){case";":case"(":case")":case",":case"]":case"}":case":":case"(end)":break;case".":(pt().string!=="bind"||pt(1).id!=="(")&&O.warn("unexpected_a");break;default:O.stop("unexpected_a")}return e.arity="function",e}),Ht("if",
function(){var e=O;return Et(),dt("("),bt("control"),xt(),yt(),this.arity="statement",this.first=Xt(Wt(Ot(0))),xt(),wt(")",e),Et(),this.block=nn("if"),O.id==="else"&&(this.block.disrupt&&O.warn(this.elif?"use_nested_if":"unnecessary_else"),Et(),dt("else"),Et
(),O.id==="if"?(O.elif=!0,this.else=en(!0)):this.else=nn("else"),this.else.disrupt&&this.block.disrupt&&(this.disrupt=!0)),this}),Ht("try",function(){var e,t;return Et(),this.arity="statement",this.block=nn("try"),O.id==="catch"&&(Et(),dt("catch"),Et(),t=O,
dt("("),bt("control"),xt(),yt(),e=O,this.first=Zt(),ht("exception",e),e.init=!0,xt(),wt(")",t),Et(),this.second=nn("catch"),this.second.length?this.first==="ignore"&&e.warn("unexpected_a"):this.first!=="ignore"&&e.warn("expected_a_b","ignore",e.string),e.dead=!0
),O.id==="finally"?(Et(),dt("finally"),Et(),this.third=nn("finally")):this.second||O.stop("expected_a_b","catch",ut()),this}),jt("while",function(){Et();var e=O;return m.loopage+=1,dt("("),bt("control"),xt(),yt(),this.arity="statement",this.first=Wt(Ot(0)),
this.first.id!=="true"&&Xt(this.first,"unexpected_a"),xt(),wt(")",e),Et(),this.block=nn("while"),this.block.disrupt&&P.warn("strange_loop"),m.loopage-=1,this}),qt("with"),jt("switch",function(){function s(e){At(n,e)&&e.warn("duplicate_a")}var e=[],t=w,n,r=X
,i=O;Et(),dt("("),xt(),bt(),this.arity="statement",this.first=Xt(Wt(Ot(0))),xt(),wt(")",i),Et(),dt("{"),bt(),w=!0,this.second=[],r.from!==O.from&&!M.white&&O.warn("expected_a_at_b_c",O.string,r.from,O.from);while(O.id==="case"){i=O,i.first=[],i.arity="case"
;for(;;){Nt(),yt("case"),dt("case"),Et(),n=Ot(0),e.forEach(s),e.push(n),i.first.push(n),n.id==="NaN"&&n.warn("unexpected_a"),Tt(),dt(":");if(O.id!=="case")break}Nt(),i.second=tn(),i.second&&i.second.length>0?i.second[i.second.length-1].disrupt||O.warn("missing_a_after_b"
,"break","case"):O.warn("empty_case"),this.second.push(i)}return this.second.length===0&&O.warn("missing_a","case"),O.id==="default"&&(Nt(),i=O,i.arity="case",yt("case"),dt("default"),Tt(),dt(":"),Nt(),i.second=tn(),i.second&&i.second.length>0?this.disrupt=
i.second[i.second.length-1].disrupt:i.warn("empty_case"),this.second.push(i)),this.break&&(this.disrupt=!1),Nt(),wt("}",this),w=t,this}),Ht("debugger",function(){return M.debug||this.warn("unexpected_a"),this.arity="statement",this}),jt("do",function(){m.loopage+=1
,Et(),this.arity="statement",this.block=nn("do"),this.block.disrupt&&P.warn("strange_loop"),Et(),dt("while");var e=O;return Et(),dt("("),bt(),xt(),yt(),this.first=Xt(Wt(Ot(0)),"unexpected_a"),xt(),wt(")",e),m.loopage-=1,this}),jt("for",function(){var e,t,n,
r=!1,i=O,s;this.arity="statement",m.loopage+=1,dt("(");if(O.id===";")xt(),dt(";"),xt(),dt(";"),xt(),dt(")"),e=nn("for");else{bt("control"),Nt(this,i),xt(),O.id==="var"&&O.stop("move_var"),yt();if(pt(0).id==="in"){this.forin=!0,s=Ot(1e3),n=s.master,n||s.stop
("bad_in_a"),(n.kind!=="var"||n.function!==m||!n.writeable||n.dead)&&s.warn("bad_in_a"),n.init=!0,n.used-=1,this.first=s,dt("in"),this.second=Ot(20),wt(")",i),e=nn("for");if(!M.forin){if(e.length===1&&typeof e[0]=="object")if(e[0].id==="if"&&!e[0].else){t=e
[0].first;while(t.id==="&&")t=t.first;switch(t.id){case"===":case"!==":r=t.first.id==="["?At(t.first.first,this.second)&&At(t.first.second,this.first):t.first.id==="typeof"&&t.first.first.id==="["&&At(t.first.first.first,this.second)&&At(t.first.first.second
,this.first);break;case"(":r=t.first.id==="."&&(At(t.first.first,this.second)&&t.first.second.string==="hasOwnProperty"&&At(t.second[0],this.first)||t.first.first.id==="."&&t.first.first.first.first&&t.first.first.first.first.string==="Object"&&t.first.first
.first.id==="."&&t.first.first.first.second.string==="prototype"&&t.first.first.second.string==="hasOwnProperty"&&t.first.second.string==="call"&&At(t.second[0],this.second)&&At(t.second[1],this.first))}}else e[0].id==="switch"&&(r=e[0].id==="switch"&&e[0].
first.id==="typeof"&&e[0].first.first.id==="["&&At(e[0].first.first.first,this.second)&&At(e[0].first.first.second,this.first));r||this.warn("for_if")}}else{yt(),this.first=[];for(;;){this.first.push(Ot(0,"for"));if(O.id!==",")break;Ct()}kt(),yt(),this.second=
Wt(Ot(0)),this.second.id!=="true"&&Xt(this.second,"unexpected_a"),kt(X),O.id===";"&&O.stop("expected_a_b",")",";"),this.third=[],yt();for(;;){this.third.push(Ot(0,"for"));if(O.id!==",")break;Ct()}xt(),wt(")",i),Et(),e=nn("for")}}return e.disrupt&&P.warn("strange_loop"
),this.block=e,m.loopage-=1,this}),Bt("break",function(){return fn(this)}),Bt("continue",function(){return fn(this)}),Bt("return",function(){return m===y&&this.warn("unexpected_a"),this.arity="statement",O.id!==";"&&O.line===X.line&&(M.closure?Nt():St(),(O.
id==="/"||O.id==="(regexp)")&&O.warn("wrap_regexp"),this.first=Ot(0),this.first.assign&&this.first.warn("unexpected_a")),this}),Bt("throw",function(){return this.arity="statement",St(),this.first=Ot(20),this}),qt("class"),qt("const"),qt("enum"),qt("export")
,qt("extends"),qt("import"),qt("super"),qt("implements"),qt("interface"),qt("let"),qt("package"),qt("private"),qt("protected"),qt("public"),qt("static"),qt("yield"),S=function(t,n){var r,o,u;S.errors=[],S.tree="",S.properties="",i=P=X=O=Object.create(W["(begin)"
]),V=[],_=Object.create(null),st(U),H=Object.create(null);if(n){M=Object.create(n),o=M.predef;if(o)if(Array.isArray(o))for(r=0;r<o.length;r+=1)_[o[r]]=!0;else typeof o=="object"&&st(o)}else M=Object.create(null);M.indent=+M.indent||4,M.maxerr=+M.maxerr||50,
b=q=Object.create(null),y=m={scope:q,loopage:0,level:0},g=[m],s=[],f=[],l=!1,w=!1,E=null,x=!1,C=[],L=!1,D=!0,z=!1,$=null,J=0,T.init(t),ot();try{dt();if(O.id==="(number)")O.stop("unexpected_a");else switch(O.id){case"{":case"[":l=!0,x=!0,ln();break;default:bt
(1),O.id===";"&&!L&&(O.edge=!0,dt(";")),u=tn(),i.first=u,S.tree=i,u.disrupt&&P.warn("weird_program")}E=null,dt("(end)"),S.property=H}catch(a){a&&S.errors.push({reason:a.message,line:a.line||O.line,character:a.character||O.from},null)}return S.errors.length===0
},S.data=function(){function s(e){var n=i[e].kind;switch(n){case"var":case"exception":case"label":t[n].push(e)}}var e={functions:[]},t,n,r,i;e.errors=S.errors,e.json=x,e.global=cn(Object.keys(b));for(n=1;n<g.length;n+=1)r=g[n],t={name:r.name,line:r.line,level
:r.level,parameter:r.parameter,"var":[],exception:[],closure:cn(r.closure),outer:cn(r.outer),global:cn(r.global),label:[]},i=r.scope,Object.keys(i).forEach(s),t.var.sort(),t.exception.sort(),t.label.sort(),e.functions.push(t);return e.tokens=V,e},S.error_report=
function(e){var t,n,r=[],i;if(e.errors.length){e.json&&r.push("<cite>JSON: bad.</cite><br>");for(n=0;n<e.errors.length;n+=1)i=e.errors[n],i&&(t=i.evidence||"",r.push("<cite>"),isFinite(i.line)&&r.push("<address>line "+String(i.line)+" character "+String(i.character
)+"</address>"),r.push(i.reason.entityify()+"</cite>"),t&&r.push("<pre>"+t.entityify()+"</pre>"))}return r.join("")},S.report=function(e){function u(e,t){var n=!1;t.length&&(s.push("<dt>"+e+"</dt><dd>"),t.forEach(function(e){s.push((n?", ":"")+e),n=!0}),s.push
("</dd>"))}var t,n,r,i,s=[],o;s.push("<dl class=level0>"),e.global.length?(u("global",e.global),t=!0):e.json?e.errors.length||s.push("<dt>JSON: good.</dt>"):s.push("<dt><i>No new global variables introduced.</i></dt>"),t?s.push("</dl>"):s[0]="";if(e.functions
)for(n=0;n<e.functions.length;n+=1){o=e.functions[n],i=[];if(o.params)for(r=0;r<o.params.length;r+=1)i[r]=o.params[r].string;s.push("<dl class=level"+o.level+"><address>line "+String(o.line)+"</address>"+o.name.entityify()),u("parameter",o.parameter),u("variable"
,o.var),u("exception",o.exception),u("closure",o.closure),u("outer",o.outer),u("global",o.global),u("label",o.label),s.push("</dl>")}return s.join("")},S.properties_report=function(e){if(!e)return"";var t,n,r=Object.keys(e).sort(),i="   ",s,o=!1,u=["/*properties"
];for(t=0;t<r.length;t+=1)n=r[t],e[n]>0&&(o&&(i+=","),s=G.test(n)?n:"'"+n.replace(et,it)+"'",i.length+s.length>=80?(u.push(i),i="    "):i+=" ",i+=s,o=!0);return u.push(i,"*/\n"),u.join("\n")},S.color=function(e){var t,n=1,r,i,s=[],o,u=e.tokens[0];while(u&&u
.id!=="(end)"){t=u.from,i=u.line,o=u.thru,r=u.function.level;do o=u.thru,u=e.tokens[n],n+=1;while(u&&u.line===i&&u.from-o<5&&r===u.function.level);s.push({line:i,level:r,from:t,thru:o})}return s},S.jslint=S,S.edition="2014-07-08",S}()
local.CSSLint = CSSLint; local.JSLINT = JSLINT; }());
/* jslint-ignore-end */



    // run shared js-env code - function
    (function () {
        local.jslintAndPrint = function (script, file) {
        /*
         * this function will jslint / csslint the script and print any errors to stderr
         */
            var ignoreDict, lineno, scriptParsed;
            // cleanup errors
            local.errorCounter = 0;
            local.errorText = '';
            // do nothing for empty script
            if (!script.length) {
                return script;
            }
            // init ignoreDict
            ignoreDict = {};
            // init lineno
            lineno = 0;
            // parse script
            scriptParsed = script
                // indent text-block
                // /* jslint-indent-begin */ ... /* jslint-indent-end */
                .replace(
/* jslint-indent-begin 20 */
(function () {
    /*jslint maxlen: 256*/
    return (/^ *?\/\* jslint-indent-begin (\d+?) \*\/$[\S\s]+?^ *?\/\* jslint-indent-end \*\/$/gm);
}()),
/* jslint-indent-end */
                    function (match0, match1) {
                        return match0.replace(
                            (/(^ *\S)/gm),
                            new Array(Number(match1) + 1).join(' ') + '$1'
                        );
                    }
                )
                // ignore text-block
                // /* jslint-ignore-begin */ ... /* jslint-ignore-end */
                .replace(
/* jslint-ignore-begin */
(/^ *?\/\* jslint-ignore-begin \*\/$[\S\s]+?^ *?\/\* jslint-ignore-end \*\/$/gm),
/* jslint-ignore-end */
                    function (match0) {
                        return match0.replace((/.*/g), '');
                    }
                )
                // ignore next-line
                // /* jslint-ignore-next-line */
                .replace(
/* jslint-ignore-next-line */
(/^ *?\/\* jslint-ignore-next-line \*\/\n.*/gm),
                    function (match0) {
                        return match0.replace((/.*/g), '');
                    }
                );
            // csslint script
            if (file.slice(-4) === '.css') {
                scriptParsed = scriptParsed.replace(new RegExp([
                    // handle flexbox
                    ' display: flex;',
                    ' flex: .+?;',
                    ' flex-.+?: .+?;'
                ].join('|'), 'g'), function () {
                    return ' background: url(' + Math.random() + ');';
                });
                local.CSSLint.errors = local.CSSLint.verify(scriptParsed).messages
                    .filter(function (error) {
                        return !ignoreDict[error.rule.id];
                    });
                // if error occurred, then print colorized error messages
                if (!local.CSSLint.errors.length) {
                    return script;
                }
                local.errorText = '\n\u001b[1m' + file + '\u001b[22m\n';
                local.CSSLint.errors
                    .filter(function (error) {
                        return error;
                    })
                    .forEach(function (error) {
                        local.errorCounter += 1;
                        lineno += 1;
                        local.errorText +=
                            (' #' + String(lineno) + ' ').slice(-4) +
                            '\u001b[33m' + error.type + ' - ' + error.rule.id +
                            ' - ' + error.message + '\n    ' + error.rule.desc +
                            '\u001b[39m\n    ' + String(error.evidence).trim() +
                            '\u001b[90m \/\/ line ' + error.line +
                            ', col ' + error.col + '\u001b[39m\n';
                    });
            // jslint script
            } else {
                scriptParsed = scriptParsed
                    // comment shebang
                    .replace((/^#!/), '//');
                if (local.JSLINT(scriptParsed)) {
                    return script;
                }
                // if error occurred, then print colorized error messages
                local.errorText = '\n\u001b[1m' + file + '\u001b[22m\n';
                local.JSLINT.errors
                    .filter(function (error) {
                        return error;
                    })
                    .forEach(function (error) {
                        local.errorCounter += 1;
                        lineno += 1;
                        local.errorText +=
                            (' #' + String(lineno) + ' ').slice(-4) +
                            '\u001b[33m' + error.reason +
                            '\u001b[39m\n    ' + String(error.evidence).trim() +
                            '\u001b[90m \/\/ Line ' + error.line +
                            ', Pos ' + error.character + '\u001b[39m\n';
                    });
            }
            // print error to stderr
            console.error(local.errorText);
            return script;
        };
    }());
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        // export jslint
        window.utility2_jslint = local;
        break;



    /* istanbul ignore next */
    // run node js-env code - post-init
    case 'node':
        // export jslint
        module.exports = module['./lib.jslint.js'] = module.jslint = local;
        module.exports.__dirname = __dirname;
        // require modules
        local.fs = require('fs');
        local.path = require('path');
        // run the cli
        if (module !== require.main || module.isRollup) {
            break;
        }
        // jslint files
        process.argv.slice(2).forEach(function (arg) {
            if (arg[0] !== '-') {
                local.jslintAndPrint(
                    local.fs.readFileSync(local.path.resolve(arg), 'utf8'),
                    arg
                );
            }
        });
        // if error occurred, then exit with non-zero code
        process.exit(local.errorCounter);
        break;
    }
}());




// /assets.utility2.lib.nedb.js
/*
 * assets.nedb-lite.js
 *
 * this package will run a standalone, browser-compatible version of the nedb v1.8.0 database
 * with zero npm-dependencies
 *
 * browser example:
 *     <script src="assets.nedb-lite.js"></script>
 *     <script>
 *     var table = new window.Nedb();
 *     table.insert({ field1: 'hello', field2: 'world'}, console.log.bind(console));
 *     </script>
 *
 * node example:
 *     var Nedb = require('./assets.nedb-lite.js');
 *     var table = new Nedb();
 *     table.insert({ field1: 'hello', field2: 'world'}, console.log.bind(console));
 */



/* !istanbul instrument in package nedb-lite */
/*jslint
    browser: true,
    maxerr: 8,
    maxlen: 96,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function (local) {
    'use strict';
    var nop, require;



    // run shared js-env code - pre-init
    (function () {
        nop = function () {
        /*
         * this function will do nothing
         */
            return;
        };
        // jslint-hack
        nop(require);
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        require = function (key) {
            switch (key) {
            case 'async':
                return {
                    apply: function (task, arg1) {
                        return function (callback) {
                            task(arg1, callback);
                        };
                    },
                    waterfall: function (taskList, onError) {
                        var modeNext, onNext;
                        modeNext = -1;
                        onNext = function (error) {
                            modeNext += 1;
                            if (error || !taskList[modeNext]) {
                                onError(error);
                                return;
                            }
                            taskList[modeNext](onNext);
                        };
                        onNext();
                    }
                };
            case 'mkdirp':
                return function (dir, onError) {
                /*
                 * this function will mkdirp the dir
                 */
                    var error;
                    // optimization - do not re-mkdirp fsDirInitialized
                    if (dir && dir === local.fsDirInitialized) {
                        onError();
                        return;
                    }
                    try {
                        if (!local.fs.existsSync(dir)) {
                            local.child_process.spawnSync('mkdir', ['-p', dir], {
                                stdio: ['ignore', 1, 2]
                            });
                        }
                    } catch (errorCaught) {
                        error = errorCaught;
                    }
                    onError(error);
                };
            default:
                return local.require2(key);
            }
        };
    }());



    /* istanbul ignore next */
    // init lib nedb.storage
    (function () {
        if (local.modeJs === 'node') {
/* jslint-ignore-begin */
// https://github.com/louischatriot/nedb/blob/6d1f9cf20f9438f1598c5fc8f124a6a0228ee350/lib/storage.js
/**
 * Way data is stored for this database
 * For a Node.js/Node Webkit database it's the file system
 * For a browser-side database it's localforage which chooses the best option depending on user browser (IndexedDB then WebSQL then localStorage)
 *
 * This version is the Node.js/Node Webkit version
 * It's essentially fs, mkdirp and crash safe write and read functions
 */

var fs = require('fs')
  , mkdirp = require('mkdirp')
  , async = require('async')
  , path = require('path')
  , storage = {}
  ;

storage.exists = fs.exists;
storage.rename = fs.rename;
storage.writeFile = fs.writeFile;
storage.unlink = fs.unlink;
storage.appendFile = fs.appendFile;
storage.readFile = fs.readFile;
storage.mkdirp = mkdirp;


/**
 * Explicit name ...
 */
storage.ensureFileDoesntExist = function (file, callback) {
  storage.exists(file, function (exists) {
    if (!exists) { return callback(null); }

    storage.unlink(file, function (err) { return callback(err); });
  });
};


/**
 * Flush data in OS buffer to storage if corresponding option is set
 * @param {String} options.filename
 * @param {Boolean} options.isDir Optional, defaults to false
 * If options is a string, it is assumed that the flush of the file (not dir) called options was requested
 */
storage.flushToStorage = function (options, callback) {
  var filename, flags;
  if (typeof options === 'string') {
    filename = options;
    flags = 'r+';
  } else {
    filename = options.filename;
    flags = options.isDir ? 'r' : 'r+';
  }

  // Windows can't fsync (FlushFileBuffers) directories. We can live with this as it cannot cause 100% dataloss
  // except in the very rare event of the first time database is loaded and a crash happens
  if (flags === 'r' && (process.platform === 'win32' || process.platform === 'win64')) { return callback(null); }

  fs.open(filename, flags, function (err, fd) {
    if (err) { return callback(err); }
    fs.fsync(fd, function (errFS) {
      fs.close(fd, function (errC) {
        if (errFS || errC) {
          var e = new Error('Failed to flush to storage');
          e.errorOnFsync = errFS;
          e.errorOnClose = errC;
          return callback(e);
        } else {
          return callback(null);
        }
      });
    });
  });
};


/**
 * Fully write or rewrite the datafile, immune to crashes during the write operation (data will not be lost)
 * @param {String} filename
 * @param {String} data
 * @param {Function} cb Optional callback, signature: err
 */
storage.crashSafeWriteFile = function (filename, data, cb) {
  var callback = cb || function () {}
    , tempFilename = filename + '~';

  async.waterfall([
    async.apply(storage.flushToStorage, { filename: path.dirname(filename), isDir: true })
  , function (cb) {
      storage.exists(filename, function (exists) {
        if (exists) {
          storage.flushToStorage(filename, function (err) { return cb(err); });
        } else {
          return cb();
        }
      });
    }
  , function (cb) {
      storage.writeFile(tempFilename, data, function (err) { return cb(err); });
    }
  , async.apply(storage.flushToStorage, tempFilename)
  , function (cb) {
      storage.rename(tempFilename, filename, function (err) { return cb(err); });
    }
  , async.apply(storage.flushToStorage, { filename: path.dirname(filename), isDir: true })
  ], function (err) { return callback(err); })
};


/**
 * Ensure the datafile contains all the data, even if there was a crash during a full file write
 * @param {String} filename
 * @param {Function} callback signature: err
 */
storage.ensureDatafileIntegrity = function (filename, callback) {
  var tempFilename = filename + '~';

  storage.exists(filename, function (filenameExists) {
    // Write was successful
    if (filenameExists) { return callback(null); }

    storage.exists(tempFilename, function (oldFilenameExists) {
      // New database
      if (!oldFilenameExists) {
        return storage.writeFile(filename, '', 'utf8', function (err) { callback(err); });
      }

      // Write failed, use old version
      storage.rename(tempFilename, filename, function (err) { return callback(err); });
    });
  });
};



// Interface
module.exports = storage;
/* jslint-ignore-end */
            local.storage = module.exports;
        }
    }());



/* istanbul ignore next */
// init lib nedb
/* jslint-ignore-begin */
// https://github.com/louischatriot/nedb/blob/cadf4ef434e517e47c4e9ca1db5b89e892ff5981/browser-version/out/nedb.js
// replace 'return i(r?r:t)' with 'return local[t] = i(r?r:t)'
// replace 'storage = require('./storage')' with 'storage = local.storage = local.storage || require('./storage')'
// replace 'seen = {}' with 'seen = local'
(function(e){if("function"==typeof bootstrap)bootstrap("nedb",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeNedb=e}else"undefined"!=typeof window?window.Nedb=e():global.Nedb=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return local[t] = i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var process=require("__browserify_process");if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{"__browserify_process":4}],2:[function(require,module,exports){
var process=require("__browserify_process");function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';

},{"__browserify_process":4}],3:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\u001b[' + styles[style][0] + 'm' + str +
             '\u001b[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}


function isRegExp(re) {
  typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]';
}


function isDate(d) {
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Date]';
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":1}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
/**
 * Manage access to data, be it to find, update or remove it
 */
var model = require('./model')
  , _ = require('underscore')
  ;



/**
 * Create a new cursor for this collection
 * @param {Datastore} db - The datastore this cursor is bound to
 * @param {Query} query - The query this cursor will operate on
 * @param {Function} execFn - Handler to be executed after cursor has found the results and before the callback passed to find/findOne/update/remove
 */
function Cursor (db, query, execFn) {
  this.db = db;
  this.query = query || {};
  if (execFn) { this.execFn = execFn; }
}


/**
 * Set a limit to the number of results
 */
Cursor.prototype.limit = function(limit) {
  this._limit = limit;
  return this;
};


/**
 * Skip a the number of results
 */
Cursor.prototype.skip = function(skip) {
  this._skip = skip;
  return this;
};


/**
 * Sort results of the query
 * @param {SortQuery} sortQuery - SortQuery is { field: order }, field can use the dot-notation, order is 1 for ascending and -1 for descending
 */
Cursor.prototype.sort = function(sortQuery) {
  this._sort = sortQuery;
  return this;
};


/**
 * Add the use of a projection
 * @param {Object} projection - MongoDB-style projection. {} means take all fields. Then it's { key1: 1, key2: 1 } to take only key1 and key2
 *                              { key1: 0, key2: 0 } to omit only key1 and key2. Except _id, you can't mix takes and omits
 */
Cursor.prototype.projection = function(projection) {
  this._projection = projection;
  return this;
};


/**
 * Apply the projection
 */
Cursor.prototype.project = function (candidates) {
  var res = [], self = this
    , keepId, action, keys
    ;

  if (this._projection === undefined || Object.keys(this._projection).length === 0) {
    return candidates;
  }

  keepId = this._projection._id === 0 ? false : true;
  this._projection = _.omit(this._projection, '_id');

  // Check for consistency
  keys = Object.keys(this._projection);
  keys.forEach(function (k) {
    if (action !== undefined && self._projection[k] !== action) { throw new Error("Can't both keep and omit fields except for _id"); }
    action = self._projection[k];
  });

  // Do the actual projection
  candidates.forEach(function (candidate) {
    var toPush;
    if (action === 1) {   // pick-type projection
      toPush = { $set: {} };
      keys.forEach(function (k) {
        toPush.$set[k] = model.getDotValue(candidate, k);
        if (toPush.$set[k] === undefined) { delete toPush.$set[k]; }
      });
      toPush = model.modify({}, toPush);
    } else {   // omit-type projection
      toPush = { $unset: {} };
      keys.forEach(function (k) { toPush.$unset[k] = true });
      toPush = model.modify(candidate, toPush);
    }
    if (keepId) {
      toPush._id = candidate._id;
    } else {
      delete toPush._id;
    }
    res.push(toPush);
  });

  return res;
};


/**
 * Get all matching elements
 * Will return pointers to matched elements (shallow copies), returning full copies is the role of find or findOne
 * This is an internal function, use exec which uses the executor
 *
 * @param {Function} callback - Signature: err, results
 */
Cursor.prototype._exec = function(_callback) {
  var res = [], added = 0, skipped = 0, self = this
    , error = null
    , i, keys, key
    ;

  function callback (error, res) {
    if (self.execFn) {
      return self.execFn(error, res, _callback);
    } else {
      return _callback(error, res);
    }
  }

  this.db.getCandidates(this.query, function (err, candidates) {
    if (err) { return callback(err); }

    try {
      for (i = 0; i < candidates.length; i += 1) {
        if (model.match(candidates[i], self.query)) {
          // If a sort is defined, wait for the results to be sorted before applying limit and skip
          if (!self._sort) {
            if (self._skip && self._skip > skipped) {
              skipped += 1;
            } else {
              res.push(candidates[i]);
              added += 1;
              if (self._limit && self._limit <= added) { break; }
            }
          } else {
            res.push(candidates[i]);
          }
        }
      }
    } catch (err) {
      return callback(err);
    }

    // Apply all sorts
    if (self._sort) {
      keys = Object.keys(self._sort);

      // Sorting
      var criteria = [];
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        criteria.push({ key: key, direction: self._sort[key] });
      }
      res.sort(function(a, b) {
        var criterion, compare, i;
        for (i = 0; i < criteria.length; i++) {
          criterion = criteria[i];
          compare = criterion.direction * model.compareThings(model.getDotValue(a, criterion.key), model.getDotValue(b, criterion.key), self.db.compareStrings);
          if (compare !== 0) {
            return compare;
          }
        }
        return 0;
      });

      // Applying limit and skip
      var limit = self._limit || res.length
        , skip = self._skip || 0;

      res = res.slice(skip, skip + limit);
    }

    // Apply projection
    try {
      res = self.project(res);
    } catch (e) {
      error = e;
      res = undefined;
    }

    return callback(error, res);
  });
};

Cursor.prototype.exec = function () {
  this.db.executor.push({ this: this, fn: this._exec, arguments: arguments });
};



// Interface
module.exports = Cursor;

},{"./model":10,"underscore":19}],6:[function(require,module,exports){
/**
 * Specific customUtils for the browser, where we don't have access to the Crypto and Buffer modules
 */

/**
 * Taken from the crypto-browserify module
 * https://github.com/dominictarr/crypto-browserify
 * NOTE: Math.random() does not guarantee "cryptographic quality" but we actually don't need it
 */
function randomBytes (size) {
  var bytes = new Array(size);
  var r;

  for (var i = 0, r; i < size; i++) {
    if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
    bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
  }

  return bytes;
}


/**
 * Taken from the base64-js module
 * https://github.com/beatgammit/base64-js/
 */
function byteArrayToBase64 (uint8) {
  var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    , extraBytes = uint8.length % 3   // if we have 1 byte left, pad 2 bytes
    , output = ""
    , temp, length, i;

  function tripletToBase64 (num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
  };

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
    temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output += tripletToBase64(temp);
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  switch (extraBytes) {
    case 1:
      temp = uint8[uint8.length - 1];
      output += lookup[temp >> 2];
      output += lookup[(temp << 4) & 0x3F];
      output += '==';
      break;
    case 2:
      temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
      output += lookup[temp >> 10];
      output += lookup[(temp >> 4) & 0x3F];
      output += lookup[(temp << 2) & 0x3F];
      output += '=';
      break;
  }

  return output;
}


/**
 * Return a random alphanumerical string of length len
 * There is a very small probability (less than 1/1,000,000) for the length to be less than len
 * (il the base64 conversion yields too many pluses and slashes) but
 * that's not an issue here
 * The probability of a collision is extremely small (need 3*10^12 documents to have one chance in a million of a collision)
 * See http://en.wikipedia.org/wiki/Birthday_problem
 */
function uid (len) {
  return byteArrayToBase64(randomBytes(Math.ceil(Math.max(8, len * 2)))).replace(/[+\/]/g, '').slice(0, len);
}



module.exports.uid = uid;

},{}],7:[function(require,module,exports){
var customUtils = require('./customUtils')
  , model = require('./model')
  , async = require('async')
  , Executor = require('./executor')
  , Index = require('./indexes')
  , util = require('util')
  , _ = require('underscore')
  , Persistence = require('./persistence')
  , Cursor = require('./cursor')
  ;


/**
 * Create a new collection
 * @param {String} options.filename Optional, datastore will be in-memory only if not provided
 * @param {Boolean} options.timestampData Optional, defaults to false. If set to true, createdAt and updatedAt will be created and populated automatically (if not specified by user)
 * @param {Boolean} options.inMemoryOnly Optional, defaults to false
 * @param {String} options.nodeWebkitAppName Optional, specify the name of your NW app if you want options.filename to be relative to the directory where
 *                                            Node Webkit stores application data such as cookies and local storage (the best place to store data in my opinion)
 * @param {Boolean} options.autoload Optional, defaults to false
 * @param {Function} options.onload Optional, if autoload is used this will be called after the load database with the error object as parameter. If you don't pass it the error will be thrown
 * @param {Function} options.afterSerialization/options.beforeDeserialization Optional, serialization hooks
 * @param {Number} options.corruptAlertThreshold Optional, threshold after which an alert is thrown if too much data is corrupt
 * @param {Function} options.compareStrings Optional, string comparison function that overrides default for sorting
 *
 * Event Emitter - Events
 * * compaction.done - Fired whenever a compaction operation was finished
 */
function Datastore (options) {
  var filename;

  // Retrocompatibility with v0.6 and before
  if (typeof options === 'string') {
    filename = options;
    this.inMemoryOnly = false;   // Default
  } else {
    options = options || {};
    filename = options.filename;
    this.inMemoryOnly = options.inMemoryOnly || false;
    this.autoload = options.autoload || false;
    this.timestampData = options.timestampData || false;
  }

  // Determine whether in memory or persistent
  if (!filename || typeof filename !== 'string' || filename.length === 0) {
    this.filename = null;
    this.inMemoryOnly = true;
  } else {
    this.filename = filename;
  }

  // String comparison function
  this.compareStrings = options.compareStrings;

  // Persistence handling
  this.persistence = new Persistence({ db: this, nodeWebkitAppName: options.nodeWebkitAppName
                                      , afterSerialization: options.afterSerialization
                                      , beforeDeserialization: options.beforeDeserialization
                                      , corruptAlertThreshold: options.corruptAlertThreshold
                                      });

  // This new executor is ready if we don't use persistence
  // If we do, it will only be ready once loadDatabase is called
  this.executor = new Executor();
  if (this.inMemoryOnly) { this.executor.ready = true; }

  // Indexed by field name, dot notation can be used
  // _id is always indexed and since _ids are generated randomly the underlying
  // binary is always well-balanced
  this.indexes = {};
  this.indexes._id = new Index({ fieldName: '_id', unique: true });
  this.ttlIndexes = {};

  // Queue a load of the database right away and call the onload handler
  // By default (no onload handler), if there is an error there, no operation will be possible so warn the user by throwing an exception
  if (this.autoload) { this.loadDatabase(options.onload || function (err) {
    if (err) { throw err; }
  }); }
}

util.inherits(Datastore, require('events').EventEmitter);


/**
 * Load the database from the datafile, and trigger the execution of buffered commands if any
 */
Datastore.prototype.loadDatabase = function () {
  this.executor.push({ this: this.persistence, fn: this.persistence.loadDatabase, arguments: arguments }, true);
};


/**
 * Get an array of all the data in the database
 */
Datastore.prototype.getAllData = function () {
  return this.indexes._id.getAll();
};


/**
 * Reset all currently defined indexes
 */
Datastore.prototype.resetIndexes = function (newData) {
  var self = this;

  Object.keys(this.indexes).forEach(function (i) {
    self.indexes[i].reset(newData);
  });
};


/**
 * Ensure an index is kept for this field. Same parameters as lib/indexes
 * For now this function is synchronous, we need to test how much time it takes
 * We use an async API for consistency with the rest of the code
 * @param {String} options.fieldName
 * @param {Boolean} options.unique
 * @param {Boolean} options.sparse
 * @param {Number} options.expireAfterSeconds - Optional, if set this index becomes a TTL index (only works on Date fields, not arrays of Date)
 * @param {Function} cb Optional callback, signature: err
 */
Datastore.prototype.ensureIndex = function (options, cb) {
  var err
    , callback = cb || function () {};

  options = options || {};

  if (!options.fieldName) {
    err = new Error("Cannot create an index without a fieldName");
    err.missingFieldName = true;
    return callback(err);
  }
  if (this.indexes[options.fieldName]) { return callback(null); }

  this.indexes[options.fieldName] = new Index(options);
  if (options.expireAfterSeconds !== undefined) { this.ttlIndexes[options.fieldName] = options.expireAfterSeconds; }   // With this implementation index creation is not necessary to ensure TTL but we stick with MongoDB's API here

  try {
    this.indexes[options.fieldName].insert(this.getAllData());
  } catch (e) {
    delete this.indexes[options.fieldName];
    return callback(e);
  }

  // We may want to force all options to be persisted including defaults, not just the ones passed the index creation function
  this.persistence.persistNewState([{ $$indexCreated: options }], function (err) {
    if (err) { return callback(err); }
    return callback(null);
  });
};


/**
 * Remove an index
 * @param {String} fieldName
 * @param {Function} cb Optional callback, signature: err
 */
Datastore.prototype.removeIndex = function (fieldName, cb) {
  var callback = cb || function () {};

  delete this.indexes[fieldName];

  this.persistence.persistNewState([{ $$indexRemoved: fieldName }], function (err) {
    if (err) { return callback(err); }
    return callback(null);
  });
};


/**
 * Add one or several document(s) to all indexes
 */
Datastore.prototype.addToIndexes = function (doc) {
  var i, failingIndex, error
    , keys = Object.keys(this.indexes)
    ;

  for (i = 0; i < keys.length; i += 1) {
    try {
      this.indexes[keys[i]].insert(doc);
    } catch (e) {
      failingIndex = i;
      error = e;
      break;
    }
  }

  // If an error happened, we need to rollback the insert on all other indexes
  if (error) {
    for (i = 0; i < failingIndex; i += 1) {
      this.indexes[keys[i]].remove(doc);
    }

    throw error;
  }
};


/**
 * Remove one or several document(s) from all indexes
 */
Datastore.prototype.removeFromIndexes = function (doc) {
  var self = this;

  Object.keys(this.indexes).forEach(function (i) {
    self.indexes[i].remove(doc);
  });
};


/**
 * Update one or several documents in all indexes
 * To update multiple documents, oldDoc must be an array of { oldDoc, newDoc } pairs
 * If one update violates a constraint, all changes are rolled back
 */
Datastore.prototype.updateIndexes = function (oldDoc, newDoc) {
  var i, failingIndex, error
    , keys = Object.keys(this.indexes)
    ;

  for (i = 0; i < keys.length; i += 1) {
    try {
      this.indexes[keys[i]].update(oldDoc, newDoc);
    } catch (e) {
      failingIndex = i;
      error = e;
      break;
    }
  }

  // If an error happened, we need to rollback the update on all other indexes
  if (error) {
    for (i = 0; i < failingIndex; i += 1) {
      this.indexes[keys[i]].revertUpdate(oldDoc, newDoc);
    }

    throw error;
  }
};


/**
 * Return the list of candidates for a given query
 * Crude implementation for now, we return the candidates given by the first usable index if any
 * We try the following query types, in this order: basic match, $in match, comparison match
 * One way to make it better would be to enable the use of multiple indexes if the first usable index
 * returns too much data. I may do it in the future.
 *
 * Returned candidates will be scanned to find and remove all expired documents
 *
 * @param {Query} query
 * @param {Boolean} dontExpireStaleDocs Optional, defaults to false, if true don't remove stale docs. Useful for the remove function which shouldn't be impacted by expirations
 * @param {Function} callback Signature err, candidates
 */
Datastore.prototype.getCandidates = function (query, dontExpireStaleDocs, callback) {
  var indexNames = Object.keys(this.indexes)
    , self = this
    , usableQueryKeys;

  if (typeof dontExpireStaleDocs === 'function') {
    callback = dontExpireStaleDocs;
    dontExpireStaleDocs = false;
  }


  async.waterfall([
  // STEP 1: get candidates list by checking indexes from most to least frequent usecase
  function (cb) {
    // For a basic match
    usableQueryKeys = [];
    Object.keys(query).forEach(function (k) {
      if (typeof query[k] === 'string' || typeof query[k] === 'number' || typeof query[k] === 'boolean' || util.isDate(query[k]) || query[k] === null) {
        usableQueryKeys.push(k);
      }
    });
    usableQueryKeys = _.intersection(usableQueryKeys, indexNames);
    if (usableQueryKeys.length > 0) {
      return cb(null, self.indexes[usableQueryKeys[0]].getMatching(query[usableQueryKeys[0]]));
    }

    // For a $in match
    usableQueryKeys = [];
    Object.keys(query).forEach(function (k) {
      if (query[k] && query[k].hasOwnProperty('$in')) {
        usableQueryKeys.push(k);
      }
    });
    usableQueryKeys = _.intersection(usableQueryKeys, indexNames);
    if (usableQueryKeys.length > 0) {
      return cb(null, self.indexes[usableQueryKeys[0]].getMatching(query[usableQueryKeys[0]].$in));
    }

    // For a comparison match
    usableQueryKeys = [];
    Object.keys(query).forEach(function (k) {
      if (query[k] && (query[k].hasOwnProperty('$lt') || query[k].hasOwnProperty('$lte') || query[k].hasOwnProperty('$gt') || query[k].hasOwnProperty('$gte'))) {
        usableQueryKeys.push(k);
      }
    });
    usableQueryKeys = _.intersection(usableQueryKeys, indexNames);
    if (usableQueryKeys.length > 0) {
      return cb(null, self.indexes[usableQueryKeys[0]].getBetweenBounds(query[usableQueryKeys[0]]));
    }

    // By default, return all the DB data
    return cb(null, self.getAllData());
  }
  // STEP 2: remove all expired documents
  , function (docs) {
    if (dontExpireStaleDocs) { return callback(null, docs); }

    var expiredDocsIds = [], validDocs = [], ttlIndexesFieldNames = Object.keys(self.ttlIndexes);

    docs.forEach(function (doc) {
      var valid = true;
      ttlIndexesFieldNames.forEach(function (i) {
        if (doc[i] !== undefined && util.isDate(doc[i]) && Date.now() > doc[i].getTime() + self.ttlIndexes[i] * 1000) {
          valid = false;
        }
      });
      if (valid) { validDocs.push(doc); } else { expiredDocsIds.push(doc._id); }
    });

    async.eachSeries(expiredDocsIds, function (_id, cb) {
      self._remove({ _id: _id }, {}, function (err) {
        if (err) { return callback(err); }
        return cb();
      });
    }, function (err) {
      return callback(null, validDocs);
    });
  }]);
};


/**
 * Insert a new document
 * @param {Function} cb Optional callback, signature: err, insertedDoc
 *
 * @api private Use Datastore.insert which has the same signature
 */
Datastore.prototype._insert = function (newDoc, cb) {
  var callback = cb || function () {}
    , preparedDoc
    ;

  try {
    preparedDoc = this.prepareDocumentForInsertion(newDoc)
    this._insertInCache(preparedDoc);
  } catch (e) {
    return callback(e);
  }

  this.persistence.persistNewState(util.isArray(preparedDoc) ? preparedDoc : [preparedDoc], function (err) {
    if (err) { return callback(err); }
    return callback(null, model.deepCopy(preparedDoc));
  });
};

/**
 * Create a new _id that's not already in use
 */
Datastore.prototype.createNewId = function () {
  var tentativeId = customUtils.uid(16);
  // Try as many times as needed to get an unused _id. As explained in customUtils, the probability of this ever happening is extremely small, so this is O(1)
  if (this.indexes._id.getMatching(tentativeId).length > 0) {
    tentativeId = this.createNewId();
  }
  return tentativeId;
};

/**
 * Prepare a document (or array of documents) to be inserted in a database
 * Meaning adds _id and timestamps if necessary on a copy of newDoc to avoid any side effect on user input
 * @api private
 */
Datastore.prototype.prepareDocumentForInsertion = function (newDoc) {
  var preparedDoc, self = this;

  if (util.isArray(newDoc)) {
    preparedDoc = [];
    newDoc.forEach(function (doc) { preparedDoc.push(self.prepareDocumentForInsertion(doc)); });
  } else {
    preparedDoc = model.deepCopy(newDoc);
    if (preparedDoc._id === undefined) { preparedDoc._id = this.createNewId(); }
    var now = new Date();
    if (this.timestampData && preparedDoc.createdAt === undefined) { preparedDoc.createdAt = now; }
    if (this.timestampData && preparedDoc.updatedAt === undefined) { preparedDoc.updatedAt = now; }
    model.checkObject(preparedDoc);
  }

  return preparedDoc;
};

/**
 * If newDoc is an array of documents, this will insert all documents in the cache
 * @api private
 */
Datastore.prototype._insertInCache = function (preparedDoc) {
  if (util.isArray(preparedDoc)) {
    this._insertMultipleDocsInCache(preparedDoc);
  } else {
    this.addToIndexes(preparedDoc);
  }
};

/**
 * If one insertion fails (e.g. because of a unique constraint), roll back all previous
 * inserts and throws the error
 * @api private
 */
Datastore.prototype._insertMultipleDocsInCache = function (preparedDocs) {
  var i, failingI, error;

  for (i = 0; i < preparedDocs.length; i += 1) {
    try {
      this.addToIndexes(preparedDocs[i]);
    } catch (e) {
      error = e;
      failingI = i;
      break;
    }
  }

  if (error) {
    for (i = 0; i < failingI; i += 1) {
      this.removeFromIndexes(preparedDocs[i]);
    }

    throw error;
  }
};

Datastore.prototype.insert = function () {
  this.executor.push({ this: this, fn: this._insert, arguments: arguments });
};


/**
 * Count all documents matching the query
 * @param {Object} query MongoDB-style query
 */
Datastore.prototype.count = function(query, callback) {
  var cursor = new Cursor(this, query, function(err, docs, callback) {
    if (err) { return callback(err); }
    return callback(null, docs.length);
  });

  if (typeof callback === 'function') {
    cursor.exec(callback);
  } else {
    return cursor;
  }
};


/**
 * Find all documents matching the query
 * If no callback is passed, we return the cursor so that user can limit, skip and finally exec
 * @param {Object} query MongoDB-style query
 * @param {Object} projection MongoDB-style projection
 */
Datastore.prototype.find = function (query, projection, callback) {
  switch (arguments.length) {
    case 1:
      projection = {};
      // callback is undefined, will return a cursor
      break;
    case 2:
      if (typeof projection === 'function') {
        callback = projection;
        projection = {};
      }   // If not assume projection is an object and callback undefined
      break;
  }

  var cursor = new Cursor(this, query, function(err, docs, callback) {
    var res = [], i;

    if (err) { return callback(err); }

    for (i = 0; i < docs.length; i += 1) {
      res.push(model.deepCopy(docs[i]));
    }
    return callback(null, res);
  });

  cursor.projection(projection);
  if (typeof callback === 'function') {
    cursor.exec(callback);
  } else {
    return cursor;
  }
};


/**
 * Find one document matching the query
 * @param {Object} query MongoDB-style query
 * @param {Object} projection MongoDB-style projection
 */
Datastore.prototype.findOne = function (query, projection, callback) {
  switch (arguments.length) {
    case 1:
      projection = {};
      // callback is undefined, will return a cursor
      break;
    case 2:
      if (typeof projection === 'function') {
        callback = projection;
        projection = {};
      }   // If not assume projection is an object and callback undefined
      break;
  }

  var cursor = new Cursor(this, query, function(err, docs, callback) {
    if (err) { return callback(err); }
    if (docs.length === 1) {
      return callback(null, model.deepCopy(docs[0]));
    } else {
      return callback(null, null);
    }
  });

  cursor.projection(projection).limit(1);
  if (typeof callback === 'function') {
    cursor.exec(callback);
  } else {
    return cursor;
  }
};


/**
 * Update all docs matching query
 * @param {Object} query
 * @param {Object} updateQuery
 * @param {Object} options Optional options
 *                 options.multi If true, can update multiple documents (defaults to false)
 *                 options.upsert If true, document is inserted if the query doesn't match anything
 *                 options.returnUpdatedDocs Defaults to false, if true return as third argument the array of updated matched documents (even if no change actually took place)
 * @param {Function} cb Optional callback, signature: (err, numAffected, affectedDocuments, upsert)
 *                      If update was an upsert, upsert flag is set to true
 *                      affectedDocuments can be one of the following:
 *                        * For an upsert, the upserted document
 *                        * For an update with returnUpdatedDocs option false, null
 *                        * For an update with returnUpdatedDocs true and multi false, the updated document
 *                        * For an update with returnUpdatedDocs true and multi true, the array of updated documents
 *
 * WARNING: The API was changed between v1.7.4 and v1.8, for consistency and readability reasons. Prior and including to v1.7.4,
 *          the callback signature was (err, numAffected, updated) where updated was the updated document in case of an upsert
 *          or the array of updated documents for an update if the returnUpdatedDocs option was true. That meant that the type of
 *          affectedDocuments in a non multi update depended on whether there was an upsert or not, leaving only two ways for the
 *          user to check whether an upsert had occured: checking the type of affectedDocuments or running another find query on
 *          the whole dataset to check its size. Both options being ugly, the breaking change was necessary.
 *
 * @api private Use Datastore.update which has the same signature
 */
Datastore.prototype._update = function (query, updateQuery, options, cb) {
  var callback
    , self = this
    , numReplaced = 0
    , multi, upsert
    , i
    ;

  if (typeof options === 'function') { cb = options; options = {}; }
  callback = cb || function () {};
  multi = options.multi !== undefined ? options.multi : false;
  upsert = options.upsert !== undefined ? options.upsert : false;

  async.waterfall([
  function (cb) {   // If upsert option is set, check whether we need to insert the doc
    if (!upsert) { return cb(); }

    // Need to use an internal function not tied to the executor to avoid deadlock
    var cursor = new Cursor(self, query);
    cursor.limit(1)._exec(function (err, docs) {
      if (err) { return callback(err); }
      if (docs.length === 1) {
        return cb();
      } else {
        var toBeInserted;

        try {
          model.checkObject(updateQuery);
          // updateQuery is a simple object with no modifier, use it as the document to insert
          toBeInserted = updateQuery;
        } catch (e) {
          // updateQuery contains modifiers, use the find query as the base,
          // strip it from all operators and update it according to updateQuery
          try {
            toBeInserted = model.modify(model.deepCopy(query, true), updateQuery);
          } catch (err) {
            return callback(err);
          }
        }

        return self._insert(toBeInserted, function (err, newDoc) {
          if (err) { return callback(err); }
          return callback(null, 1, newDoc, true);
        });
      }
    });
  }
  , function () {   // Perform the update
    var modifiedDoc , modifications = [], createdAt;

    self.getCandidates(query, function (err, candidates) {
      if (err) { return callback(err); }

      // Preparing update (if an error is thrown here neither the datafile nor
      // the in-memory indexes are affected)
      try {
        for (i = 0; i < candidates.length; i += 1) {
          if (model.match(candidates[i], query) && (multi || numReplaced === 0)) {
            numReplaced += 1;
            if (self.timestampData) { createdAt = candidates[i].createdAt; }
            modifiedDoc = model.modify(candidates[i], updateQuery);
            if (self.timestampData) {
              modifiedDoc.createdAt = createdAt;
              modifiedDoc.updatedAt = new Date();
            }
            modifications.push({ oldDoc: candidates[i], newDoc: modifiedDoc });
          }
        }
      } catch (err) {
        return callback(err);
      }

      // Change the docs in memory
      try {
        self.updateIndexes(modifications);
      } catch (err) {
        return callback(err);
      }

      // Update the datafile
      var updatedDocs = _.pluck(modifications, 'newDoc');
      self.persistence.persistNewState(updatedDocs, function (err) {
        if (err) { return callback(err); }
        if (!options.returnUpdatedDocs) {
          return callback(null, numReplaced);
        } else {
          var updatedDocsDC = [];
          updatedDocs.forEach(function (doc) { updatedDocsDC.push(model.deepCopy(doc)); });
          if (! multi) { updatedDocsDC = updatedDocsDC[0]; }
          return callback(null, numReplaced, updatedDocsDC);
        }
      });
    });
  }]);
};

Datastore.prototype.update = function () {
  this.executor.push({ this: this, fn: this._update, arguments: arguments });
};


/**
 * Remove all docs matching the query
 * For now very naive implementation (similar to update)
 * @param {Object} query
 * @param {Object} options Optional options
 *                 options.multi If true, can update multiple documents (defaults to false)
 * @param {Function} cb Optional callback, signature: err, numRemoved
 *
 * @api private Use Datastore.remove which has the same signature
 */
Datastore.prototype._remove = function (query, options, cb) {
  var callback
    , self = this, numRemoved = 0, removedDocs = [], multi
    ;

  if (typeof options === 'function') { cb = options; options = {}; }
  callback = cb || function () {};
  multi = options.multi !== undefined ? options.multi : false;

  this.getCandidates(query, true, function (err, candidates) {
    if (err) { return callback(err); }

    try {
      candidates.forEach(function (d) {
        if (model.match(d, query) && (multi || numRemoved === 0)) {
          numRemoved += 1;
          removedDocs.push({ $$deleted: true, _id: d._id });
          self.removeFromIndexes(d);
        }
      });
    } catch (err) { return callback(err); }

    self.persistence.persistNewState(removedDocs, function (err) {
      if (err) { return callback(err); }
      return callback(null, numRemoved);
    });
  });
};

Datastore.prototype.remove = function () {
  this.executor.push({ this: this, fn: this._remove, arguments: arguments });
};



module.exports = Datastore;

},{"./cursor":5,"./customUtils":6,"./executor":8,"./indexes":9,"./model":10,"./persistence":11,"async":13,"events":1,"underscore":19,"util":3}],8:[function(require,module,exports){
var process=require("__browserify_process");/**
 * Responsible for sequentially executing actions on the database
 */

var async = require('async')
  ;

function Executor () {
  this.buffer = [];
  this.ready = false;

  // This queue will execute all commands, one-by-one in order
  this.queue = async.queue(function (task, cb) {
    var newArguments = [];

    // task.arguments is an array-like object on which adding a new field doesn't work, so we transform it into a real array
    for (var i = 0; i < task.arguments.length; i += 1) { newArguments.push(task.arguments[i]); }
    var lastArg = task.arguments[task.arguments.length - 1];

    // Always tell the queue task is complete. Execute callback if any was given.
    if (typeof lastArg === 'function') {
      // Callback was supplied
      newArguments[newArguments.length - 1] = function () {
        if (typeof setImmediate === 'function') {
           setImmediate(cb);
        } else {
          process.nextTick(cb);
        }
        lastArg.apply(null, arguments);
      };
    } else if (!lastArg && task.arguments.length !== 0) {
      // false/undefined/null supplied as callbback
      newArguments[newArguments.length - 1] = function () { cb(); };
    } else {
      // Nothing supplied as callback
      newArguments.push(function () { cb(); });
    }


    task.fn.apply(task.this, newArguments);
  }, 1);
}


/**
 * If executor is ready, queue task (and process it immediately if executor was idle)
 * If not, buffer task for later processing
 * @param {Object} task
 *                 task.this - Object to use as this
 *                 task.fn - Function to execute
 *                 task.arguments - Array of arguments, IMPORTANT: only the last argument may be a function (the callback)
 *                                                                 and the last argument cannot be false/undefined/null
 * @param {Boolean} forceQueuing Optional (defaults to false) force executor to queue task even if it is not ready
 */
Executor.prototype.push = function (task, forceQueuing) {
  if (this.ready || forceQueuing) {
    this.queue.push(task);
  } else {
    this.buffer.push(task);
  }
};


/**
 * Queue all tasks in buffer (in the same order they came in)
 * Automatically sets executor as ready
 */
Executor.prototype.processBuffer = function () {
  var i;
  this.ready = true;
  for (i = 0; i < this.buffer.length; i += 1) { this.queue.push(this.buffer[i]); }
  this.buffer = [];
};



// Interface
module.exports = Executor;

},{"__browserify_process":4,"async":13}],9:[function(require,module,exports){
var BinarySearchTree = require('binary-search-tree').AVLTree
  , model = require('./model')
  , _ = require('underscore')
  , util = require('util')
  ;

/**
 * Two indexed pointers are equal iif they point to the same place
 */
function checkValueEquality (a, b) {
  return a === b;
}

/**
 * Type-aware projection
 */
function projectForUnique (elt) {
  if (elt === null) { return '$null'; }
  if (typeof elt === 'string') { return '$string' + elt; }
  if (typeof elt === 'boolean') { return '$boolean' + elt; }
  if (typeof elt === 'number') { return '$number' + elt; }
  if (util.isArray(elt)) { return '$date' + elt.getTime(); }

  return elt;   // Arrays and objects, will check for pointer equality
}


/**
 * Create a new index
 * All methods on an index guarantee that either the whole operation was successful and the index changed
 * or the operation was unsuccessful and an error is thrown while the index is unchanged
 * @param {String} options.fieldName On which field should the index apply (can use dot notation to index on sub fields)
 * @param {Boolean} options.unique Optional, enforce a unique constraint (default: false)
 * @param {Boolean} options.sparse Optional, allow a sparse index (we can have documents for which fieldName is undefined) (default: false)
 */
function Index (options) {
  this.fieldName = options.fieldName;
  this.unique = options.unique || false;
  this.sparse = options.sparse || false;

  this.treeOptions = { unique: this.unique, compareKeys: model.compareThings, checkValueEquality: checkValueEquality };

  this.reset();   // No data in the beginning
}


/**
 * Reset an index
 * @param {Document or Array of documents} newData Optional, data to initialize the index with
 *                                                 If an error is thrown during insertion, the index is not modified
 */
Index.prototype.reset = function (newData) {
  this.tree = new BinarySearchTree(this.treeOptions);

  if (newData) { this.insert(newData); }
};


/**
 * Insert a new document in the index
 * If an array is passed, we insert all its elements (if one insertion fails the index is not modified)
 * O(log(n))
 */
Index.prototype.insert = function (doc) {
  var key, self = this
    , keys, i, failingI, error
    ;

  if (util.isArray(doc)) { this.insertMultipleDocs(doc); return; }

  key = model.getDotValue(doc, this.fieldName);

  // We don't index documents that don't contain the field if the index is sparse
  if (key === undefined && this.sparse) { return; }

  if (!util.isArray(key)) {
    this.tree.insert(key, doc);
  } else {
    // If an insert fails due to a unique constraint, roll back all inserts before it
    keys = _.uniq(key, projectForUnique);

    for (i = 0; i < keys.length; i += 1) {
      try {
        this.tree.insert(keys[i], doc);
      } catch (e) {
        error = e;
        failingI = i;
        break;
      }
    }

    if (error) {
      for (i = 0; i < failingI; i += 1) {
        this.tree.delete(keys[i], doc);
      }

      throw error;
    }
  }
};


/**
 * Insert an array of documents in the index
 * If a constraint is violated, the changes should be rolled back and an error thrown
 *
 * @API private
 */
Index.prototype.insertMultipleDocs = function (docs) {
  var i, error, failingI;

  for (i = 0; i < docs.length; i += 1) {
    try {
      this.insert(docs[i]);
    } catch (e) {
      error = e;
      failingI = i;
      break;
    }
  }

  if (error) {
    for (i = 0; i < failingI; i += 1) {
      this.remove(docs[i]);
    }

    throw error;
  }
};


/**
 * Remove a document from the index
 * If an array is passed, we remove all its elements
 * The remove operation is safe with regards to the 'unique' constraint
 * O(log(n))
 */
Index.prototype.remove = function (doc) {
  var key, self = this;

  if (util.isArray(doc)) { doc.forEach(function (d) { self.remove(d); }); return; }

  key = model.getDotValue(doc, this.fieldName);

  if (key === undefined && this.sparse) { return; }

  if (!util.isArray(key)) {
    this.tree.delete(key, doc);
  } else {
    _.uniq(key, projectForUnique).forEach(function (_key) {
      self.tree.delete(_key, doc);
    });
  }
};


/**
 * Update a document in the index
 * If a constraint is violated, changes are rolled back and an error thrown
 * Naive implementation, still in O(log(n))
 */
Index.prototype.update = function (oldDoc, newDoc) {
  if (util.isArray(oldDoc)) { this.updateMultipleDocs(oldDoc); return; }

  this.remove(oldDoc);

  try {
    this.insert(newDoc);
  } catch (e) {
    this.insert(oldDoc);
    throw e;
  }
};


/**
 * Update multiple documents in the index
 * If a constraint is violated, the changes need to be rolled back
 * and an error thrown
 * @param {Array of oldDoc, newDoc pairs} pairs
 *
 * @API private
 */
Index.prototype.updateMultipleDocs = function (pairs) {
  var i, failingI, error;

  for (i = 0; i < pairs.length; i += 1) {
    this.remove(pairs[i].oldDoc);
  }

  for (i = 0; i < pairs.length; i += 1) {
    try {
      this.insert(pairs[i].newDoc);
    } catch (e) {
      error = e;
      failingI = i;
      break;
    }
  }

  // If an error was raised, roll back changes in the inverse order
  if (error) {
    for (i = 0; i < failingI; i += 1) {
      this.remove(pairs[i].newDoc);
    }

    for (i = 0; i < pairs.length; i += 1) {
      this.insert(pairs[i].oldDoc);
    }

    throw error;
  }
};


/**
 * Revert an update
 */
Index.prototype.revertUpdate = function (oldDoc, newDoc) {
  var revert = [];

  if (!util.isArray(oldDoc)) {
    this.update(newDoc, oldDoc);
  } else {
    oldDoc.forEach(function (pair) {
      revert.push({ oldDoc: pair.newDoc, newDoc: pair.oldDoc });
    });
    this.update(revert);
  }
};


/**
 * Get all documents in index whose key match value (if it is a Thing) or one of the elements of value (if it is an array of Things)
 * @param {Thing} value Value to match the key against
 * @return {Array of documents}
 */
Index.prototype.getMatching = function (value) {
  var self = this;

  if (!util.isArray(value)) {
    return self.tree.search(value);
  } else {
    var _res = {}, res = [];

    value.forEach(function (v) {
      self.getMatching(v).forEach(function (doc) {
        _res[doc._id] = doc;
      });
    });

    Object.keys(_res).forEach(function (_id) {
      res.push(_res[_id]);
    });

    return res;
  }
};


/**
 * Get all documents in index whose key is between bounds are they are defined by query
 * Documents are sorted by key
 * @param {Query} query
 * @return {Array of documents}
 */
Index.prototype.getBetweenBounds = function (query) {
  return this.tree.betweenBounds(query);
};


/**
 * Get all elements in the index
 * @return {Array of documents}
 */
Index.prototype.getAll = function () {
  var res = [];

  this.tree.executeOnEveryNode(function (node) {
    var i;

    for (i = 0; i < node.data.length; i += 1) {
      res.push(node.data[i]);
    }
  });

  return res;
};




// Interface
module.exports = Index;

},{"./model":10,"binary-search-tree":14,"underscore":19,"util":3}],10:[function(require,module,exports){
/**
 * Handle models (i.e. docs)
 * Serialization/deserialization
 * Copying
 * Querying, update
 */

var util = require('util')
  , _ = require('underscore')
  , modifierFunctions = {}
  , lastStepModifierFunctions = {}
  , comparisonFunctions = {}
  , logicalOperators = {}
  , arrayComparisonFunctions = {}
  ;


/**
 * Check a key, throw an error if the key is non valid
 * @param {String} k key
 * @param {Model} v value, needed to treat the Date edge case
 * Non-treatable edge cases here: if part of the object if of the form { $$date: number } or { $$deleted: true }
 * Its serialized-then-deserialized version it will transformed into a Date object
 * But you really need to want it to trigger such behaviour, even when warned not to use '$' at the beginning of the field names...
 */
function checkKey (k, v) {
  if (typeof k === 'number') {
    k = k.toString();
  }

  if (k[0] === '$' && !(k === '$$date' && typeof v === 'number') && !(k === '$$deleted' && v === true) && !(k === '$$indexCreated') && !(k === '$$indexRemoved')) {
    throw new Error('Field names cannot begin with the $ character');
  }

  if (k.indexOf('.') !== -1) {
    throw new Error('Field names cannot contain a .');
  }
}


/**
 * Check a DB object and throw an error if it's not valid
 * Works by applying the above checkKey function to all fields recursively
 */
function checkObject (obj) {
  if (util.isArray(obj)) {
    obj.forEach(function (o) {
      checkObject(o);
    });
  }

  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(function (k) {
      checkKey(k, obj[k]);
      checkObject(obj[k]);
    });
  }
}


/**
 * Serialize an object to be persisted to a one-line string
 * For serialization/deserialization, we use the native JSON parser and not eval or Function
 * That gives us less freedom but data entered in the database may come from users
 * so eval and the like are not safe
 * Accepted primitive types: Number, String, Boolean, Date, null
 * Accepted secondary types: Objects, Arrays
 */
function serialize (obj) {
  var res;

  res = JSON.stringify(obj, function (k, v) {
    checkKey(k, v);

    if (v === undefined) { return undefined; }
    if (v === null) { return null; }

    // Hackish way of checking if object is Date (this way it works between execution contexts in node-webkit).
    // We can't use value directly because for dates it is already string in this function (date.toJSON was already called), so we use this
    if (typeof this[k].getTime === 'function') { return { $$date: this[k].getTime() }; }

    return v;
  });

  return res;
}


/**
 * From a one-line representation of an object generate by the serialize function
 * Return the object itself
 */
function deserialize (rawData) {
  return JSON.parse(rawData, function (k, v) {
    if (k === '$$date') { return new Date(v); }
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) { return v; }
    if (v && v.$$date) { return v.$$date; }

    return v;
  });
}


/**
 * Deep copy a DB object
 * The optional strictKeys flag (defaulting to false) indicates whether to copy everything or only fields
 * where the keys are valid, i.e. don't begin with $ and don't contain a .
 */
function deepCopy (obj, strictKeys) {
  var res;

  if ( typeof obj === 'boolean' ||
       typeof obj === 'number' ||
       typeof obj === 'string' ||
       obj === null ||
       (util.isDate(obj)) ) {
    return obj;
  }

  if (util.isArray(obj)) {
    res = [];
    obj.forEach(function (o) { res.push(deepCopy(o, strictKeys)); });
    return res;
  }

  if (typeof obj === 'object') {
    res = {};
    Object.keys(obj).forEach(function (k) {
      if (!strictKeys || (k[0] !== '$' && k.indexOf('.') === -1)) {
        res[k] = deepCopy(obj[k], strictKeys);
      }
    });
    return res;
  }

  return undefined;   // For now everything else is undefined. We should probably throw an error instead
}


/**
 * Tells if an object is a primitive type or a "real" object
 * Arrays are considered primitive
 */
function isPrimitiveType (obj) {
  return ( typeof obj === 'boolean' ||
       typeof obj === 'number' ||
       typeof obj === 'string' ||
       obj === null ||
       util.isDate(obj) ||
       util.isArray(obj));
}


/**
 * Utility functions for comparing things
 * Assumes type checking was already done (a and b already have the same type)
 * compareNSB works for numbers, strings and booleans
 */
function compareNSB (a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}

function compareArrays (a, b) {
  var i, comp;

  for (i = 0; i < Math.min(a.length, b.length); i += 1) {
    comp = compareThings(a[i], b[i]);

    if (comp !== 0) { return comp; }
  }

  // Common section was identical, longest one wins
  return compareNSB(a.length, b.length);
}


/**
 * Compare { things U undefined }
 * Things are defined as any native types (string, number, boolean, null, date) and objects
 * We need to compare with undefined as it will be used in indexes
 * In the case of objects and arrays, we deep-compare
 * If two objects dont have the same type, the (arbitrary) type hierarchy is: undefined, null, number, strings, boolean, dates, arrays, objects
 * Return -1 if a < b, 1 if a > b and 0 if a = b (note that equality here is NOT the same as defined in areThingsEqual!)
 *
 * @param {Function} _compareStrings String comparing function, returning -1, 0 or 1, overriding default string comparison (useful for languages with accented letters)
 */
function compareThings (a, b, _compareStrings) {
  var aKeys, bKeys, comp, i
    , compareStrings = _compareStrings || compareNSB;

  // undefined
  if (a === undefined) { return b === undefined ? 0 : -1; }
  if (b === undefined) { return a === undefined ? 0 : 1; }

  // null
  if (a === null) { return b === null ? 0 : -1; }
  if (b === null) { return a === null ? 0 : 1; }

  // Numbers
  if (typeof a === 'number') { return typeof b === 'number' ? compareNSB(a, b) : -1; }
  if (typeof b === 'number') { return typeof a === 'number' ? compareNSB(a, b) : 1; }

  // Strings
  if (typeof a === 'string') { return typeof b === 'string' ? compareStrings(a, b) : -1; }
  if (typeof b === 'string') { return typeof a === 'string' ? compareStrings(a, b) : 1; }

  // Booleans
  if (typeof a === 'boolean') { return typeof b === 'boolean' ? compareNSB(a, b) : -1; }
  if (typeof b === 'boolean') { return typeof a === 'boolean' ? compareNSB(a, b) : 1; }

  // Dates
  if (util.isDate(a)) { return util.isDate(b) ? compareNSB(a.getTime(), b.getTime()) : -1; }
  if (util.isDate(b)) { return util.isDate(a) ? compareNSB(a.getTime(), b.getTime()) : 1; }

  // Arrays (first element is most significant and so on)
  if (util.isArray(a)) { return util.isArray(b) ? compareArrays(a, b) : -1; }
  if (util.isArray(b)) { return util.isArray(a) ? compareArrays(a, b) : 1; }

  // Objects
  aKeys = Object.keys(a).sort();
  bKeys = Object.keys(b).sort();

  for (i = 0; i < Math.min(aKeys.length, bKeys.length); i += 1) {
    comp = compareThings(a[aKeys[i]], b[bKeys[i]]);

    if (comp !== 0) { return comp; }
  }

  return compareNSB(aKeys.length, bKeys.length);
}



// ==============================================================
// Updating documents
// ==============================================================

/**
 * The signature of modifier functions is as follows
 * Their structure is always the same: recursively follow the dot notation while creating
 * the nested documents if needed, then apply the "last step modifier"
 * @param {Object} obj The model to modify
 * @param {String} field Can contain dots, in that case that means we will set a subfield recursively
 * @param {Model} value
 */

/**
 * Set a field to a new value
 */
lastStepModifierFunctions.$set = function (obj, field, value) {
  obj[field] = value;
};


/**
 * Unset a field
 */
lastStepModifierFunctions.$unset = function (obj, field, value) {
  delete obj[field];
};


/**
 * Push an element to the end of an array field
 * Optional modifier $each instead of value to push several values
 * Optional modifier $slice to slice the resulting array, see https://docs.mongodb.org/manual/reference/operator/update/slice/
 * Différeence with MongoDB: if $slice is specified and not $each, we act as if value is an empty array
 */
lastStepModifierFunctions.$push = function (obj, field, value) {
  // Create the array if it doesn't exist
  if (!obj.hasOwnProperty(field)) { obj[field] = []; }

  if (!util.isArray(obj[field])) { throw new Error("Can't $push an element on non-array values"); }

  if (value !== null && typeof value === 'object' && value.$slice && value.$each === undefined) {
    value.$each = [];
  }

  if (value !== null && typeof value === 'object' && value.$each) {
    if (Object.keys(value).length >= 3 || (Object.keys(value).length === 2 && value.$slice === undefined)) { throw new Error("Can only use $slice in cunjunction with $each when $push to array"); }
    if (!util.isArray(value.$each)) { throw new Error("$each requires an array value"); }

    value.$each.forEach(function (v) {
      obj[field].push(v);
    });

    if (value.$slice === undefined || typeof value.$slice !== 'number') { return; }

    if (value.$slice === 0) {
      obj[field] = [];
    } else {
      var start, end, n = obj[field].length;
      if (value.$slice < 0) {
        start = Math.max(0, n + value.$slice);
        end = n;
      } else if (value.$slice > 0) {
        start = 0;
        end = Math.min(n, value.$slice);
      }
      obj[field] = obj[field].slice(start, end);
    }
  } else {
    obj[field].push(value);
  }
};


/**
 * Add an element to an array field only if it is not already in it
 * No modification if the element is already in the array
 * Note that it doesn't check whether the original array contains duplicates
 */
lastStepModifierFunctions.$addToSet = function (obj, field, value) {
  var addToSet = true;

  // Create the array if it doesn't exist
  if (!obj.hasOwnProperty(field)) { obj[field] = []; }

  if (!util.isArray(obj[field])) { throw new Error("Can't $addToSet an element on non-array values"); }

  if (value !== null && typeof value === 'object' && value.$each) {
    if (Object.keys(value).length > 1) { throw new Error("Can't use another field in conjunction with $each"); }
    if (!util.isArray(value.$each)) { throw new Error("$each requires an array value"); }

    value.$each.forEach(function (v) {
      lastStepModifierFunctions.$addToSet(obj, field, v);
    });
  } else {
    obj[field].forEach(function (v) {
      if (compareThings(v, value) === 0) { addToSet = false; }
    });
    if (addToSet) { obj[field].push(value); }
  }
};


/**
 * Remove the first or last element of an array
 */
lastStepModifierFunctions.$pop = function (obj, field, value) {
  if (!util.isArray(obj[field])) { throw new Error("Can't $pop an element from non-array values"); }
  if (typeof value !== 'number') { throw new Error(value + " isn't an integer, can't use it with $pop"); }
  if (value === 0) { return; }

  if (value > 0) {
    obj[field] = obj[field].slice(0, obj[field].length - 1);
  } else {
    obj[field] = obj[field].slice(1);
  }
};


/**
 * Removes all instances of a value from an existing array
 */
lastStepModifierFunctions.$pull = function (obj, field, value) {
  var arr, i;

  if (!util.isArray(obj[field])) { throw new Error("Can't $pull an element from non-array values"); }

  arr = obj[field];
  for (i = arr.length - 1; i >= 0; i -= 1) {
    if (match(arr[i], value)) {
      arr.splice(i, 1);
    }
  }
};


/**
 * Increment a numeric field's value
 */
lastStepModifierFunctions.$inc = function (obj, field, value) {
  if (typeof value !== 'number') { throw new Error(value + " must be a number"); }

  if (typeof obj[field] !== 'number') {
    if (!_.has(obj, field)) {
      obj[field] = value;
    } else {
      throw new Error("Don't use the $inc modifier on non-number fields");
    }
  } else {
    obj[field] += value;
  }
};

/**
 * Updates the value of the field, only if specified field is greater than the current value of the field
 */
lastStepModifierFunctions.$max = function (obj, field, value) {
  if (typeof obj[field] === 'undefined') {
    obj[field] = value;
  } else if (value > obj[field]) {
    obj[field] = value;
  }
};

/**
 * Updates the value of the field, only if specified field is smaller than the current value of the field
 */
lastStepModifierFunctions.$min = function (obj, field, value) {
  if (typeof obj[field] === 'undefined') {
    obj[field] = value;
  } else if (value < obj[field]) {
    obj[field] = value;
  }
};

// Given its name, create the complete modifier function
function createModifierFunction (modifier) {
  return function (obj, field, value) {
    var fieldParts = typeof field === 'string' ? field.split('.') : field;

    if (fieldParts.length === 1) {
      lastStepModifierFunctions[modifier](obj, field, value);
    } else {
      if (obj[fieldParts[0]] === undefined) {
        if (modifier === '$unset') { return; }   // Bad looking specific fix, needs to be generalized modifiers that behave like $unset are implemented
        obj[fieldParts[0]] = {};
      }
      modifierFunctions[modifier](obj[fieldParts[0]], fieldParts.slice(1), value);
    }
  };
}

// Actually create all modifier functions
Object.keys(lastStepModifierFunctions).forEach(function (modifier) {
  modifierFunctions[modifier] = createModifierFunction(modifier);
});


/**
 * Modify a DB object according to an update query
 */
function modify (obj, updateQuery) {
  var keys = Object.keys(updateQuery)
    , firstChars = _.map(keys, function (item) { return item[0]; })
    , dollarFirstChars = _.filter(firstChars, function (c) { return c === '$'; })
    , newDoc, modifiers
    ;

  if (keys.indexOf('_id') !== -1 && updateQuery._id !== obj._id) { throw new Error("You cannot change a document's _id"); }

  if (dollarFirstChars.length !== 0 && dollarFirstChars.length !== firstChars.length) {
    throw new Error("You cannot mix modifiers and normal fields");
  }

  if (dollarFirstChars.length === 0) {
    // Simply replace the object with the update query contents
    newDoc = deepCopy(updateQuery);
    newDoc._id = obj._id;
  } else {
    // Apply modifiers
    modifiers = _.uniq(keys);
    newDoc = deepCopy(obj);
    modifiers.forEach(function (m) {
      var keys;

      if (!modifierFunctions[m]) { throw new Error("Unknown modifier " + m); }

      // Can't rely on Object.keys throwing on non objects since ES6
      // Not 100% satisfying as non objects can be interpreted as objects but no false negatives so we can live with it
      if (typeof updateQuery[m] !== 'object') {
        throw new Error("Modifier " + m + "'s argument must be an object");
      }

      keys = Object.keys(updateQuery[m]);
      keys.forEach(function (k) {
        modifierFunctions[m](newDoc, k, updateQuery[m][k]);
      });
    });
  }

  // Check result is valid and return it
  checkObject(newDoc);

  if (obj._id !== newDoc._id) { throw new Error("You can't change a document's _id"); }
  return newDoc;
};


// ==============================================================
// Finding documents
// ==============================================================

/**
 * Get a value from object with dot notation
 * @param {Object} obj
 * @param {String} field
 */
function getDotValue (obj, field) {
  var fieldParts = typeof field === 'string' ? field.split('.') : field
    , i, objs;

  if (!obj) { return undefined; }   // field cannot be empty so that means we should return undefined so that nothing can match

  if (fieldParts.length === 0) { return obj; }

  if (fieldParts.length === 1) { return obj[fieldParts[0]]; }

  if (util.isArray(obj[fieldParts[0]])) {
    // If the next field is an integer, return only this item of the array
    i = parseInt(fieldParts[1], 10);
    if (typeof i === 'number' && !isNaN(i)) {
      return getDotValue(obj[fieldParts[0]][i], fieldParts.slice(2))
    }

    // Return the array of values
    objs = new Array();
    for (i = 0; i < obj[fieldParts[0]].length; i += 1) {
       objs.push(getDotValue(obj[fieldParts[0]][i], fieldParts.slice(1)));
    }
    return objs;
  } else {
    return getDotValue(obj[fieldParts[0]], fieldParts.slice(1));
  }
}


/**
 * Check whether 'things' are equal
 * Things are defined as any native types (string, number, boolean, null, date) and objects
 * In the case of object, we check deep equality
 * Returns true if they are, false otherwise
 */
function areThingsEqual (a, b) {
  var aKeys , bKeys , i;

  // Strings, booleans, numbers, null
  if (a === null || typeof a === 'string' || typeof a === 'boolean' || typeof a === 'number' ||
      b === null || typeof b === 'string' || typeof b === 'boolean' || typeof b === 'number') { return a === b; }

  // Dates
  if (util.isDate(a) || util.isDate(b)) { return util.isDate(a) && util.isDate(b) && a.getTime() === b.getTime(); }

  // Arrays (no match since arrays are used as a $in)
  // undefined (no match since they mean field doesn't exist and can't be serialized)
  if ((!(util.isArray(a) && util.isArray(b)) && (util.isArray(a) || util.isArray(b))) || a === undefined || b === undefined) { return false; }

  // General objects (check for deep equality)
  // a and b should be objects at this point
  try {
    aKeys = Object.keys(a);
    bKeys = Object.keys(b);
  } catch (e) {
    return false;
  }

  if (aKeys.length !== bKeys.length) { return false; }
  for (i = 0; i < aKeys.length; i += 1) {
    if (bKeys.indexOf(aKeys[i]) === -1) { return false; }
    if (!areThingsEqual(a[aKeys[i]], b[aKeys[i]])) { return false; }
  }
  return true;
}


/**
 * Check that two values are comparable
 */
function areComparable (a, b) {
  if (typeof a !== 'string' && typeof a !== 'number' && !util.isDate(a) &&
      typeof b !== 'string' && typeof b !== 'number' && !util.isDate(b)) {
    return false;
  }

  if (typeof a !== typeof b) { return false; }

  return true;
}


/**
 * Arithmetic and comparison operators
 * @param {Native value} a Value in the object
 * @param {Native value} b Value in the query
 */
comparisonFunctions.$lt = function (a, b) {
  return areComparable(a, b) && a < b;
};

comparisonFunctions.$lte = function (a, b) {
  return areComparable(a, b) && a <= b;
};

comparisonFunctions.$gt = function (a, b) {
  return areComparable(a, b) && a > b;
};

comparisonFunctions.$gte = function (a, b) {
  return areComparable(a, b) && a >= b;
};

comparisonFunctions.$ne = function (a, b) {
  if (a === undefined) { return true; }
  return !areThingsEqual(a, b);
};

comparisonFunctions.$in = function (a, b) {
  var i;

  if (!util.isArray(b)) { throw new Error("$in operator called with a non-array"); }

  for (i = 0; i < b.length; i += 1) {
    if (areThingsEqual(a, b[i])) { return true; }
  }

  return false;
};

comparisonFunctions.$nin = function (a, b) {
  if (!util.isArray(b)) { throw new Error("$nin operator called with a non-array"); }

  return !comparisonFunctions.$in(a, b);
};

comparisonFunctions.$regex = function (a, b) {
  if (!util.isRegExp(b)) { throw new Error("$regex operator called with non regular expression"); }

  if (typeof a !== 'string') {
    return false
  } else {
    return b.test(a);
  }
};

comparisonFunctions.$exists = function (value, exists) {
  if (exists || exists === '') {   // This will be true for all values of exists except false, null, undefined and 0
    exists = true;                 // That's strange behaviour (we should only use true/false) but that's the way Mongo does it...
  } else {
    exists = false;
  }

  if (value === undefined) {
    return !exists
  } else {
    return exists;
  }
};

// Specific to arrays
comparisonFunctions.$size = function (obj, value) {
    if (!util.isArray(obj)) { return false; }
    if (value % 1 !== 0) { throw new Error("$size operator called without an integer"); }

    return (obj.length == value);
};
comparisonFunctions.$elemMatch = function (obj, value) {
  if (!util.isArray(obj)) { return false; }
  var i = obj.length;
  var result = false;   // Initialize result
  while (i--) {
    if (match(obj[i], value)) {   // If match for array element, return true
      result = true;
      break;
    }
  }
  return result;
};
arrayComparisonFunctions.$size = true;
arrayComparisonFunctions.$elemMatch = true;


/**
 * Match any of the subqueries
 * @param {Model} obj
 * @param {Array of Queries} query
 */
logicalOperators.$or = function (obj, query) {
  var i;

  if (!util.isArray(query)) { throw new Error("$or operator used without an array"); }

  for (i = 0; i < query.length; i += 1) {
    if (match(obj, query[i])) { return true; }
  }

  return false;
};


/**
 * Match all of the subqueries
 * @param {Model} obj
 * @param {Array of Queries} query
 */
logicalOperators.$and = function (obj, query) {
  var i;

  if (!util.isArray(query)) { throw new Error("$and operator used without an array"); }

  for (i = 0; i < query.length; i += 1) {
    if (!match(obj, query[i])) { return false; }
  }

  return true;
};


/**
 * Inverted match of the query
 * @param {Model} obj
 * @param {Query} query
 */
logicalOperators.$not = function (obj, query) {
  return !match(obj, query);
};


/**
 * Use a function to match
 * @param {Model} obj
 * @param {Query} query
 */
logicalOperators.$where = function (obj, fn) {
  var result;

  if (!_.isFunction(fn)) { throw new Error("$where operator used without a function"); }

  result = fn.call(obj);
  if (!_.isBoolean(result)) { throw new Error("$where function must return boolean"); }

  return result;
};


/**
 * Tell if a given document matches a query
 * @param {Object} obj Document to check
 * @param {Object} query
 */
function match (obj, query) {
  var queryKeys, queryKey, queryValue, i;

  // Primitive query against a primitive type
  // This is a bit of a hack since we construct an object with an arbitrary key only to dereference it later
  // But I don't have time for a cleaner implementation now
  if (isPrimitiveType(obj) || isPrimitiveType(query)) {
    return matchQueryPart({ needAKey: obj }, 'needAKey', query);
  }

  // Normal query
  queryKeys = Object.keys(query);
  for (i = 0; i < queryKeys.length; i += 1) {
    queryKey = queryKeys[i];
    queryValue = query[queryKey];

    if (queryKey[0] === '$') {
      if (!logicalOperators[queryKey]) { throw new Error("Unknown logical operator " + queryKey); }
      if (!logicalOperators[queryKey](obj, queryValue)) { return false; }
    } else {
      if (!matchQueryPart(obj, queryKey, queryValue)) { return false; }
    }
  }

  return true;
};


/**
 * Match an object against a specific { key: value } part of a query
 * if the treatObjAsValue flag is set, don't try to match every part separately, but the array as a whole
 */
function matchQueryPart (obj, queryKey, queryValue, treatObjAsValue) {
  var objValue = getDotValue(obj, queryKey)
    , i, keys, firstChars, dollarFirstChars;

  // Check if the value is an array if we don't force a treatment as value
  if (util.isArray(objValue) && !treatObjAsValue) {
    // If the queryValue is an array, try to perform an exact match
    if (util.isArray(queryValue)) {
      return matchQueryPart(obj, queryKey, queryValue, true);
    }

    // Check if we are using an array-specific comparison function
    if (queryValue !== null && typeof queryValue === 'object' && !util.isRegExp(queryValue)) {
      keys = Object.keys(queryValue);
      for (i = 0; i < keys.length; i += 1) {
        if (arrayComparisonFunctions[keys[i]]) { return matchQueryPart(obj, queryKey, queryValue, true); }
      }
    }

    // If not, treat it as an array of { obj, query } where there needs to be at least one match
    for (i = 0; i < objValue.length; i += 1) {
      if (matchQueryPart({ k: objValue[i] }, 'k', queryValue)) { return true; }   // k here could be any string
    }
    return false;
  }

  // queryValue is an actual object. Determine whether it contains comparison operators
  // or only normal fields. Mixed objects are not allowed
  if (queryValue !== null && typeof queryValue === 'object' && !util.isRegExp(queryValue) && !util.isArray(queryValue)) {
    keys = Object.keys(queryValue);
    firstChars = _.map(keys, function (item) { return item[0]; });
    dollarFirstChars = _.filter(firstChars, function (c) { return c === '$'; });

    if (dollarFirstChars.length !== 0 && dollarFirstChars.length !== firstChars.length) {
      throw new Error("You cannot mix operators and normal fields");
    }

    // queryValue is an object of this form: { $comparisonOperator1: value1, ... }
    if (dollarFirstChars.length > 0) {
      for (i = 0; i < keys.length; i += 1) {
        if (!comparisonFunctions[keys[i]]) { throw new Error("Unknown comparison function " + keys[i]); }

        if (!comparisonFunctions[keys[i]](objValue, queryValue[keys[i]])) { return false; }
      }
      return true;
    }
  }

  // Using regular expressions with basic querying
  if (util.isRegExp(queryValue)) { return comparisonFunctions.$regex(objValue, queryValue); }

  // queryValue is either a native value or a normal object
  // Basic matching is possible
  if (!areThingsEqual(objValue, queryValue)) { return false; }

  return true;
}


// Interface
module.exports.serialize = serialize;
module.exports.deserialize = deserialize;
module.exports.deepCopy = deepCopy;
module.exports.checkObject = checkObject;
module.exports.isPrimitiveType = isPrimitiveType;
module.exports.modify = modify;
module.exports.getDotValue = getDotValue;
module.exports.match = match;
module.exports.areThingsEqual = areThingsEqual;
module.exports.compareThings = compareThings;

},{"underscore":19,"util":3}],11:[function(require,module,exports){
var process=require("__browserify_process");/**
 * Handle every persistence-related task
 * The interface Datastore expects to be implemented is
 * * Persistence.loadDatabase(callback) and callback has signature err
 * * Persistence.persistNewState(newDocs, callback) where newDocs is an array of documents and callback has signature err
 */

var storage = local.storage = local.storage || require('./storage')
  , path = require('path')
  , model = require('./model')
  , async = require('async')
  , customUtils = require('./customUtils')
  , Index = require('./indexes')
  ;


/**
 * Create a new Persistence object for database options.db
 * @param {Datastore} options.db
 * @param {Boolean} options.nodeWebkitAppName Optional, specify the name of your NW app if you want options.filename to be relative to the directory where
 *                                            Node Webkit stores application data such as cookies and local storage (the best place to store data in my opinion)
 */
function Persistence (options) {
  var i, j, randomString;

  this.db = options.db;
  this.inMemoryOnly = this.db.inMemoryOnly;
  this.filename = this.db.filename;
  this.corruptAlertThreshold = options.corruptAlertThreshold !== undefined ? options.corruptAlertThreshold : 0.1;

  if (!this.inMemoryOnly && this.filename && this.filename.charAt(this.filename.length - 1) === '~') {
    throw new Error("The datafile name can't end with a ~, which is reserved for crash safe backup files");
  }

  // After serialization and before deserialization hooks with some basic sanity checks
  if (options.afterSerialization && !options.beforeDeserialization) {
    throw new Error("Serialization hook defined but deserialization hook undefined, cautiously refusing to start NeDB to prevent dataloss");
  }
  if (!options.afterSerialization && options.beforeDeserialization) {
    throw new Error("Serialization hook undefined but deserialization hook defined, cautiously refusing to start NeDB to prevent dataloss");
  }
  this.afterSerialization = options.afterSerialization || function (s) { return s; };
  this.beforeDeserialization = options.beforeDeserialization || function (s) { return s; };
  for (i = 1; i < 30; i += 1) {
    for (j = 0; j < 10; j += 1) {
      randomString = customUtils.uid(i);
      if (this.beforeDeserialization(this.afterSerialization(randomString)) !== randomString) {
        throw new Error("beforeDeserialization is not the reverse of afterSerialization, cautiously refusing to start NeDB to prevent dataloss");
      }
    }
  }

  // For NW apps, store data in the same directory where NW stores application data
  if (this.filename && options.nodeWebkitAppName) {
    console.log("==================================================================");
    console.log("WARNING: The nodeWebkitAppName option is deprecated");
    console.log("To get the path to the directory where Node Webkit stores the data");
    console.log("for your app, use the internal nw.gui module like this");
    console.log("require('nw.gui').App.dataPath");
    console.log("See https://github.com/rogerwang/node-webkit/issues/500");
    console.log("==================================================================");
    this.filename = Persistence.getNWAppFilename(options.nodeWebkitAppName, this.filename);
  }
};


/**
 * Check if a directory exists and create it on the fly if it is not the case
 * cb is optional, signature: err
 */
Persistence.ensureDirectoryExists = function (dir, cb) {
  var callback = cb || function () {}
    ;

  storage.mkdirp(dir, function (err) { return callback(err); });
};




/**
 * Return the path the datafile if the given filename is relative to the directory where Node Webkit stores
 * data for this application. Probably the best place to store data
 */
Persistence.getNWAppFilename = function (appName, relativeFilename) {
  var home;

  switch (process.platform) {
    case 'win32':
    case 'win64':
      home = process.env.LOCALAPPDATA || process.env.APPDATA;
      if (!home) { throw new Error("Couldn't find the base application data folder"); }
      home = path.join(home, appName);
      break;
    case 'darwin':
      home = process.env.HOME;
      if (!home) { throw new Error("Couldn't find the base application data directory"); }
      home = path.join(home, 'Library', 'Application Support', appName);
      break;
    case 'linux':
      home = process.env.HOME;
      if (!home) { throw new Error("Couldn't find the base application data directory"); }
      home = path.join(home, '.config', appName);
      break;
    default:
      throw new Error("Can't use the Node Webkit relative path for platform " + process.platform);
      break;
  }

  return path.join(home, 'nedb-data', relativeFilename);
}


/**
 * Persist cached database
 * This serves as a compaction function since the cache always contains only the number of documents in the collection
 * while the data file is append-only so it may grow larger
 * @param {Function} cb Optional callback, signature: err
 */
Persistence.prototype.persistCachedDatabase = function (cb) {
  var callback = cb || function () {}
    , toPersist = ''
    , self = this
    ;

  if (this.inMemoryOnly) { return callback(null); }

  this.db.getAllData().forEach(function (doc) {
    toPersist += self.afterSerialization(model.serialize(doc)) + '\n';
  });
  Object.keys(this.db.indexes).forEach(function (fieldName) {
    if (fieldName != "_id") {   // The special _id index is managed by datastore.js, the others need to be persisted
      toPersist += self.afterSerialization(model.serialize({ $$indexCreated: { fieldName: fieldName, unique: self.db.indexes[fieldName].unique, sparse: self.db.indexes[fieldName].sparse }})) + '\n';
    }
  });

  storage.crashSafeWriteFile(this.filename, toPersist, function (err) {
    if (err) { return callback(err); }
    self.db.emit('compaction.done');
    return callback(null);
  });
};


/**
 * Queue a rewrite of the datafile
 */
Persistence.prototype.compactDatafile = function () {
  this.db.executor.push({ this: this, fn: this.persistCachedDatabase, arguments: [] });
};


/**
 * Set automatic compaction every interval ms
 * @param {Number} interval in milliseconds, with an enforced minimum of 5 seconds
 */
Persistence.prototype.setAutocompactionInterval = function (interval) {
  var self = this
    , minInterval = 5000
    , realInterval = Math.max(interval || 0, minInterval)
    ;

  this.stopAutocompaction();

  this.autocompactionIntervalId = setInterval(function () {
    self.compactDatafile();
  }, realInterval);
};


/**
 * Stop autocompaction (do nothing if autocompaction was not running)
 */
Persistence.prototype.stopAutocompaction = function () {
  if (this.autocompactionIntervalId) { clearInterval(this.autocompactionIntervalId); }
};


/**
 * Persist new state for the given newDocs (can be insertion, update or removal)
 * Use an append-only format
 * @param {Array} newDocs Can be empty if no doc was updated/removed
 * @param {Function} cb Optional, signature: err
 */
Persistence.prototype.persistNewState = function (newDocs, cb) {
  var self = this
    , toPersist = ''
    , callback = cb || function () {}
    ;

  // In-memory only datastore
  if (self.inMemoryOnly) { return callback(null); }

  newDocs.forEach(function (doc) {
    toPersist += self.afterSerialization(model.serialize(doc)) + '\n';
  });

  if (toPersist.length === 0) { return callback(null); }

  storage.appendFile(self.filename, toPersist, 'utf8', function (err) {
    return callback(err);
  });
};


/**
 * From a database's raw data, return the corresponding
 * machine understandable collection
 */
Persistence.prototype.treatRawData = function (rawData) {
  var data = rawData.split('\n')
    , dataById = {}
    , tdata = []
    , i
    , indexes = {}
    , corruptItems = -1   // Last line of every data file is usually blank so not really corrupt
    ;

  for (i = 0; i < data.length; i += 1) {
    var doc;

    try {
      doc = model.deserialize(this.beforeDeserialization(data[i]));
      if (doc._id) {
        if (doc.$$deleted === true) {
          delete dataById[doc._id];
        } else {
          dataById[doc._id] = doc;
        }
      } else if (doc.$$indexCreated && doc.$$indexCreated.fieldName != undefined) {
        indexes[doc.$$indexCreated.fieldName] = doc.$$indexCreated;
      } else if (typeof doc.$$indexRemoved === "string") {
        delete indexes[doc.$$indexRemoved];
      }
    } catch (e) {
      corruptItems += 1;
    }
  }

  // A bit lenient on corruption
  if (data.length > 0 && corruptItems / data.length > this.corruptAlertThreshold) {
    throw new Error("More than " + Math.floor(100 * this.corruptAlertThreshold) + "% of the data file is corrupt, the wrong beforeDeserialization hook may be used. Cautiously refusing to start NeDB to prevent dataloss");
  }

  Object.keys(dataById).forEach(function (k) {
    tdata.push(dataById[k]);
  });

  return { data: tdata, indexes: indexes };
};


/**
 * Load the database
 * 1) Create all indexes
 * 2) Insert all data
 * 3) Compact the database
 * This means pulling data out of the data file or creating it if it doesn't exist
 * Also, all data is persisted right away, which has the effect of compacting the database file
 * This operation is very quick at startup for a big collection (60ms for ~10k docs)
 * @param {Function} cb Optional callback, signature: err
 */
Persistence.prototype.loadDatabase = function (cb) {
  var callback = cb || function () {}
    , self = this
    ;

  self.db.resetIndexes();

  // In-memory only datastore
  if (self.inMemoryOnly) { return callback(null); }

  async.waterfall([
    function (cb) {
      Persistence.ensureDirectoryExists(path.dirname(self.filename), function (err) {
        storage.ensureDatafileIntegrity(self.filename, function (err) {
          storage.readFile(self.filename, 'utf8', function (err, rawData) {
            if (err) { return cb(err); }

            try {
              var treatedData = self.treatRawData(rawData);
            } catch (e) {
              return cb(e);
            }

            // Recreate all indexes in the datafile
            Object.keys(treatedData.indexes).forEach(function (key) {
              self.db.indexes[key] = new Index(treatedData.indexes[key]);
            });

            // Fill cached database (i.e. all indexes) with data
            try {
              self.db.resetIndexes(treatedData.data);
            } catch (e) {
              self.db.resetIndexes();   // Rollback any index which didn't fail
              return cb(e);
            }

            self.db.persistence.persistCachedDatabase(cb);
          });
        });
      });
    }
  ], function (err) {
       if (err) { return callback(err); }

       self.db.executor.processBuffer();
       return callback(null);
     });
};


// Interface
module.exports = Persistence;

},{"./customUtils":6,"./indexes":9,"./model":10,"./storage":12,"__browserify_process":4,"async":13,"path":2}],12:[function(require,module,exports){
/**
 * Way data is stored for this database
 * For a Node.js/Node Webkit database it's the file system
 * For a browser-side database it's localforage, which uses the best backend available (IndexedDB then WebSQL then localStorage)
 *
 * This version is the browser version
 */

var localforage = require('localforage')

// Configure localforage to display NeDB name for now. Would be a good idea to let user use his own app name
localforage.config({
  name: 'NeDB'
, storeName: 'nedbdata'
});


function exists (filename, callback) {
  localforage.getItem(filename, function (err, value) {
    if (value !== null) {   // Even if value is undefined, localforage returns null
      return callback(true);
    } else {
      return callback(false);
    }
  });
}


function rename (filename, newFilename, callback) {
  localforage.getItem(filename, function (err, value) {
    if (value === null) {
      localforage.removeItem(newFilename, function () { return callback(); });
    } else {
      localforage.setItem(newFilename, value, function () {
        localforage.removeItem(filename, function () { return callback(); });
      });
    }
  });
}


function writeFile (filename, contents, options, callback) {
  // Options do not matter in browser setup
  if (typeof options === 'function') { callback = options; }
  localforage.setItem(filename, contents, function () { return callback(); });
}


function appendFile (filename, toAppend, options, callback) {
  // Options do not matter in browser setup
  if (typeof options === 'function') { callback = options; }

  localforage.getItem(filename, function (err, contents) {
    contents = contents || '';
    contents += toAppend;
    localforage.setItem(filename, contents, function () { return callback(); });
  });
}


function readFile (filename, options, callback) {
  // Options do not matter in browser setup
  if (typeof options === 'function') { callback = options; }
  localforage.getItem(filename, function (err, contents) { return callback(null, contents || ''); });
}


function unlink (filename, callback) {
  localforage.removeItem(filename, function () { return callback(); });
}


// Nothing to do, no directories will be used on the browser
function mkdirp (dir, callback) {
  return callback();
}


// Nothing to do, no data corruption possible in the brower
function ensureDatafileIntegrity (filename, callback) {
  return callback(null);
}


// Interface
module.exports.exists = exists;
module.exports.rename = rename;
module.exports.writeFile = writeFile;
module.exports.crashSafeWriteFile = writeFile;   // No need for a crash safe function in the browser
module.exports.appendFile = appendFile;
module.exports.readFile = readFile;
module.exports.unlink = unlink;
module.exports.mkdirp = mkdirp;
module.exports.ensureDatafileIntegrity = ensureDatafileIntegrity;


},{"localforage":18}],13:[function(require,module,exports){
var process=require("__browserify_process");/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

},{"__browserify_process":4}],14:[function(require,module,exports){
module.exports.BinarySearchTree = require('./lib/bst');
module.exports.AVLTree = require('./lib/avltree');

},{"./lib/avltree":15,"./lib/bst":16}],15:[function(require,module,exports){
/**
 * Self-balancing binary search tree using the AVL implementation
 */
var BinarySearchTree = require('./bst')
  , customUtils = require('./customUtils')
  , util = require('util')
  , _ = require('underscore')
  ;


/**
 * Constructor
 * We can't use a direct pointer to the root node (as in the simple binary search tree)
 * as the root will change during tree rotations
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function AVLTree (options) {
  this.tree = new _AVLTree(options);
}


/**
 * Constructor of the internal AVLTree
 * @param {Object} options Optional
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Key}      options.key Initialize this BST's key with key
 * @param {Value}    options.value Initialize this BST's data with [value]
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function _AVLTree (options) {
  options = options || {};

  this.left = null;
  this.right = null;
  this.parent = options.parent !== undefined ? options.parent : null;
  if (options.hasOwnProperty('key')) { this.key = options.key; }
  this.data = options.hasOwnProperty('value') ? [options.value] : [];
  this.unique = options.unique || false;

  this.compareKeys = options.compareKeys || customUtils.defaultCompareKeysFunction;
  this.checkValueEquality = options.checkValueEquality || customUtils.defaultCheckValueEquality;
}


/**
 * Inherit basic functions from the basic binary search tree
 */
util.inherits(_AVLTree, BinarySearchTree);

/**
 * Keep a pointer to the internal tree constructor for testing purposes
 */
AVLTree._AVLTree = _AVLTree;


/**
 * Check the recorded height is correct for every node
 * Throws if one height doesn't match
 */
_AVLTree.prototype.checkHeightCorrect = function () {
  var leftH, rightH;

  if (!this.hasOwnProperty('key')) { return; }   // Empty tree

  if (this.left && this.left.height === undefined) { throw new Error("Undefined height for node " + this.left.key); }
  if (this.right && this.right.height === undefined) { throw new Error("Undefined height for node " + this.right.key); }
  if (this.height === undefined) { throw new Error("Undefined height for node " + this.key); }

  leftH = this.left ? this.left.height : 0;
  rightH = this.right ? this.right.height : 0;

  if (this.height !== 1 + Math.max(leftH, rightH)) { throw new Error("Height constraint failed for node " + this.key); }
  if (this.left) { this.left.checkHeightCorrect(); }
  if (this.right) { this.right.checkHeightCorrect(); }
};


/**
 * Return the balance factor
 */
_AVLTree.prototype.balanceFactor = function () {
  var leftH = this.left ? this.left.height : 0
    , rightH = this.right ? this.right.height : 0
    ;
  return leftH - rightH;
};


/**
 * Check that the balance factors are all between -1 and 1
 */
_AVLTree.prototype.checkBalanceFactors = function () {
  if (Math.abs(this.balanceFactor()) > 1) { throw new Error('Tree is unbalanced at node ' + this.key); }

  if (this.left) { this.left.checkBalanceFactors(); }
  if (this.right) { this.right.checkBalanceFactors(); }
};


/**
 * When checking if the BST conditions are met, also check that the heights are correct
 * and the tree is balanced
 */
_AVLTree.prototype.checkIsAVLT = function () {
  _AVLTree.super_.prototype.checkIsBST.call(this);
  this.checkHeightCorrect();
  this.checkBalanceFactors();
};
AVLTree.prototype.checkIsAVLT = function () { this.tree.checkIsAVLT(); };


/**
 * Perform a right rotation of the tree if possible
 * and return the root of the resulting tree
 * The resulting tree's nodes' heights are also updated
 */
_AVLTree.prototype.rightRotation = function () {
  var q = this
    , p = this.left
    , b
    , ah, bh, ch;

  if (!p) { return this; }   // No change

  b = p.right;

  // Alter tree structure
  if (q.parent) {
    p.parent = q.parent;
    if (q.parent.left === q) { q.parent.left = p; } else { q.parent.right = p; }
  } else {
    p.parent = null;
  }
  p.right = q;
  q.parent = p;
  q.left = b;
  if (b) { b.parent = q; }

  // Update heights
  ah = p.left ? p.left.height : 0;
  bh = b ? b.height : 0;
  ch = q.right ? q.right.height : 0;
  q.height = Math.max(bh, ch) + 1;
  p.height = Math.max(ah, q.height) + 1;

  return p;
};


/**
 * Perform a left rotation of the tree if possible
 * and return the root of the resulting tree
 * The resulting tree's nodes' heights are also updated
 */
_AVLTree.prototype.leftRotation = function () {
  var p = this
    , q = this.right
    , b
    , ah, bh, ch;

  if (!q) { return this; }   // No change

  b = q.left;

  // Alter tree structure
  if (p.parent) {
    q.parent = p.parent;
    if (p.parent.left === p) { p.parent.left = q; } else { p.parent.right = q; }
  } else {
    q.parent = null;
  }
  q.left = p;
  p.parent = q;
  p.right = b;
  if (b) { b.parent = p; }

  // Update heights
  ah = p.left ? p.left.height : 0;
  bh = b ? b.height : 0;
  ch = q.right ? q.right.height : 0;
  p.height = Math.max(ah, bh) + 1;
  q.height = Math.max(ch, p.height) + 1;

  return q;
};


/**
 * Modify the tree if its right subtree is too small compared to the left
 * Return the new root if any
 */
_AVLTree.prototype.rightTooSmall = function () {
  if (this.balanceFactor() <= 1) { return this; }   // Right is not too small, don't change

  if (this.left.balanceFactor() < 0) {
    this.left.leftRotation();
  }

  return this.rightRotation();
};


/**
 * Modify the tree if its left subtree is too small compared to the right
 * Return the new root if any
 */
_AVLTree.prototype.leftTooSmall = function () {
  if (this.balanceFactor() >= -1) { return this; }   // Left is not too small, don't change

  if (this.right.balanceFactor() > 0) {
    this.right.rightRotation();
  }

  return this.leftRotation();
};


/**
 * Rebalance the tree along the given path. The path is given reversed (as he was calculated
 * in the insert and delete functions).
 * Returns the new root of the tree
 * Of course, the first element of the path must be the root of the tree
 */
_AVLTree.prototype.rebalanceAlongPath = function (path) {
  var newRoot = this
    , rotated
    , i;

  if (!this.hasOwnProperty('key')) { delete this.height; return this; }   // Empty tree

  // Rebalance the tree and update all heights
  for (i = path.length - 1; i >= 0; i -= 1) {
    path[i].height = 1 + Math.max(path[i].left ? path[i].left.height : 0, path[i].right ? path[i].right.height : 0);

    if (path[i].balanceFactor() > 1) {
      rotated = path[i].rightTooSmall();
      if (i === 0) { newRoot = rotated; }
    }

    if (path[i].balanceFactor() < -1) {
      rotated = path[i].leftTooSmall();
      if (i === 0) { newRoot = rotated; }
    }
  }

  return newRoot;
};


/**
 * Insert a key, value pair in the tree while maintaining the AVL tree height constraint
 * Return a pointer to the root node, which may have changed
 */
_AVLTree.prototype.insert = function (key, value) {
  var insertPath = []
    , currentNode = this
    ;

  // Empty tree, insert as root
  if (!this.hasOwnProperty('key')) {
    this.key = key;
    this.data.push(value);
    this.height = 1;
    return this;
  }

  // Insert new leaf at the right place
  while (true) {
    // Same key: no change in the tree structure
    if (currentNode.compareKeys(currentNode.key, key) === 0) {
      if (currentNode.unique) {
        var err = new Error("Can't insert key " + key + ", it violates the unique constraint");
        err.key = key;
        err.errorType = 'uniqueViolated';
        throw err;
      } else {
        currentNode.data.push(value);
      }
      return this;
    }

    insertPath.push(currentNode);

    if (currentNode.compareKeys(key, currentNode.key) < 0) {
      if (!currentNode.left) {
        insertPath.push(currentNode.createLeftChild({ key: key, value: value }));
        break;
      } else {
        currentNode = currentNode.left;
      }
    } else {
      if (!currentNode.right) {
        insertPath.push(currentNode.createRightChild({ key: key, value: value }));
        break;
      } else {
        currentNode = currentNode.right;
      }
    }
  }

  return this.rebalanceAlongPath(insertPath);
};

// Insert in the internal tree, update the pointer to the root if needed
AVLTree.prototype.insert = function (key, value) {
  var newTree = this.tree.insert(key, value);

  // If newTree is undefined, that means its structure was not modified
  if (newTree) { this.tree = newTree; }
};


/**
 * Delete a key or just a value and return the new root of the tree
 * @param {Key} key
 * @param {Value} value Optional. If not set, the whole key is deleted. If set, only this value is deleted
 */
_AVLTree.prototype.delete = function (key, value) {
  var newData = [], replaceWith
    , self = this
    , currentNode = this
    , deletePath = []
    ;

  if (!this.hasOwnProperty('key')) { return this; }   // Empty tree

  // Either no match is found and the function will return from within the loop
  // Or a match is found and deletePath will contain the path from the root to the node to delete after the loop
  while (true) {
    if (currentNode.compareKeys(key, currentNode.key) === 0) { break; }

    deletePath.push(currentNode);

    if (currentNode.compareKeys(key, currentNode.key) < 0) {
      if (currentNode.left) {
        currentNode = currentNode.left;
      } else {
        return this;   // Key not found, no modification
      }
    } else {
      // currentNode.compareKeys(key, currentNode.key) is > 0
      if (currentNode.right) {
        currentNode = currentNode.right;
      } else {
        return this;   // Key not found, no modification
      }
    }
  }

  // Delete only a value (no tree modification)
  if (currentNode.data.length > 1 && value) {
    currentNode.data.forEach(function (d) {
      if (!currentNode.checkValueEquality(d, value)) { newData.push(d); }
    });
    currentNode.data = newData;
    return this;
  }

  // Delete a whole node

  // Leaf
  if (!currentNode.left && !currentNode.right) {
    if (currentNode === this) {   // This leaf is also the root
      delete currentNode.key;
      currentNode.data = [];
      delete currentNode.height;
      return this;
    } else {
      if (currentNode.parent.left === currentNode) {
        currentNode.parent.left = null;
      } else {
        currentNode.parent.right = null;
      }
      return this.rebalanceAlongPath(deletePath);
    }
  }


  // Node with only one child
  if (!currentNode.left || !currentNode.right) {
    replaceWith = currentNode.left ? currentNode.left : currentNode.right;

    if (currentNode === this) {   // This node is also the root
      replaceWith.parent = null;
      return replaceWith;   // height of replaceWith is necessarily 1 because the tree was balanced before deletion
    } else {
      if (currentNode.parent.left === currentNode) {
        currentNode.parent.left = replaceWith;
        replaceWith.parent = currentNode.parent;
      } else {
        currentNode.parent.right = replaceWith;
        replaceWith.parent = currentNode.parent;
      }

      return this.rebalanceAlongPath(deletePath);
    }
  }


  // Node with two children
  // Use the in-order predecessor (no need to randomize since we actively rebalance)
  deletePath.push(currentNode);
  replaceWith = currentNode.left;

  // Special case: the in-order predecessor is right below the node to delete
  if (!replaceWith.right) {
    currentNode.key = replaceWith.key;
    currentNode.data = replaceWith.data;
    currentNode.left = replaceWith.left;
    if (replaceWith.left) { replaceWith.left.parent = currentNode; }
    return this.rebalanceAlongPath(deletePath);
  }

  // After this loop, replaceWith is the right-most leaf in the left subtree
  // and deletePath the path from the root (inclusive) to replaceWith (exclusive)
  while (true) {
    if (replaceWith.right) {
      deletePath.push(replaceWith);
      replaceWith = replaceWith.right;
    } else {
      break;
    }
  }

  currentNode.key = replaceWith.key;
  currentNode.data = replaceWith.data;

  replaceWith.parent.right = replaceWith.left;
  if (replaceWith.left) { replaceWith.left.parent = replaceWith.parent; }

  return this.rebalanceAlongPath(deletePath);
};

// Delete a value
AVLTree.prototype.delete = function (key, value) {
  var newTree = this.tree.delete(key, value);

  // If newTree is undefined, that means its structure was not modified
  if (newTree) { this.tree = newTree; }
};


/**
 * Other functions we want to use on an AVLTree as if it were the internal _AVLTree
 */
['getNumberOfKeys', 'search', 'betweenBounds', 'prettyPrint', 'executeOnEveryNode'].forEach(function (fn) {
  AVLTree.prototype[fn] = function () {
    return this.tree[fn].apply(this.tree, arguments);
  };
});


// Interface
module.exports = AVLTree;

},{"./bst":16,"./customUtils":17,"underscore":19,"util":3}],16:[function(require,module,exports){
/**
 * Simple binary search tree
 */
var customUtils = require('./customUtils');


/**
 * Constructor
 * @param {Object} options Optional
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Key}      options.key Initialize this BST's key with key
 * @param {Value}    options.value Initialize this BST's data with [value]
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function BinarySearchTree (options) {
  options = options || {};

  this.left = null;
  this.right = null;
  this.parent = options.parent !== undefined ? options.parent : null;
  if (options.hasOwnProperty('key')) { this.key = options.key; }
  this.data = options.hasOwnProperty('value') ? [options.value] : [];
  this.unique = options.unique || false;

  this.compareKeys = options.compareKeys || customUtils.defaultCompareKeysFunction;
  this.checkValueEquality = options.checkValueEquality || customUtils.defaultCheckValueEquality;
}


// ================================
// Methods used to test the tree
// ================================


/**
 * Get the descendant with max key
 */
BinarySearchTree.prototype.getMaxKeyDescendant = function () {
  if (this.right) {
    return this.right.getMaxKeyDescendant();
  } else {
    return this;
  }
};


/**
 * Get the maximum key
 */
BinarySearchTree.prototype.getMaxKey = function () {
  return this.getMaxKeyDescendant().key;
};


/**
 * Get the descendant with min key
 */
BinarySearchTree.prototype.getMinKeyDescendant = function () {
  if (this.left) {
    return this.left.getMinKeyDescendant()
  } else {
    return this;
  }
};


/**
 * Get the minimum key
 */
BinarySearchTree.prototype.getMinKey = function () {
  return this.getMinKeyDescendant().key;
};


/**
 * Check that all nodes (incl. leaves) fullfil condition given by fn
 * test is a function passed every (key, data) and which throws if the condition is not met
 */
BinarySearchTree.prototype.checkAllNodesFullfillCondition = function (test) {
  if (!this.hasOwnProperty('key')) { return; }

  test(this.key, this.data);
  if (this.left) { this.left.checkAllNodesFullfillCondition(test); }
  if (this.right) { this.right.checkAllNodesFullfillCondition(test); }
};


/**
 * Check that the core BST properties on node ordering are verified
 * Throw if they aren't
 */
BinarySearchTree.prototype.checkNodeOrdering = function () {
  var self = this;

  if (!this.hasOwnProperty('key')) { return; }

  if (this.left) {
    this.left.checkAllNodesFullfillCondition(function (k) {
      if (self.compareKeys(k, self.key) >= 0) {
        throw new Error('Tree with root ' + self.key + ' is not a binary search tree');
      }
    });
    this.left.checkNodeOrdering();
  }

  if (this.right) {
    this.right.checkAllNodesFullfillCondition(function (k) {
      if (self.compareKeys(k, self.key) <= 0) {
        throw new Error('Tree with root ' + self.key + ' is not a binary search tree');
      }
    });
    this.right.checkNodeOrdering();
  }
};


/**
 * Check that all pointers are coherent in this tree
 */
BinarySearchTree.prototype.checkInternalPointers = function () {
  if (this.left) {
    if (this.left.parent !== this) { throw new Error('Parent pointer broken for key ' + this.key); }
    this.left.checkInternalPointers();
  }

  if (this.right) {
    if (this.right.parent !== this) { throw new Error('Parent pointer broken for key ' + this.key); }
    this.right.checkInternalPointers();
  }
};


/**
 * Check that a tree is a BST as defined here (node ordering and pointer references)
 */
BinarySearchTree.prototype.checkIsBST = function () {
  this.checkNodeOrdering();
  this.checkInternalPointers();
  if (this.parent) { throw new Error("The root shouldn't have a parent"); }
};


/**
 * Get number of keys inserted
 */
BinarySearchTree.prototype.getNumberOfKeys = function () {
  var res;

  if (!this.hasOwnProperty('key')) { return 0; }

  res = 1;
  if (this.left) { res += this.left.getNumberOfKeys(); }
  if (this.right) { res += this.right.getNumberOfKeys(); }

  return res;
};



// ============================================
// Methods used to actually work on the tree
// ============================================

/**
 * Create a BST similar (i.e. same options except for key and value) to the current one
 * Use the same constructor (i.e. BinarySearchTree, AVLTree etc)
 * @param {Object} options see constructor
 */
BinarySearchTree.prototype.createSimilar = function (options) {
  options = options || {};
  options.unique = this.unique;
  options.compareKeys = this.compareKeys;
  options.checkValueEquality = this.checkValueEquality;

  return new this.constructor(options);
};


/**
 * Create the left child of this BST and return it
 */
BinarySearchTree.prototype.createLeftChild = function (options) {
  var leftChild = this.createSimilar(options);
  leftChild.parent = this;
  this.left = leftChild;

  return leftChild;
};


/**
 * Create the right child of this BST and return it
 */
BinarySearchTree.prototype.createRightChild = function (options) {
  var rightChild = this.createSimilar(options);
  rightChild.parent = this;
  this.right = rightChild;

  return rightChild;
};


/**
 * Insert a new element
 */
BinarySearchTree.prototype.insert = function (key, value) {
  // Empty tree, insert as root
  if (!this.hasOwnProperty('key')) {
    this.key = key;
    this.data.push(value);
    return;
  }

  // Same key as root
  if (this.compareKeys(this.key, key) === 0) {
    if (this.unique) {
      var err = new Error("Can't insert key " + key + ", it violates the unique constraint");
      err.key = key;
      err.errorType = 'uniqueViolated';
      throw err;
    } else {
      this.data.push(value);
    }
    return;
  }

  if (this.compareKeys(key, this.key) < 0) {
    // Insert in left subtree
    if (this.left) {
      this.left.insert(key, value);
    } else {
      this.createLeftChild({ key: key, value: value });
    }
  } else {
    // Insert in right subtree
    if (this.right) {
      this.right.insert(key, value);
    } else {
      this.createRightChild({ key: key, value: value });
    }
  }
};


/**
 * Search for all data corresponding to a key
 */
BinarySearchTree.prototype.search = function (key) {
  if (!this.hasOwnProperty('key')) { return []; }

  if (this.compareKeys(this.key, key) === 0) { return this.data; }

  if (this.compareKeys(key, this.key) < 0) {
    if (this.left) {
      return this.left.search(key);
    } else {
      return [];
    }
  } else {
    if (this.right) {
      return this.right.search(key);
    } else {
      return [];
    }
  }
};


/**
 * Return a function that tells whether a given key matches a lower bound
 */
BinarySearchTree.prototype.getLowerBoundMatcher = function (query) {
  var self = this;

  // No lower bound
  if (!query.hasOwnProperty('$gt') && !query.hasOwnProperty('$gte')) {
    return function () { return true; };
  }

  if (query.hasOwnProperty('$gt') && query.hasOwnProperty('$gte')) {
    if (self.compareKeys(query.$gte, query.$gt) === 0) {
      return function (key) { return self.compareKeys(key, query.$gt) > 0; };
    }

    if (self.compareKeys(query.$gte, query.$gt) > 0) {
      return function (key) { return self.compareKeys(key, query.$gte) >= 0; };
    } else {
      return function (key) { return self.compareKeys(key, query.$gt) > 0; };
    }
  }

  if (query.hasOwnProperty('$gt')) {
    return function (key) { return self.compareKeys(key, query.$gt) > 0; };
  } else {
    return function (key) { return self.compareKeys(key, query.$gte) >= 0; };
  }
};


/**
 * Return a function that tells whether a given key matches an upper bound
 */
BinarySearchTree.prototype.getUpperBoundMatcher = function (query) {
  var self = this;

  // No lower bound
  if (!query.hasOwnProperty('$lt') && !query.hasOwnProperty('$lte')) {
    return function () { return true; };
  }

  if (query.hasOwnProperty('$lt') && query.hasOwnProperty('$lte')) {
    if (self.compareKeys(query.$lte, query.$lt) === 0) {
      return function (key) { return self.compareKeys(key, query.$lt) < 0; };
    }

    if (self.compareKeys(query.$lte, query.$lt) < 0) {
      return function (key) { return self.compareKeys(key, query.$lte) <= 0; };
    } else {
      return function (key) { return self.compareKeys(key, query.$lt) < 0; };
    }
  }

  if (query.hasOwnProperty('$lt')) {
    return function (key) { return self.compareKeys(key, query.$lt) < 0; };
  } else {
    return function (key) { return self.compareKeys(key, query.$lte) <= 0; };
  }
};


// Append all elements in toAppend to array
function append (array, toAppend) {
  var i;

  for (i = 0; i < toAppend.length; i += 1) {
    array.push(toAppend[i]);
  }
}


/**
 * Get all data for a key between bounds
 * Return it in key order
 * @param {Object} query Mongo-style query where keys are $lt, $lte, $gt or $gte (other keys are not considered)
 * @param {Functions} lbm/ubm matching functions calculated at the first recursive step
 */
BinarySearchTree.prototype.betweenBounds = function (query, lbm, ubm) {
  var res = [];

  if (!this.hasOwnProperty('key')) { return []; }   // Empty tree

  lbm = lbm || this.getLowerBoundMatcher(query);
  ubm = ubm || this.getUpperBoundMatcher(query);

  if (lbm(this.key) && this.left) { append(res, this.left.betweenBounds(query, lbm, ubm)); }
  if (lbm(this.key) && ubm(this.key)) { append(res, this.data); }
  if (ubm(this.key) && this.right) { append(res, this.right.betweenBounds(query, lbm, ubm)); }

  return res;
};


/**
 * Delete the current node if it is a leaf
 * Return true if it was deleted
 */
BinarySearchTree.prototype.deleteIfLeaf = function () {
  if (this.left || this.right) { return false; }

  // The leaf is itself a root
  if (!this.parent) {
    delete this.key;
    this.data = [];
    return true;
  }

  if (this.parent.left === this) {
    this.parent.left = null;
  } else {
    this.parent.right = null;
  }

  return true;
};


/**
 * Delete the current node if it has only one child
 * Return true if it was deleted
 */
BinarySearchTree.prototype.deleteIfOnlyOneChild = function () {
  var child;

  if (this.left && !this.right) { child = this.left; }
  if (!this.left && this.right) { child = this.right; }
  if (!child) { return false; }

  // Root
  if (!this.parent) {
    this.key = child.key;
    this.data = child.data;

    this.left = null;
    if (child.left) {
      this.left = child.left;
      child.left.parent = this;
    }

    this.right = null;
    if (child.right) {
      this.right = child.right;
      child.right.parent = this;
    }

    return true;
  }

  if (this.parent.left === this) {
    this.parent.left = child;
    child.parent = this.parent;
  } else {
    this.parent.right = child;
    child.parent = this.parent;
  }

  return true;
};


/**
 * Delete a key or just a value
 * @param {Key} key
 * @param {Value} value Optional. If not set, the whole key is deleted. If set, only this value is deleted
 */
BinarySearchTree.prototype.delete = function (key, value) {
  var newData = [], replaceWith
    , self = this
    ;

  if (!this.hasOwnProperty('key')) { return; }

  if (this.compareKeys(key, this.key) < 0) {
    if (this.left) { this.left.delete(key, value); }
    return;
  }

  if (this.compareKeys(key, this.key) > 0) {
    if (this.right) { this.right.delete(key, value); }
    return;
  }

  if (!this.compareKeys(key, this.key) === 0) { return; }

  // Delete only a value
  if (this.data.length > 1 && value !== undefined) {
    this.data.forEach(function (d) {
      if (!self.checkValueEquality(d, value)) { newData.push(d); }
    });
    self.data = newData;
    return;
  }

  // Delete the whole node
  if (this.deleteIfLeaf()) {
    return;
  }
  if (this.deleteIfOnlyOneChild()) {
    return;
  }

  // We are in the case where the node to delete has two children
  if (Math.random() >= 0.5) {   // Randomize replacement to avoid unbalancing the tree too much
    // Use the in-order predecessor
    replaceWith = this.left.getMaxKeyDescendant();

    this.key = replaceWith.key;
    this.data = replaceWith.data;

    if (this === replaceWith.parent) {   // Special case
      this.left = replaceWith.left;
      if (replaceWith.left) { replaceWith.left.parent = replaceWith.parent; }
    } else {
      replaceWith.parent.right = replaceWith.left;
      if (replaceWith.left) { replaceWith.left.parent = replaceWith.parent; }
    }
  } else {
    // Use the in-order successor
    replaceWith = this.right.getMinKeyDescendant();

    this.key = replaceWith.key;
    this.data = replaceWith.data;

    if (this === replaceWith.parent) {   // Special case
      this.right = replaceWith.right;
      if (replaceWith.right) { replaceWith.right.parent = replaceWith.parent; }
    } else {
      replaceWith.parent.left = replaceWith.right;
      if (replaceWith.right) { replaceWith.right.parent = replaceWith.parent; }
    }
  }
};


/**
 * Execute a function on every node of the tree, in key order
 * @param {Function} fn Signature: node. Most useful will probably be node.key and node.data
 */
BinarySearchTree.prototype.executeOnEveryNode = function (fn) {
  if (this.left) { this.left.executeOnEveryNode(fn); }
  fn(this);
  if (this.right) { this.right.executeOnEveryNode(fn); }
};


/**
 * Pretty print a tree
 * @param {Boolean} printData To print the nodes' data along with the key
 */
BinarySearchTree.prototype.prettyPrint = function (printData, spacing) {
  spacing = spacing || "";

  console.log(spacing + "* " + this.key);
  if (printData) { console.log(spacing + "* " + this.data); }

  if (!this.left && !this.right) { return; }

  if (this.left) {
    this.left.prettyPrint(printData, spacing + "  ");
  } else {
    console.log(spacing + "  *");
  }
  if (this.right) {
    this.right.prettyPrint(printData, spacing + "  ");
  } else {
    console.log(spacing + "  *");
  }
};




// Interface
module.exports = BinarySearchTree;

},{"./customUtils":17}],17:[function(require,module,exports){
/**
 * Return an array with the numbers from 0 to n-1, in a random order
 */
function getRandomArray (n) {
  var res, next;

  if (n === 0) { return []; }
  if (n === 1) { return [0]; }

  res = getRandomArray(n - 1);
  next = Math.floor(Math.random() * n);
  res.splice(next, 0, n - 1);   // Add n-1 at a random position in the array

  return res;
};
module.exports.getRandomArray = getRandomArray;


/*
 * Default compareKeys function will work for numbers, strings and dates
 */
function defaultCompareKeysFunction (a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }

  var err = new Error("Couldn't compare elements");
  err.a = a;
  err.b = b;
  throw err;
}
module.exports.defaultCompareKeysFunction = defaultCompareKeysFunction;


/**
 * Check whether two values are equal (used in non-unique deletion)
 */
function defaultCheckValueEquality (a, b) {
  return a === b;
}
module.exports.defaultCheckValueEquality = defaultCheckValueEquality;

},{}],18:[function(require,module,exports){
var process=require("__browserify_process"),global=self;/*!
    localForage -- Offline Storage, Improved
    Version 1.3.0
    https://mozilla.github.io/localForage
    (c) 2013-2015 Mozilla, Apache License 2.0
*/
(function() {
var define, requireModule, require, requirejs;

(function() {
  var registry = {}, seen = local;

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requirejs = require = requireModule = function(name) {
  requirejs._eak_seen = registry;

    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };
})();

define("promise/all",
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */

    var isArray = __dependency1__.isArray;
    var isFunction = __dependency1__.isFunction;

    /**
      Returns a promise that is fulfilled when all the given promises have been
      fulfilled, or rejected if any of them become rejected. The return promise
      is fulfilled with an array that gives all the values in the order they were
      passed in the `promises` array argument.

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `RSVP.all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @for RSVP
      @param {Array} promises
      @param {String} label
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
    */
    function all(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
      }

      return new Promise(function(resolve, reject) {
        var results = [], remaining = promises.length,
        promise;

        if (remaining === 0) {
          resolve([]);
        }

        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }

        function resolveAll(index, value) {
          results[index] = value;
          if (--remaining === 0) {
            resolve(results);
          }
        }

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && isFunction(promise.then)) {
            promise.then(resolver(i), reject);
          } else {
            resolveAll(i, promise);
          }
        }
      });
    }

    __exports__.all = all;
  });
define("promise/asap",
  ["exports"],
  function(__exports__) {
    "use strict";
    var browserGlobal = (typeof window !== 'undefined') ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

    // node
    function useNextTick() {
      return function() {
        process.nextTick(flush);
      };
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    function useSetTimeout() {
      return function() {
        local.setTimeout(flush, 1);
      };
    }

    var queue = [];
    function flush() {
      for (var i = 0; i < queue.length; i++) {
        var tuple = queue[i];
        var callback = tuple[0], arg = tuple[1];
        callback(arg);
      }
      queue = [];
    }

    var scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function asap(callback, arg) {
      var length = queue.push([callback, arg]);
      if (length === 1) {
        // If length is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        scheduleFlush();
      }
    }

    __exports__.asap = asap;
  });
define("promise/config",
  ["exports"],
  function(__exports__) {
    "use strict";
    var config = {
      instrument: false
    };

    function configure(name, value) {
      if (arguments.length === 2) {
        config[name] = value;
      } else {
        return config[name];
      }
    }

    __exports__.config = config;
    __exports__.configure = configure;
  });
define("promise/polyfill",
  ["./promise","./utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /*global self*/
    var RSVPPromise = __dependency1__.Promise;
    var isFunction = __dependency2__.isFunction;

    function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = RSVPPromise;
      }
    }

    __exports__.polyfill = polyfill;
  });
define("promise/promise",
  ["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var config = __dependency1__.config;
    var configure = __dependency1__.configure;
    var objectOrFunction = __dependency2__.objectOrFunction;
    var isFunction = __dependency2__.isFunction;
    var now = __dependency2__.now;
    var all = __dependency3__.all;
    var race = __dependency4__.race;
    var staticResolve = __dependency5__.resolve;
    var staticReject = __dependency6__.reject;
    var asap = __dependency7__.asap;

    var counter = 0;

    config.async = asap; // default async is asap;

    function Promise(resolver) {
      if (!isFunction(resolver)) {
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
      }

      if (!(this instanceof Promise)) {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }

      this._subscribers = [];

      invokeResolver(resolver, this);
    }

    function invokeResolver(resolver, promise) {
      function resolvePromise(value) {
        resolve(promise, value);
      }

      function rejectPromise(reason) {
        reject(promise, reason);
      }

      try {
        resolver(resolvePromise, rejectPromise);
      } catch(e) {
        rejectPromise(e);
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        try {
          value = callback(detail);
          succeeded = true;
        } catch(e) {
          failed = true;
          error = e;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (handleThenable(promise, value)) {
        return;
      } else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (settled === FULFILLED) {
        resolve(promise, value);
      } else if (settled === REJECTED) {
        reject(promise, value);
      }
    }

    var PENDING   = void 0;
    var SEALED    = 0;
    var FULFILLED = 1;
    var REJECTED  = 2;

    function subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      subscribers[length] = child;
      subscribers[length + FULFILLED] = onFulfillment;
      subscribers[length + REJECTED]  = onRejection;
    }

    function publish(promise, settled) {
      var child, callback, subscribers = promise._subscribers, detail = promise._detail;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        invokeCallback(settled, child, callback, detail);
      }

      promise._subscribers = null;
    }

    Promise.prototype = {
      constructor: Promise,

      _state: undefined,
      _detail: undefined,
      _subscribers: undefined,

      then: function(onFulfillment, onRejection) {
        var promise = this;

        var thenPromise = new this.constructor(function() {});

        if (this._state) {
          var callbacks = arguments;
          config.async(function invokePromiseCallback() {
            invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
          });
        } else {
          subscribe(this, thenPromise, onFulfillment, onRejection);
        }

        return thenPromise;
      },

      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = staticResolve;
    Promise.reject = staticReject;

    function handleThenable(promise, value) {
      var then = null,
      resolved;

      try {
        if (promise === value) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }

        if (objectOrFunction(value)) {
          then = value.then;

          if (isFunction(then)) {
            then.call(value, function(val) {
              if (resolved) { return true; }
              resolved = true;

              if (value !== val) {
                resolve(promise, val);
              } else {
                fulfill(promise, val);
              }
            }, function(val) {
              if (resolved) { return true; }
              resolved = true;

              reject(promise, val);
            });

            return true;
          }
        }
      } catch (error) {
        if (resolved) { return true; }
        reject(promise, error);
        return true;
      }

      return false;
    }

    function resolve(promise, value) {
      if (promise === value) {
        fulfill(promise, value);
      } else if (!handleThenable(promise, value)) {
        fulfill(promise, value);
      }
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = value;

      config.async(publishFulfillment, promise);
    }

    function reject(promise, reason) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = reason;

      config.async(publishRejection, promise);
    }

    function publishFulfillment(promise) {
      publish(promise, promise._state = FULFILLED);
    }

    function publishRejection(promise) {
      publish(promise, promise._state = REJECTED);
    }

    __exports__.Promise = Promise;
  });
define("promise/race",
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */
    var isArray = __dependency1__.isArray;

    /**
      `RSVP.race` allows you to watch a series of promises and act as soon as the
      first promise given to the `promises` argument fulfills or rejects.

      Example:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 2");
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // result === "promise 2" because it was resolved before promise1
        // was resolved.
      });
      ```

      `RSVP.race` is deterministic in that only the state of the first completed
      promise matters. For example, even if other promises given to the `promises`
      array argument are resolved, but the first completed promise has become
      rejected before the other promises became fulfilled, the returned promise
      will become rejected:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error("promise 2"));
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // Code here never runs because there are rejected promises!
      }, function(reason){
        // reason.message === "promise2" because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      @method race
      @for RSVP
      @param {Array} promises array of promises to observe
      @param {String} label optional string for describing the promise returned.
      Useful for tooling.
      @return {Promise} a promise that becomes fulfilled with the value the first
      completed promises is resolved with if the first completed promise was
      fulfilled, or rejected with the reason that the first completed promise
      was rejected with.
    */
    function race(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
      }
      return new Promise(function(resolve, reject) {
        var results = [], promise;

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && typeof promise.then === 'function') {
            promise.then(resolve, reject);
          } else {
            resolve(promise);
          }
        }
      });
    }

    __exports__.race = race;
  });
define("promise/reject",
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
      `RSVP.reject` returns a promise that will become rejected with the passed
      `reason`. `RSVP.reject` is essentially shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @for RSVP
      @param {Any} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become rejected with the given
      `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Promise = this;

      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    }

    __exports__.reject = reject;
  });
define("promise/resolve",
  ["exports"],
  function(__exports__) {
    "use strict";
    function resolve(value) {
      /*jshint validthis:true */
      if (value && typeof value === 'object' && value.constructor === this) {
        return value;
      }

      var Promise = this;

      return new Promise(function(resolve) {
        resolve(value);
      });
    }

    __exports__.resolve = resolve;
  });
define("promise/utils",
  ["exports"],
  function(__exports__) {
    "use strict";
    function objectOrFunction(x) {
      return isFunction(x) || (typeof x === "object" && x !== null);
    }

    function isFunction(x) {
      return typeof x === "function";
    }

    function isArray(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    }

    // Date.now is not available in browsers < IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
    var now = Date.now || function() { return new Date().getTime(); };


    __exports__.objectOrFunction = objectOrFunction;
    __exports__.isFunction = isFunction;
    __exports__.isArray = isArray;
    __exports__.now = now;
  });
requireModule('promise/polyfill').polyfill();
}());(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["localforage"] = factory();
	else
		root["localforage"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	(function () {
	    'use strict';

	    // Custom drivers are stored here when `defineDriver()` is called.
	    // They are shared across all instances of localForage.
	    var CustomDrivers = {};

	    var DriverType = {
	        INDEXEDDB: 'asyncStorage',
	        LOCALSTORAGE: 'localStorageWrapper',
	        WEBSQL: 'webSQLStorage'
	    };

	    var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];

	    var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];

	    var DefaultConfig = {
	        description: '',
	        driver: DefaultDriverOrder.slice(),
	        name: 'localforage',
	        // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
	        // we can use without a prompt.
	        size: 4980736,
	        storeName: 'keyvaluepairs',
	        version: 1.0
	    };

	    // Check to see if IndexedDB is available and if it is the latest
	    // implementation; it's our preferred backend library. We use "_spec_test"
	    // as the name of the database because it's not the one we'll operate on,
	    // but it's useful to make sure its using the right spec.
	    // See: https://github.com/mozilla/localForage/issues/128
	    var driverSupport = (function (self) {
	        // Initialize IndexedDB; fall back to vendor-prefixed versions
	        // if needed.
	        var indexedDB = indexedDB || self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB || self.OIndexedDB || self.msIndexedDB;

	        var result = {};

	        result[DriverType.WEBSQL] = !!self.openDatabase;
	        result[DriverType.INDEXEDDB] = !!(function () {
	            // We mimic PouchDB here; just UA test for Safari (which, as of
	            // iOS 8/Yosemite, doesn't properly support IndexedDB).
	            // IndexedDB support is broken and different from Blink's.
	            // This is faster than the test case (and it's sync), so we just
	            // do this. *SIGH*
	            // http://bl.ocks.org/nolanlawson/raw/c83e9039edf2278047e9/
	            //
	            // We test for openDatabase because IE Mobile identifies itself
	            // as Safari. Oh the lulz...
	            if (typeof self.openDatabase !== 'undefined' && self.navigator && self.navigator.userAgent && /Safari/.test(self.navigator.userAgent) && !/Chrome/.test(self.navigator.userAgent)) {
	                return false;
	            }
	            try {
	                return indexedDB && typeof indexedDB.open === 'function' &&
	                // Some Samsung/HTC Android 4.0-4.3 devices
	                // have older IndexedDB specs; if this isn't available
	                // their IndexedDB is too old for us to use.
	                // (Replaces the onupgradeneeded test.)
	                typeof self.IDBKeyRange !== 'undefined';
	            } catch (e) {
	                return false;
	            }
	        })();

	        result[DriverType.LOCALSTORAGE] = !!(function () {
	            try {
	                return self.localStorage && 'setItem' in self.localStorage && self.localStorage.setItem;
	            } catch (e) {
	                return false;
	            }
	        })();

	        return result;
	    })(this);

	    var isArray = Array.isArray || function (arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };

	    function callWhenReady(localForageInstance, libraryMethod) {
	        localForageInstance[libraryMethod] = function () {
	            var _args = arguments;
	            return localForageInstance.ready().then(function () {
	                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
	            });
	        };
	    }

	    function extend() {
	        for (var i = 1; i < arguments.length; i++) {
	            var arg = arguments[i];

	            if (arg) {
	                for (var key in arg) {
	                    if (arg.hasOwnProperty(key)) {
	                        if (isArray(arg[key])) {
	                            arguments[0][key] = arg[key].slice();
	                        } else {
	                            arguments[0][key] = arg[key];
	                        }
	                    }
	                }
	            }
	        }

	        return arguments[0];
	    }

	    function isLibraryDriver(driverName) {
	        for (var driver in DriverType) {
	            if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
	                return true;
	            }
	        }

	        return false;
	    }

	    var LocalForage = (function () {
	        function LocalForage(options) {
	            _classCallCheck(this, LocalForage);

	            this.INDEXEDDB = DriverType.INDEXEDDB;
	            this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
	            this.WEBSQL = DriverType.WEBSQL;

	            this._defaultConfig = extend({}, DefaultConfig);
	            this._config = extend({}, this._defaultConfig, options);
	            this._driverSet = null;
	            this._initDriver = null;
	            this._ready = false;
	            this._dbInfo = null;

	            this._wrapLibraryMethodsWithReady();
	            this.setDriver(this._config.driver);
	        }

	        // The actual localForage object that we expose as a module or via a
	        // global. It's extended by pulling in one of our other libraries.

	        // Set any config values for localForage; can be called anytime before
	        // the first API call (e.g. `getItem`, `setItem`).
	        // We loop through options so we don't overwrite existing config
	        // values.

	        LocalForage.prototype.config = function config(options) {
	            // If the options argument is an object, we use it to set values.
	            // Otherwise, we return either a specified config value or all
	            // config values.
	            if (typeof options === 'object') {
	                // If localforage is ready and fully initialized, we can't set
	                // any new configuration values. Instead, we return an error.
	                if (this._ready) {
	                    return new Error("Can't call config() after localforage " + 'has been used.');
	                }

	                for (var i in options) {
	                    if (i === 'storeName') {
	                        options[i] = options[i].replace(/\W/g, '_');
	                    }

	                    this._config[i] = options[i];
	                }

	                // after all config options are set and
	                // the driver option is used, try setting it
	                if ('driver' in options && options.driver) {
	                    this.setDriver(this._config.driver);
	                }

	                return true;
	            } else if (typeof options === 'string') {
	                return this._config[options];
	            } else {
	                return this._config;
	            }
	        };

	        // Used to define a custom driver, shared across all instances of
	        // localForage.

	        LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
	            var promise = new Promise(function (resolve, reject) {
	                try {
	                    var driverName = driverObject._driver;
	                    var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
	                    var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);

	                    // A driver name should be defined and not overlap with the
	                    // library-defined, default drivers.
	                    if (!driverObject._driver) {
	                        reject(complianceError);
	                        return;
	                    }
	                    if (isLibraryDriver(driverObject._driver)) {
	                        reject(namingError);
	                        return;
	                    }

	                    var customDriverMethods = LibraryMethods.concat('_initStorage');
	                    for (var i = 0; i < customDriverMethods.length; i++) {
	                        var customDriverMethod = customDriverMethods[i];
	                        if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
	                            reject(complianceError);
	                            return;
	                        }
	                    }

	                    var supportPromise = Promise.resolve(true);
	                    if ('_support' in driverObject) {
	                        if (driverObject._support && typeof driverObject._support === 'function') {
	                            supportPromise = driverObject._support();
	                        } else {
	                            supportPromise = Promise.resolve(!!driverObject._support);
	                        }
	                    }

	                    supportPromise.then(function (supportResult) {
	                        driverSupport[driverName] = supportResult;
	                        CustomDrivers[driverName] = driverObject;
	                        resolve();
	                    }, reject);
	                } catch (e) {
	                    reject(e);
	                }
	            });

	            promise.then(callback, errorCallback);
	            return promise;
	        };

	        LocalForage.prototype.driver = function driver() {
	            return this._driver || null;
	        };

	        LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
	            var self = this;
	            var getDriverPromise = (function () {
	                if (isLibraryDriver(driverName)) {
	                    switch (driverName) {
	                        case self.INDEXEDDB:
	                            return new Promise(function (resolve, reject) {
	                                resolve(__webpack_require__(1));
	                            });
	                        case self.LOCALSTORAGE:
	                            return new Promise(function (resolve, reject) {
	                                resolve(__webpack_require__(2));
	                            });
	                        case self.WEBSQL:
	                            return new Promise(function (resolve, reject) {
	                                resolve(__webpack_require__(4));
	                            });
	                    }
	                } else if (CustomDrivers[driverName]) {
	                    return Promise.resolve(CustomDrivers[driverName]);
	                }

	                return Promise.reject(new Error('Driver not found.'));
	            })();

	            getDriverPromise.then(callback, errorCallback);
	            return getDriverPromise;
	        };

	        LocalForage.prototype.getSerializer = function getSerializer(callback) {
	            var serializerPromise = new Promise(function (resolve, reject) {
	                resolve(__webpack_require__(3));
	            });
	            if (callback && typeof callback === 'function') {
	                serializerPromise.then(function (result) {
	                    callback(result);
	                });
	            }
	            return serializerPromise;
	        };

	        LocalForage.prototype.ready = function ready(callback) {
	            var self = this;

	            var promise = self._driverSet.then(function () {
	                if (self._ready === null) {
	                    self._ready = self._initDriver();
	                }

	                return self._ready;
	            });

	            promise.then(callback, callback);
	            return promise;
	        };

	        LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
	            var self = this;

	            if (!isArray(drivers)) {
	                drivers = [drivers];
	            }

	            var supportedDrivers = this._getSupportedDrivers(drivers);

	            function setDriverToConfig() {
	                self._config.driver = self.driver();
	            }

	            function initDriver(supportedDrivers) {
	                return function () {
	                    var currentDriverIndex = 0;

	                    function driverPromiseLoop() {
	                        while (currentDriverIndex < supportedDrivers.length) {
	                            var driverName = supportedDrivers[currentDriverIndex];
	                            currentDriverIndex++;

	                            self._dbInfo = null;
	                            self._ready = null;

	                            return self.getDriver(driverName).then(function (driver) {
	                                self._extend(driver);
	                                setDriverToConfig();

	                                self._ready = self._initStorage(self._config);
	                                return self._ready;
	                            })['catch'](driverPromiseLoop);
	                        }

	                        setDriverToConfig();
	                        var error = new Error('No available storage method found.');
	                        self._driverSet = Promise.reject(error);
	                        return self._driverSet;
	                    }

	                    return driverPromiseLoop();
	                };
	            }

	            // There might be a driver initialization in progress
	            // so wait for it to finish in order to avoid a possible
	            // race condition to set _dbInfo
	            var oldDriverSetDone = this._driverSet !== null ? this._driverSet['catch'](function () {
	                return Promise.resolve();
	            }) : Promise.resolve();

	            this._driverSet = oldDriverSetDone.then(function () {
	                var driverName = supportedDrivers[0];
	                self._dbInfo = null;
	                self._ready = null;

	                return self.getDriver(driverName).then(function (driver) {
	                    self._driver = driver._driver;
	                    setDriverToConfig();
	                    self._wrapLibraryMethodsWithReady();
	                    self._initDriver = initDriver(supportedDrivers);
	                });
	            })['catch'](function () {
	                setDriverToConfig();
	                var error = new Error('No available storage method found.');
	                self._driverSet = Promise.reject(error);
	                return self._driverSet;
	            });

	            this._driverSet.then(callback, errorCallback);
	            return this._driverSet;
	        };

	        LocalForage.prototype.supports = function supports(driverName) {
	            return !!driverSupport[driverName];
	        };

	        LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
	            extend(this, libraryMethodsAndProperties);
	        };

	        LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
	            var supportedDrivers = [];
	            for (var i = 0, len = drivers.length; i < len; i++) {
	                var driverName = drivers[i];
	                if (this.supports(driverName)) {
	                    supportedDrivers.push(driverName);
	                }
	            }
	            return supportedDrivers;
	        };

	        LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
	            // Add a stub for each driver API method that delays the call to the
	            // corresponding driver method until localForage is ready. These stubs
	            // will be replaced by the driver methods as soon as the driver is
	            // loaded, so there is no performance impact.
	            for (var i = 0; i < LibraryMethods.length; i++) {
	                callWhenReady(this, LibraryMethods[i]);
	            }
	        };

	        LocalForage.prototype.createInstance = function createInstance(options) {
	            return new LocalForage(options);
	        };

	        return LocalForage;
	    })();

	    var localForage = new LocalForage();

	    exports['default'] = localForage;
	}).call(typeof window !== 'undefined' ? window : self);
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	// Some code originally from async_storage.js in
	// [Gaia](https://github.com/mozilla-b2g/gaia).
	'use strict';

	exports.__esModule = true;
	(function () {
	    'use strict';

	    var globalObject = this;
	    // Initialize IndexedDB; fall back to vendor-prefixed versions if needed.
	    var indexedDB = indexedDB || this.indexedDB || this.webkitIndexedDB || this.mozIndexedDB || this.OIndexedDB || this.msIndexedDB;

	    // If IndexedDB isn't available, we get outta here!
	    if (!indexedDB) {
	        return;
	    }

	    var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
	    var supportsBlobs;
	    var dbContexts;

	    // Abstracts constructing a Blob object, so it also works in older
	    // browsers that don't support the native Blob constructor. (i.e.
	    // old QtWebKit versions, at least).
	    function _createBlob(parts, properties) {
	        parts = parts || [];
	        properties = properties || {};
	        try {
	            return new Blob(parts, properties);
	        } catch (e) {
	            if (e.name !== 'TypeError') {
	                throw e;
	            }
	            var BlobBuilder = globalObject.BlobBuilder || globalObject.MSBlobBuilder || globalObject.MozBlobBuilder || globalObject.WebKitBlobBuilder;
	            var builder = new BlobBuilder();
	            for (var i = 0; i < parts.length; i += 1) {
	                builder.append(parts[i]);
	            }
	            return builder.getBlob(properties.type);
	        }
	    }

	    // Transform a binary string to an array buffer, because otherwise
	    // weird stuff happens when you try to work with the binary string directly.
	    // It is known.
	    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
	    // encode-decode-image-with-base64-breaks-image (2013-04-21)
	    function _binStringToArrayBuffer(bin) {
	        var length = bin.length;
	        var buf = new ArrayBuffer(length);
	        var arr = new Uint8Array(buf);
	        for (var i = 0; i < length; i++) {
	            arr[i] = bin.charCodeAt(i);
	        }
	        return buf;
	    }

	    // Fetch a blob using ajax. This reveals bugs in Chrome < 43.
	    // For details on all this junk:
	    // https://github.com/nolanlawson/state-of-binary-data-in-the-browser#readme
	    function _blobAjax(url) {
	        return new Promise(function (resolve, reject) {
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', url);
	            xhr.withCredentials = true;
	            xhr.responseType = 'arraybuffer';

	            xhr.onreadystatechange = function () {
	                if (xhr.readyState !== 4) {
	                    return;
	                }
	                if (xhr.status === 200) {
	                    return resolve({
	                        response: xhr.response,
	                        type: xhr.getResponseHeader('Content-Type')
	                    });
	                }
	                reject({ status: xhr.status, response: xhr.response });
	            };
	            xhr.send();
	        });
	    }

	    //
	    // Detect blob support. Chrome didn't support it until version 38.
	    // In version 37 they had a broken version where PNGs (and possibly
	    // other binary types) aren't stored correctly, because when you fetch
	    // them, the content type is always null.
	    //
	    // Furthermore, they have some outstanding bugs where blobs occasionally
	    // are read by FileReader as null, or by ajax as 404s.
	    //
	    // Sadly we use the 404 bug to detect the FileReader bug, so if they
	    // get fixed independently and released in different versions of Chrome,
	    // then the bug could come back. So it's worthwhile to watch these issues:
	    // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
	    // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
	    //
	    function _checkBlobSupportWithoutCaching(idb) {
	        return new Promise(function (resolve, reject) {
	            var blob = _createBlob([''], { type: 'image/png' });
	            var txn = idb.transaction([DETECT_BLOB_SUPPORT_STORE], 'readwrite');
	            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');
	            txn.oncomplete = function () {
	                // have to do it in a separate transaction, else the correct
	                // content type is always returned
	                var blobTxn = idb.transaction([DETECT_BLOB_SUPPORT_STORE], 'readwrite');
	                var getBlobReq = blobTxn.objectStore(DETECT_BLOB_SUPPORT_STORE).get('key');
	                getBlobReq.onerror = reject;
	                getBlobReq.onsuccess = function (e) {

	                    var storedBlob = e.target.result;
	                    var url = URL.createObjectURL(storedBlob);

	                    _blobAjax(url).then(function (res) {
	                        resolve(!!(res && res.type === 'image/png'));
	                    }, function () {
	                        resolve(false);
	                    }).then(function () {
	                        URL.revokeObjectURL(url);
	                    });
	                };
	            };
	        })['catch'](function () {
	            return false; // error, so assume unsupported
	        });
	    }

	    function _checkBlobSupport(idb) {
	        if (typeof supportsBlobs === 'boolean') {
	            return Promise.resolve(supportsBlobs);
	        }
	        return _checkBlobSupportWithoutCaching(idb).then(function (value) {
	            supportsBlobs = value;
	            return supportsBlobs;
	        });
	    }

	    // encode a blob for indexeddb engines that don't support blobs
	    function _encodeBlob(blob) {
	        return new Promise(function (resolve, reject) {
	            var reader = new FileReader();
	            reader.onerror = reject;
	            reader.onloadend = function (e) {
	                var base64 = btoa(e.target.result || '');
	                resolve({
	                    __local_forage_encoded_blob: true,
	                    data: base64,
	                    type: blob.type
	                });
	            };
	            reader.readAsBinaryString(blob);
	        });
	    }

	    // decode an encoded blob
	    function _decodeBlob(encodedBlob) {
	        var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
	        return _createBlob([arrayBuff], { type: encodedBlob.type });
	    }

	    // is this one of our fancy encoded blobs?
	    function _isEncodedBlob(value) {
	        return value && value.__local_forage_encoded_blob;
	    }

	    // Open the IndexedDB database (automatically creates one if one didn't
	    // previously exist), using any options set in the config.
	    function _initStorage(options) {
	        var self = this;
	        var dbInfo = {
	            db: null
	        };

	        if (options) {
	            for (var i in options) {
	                dbInfo[i] = options[i];
	            }
	        }

	        // Initialize a singleton container for all running localForages.
	        if (!dbContexts) {
	            dbContexts = {};
	        }

	        // Get the current context of the database;
	        var dbContext = dbContexts[dbInfo.name];

	        // ...or create a new context.
	        if (!dbContext) {
	            dbContext = {
	                // Running localForages sharing a database.
	                forages: [],
	                // Shared database.
	                db: null
	            };
	            // Register the new context in the global container.
	            dbContexts[dbInfo.name] = dbContext;
	        }

	        // Register itself as a running localForage in the current context.
	        dbContext.forages.push(this);

	        // Create an array of readiness of the related localForages.
	        var readyPromises = [];

	        function ignoreErrors() {
	            // Don't handle errors here,
	            // just makes sure related localForages aren't pending.
	            return Promise.resolve();
	        }

	        for (var j = 0; j < dbContext.forages.length; j++) {
	            var forage = dbContext.forages[j];
	            if (forage !== this) {
	                // Don't wait for itself...
	                readyPromises.push(forage.ready()['catch'](ignoreErrors));
	            }
	        }

	        // Take a snapshot of the related localForages.
	        var forages = dbContext.forages.slice(0);

	        // Initialize the connection process only when
	        // all the related localForages aren't pending.
	        return Promise.all(readyPromises).then(function () {
	            dbInfo.db = dbContext.db;
	            // Get the connection or open a new one without upgrade.
	            return _getOriginalConnection(dbInfo);
	        }).then(function (db) {
	            dbInfo.db = db;
	            if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
	                // Reopen the database for upgrading.
	                return _getUpgradedConnection(dbInfo);
	            }
	            return db;
	        }).then(function (db) {
	            dbInfo.db = dbContext.db = db;
	            self._dbInfo = dbInfo;
	            // Share the final connection amongst related localForages.
	            for (var k in forages) {
	                var forage = forages[k];
	                if (forage !== self) {
	                    // Self is already up-to-date.
	                    forage._dbInfo.db = dbInfo.db;
	                    forage._dbInfo.version = dbInfo.version;
	                }
	            }
	        });
	    }

	    function _getOriginalConnection(dbInfo) {
	        return _getConnection(dbInfo, false);
	    }

	    function _getUpgradedConnection(dbInfo) {
	        return _getConnection(dbInfo, true);
	    }

	    function _getConnection(dbInfo, upgradeNeeded) {
	        return new Promise(function (resolve, reject) {
	            if (dbInfo.db) {
	                if (upgradeNeeded) {
	                    dbInfo.db.close();
	                } else {
	                    return resolve(dbInfo.db);
	                }
	            }

	            var dbArgs = [dbInfo.name];

	            if (upgradeNeeded) {
	                dbArgs.push(dbInfo.version);
	            }

	            var openreq = indexedDB.open.apply(indexedDB, dbArgs);

	            if (upgradeNeeded) {
	                openreq.onupgradeneeded = function (e) {
	                    var db = openreq.result;
	                    try {
	                        db.createObjectStore(dbInfo.storeName);
	                        if (e.oldVersion <= 1) {
	                            // Added when support for blob shims was added
	                            db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
	                        }
	                    } catch (ex) {
	                        if (ex.name === 'ConstraintError') {
	                            globalObject.console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
	                        } else {
	                            throw ex;
	                        }
	                    }
	                };
	            }

	            openreq.onerror = function () {
	                reject(openreq.error);
	            };

	            openreq.onsuccess = function () {
	                resolve(openreq.result);
	            };
	        });
	    }

	    function _isUpgradeNeeded(dbInfo, defaultVersion) {
	        if (!dbInfo.db) {
	            return true;
	        }

	        var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
	        var isDowngrade = dbInfo.version < dbInfo.db.version;
	        var isUpgrade = dbInfo.version > dbInfo.db.version;

	        if (isDowngrade) {
	            // If the version is not the default one
	            // then warn for impossible downgrade.
	            if (dbInfo.version !== defaultVersion) {
	                globalObject.console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
	            }
	            // Align the versions to prevent errors.
	            dbInfo.version = dbInfo.db.version;
	        }

	        if (isUpgrade || isNewStore) {
	            // If the store is new then increment the version (if needed).
	            // This will trigger an "upgradeneeded" event which is required
	            // for creating a store.
	            if (isNewStore) {
	                var incVersion = dbInfo.db.version + 1;
	                if (incVersion > dbInfo.version) {
	                    dbInfo.version = incVersion;
	                }
	            }

	            return true;
	        }

	        return false;
	    }

	    function getItem(key, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	                var req = store.get(key);

	                req.onsuccess = function () {
	                    var value = req.result;
	                    if (value === undefined) {
	                        value = null;
	                    }
	                    if (_isEncodedBlob(value)) {
	                        value = _decodeBlob(value);
	                    }
	                    resolve(value);
	                };

	                req.onerror = function () {
	                    reject(req.error);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Iterate over all items stored in database.
	    function iterate(iterator, callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

	                var req = store.openCursor();
	                var iterationNumber = 1;

	                req.onsuccess = function () {
	                    var cursor = req.result;

	                    if (cursor) {
	                        var value = cursor.value;
	                        if (_isEncodedBlob(value)) {
	                            value = _decodeBlob(value);
	                        }
	                        var result = iterator(value, cursor.key, iterationNumber++);

	                        if (result !== void 0) {
	                            resolve(result);
	                        } else {
	                            cursor['continue']();
	                        }
	                    } else {
	                        resolve();
	                    }
	                };

	                req.onerror = function () {
	                    reject(req.error);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);

	        return promise;
	    }

	    function setItem(key, value, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = new Promise(function (resolve, reject) {
	            var dbInfo;
	            self.ready().then(function () {
	                dbInfo = self._dbInfo;
	                return _checkBlobSupport(dbInfo.db);
	            }).then(function (blobSupport) {
	                if (!blobSupport && value instanceof Blob) {
	                    return _encodeBlob(value);
	                }
	                return value;
	            }).then(function (value) {
	                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	                var store = transaction.objectStore(dbInfo.storeName);

	                // The reason we don't _save_ null is because IE 10 does
	                // not support saving the `null` type in IndexedDB. How
	                // ironic, given the bug below!
	                // See: https://github.com/mozilla/localForage/issues/161
	                if (value === null) {
	                    value = undefined;
	                }

	                var req = store.put(value, key);
	                transaction.oncomplete = function () {
	                    // Cast to undefined so the value passed to
	                    // callback/promise is the same as what one would get out
	                    // of `getItem()` later. This leads to some weirdness
	                    // (setItem('foo', undefined) will return `null`), but
	                    // it's not my fault localStorage is our baseline and that
	                    // it's weird.
	                    if (value === undefined) {
	                        value = null;
	                    }

	                    resolve(value);
	                };
	                transaction.onabort = transaction.onerror = function () {
	                    var err = req.error ? req.error : req.transaction.error;
	                    reject(err);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function removeItem(key, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	                var store = transaction.objectStore(dbInfo.storeName);

	                // We use a Grunt task to make this safe for IE and some
	                // versions of Android (including those used by Cordova).
	                // Normally IE won't like `.delete()` and will insist on
	                // using `['delete']()`, but we have a build step that
	                // fixes this for us now.
	                var req = store['delete'](key);
	                transaction.oncomplete = function () {
	                    resolve();
	                };

	                transaction.onerror = function () {
	                    reject(req.error);
	                };

	                // The request will be also be aborted if we've exceeded our storage
	                // space.
	                transaction.onabort = function () {
	                    var err = req.error ? req.error : req.transaction.error;
	                    reject(err);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function clear(callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                var transaction = dbInfo.db.transaction(dbInfo.storeName, 'readwrite');
	                var store = transaction.objectStore(dbInfo.storeName);
	                var req = store.clear();

	                transaction.oncomplete = function () {
	                    resolve();
	                };

	                transaction.onabort = transaction.onerror = function () {
	                    var err = req.error ? req.error : req.transaction.error;
	                    reject(err);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function length(callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);
	                var req = store.count();

	                req.onsuccess = function () {
	                    resolve(req.result);
	                };

	                req.onerror = function () {
	                    reject(req.error);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function key(n, callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            if (n < 0) {
	                resolve(null);

	                return;
	            }

	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

	                var advanced = false;
	                var req = store.openCursor();
	                req.onsuccess = function () {
	                    var cursor = req.result;
	                    if (!cursor) {
	                        // this means there weren't enough keys
	                        resolve(null);

	                        return;
	                    }

	                    if (n === 0) {
	                        // We have the first key, return it if that's what they
	                        // wanted.
	                        resolve(cursor.key);
	                    } else {
	                        if (!advanced) {
	                            // Otherwise, ask the cursor to skip ahead n
	                            // records.
	                            advanced = true;
	                            cursor.advance(n);
	                        } else {
	                            // When we get here, we've got the nth key.
	                            resolve(cursor.key);
	                        }
	                    }
	                };

	                req.onerror = function () {
	                    reject(req.error);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function keys(callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                var store = dbInfo.db.transaction(dbInfo.storeName, 'readonly').objectStore(dbInfo.storeName);

	                var req = store.openCursor();
	                var keys = [];

	                req.onsuccess = function () {
	                    var cursor = req.result;

	                    if (!cursor) {
	                        resolve(keys);
	                        return;
	                    }

	                    keys.push(cursor.key);
	                    cursor['continue']();
	                };

	                req.onerror = function () {
	                    reject(req.error);
	                };
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function executeCallback(promise, callback) {
	        if (callback) {
	            promise.then(function (result) {
	                callback(null, result);
	            }, function (error) {
	                callback(error);
	            });
	        }
	    }

	    var asyncStorage = {
	        _driver: 'asyncStorage',
	        _initStorage: _initStorage,
	        iterate: iterate,
	        getItem: getItem,
	        setItem: setItem,
	        removeItem: removeItem,
	        clear: clear,
	        length: length,
	        key: key,
	        keys: keys
	    };

	    exports['default'] = asyncStorage;
	}).call(typeof window !== 'undefined' ? window : self);
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// If IndexedDB isn't available, we'll fall back to localStorage.
	// Note that this will have considerable performance and storage
	// side-effects (all data will be serialized on save and only data that
	// can be converted to a string via `JSON.stringify()` will be saved).
	'use strict';

	exports.__esModule = true;
	(function () {
	    'use strict';

	    var globalObject = this;
	    var localStorage = null;

	    // If the app is running inside a Google Chrome packaged webapp, or some
	    // other context where localStorage isn't available, we don't use
	    // localStorage. This feature detection is preferred over the old
	    // `if (window.chrome && window.chrome.runtime)` code.
	    // See: https://github.com/mozilla/localForage/issues/68
	    try {
	        // If localStorage isn't available, we get outta here!
	        // This should be inside a try catch
	        if (!this.localStorage || !('setItem' in this.localStorage)) {
	            return;
	        }
	        // Initialize localStorage and create a variable to use throughout
	        // the code.
	        localStorage = this.localStorage;
	    } catch (e) {
	        return;
	    }

	    // Config the localStorage backend, using options set in the config.
	    function _initStorage(options) {
	        var self = this;
	        var dbInfo = {};
	        if (options) {
	            for (var i in options) {
	                dbInfo[i] = options[i];
	            }
	        }

	        dbInfo.keyPrefix = dbInfo.name + '/';

	        if (dbInfo.storeName !== self._defaultConfig.storeName) {
	            dbInfo.keyPrefix += dbInfo.storeName + '/';
	        }

	        self._dbInfo = dbInfo;

	        return new Promise(function (resolve, reject) {
	            resolve(__webpack_require__(3));
	        }).then(function (lib) {
	            dbInfo.serializer = lib;
	            return Promise.resolve();
	        });
	    }

	    // Remove all keys from the datastore, effectively destroying all data in
	    // the app's key/value store!
	    function clear(callback) {
	        var self = this;
	        var promise = self.ready().then(function () {
	            var keyPrefix = self._dbInfo.keyPrefix;

	            for (var i = localStorage.length - 1; i >= 0; i--) {
	                var key = localStorage.key(i);

	                if (key.indexOf(keyPrefix) === 0) {
	                    localStorage.removeItem(key);
	                }
	            }
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Retrieve an item from the store. Unlike the original async_storage
	    // library in Gaia, we don't modify return values at all. If a key's value
	    // is `undefined`, we pass that value to the callback function.
	    function getItem(key, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var result = localStorage.getItem(dbInfo.keyPrefix + key);

	            // If a result was found, parse it from the serialized
	            // string into a JS object. If result isn't truthy, the key
	            // is likely undefined and we'll pass it straight to the
	            // callback.
	            if (result) {
	                result = dbInfo.serializer.deserialize(result);
	            }

	            return result;
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Iterate over all items in the store.
	    function iterate(iterator, callback) {
	        var self = this;

	        var promise = self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var keyPrefix = dbInfo.keyPrefix;
	            var keyPrefixLength = keyPrefix.length;
	            var length = localStorage.length;

	            // We use a dedicated iterator instead of the `i` variable below
	            // so other keys we fetch in localStorage aren't counted in
	            // the `iterationNumber` argument passed to the `iterate()`
	            // callback.
	            //
	            // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
	            var iterationNumber = 1;

	            for (var i = 0; i < length; i++) {
	                var key = localStorage.key(i);
	                if (key.indexOf(keyPrefix) !== 0) {
	                    continue;
	                }
	                var value = localStorage.getItem(key);

	                // If a result was found, parse it from the serialized
	                // string into a JS object. If result isn't truthy, the
	                // key is likely undefined and we'll pass it straight
	                // to the iterator.
	                if (value) {
	                    value = dbInfo.serializer.deserialize(value);
	                }

	                value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

	                if (value !== void 0) {
	                    return value;
	                }
	            }
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Same as localStorage's key() method, except takes a callback.
	    function key(n, callback) {
	        var self = this;
	        var promise = self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var result;
	            try {
	                result = localStorage.key(n);
	            } catch (error) {
	                result = null;
	            }

	            // Remove the prefix from the key, if a key is found.
	            if (result) {
	                result = result.substring(dbInfo.keyPrefix.length);
	            }

	            return result;
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function keys(callback) {
	        var self = this;
	        var promise = self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            var length = localStorage.length;
	            var keys = [];

	            for (var i = 0; i < length; i++) {
	                if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
	                    keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
	                }
	            }

	            return keys;
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Supply the number of keys in the datastore to the callback function.
	    function length(callback) {
	        var self = this;
	        var promise = self.keys().then(function (keys) {
	            return keys.length;
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Remove an item from the store, nice and simple.
	    function removeItem(key, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            localStorage.removeItem(dbInfo.keyPrefix + key);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Set a key's value and run an optional callback once the value is set.
	    // Unlike Gaia's implementation, the callback function is passed the value,
	    // in case you want to operate on that value only after you're sure it
	    // saved, or something like that.
	    function setItem(key, value, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = self.ready().then(function () {
	            // Convert undefined values to null.
	            // https://github.com/mozilla/localForage/pull/42
	            if (value === undefined) {
	                value = null;
	            }

	            // Save the original value to pass to the callback.
	            var originalValue = value;

	            return new Promise(function (resolve, reject) {
	                var dbInfo = self._dbInfo;
	                dbInfo.serializer.serialize(value, function (value, error) {
	                    if (error) {
	                        reject(error);
	                    } else {
	                        try {
	                            localStorage.setItem(dbInfo.keyPrefix + key, value);
	                            resolve(originalValue);
	                        } catch (e) {
	                            // localStorage capacity exceeded.
	                            // TODO: Make this a specific error/event.
	                            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
	                                reject(e);
	                            }
	                            reject(e);
	                        }
	                    }
	                });
	            });
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function executeCallback(promise, callback) {
	        if (callback) {
	            promise.then(function (result) {
	                callback(null, result);
	            }, function (error) {
	                callback(error);
	            });
	        }
	    }

	    var localStorageWrapper = {
	        _driver: 'localStorageWrapper',
	        _initStorage: _initStorage,
	        // Default API, from Gaia/localStorage.
	        iterate: iterate,
	        getItem: getItem,
	        setItem: setItem,
	        removeItem: removeItem,
	        clear: clear,
	        length: length,
	        key: key,
	        keys: keys
	    };

	    exports['default'] = localStorageWrapper;
	}).call(typeof window !== 'undefined' ? window : self);
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	(function () {
	    'use strict';

	    // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
	    // it to Base64, so this is how we store it to prevent very strange errors with less
	    // verbose ways of binary <-> string data storage.
	    var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	    var BLOB_TYPE_PREFIX = '~~local_forage_type~';
	    var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

	    var SERIALIZED_MARKER = '__lfsc__:';
	    var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

	    // OMG the serializations!
	    var TYPE_ARRAYBUFFER = 'arbf';
	    var TYPE_BLOB = 'blob';
	    var TYPE_INT8ARRAY = 'si08';
	    var TYPE_UINT8ARRAY = 'ui08';
	    var TYPE_UINT8CLAMPEDARRAY = 'uic8';
	    var TYPE_INT16ARRAY = 'si16';
	    var TYPE_INT32ARRAY = 'si32';
	    var TYPE_UINT16ARRAY = 'ur16';
	    var TYPE_UINT32ARRAY = 'ui32';
	    var TYPE_FLOAT32ARRAY = 'fl32';
	    var TYPE_FLOAT64ARRAY = 'fl64';
	    var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

	    // Get out of our habit of using `window` inline, at least.
	    var globalObject = this;

	    // Abstracts constructing a Blob object, so it also works in older
	    // browsers that don't support the native Blob constructor. (i.e.
	    // old QtWebKit versions, at least).
	    function _createBlob(parts, properties) {
	        parts = parts || [];
	        properties = properties || {};

	        try {
	            return new Blob(parts, properties);
	        } catch (err) {
	            if (err.name !== 'TypeError') {
	                throw err;
	            }

	            var BlobBuilder = globalObject.BlobBuilder || globalObject.MSBlobBuilder || globalObject.MozBlobBuilder || globalObject.WebKitBlobBuilder;

	            var builder = new BlobBuilder();
	            for (var i = 0; i < parts.length; i += 1) {
	                builder.append(parts[i]);
	            }

	            return builder.getBlob(properties.type);
	        }
	    }

	    // Serialize a value, afterwards executing a callback (which usually
	    // instructs the `setItem()` callback/promise to be executed). This is how
	    // we store binary data with localStorage.
	    function serialize(value, callback) {
	        var valueString = '';
	        if (value) {
	            valueString = value.toString();
	        }

	        // Cannot use `value instanceof ArrayBuffer` or such here, as these
	        // checks fail when running the tests using casper.js...
	        //
	        // TODO: See why those tests fail and use a better solution.
	        if (value && (value.toString() === '[object ArrayBuffer]' || value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
	            // Convert binary arrays to a string and prefix the string with
	            // a special marker.
	            var buffer;
	            var marker = SERIALIZED_MARKER;

	            if (value instanceof ArrayBuffer) {
	                buffer = value;
	                marker += TYPE_ARRAYBUFFER;
	            } else {
	                buffer = value.buffer;

	                if (valueString === '[object Int8Array]') {
	                    marker += TYPE_INT8ARRAY;
	                } else if (valueString === '[object Uint8Array]') {
	                    marker += TYPE_UINT8ARRAY;
	                } else if (valueString === '[object Uint8ClampedArray]') {
	                    marker += TYPE_UINT8CLAMPEDARRAY;
	                } else if (valueString === '[object Int16Array]') {
	                    marker += TYPE_INT16ARRAY;
	                } else if (valueString === '[object Uint16Array]') {
	                    marker += TYPE_UINT16ARRAY;
	                } else if (valueString === '[object Int32Array]') {
	                    marker += TYPE_INT32ARRAY;
	                } else if (valueString === '[object Uint32Array]') {
	                    marker += TYPE_UINT32ARRAY;
	                } else if (valueString === '[object Float32Array]') {
	                    marker += TYPE_FLOAT32ARRAY;
	                } else if (valueString === '[object Float64Array]') {
	                    marker += TYPE_FLOAT64ARRAY;
	                } else {
	                    callback(new Error('Failed to get type for BinaryArray'));
	                }
	            }

	            callback(marker + bufferToString(buffer));
	        } else if (valueString === '[object Blob]') {
	            // Conver the blob to a binaryArray and then to a string.
	            var fileReader = new FileReader();

	            fileReader.onload = function () {
	                // Backwards-compatible prefix for the blob type.
	                var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

	                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
	            };

	            fileReader.readAsArrayBuffer(value);
	        } else {
	            try {
	                callback(JSON.stringify(value));
	            } catch (e) {
	                console.error("Couldn't convert value into a JSON string: ", value);

	                callback(null, e);
	            }
	        }
	    }

	    // Deserialize data we've inserted into a value column/field. We place
	    // special markers into our strings to mark them as encoded; this isn't
	    // as nice as a meta field, but it's the only sane thing we can do whilst
	    // keeping localStorage support intact.
	    //
	    // Oftentimes this will just deserialize JSON content, but if we have a
	    // special marker (SERIALIZED_MARKER, defined above), we will extract
	    // some kind of arraybuffer/binary data/typed array out of the string.
	    function deserialize(value) {
	        // If we haven't marked this string as being specially serialized (i.e.
	        // something other than serialized JSON), we can just return it and be
	        // done with it.
	        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
	            return JSON.parse(value);
	        }

	        // The following code deals with deserializing some kind of Blob or
	        // TypedArray. First we separate out the type of data we're dealing
	        // with from the data itself.
	        var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
	        var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

	        var blobType;
	        // Backwards-compatible blob type serialization strategy.
	        // DBs created with older versions of localForage will simply not have the blob type.
	        if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
	            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
	            blobType = matcher[1];
	            serializedString = serializedString.substring(matcher[0].length);
	        }
	        var buffer = stringToBuffer(serializedString);

	        // Return the right type based on the code/type set during
	        // serialization.
	        switch (type) {
	            case TYPE_ARRAYBUFFER:
	                return buffer;
	            case TYPE_BLOB:
	                return _createBlob([buffer], { type: blobType });
	            case TYPE_INT8ARRAY:
	                return new Int8Array(buffer);
	            case TYPE_UINT8ARRAY:
	                return new Uint8Array(buffer);
	            case TYPE_UINT8CLAMPEDARRAY:
	                return new Uint8ClampedArray(buffer);
	            case TYPE_INT16ARRAY:
	                return new Int16Array(buffer);
	            case TYPE_UINT16ARRAY:
	                return new Uint16Array(buffer);
	            case TYPE_INT32ARRAY:
	                return new Int32Array(buffer);
	            case TYPE_UINT32ARRAY:
	                return new Uint32Array(buffer);
	            case TYPE_FLOAT32ARRAY:
	                return new Float32Array(buffer);
	            case TYPE_FLOAT64ARRAY:
	                return new Float64Array(buffer);
	            default:
	                throw new Error('Unkown type: ' + type);
	        }
	    }

	    function stringToBuffer(serializedString) {
	        // Fill the string into a ArrayBuffer.
	        var bufferLength = serializedString.length * 0.75;
	        var len = serializedString.length;
	        var i;
	        var p = 0;
	        var encoded1, encoded2, encoded3, encoded4;

	        if (serializedString[serializedString.length - 1] === '=') {
	            bufferLength--;
	            if (serializedString[serializedString.length - 2] === '=') {
	                bufferLength--;
	            }
	        }

	        var buffer = new ArrayBuffer(bufferLength);
	        var bytes = new Uint8Array(buffer);

	        for (i = 0; i < len; i += 4) {
	            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
	            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
	            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
	            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

	            /*jslint bitwise: true */
	            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
	            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
	            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	        }
	        return buffer;
	    }

	    // Converts a buffer to a string to store, serialized, in the backend
	    // storage library.
	    function bufferToString(buffer) {
	        // base64-arraybuffer
	        var bytes = new Uint8Array(buffer);
	        var base64String = '';
	        var i;

	        for (i = 0; i < bytes.length; i += 3) {
	            /*jslint bitwise: true */
	            base64String += BASE_CHARS[bytes[i] >> 2];
	            base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
	            base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
	            base64String += BASE_CHARS[bytes[i + 2] & 63];
	        }

	        if (bytes.length % 3 === 2) {
	            base64String = base64String.substring(0, base64String.length - 1) + '=';
	        } else if (bytes.length % 3 === 1) {
	            base64String = base64String.substring(0, base64String.length - 2) + '==';
	        }

	        return base64String;
	    }

	    var localforageSerializer = {
	        serialize: serialize,
	        deserialize: deserialize,
	        stringToBuffer: stringToBuffer,
	        bufferToString: bufferToString
	    };

	    exports['default'] = localforageSerializer;
	}).call(typeof window !== 'undefined' ? window : self);
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Includes code from:
	 *
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */
	'use strict';

	exports.__esModule = true;
	(function () {
	    'use strict';

	    var globalObject = this;
	    var openDatabase = this.openDatabase;

	    // If WebSQL methods aren't available, we can stop now.
	    if (!openDatabase) {
	        return;
	    }

	    // Open the WebSQL database (automatically creates one if one didn't
	    // previously exist), using any options set in the config.
	    function _initStorage(options) {
	        var self = this;
	        var dbInfo = {
	            db: null
	        };

	        if (options) {
	            for (var i in options) {
	                dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
	            }
	        }

	        var dbInfoPromise = new Promise(function (resolve, reject) {
	            // Open the database; the openDatabase API will automatically
	            // create it for us if it doesn't exist.
	            try {
	                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
	            } catch (e) {
	                return self.setDriver(self.LOCALSTORAGE).then(function () {
	                    return self._initStorage(options);
	                }).then(resolve)['catch'](reject);
	            }

	            // Create our key/value table if it doesn't exist.
	            dbInfo.db.transaction(function (t) {
	                t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
	                    self._dbInfo = dbInfo;
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        });

	        return new Promise(function (resolve, reject) {
	            resolve(__webpack_require__(3));
	        }).then(function (lib) {
	            dbInfo.serializer = lib;
	            return dbInfoPromise;
	        });
	    }

	    function getItem(key, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                dbInfo.db.transaction(function (t) {
	                    t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
	                        var result = results.rows.length ? results.rows.item(0).value : null;

	                        // Check to see if this is serialized content we need to
	                        // unpack.
	                        if (result) {
	                            result = dbInfo.serializer.deserialize(result);
	                        }

	                        resolve(result);
	                    }, function (t, error) {

	                        reject(error);
	                    });
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function iterate(iterator, callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;

	                dbInfo.db.transaction(function (t) {
	                    t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
	                        var rows = results.rows;
	                        var length = rows.length;

	                        for (var i = 0; i < length; i++) {
	                            var item = rows.item(i);
	                            var result = item.value;

	                            // Check to see if this is serialized content
	                            // we need to unpack.
	                            if (result) {
	                                result = dbInfo.serializer.deserialize(result);
	                            }

	                            result = iterator(result, item.key, i + 1);

	                            // void(0) prevents problems with redefinition
	                            // of `undefined`.
	                            if (result !== void 0) {
	                                resolve(result);
	                                return;
	                            }
	                        }

	                        resolve();
	                    }, function (t, error) {
	                        reject(error);
	                    });
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function setItem(key, value, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                // The localStorage API doesn't return undefined values in an
	                // "expected" way, so undefined is always cast to null in all
	                // drivers. See: https://github.com/mozilla/localForage/pull/42
	                if (value === undefined) {
	                    value = null;
	                }

	                // Save the original value to pass to the callback.
	                var originalValue = value;

	                var dbInfo = self._dbInfo;
	                dbInfo.serializer.serialize(value, function (value, error) {
	                    if (error) {
	                        reject(error);
	                    } else {
	                        dbInfo.db.transaction(function (t) {
	                            t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
	                                resolve(originalValue);
	                            }, function (t, error) {
	                                reject(error);
	                            });
	                        }, function (sqlError) {
	                            // The transaction failed; check
	                            // to see if it's a quota error.
	                            if (sqlError.code === sqlError.QUOTA_ERR) {
	                                // We reject the callback outright for now, but
	                                // it's worth trying to re-run the transaction.
	                                // Even if the user accepts the prompt to use
	                                // more storage on Safari, this error will
	                                // be called.
	                                //
	                                // TODO: Try to re-run the transaction.
	                                reject(sqlError);
	                            }
	                        });
	                    }
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function removeItem(key, callback) {
	        var self = this;

	        // Cast the key to a string, as that's all we can set as a key.
	        if (typeof key !== 'string') {
	            globalObject.console.warn(key + ' used as a key, but it is not a string.');
	            key = String(key);
	        }

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                dbInfo.db.transaction(function (t) {
	                    t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
	                        resolve();
	                    }, function (t, error) {

	                        reject(error);
	                    });
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Deletes every item in the table.
	    // TODO: Find out if this resets the AUTO_INCREMENT number.
	    function clear(callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                dbInfo.db.transaction(function (t) {
	                    t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
	                        resolve();
	                    }, function (t, error) {
	                        reject(error);
	                    });
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Does a simple `COUNT(key)` to get the number of items stored in
	    // localForage.
	    function length(callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                dbInfo.db.transaction(function (t) {
	                    // Ahhh, SQL makes this one soooooo easy.
	                    t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
	                        var result = results.rows.item(0).c;

	                        resolve(result);
	                    }, function (t, error) {

	                        reject(error);
	                    });
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    // Return the key located at key index X; essentially gets the key from a
	    // `WHERE id = ?`. This is the most efficient way I can think to implement
	    // this rarely-used (in my experience) part of the API, but it can seem
	    // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
	    // the ID of each key will change every time it's updated. Perhaps a stored
	    // procedure for the `setItem()` SQL would solve this problem?
	    // TODO: Don't change ID on `setItem()`.
	    function key(n, callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                dbInfo.db.transaction(function (t) {
	                    t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
	                        var result = results.rows.length ? results.rows.item(0).key : null;
	                        resolve(result);
	                    }, function (t, error) {
	                        reject(error);
	                    });
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function keys(callback) {
	        var self = this;

	        var promise = new Promise(function (resolve, reject) {
	            self.ready().then(function () {
	                var dbInfo = self._dbInfo;
	                dbInfo.db.transaction(function (t) {
	                    t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
	                        var keys = [];

	                        for (var i = 0; i < results.rows.length; i++) {
	                            keys.push(results.rows.item(i).key);
	                        }

	                        resolve(keys);
	                    }, function (t, error) {

	                        reject(error);
	                    });
	                });
	            })['catch'](reject);
	        });

	        executeCallback(promise, callback);
	        return promise;
	    }

	    function executeCallback(promise, callback) {
	        if (callback) {
	            promise.then(function (result) {
	                callback(null, result);
	            }, function (error) {
	                callback(error);
	            });
	        }
	    }

	    var webSQLStorage = {
	        _driver: 'webSQLStorage',
	        _initStorage: _initStorage,
	        iterate: iterate,
	        getItem: getItem,
	        setItem: setItem,
	        removeItem: removeItem,
	        clear: clear,
	        length: length,
	        key: key,
	        keys: keys
	    };

	    exports['default'] = webSQLStorage;
	}).call(typeof window !== 'undefined' ? window : self);
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
},{"__browserify_process":4}],19:[function(require,module,exports){
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}]},{},[7])(7)
});
;
/* jslint-ignore-end */
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        // init exports
        local.Nedb = local.global.utility2_nedb = local.global.Nedb;
        local.Nedb.NODE_ENV = 'undefined';
        break;



    // run node js-env code - post-init
    case 'node':
        // init exports
        local.Nedb = module['./lib.nedb.js'] = module['nedb-lite'] = module.exports;
        local.Nedb.__dirname = __dirname;
        local.Nedb.NODE_ENV = process.env.NODE_ENV;
        // require modules
        local.child_process = require('child_process');
        local.fs = require('fs');
        break;
    }



    // run shared js-env code - post-init
    (function () {
        // re-init local
        local.Nedb.Nedb = local.Nedb.local = local.Nedb;
        Object.keys(local).forEach(function (key) {
            local.Nedb[key.replace((/.*\//), '')] = local[key];
        });
        local = local.Nedb;
        local.assert = function (passed, message) {
        /*
         * this function will assert passed is truthy, else throw the error message
         */
            var error;
            if (passed) {
                return;
            }
            error = message && message.message
                // if message is an error-object, then leave it as is
                ? message
                : new Error(typeof message === 'string'
                    // if message is a string, then leave it as is
                    ? message
                    // else JSON.stringify message
                    : JSON.stringify(message));
            throw error;
        };
        local.dbExport = function () {
        /*
         * this function will export the database as a serialized tableList
         */
            return Object.keys(local.dbTableDict).map(function (key) {
                return local.dbTableDict[key].export();
            }).join('\n\n');
        };
        local.dbImport = function (tableList, onError) {
        /*
         * this function will import the serialized tableList
         */
            var onParallel;
            onParallel = function () {
                onParallel.counter -= 1;
                if (onParallel.counter === 0) {
                    onError();
                }
            };
            onParallel.counter = 0;
            onParallel.counter += 1;
            tableList.trim().split('\n\n').forEach(function (table) {
                onParallel.counter += 1;
                local.dbTableCreate({
                    persistenceData: table,
                    name: JSON.parse((/.*/).exec(table)[0])
                }, onParallel);
            });
            onParallel();
        };
        local.dbReset = function (onError) {
        /*
         * this function will reset nedb's persistence
         */
            var onParallel;
            onParallel = function () {
                onParallel.counter -= 1;
                if (onParallel.counter === 0) {
                    onError();
                }
            };
            onParallel.counter = 0;
            onParallel.counter += 1;
            // drop all tables
            Object.keys(local.dbTableDict).forEach(function (key) {
                onParallel.counter += 1;
                local.dbTableDrop({ name: key }, onParallel);
            });
            // https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/deleteDatabase
            if (local.modeJs === 'browser') {
                onParallel.counter += 1;
                window.indexedDB.deleteDatabase('NeDB');
                setTimeout(onParallel);
            } else {
                onParallel.counter += 1;
                local.fs.readdir(local.fsDir(), function (error, fileList) {
                    // validate no error occurred
                    local.assert(!error, error);
                    fileList.forEach(function (file) {
                        onParallel.counter += 1;
                        local.fs.unlink(local.fsDir() + '/' + file, onParallel);
                    });
                    onParallel();
                });
            }
            onParallel();
        };
        local.dbTableCreate = function (options, onError) {
            var data, modeNext, onNext, self;
            modeNext = 0;
            onNext = function (error) {
                modeNext = error
                    ? Infinity
                    : modeNext + 1;
                switch (modeNext) {
                case 1:
                    self = local.dbTableDict[options.name];
                    if (!self) {
                        self = local.dbTableDict[options.name] = new local.Nedb({
                            filename: local.fsDir() + '/' + options.name,
                            timestampData: true
                        });
                        self.name = String(options.name);
                    }
                    onError = onError || function (error) {
                        // validate no error occurred
                        local.assert(!error, error);
                    };
                    data = (options.persistenceData || '').trim();
                    if (options.reset) {
                        data = 'undefined';
                    }
                    if (!data) {
                        onNext();
                        return;
                    }
                    self.isLoaded = null;
                    data += '\n';
                    data = data.slice(data.indexOf('\n') + 1);
                    local.storage.writeFile(self.filename, data, onNext);
                    break;
                case 2:
                    if (self.isLoaded) {
                        onNext();
                        return;
                    }
                    self.isLoaded = true;
                    self.loadDatabase(onNext);
                    break;
                default:
                    onError(error, self);
                }
            };
            onNext(options.error);
            return self;
        };
        local.dbTableDict = {};
        local.dbTableDrop = function (options, onError) {
        /*
         * this function will drop the table with the given options.name
         */
            var table;
            table = local.dbTableDict[options.name];
            if (!table) {
                onError();
                return;
            }
            delete local.dbTableDict[options.name];
            table.persistence = table.prototype = table;
            table.persistCachedDatabase = table.persistNewState = function () {
                var ii;
                for (ii = 0; ii < arguments.length; ii += 1) {
                    if (typeof arguments[ii] === 'function') {
                        arguments[ii]();
                        return;
                    }
                }
            };
            local.storage.unlink(table.filename, function () {
                onError();
            });
        };
        local.fsDir = function () {
        /*
         * this function will return the persistence-dir
         */
            var tmp;
            tmp = 'tmp/nedb.persistence.' + local.NODE_ENV;
            // https://github.com/louischatriot/nedb/issues/134
            // bug workaround - Error creating index when db does not exist #134
            if (local.modeJs === 'node' && tmp !== local.fsDirInitialized) {
                // init nedb-dir
                local.storage.mkdirp(tmp, nop);
            }
            local.fsDirInitialized = tmp;
            return tmp;
        };
        local.jsonStringifyOrdered = function (element, replacer, space) {
        /*
         * this function will JSON.stringify the element,
         * with object-keys sorted and circular-references removed
         */
            var circularList, stringify, tmp;
            stringify = function (element) {
            /*
             * this function will recursively JSON.stringify the element,
             * with object-keys sorted and circular-references removed
             */
                // if element is an object, then recurse its items with object-keys sorted
                if (element &&
                        typeof element === 'object' &&
                        typeof element.toJSON !== 'function') {
                    // ignore circular-reference
                    if (circularList.indexOf(element) >= 0) {
                        return;
                    }
                    circularList.push(element);
                    // if element is an array, then recurse its elements
                    if (Array.isArray(element)) {
                        return '[' + element.map(function (element) {
                            tmp = stringify(element);
                            return typeof tmp === 'string'
                                ? tmp
                                : 'null';
                        }).join(',') + ']';
                    }
                    return '{' + Object.keys(element)
                        // sort object-keys
                        .sort()
                        .map(function (key) {
                            tmp = stringify(element[key]);
                            return typeof tmp === 'string'
                                ? JSON.stringify(key) + ':' + tmp
                                : undefined;
                        })
                        .filter(function (element) {
                            return typeof element === 'string';
                        })
                        .join(',') + '}';
                }
                // else JSON.stringify as normal
                return JSON.stringify(element);
            };
            circularList = [];
            return JSON.stringify(element && typeof element === 'object'
                ? JSON.parse(stringify(element))
                : element, replacer, space);
        };
        local.prototype.export = function () {
        /*
         * this function will export the table as serialized-text
         */
            var data, self;
            data = JSON.stringify(String(this.name)) + '\n';
            self = this;
            self.getAllData().forEach(function (doc) {
                data += local.model.serialize(doc) + '\n';
            });
            Object.keys(self.indexes).forEach(function (fieldName) {
                if (fieldName === "_id") {
                    return;
                }
                data += local.model.serialize({ $$indexCreated: {
                    fieldName: fieldName,
                    unique: self.indexes[fieldName].unique,
                    sparse: self.indexes[fieldName].sparse
                } }) + '\n';
            });
            return data.trim();
        };
    }());
}(
    (function () {
        'use strict';
        var local;
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
        // init module
        if (local.modeJs === 'node') {
            local.require2 = require;
        }
        return local;
    }())
));




// /assets.utility2.lib.sjcl.js
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
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;



// init lib sjcl
/* jslint-ignore-begin */
// https://github.com/bitwiseshiftleft/sjcl/blob/1.0.3/sjcl.js
(function () { var module;
"use strict";function q(a){throw a;}var s=void 0,u=!1;var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});
sjcl.cipher.aes=function(a){this.k[0][0][0]||this.D();var b,c,d,e,f=this.k[0][4],g=this.k[1];b=a.length;var h=1;4!==b&&(6!==b&&8!==b)&&q(new sjcl.exception.invalid("invalid aes key size"));this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return w(this,a,0)},decrypt:function(a){return w(this,a,1)},k:[[[],[],[],[],[]],[[],[],[],[],[]]],D:function(){var a=this.k[0],b=this.k[1],c=a[4],d=b[4],e,f,g,h=[],l=[],k,n,m,p;for(e=0;0x100>e;e++)l[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=k||1,g=l[g]||1){m=g^g<<1^g<<2^g<<3^g<<4;m=m>>8^m&255^99;c[f]=m;d[m]=f;n=h[e=h[k=h[f]]];p=0x1010101*n^0x10001*e^0x101*k^0x1010100*f;n=0x101*h[m]^0x1010100*m;for(e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8}for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function w(a,b,c){4!==b.length&&q(new sjcl.exception.invalid("invalid aes block size"));var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,l,k,n=d.length/4-2,m,p=4,t=[0,0,0,0];h=a.k[c];a=h[0];var r=h[1],v=h[2],y=h[3],z=h[4];for(m=0;m<n;m++)h=a[e>>>24]^r[f>>16&255]^v[g>>8&255]^y[b&255]^d[p],l=a[f>>>24]^r[g>>16&255]^v[b>>8&255]^y[e&255]^d[p+1],k=a[g>>>24]^r[b>>16&255]^v[e>>8&255]^y[f&255]^d[p+2],b=a[b>>>24]^r[e>>16&255]^v[f>>8&255]^y[g&255]^d[p+3],p+=4,e=h,f=l,g=k;for(m=0;4>
m;m++)t[c?3&-m:m]=z[e>>>24]<<24^z[f>>16&255]<<16^z[g>>8&255]<<8^z[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return t}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.P(a.slice(b/32),32-(b&31)).slice(1);return c===s?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.P(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return u;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},P:function(a,b,c,d){var e;e=0;for(d===s&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},l:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base64={J:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.J,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.J,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++)h=f.indexOf(a.charAt(d)),
0>h&&q(new sjcl.exception.invalid("this isn't base64!")),26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e);e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.D();a?(this.r=a.r.slice(0),this.o=a.o.slice(0),this.h=a.h):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.r=this.N.slice(0);this.o=[];this.h=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.o=sjcl.bitArray.concat(this.o,a);b=this.h;a=this.h=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)x(this,c.splice(0,16));return this},finalize:function(){var a,b=this.o,c=this.r,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.h/
4294967296));for(b.push(this.h|0);b.length;)x(this,b.splice(0,16));this.reset();return c},N:[],b:[],D:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.N[b]=a(Math.pow(c,0.5)));this.b[b]=a(Math.pow(c,1/3));b++}}};
function x(a,b){var c,d,e,f=b.slice(0),g=a.r,h=a.b,l=g[0],k=g[1],n=g[2],m=g[3],p=g[4],t=g[5],r=g[6],v=g[7];for(c=0;64>c;c++)16>c?d=f[c]:(d=f[c+1&15],e=f[c+14&15],d=f[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+f[c&15]+f[c+9&15]|0),d=d+v+(p>>>6^p>>>11^p>>>25^p<<26^p<<21^p<<7)+(r^p&(t^r))+h[c],v=r,r=t,t=p,p=m+d|0,m=n,n=k,k=l,l=d+(k&n^m&(k^n))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;g[0]=g[0]+l|0;g[1]=g[1]+k|0;g[2]=g[2]+n|0;g[3]=g[3]+m|0;g[4]=g[4]+p|0;g[5]=g[5]+t|0;g[6]=
g[6]+r|0;g[7]=g[7]+v|0}
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,l=h.bitLength(c)/8,k=h.bitLength(g)/8;e=e||64;d=d||[];7>l&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(f=2;4>f&&k>>>8*f;f++);f<15-l&&(f=15-l);c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.L(a,b,c,d,e,f);g=sjcl.mode.ccm.p(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),l=f.clamp(b,h-e),k=f.bitSlice(b,
h-e),h=(h-e)/8;7>g&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));l=sjcl.mode.ccm.p(a,l,c,k,e,b);a=sjcl.mode.ccm.L(a,l.data,c,d,e,b);f.equal(l.tag,a)||q(new sjcl.exception.corrupt("ccm: tag doesn't match"));return l.data},L:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,l=h.l;e/=8;(e%2||4>e||16<e)&&q(new sjcl.exception.invalid("ccm: invalid tag length"));(0xffffffff<d.length||0xffffffff<b.length)&&q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"));
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c]));g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(l(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(l(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,8*e)},p:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.l;var l=b.length,k=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!l)return{tag:d,data:[]};for(g=0;g<l;g+=4)c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,k)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));var g,h=sjcl.mode.ocb2.H,l=sjcl.bitArray,k=l.l,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=k(n,m),p=p.concat(k(c,a.encrypt(k(c,m)))),c=h(c);m=b.slice(g);b=l.bitLength(m);g=a.encrypt(k(c,[0,0,0,b]));m=l.clamp(k(m.concat([0,0,0]),g),b);n=k(n,k(m.concat([0,0,0]),g));n=a.encrypt(k(n,k(c,h(c))));d.length&&
(n=k(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(l.concat(m,l.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));e=e||64;var g=sjcl.mode.ocb2.H,h=sjcl.bitArray,l=h.l,k=[0,0,0,0],n=g(a.encrypt(c)),m,p,t=sjcl.bitArray.bitLength(b)-e,r=[];d=d||[];for(c=0;c+4<t/32;c+=4)m=l(n,a.decrypt(l(n,b.slice(c,c+4)))),k=l(k,m),r=r.concat(m),n=g(n);p=t-32*c;m=a.encrypt(l(n,[0,0,0,p]));m=l(m,h.clamp(b.slice(c),p).concat([0,0,0]));
k=l(k,m);k=a.encrypt(l(k,l(n,g(n))));d.length&&(k=l(k,f?d:sjcl.mode.ocb2.pmac(a,d)));h.equal(h.clamp(k,e),h.bitSlice(b,t))||q(new sjcl.exception.corrupt("ocb: tag doesn't match"));return r.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.H,e=sjcl.bitArray,f=e.l,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,
d(h))),g))},H:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.p(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.p(u,a,f,d,c,e);g.equal(a.tag,b)||q(new sjcl.exception.corrupt("gcm: tag doesn't match"));return a.data},Z:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.l;e=[0,0,0,0];f=b.slice(0);
for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},g:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.Z(b,a);return b},p:function(a,b,c,d,e,f){var g,h,l,k,n,m,p,t,r=sjcl.bitArray;m=c.length;p=r.bitLength(c);t=r.bitLength(d);h=r.bitLength(e);g=b.encrypt([0,
0,0,0]);96===h?(e=e.slice(0),e=r.concat(e,[1])):(e=sjcl.mode.gcm.g(g,[0,0,0,0],e),e=sjcl.mode.gcm.g(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.g(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.g(g,h,c));for(k=0;k<m;k+=4)n[3]++,l=b.encrypt(n),c[k]^=l[0],c[k+1]^=l[1],c[k+2]^=l[2],c[k+3]^=l[3];c=r.clamp(c,p);a&&(d=sjcl.mode.gcm.g(g,h,c));a=[Math.floor(t/0x100000000),t&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.g(g,d,a);l=b.encrypt(e);d[0]^=l[0];
d[1]^=l[1];d[2]^=l[2];d[3]^=l[3];return{tag:r.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.M=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.n=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.n[0].update(c[0]);this.n[1].update(c[1]);this.G=new b(this.n[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){this.Q&&q(new sjcl.exception.invalid("encrypt on already updated hmac called!"));this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.G=new this.M(this.n[0]);this.Q=u};sjcl.misc.hmac.prototype.update=function(a){this.Q=!0;this.G.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.G.finalize(),a=(new this.M(this.n[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;(0>d||0>c)&&q(sjcl.exception.invalid("invalid params to pbkdf2"));"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,l,k=[],n=sjcl.bitArray;for(l=1;32*k.length<(d||1);l++){e=f=a.encrypt(n.concat(b,[l]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}d&&(k=n.clamp(k,d));return k};
sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.i=[0];this.F=0;this.s={};this.C=0;this.K={};this.O=this.d=this.j=this.W=0;this.b=[0,0,0,0,0,0,0,0];this.f=[0,0,0,0];this.A=s;this.B=a;this.q=u;this.w={progress:{},seeded:{}};this.m=this.V=0;this.t=1;this.u=2;this.S=0x10000;this.I=[0,48,64,96,128,192,0x100,384,512,768,1024];this.T=3E4;this.R=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;d===this.m&&q(new sjcl.exception.notReady("generator isn't seeded"));if(d&this.u){d=!(d&this.t);e=[];var f=0,g;this.O=e[0]=(new Date).valueOf()+this.T;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.c.length&&!(e=e.concat(this.c[g].finalize()),f+=this.i[g],this.i[g]=0,!d&&this.F&1<<g);g++);this.F>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.i.push(0));this.d-=f;f>this.j&&(this.j=f);this.F++;
this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.A=new sjcl.cipher.aes(this.b);for(d=0;4>d&&!(this.f[d]=this.f[d]+1|0,this.f[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.S&&A(this),e=B(this),c.push(e[0],e[1],e[2],e[3]);A(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b&&q("Setting paranoia=0 will ruin your security; use it only for testing");this.B=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),
g=this.s[c],h=this.isReady(),l=0;d=this.K[c];d===s&&(d=this.K[c]=this.W++);g===s&&(g=this.s[c]=0);this.s[c]=(this.s[c]+1)%this.c.length;switch(typeof a){case "number":b===s&&(b=1);this.c[g].update([d,this.C++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(l=1);for(c=0;c<a.length&&!l;c++)"number"!==typeof a[c]&&(l=1)}if(!l){if(b===s)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,
e>>>=1;this.c[g].update([d,this.C++,2,b,f,a.length].concat(a))}break;case "string":b===s&&(b=a.length);this.c[g].update([d,this.C++,3,b,f,a.length]);this.c[g].update(a);break;default:l=1}l&&q(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"));this.i[g]+=b;this.d+=b;h===this.m&&(this.isReady()!==this.m&&C("seeded",Math.max(this.j,this.d)),C("progress",this.getProgress()))},isReady:function(a){a=this.I[a!==s?a:this.B];return this.j&&this.j>=a?this.i[0]>this.R&&
(new Date).valueOf()>this.O?this.u|this.t:this.t:this.d>=a?this.u|this.m:this.m},getProgress:function(a){a=this.I[a?a:this.B];return this.j>=a?1:this.d>a?1:this.d/a},startCollectors:function(){this.q||(this.a={loadTimeCollector:D(this,this.aa),mouseCollector:D(this,this.ba),keyboardCollector:D(this,this.$),accelerometerCollector:D(this,this.U),touchCollector:D(this,this.da)},window.addEventListener?(window.addEventListener("load",this.a.loadTimeCollector,u),window.addEventListener("mousemove",this.a.mouseCollector,
u),window.addEventListener("keypress",this.a.keyboardCollector,u),window.addEventListener("devicemotion",this.a.accelerometerCollector,u),window.addEventListener("touchmove",this.a.touchCollector,u)):document.attachEvent?(document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)):q(new sjcl.exception.bug("can't attach event")),this.q=!0)},stopCollectors:function(){this.q&&(window.removeEventListener?
(window.removeEventListener("load",this.a.loadTimeCollector,u),window.removeEventListener("mousemove",this.a.mouseCollector,u),window.removeEventListener("keypress",this.a.keyboardCollector,u),window.removeEventListener("devicemotion",this.a.accelerometerCollector,u),window.removeEventListener("touchmove",this.a.touchCollector,u)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",
this.a.keyboardCollector)),this.q=u)},addEventListener:function(a,b){this.w[a][this.V++]=b},removeEventListener:function(a,b){var c,d,e=this.w[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},$:function(){E(1)},ba:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&sjcl.random.addEntropy([b,c],2,"mouse");E(0)},da:function(a){a=a.touches[0]||a.changedTouches[0];sjcl.random.addEntropy([a.pageX||
a.clientX,a.pageY||a.clientY],1,"touch");E(0)},aa:function(){E(2)},U:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&sjcl.random.addEntropy(b,1,"accelerometer")}a&&sjcl.random.addEntropy(a,2,"accelerometer");E(0)}};function C(a,b){var c,d=sjcl.random.w[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}
function E(a){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?sjcl.random.addEntropy(window.performance.now(),a,"loadtime"):sjcl.random.addEntropy((new Date).valueOf(),a,"loadtime")}function A(a){a.b=B(a).concat(B(a));a.A=new sjcl.cipher.aes(a.b)}function B(a){for(var b=0;4>b&&!(a.f[b]=a.f[b]+1|0,a.f[b]);b++);return a.A.encrypt(a.f)}function D(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var F,G,H,I;if(I="undefined"!==typeof module){var J;if(J=module.exports){var K;try{K=require("crypto")}catch(L){K=null}J=(G=K)&&G.randomBytes}I=J}if(I)F=G.randomBytes(128),F=new Uint32Array((new Uint8Array(F)).buffer),sjcl.random.addEntropy(F,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){H=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(H);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(H);
else break a;sjcl.random.addEntropy(H,1024,"crypto['getRandomValues']")}}catch(M){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(M))}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},Y:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.e({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.e(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||4<
f.iv.length)&&q(new sjcl.exception.invalid("json encrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(f.adata=c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.e(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},
encrypt:function(a,b,c,d){var e=sjcl.json,f=e.Y.apply(e,arguments);return e.encode(f)},X:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.e(e.e(e.e({},e.defaults),b),c,!0);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)&&
q(new sjcl.exception.invalid("json decrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl.codec.utf8String.toBits(f));g=new sjcl.cipher[b.cipher](a);f=sjcl.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.e(d,b);d.key=a;return 1===c.raw?f:sjcl.codec.utf8String.fromBits(f)},decrypt:function(a,b,
c,d){var e=sjcl.json;return e.X(a,e.decode(b),c,d)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b))switch(b.match(/^[a-z0-9]+$/i)||q(new sjcl.exception.invalid("json encode: invalid property name")),c+=d+'"'+b+'":',d=",",typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:q(new sjcl.exception.bug("json encode: unsupported type"))}return c+"}"},decode:function(a){a=
a.replace(/\s/g,"");a.match(/^\{.*\}$/)||q(new sjcl.exception.invalid("json decode: this isn't json!"));a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++)(d=a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i))||q(new sjcl.exception.invalid("json decode: this isn't json!")),d[3]?b[d[2]]=parseInt(d[3],10):d[4]?b[d[2]]=d[2].match(/^(ct|adata|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]):d[5]&&(b[d[2]]="true"===
d[5]);return b},e:function(a,b,c){a===s&&(a={});if(b===s)return a;for(var d in b)b.hasOwnProperty(d)&&(c&&(a[d]!==s&&a[d]!==b[d])&&q(new sjcl.exception.invalid("required parameter overridden")),a[d]=b[d]);return a},fa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ea:function(a,b){var c={},d;for(d=0;d<b.length;d++)a[b[d]]!==s&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.ca={};
sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.ca,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===s?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};
local.sjcl = sjcl; }());
/* jslint-ignore-end */



// init lib sjcl.misc.scrypt
/* jslint-ignore-begin */
// https://github.com/bitwiseshiftleft/sjcl/blob/97be4f7d541c6ddbc7eafcb610b4a23a6c551d81/core/scrypt.js
(function () { var sjcl; sjcl = local.sjcl;
/** scrypt Password-Based Key-Derivation Function.
 *
 * @param {bitArray|String} password  The password.
 * @param {bitArray|String} salt      The salt.  Should have lots of entropy.
 *
 * @param {Number} [N=16384] CPU/Memory cost parameter.
 * @param {Number} [r=8]     Block size parameter.
 * @param {Number} [p=1]     Parallelization parameter.
 *
 * @param {Number} [length] The length of the derived key.  Defaults to the
 *                          output size of the hash function.
 * @param {Object} [Prff=sjcl.misc.hmac] The pseudorandom function family.
 *
 * @return {bitArray} The derived key.
 */
sjcl.misc.scrypt = function (password, salt, N, r, p, length, Prff) {
  var SIZE_MAX = Math.pow(2, 32) - 1,
      self = sjcl.misc.scrypt;

  N = N || 16384;
  r = r || 8;
  p = p || 1;

  if (r * p >= Math.pow(2, 30)) {
    throw sjcl.exception.invalid("The parameters r, p must satisfy r * p < 2^30");
  }

  if ((N < 2) || (N & (N - 1) != 0)) {
    throw sjcl.exception.invalid("The parameter N must be a power of 2.");
  }

  if (N > SIZE_MAX / 128 / r) {
    throw sjcl.exception.invalid("N too big.");
  }

  if (r > SIZE_MAX / 128 / p) {
    throw sjcl.exception.invalid("r too big.");
  }

  var blocks = sjcl.misc.pbkdf2(password, salt, 1, p * 128 * r * 8, Prff),
      len = blocks.length / p;

  self.reverse(blocks);

  for (var i = 0; i < p; i++) {
    var block = blocks.slice(i * len, (i + 1) * len);
    self.blockcopy(self.ROMix(block, N), 0, blocks, i * len);
  }

  self.reverse(blocks);

  return sjcl.misc.pbkdf2(password, blocks, 1, length, Prff);
};

sjcl.misc.scrypt.salsa20Core = function (word, rounds) {
  var R = function(a, b) { return (a << b) | (a >>> (32 - b)); };
  var x = word.slice(0);

  for (var i = rounds; i > 0; i -= 2) {
    x[ 4] ^= R(x[ 0]+x[12], 7);  x[ 8] ^= R(x[ 4]+x[ 0], 9);
    x[12] ^= R(x[ 8]+x[ 4],13);  x[ 0] ^= R(x[12]+x[ 8],18);
    x[ 9] ^= R(x[ 5]+x[ 1], 7);  x[13] ^= R(x[ 9]+x[ 5], 9);
    x[ 1] ^= R(x[13]+x[ 9],13);  x[ 5] ^= R(x[ 1]+x[13],18);
    x[14] ^= R(x[10]+x[ 6], 7);  x[ 2] ^= R(x[14]+x[10], 9);
    x[ 6] ^= R(x[ 2]+x[14],13);  x[10] ^= R(x[ 6]+x[ 2],18);
    x[ 3] ^= R(x[15]+x[11], 7);  x[ 7] ^= R(x[ 3]+x[15], 9);
    x[11] ^= R(x[ 7]+x[ 3],13);  x[15] ^= R(x[11]+x[ 7],18);
    x[ 1] ^= R(x[ 0]+x[ 3], 7);  x[ 2] ^= R(x[ 1]+x[ 0], 9);
    x[ 3] ^= R(x[ 2]+x[ 1],13);  x[ 0] ^= R(x[ 3]+x[ 2],18);
    x[ 6] ^= R(x[ 5]+x[ 4], 7);  x[ 7] ^= R(x[ 6]+x[ 5], 9);
    x[ 4] ^= R(x[ 7]+x[ 6],13);  x[ 5] ^= R(x[ 4]+x[ 7],18);
    x[11] ^= R(x[10]+x[ 9], 7);  x[ 8] ^= R(x[11]+x[10], 9);
    x[ 9] ^= R(x[ 8]+x[11],13);  x[10] ^= R(x[ 9]+x[ 8],18);
    x[12] ^= R(x[15]+x[14], 7);  x[13] ^= R(x[12]+x[15], 9);
    x[14] ^= R(x[13]+x[12],13);  x[15] ^= R(x[14]+x[13],18);
  }

  for (i = 0; i < 16; i++) word[i] = x[i]+word[i];
};

sjcl.misc.scrypt.blockMix = function(blocks) {
  var X = blocks.slice(-16),
      out = [],
      len = blocks.length / 16,
      self = sjcl.misc.scrypt;

  for (var i = 0; i < len; i++) {
    self.blockxor(blocks, 16 * i, X, 0, 16);
    self.salsa20Core(X, 8);

    if ((i & 1) == 0) {
      self.blockcopy(X, 0, out, 8 * i);
    } else {
      self.blockcopy(X, 0, out, 8 * (i^1 + len));
    }
  }

  return out;
};

sjcl.misc.scrypt.ROMix = function(block, N) {
  var X = block.slice(0),
      V = [],
      self = sjcl.misc.scrypt;

  for (var i = 0; i < N; i++) {
    V.push(X.slice(0));
    X = self.blockMix(X);
  }

  for (i = 0; i < N; i++) {
    var j = X[X.length - 16] & (N - 1);

    self.blockxor(V[j], 0, X, 0);
    X = self.blockMix(X);
  }

  return X;
};

sjcl.misc.scrypt.reverse = function (words) { // Converts Big <-> Little Endian words
  for (var i in words) {
    var out = words[i] &  0xFF;
    out = (out << 8) | (words[i] >>>  8) & 0xFF;
    out = (out << 8) | (words[i] >>> 16) & 0xFF;
    out = (out << 8) | (words[i] >>> 24) & 0xFF;

    words[i] = out;
  }
};

sjcl.misc.scrypt.blockcopy = function (S, Si, D, Di, len) {
  var i;

  len = len || (S.length - Si);

  for (i = 0; i < len; i++) D[Di + i] = S[Si + i] | 0;
};

sjcl.misc.scrypt.blockxor = function(S, Si, D, Di, len) {
  var i;

  len = len || (S.length - Si);

  for (i = 0; i < len; i++) D[Di + i] = (D[Di + i] ^ S[Si + i]) | 0;
};
}());
/* jslint-ignore-end */
    }());
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        // init exports
        local.global.utility2_sjcl = local.sjcl;
        break;



    // run node js-env code - post-init
    case 'node':
        // init exports
        module.exports = module['./lib.sjcl.js'] = local.sjcl;
        break;
    }
}());




// /assets.utility2.lib.uglifyjs.js
///usr/bin/env node
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
    }());



    // run shared js-env code - post-init
    (function () {
        var exports, require;
        // init exports
        exports = local;
        require = function () {
            return exports;
        };
        // jslint-hack
        require();



/* jslint-ignore-begin */
// init lib parse-js
// https://github.com/mishoo/UglifyJS/blob/v1.3.5/lib/parse-js.js
// utility2-uglifyjs https://raw.githubusercontent.com/mishoo/UglifyJS/v1.3.5/lib/parse-js.js
function is_letter(e){return UNICODE.letter.test(e)}function is_digit(e){return e=e.charCodeAt(0),e>=48&&e<=57}function is_unicode_digit(e){return UNICODE.digit.test(e)}function is_alphanumeric_char(e){return is_digit(e)||is_letter(e)}function is_unicode_combining_mark
(e){return UNICODE.combining_mark.test(e)}function is_unicode_connector_punctuation(e){return UNICODE.connector_punctuation.test(e)}function is_identifier_start(e){return e=="$"||e=="_"||is_letter(e)}function is_identifier_char(e){return is_identifier_start
(e)||is_unicode_combining_mark(e)||is_unicode_digit(e)||is_unicode_connector_punctuation(e)||e=="\u200c"||e=="\u200d"}function parse_js_number(e){if(RE_HEX_NUMBER.test(e))return parseInt(e.substr(2),16);if(RE_OCT_NUMBER.test(e))return parseInt(e.substr(1),8
);if(RE_DEC_NUMBER.test(e))return parseFloat(e)}function JS_Parse_Error(e,t,n,r){this.message=e,this.line=t+1,this.col=n+1,this.pos=r+1,this.stack=(new Error).stack}function js_error(e,t,n,r){throw new JS_Parse_Error(e,t,n,r)}function is_token(e,t,n){return e
.type==t&&(n==null||e.value==n)}function tokenizer(e){function n(){return t.text.charAt(t.pos)}function r(e,n){var r=t.text.charAt(t.pos++);if(e&&!r)throw EX_EOF;return r=="\n"?(t.newline_before=t.newline_before||!n,++t.line,t.col=0):++t.col,r}function i(){
return!t.peek()}function s(e,n){var r=t.text.indexOf(e,t.pos);if(n&&r==-1)throw EX_EOF;return r}function o(){t.tokline=t.line,t.tokcol=t.col,t.tokpos=t.pos}function u(e,n,r){t.regex_allowed=e=="operator"&&!HOP(UNARY_POSTFIX,n)||e=="keyword"&&HOP(KEYWORDS_BEFORE_EXPRESSION
,n)||e=="punc"&&HOP(PUNC_BEFORE_EXPRESSION,n);var i={type:e,value:n,line:t.tokline,col:t.tokcol,pos:t.tokpos,endpos:t.pos,nlb:t.newline_before};if(!r){i.comments_before=t.comments_before,t.comments_before=[];for(var s=0,o=i.comments_before.length;s<o;s++)i.
nlb=i.nlb||i.comments_before[s].nlb}return t.newline_before=!1,i}function a(){while(HOP(WHITESPACE_CHARS,n()))r()}function f(e){var t="",i=n(),s=0;while(i&&e(i,s++))t+=r(),i=n();return t}function l(e){js_error(e,t.tokline,t.tokcol,t.tokpos)}function c(e){var t=!1
,n=!1,r=!1,i=e==".",s=f(function(s,o){return s=="x"||s=="X"?r?!1:r=!0:!!r||s!="E"&&s!="e"?s=="-"?n||o==0&&!e?!0:!1:s=="+"?n:(n=!1,s=="."?!i&&!r&&!t?i=!0:!1:is_alphanumeric_char(s)):t?!1:t=n=!0});e&&(s=e+s);var o=parse_js_number(s);if(!isNaN(o))return u("num"
,o);l("Invalid syntax: "+s)}function h(e){var t=r(!0,e);switch(t){case"n":return"\n";case"r":return"\r";case"t":return"	";case"b":return"\b";case"v":return"";case"f":return"\f";case"0":return"\0";case"x":return String.fromCharCode(p(2));case"u":return String
.fromCharCode(p(4));case"\n":return"";default:return t}}function p(e){var t=0;for(;e>0;--e){var n=parseInt(r(!0),16);isNaN(n)&&l("Invalid hex-character pattern in string"),t=t<<4|n}return t}function d(){return x("Unterminated string constant",function(){var e=
r(),t="";for(;;){var n=r(!0);if(n=="\\"){var i=0,s=null;n=f(function(e){if(e>="0"&&e<="7"){if(!s)return s=e,++i;if(s<="3"&&i<=2)return++i;if(s>="4"&&i<=1)return++i}return!1}),i>0?n=String.fromCharCode(parseInt(n,8)):n=h(!0)}else{if(n==e)break;if(n=="\n")throw EX_EOF
}t+=n}return u("string",t)})}function v(){r();var e=s("\n"),n;return e==-1?(n=t.text.substr(t.pos),t.pos=t.text.length):(n=t.text.substring(t.pos,e),t.pos=e),u("comment1",n,!0)}function m(){return r(),x("Unterminated multiline comment",function(){var e=s("*/"
,!0),n=t.text.substring(t.pos,e);return t.pos=e+2,t.line+=n.split("\n").length-1,t.newline_before=t.newline_before||n.indexOf("\n")>=0,/^@cc_on/i.test(n)&&(warn("WARNING: at line "+t.line),warn('*** Found "conditional comment": '+n),warn("*** UglifyJS DISCARDS ALL COMMENTS.  This means your code might no longer work properly in Internet Explorer."
)),u("comment2",n,!0)})}function g(){var e=!1,t="",i,s=!1,o;while((i=n())!=null)if(!e)if(i=="\\")s=e=!0,r();else{if(!is_identifier_char(i))break;t+=r()}else i!="u"&&l("Expecting UnicodeEscapeSequence -- uXXXX"),i=h(),is_identifier_char(i)||l("Unicode char: "+
i.charCodeAt(0)+" is not valid in identifier"),t+=i,e=!1;return HOP(KEYWORDS,t)&&s&&(o=t.charCodeAt(0).toString(16).toUpperCase(),t="\\u"+"0000".substr(o.length)+o+t.slice(1)),t}function y(e){return x("Unterminated regular expression",function(){var t=!1,n,
i=!1;while(n=r(!0))if(t)e+="\\"+n,t=!1;else if(n=="[")i=!0,e+=n;else if(n=="]"&&i)i=!1,e+=n;else{if(n=="/"&&!i)break;n=="\\"?t=!0:e+=n}var s=g();return u("regexp",[e,s])})}function b(e){function t(e){if(!n())return e;var i=e+n();return HOP(OPERATORS,i)?(r()
,t(i)):e}return u("operator",t(e||r()))}function w(){r();var e=t.regex_allowed;switch(n()){case"/":return t.comments_before.push(v()),t.regex_allowed=e,T();case"*":return t.comments_before.push(m()),t.regex_allowed=e,T()}return t.regex_allowed?y(""):b("/")}
function E(){return r(),is_digit(n())?c("."):u("punc",".")}function S(){var e=g();return HOP(KEYWORDS,e)?HOP(OPERATORS,e)?u("operator",e):HOP(KEYWORDS_ATOM,e)?u("atom",e):u("keyword",e):u("name",e)}function x(e,t){try{return t()}catch(n){if(n!==EX_EOF)throw n
;l(e)}}function T(e){if(e!=null)return y(e);a(),o();var t=n();if(!t)return u("eof");if(is_digit(t))return c();if(t=='"'||t=="'")return d();if(HOP(PUNC_CHARS,t))return u("punc",r());if(t==".")return E();if(t=="/")return w();if(HOP(OPERATOR_CHARS,t))return b(
);if(t=="\\"||is_identifier_start(t))return S();l("Unexpected character '"+t+"'")}var t={text:e.replace(/\r\n?|[\n\u2028\u2029]/g,"\n").replace(/^\uFEFF/,""),pos:0,tokpos:0,line:0,tokline:0,col:0,tokcol:0,newline_before:!1,regex_allowed:!1,comments_before:[
]};return T.context=function(e){return e&&(t=e),t},T}function NodeWithToken(e,t,n){this.name=e,this.start=t,this.end=n}function parse(e,t,n){function i(e,t){return is_token(r.token,e,t)}function s(){return r.peeked||(r.peeked=r.input())}function o(){return r
.prev=r.token,r.peeked?(r.token=r.peeked,r.peeked=null):r.token=r.input(),r.in_directives=r.in_directives&&(r.token.type=="string"||i("punc",";")),r.token}function u(){return r.prev}function a(e,t,n,i){var s=r.input.context();js_error(e,t!=null?t:s.tokline,
n!=null?n:s.tokcol,i!=null?i:s.tokpos)}function f(e,t){a(t,e.line,e.col)}function l(e){e==null&&(e=r.token),f(e,"Unexpected token: "+e.type+" ("+e.value+")")}function c(e,t){if(i(e,t))return o();f(r.token,"Unexpected token "+r.token.type+", expected "+e)}function h
(e){return c("punc",e)}function p(){return!t&&(r.token.nlb||i("eof")||i("punc","}"))}function d(){i("punc",";")?o():p()||l()}function v(){return slice(arguments)}function m(){h("(");var e=K();return h(")"),e}function g(e,t,n){return e instanceof NodeWithToken?
e:new NodeWithToken(e,t,n)}function y(e){return n?function(){var t=r.token,n=e.apply(this,arguments);return n[0]=g(n[0],t,u()),n}:e}function w(e){r.labels.push(e);var n=r.token,i=b();return t&&!HOP(STATEMENTS_WITH_LABELS,i[0])&&l(n),r.labels.pop(),v("label"
,e,i)}function E(){return v("stat",prog1(K,d))}function S(e){var t;return p()||(t=i("name")?r.token.value:null),t!=null?(o(),member(t,r.labels)||a("Label "+t+" without matching loop or statement")):r.in_loop==0&&a(e+" not inside a loop or switch"),d(),v(e,t
)}function x(){h("(");var e=null;if(!i("punc",";")){e=i("keyword","var")?(o(),_(!0)):K(!0,!0);if(i("operator","in"))return e[0]=="var"&&e[1].length>1&&a("Only one variable declaration allowed in for..in loop"),N(e)}return T(e)}function T(e){h(";");var t=i("punc"
,";")?null:K();h(";");var n=i("punc",")")?null:K();return h(")"),v("for",e,t,n,Q(b))}function N(e){var t=e[0]=="var"?v("name",e[1][0]):e;o();var n=K();return h(")"),v("for-in",e,t,n,Q(b))}function k(){var e=m(),t=b(),n;return i("keyword","else")&&(o(),n=b()
),v("if",e,t,n)}function L(){h("{");var e=[];while(!i("punc","}"))i("eof")&&l(),e.push(b());return o(),e}function O(){var e=L(),t,n;if(i("keyword","catch")){o(),h("("),i("name")||a("Name expected");var s=r.token.value;o(),h(")"),t=[s,L()]}return i("keyword"
,"finally")&&(o(),n=L()),!t&&!n&&a("Missing catch/finally blocks"),v("try",e,t,n)}function M(e){var t=[];for(;;){i("name")||l();var n=r.token.value;o(),i("operator","=")?(o(),t.push([n,K(!1,e)])):t.push([n]);if(!i("punc",","))break;o()}return t}function _(e
){return v("var",M(e))}function D(){return v("const",M())}function P(){var e=H(!1),t;return i("punc","(")?(o(),t=B(")")):t=[],R(v("new",e,t),!0)}function B(e,t,n){var r=!0,s=[];while(!i("punc",e)){r?r=!1:h(",");if(t&&i("punc",e))break;i("punc",",")&&n?s.push
(["atom","undefined"]):s.push(K(!1))}return o(),s}function j(){return v("array",B("]",!t,!0))}function F(){var e=!0,n=[];while(!i("punc","}")){e?e=!1:h(",");if(!t&&i("punc","}"))break;var s=r.token.type,u=I();s!="name"||u!="get"&&u!="set"||!!i("punc",":")?(
h(":"),n.push([u,K(!1)])):n.push([q(),C(!1),u])}return o(),v("object",n)}function I(){switch(r.token.type){case"num":case"string":return prog1(r.token.value,o)}return q()}function q(){switch(r.token.type){case"name":case"operator":case"keyword":case"atom":return prog1
(r.token.value,o);default:l()}}function R(e,t){return i("punc",".")?(o(),R(v("dot",e,q()),t)):i("punc","[")?(o(),R(v("sub",e,prog1(K,curry(h,"]"))),t)):t&&i("punc","(")?(o(),R(v("call",e,B(")")),!0)):e}function U(e){if(i("operator")&&HOP(UNARY_PREFIX,r.token
.value))return z("unary-prefix",prog1(r.token.value,o),U(e));var t=H(e);while(i("operator")&&HOP(UNARY_POSTFIX,r.token.value)&&!r.token.nlb)t=z("unary-postfix",r.token.value,t),o();return t}function z(e,t,n){return(t=="++"||t=="--")&&!$(n)&&a("Invalid use of "+
t+" operator"),v(e,t,n)}function W(e,t,n){var s=i("operator")?r.token.value:null;s&&s=="in"&&n&&(s=null);var u=s!=null?PRECEDENCE[s]:null;if(u!=null&&u>t){o();var a=W(U(!0),u,n);return W(v("binary",s,e,a),t,n)}return e}function X(e){return W(U(!0),0,e)}function V
(e){var t=X(e);if(i("operator","?")){o();var n=K(!1);return h(":"),v("conditional",t,n,K(!1,e))}return t}function $(e){if(!t)return!0;switch(e[0]+""){case"dot":case"sub":case"new":case"call":return!0;case"name":return e[1]!="this"}}function J(e){var t=V(e),
n=r.token.value;if(i("operator")&&HOP(ASSIGNMENT,n)){if($(t))return o(),v("assign",ASSIGNMENT[n],t,J(e));a("Invalid assignment")}return t}function Q(e){try{return++r.in_loop,e()}finally{--r.in_loop}}var r={input:typeof e=="string"?tokenizer(e,!0):e,token:null
,prev:null,peeked:null,in_function:0,in_directives:!0,in_loop:0,labels:[]};r.token=o();var b=y(function(){if(i("operator","/")||i("operator","/="))r.peeked=null,r.token=r.input(r.token.value.substr(1));switch(r.token.type){case"string":var e=r.in_directives
,t=E();if(e&&t[1][0]=="string"&&!i("punc",","))return v("directive",t[1][1]);return t;case"num":case"regexp":case"operator":case"atom":return E();case"name":return is_token(s(),"punc",":")?w(prog1(r.token.value,o,o)):E();case"punc":switch(r.token.value){case"{"
:return v("block",L());case"[":case"(":return E();case";":return o(),v("block");default:l()};case"keyword":switch(prog1(r.token.value,o)){case"break":return S("break");case"continue":return S("continue");case"debugger":return d(),v("debugger");case"do":return function(
e){return c("keyword","while"),v("do",prog1(m,d),e)}(Q(b));case"for":return x();case"function":return C(!0);case"if":return k();case"return":return r.in_function==0&&a("'return' outside of function"),v("return",i("punc",";")?(o(),null):p()?null:prog1(K,d));
case"switch":return v("switch",m(),A());case"throw":return r.token.nlb&&a("Illegal newline after 'throw'"),v("throw",prog1(K,d));case"try":return O();case"var":return prog1(_,d);case"const":return prog1(D,d);case"while":return v("while",m(),Q(b));case"with"
:return v("with",m(),b());default:l()}}}),C=function(e){var t=i("name")?prog1(r.token.value,o):null;return e&&!t&&l(),h("("),v(e?"defun":"function",t,function(e,t){while(!i("punc",")"))e?e=!1:h(","),i("name")||l(),t.push(r.token.value),o();return o(),t}(!0,
[]),function(){++r.in_function;var e=r.in_loop;r.in_directives=!0,r.in_loop=0;var t=L();return--r.in_function,r.in_loop=e,t}())},A=curry(Q,function(){h("{");var e=[],t=null;while(!i("punc","}"))i("eof")&&l(),i("keyword","case")?(o(),t=[],e.push([K(),t]),h(":"
)):i("keyword","default")?(o(),h(":"),t=[],e.push([null,t])):(t||l(),t.push(b()));return o(),e}),H=y(function(e){if(i("operator","new"))return o(),P();if(i("punc")){switch(r.token.value){case"(":return o(),R(prog1(K,curry(h,")")),e);case"[":return o(),R(j()
,e);case"{":return o(),R(F(),e)}l()}if(i("keyword","function"))return o(),R(C(!1),e);if(HOP(ATOMIC_START_TOKEN,r.token.type)){var t=r.token.type=="regexp"?v("regexp",r.token.value[0],r.token.value[1]):v(r.token.type,r.token.value);return R(prog1(t,o),e)}l()
}),K=y(function(e,t){arguments.length==0&&(e=!0);var n=J(t);return e&&i("punc",",")?(o(),v("seq",n,K(!0,t))):n});return v("toplevel",function(e){while(!i("eof"))e.push(b());return e}([]))}function curry(e){var t=slice(arguments,1);return function(){return e
.apply(this,t.concat(slice(arguments)))}}function prog1(e){e instanceof Function&&(e=e());for(var t=1,n=arguments.length;--n>0;++t)arguments[t]();return e}function array_to_hash(e){var t={};for(var n=0;n<e.length;++n)t[e[n]]=!0;return t}function slice(e,t){
return Array.prototype.slice.call(e,t||0)}function characters(e){return e.split("")}function member(e,t){for(var n=t.length;--n>=0;)if(t[n]==e)return!0;return!1}function HOP(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var KEYWORDS=array_to_hash(["break"
,"case","catch","const","continue","debugger","default","delete","do","else","finally","for","function","if","in","instanceof","new","return","switch","throw","try","typeof","var","void","while","with"]),RESERVED_WORDS=array_to_hash(["abstract","boolean","byte"
,"char","class","double","enum","export","extends","final","float","goto","implements","import","int","interface","long","native","package","private","protected","public","short","static","super","synchronized","throws","transient","volatile"]),KEYWORDS_BEFORE_EXPRESSION=
array_to_hash(["return","new","delete","throw","else","case"]),KEYWORDS_ATOM=array_to_hash(["false","null","true","undefined"]),OPERATOR_CHARS=array_to_hash(characters("+-*&%=<>!?|~^")),RE_HEX_NUMBER=/^0x[0-9a-f]+$/i,RE_OCT_NUMBER=/^0[0-7]+$/,RE_DEC_NUMBER=/^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i
,OPERATORS=array_to_hash(["in","instanceof","typeof","new","void","delete","++","--","+","-","!","~","&","|","^","*","/","%",">>","<<",">>>","<",">","<=",">=","==","===","!=","!==","?","=","+=","-=","/=","*=","%=",">>=","<<=",">>>=","|=","^=","&=","&&","||"
]),WHITESPACE_CHARS=array_to_hash(characters(" \u00a0\n\r	\f\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\ufeff")),PUNC_BEFORE_EXPRESSION=array_to_hash(characters("[{(,.;:")),PUNC_CHARS=array_to_hash(characters
("[]{}(),;:")),REGEXP_MODIFIERS=array_to_hash(characters("gmsiy")),UNICODE={letter:new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F0\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"
),combining_mark:new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0859-\\u085B\\u08E4-\\u08FE\\u0900-\\u0903\\u093A-\\u093C\\u093E-\\u094F\\u0951-\\u0957\\u0962\\u0963\\u0981-\\u0983\\u09BC\\u09BE-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CD\\u09D7\\u09E2\\u09E3\\u0A01-\\u0A03\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81-\\u0A83\\u0ABC\\u0ABE-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AE2\\u0AE3\\u0B01-\\u0B03\\u0B3C\\u0B3E-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B62\\u0B63\\u0B82\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD7\\u0C01-\\u0C03\\u0C3E-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0C82\\u0C83\\u0CBC\\u0CBE-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CE2\\u0CE3\\u0D02\\u0D03\\u0D3E-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4D\\u0D57\\u0D62\\u0D63\\u0D82\\u0D83\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F3E\\u0F3F\\u0F71-\\u0F84\\u0F86\\u0F87\\u0F8D-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102B-\\u103E\\u1056-\\u1059\\u105E-\\u1060\\u1062-\\u1064\\u1067-\\u106D\\u1071-\\u1074\\u1082-\\u108D\\u108F\\u109A-\\u109D\\u135D-\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B4-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u192B\\u1930-\\u193B\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A17-\\u1A1B\\u1A55-\\u1A5E\\u1A60-\\u1A7C\\u1A7F\\u1B00-\\u1B04\\u1B34-\\u1B44\\u1B6B-\\u1B73\\u1B80-\\u1B82\\u1BA1-\\u1BAD\\u1BE6-\\u1BF3\\u1C24-\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE8\\u1CED\\u1CF2-\\u1CF4\\u1DC0-\\u1DE6\\u1DFC-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2D7F\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA674-\\uA67D\\uA69F\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA823-\\uA827\\uA880\\uA881\\uA8B4-\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA953\\uA980-\\uA983\\uA9B3-\\uA9C0\\uAA29-\\uAA36\\uAA43\\uAA4C\\uAA4D\\uAA7B\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uAAEB-\\uAAEF\\uAAF5\\uAAF6\\uABE3-\\uABEA\\uABEC\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"
),connector_punctuation:new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]"),digit:new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]"
)};JS_Parse_Error.prototype.toString=function(){return this.message+" (line: "+this.line+", col: "+this.col+", pos: "+this.pos+")"+"\n\n"+this.stack};var EX_EOF={},UNARY_PREFIX=array_to_hash(["typeof","void","delete","--","++","!","~","-","+"]),UNARY_POSTFIX=
array_to_hash(["--","++"]),ASSIGNMENT=function(e,t,n){while(n<e.length)t[e[n]]=e[n].substr(0,e[n].length-1),n++;return t}(["+=","-=","/=","*=","%=",">>=","<<=",">>>=","|=","^=","&="],{"=":!0},0),PRECEDENCE=function(e,t){for(var n=0,r=1;n<e.length;++n,++r){var i=
e[n];for(var s=0;s<i.length;++s)t[i[s]]=r}return t}([["||"],["&&"],["|"],["^"],["&"],["==","===","!=","!=="],["<",">","<=",">=","in","instanceof"],[">>","<<",">>>"],["+","-"],["*","/","%"]],{}),STATEMENTS_WITH_LABELS=array_to_hash(["for","do","while","switch"
]),ATOMIC_START_TOKEN=array_to_hash(["atom","num","string","regexp","name"]);NodeWithToken.prototype.toString=function(){return this.name};var warn=function(){};exports.tokenizer=tokenizer,exports.parse=parse,exports.slice=slice,exports.curry=curry,exports.
member=member,exports.array_to_hash=array_to_hash,exports.PRECEDENCE=PRECEDENCE,exports.KEYWORDS_ATOM=KEYWORDS_ATOM,exports.RESERVED_WORDS=RESERVED_WORDS,exports.KEYWORDS=KEYWORDS,exports.ATOMIC_START_TOKEN=ATOMIC_START_TOKEN,exports.OPERATORS=OPERATORS,exports
.is_alphanumeric_char=is_alphanumeric_char,exports.is_identifier_start=is_identifier_start,exports.is_identifier_char=is_identifier_char,exports.set_logger=function(e){warn=e}



// init lib process
// https://github.com/mishoo/UglifyJS/blob/v1.3.5/lib/process.js
// utility2-uglifyjs https://raw.githubusercontent.com/mishoo/UglifyJS/v1.3.5/lib/process.js
// remove extra "return":a
function ast_walker(){function e(e){return[this[0],MAP(e,function(e){var t=[e[0]];return e.length>1&&(t[1]=s(e[1])),t})]}function t(e){var t=[this[0]];return e!=null&&t.push(MAP(e,s)),t}function s(e){if(e==null)return null;try{i.push(e);var t=e[0],s=r[t];if(
s){var o=s.apply(e,e.slice(1));if(o!=null)return o}return s=n[t],s.apply(e,e.slice(1))}finally{i.pop()}}function o(e){if(e==null)return null;try{return i.push(e),n[e[0]].apply(e,e.slice(1))}finally{i.pop()}}function u(e,t){var n={},i;for(i in e)HOP(e,i)&&(n
[i]=r[i],r[i]=e[i]);var s=t();for(i in n)HOP(n,i)&&(n[i]?r[i]=n[i]:delete r[i]);return s}var n={string:function(e){return[this[0],e]},num:function(e){return[this[0],e]},name:function(e){return[this[0],e]},toplevel:function(e){return[this[0],MAP(e,s)]},block
:t,splice:t,"var":e,"const":e,"try":function(e,t,n){return[this[0],MAP(e,s),t!=null?[t[0],MAP(t[1],s)]:null,n!=null?MAP(n,s):null]},"throw":function(e){return[this[0],s(e)]},"new":function(e,t){return[this[0],s(e),MAP(t,s)]},"switch":function(e,t){return[this
[0],s(e),MAP(t,function(e){return[e[0]?s(e[0]):null,MAP(e[1],s)]})]},"break":function(e){return[this[0],e]},"continue":function(e){return[this[0],e]},conditional:function(e,t,n){return[this[0],s(e),s(t),s(n)]},assign:function(e,t,n){return[this[0],e,s(t),s(
n)]},dot:function(e){return[this[0],s(e)].concat(slice(arguments,1))},call:function(e,t){return[this[0],s(e),MAP(t,s)]},"function":function(e,t,n){return[this[0],e,t.slice(),MAP(n,s)]},"debugger":function(){return[this[0]]},defun:function(e,t,n){return[this
[0],e,t.slice(),MAP(n,s)]},"if":function(e,t,n){return[this[0],s(e),s(t),s(n)]},"for":function(e,t,n,r){return[this[0],s(e),s(t),s(n),s(r)]},"for-in":function(e,t,n,r){return[this[0],s(e),s(t),s(n),s(r)]},"while":function(e,t){return[this[0],s(e),s(t)]},"do"
:function(e,t){return[this[0],s(e),s(t)]},"return":function(e){return[this[0],s(e)]},binary:function(e,t,n){return[this[0],e,s(t),s(n)]},"unary-prefix":function(e,t){return[this[0],e,s(t)]},"unary-postfix":function(e,t){return[this[0],e,s(t)]},sub:function(
e,t){return[this[0],s(e),s(t)]},object:function(e){return[this[0],MAP(e,function(e){return e.length==2?[e[0],s(e[1])]:[e[0],s(e[1]),e[2]]})]},regexp:function(e,t){return[this[0],e,t]},array:function(e){return[this[0],MAP(e,s)]},stat:function(e){return[this[0
],s(e)]},seq:function(){return[this[0]].concat(MAP(slice(arguments),s))},label:function(e,t){return[this[0],e,s(t)]},"with":function(e,t){return[this[0],s(e),s(t)]},atom:function(e){return[this[0],e]},directive:function(e){return[this[0],e]}},r={},i=[];return{
walk:s,dive:o,with_walkers:u,parent:function(){return i[i.length-2]},stack:function(){return i}}}function Scope(e){this.names={},this.mangled={},this.rev_mangled={},this.cname=-1,this.refs={},this.uses_with=!1,this.uses_eval=!1,this.directives=[],this.parent=
e,this.children=[],e?(this.level=e.level+1,e.children.push(this)):this.level=0}function base54_digits(){return typeof DIGITS_OVERRIDE_FOR_TESTING!="undefined"?DIGITS_OVERRIDE_FOR_TESTING:"etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXV$JKQGYZ0516372984"}function ast_add_scope
(e){function s(e){t=new Scope(t),t.labels=new Scope;var n=t.body=e();return n.scope=t,t=t.parent,n}function o(e,n){return t.define(e,n)}function u(e){t.refs[e]=!0}function a(e,t,n){var i=this[0]=="defun";return[this[0],i?o(e,"defun"):e,t,s(function(){return i||
o(e,"lambda"),MAP(t,function(e){o(e,"arg")}),MAP(n,r)})]}function f(e){return function(t){MAP(t,function(t){o(t[0],e),t[1]&&u(t[0])})}}function l(e){e&&(t.labels.refs[e]=!0)}var t=null,n=ast_walker(),r=n.walk,i=[];return s(function(){function c(e,t){for(t=e
.children.length;--t>=0;)c(e.children[t]);for(t in e.refs)if(HOP(e.refs,t))for(var n=e.has(t),r=e;r;r=r.parent){r.refs[t]=n;if(r===n)break}}var s=n.with_walkers({"function":a,defun:a,label:function(e,n){t.labels.define(e)},"break":l,"continue":l,"with":function(
e,n){for(var r=t;r;r=r.parent)r.uses_with=!0},"var":f("var"),"const":f("const"),"try":function(e,t,n){if(t!=null)return[this[0],MAP(e,r),[o(t[0],"catch"),MAP(t[1],r)],n!=null?MAP(n,r):null]},name:function(e){e=="eval"&&i.push(t),u(e)}},function(){return r(e
)});return MAP(i,function(e){if(!e.has("eval"))while(e)e.uses_eval=!0,e=e.parent}),c(t),s})}function ast_mangle(e,t){function s(e,n){return t.mangle?!t.toplevel&&!i.parent?e:t.except&&member(e,t.except)?e:t.no_functions&&HOP(i.names,e)&&(i.names[e]=="defun"||
i.names[e]=="lambda")?e:i.get_mangled(e,n):e}function o(e){if(t.defines)return!i.has(e)&&HOP(t.defines,e)?t.defines[e]:null}function u(e,n,o){if(!t.no_functions&&t.mangle){var u=this[0]=="defun",f;e&&(u?e=s(e):o.scope.references(e)?(f={},!i.uses_eval&&!i.uses_with?
e=f[e]=i.next_mangled():f[e]=e):e=null)}return o=a(o.scope,function(){return n=MAP(n,function(e){return s(e)}),MAP(o,r)},f),[this[0],e,n,o]}function a(e,t,n){var r=i;i=e;if(n)for(var o in n)HOP(n,o)&&e.set_mangle(o,n[o]);for(var o in e.names)HOP(e.names,o)&&
s(o,!0);var u=t();return u.scope=e,i=r,u}function f(e){return[this[0],MAP(e,function(e){return[s(e[0]),r(e[1])]})]}function l(e){if(e)return[this[0],i.labels.get_mangled(e)]}var n=ast_walker(),r=n.walk,i;return t=defaults(t,{mangle:!0,toplevel:!1,defines:null
,except:null,no_functions:!1}),n.with_walkers({"function":u,defun:function(){var e=u.apply(this,arguments);switch(n.parent()[0]){case"toplevel":case"function":case"defun":return MAP.at_top(e)}return e},label:function(e,t){return i.labels.refs[e]?[this[0],i.
labels.get_mangled(e,!0),r(t)]:r(t)},"break":l,"continue":l,"var":f,"const":f,name:function(e){return o(e)||[this[0],s(e)]},"try":function(e,t,n){return[this[0],MAP(e,r),t!=null?[s(t[0]),MAP(t[1],r)]:null,n!=null?MAP(n,r):null]},toplevel:function(e){var t=this
;return a(t.scope,function(){return[t[0],MAP(e,r)]})},directive:function(){return MAP.at_top(this)}},function(){return r(ast_add_scope(e))})}function best_of(e,t){return gen_code(e).length>gen_code(t[0]=="stat"?t[1]:t).length?t:e}function last_stat(e){return e
[0]=="block"&&e[1]&&e[1].length>0?e[1][e[1].length-1]:e}function aborts(e){if(e)switch(last_stat(e)[0]){case"return":case"break":case"continue":case"throw":return!0}}function boolean_expr(e){return e[0]=="unary-prefix"&&member(e[1],["!","delete"])||e[0]=="binary"&&
member(e[1],["in","instanceof","==","!=","===","!==","<","<=",">=",">"])||e[0]=="binary"&&member(e[1],["&&","||"])&&boolean_expr(e[2])&&boolean_expr(e[3])||e[0]=="conditional"&&boolean_expr(e[2])&&boolean_expr(e[3])||e[0]=="assign"&&e[1]===!0&&boolean_expr(
e[3])||e[0]=="seq"&&boolean_expr(e[e.length-1])}function empty(e){return!e||e[0]=="block"&&(!e[1]||e[1].length==0)}function is_string(e){return e[0]=="string"||e[0]=="unary-prefix"&&e[1]=="typeof"||e[0]=="binary"&&e[1]=="+"&&(is_string(e[2])||is_string(e[3]
))}function warn_unreachable(e){empty(e)||warn("Dropping unreachable code: "+gen_code(e,!0))}function prepare_ifs(e){function r(e){e=MAP(e,n);for(var t=0;t<e.length;++t){var i=e[t];if(i[0]!="if")continue;if(i[3])continue;var s=i[2];if(!aborts(s))continue;var o=
n(i[1]),u=r(e.slice(t+1)),a=u.length==1?u[0]:["block",u];return e.slice(0,t).concat([[i[0],o,s,a]])}return e}function i(e,t,n){return n=r(n),[this[0],e,t,n]}function s(e){return[this[0],e!=null?r(e):null]}var t=ast_walker(),n=t.walk;return t.with_walkers({defun
:i,"function":i,block:s,splice:s,toplevel:function(e){return[this[0],r(e)]},"try":function(e,t,n){return[this[0],r(e),t!=null?[t[0],r(t[1])]:null,n!=null?r(n):null]}},function(){return n(e)})}function for_side_effects(e,t){function o(){throw i}function u(){
throw s}function a(){return t.call(this,this,n,o,u)}function f(e){if(e=="++"||e=="--")return a.apply(this,arguments)}function l(e){if(e=="&&"||e=="||")return a.apply(this,arguments)}var n=ast_walker(),r=n.walk,i={},s={};return n.with_walkers({"try":a,"throw"
:a,"return":a,"new":a,"switch":a,"break":a,"continue":a,assign:a,call:a,"if":a,"for":a,"for-in":a,"while":a,"do":a,"unary-prefix":f,"unary-postfix":f,conditional:a,binary:l,defun:a},function(){for(;;)try{r(e);break}catch(t){if(t===i)break;if(t===
s)continue;throw t}})}function ast_lift_variables(e){function i(e,t){var i=r;r=t,e=MAP(e,n);var s={},o=MAP(t.names,function(e,n){return e!="var"?MAP.skip:t.references(n)?(s[n]=!0,[n]):MAP.skip});return o.length>0&&(for_side_effects(["block",e],function(e,t,
n,r){if(e[0]=="assign"&&e[1]===!0&&e[2][0]=="name"&&HOP(s,e[2][1])){for(var i=o.length;--i>=0;)if(o[i][0]==e[2][1]){o[i][1]&&n(),o[i][1]=e[3],o.push(o.splice(i,1)[0]);break}var u=t.parent();if(u[0]=="seq"){var a=u[2];a.unshift(0,u.length),u.splice.apply(u,a
)}else u[0]=="stat"?u.splice(0,u.length,"block"):n();r()}n()}),e.unshift(["var",o])),r=i,e}function s(e){var n=null;for(var r=e.length;--r>=0;){var i=e[r];if(!i[1])continue;i=["assign",!0,["name",i[0]],i[1]],n==null?n=i:n=["seq",i,n]}return n==null&&t.parent
()[0]!="for"?t.parent()[0]=="for-in"?["name",e[0][0]]:MAP.skip:["stat",n]}function o(e){return[this[0],i(e,this.scope)]}var t=ast_walker(),n=t.walk,r;return t.with_walkers({"function":function(e,t,n){for(var r=t.length;--r>=0&&!n.scope.references(t[r]);)t.pop
();return n.scope.references(e)||(e=null),[this[0],e,t,i(n,n.scope)]},defun:function(e,t,n){if(!r.references(e))return MAP.skip;for(var s=t.length;--s>=0&&!n.scope.references(t[s]);)t.pop();return[this[0],e,t,i(n,n.scope)]},"var":s,toplevel:o},function(){return n
(ast_add_scope(e))})}function ast_squeeze(e,t){return e=squeeze_1(e,t),e=squeeze_2(e,t),e}function squeeze_1(e,t){function s(e){var n=["unary-prefix","!",e];switch(e[0]){case"unary-prefix":return e[1]=="!"&&boolean_expr(e[2])?e[2]:n;case"seq":return e=slice
(e),e[e.length-1]=s(e[e.length-1]),e;case"conditional":return best_of(n,["conditional",e[1],s(e[2]),s(e[3])]);case"binary":var r=e[1],i=e[2],o=e[3];if(!t.keep_comps)switch(r){case"<=":return["binary",">",i,o];case"<":return["binary",">=",i,o];case">=":return["binary"
,"<",i,o];case">":return["binary","<=",i,o]}switch(r){case"==":return["binary","!=",i,o];case"!=":return["binary","==",i,o];case"===":return["binary","!==",i,o];case"!==":return["binary","===",i,o];case"&&":return best_of(n,["binary","||",s(i),s(o)]);case"||"
:return best_of(n,["binary","&&",s(i),s(o)])}}return n}function o(e,t,n){var r=function(){return e[0]=="unary-prefix"&&e[1]=="!"?n?["conditional",e[2],n,t]:["binary","||",e[2],t]:n?best_of(["conditional",e,t,n],["conditional",s(e),n,t]):["binary","&&",e,t]}
;return when_constant(e,function(e,r){return warn_unreachable(r?n:t),r?t:n},r)}function u(e){return e!=null&&e[0]=="block"&&e[1]&&(e[1].length==1?e=e[1][0]:e[1].length==0&&(e=["block"])),e}function a(e,t,n){return[this[0],e,t,f(n,"lambda")]}function f(e,n){
return e=MAP(e,r),e=e.reduce(function(e,t){return t[0]=="block"?t[1]&&e.push.apply(e,t[1]):e.push(t),e},[]),e=function(t,n){return e.forEach(function(e){n&&(e[0]=="var"&&n[0]=="var"||e[0]=="const"&&n[0]=="const")?n[1]=n[1].concat(e[1]):(t.push(e),n=e)}),t}(
[]),t.dead_code&&(e=function(n,r){return e.forEach(function(e){r?e[0]=="function"||e[0]=="defun"?n.push(e):e[0]=="var"||e[0]=="const"?(t.no_warnings||warn("Variables declared in unreachable code"),e[1]=MAP(e[1],function(e){return e[1]&&!t.no_warnings&&warn_unreachable
(["assign",!0,["name",e[0]],e[1]]),[e[0]]}),n.push(e)):t.no_warnings||warn_unreachable(e):(n.push(e),member(e[0],["return","throw","break","continue"])&&(r=!0))}),n}([])),t.make_seqs&&(e=function(t,n){return e.forEach(function(e){n&&n[0]=="stat"&&e[0]=="stat"?
n[1]=["seq",n[1],e[1]]:(t.push(e),n=e)}),t.length>=2&&t[t.length-2][0]=="stat"&&(t[t.length-1][0]=="return"||t[t.length-1][0]=="throw")&&t[t.length-1][1]&&t.splice(t.length-2,2,[t[t.length-1][0],["seq",t[t.length-2][1],t[t.length-1][1]]]),t}([])),e}function l
(e,t,n){return when_constant(e,function(e,i){return i?(t=r(t),warn_unreachable(n),t||["block"]):(n=r(n),warn_unreachable(t),n||["block"])},function(){return h(e,t,n)})}function c(e,t,n){var i=[["if",s(e),n]];return t[0]=="block"?t[1]&&(i=i.concat(t[1])):i.push
(t),r(["block",i])}function h(e,t,n){e=r(e),t=r(t),n=r(n);if(empty(n)&&empty(t))return["stat",e];empty(t)?(e=s(e),t=n,n=null):empty(n)?n=null:function(){var r=gen_code(e),i=s(e),o=gen_code(i);if(o.length<r.length){var u=t;t=n,n=u,e=i}}();var i=["if",e,t,n];
return t[0]=="if"&&empty(t[3])&&empty(n)?i=best_of(i,r(["if",["binary","&&",e,t[1]],t[2]])):t[0]=="stat"?n?n[0]=="stat"?i=best_of(i,["stat",o(e,t[1],n[1])]):aborts(n)&&(i=c(e,t,n)):i=best_of(i,["stat",o(e,t[1])]):n&&t[0]==n[0]&&(t[0]=="return"||t[0]=="throw"
)&&t[1]&&n[1]?i=best_of(i,[t[0],o(e,t[1],n[1])]):n&&aborts(t)?(i=[["if",e,t]],n[0]=="block"?n[1]&&(i=i.concat(n[1])):i.push(n),i=r(["block",i])):t&&aborts(n)&&(i=c(e,t,n)),i}function p(e,t){return when_constant(e,function(e,n){return n?["for",null,null,null
,r(t)]:(warn_unreachable(t),["block"])})}t=defaults(t,{make_seqs:!0,dead_code:!0,no_warnings:!1,keep_comps:!0,unsafe:!1});var n=ast_walker(),r=n.walk,i;return n.with_walkers({sub:function(e,t){if(t[0]=="string"){var n=t[1];if(is_identifier(n))return["dot",r
(e),n];if(/^[1-9][0-9]*$/.test(n)||n==="0")return["sub",r(e),["num",parseInt(n,10)]]}},"if":l,toplevel:function(e){return["toplevel",f(e)]},"switch":function(e,t){var n=t.length-1;return["switch",r(e),MAP(t,function(e,t){var i=f(e[1]);if(t==n&&i.length>0){var s=
i[i.length-1];s[0]=="break"&&!s[1]&&i.pop()}return[e[0]?r(e[0]):null,i]})]},"function":a,defun:a,block:function(e){if(e)return u(["block",f(e)])},binary:function(e,t,n){return when_constant(["binary",e,r(t),r(n)],function(t){return best_of(r(t),this)},function(
){return function(){if(e!="=="&&e!="!=")return;var i=r(t),s=r(n);return i&&i[0]=="unary-prefix"&&i[1]=="!"&&i[2][0]=="num"?t=["num",+!i[2][1]]:s&&s[0]=="unary-prefix"&&s[1]=="!"&&s[2][0]=="num"&&(n=["num",+!s[2][1]]),["binary",e,t,n]}()||this})},conditional
:function(e,t,n){return o(r(e),r(t),r(n))},"try":function(e,t,n){return["try",f(e),t!=null?[t[0],f(t[1])]:null,n!=null?f(n):null]},"unary-prefix":function(e,t){t=r(t);var n=["unary-prefix",e,t];return e=="!"&&(n=best_of(n,s(t))),when_constant(n,function(e,t
){return r(e)},function(){return n})},name:function(e){switch(e){case"true":return["unary-prefix","!",["num",0]];case"false":return["unary-prefix","!",["num",1]]}},"while":p,assign:function(e,t,n){t=r(t),n=r(n);var i=["+","-","/","*","%",">>","<<",">>>","|"
,"^","&"];return e===!0&&t[0]==="name"&&n[0]==="binary"&&~i.indexOf(n[1])&&n[2][0]==="name"&&n[2][1]===t[1]?[this[0],n[1],t,n[3]]:[this[0],e,t,n]},call:function(e,n){return e=r(e),t.unsafe&&e[0]=="dot"&&e[1][0]=="string"&&e[2]=="toString"?e[1]:[this[0],e,MAP
(n,r)]},num:function(e){return isFinite(e)?[this[0],e]:["binary","/",e===1/0?["num",1]:e===-1/0?["unary-prefix","-",["num",1]]:["num",0],["num",0]]}},function(){return r(prepare_ifs(r(prepare_ifs(e))))})}function squeeze_2(e,t){function s(e,t){var n=i,r;return i=
e,r=t(),i=n,r}function o(e,t,n){return[this[0],e,t,s(n.scope,curry(MAP,n,r))]}var n=ast_walker(),r=n.walk,i;return n.with_walkers({directive:function(e){if(i.active_directive(e))return["block"];i.directives.push(e)},toplevel:function(e){return[this[0],s(this
.scope,curry(MAP,e,r))]},"function":o,defun:o},function(){return r(ast_add_scope(e))})}function make_string(e,t){var n=0,r=0;return e=e.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g,function(e){switch(e){case"\\":return"\\\\";case"\b":return"\\b";case"\f"
:return"\\f";case"\n":return"\\n";case"\r":return"\\r";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";case'"':return++n,'"';case"'":return++r,"'";case"\0":return"\\0"}return e}),t&&(e=to_ascii(e)),n>r?"'"+e.replace(/\x27/g,"\\'")+"'":'"'+e.replace
(/\x22/g,'\\"')+'"'}function to_ascii(e){return e.replace(/[\u0080-\uffff]/g,function(e){var t=e.charCodeAt(0).toString(16);while(t.length<4)t="0"+t;return"\\u"+t})}function gen_code(e,t){function o(e){var n=make_string(e,t.ascii_only);return t.inline_script&&
(n=n.replace(/<\x2fscript([>\/\t\n\f\r ])/gi,"<\\/script$1")),n}function u(e){return e=e.toString(),t.ascii_only&&(e=to_ascii(e)),e}function a(e){return e==null&&(e=""),n&&(e=repeat_string(" ",t.indent_start+r*t.indent_level)+e),e}function f(e,t){t==null&&(
t=1),r+=t;try{return e.apply(null,slice(arguments,1))}finally{r-=t}}function l(e){return e=e.toString(),e.charAt(e.length-1)}function c(e){return e.toString().charAt(0)}function h(e){if(n)return e.join(" ");var t=[];for(var r=0;r<e.length;++r){var i=e[r+1];
t.push(e[r]),i&&(is_identifier_char(l(e[r]))&&(is_identifier_char(c(i))||c(i)=="\\")||/[\+\-]$/.test(e[r].toString())&&/^[\+\-]/.test(i.toString())||l(e[r])=="/"&&c(i)=="/")&&t.push(" ")}return t.join("")}function p(e){return e.join(","+s)}function d(e){var t=
b(e);for(var n=1;n<arguments.length;++n){var r=arguments[n];if(r instanceof Function&&r(e)||e[0]==r)return"("+t+")"}return t}function v(e){if(e.length==1)return e[0];if(e.length==2){var t=e[1];return e=e[0],e.length<=t.length?e:t}return v([e[0],v(e.slice(1)
)])}function m(e){if(e[0]=="function"||e[0]=="object"){var t=slice(y.stack()),n=t.pop(),r=t.pop();while(r){if(r[0]=="stat")return!0;if((r[0]!="seq"&&r[0]!="call"&&r[0]!="dot"&&r[0]!="sub"&&r[0]!="conditional"||r[1]!==n)&&(r[0]!="binary"&&r[0]!="assign"&&r[0
]!="unary-postfix"||r[2]!==n))return!1;n=r,r=t.pop()}}return!HOP(DOT_CALL_NO_PARENS,e[0])}function g(e){var t=e.toString(10),n=[t.replace(/^0\./,".").replace("e+","e")],r;return Math.floor(e)===e?(e>=0?n.push("0x"+e.toString(16).toLowerCase(),"0"+e.toString
(8)):n.push("-0x"+(-e).toString(16).toLowerCase(),"-0"+(-e).toString(8)),(r=/^(.*?)(0+)$/.exec(e))&&n.push(r[1]+"e"+r[2].length)):(r=/^0?\.(0+)(.*)$/.exec(e))&&n.push(r[2]+"e-"+(r[1].length+r[2].length),t.substr(t.indexOf("."))),v(n)}function w(e){if(e==null
)return";";if(e[0]=="do")return N([e]);var t=e;for(;;){var n=t[0];if(n=="if"){if(!t[3])return b(["block",[e]]);t=t[3]}else if(n=="while"||n=="do")t=t[2];else{if(n!="for"&&n!="for-in")break;t=t[4]}}return b(e)}function E(e,t,n,r,i){var s=r||"function";return e&&
(s+=" "+u(e)),s+="("+p(MAP(t,u))+")",s=h([s,N(n)]),!i&&m(this)?"("+s+")":s}function S(e){switch(e[0]){case"with":case"while":return empty(e[2])||S(e[2]);case"for":case"for-in":return empty(e[4])||S(e[4]);case"if":if(empty(e[2])&&!e[3])return!0;if(e[3])return empty
(e[3])?!0:S(e[3]);return S(e[2]);case"directive":return!0}}function x(e,t){for(var r=[],i=e.length-1,s=0;s<=i;++s){var o=e[s],u=b(o);u!=";"&&(!n&&s==i&&!S(o)&&(u=u.replace(/;+\s*$/,"")),r.push(u))}return t?r:MAP(r,a)}function T(e){var t=e.length;return t==0?"{}"
:"{"+i+MAP(e,function(e,r){var s=e[1].length>0,o=f(function(){return a(e[0]?h(["case",b(e[0])+":"]):"default:")},.5)+(s?i+f(function(){return x(e[1]).join(i)}):"");return!n&&s&&r<t-1&&(o+=";"),o}).join(i)+i+a("}")}function N(e){return e?e.length==0?"{}":"{"+
i+f(function(){return x(e).join(i)})+i+a("}"):";"}function C(e){var t=e[0],n=e[1];return n!=null&&(t=h([u(t),"=",d(n,"seq")])),t}t=defaults(t,{indent_start:0,indent_level:4,quote_keys:!1,space_colon:!1,beautify:!1,ascii_only:!1,inline_script:!1});var n=!!t.
beautify,r=0,i=n?"\n":"",s=n?" ":"",y=ast_walker(),b=y.walk;return y.with_walkers({string:o,num:g,name:u,"debugger":function(){return"debugger;"},toplevel:function(e){return x(e).join(i+i)},splice:function(e){var t=y.parent();return HOP(SPLICE_NEEDS_BRACKETS
,t)?N.apply(this,arguments):MAP(x(e,!0),function(e,t){return t>0?a(e):e}).join(i)},block:N,"var":function(e){return"var "+p(MAP(e,C))+";"},"const":function(e){return"const "+p(MAP(e,C))+";"},"try":function(e,t,n){var r=["try",N(e)];return t&&r.push("catch","("+
t[0]+")",N(t[1])),n&&r.push("finally",N(n)),h(r)},"throw":function(e){return h(["throw",b(e)])+";"},"new":function(e,t){return t=t.length>0?"("+p(MAP(t,function(e){return d(e,"seq")}))+")":"",h(["new",d(e,"seq","binary","conditional","assign",function(e){var t=
ast_walker(),n={};try{t.with_walkers({call:function(){throw n},"function":function(){return this}},function(){t.walk(e)})}catch(r){if(r===n)return!0;throw r}})+t])},"switch":function(e,t){return h(["switch","("+b(e)+")",T(t)])},"break":function(e){var t="break"
;return e!=null&&(t+=" "+u(e)),t+";"},"continue":function(e){var t="continue";return e!=null&&(t+=" "+u(e)),t+";"},conditional:function(e,t,n){return h([d(e,"assign","seq","conditional"),"?",d(t,"seq"),":",d(n,"seq")])},assign:function(e,t,n){return e&&e!==!0?
e+="=":e="=",h([b(t),e,d(n,"seq")])},dot:function(e){var t=b(e),n=1;e[0]=="num"?/[a-f.]/i.test(t)||(t+="."):e[0]!="function"&&m(e)&&(t="("+t+")");while(n<arguments.length)t+="."+u(arguments[n++]);return t},call:function(e,t){var n=b(e),r=e[0]=="function"&&n
.charAt(0)=="(";return!r&&m(e)&&(n="("+n+")"),n+"("+p(MAP(t,function(e){return d(e,"seq")}))+")"},"function":E,defun:E,"if":function(e,t,n){var r=["if","("+b(e)+")",n?w(t):b(t)];return n&&r.push("else",b(n)),h(r)},"for":function(e,t,n,r){var i=["for"];e=(e!=
null?b(e):"").replace(/;*\s*$/,";"+s),t=(t!=null?b(t):"").replace(/;*\s*$/,";"+s),n=(n!=null?b(n):"").replace(/;*\s*$/,"");var o=e+t+n;return o=="; ; "&&(o=";;"),i.push("("+o+")",b(r)),h(i)},"for-in":function(e,t,n,r){return h(["for","("+(e?b(e).replace(/;+$/
,""):b(t)),"in",b(n)+")",b(r)])},"while":function(e,t){return h(["while","("+b(e)+")",b(t)])},"do":function(e,t){return h(["do",b(t),"while","("+b(e)+")"])+";"},"return":function(e){var t=["return"];return e!=null&&t.push(b(e)),h(t)+";"},binary:function(e,r
,i){var s=b(r),o=b(i);if(member(r[0],["assign","conditional","seq"])||r[0]=="binary"&&PRECEDENCE[e]>PRECEDENCE[r[1]]||r[0]=="function"&&m(this))s="("+s+")";return member(i[0],["assign","conditional","seq"])||i[0]=="binary"&&PRECEDENCE[e]>=PRECEDENCE[i[1]]&&
(i[1]!=e||!member(e,["&&","||","*"]))?o="("+o+")":!n&&t.inline_script&&(e=="<"||e=="<<")&&i[0]=="regexp"&&/^script/i.test(i[1])&&(o=" "+o),h([s,e,o])},"unary-prefix":function(e,t){var n=b(t);return t[0]=="num"||t[0]=="unary-prefix"&&!HOP(OPERATORS,e+t[1])||!
m(t)||(n="("+n+")"),e+(jsp.is_alphanumeric_char(e.charAt(0))?" ":"")+n},"unary-postfix":function(e,t){var n=b(t);return t[0]=="num"||t[0]=="unary-postfix"&&!HOP(OPERATORS,e+t[1])||!m(t)||(n="("+n+")"),n+e},sub:function(e,t){var n=b(e);return m(e)&&(n="("+n+")"
),n+"["+b(t)+"]"},object:function(e){var r=m(this);if(e.length==0)return r?"({})":"{}";var s="{"+i+f(function(){return MAP(e,function(e){if(e.length==3)return a(E(e[0],e[1][2],e[1][3],e[2],!0));var r=e[0],i=d(e[1],"seq");return t.quote_keys?r=o(r):(typeof r=="number"||!
n&&+r+""==r)&&parseFloat(r)>=0?r=g(+r):is_identifier(r)||(r=o(r)),a(h(n&&t.space_colon?[r,":",i]:[r+":",i]))}).join(","+i)})+i+a("}");return r?"("+s+")":s},regexp:function(e,n){return t.ascii_only&&(e=to_ascii(e)),"/"+e+"/"+n},array:function(e){return e.length==0?"[]"
:h(["[",p(MAP(e,function(t,r){return!n&&t[0]=="atom"&&t[1]=="undefined"?r===e.length-1?",":"":d(t,"seq")})),"]"])},stat:function(e){return e!=null?b(e).replace(/;*\s*$/,";"):";"},seq:function(){return p(MAP(slice(arguments),b))},label:function(e,t){return h
([u(e),":",b(t)])},"with":function(e,t){return h(["with","("+b(e)+")",b(t)])},atom:function(e){return u(e)},directive:function(e){return make_string(e)+";"}},function(){return b(e)})}function split_lines(e,t){var n=[0];return jsp.parse(function(){function o
(e){return e.pos-i}function u(e){i=e.pos,n.push(i)}function a(){var e=r.apply(this,arguments);e:{if(s&&s.type=="keyword")break e;if(o(e)>t)switch(e.type){case"keyword":case"atom":case"name":case"punc":u(e);break e}}return s=e,e}var r=jsp.tokenizer(e),i=0,s;
return a.context=function(){return r.context.apply(this,arguments)},a}()),n.map(function(t,r){return e.substring(t,n[r+1]||e.length)}).join("\n")}function repeat_string(e,t){if(t<=0)return"";if(t==1)return e;var n=repeat_string(e,t>>1);return n+=n,t&1&&(n+=
e),n}function defaults(e,t){var n={};e===!0&&(e={});for(var r in t)HOP(t,r)&&(n[r]=e&&HOP(e,r)?e[r]:t[r]);return n}function is_identifier(e){return/^[a-z_$][a-z0-9_$]*$/i.test(e)&&e!="this"&&!HOP(jsp.KEYWORDS_ATOM,e)&&!HOP(jsp.RESERVED_WORDS,e)&&!HOP(jsp.KEYWORDS
,e)}function HOP(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var jsp=require("./parse-js"),curry=jsp.curry,slice=jsp.slice,member=jsp.member,is_identifier_char=jsp.is_identifier_char,PRECEDENCE=jsp.PRECEDENCE,OPERATORS=jsp.OPERATORS,base54=function(
){var e=base54_digits();return function(t){var n="",r=54;do n+=e.charAt(t%r),t=Math.floor(t/r),r=64;while(t>0);return n}}();Scope.prototype={has:function(e){for(var t=this;t;t=t.parent)if(HOP(t.names,e))return t},has_mangled:function(e){for(var t=this;t;t=t
.parent)if(HOP(t.rev_mangled,e))return t},toJSON:function(){return{names:this.names,uses_eval:this.uses_eval,uses_with:this.uses_with}},next_mangled:function(){for(;;){var e=base54(++this.cname),t;t=this.has_mangled(e);if(t&&this.refs[t.rev_mangled[e]]===t)
continue;t=this.has(e);if(t&&t!==this&&this.refs[e]===t&&!t.has_mangled(e))continue;if(HOP(this.refs,e)&&this.refs[e]==null)continue;if(!is_identifier(e))continue;return e}},set_mangle:function(e,t){return this.rev_mangled[t]=e,this.mangled[e]=t},get_mangled
:function(e,t){if(this.uses_eval||this.uses_with)return e;var n=this.has(e);return n?HOP(n.mangled,e)?n.mangled[e]:t?n.set_mangle(e,n.next_mangled()):e:e},references:function(e){return e&&!this.parent||this.uses_with||this.uses_eval||this.refs[e]},define:function(
e,t){if(e!=null){if(t=="var"||!HOP(this.names,e))this.names[e]=t||"var";return e}},active_directive:function(e){return member(e,this.directives)||this.parent&&this.parent.active_directive(e)}};var warn=function(){},when_constant=function(){function t(n){switch(
n[0]){case"string":case"num":return n[1];case"name":case"atom":switch(n[1]){case"true":return!0;case"false":return!1;case"null":return null}break;case"unary-prefix":switch(n[1]){case"!":return!t(n[2]);case"typeof":return typeof t(n[2]);case"~":return~t(n[2]
);case"-":return-t(n[2]);case"+":return+t(n[2])}break;case"binary":var r=n[2],i=n[3];switch(n[1]){case"&&":return t(r)&&t(i);case"||":return t(r)||t(i);case"|":return t(r)|t(i);case"&":return t(r)&t(i);case"^":return t(r)^t(i);case"+":return t(r)+t(i);case"*"
:return t(r)*t(i);case"/":return t(r)/t(i);case"%":return t(r)%t(i);case"-":return t(r)-t(i);case"<<":return t(r)<<t(i);case">>":return t(r)>>t(i);case">>>":return t(r)>>>t(i);case"==":return t(r)==t(i);case"===":return t(r)===t(i);case"!=":return t(r)!=t(i
);case"!==":return t(r)!==t(i);case"<":return t(r)<t(i);case"<=":return t(r)<=t(i);case">":return t(r)>t(i);case">=":return t(r)>=t(i);case"in":return t(r)in t(i);case"instanceof":return t(r)instanceof t(i)}}throw e}var e={};return function(n,r,i){try{var s=
t(n),o;switch(typeof s){case"string":o=["string",s];break;case"number":o=["num",s];break;case"boolean":o=["name",String(s)];break;default:if(s===null){o=["atom","null"];break}throw new Error("Can't handle constant of type: "+typeof s)}return r.call(n,o,s)}catch(
u){if(u===e){if(n[0]!="binary"||n[1]!="==="&&n[1]!="!=="||!(is_string(n[2])&&is_string(n[3])||boolean_expr(n[2])&&boolean_expr(n[3]))){if(i&&n[0]=="binary"&&(n[1]=="||"||n[1]=="&&"))try{var a=t(n[2]);n=n[1]=="&&"&&(a?n[3]:a)||n[1]=="||"&&(a?a:n[3])||n}catch(
f){}}else n[1]=n[1].substr(0,2);return i?i.call(n,n):null}throw u}}}(),DOT_CALL_NO_PARENS=jsp.array_to_hash(["name","array","object","string","dot","sub","call","regexp","defun"]),SPLICE_NEEDS_BRACKETS=jsp.array_to_hash(["if","while","do","for","for-in","with"
]),MAP;(function(){function t(e){this.v=e}function n(e){this.v=e}MAP=function(r,i,s){function f(){var f=i.call(s,r[a],a);f instanceof t?(f=f.v,f instanceof n?u.push.apply(u,f.v):u.push(f)):f!=e&&(f instanceof n?o.push.apply(o,f.v):o.push(f))}var o=[],u=[],a
;if(r instanceof Array)for(a=0;a<r.length;++a)f();else for(a in r)HOP(r,a)&&f();return u.concat(o)},MAP.at_top=function(e){return new t(e)},MAP.splice=function(e){return new n(e)};var e=MAP.skip={}})(),exports.ast_walker=ast_walker,exports.ast_mangle=ast_mangle
,exports.ast_squeeze=ast_squeeze,exports.ast_lift_variables=ast_lift_variables,exports.gen_code=gen_code,exports.ast_add_scope=ast_add_scope,exports.set_logger=function(e){warn=e},exports.make_string=make_string,exports.split_lines=split_lines,exports.MAP=MAP
,exports.ast_squeeze_more=require("./squeeze-more").ast_squeeze_more
/* jslint-ignore-end */



        local.uglify = function (code) {
        /*
         * this function will uglify the js-code
         */
            var ast;
            // parse code and get the initial AST
            ast = local.parse(code
                .trim()
                // comment shebang
                .replace((/^#!/), '//'));
            // get a new AST with mangled names
            ast = local.ast_mangle(ast);
            // get an AST with compression optimizations
            ast = local.ast_squeeze(ast);
            // compressed code here
            return local.split_lines(local.gen_code(ast, { ascii_only: true }), 256);
        };
    }());
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        // export uglifyjs
        window.utility2_uglifyjs = local;
        break;



    // run node js-env code - post-init
    case 'node':
        // export uglifyjs
        module.exports = module['./lib.uglifyjs.js'] = local;
        module.exports.__dirname = __dirname;
        // require modules
        local.fs = require('fs');
        local.path = require('path');
        // run the cli
        if (module !== require.main || module.isRollup) {
            break;
        }
        if ((/^(?:http|https):\/\//).test(process.argv[2])) {
            // uglify url
            require(process.argv[2].indexOf('https') === 0
                ? 'https'
                : 'http').request(require('url').parse(
                process.argv[2]
            ), function (response) {
                local.chunkList = [];
                response
                    .on('data', function (chunk) {
                        local.chunkList.push(chunk);
                    })
                    .on('end', function () {
                        console.log(local.uglify(Buffer.concat(local.chunkList).toString()));
                    });
            })
                .end();
            break;
        }
        // uglify file
        console.log(local.uglify(local.fs.readFileSync(
            local.path.resolve(process.cwd(), process.argv[2]),
            'utf8'
        )));
        break;
    }
}());




// /assets.utility2.js
/* istanbul instrument in package utility2 */
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
(function (local) {
    'use strict';
    var require;



    // run shared js-env code - pre-init
    (function () {
        // init require
        require = function (key) {
            return local[key] || local.require2(key);
        };
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        // init global.debug_inline
        local.global['debug_inline'.replace('_i', 'I')] = function (arg) {
        /*
         * this function will both print the arg to stderr and return it
         */
            // debug arguments
            local.utility2['_debug_inlineArguments'.replace('_i', 'I')] = arguments;
            console.error('\n\n\ndebug_inline'.replace('_i', 'I'));
            console.error.apply(console, arguments);
            console.error();
            // return arg for inspection
            return arg;
        };
        // init global.debug_inlineCallback
        local.global['debug_inlineCallback'.replace('_i', 'I')] = function (onError) {
        /*
         * this function will inject debug_inline into the callback onError
         */
            return function () {
                local.global['debug_inline'.replace('_i', 'I')].apply(null, arguments);
                onError.apply(null, arguments);
            };
        };
        // init lib utility2
        local.utility2 = { assetsDict: {}, local: local };
        local.utility2.nop = function () {
        /*
         * this function will do nothing
         */
            return;
        };
        // init lib
        [
            'istanbul',
            'jslint',
            'nedb',
            'sjcl',
            'uglifyjs'
        ].forEach(function (key) {
            local.utility2[key === 'nedb'
                ? 'Nedb'
                : key] = local.modeJs === 'browser'
                ? local.global['utility2_' + key]
                : require('./lib.' + key + '.js');
        });
        // init assets and templates
/* jslint-ignore-begin */
local.utility2.assetsDict['/assets.example.js'] = '';



local.utility2.assetsDict['/assets.test.js'] = '';



local.utility2.assetsDict['/assets.utility2.rollup.begin.js'] = '\
/* utility2.rollup.js begin */\n\
/*jslint\n\
    bitwise: true,\n\
    browser: true,\n\
    maxerr: 8,\n\
    maxlen: 96,\n\
    node: true,\n\
    nomen: true,\n\
    regexp: true,\n\
    stupid: true\n\
*/\n\
(function () {\n\
    "use strict";\n\
    if (typeof module === "object") {\n\
        module.isRollup = true;\n\
    }\n\
}());\n\
';



local.utility2.assetsDict['/assets.utility2.rollup.content.js'] = '\
(function () {\n\
    "use strict";\n\
    var local;\n\
    (function () {\n\
        if (typeof module === "object") {\n\
            module.isRollup = true;\n\
        }\n\
        local = {};\n\
        local.modeJs = (function () {\n\
            try {\n\
                return typeof navigator.userAgent === "string" &&\n\
                    typeof document.querySelector("body") === "object" &&\n\
                    typeof XMLHttpRequest.prototype.open === "function" &&\n\
                    "browser";\n\
            } catch (errorCaughtBrowser) {\n\
                return module.exports &&\n\
                    typeof process.versions.node === "string" &&\n\
                    typeof require("http").createServer === "function" &&\n\
                    "node";\n\
            }\n\
        }());\n\
        local = local.modeJs === "browser"\n\
            ? window.utility2.local\n\
            : module;\n\
/* jslint-ignore-begin */\n\
/* utility2.rollup.js content */\n\
/* jslint-ignore-end */\n\
    }());\n\
}());\n\
';



local.utility2.assetsDict['/assets.utility2.rollup.end.js'] = '\
/* utility2.rollup.js end */\n\
';



local.utility2.assetsDict['/favicon.ico'] = '';



// https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
local.utility2.regexpEmailValidate = (
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
);



// https://img.shields.io/badge/last_build-0000_00_00_00_00_00_UTC_--_master_--_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-0077ff.svg?style=flat
local.utility2.templateBuildBadgeSvg =
'<svg xmlns="http://www.w3.org/2000/svg" width="563" height="20"><linearGradient id="a" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><rect rx="0" width="563" height="20" fill="#555"/><rect rx="0" x="61" width="502" height="20" fill="#07f"/><path fill="#07f" d="M61 0h4v20h-4z"/><rect rx="0" width="563" height="20" fill="url(#a)"/><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="31.5" y="15" fill="#010101" fill-opacity=".3">last build</text><text x="31.5" y="14">last build</text><text x="311" y="15" fill="#010101" fill-opacity=".3">0000-00-00 00:00:00 UTC - master - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</text><text x="311" y="14">0000-00-00 00:00:00 UTC - master - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</text></g></svg>';



local.utility2.templateDocApiHtml = '\
<style>\n\
.docApiDiv {\n\
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n\
}\n\
.docApiDiv a[href] {\n\
    color: #33f;\n\
    font-weight: bold;\n\
    text-decoration: none;\n\
}\n\
.docApiDiv a[href]:hover {\n\
    text-decoration: underline;\n\
}\n\
.docApiSectionDiv {\n\
    border-top: 1px solid;\n\
    margin-top: 20px;\n\
}\n\
.docApiCodeCommentSpan {\n\
    background-color: #bbf;\n\
    color: #000;\n\
    display: block;\n\
}\n\
.docApiCodeKeywordSpan {\n\
    color: #f00;\n\
    font-weight: bold;\n\
}\n\
.docApiCodePre {\n\
    background-color: #eef;\n\
    border: 1px solid;\n\
    color: #777;\n\
    padding: 5px;\n\
    white-space: pre-wrap;\n\
}\n\
.docApiSignatureSpan {\n\
    color: #777;\n\
    font-weight: bold;\n\
}\n\
</style>\n\
<div class="docApiDiv">\n\
<h1>api documentation\n\
    <a\n\
        {{#if envDict.npm_package_homepage}}\n\
        href="{{envDict.npm_package_homepage}}"\n\
        {{/if envDict.npm_package_homepage}}\n\
    >({{envDict.npm_package_name}} v{{envDict.npm_package_version}})</a>\n\
</h1>\n\
<div class="docApiSectionDiv"><a href="#"><h1>table of contents</h1></a><ul>\n\
{{#each moduleList}}\n\
    <li><a href="#{{id}}">module {{name}}</a><ol>\n\
        {{#each elementList}}\n\
        <li>\n\
            {{#if source}}\n\
            <a class="docApiElementLiA" href="#{{id}}">\n\
            {{name}}\n\
            <span class="docApiSignatureSpan">{{signature}}</span>\n\
            </a>\n\
            {{#unless source}}\n\
            <span class="docApiSignatureSpan">{{name}}</span>\n\
        {{/if source}}\n\
        </li>\n\
        {{/each elementList}}\n\
    </ol></li>\n\
{{/each moduleList}}\n\
</ul></div>\n\
    {{#each moduleList}}\n\
    <div class="docApiSectionDiv">\n\
    <h1><a href="#{{id}}" id="{{id}}">module {{name}}</a></h1>\n\
        {{#each elementList}}\n\
        {{#if source}}\n\
        <h2>\n\
            <a href="#{{id}}" id="{{id}}">\n\
            {{name}}\n\
            <span class="docApiSignatureSpan">{{signature}}</span>\n\
            </a>\n\
        </h2>\n\
        <ul>\n\
        <li>description and source code<pre class="docApiCodePre">{{source}}</pre></li>\n\
        <li>example usage<pre class="docApiCodePre">{{example}}</pre></li>\n\
        </ul>\n\
        {{/if source}}\n\
        {{/each elementList}}\n\
    </div>\n\
    {{/each moduleList}}\n\
</div>\n\
';



local.utility2.templateIndexHtml = '';



// https://img.shields.io/badge/tests_failed-999-dd0000.svg?style=flat
local.utility2.templateTestReportBadgeSvg =
'<svg xmlns="http://www.w3.org/2000/svg" width="103" height="20"><linearGradient id="a" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><rect rx="0" width="103" height="20" fill="#555"/><rect rx="0" x="72" width="31" height="20" fill="#d00"/><path fill="#d00" d="M72 0h4v20h-4z"/><rect rx="0" width="103" height="20" fill="url(#a)"/><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="37" y="15" fill="#010101" fill-opacity=".3">tests failed</text><text x="37" y="14">tests failed</text><text x="86.5" y="15" fill="#010101" fill-opacity=".3">999</text><text x="86.5" y="14">999</text></g></svg>';



local.utility2.templateTestReportHtml = '\
<style>\n\
/*csslint\n\
    adjoining-classes: false\n\
*/\n\
.testReportPlatformDiv {\n\
    border: 1px solid black;\n\
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n\
    margin-top: 20px;\n\
    padding: 0 10px 10px 10px;\n\
    text-align: left;\n\
}\n\
.testReportPlatformDiv .displayNone {\n\
    display: none;\n\
}\n\
.testReportPlatformDiv img {\n\
    border: 1px solid black;\n\
    margin: 5px 0 5px 0;\n\
    max-height: 256px;\n\
    max-width: 512px;\n\
}\n\
.testReportPlatformDiv pre {\n\
    background-color: #fdd;\n\
    border-top: 1px solid black;\n\
    margin-bottom: 0;\n\
    padding: 10px;\n\
    white-space: pre-wrap;\n\
}\n\
.testReportPlatformDiv span {\n\
    display: inline-block;\n\
    width: 8rem;\n\
}\n\
.testReportPlatformDiv.summary {\n\
    background-color: #bfb;\n\
}\n\
.testReportPlatformDiv table {\n\
    border-top: 1px solid black;\n\
    text-align: left;\n\
    width: 100%;\n\
}\n\
.testReportPlatformDiv table > tbody > tr:nth-child(odd) {\n\
    background-color: #bfb;\n\
}\n\
.testReportPlatformDiv .testFailed {\n\
    background-color: #f99;\n\
}\n\
.testReportPlatformDiv .testPending {\n\
    background-color: #99f;\n\
}\n\
</style>\n\
<div class="testReportPlatformDiv summary">\n\
<h1>\n\
    <a\n\
        {{#if envDict.npm_package_homepage}}\n\
        href="{{envDict.npm_package_homepage}}"\n\
        {{/if envDict.npm_package_homepage}}\n\
    >{{envDict.npm_package_name}} v{{envDict.npm_package_version}}</a>\n\
</h1>\n\
<h2>test-report summary</h2>\n\
<h4>\n\
    <span>version</span>-\n\
        {{envDict.npm_package_version}}<br>\n\
    <span>test date</span>- {{date}}<br>\n\
    <span>commit info</span>-\n\
        {{#if envDict.CI_COMMIT_INFO}}\n\
        {{envDict.CI_COMMIT_INFO htmlSafe}}<br>\n\
        {{#unless envDict.CI_COMMIT_INFO}}\n\
        undefined<br>\n\
        {{/if envDict.CI_COMMIT_INFO}}\n\
</h4>\n\
<table>\n\
<thead>\n\
    <tr>\n\
        <th>total time-elapsed</th>\n\
        <th>total tests failed</th>\n\
        <th>total tests passed</th>\n\
        <th>total tests pending</th>\n\
    </tr>\n\
</thead>\n\
<tbody><tr>\n\
    <td>{{timeElapsed}} ms</td>\n\
    <td class="{{testStatusClass}}">{{testsFailed}}</td>\n\
    <td>{{testsPassed}}</td>\n\
    <td>{{testsPending}}</td>\n\
</tr></tbody>\n\
</table>\n\
</div>\n\
{{#each testPlatformList}}\n\
<div class="testReportPlatformDiv">\n\
<h4>\n\
    {{testPlatformNumber}}. {{name htmlSafe}}<br>\n\
    {{#if screenCaptureImg}}\n\
    <a href="{{screenCaptureImg}}"><img src="{{screenCaptureImg}}"></a><br>\n\
    {{/if screenCaptureImg}}\n\
    <span>time-elapsed</span>- {{timeElapsed}} ms<br>\n\
    <span>tests failed</span>- {{testsFailed}}<br>\n\
    <span>tests passed</span>- {{testsPassed}}<br>\n\
    <span>tests pending</span>- {{testsPending}}<br>\n\
</h4>\n\
<table>\n\
<thead><tr>\n\
    <th>#</th>\n\
    <th>time-elapsed</th>\n\
    <th>status</th>\n\
    <th>test-case</th>\n\
</tr></thead>\n\
<tbody>\n\
{{#each testCaseList}}\n\
<tr>\n\
    <td>{{testCaseNumber}}</td>\n\
    <td>{{timeElapsed}} ms</td>\n\
    <td class="{{testReportTestStatusClass}}">{{status}}</td>\n\
    <td>{{name}}</td>\n\
</tr>\n\
{{/each testCaseList}}\n\
</tbody>\n\
</table>\n\
<pre class="{{preClass}}">\n\
{{#each errorStackList}}\n\
{{errorStack htmlSafe}}\n\
{{/each errorStackList}}\n\
</pre>\n\
</div>\n\
{{/each testPlatformList}}\n\
';
/* jslint-ignore-end */
    }());



    // run shared js-env code - function
    (function () {
        // init lib _http
        local._http = {};

        // init _http.IncomingMessage
        local._http.IncomingMessage = function (xhr) {
        /*
         * https://nodejs.org/api/all.html#all_http_incomingmessage
         * An IncomingMessage object is created by http.Server or http.ClientRequest
         * and passed as the first argument to the 'request' and 'response' event respectively
         */
            this.headers = {};
            this.httpVersion = '1.1';
            this.method = xhr.method;
            this.onEvent = document.createDocumentFragment();
            this.readable = true;
            this.url = xhr.url;
        };

        local._http.IncomingMessage.prototype.addListener = function (event, onEvent) {
        /*
         * https://nodejs.org/api/all.html#all_emitter_addlistener_event_listener
         * Adds a listener to the end of the listeners array for the specified event
         */
            this.onEvent.addEventListener(event, function (event) {
                onEvent(event.data);
            });
            if (this.readable && event === 'end') {
                this.readable = null;
                this.emit('data', this.data);
                this.emit('end');
            }
            return this;
        };

        local._http.IncomingMessage.prototype.emit = function (event, data) {
        /*
         * https://nodejs.org/api/all.html#all_emitter_emit_event_arg1_arg2
         * Calls each of the listeners in order with the supplied arguments
         */
            event = new local.global.Event(event);
            event.data = data;
            this.onEvent.dispatchEvent(event);
        };

        // https://nodejs.org/api/all.html#all_emitter_on_event_listener
        local._http.IncomingMessage.prototype.on =
            local._http.IncomingMessage.prototype.addListener;

        local._http.IncomingMessage.prototype.pipe = function (writable) {
        /*
         * https://nodejs.org/api/all.html#all_readable_pipe_destination_options
         * This method pulls all the data out of a readable stream, and writes it to the
         * supplied destination, automatically managing the flow so that the destination is not
         * overwhelmed by a fast readable stream
         */
            this.on('data', function (chunk) {
                writable.write(chunk);
            });
            this.on('end', function () {
                writable.end();
            });
            return writable;
        };

        // init _http.ServerResponse
        local._http.ServerResponse = function (onResponse) {
        /*
         * https://nodejs.org/api/all.html#all_class_http_serverresponse
         * This object is created internally by a HTTP server--not by the user
         */
            this.chunkList = [];
            this.headers = {};
            this.onEvent = document.createDocumentFragment();
            this.onResponse = onResponse;
            this.statusCode = 200;
        };

        // https://nodejs.org/api/all.html#all_emitter_addlistener_event_listener
        local._http.ServerResponse.prototype.addListener =
            local._http.IncomingMessage.prototype.addListener;

        // https://nodejs.org/api/all.html#all_emitter_emit_event_arg1_arg2
        local._http.ServerResponse.prototype.emit =
            local._http.IncomingMessage.prototype.emit;

        local._http.ServerResponse.prototype.end = function (data) {
        /* https://nodejs.org/api/all.html#all_response_end_data_encoding_callback
         * This method signals to the server that all of the response headers
         * and body have been sent
         */
            // emit writable events
            this.chunkList.push(data || '');
            this.emit('finish');
            // emit readable events
            this.onResponse(this);
            this.emit('data', local.utility2.bufferConcat(this.chunkList));
            this.emit('end');
        };

        // https://nodejs.org/api/all.html#all_emitter_on_event_listener
        local._http.ServerResponse.prototype.on =
            local._http.IncomingMessage.prototype.addListener;

        // https://nodejs.org/api/all.html#all_response_setheader_name_value
        local._http.ServerResponse.prototype.setHeader = function (key, value) {
            this.headers[key.toLowerCase()] = value;
        };

        local._http.ServerResponse.prototype.write = function (data) {
        /*
         * https://nodejs.org/api/all.html#all_response_write_chunk_encoding_callback
         * This sends a chunk of the response body
         */
            this.chunkList.push(data);
        };

        local._http.STATUS_CODES = {
            100: 'Continue',
            101: 'Switching Protocols',
            102: 'Processing',
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'Non-Authoritative Information',
            204: 'No Content',
            205: 'Reset Content',
            206: 'Partial Content',
            207: 'Multi-Status',
            208: 'Already Reported',
            226: 'IM Used',
            300: 'Multiple Choices',
            301: 'Moved Permanently',
            302: 'Found',
            303: 'See Other',
            304: 'Not Modified',
            305: 'Use Proxy',
            307: 'Temporary Redirect',
            308: 'Permanent Redirect',
            400: 'Bad Request',
            401: 'Unauthorized',
            402: 'Payment Required',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Payload Too Large',
            414: 'URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Range Not Satisfiable',
            417: 'Expectation Failed',
            418: 'I\'m a teapot',
            421: 'Misdirected Request',
            422: 'Unprocessable Entity',
            423: 'Locked',
            424: 'Failed Dependency',
            425: 'Unordered Collection',
            426: 'Upgrade Required',
            428: 'Precondition Required',
            429: 'Too Many Requests',
            431: 'Request Header Fields Too Large',
            451: 'Unavailable For Legal Reasons',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported',
            506: 'Variant Also Negotiates',
            507: 'Insufficient Storage',
            508: 'Loop Detected',
            509: 'Bandwidth Limit Exceeded',
            510: 'Not Extended',
            511: 'Network Authentication Required'
        };

        // init _http.XMLHttpRequest
        local._http.XMLHttpRequest = function () {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#XMLHttpRequest()
         * The constructor initiates an XMLHttpRequest
         */
            var xhr;
            xhr = this;
            ['onError', 'onResponse'].forEach(function (key) {
                xhr[key] = xhr[key].bind(xhr);
            });
            xhr.headers = {};
            xhr.onLoadList = [];
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
            xhr.readyState = 0;
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
            xhr.response = null;
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText
            xhr.responseText = '';
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
            xhr.responseType = '';
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status
            xhr.status = xhr.statusCode = 0;
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/statusText
            xhr.statusText = '';
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
            xhr.timeout = local.utility2.timeoutDefault;
        };

        local._http.XMLHttpRequest.prototype.abort = function () {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#abort()
         * Aborts the request if it has already been sent
         */
            this.onError(new Error('abort'));
        };

        local._http.XMLHttpRequest.prototype.addEventListener = function (event, onError) {
        /*
         * this function will add event listeners to the xhr-connection
         */
            switch (event) {
            case 'abort':
            case 'error':
            case 'load':
                this.onLoadList.push(onError);
                break;
            }
        };

        local._http.XMLHttpRequest.prototype.getAllResponseHeaders = function () {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
         * #getAllResponseHeaders()
         * Returns all the response headers, separated by CRLF, as a string,
         * or null if no response has been received
         */
            var xhr;
            xhr = this;
            return Object.keys((xhr.responseStream &&
                xhr.responseStream.headers) || {}).map(function (key) {
                return key + ': ' + xhr.responseStream.headers[key] + '\r\n';
            }).join('') + '\r\n';
        };

        local._http.XMLHttpRequest.prototype.getResponseHeader = function (key) {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#getResponseHeader()
         * Returns the string containing the text of the specified header,
         * or null if either the response has not yet been received
         * or the header doesn't exist in the response
         */
            return (this.responseStream &&
                this.responseStream.headers &&
                this.responseStream.headers[key]) || null;
        };

        local._http.XMLHttpRequest.prototype.onError = function (error, data) {
        /*
         * this function will handle the error and data passed back to the xhr-connection
         */
            if (this.done) {
                return;
            }
            this.error = error;
            this.response = data;
            // init responseText
            if (!this.responseType || this.responseType === 'text') {
                this.responseText = local.utility2.bufferToString(data);
            }
            // update xhr
            this.readyState = 4;
            this.onreadystatechange();
            // handle data
            this.onLoadList.forEach(function (onError) {
                onError({ type: error
                    ? 'error'
                    : 'load' });
            });
        };

        local._http.XMLHttpRequest.prototype.onResponse = function (responseStream) {
        /*
         * this function will handle the responseStream from the xhr-connection
         */
            this.responseStream = responseStream;
            // update xhr
            this.status = this.statusCode = this.responseStream.statusCode;
            this.statusText = local.http.STATUS_CODES[this.responseStream.statusCode] || '';
            this.readyState = 1;
            this.onreadystatechange();
            this.readyState = 2;
            this.onreadystatechange();
            this.readyState = 3;
            this.onreadystatechange();
            if (this.responseType === 'stream') {
                this.onError(null, this.responseStream);
                return;
            }
            local.utility2.streamReadAll(this.responseStream, this.onError);
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
        local._http.XMLHttpRequest.prototype.onreadystatechange = local.utility2.nop;

        local._http.XMLHttpRequest.prototype.open = function (method, url) {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#open()
         * Initializes a request
         */
            this.method = method;
            this.url = url;
            // parse url
            this.urlParsed = local.utility2.urlParse(String(this.url));
            this.hostname = this.urlParsed.hostname;
            this.path = this.urlParsed.pathname + this.urlParsed.search;
            this.port = this.urlParsed.port;
            // init requestStream
            this.requestStream = (this.urlParsed.protocol === 'https:'
                ? local.https
                : local.http).request(this, this.onResponse)
                // handle request-error
                .on('error', this.onError);
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#overrideMimeType()
        local._http.XMLHttpRequest.prototype.overrideMimeType = local.utility2.nop;

        local._http.XMLHttpRequest.prototype.send = function (data) {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#send()
         * Sends the request
         */
            var self;
            self = this;
            self.data = data;
            // asynchronously send data
            setTimeout(function () {
                self.requestStream.end(self.data);
            });
        };

        local._http.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#setRequestHeader()
         * Sets the value of an HTTP request header
         */
            key = key.toLowerCase();
            this.headers[key] = value;
            this.requestStream.setHeader(key, value);
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload
        local._http.XMLHttpRequest.prototype.upload = {
            addEventListener: local.utility2.nop
        };

        local._http.createServer = function () {
            /*
             * https://nodejs.org/api/all.html#all_http_createserver_requestlistener
             * Returns a new instance of http.Server
             */
            return { listen: function (port, onError) {
            /*
             * https://nodejs.org/api/all.html#all_server_listen_handle_callback
             * This will cause the server to accept connections on the specified handle,
             * but it is presumed that the file descriptor or handle has already been bound
             * to a port or domain socket
             */
                // jslint-hack
                local.utility2.nop(port);
                onError();
            } };
        };

        local._http.request = function (xhr, onResponse) {
            var self;
            self = {};
            self.end = function (data) {
                // do not run more than once
                if (self.ended) {
                    return;
                }
                self.ended = true;
                self.serverRequest.data = data;
                local.utility2.serverLocalRequestHandler(
                    self.serverRequest,
                    self.serverResponse
                );
            };
            self.on = function () {
                return self;
            };
            self.serverRequest = new local._http.IncomingMessage(xhr);
            self.serverResponse = new local._http.ServerResponse(onResponse);
            self.setHeader = function (key, value) {
                self.serverRequest.headers[key.toLowerCase()] = value;
            };
            return self;
        };

        // init lib Blob
        local.utility2.Blob = local.modeJs === 'browser'
            ? local.global.Blob
            : function (array, options) {
              /*
               * this function will return a node-compatible Blob instance
               */
                this.bff = local.utility2.bufferConcat(array);
                this.type = options && options.type;
            };

        // init lib FormData
        local.utility2.FormData = function () {
        /*
         * this function will return a serverLocal-compatible FormData instance
         * https://xhr.spec.whatwg.org/#dom-formdata
         * The FormData(form) constructor must run these steps:
         * 1. Let fd be a new FormData object.
         * 2. If form is given, set fd's entries to the result
         *    of constructing the form data set for form. (not implemented)
         * 3. Return fd.
         */
            this.entryList = [];
        };

        local.utility2.FormData.prototype.append = function (name, value, filename) {
        /*
         * https://xhr.spec.whatwg.org/#dom-formdata-append
         * The append(name, value, filename) method, when invoked, must run these steps:
         * 1. If the filename argument is given, set value to a new File object
         *    whose contents are value and name is filename.
         * 2. Append a new entry whose name is name, and value is value,
         *    to context object's list of entries.
         */
            if (filename) {
                // try to set value.name to filename
                local.utility2.tryCatchOnError(function () {
                    value.name = filename;
                }, local.utility2.nop);
            }
            this.entryList.push({ name: name, value: value });
        };

        local.utility2.FormData.prototype.read = function (onError) {
        /*
         * https://tools.ietf.org/html/rfc7578
         * this function will read from formData as a buffer, e.g.
         * --Boundary\r\n
         * Content-Disposition: form-data; name="key"\r\n
         * \r\n
         * value\r\n
         * --Boundary\r\n
         * Content-Disposition: form-data; name="input1"; filename="file1.png"\r\n
         * Content-Type: image/jpeg\r\n
         * \r\n
         * <data1>\r\n
         * --Boundary\r\n
         * Content-Disposition: form-data; name="input2"; filename="file2.png"\r\n
         * Content-Type: image/jpeg\r\n
         * \r\n
         * <data2>\r\n
         * --Boundary--\r\n
         */
            var boundary, onParallel, result;
            // handle null-case
            if (this.entryList.length === 0) {
                onError(null, local.utility2.bufferCreate());
                return;
            }
            // init boundary
            boundary = '--' + local.utility2.uuidTimeCreate();
            // init result
            result = [];
            onParallel = local.utility2.onParallel(function (error) {
                // add closing boundary
                result.push([boundary + '--\r\n']);
                // concatenate result
                onError(error, !error && local.utility2.bufferConcat(
                    // flatten result
                    Array.prototype.concat.apply([], result)
                ));
            });
            onParallel.counter += 1;
            this.entryList.forEach(function (element, ii) {
                var value;
                value = element.value;
                if (!(value instanceof local.utility2.Blob)) {
                    result[ii] = [boundary + '\r\nContent-Disposition: form-data; name="' +
                        element.name + '"\r\n\r\n', value, '\r\n'];
                    return;
                }
                // read from blob in parallel
                onParallel.counter += 1;
                local.utility2.blobRead(value, 'binary', function (error, data) {
                    result[ii] = !error && [boundary +
                        '\r\nContent-Disposition: form-data; name="' + element.name + '"' +
                        // read param filename
                        (value && value.name
                            ? '; filename="' + value.name + '"'
                            : '') +
                        '\r\n' +
                        // read param Content-Type
                        (value && value.type
                            ? 'Content-Type: ' + value.type + '\r\n'
                            : '') +
                        '\r\n', data, '\r\n'];
                    onParallel(error);
                });
            });
            onParallel();
        };

        local.utility2.ajax = function (options, onError) {
        /*
         * this function will send an ajax-request with error-handling and timeout
         */
            var timerTimeout, tmp, xhr;
            onError = local.utility2.onErrorWithStack(onError);
            // init modeServerLocal
            if (!local.utility2.envDict.npm_config_mode_backend &&
                    local.utility2.serverLocalUrlTest(options.url)) {
                xhr = new local._http.XMLHttpRequest();
            }
            // init xhr
            xhr = xhr || (local.modeJs === 'browser'
                ? new local.global.XMLHttpRequest()
                : new local._http.XMLHttpRequest());
            // debug xhr
            local.utility2._debugXhr = xhr;
            // init options
            local.utility2.objectSetOverride(xhr, options);
            // init headers
            xhr.headers = {};
            Object.keys(options.headers || {}).forEach(function (key) {
                xhr.headers[key.toLowerCase()] = options.headers[key];
            });
            // init method
            xhr.method = xhr.method || 'GET';
            // init timeout
            xhr.timeout = xhr.timeout || local.utility2.timeoutDefault;
            // init timerTimeout
            timerTimeout = local.utility2.onTimeout(function (error) {
                xhr.error = xhr.error || error;
                xhr.abort();
                // cleanup requestStream and responseStream
                local.utility2.requestResponseCleanup(xhr.requestStream, xhr.responseStream);
            }, xhr.timeout, 'ajax ' + xhr.method + ' ' + xhr.url);
            // init event handling
            xhr.onEvent = function (event) {
                // init statusCode
                xhr.statusCode = xhr.status;
                switch (event.type) {
                case 'abort':
                case 'error':
                case 'load':
                    // do not run more than once
                    if (xhr.done) {
                        return;
                    }
                    xhr.done = true;
                    // cleanup timerTimeout
                    clearTimeout(timerTimeout);
                    // cleanup requestStream and responseStream
                    setTimeout(function () {
                        local.utility2.requestResponseCleanup(
                            xhr.requestStream,
                            xhr.responseStream
                        );
                    });
                    // decrement ajaxProgressCounter
                    local.utility2.ajaxProgressCounter = Math.max(
                        local.utility2.ajaxProgressCounter - 1,
                        0
                    );
                    // handle abort or error event
                    if (!xhr.error &&
                            (event.type === 'abort' ||
                            event.type === 'error' ||
                            xhr.statusCode >= 400)) {
                        xhr.error = new Error(event.type);
                    }
                    // handle completed xhr request
                    if (xhr.readyState === 4) {
                        // handle string data
                        if (xhr.error) {
                            // debug statusCode
                            xhr.error.statusCode = xhr.statusCode;
                            // debug statusCode / method / url
                            tmp = local.modeJs + ' - ' + xhr.statusCode + ' ' + xhr.method +
                                ' ' + xhr.url + '\n';
                            // try to debug responseText
                            local.utility2.tryCatchOnError(function () {
                                tmp += '    ' + JSON.stringify(xhr.responseText.slice(0, 256) +
                                    '...') + '\n';
                            }, local.utility2.nop);
                            local.utility2.errorMessagePrepend(xhr.error, tmp);
                        }
                    }
                    onError(xhr.error, xhr, xhr.onEvent);
                    break;
                }
                local.utility2.ajaxProgressUpdate();
            };
            // increment ajaxProgressCounter
            local.utility2.ajaxProgressCounter += 1;
            xhr.addEventListener('abort', xhr.onEvent);
            xhr.addEventListener('error', xhr.onEvent);
            xhr.addEventListener('load', xhr.onEvent);
            xhr.addEventListener('loadstart', local.utility2.ajaxProgressUpdate);
            xhr.addEventListener('progress', local.utility2.ajaxProgressUpdate);
            xhr.upload.addEventListener('progress', local.utility2.ajaxProgressUpdate);
            // open url
            xhr.open(xhr.method, xhr.url);
            // set request-headers
            Object.keys(xhr.headers).forEach(function (key) {
                xhr.setRequestHeader(key, xhr.headers[key]);
            });
            if (xhr.data instanceof local.utility2.FormData) {
                // handle formData
                xhr.data.read(function (error, data) {
                    if (error) {
                        xhr.error = xhr.error || error;
                        xhr.onEvent({ type: 'error' });
                        return;
                    }
                    // send data
                    xhr.send(local.utility2.bufferToNodeBuffer(data));
                });
            } else {
                // send data
                xhr.send(local.utility2.bufferToNodeBuffer(xhr.data));
            }
            return xhr;
        };

        local.utility2.ajaxProgressShow = function () {
        /*
         * this function will show ajaxProgress
         */
            local.utility2.ajaxProgressCounter += 1;
            local.utility2.ajaxProgressUpdate();
            local.utility2.ajaxProgressCounter -= 1;
            local.utility2.timerTimeoutAjaxProgressHide =
                setTimeout(local.utility2.ajaxProgressUpdate, local.utility2.timeoutDefault);
        };

        local.utility2.ajaxProgressUpdate = function () {
        /*
         * this function will update ajaxProgress
         */
            var ajaxProgressBarDiv;
            ajaxProgressBarDiv = local.modeJs === 'browser' &&
                document.querySelector('.ajaxProgressBarDiv');
            if (!ajaxProgressBarDiv) {
                return;
            }
            // show ajaxProgressDiv
            ajaxProgressBarDiv.parentNode.style.display = 'block';
            // cleanup timerTimeout
            clearTimeout(local.utility2.timerTimeoutAjaxProgressHide);
            // increment ajaxProgress
            if (local.utility2.ajaxProgressCounter) {
                ajaxProgressBarDiv.innerHTML = 'loading';
                ajaxProgressBarDiv.className = ajaxProgressBarDiv.className
                    .replace((/ajaxProgressBarDiv\w+/), 'ajaxProgressBarDivLoading');
                // this algorithm will indefinitely increment the ajaxProgressBar
                // with successively smaller increments without ever reaching 100%
                local.utility2.ajaxProgressState += 1;
                ajaxProgressBarDiv.style.width =
                    100 - 75 * Math.exp(-0.125 * local.utility2.ajaxProgressState) + '%';
                return;
            }
            // finish ajaxProgress
            ajaxProgressBarDiv.innerHTML = 'loaded';
            ajaxProgressBarDiv.className = ajaxProgressBarDiv.className
                .replace((/ajaxProgressBarDiv\w+/), 'ajaxProgressBarDivLoaded');
            ajaxProgressBarDiv.style.width = '100%';
            // hide ajaxProgress
            local.utility2.timerTimeoutAjaxProgressHide = setTimeout(function () {
                ajaxProgressBarDiv.parentNode.style.display = 'none';
                // reset ajaxProgress
                local.utility2.ajaxProgressState = 0;
                ajaxProgressBarDiv.innerHTML = 'loading';
                ajaxProgressBarDiv.className = ajaxProgressBarDiv.className
                    .replace((/ajaxProgressBarDiv\w+/), 'ajaxProgressBarDivLoading');
                ajaxProgressBarDiv.style.width = '0%';
            }, 1500);
        };

        local.utility2.assert = function (passed, message) {
        /*
         * this function will assert passed is truthy, else throw the error message
         */
            var error;
            if (passed) {
                return;
            }
            error = message && message.message
                // if message is an error-object, then leave it as is
                ? message
                : new Error(typeof message === 'string'
                    // if message is a string, then leave it as is
                    ? message
                    // else JSON.stringify message
                    : JSON.stringify(message));
            throw error;
        };

        local.utility2.assertJsonEqual = function (aa, bb) {
        /*
         * this function will assert
         * utility2.jsonStringifyOrdered(aa) === JSON.stringify(bb)
         */
            aa = local.utility2.jsonStringifyOrdered(aa);
            bb = JSON.stringify(bb);
            local.utility2.assert(aa === bb, [aa, bb]);
        };

        local.utility2.assertJsonNotEqual = function (aa, bb) {
        /*
         * this function will assert
         * utility2.jsonStringifyOrdered(aa) !== JSON.stringify(bb)
         */
            aa = local.utility2.jsonStringifyOrdered(aa);
            bb = JSON.stringify(bb);
            local.utility2.assert(aa !== bb, [aa, bb]);
        };

        local.utility2.blobRead = function (blob, encoding, onError) {
        /*
         * this function will read from the blob with the given encoding
         * possible encodings are:
         * - Uint8Array (default)
         * - dataURL
         * - text
         */
            var data, done, reader;
            if (local.modeJs === 'node') {
                switch (encoding) {
                // readAsDataURL
                case 'dataURL':
                    data = 'data:' + (blob.type || '') + ';base64,' +
                        local.utility2.bufferToString(blob.bff, 'base64');
                    break;
                // readAsText
                case 'text':
                    data = local.utility2.bufferToString(blob.bff);
                    break;
                // readAsArrayBuffer
                default:
                    data = local.utility2.bufferCreate(blob.bff);
                }
                onError(null, data);
                return;
            }
            reader = new local.global.FileReader();
            reader.onabort = reader.onerror = reader.onload = function (event) {
                if (done) {
                    return;
                }
                done = true;
                switch (event.type) {
                case 'abort':
                case 'error':
                    onError(new Error('blobRead - ' + event.type));
                    break;
                case 'load':
                    onError(null, reader.result instanceof local.global.ArrayBuffer
                        // convert ArrayBuffer to Uint8Array
                        ? local.utility2.bufferCreate(reader.result)
                        : reader.result);
                    break;
                }
            };
            switch (encoding) {
            // readAsDataURL
            case 'dataURL':
                reader.readAsDataURL(blob);
                break;
            // readAsText
            case 'text':
                reader.readAsText(blob);
                break;
            // readAsArrayBuffer
            default:
                reader.readAsArrayBuffer(blob);
            }
        };

        /* istanbul ignore next */
        local.utility2.browserTest = function (options, onError) {
        /*
         * this function will spawn an electron process to test options.url
         */
            var done, modeNext, onNext, onParallel, timerTimeout;
            if (local.modeJs === 'node') {
                local.utility2.objectSetDefault(options, local.utility2.envDict);
                options.timeoutDefault = options.timeoutDefault ||
                    local.utility2.timeoutDefault;
            }
            modeNext = Number(options.modeNext || 0);
            onNext = function (error, data) {
                modeNext = error instanceof Error
                    ? Infinity
                    : modeNext + 1;
                switch (modeNext) {
                // run node code
                case 1:
                    // init options
                    options.testName = local.utility2.envDict.MODE_BUILD + '.browser.' +
                        encodeURIComponent(local.utility2.urlParse(options.url).pathname);
                    local.utility2.objectSetDefault(options, {
                        fileCoverage: local.utility2.envDict.npm_config_dir_tmp +
                            '/coverage.' + options.testName + '.json',
                        fileScreenCapture: (local.utility2.envDict.npm_config_dir_build +
                            '/screen-capture.' + options.testName + '.png')
                            .replace((/%/g), '_')
                            .replace((/_2F\.png$/), '.png'),
                        fileTestReport: local.utility2.envDict.npm_config_dir_tmp +
                            '/test-report.' + options.testName + '.json',
                        modeBrowserTest: 'test',
                        timeExit: Date.now() + options.timeoutDefault
                    }, 1);
                    // init timerTimeout
                    timerTimeout = local.utility2.onTimeout(
                        onNext,
                        options.timeoutDefault,
                        options.testName
                    );
                    // init file urlBrowser
                    options.modeNext = 20;
                    options.urlBrowser = local.utility2.envDict.npm_config_dir_tmp +
                        '/electron.' + local.utility2.uuidTimeCreate() + '.html';
                    local.utility2.fsMkdirpSync(local.utility2.envDict.npm_config_dir_build);
                    local.fs.writeFileSync(options.urlBrowser, '<style>body {' +
                            'border: 1px solid black;' +
                            'margin: 0;' +
                            'padding: 0;' +
                        '}</style>' +
                        '<webview id=webview1 src="' +
                        options.url.replace('{{timeExit}}', options.timeExit) +
                        '" style="' +
                            'border: none;' +
                            'height: 100%;' +
                            'margin: 0;' +
                            'padding: 0;' +
                            'width: 100%;' +
                        '"></webview>' +
                        '<script>window.local = {}; (' + local.utility2.browserTest
                            .toString()
                            .replace((/<\//g), '<\\/')
                            // coverage-hack - un-instrument
                            .replace((/\b__cov_.*?\+\+/g), '0') +
                        '(' + JSON.stringify(options) + '))</script>');
                    console.log('\nbrowserTest - created electron entry-page ' +
                        options.urlBrowser + '\n');
                    // spawn an electron process to test a url
                    options.modeNext = 10;
                    local.utility2.processSpawnWithTimeout('electron', [
                        __filename,
                        'browserTest',
                        '--disable-overlay-scrollbar',
                        '--enable-logging'
                    ], {
                        env: local.utility2.jsonCopy(options),
                        stdio: options.modeSilent
                            ? 'ignore'
                            : ['ignore', 1, 2]
                    }).once('exit', onNext);
                    break;
                case 2:
                    console.log('\nbrowserTest - exit-code ' + error + ' - ' + options.url +
                        '\n');
                    // merge browser coverage
                    if (options.modeCoverageMerge) {
                        // try to JSON.parse the string
                        local.utility2.tryCatchOnError(function () {
                            data = JSON.parse(
                                local.fs.readFileSync(options.fileCoverage, 'utf8')
                            );
                        }, local.utility2.nop);
                        if (!local.utility2.tryCatchErrorCaught) {
                            local.utility2.istanbulCoverageMerge(
                                local.global.__coverage__,
                                data
                            );
                            console.log('\nbrowserTest - merged coverage from ' +
                                options.fileCoverage + '\n');
                        }
                    }
                    if (options.modeBrowserTest !== 'test') {
                        modeNext = Infinity;
                        onNext();
                        return;
                    }
                    // try to merge browser test-report
                    local.utility2.tryCatchOnError(function () {
                        data = JSON.parse(local.fs.readFileSync(
                            options.fileTestReport,
                            'utf8'
                        ));
                    }, local.utility2.nop);
                    if (local.utility2.tryCatchErrorCaught) {
                        onNext(local.utility2.tryCatchErrorCaught);
                        return;
                    }
                    console.log('\nbrowserTest - merging test-report from ' +
                        options.fileTestReport + '\n');
                    if (!options.modeTestIgnore) {
                        local.utility2.testReportMerge(local.utility2.testReport, data);
                    }
                    // create test-report.json
                    local.fs.writeFileSync(
                        local.utility2.envDict.npm_config_dir_build + '/test-report.json',
                        JSON.stringify(local.utility2.testReport)
                    );
                    onNext(data && data.testsFailed && new Error(data.testsFailed));
                    break;
                // run electron-node code
                case 11:
                    // handle uncaughtexception
                    process.once('uncaughtException', onNext);
                    // wait for electron to init
                    require('electron').app.once('ready', onNext);
                    break;
                case 12:
                    options.BrowserWindow = require('electron').BrowserWindow;
                    local.utility2.objectSetDefault(
                        options,
                        { frame: false, height: 768, width: 1024, x: 0, y: 0 }
                    );
                    // init browserWindow
                    options.browserWindow = new options.BrowserWindow(options);
                    options.browserWindow.once('page-title-updated', onNext);
                    // load url in browserWindow
                    options.browserWindow.loadURL('file://' + options.urlBrowser);
                    break;
                case 13:
                    console.log('\nbrowserTest - opened url ' + options.url + '\n');
                    onParallel = local.utility2.onParallel(onNext);
                    onParallel.counter += 1;
                    if (options.modeBrowserTest === 'test') {
                        onParallel.counter += 1;
                        options.browserWindow.once('page-title-updated', function () {
                            onParallel();
                        });
                    }
                    onParallel.counter += 1;
                    setTimeout(function () {
                        options.browserWindow.capturePage(options, function (data) {
                            local.fs.writeFileSync(options.fileScreenCapture, data.toPng());
                            console.log('\nbrowserTest - created screen-capture file://' +
                                options.fileScreenCapture + '\n');
                            onParallel();
                        });
                    }, Number(options.timeoutScreenCapture || 5000));
                    onParallel();
                    break;
                // run electron-browser code
                case 21:
                    options.fs = require('fs');
                    options.webview1 = document.querySelector('#webview1');
                    options.webview1.addEventListener('did-get-response-details', function () {
                        document.title = 'opened ' + location.href;
                    });
                    options.webview1.addEventListener('console-message', function (event) {
                        try {
                            options.global_test_results = event.message
                                .indexOf('{"global_test_results":{') === 0 &&
                                JSON.parse(event.message).global_test_results;
                            if (options.global_test_results.testReport) {
                                // merge screen-capture into test-report
                                options.global_test_results.testReport.testPlatformList[
                                    0
                                ].screenCaptureImg =
                                    options.fileScreenCapture.replace((/.*\//), '');
                                // save browser test-report
                                options.fs.writeFileSync(
                                    options.fileTestReport,
                                    JSON.stringify(options.global_test_results.testReport)
                                );
                                // save browser coverage
                                if (options.global_test_results.coverage) {
                                    require('fs').writeFileSync(
                                        options.fileCoverage,
                                        JSON.stringify(options.global_test_results.coverage)
                                    );
                                }
                                document.title = 'testReport written';
                                return;
                            }
                        } catch (errorCaught) {
                            console.error(errorCaught.stack);
                        }
                        console.log(event.message);
                    });
                    break;
                default:
                    if (done) {
                        return;
                    }
                    done = true;
                    // cleanup timerTimeout
                    clearTimeout(timerTimeout);
                    onError(error);
                }
            };
            onNext();
        };

        /* jslint-ignore-begin */
        local.utility2._bufferFromBase64 = function (text) {
        /*
         * https://gist.github.com/wang-bin/7332335
         * this function will convert the base64-encoded text to a Uint8Array
         */
            var de = new Uint8Array(text.length); //3/4
            var u = 0, q = '', x = '', c;
            var map64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (var r=0; c=text[x++]; ~c&&(u=q%4?u*64+c:c,q++%4)?de[r++]=(255&u>>(-2*q&6)):0)
                c = map64.indexOf(c);
            return de.subarray(0, r);
        };
        /* jslint-ignore-end */

        local.utility2._bufferToBase64 = function (bff) {
        /*
         * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView#The_code
         * this function will convert the Uint8Array bff to a base64-encoded text
         */
            var ii, mod3, text, uint24, uint6ToB64;
            text = '';
            uint24 = 0;
            uint6ToB64 = function (uint6) {
                return uint6 < 26
                    ? uint6 + 65
                    : uint6 < 52
                    ? uint6 + 71
                    : uint6 < 62
                    ? uint6 - 4
                    : uint6 === 62
                    ? 43
                    : 47;
            };
            for (ii = 0; ii < bff.length; ii += 1) {
                mod3 = ii % 3;
                uint24 |= bff[ii] << (16 >>> mod3 & 24);
                if (mod3 === 2 || bff.length - ii === 1) {
                    text += String.fromCharCode(
                        uint6ToB64(uint24 >>> 18 & 63),
                        uint6ToB64(uint24 >>> 12 & 63),
                        uint6ToB64(uint24 >>> 6 & 63),
                        uint6ToB64(uint24 & 63)
                    );
                    uint24 = 0;
                }
            }
            return text.replace(/A(?=A$|$)/g, '=');
        };

        local.utility2.bufferConcat = function (bufferList) {
        /*
         * this function is the browser-version of node's Buffer.concat for Uint8Array
         */
            var ii, jj, length, result;
            length = 0;
            bufferList = bufferList
                .filter(function (element) {
                    return element || element === 0;
                })
                .map(function (element) {
                    // convert number to string
                    if (typeof element === 'number') {
                        element = String(element);
                    }
                    // convert non-Uint8Array to Uint8Array
                    element = local.utility2.bufferCreateIfNotBuffer(element);
                    length += element.length;
                    return element;
                });
            result = local.utility2.bufferCreate(length);
            ii = 0;
            bufferList.forEach(function (element) {
                for (jj = 0; jj < element.length; ii += 1, jj += 1) {
                    result[ii] = element[jj];
                }
            });
            return result;
        };

        local.utility2.bufferCreate = function (text, encoding) {
        /*
         * this function will return a Uint8Array from the text,
         * with either 'utf8' (default) or 'base64' encoding
         */
            if (typeof text === 'string') {
                if (encoding === 'base64') {
                    return local.utility2._bufferFromBase64(text);
                }
                return local.modeJs === 'browser'
                    ? new local.global.TextEncoder('utf-8').encode(text)
                    : new Buffer(text);
            }
            return new local.global.Uint8Array(text);
        };

        local.utility2.bufferCreateIfNotBuffer = function (text, encoding) {
        /*
         * this function will return a Uint8Array from the text with the given encoding,
         * if it is not already a Uint8Array
         */
            return text instanceof local.global.Uint8Array
                ? text
                : local.utility2.bufferCreate(text, encoding);
        };

        local.utility2.bufferIndexOfSubBuffer = function (bff, subBff, fromIndex) {
        /*
         * this function will search bff for the indexOf-like position of the subBff
         */
            var ii, jj, kk;
            for (ii = fromIndex || 0; ii < bff.length; ii += 1) {
                for (jj = 0, kk = ii; jj < subBff.length; jj += 1, kk += 1) {
                    if (subBff[jj] !== bff[kk]) {
                        break;
                    }
                }
                if (jj === subBff.length) {
                    return kk - jj;
                }
            }
            return subBff.length && -1;
        };

        local.utility2.bufferToNodeBuffer = function (bff) {
        /*
         * this function will convert the Uint8Array instance to a node Buffer instance
         */
            if (local.modeJs === 'node' &&
                    bff instanceof local.global.Uint8Array && (!Buffer.isBuffer(bff))) {
                Object.setPrototypeOf(bff, Buffer.prototype);
            }
            return bff;
        };

        local.utility2.bufferToString = function (bff, encoding) {
        /*
         * this function will convert the Uint8Array bff to a string,
         * with either 'utf8' (default) or 'base64' encoding
         */
            if (typeof bff === 'string') {
                return bff;
            }
            bff = local.utility2.bufferCreateIfNotBuffer(bff);
            if (encoding === 'base64') {
                return local.utility2._bufferToBase64(bff);
            }
            return local.modeJs === 'browser'
                ? new local.global.TextDecoder('utf-8').decode(bff)
                : new Buffer(bff).toString();
        };

        local.utility2.cookieDict = function () {
        /*
         * this function will return a dict of all cookies
         */
            var result;
            result = {};
            document.cookie.replace((/(\w+)=([^;]*)/g), function (match0, match1, match2) {
                // jslint-hack
                local.utility2.nop(match0);
                result[match1] = match2;
            });
            return result;
        };

        local.utility2.cookieRemove = function (name) {
        /*
         * this function will remove the cookie with the given name
         */
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        };

        local.utility2.cookieRemoveAll = function () {
        /*
         * this function will remove all cookies
         */
            document.cookie.replace((/(\w+)=/g), function (match0, match1) {
                // jslint-hack
                local.utility2.nop(match0);
                document.cookie = match1 + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            });
        };

        local.utility2.cookieSet = function (name, value, expiresOffset) {
        /*
         * this function will set the cookie with the given name, value,
         * and expiresOffset (in ms)
         */
            var tmp;
            tmp = name + '=' + value + '; expires=' +
                new Date(Date.now() + expiresOffset).toUTCString();
            document.cookie = tmp;
            return tmp;
        };

        // init dbExport
        local.utility2.dbExport = local.utility2.Nedb && local.utility2.Nedb.dbExport;

        // init dbImport
        local.utility2.dbImport = local.utility2.Nedb && local.utility2.Nedb.dbImport;

        local.utility2.dbReset = function () {
        /*
         * this function will reset nedb's file-state and memory-state
         */
            local.utility2.onResetBefore.counter += 1;
            // visual notification
            local.utility2.ajaxProgressShow();
            local.utility2.onResetAfter(function (error) {
                // validate no error occurred
                local.utility2.assert(!error, error);
                local.utility2.onReadyBefore.counter += 1;
                local.utility2.dbSeedListUpsert(
                    local.utility2.dbSeedList,
                    local.utility2.onReadyBefore
                );
            });
            // reset nedb backend
            if (local.modeJs === 'browser' &&
                    local.utility2.envDict.npm_config_mode_backend) {
                local.utility2.onResetBefore.counter += 1;
                local.utility2.ajax({ url: '/dbReset' }, function (error, xhr) {
                    // jslint-hack
                    local.utility2.nop(error);
                    // debug xhr
                    local.utility2._debugXhrdbReset = xhr;
                    local.utility2.onResetBefore();
                });
            }
            // reset nedb local-persistence
            if (local.utility2.Nedb) {
                local.utility2.onResetBefore.counter += 1;
                local.utility2.Nedb.dbReset(local.utility2.onResetBefore);
            }
            local.utility2.onResetBefore();
        };

        // init dbTableCreate
        local.utility2.dbTableCreate = local.utility2.Nedb && local.utility2.Nedb.dbTableCreate;

        // init dbTableDrop
        local.utility2.dbTableDrop = local.utility2.Nedb && local.utility2.Nedb.dbTableDrop;

        local.utility2.dbSeedListUpsert = function (optionsList, onError) {
        /*
         * this function will serially upsert optionsList[ii].dbRowList
         */
            var modeNext, modeNextList, onNext, onNextList, onParallel, options, self;
            onNext = function (error, data) {
                modeNext = error
                    ? Infinity
                    : modeNext + 1;
                switch (modeNext) {
                case 1:
                    local.utility2.objectSetDefault(options, {
                        dbRowList: [],
                        ensureIndexList: [],
                        removeIndexList: []
                    });
                    // init dbTable
                    local.utility2.dbTableCreate(options, onNext);
                    break;
                case 2:
                    self = data;
                    onParallel = local.utility2.onParallel(onNext);
                    onParallel.counter += 1;
                    // removeIndex
                    [
                        'createdAt',
                        'id',
                        'updatedAt'
                    ]
                        .concat(options.ensureIndexList)
                        .concat(options.removeIndexList)
                        .forEach(function (index) {
                            onParallel.counter += 1;
                            self.removeIndex(index, onParallel);
                        });
                    onParallel();
                    break;
                case 3:
                    onParallel.counter += 1;
                    // ensureIndex
                    [{
                        fieldName: 'createdAt'
                    }, {
                        fieldName: 'id',
                        unique: true
                    }, {
                        fieldName: 'updatedAt'
                    }]
                        .concat(options.ensureIndexList)
                        .forEach(function (index) {
                            onParallel.counter += 1;
                            self.ensureIndex(index, onParallel);
                        });
                    onParallel();
                    break;
                case 4:
                    onParallel.counter += 1;
                    // upsert dbRow
                    options.dbRowList.forEach(function (dbRow) {
                        onParallel.counter += 1;
                        self.update({ id: dbRow.id }, dbRow, { upsert: true }, onParallel);
                    });
                    onParallel();
                    break;
                default:
                    onNextList(error);
                }
            };
            modeNextList = -1;
            onNextList = function (error) {
                modeNextList = error
                    ? Infinity
                    : modeNextList + 1;
                // recursively run each sub-middleware in middlewareList
                if (modeNextList < optionsList.length) {
                    modeNext = 0;
                    options = optionsList[modeNextList];
                    onNext(options.error);
                    return;
                }
                onError(error);
            };
            local.utility2.onResetAfter(onNextList);
        };

        local.utility2.docApiCreate = function (options) {
        /*
         * this function will return an html api-doc from the given options
         */
            var element, elementCreate, elementName, module, tmp, trimLeft;
            elementCreate = function () {
                element = {};
                element.moduleName = module.name.split('.');
                // handle case where module.exports is a function
                if (element.moduleName.slice(-1)[0] === elementName) {
                    element.moduleName.pop();
                }
                element.moduleName = element.moduleName.join('.');
                element.id = encodeURIComponent('element.' + module.name + '.' + elementName);
                element.typeof = typeof module.exports[elementName];
                element.name = (element.typeof + ' <span class="docApiSignatureSpan">' +
                    element.moduleName + '.</span>' + elementName)
                    // handle case where module.exports is a function
                    .replace('>.<', '');
                if (element.typeof !== 'function') {
                    return element;
                }
                // init source
                element.source = trimLeft(module.exports[elementName].toString());
                if (element.source.length > 4096) {
                    element.source = element.source.slice(0, 4096).trimRight() + ' ...';
                }
                element.source = local.utility2.stringHtmlSafe(element.source)
                    .replace((/\([\S\s]*?\)/), function (match0) {
                        // init signature
                        element.signature = match0.replace((/ *?\/\*[\S\s]*?\*\/ */g), '');
                        return element.signature;
                    })
                    .replace(
                        (/( *?\/\*[\S\s]*?\*\/\n)/),
                        '<span class="docApiCodeCommentSpan">$1</span>'
                    )
                    .replace((/^function \(/), elementName + ' = function (');
                // init example
                [
                    '\\b' + element.moduleName,
                    '\\.',
                    '\\b'
                ].some(function (prefix) {
                    module.example.replace(
                        new RegExp('((?:\n.*?){8}' +
                            prefix + ')(' + elementName + ')(\\((?:.*?\n){8})'),
                        function (match0, match1, match2, match3) {
                            // jslint-hack
                            local.utility2.nop(match0);
                            if ((/\b(?:JSON\.|function )$/).test(match1)) {
                                return;
                            }
                            element.example = '...' + trimLeft(
                                local.utility2.stringHtmlSafe(match1) +
                                    '<span class="docApiCodeKeywordSpan">' + match2 +
                                    '</span>' + local.utility2.stringHtmlSafe(match3)
                            ).trimRight() + '\n...';
                        }
                    );
                    return element.example;
                });
                element.example = element.example || 'n/a';
                return element;
            };
            trimLeft = function (text) {
                /*
                 * this function will normalize the whitespace around the text
                 */
                tmp = '';
                text.trim().replace((/^ */gm), function (match0) {
                    if (!tmp || match0.length < tmp.length) {
                        tmp = match0;
                    }
                });
                text = text.replace(new RegExp('^' + tmp, 'gm'), '');
                // enforce 128 character column limit
                while ((/^.{128}[^\\\n]/m).test(text)) {
                    text = text.replace((/^(.{128})([^\\\n]+)/gm), '$1\\\n$2');
                }
                return text;
            };
            options.moduleList = Object.keys(options.moduleDict)
                .sort()
                .map(function (key) {
                    module = local.utility2.objectSetDefault(options.moduleDict[key], {
                        example: '',
                        name: key
                    });
                    // handle case where module.exports is a function
                    if (typeof module.exports === 'function') {
                        tmp = module.exports;
                        module.exports = {};
                        module.exports[module.name.split('.').slice(-1)[0]] = tmp;
                        Object.keys(tmp).forEach(function (key) {
                            module.exports[key] = tmp[key];
                        });
                    }
                    return {
                        elementList: Object.keys(module.exports)
                            .filter(function (key) {
                                return key && key[0] !== '_' && !(/\W/).test(key);
                            })
                            .map(function (key) {
                                elementName = key;
                                return elementCreate();
                            })
                            .sort(function (aa, bb) {
                                return aa.name < bb.name
                                    ? -1
                                    : 1;
                            }),
                        id: 'module.' + module.name,
                        name: module.name
                    };
                });
            options.envDict = local.utility2.envDict;
            return local.utility2.templateRender(
                local.utility2.templateDocApiHtml,
                options
            );
        };

        local.utility2.domFragmentRender = function (template, dict) {
        /*
         * this function will return a dom-fragment rendered from the givent template and dict
         */
            var tmp;
            tmp = document.createElement('template');
            tmp.innerHTML = local.utility2.templateRender(template, dict);
            return tmp.content;
        };

        local.utility2.domQuerySelectorAll = function (element, selectors) {
        /*
         * this function will return the list of query-selected dom-elements,
         * as a javascript array
         */
            return Array.prototype.slice.call((element.length === 1
                // handle jQuery element
                ? element[0]
                : element).querySelectorAll(selectors));
        };

        local.utility2.echo = function (arg) {
        /*
         * this function will return the arg
         */
            return arg;
        };

        local.utility2.errorMessagePrepend = function (error, message) {
        /*
         * this function will prepend the message to error.message and error.stack
         */
            error.message = message + error.message;
            error.stack = message + error.stack;
            return error;
        };

        local.utility2.exit = function (exitCode) {
        /*
         * this function will exit the current process with the given exitCode
         */
            exitCode = !exitCode || Number(exitCode) === 0
                ? 0
                : Number(exitCode) || 1;
            switch (local.modeJs) {
            case 'browser':
                console.log(JSON.stringify({
                    global_test_results: local.global.global_test_results
                }));
                break;
            case 'node':
                process.exit(exitCode);
                break;
            }
            // reset modeTest
            local.utility2.modeTest = null;
        };

        local.utility2.fsMkdirpSync = function (dir) {
        /*
         * this function will synchronously 'mkdir -p' the dir
         */
            local.child_process.spawnSync(
                'mkdir',
                ['-p', local.path.resolve(process.cwd(), dir)],
                { stdio: ['ignore', 1, 2] }
            );
        };

        local.utility2.fsRmrSync = function (dir) {
        /*
         * this function will synchronously 'rm -fr' the dir
         */
            local.child_process.spawnSync(
                'rm',
                ['-fr', local.path.resolve(process.cwd(), dir)],
                { stdio: ['ignore', 1, 2] }
            );
        };

        local.utility2.fsWriteFileWithMkdirp = function (file, data, onError) {
        /*
         * this function will save the data to file, and auto-mkdirp the parent dir
         */
            data = local.utility2.bufferToNodeBuffer(data);
            file = local.path.resolve(process.cwd(), file);
            // save data to file
            local.fs.writeFile(file, data, function (error) {
                if (error && error.code === 'ENOENT') {
                    // if save failed, then mkdirp file's parent dir
                    local.utility2.processSpawnWithTimeout(
                        'mkdir',
                        ['-p', local.path.dirname(file)],
                        { stdio: ['ignore', 1, 2] }
                    )
                        .on('exit', function () {
                            // save data to file
                            local.fs.writeFile(file, data, onError);
                        });
                    return;
                }
                onError(error);
            });
        };

        local.utility2.isNullOrUndefined = function (arg) {
        /*
         * this function will test if the arg is null or undefined
         */
            return arg === null || arg === undefined;
        };

        local.utility2.istanbulCoverageMerge = function (coverage1, coverage2) {
        /*
         * this function will merge coverage2 into coverage1
         */
            var dict1, dict2;
            coverage1 = coverage1 || {};
            coverage2 = coverage2 || {};
            Object.keys(coverage2).forEach(function (file) {
                // if file is undefined in coverage1, then add it
                if (!coverage1[file]) {
                    coverage1[file] = coverage2[file];
                    return;
                }
                // merge file from coverage2 into coverage1
                ['b', 'f', 's'].forEach(function (key) {
                    dict1 = coverage1[file][key];
                    dict2 = coverage2[file][key];
                    switch (key) {
                    // increment coverage for branch lines
                    case 'b':
                        Object.keys(dict2).forEach(function (key) {
                            dict2[key].forEach(function (count, ii) {
                                dict1[key][ii] += count;
                            });
                        });
                        break;
                    // increment coverage for function and statement lines
                    case 'f':
                    case 's':
                        Object.keys(dict2).forEach(function (key) {
                            dict1[key] += dict2[key];
                        });
                        break;
                    }
                });
            });
            return coverage1;
        };

        // init istanbulCoverageReportCreate
        local.utility2.istanbulCoverageReportCreate = (local.utility2.istanbul &&
            local.utility2.istanbul.coverageReportCreate) || local.utility2.echo;

        // init istanbulInstrumentInPackage
        local.utility2.istanbulInstrumentInPackage = (local.utility2.istanbul &&
            local.utility2.istanbul.instrumentInPackage) || local.utility2.echo;

        // init istanbulInstrumentSync
        local.utility2.istanbulInstrumentSync = (local.utility2.istanbul &&
            local.utility2.istanbul.instrumentSync) || local.utility2.echo;

        // init jslintAndPrint
        local.utility2.jslintAndPrint = (local.utility2.jslint &&
            local.utility2.jslint.jslintAndPrint) || local.utility2.echo;

        local.utility2.jslintAndPrintConditional = function (script, file) {
        /*
         * this function will jslint / csslint the script and print any errors to stderr,
         * conditionally
         */
            var extname;
            // cleanup errors
            local.utility2.jslint.errorCounter = 0;
            local.utility2.jslint.errorText = '';
            extname = (/\.\w+$/).exec(file);
            extname = extname && extname[0];
            switch (extname) {
            case '.css':
                if (script.indexOf('/*csslint') < 0) {
                    return script;
                }
                break;
            /* istanbul ignore next */
            case '.js':
                if (local.utility2.envDict.NODE_ENV === 'production' ||
                        local.global.__coverage__ ||
                        script.indexOf('/*jslint') < 0) {
                    return script;
                }
                break;
            }
            return local.utility2.jslintAndPrint(script, file);
        };

        local.utility2.jslintAndPrintHtml = function (script, file) {
        /*
         * this function will jalint and csslint the html script
         */
            // csslint <style> tag
            script.replace(
                (/<style>([\S\s]+?)<\/style>/g),
                function (match0, match1, ii, text) {
                    // jslint-hack
                    local.utility2.nop(match0);
                    // preserve lineno
                    match1 = text.slice(0, ii).replace((/.+/g), '') + match1;
                    local.utility2.jslintAndPrintConditional(match1, file + '.css');
                }
            );
            // jslint <script> tag
            script.replace(
                (/<script>([\S\s]+?)<\/script>/g),
                function (match0, match1, ii, text) {
                    // jslint-hack
                    local.utility2.nop(match0);
                    // preserve lineno
                    match1 = text.slice(0, ii).replace((/.+/g), '') + match1;
                    local.utility2.jslintAndPrintConditional(match1, file + '.js');
                }
            );
            return script;
        };

        local.utility2.jsonCopy = function (element) {
        /*
         * this function will return a deep-copy of the JSON element
         */
            return element === undefined
                ? undefined
                : JSON.parse(JSON.stringify(element));
        };

        local.utility2.jsonStringifyOrdered = function (element, replacer, space) {
        /*
         * this function will JSON.stringify the element,
         * with object-keys sorted and circular-references removed
         */
            var circularList, stringify, tmp;
            stringify = function (element) {
            /*
             * this function will recursively JSON.stringify the element,
             * with object-keys sorted and circular-references removed
             */
                // if element is an object, then recurse its items with object-keys sorted
                if (element &&
                        typeof element === 'object' &&
                        typeof element.toJSON !== 'function') {
                    // ignore circular-reference
                    if (circularList.indexOf(element) >= 0) {
                        return;
                    }
                    circularList.push(element);
                    // if element is an array, then recurse its elements
                    if (Array.isArray(element)) {
                        return '[' + element.map(function (element) {
                            tmp = stringify(element);
                            return typeof tmp === 'string'
                                ? tmp
                                : 'null';
                        }).join(',') + ']';
                    }
                    return '{' + Object.keys(element)
                        // sort object-keys
                        .sort()
                        .map(function (key) {
                            tmp = stringify(element[key]);
                            return typeof tmp === 'string'
                                ? JSON.stringify(key) + ':' + tmp
                                : undefined;
                        })
                        .filter(function (element) {
                            return typeof element === 'string';
                        })
                        .join(',') + '}';
                }
                // else JSON.stringify as normal
                return JSON.stringify(element);
            };
            circularList = [];
            return JSON.stringify(element && typeof element === 'object'
                ? JSON.parse(stringify(element))
                : element, replacer, space);
        };

        local.utility2.jwtHs256Decode = function (password, token) {
        /*
         * https://jwt.io/
         * this function will decode the json-web-token with the given password
         */
            var data;
            // try to decode the token
            local.utility2.tryCatchOnError(function () {
                token = token.split('.');
                // validate header
                local.utility2.assert(
                    token[0] === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                    token
                );
                // validate signature
                token[3] = JSON.parse(local.utility2.stringFromBase64(token[1]));
                local.utility2.assert(local.utility2.sjclHashHmacSha256Create(
                    password,
                    token[0] + '.' + token[1]
                ).replace((/\=/g), '') === token[2]);
                data = token[3];
            }, local.utility2.nop);
            // return decoded data
            return data;
        };

        local.utility2.jwtHs256Encode = function (password, data) {
        /*
         * https://jwt.io/
         * this function will encode the data into a json-web-token with the given password
         */
            var token;
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                local.utility2.stringToBase64(JSON.stringify(data)).replace((/\=/g), '');
            return (token + '.' + local.utility2.sjclHashHmacSha256Create(password, token))
                .replace((/\=/g), '');
        };

        local.utility2.listGetElementRandom = function (list) {
        /*
         * this function will return a random element from the list
         */
            return list[Math.floor(list.length * Math.random())];
        };

        local.utility2.listShuffle = function (list) {
        /*
         * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
         * this function will inplace shuffle the list, via fisher-yates algorithm
         */
            var ii, random, swap;
            for (ii = list.length - 1; ii > 0; ii -= 1) {
                // coerce to finite integer
                random = (Math.random() * (ii + 1)) | 0;
                swap = list[ii];
                list[ii] = list[random];
                list[random] = swap;
            }
            return list;
        };

        local.utility2.middlewareAssetsCached = function (request, response, nextMiddleware) {
        /*
         * this function will run the middleware that will serve cached-assets
         */
            var modeNext, onNext, result;
            modeNext = 0;
            onNext = function (error, data) {
                result = result || local.utility2.assetsDict[request.urlParsed.pathname];
                if (error || result === undefined) {
                    nextMiddleware(error);
                    return;
                }
                modeNext += 1;
                switch (modeNext) {
                case 1:
                    // skip gzip
                    if (response.headersSent ||
                            !(/\bgzip\b/).test(request.headers['accept-encoding'])) {
                        modeNext += 1;
                        onNext();
                        return;
                    }
                    // gzip and cache result
                    local.utility2.taskOnErrorPushCached({
                        cacheDict: 'middlewareAssetsCachedGzip',
                        key: request.urlParsed.pathname
                    }, onNext, function (onError) {
                        local.zlib.gzip(result, function (error, data) {
                            onError(error, !error && data.toString('base64'));
                        });
                    });
                    break;
                case 2:
                    // set gzip header
                    result = local.utility2.bufferCreate(data, 'base64');
                    response.setHeader('Content-Encoding', 'gzip');
                    response.setHeader('Content-Length', result.length);
                    onNext();
                    break;
                case 3:
                    local.utility2.middlewareCacheControlLastModified(
                        request,
                        response,
                        onNext
                    );
                    break;
                case 4:
                    response.end(result);
                    break;
                }
            };
            onNext();
        };

        local.utility2.middlewareBodyRead = function (request, response, nextMiddleware) {
        /*
         * this function will run the middleware that will
         * read and save the request-body to request.bodyRaw
         */
            // jslint-hack
            local.utility2.nop(response);
            // if request is already read, then goto nextMiddleware
            if (!request.readable) {
                nextMiddleware();
                return;
            }
            local.utility2.streamReadAll(request, function (error, data) {
                request.bodyRaw = request.bodyRaw || data;
                nextMiddleware(error);
            });
        };

        local.utility2.middlewareCacheControlLastModified = function (
            request,
            response,
            nextMiddleware
        ) {
        /*
         * this function will run the middleware that will update the Last-Modified header
         */
            // do not cache if headers already sent or url has '?' search indicator
            if (!(response.headersSent || request.url.indexOf('?') >= 0)) {
                // init serverResponseHeaderLastModified
                local.utility2.serverResponseHeaderLastModified =
                    local.utility2.serverResponseHeaderLastModified ||
                    // resolve to 1000 ms
                    new Date(new Date(Math.floor(Date.now() / 1000) * 1000).toGMTString());
                // respond with 304 If-Modified-Since serverResponseHeaderLastModified
                if (new Date(request.headers['if-modified-since']) >=
                        local.utility2.serverResponseHeaderLastModified) {
                    response.statusCode = 304;
                    response.end();
                    return;
                }
                response.setHeader('Cache-Control', 'no-cache');
                response.setHeader(
                    'Last-Modified',
                    local.utility2.serverResponseHeaderLastModified.toGMTString()
                );
            }
            nextMiddleware();
        };

        local.utility2.middlewareError = function (error, request, response) {
        /*
         * this function will run the middleware that will handle errors
         */
            // if error occurred, then respond with '500 Internal Server Error',
            // else respond with '404 Not Found'
            local.utility2.serverRespondDefault(request, response, error
                ? (error.statusCode >= 400 && error.statusCode < 600
                    ? error.statusCode
                    : 500)
                : 404, error);
        };

        local.utility2.middlewareFileServer = function (request, response, nextMiddleware) {
        /*
         * this function will run the middleware that will serve files
         */
            if (request.method !== 'GET' || local.modeJs === 'browser') {
                nextMiddleware();
                return;
            }
            request.urlFile = (process.cwd() + request.urlParsed.pathname
                // security - disable parent directory lookup
                .replace((/.*\/\.\.\//g), '/'))
                // replace trailing '/' with '/index.html'
                .replace((/\/$/), '/index.html');
            // serve file from cache
            local.utility2.taskOnErrorPushCached({
                cacheDict: 'middlewareFileServer',
                key: request.urlFile
            }, function (error, data) {
                // default to nextMiddleware
                if (error) {
                    nextMiddleware();
                    return;
                }
                // init response-header content-type
                request.urlParsed.contentType = (/\.[^\.]*$/).exec(request.urlParsed.pathname);
                request.urlParsed.contentType = local.utility2.contentTypeDict[
                    request.urlParsed.contentType && request.urlParsed.contentType[0]
                ];
                local.utility2.serverRespondHeadSet(request, response, null, {
                    'Content-Type': request.urlParsed.contentType
                });
                // serve file from cache
                response.end(local.utility2.bufferCreate(data, 'base64'));
            // run background-task to re-cache file
            }, function (onError) {
                local.fs.readFile(request.urlFile, function (error, data) {
                    onError(error, data && local.utility2.bufferToString(data, 'base64'));
                });
            });
        };

        local.utility2.middlewareGroupCreate = function (middlewareList) {
        /*
         * this function will create a middleware that will
         * sequentially run the sub-middlewares in middlewareList
         */
            var self;
            self = function (request, response, nextMiddleware) {
                var modeNext, onNext;
                modeNext = -1;
                onNext = function (error) {
                    modeNext = error
                        ? Infinity
                        : modeNext + 1;
                    // recurse with next middleware in middlewareList
                    if (modeNext < self.middlewareList.length) {
                        // try to run the sub-middleware
                        local.utility2.tryCatchOnError(function () {
                            self.middlewareList[modeNext](request, response, onNext);
                        }, onNext);
                        return;
                    }
                    // default to nextMiddleware
                    nextMiddleware(error);
                };
                onNext();
            };
            self.middlewareList = middlewareList;
            return self;
        };

        local.utility2.middlewareInit = function (request, response, nextMiddleware) {
        /*
         * this function will run the middleware that will init the request and response
         */
            // debug server-request
            local.utility2._debugServerRequest = request;
            // debug server-response
            local.utility2._debugServerResponse = response;
            // init timerTimeout
            local.utility2.serverRespondTimeoutDefault(
                request,
                response,
                local.utility2.timeoutDefault
            );
            // init request.urlParsed
            request.urlParsed = local.utility2.urlParse(request.url);
            // init response-header content-type
            request.urlParsed.contentType = (/\.[^\.]*$/).exec(request.urlParsed.pathname);
            request.urlParsed.contentType = local.utility2.contentTypeDict[
                request.urlParsed.contentType && request.urlParsed.contentType[0]
            ];
            local.utility2.serverRespondHeadSet(request, response, null, {
                'Content-Type': request.urlParsed.contentType
            });
            // set main-page content-type to text/html
            if (request.urlParsed.pathname === '/') {
                local.utility2.serverRespondHeadSet(request, response, null, {
                    'Content-Type': 'text/html; charset=UTF-8'
                });
            }
            // init response.end and response.write to accept Uint8Array instance
            ['end', 'write'].forEach(function (key) {
                response['_' + key] = response['_' + key] || response[key];
                response[key] = function () {
                    var args;
                    args = Array.prototype.slice.call(arguments);
                    args[0] = local.utility2.bufferToNodeBuffer(args[0]);
                    response['_' + key].apply(response, args);
                };
            });
            // default to nextMiddleware
            nextMiddleware();
        };

        local.utility2.middlewareJsonpStateInit = function (request, response, nextMiddleware) {
        /*
         * this function will run the middleware that will
         * serve the browser-state wrapped in the given request.jsonp-callback
         */
            var state;
            if (request.stateInit || (request.urlParsed &&
                    request.urlParsed.pathname === '/jsonp.utility2.stateInit')) {
                state = { utility2: { envDict: {
                    NODE_ENV: local.utility2.envDict.NODE_ENV,
                    npm_config_mode_backend: local.utility2.envDict.npm_config_mode_backend,
                    npm_package_description: local.utility2.envDict.npm_package_description,
                    npm_package_homepage: local.utility2.envDict.npm_package_homepage,
                    npm_package_name: local.utility2.envDict.npm_package_name,
                    npm_package_version: local.utility2.envDict.npm_package_version
                } } };
                if (request.stateInit) {
                    return state;
                }
                response.end(request.urlParsed.query.callback + '(' + JSON.stringify(state) +
                    ');');
                return;
            }
            nextMiddleware();
        };

        local.utility2.objectGetElementFirst = function (arg) {
        /*
         * this function will get the first element of the arg
         */
            var item;
            item = {};
            item.key = Object.keys(arg)[0];
            item.value = arg[item.key];
            return item;
        };

        local.utility2.objectKeysTypeof = function (arg) {
        /*
         * this function will return a list of the arg's keys, sorted by item-type
         */
            return Object.keys(arg).map(function (key) {
                return typeof arg[key] + ' ' + key;
            }).sort().join('\n');
        };

        local.utility2.objectLiteralize = function (arg) {
        /*
         * this function will traverse arg, and replace every encounter of the magical key '$[]'
         * with its object literal [key, value]
         */
            local.utility2.objectTraverse(arg, function (element) {
                if (element && typeof element === 'object' && !Array.isArray(element)) {
                    Object.keys(element).forEach(function (key) {
                        if (key.indexOf('$[]') === 0) {
                            element[element[key][0]] = element[key][1];
                            delete element[key];
                        }
                    });
                }
            });
            return arg;
        };

        local.utility2.objectSetDefault = function (arg, defaults, depth) {
        /*
         * this function will recursively set default values for unset leaf nodes
         * in the arg
         */
            Object.keys(defaults).forEach(function (key) {
                var arg2, defaults2;
                arg2 = arg[key];
                defaults2 = defaults[key];
                if (defaults2 === undefined) {
                    return;
                }
                // init arg[key] to default value defaults[key]
                if (!arg2) {
                    arg[key] = defaults2;
                    return;
                }
                // if arg2 and defaults2 are both non-null and non-array objects,
                // then recurse with arg2 and defaults2
                if (depth > 1 &&
                        // arg2 is a non-null and non-array object
                        arg2 &&
                        typeof arg2 === 'object' &&
                        !Array.isArray(arg2) &&
                        // defaults2 is a non-null and non-array object
                        defaults2 &&
                        typeof defaults2 === 'object' &&
                        !Array.isArray(defaults2)) {
                    local.utility2.objectSetDefault(arg2, defaults2, depth - 1);
                }
            });
            return arg;
        };

        local.utility2.objectSetOverride = function (arg, overrides, depth) {
        /*
         * this function will recursively override the arg, with the overrides-object
         */
            var arg2, overrides2;
            Object.keys(overrides).forEach(function (key) {
                arg2 = arg[key];
                overrides2 = overrides[key];
                if (overrides2 === undefined) {
                    return;
                }
                // if both arg2 and overrides2 are non-null and non-array objects,
                // then recurse with arg2 and overrides2
                if (depth > 1 &&
                        // arg2 is a non-null and non-array object
                        (arg2 &&
                        typeof arg2 === 'object' &&
                        !Array.isArray(arg2)) &&
                        // overrides2 is a non-null and non-array object
                        (overrides2 &&
                        typeof overrides2 === 'object' &&
                        !Array.isArray(overrides2))) {
                    local.utility2.objectSetOverride(arg2, overrides2, depth - 1);
                    return;
                }
                // else set arg[key] with overrides[key]
                arg[key] = arg === local.utility2.envDict
                    // if arg is envDict, then overrides falsey value with empty string
                    ? overrides2 || ''
                    : overrides2;
            });
            return arg;
        };

        local.utility2.objectTraverse = function (arg, onSelf, circularList) {
        /*
         * this function will recursively traverse the arg,
         * and run onSelf with the arg's properties
         */
            onSelf(arg);
            circularList = circularList || [];
            if (arg &&
                    typeof arg === 'object' &&
                    circularList.indexOf(arg) === -1) {
                circularList.push(arg);
                Object.keys(arg).forEach(function (key) {
                    // recurse with arg[key]
                    local.utility2.objectTraverse(arg[key], onSelf, circularList);
                });
            }
            return arg;
        };

        local.utility2.onErrorDefault = function (error) {
        /*
         * this function will print error.stack or error.message to stderr
         */
            // if error is defined, then print error.stack
            if (error && !local.global.__coverage__) {
                console.error('\nonErrorDefault - error\n' +
                    error.message + '\n' + error.stack + '\n');
            }
        };

        local.utility2.onErrorWithStack = function (onError) {
        /*
         * this function will return a new callback that calls onError,
         * and add the current stack to any error encountered
         */
            var stack;
            stack = new Error().stack;
            return function (error) {
                if (error) {
                    // save current-stack to error.stack
                    error.stack = error.stack + '\n' + stack;
                }
                onError.apply(null, arguments);
            };
        };

        local.utility2.onFileModifiedRestart = function (file) {
        /*
         * this function will watch the file, and if modified, then restart the process
         */
            if (local.utility2.envDict.npm_config_mode_auto_restart &&
                    local.fs.existsSync(file) &&
                    local.fs.statSync(file).isFile()) {
                local.fs.watchFile(file, {
                    interval: 1000,
                    persistent: false
                }, function (stat2, stat1) {
                    if (stat2.mtime > stat1.mtime) {
                        console.log('file modified - ' + file);
                        local.utility2.exit(77);
                    }
                });
            }
        };

        local.utility2.onParallel = function (onError, onDebug) {
        /*
         * this function will return a function that will
         * 1. runs async tasks in parallel
         * 2. if counter === 0 or error occurred, then call onError with error
         */
            var self;
            onError = local.utility2.onErrorWithStack(onError);
            onDebug = onDebug || local.utility2.nop;
            self = function (error) {
                onDebug(error, self);
                // if previously counter === 0 or error occurred, then return
                if (self.counter === 0 || self.error) {
                    return;
                }
                // handle error
                if (error) {
                    self.error = error;
                    // ensure counter will decrement to 0
                    self.counter = 1;
                }
                // decrement counter
                self.counter -= 1;
                // if counter === 0, then call onError with error
                if (self.counter === 0) {
                    onError(error);
                }
            };
            // init counter
            self.counter = 0;
            // return callback
            return self;
        };

        local.utility2.onTimeout = function (onError, timeout, message) {
        /*
         * this function will return a timeout-error-handler,
         * that will append the current stack to any error encountered
         */
            onError = local.utility2.onErrorWithStack(onError);
            // create timeout timer
            return setTimeout(function () {
                onError(new Error('onTimeout - timeout-error - ' +
                    timeout + ' ms - ' + (typeof message === 'function'
                    ? message()
                    : message)));
            // coerce to finite integer
            }, timeout | 0);
        };

        local.utility2.processSpawnWithTimeout = function () {
        /*
         * this function will run like child_process.spawn,
         * but with auto-timeout after timeoutDefault milliseconds
         */
            var childProcess;
            // spawn childProcess
            childProcess = local.child_process.spawn.apply(local.child_process, arguments)
                .on('exit', function () {
                    // try to kill timerTimeout childProcess
                    local.utility2.tryCatchOnError(function () {
                        process.kill(childProcess.timerTimeout.pid);
                    }, local.utility2.nop);
                });
            // init failsafe timerTimeout
            childProcess.timerTimeout = local.child_process.spawn('/bin/sh', ['-c', 'sleep ' +
                // coerce to finite integer
                (((0.001 * local.utility2.timeoutDefault) | 0) +
                // add 2 second delay to failsafe timerTimeout
                2) + '; kill -9 ' + childProcess.pid + ' 2>/dev/null'], { stdio: 'ignore' });
            return childProcess;
        };

        local.utility2.profile = function (task, onError) {
        /*
         * this function will profile the async task in milliseconds
         */
            var timeStart;
            timeStart = Date.now();
            // run async task
            task(function (error) {
                // call onError with difference in milliseconds between Date.now() and timeStart
                onError(error, Date.now() - timeStart);
            });
        };

        local.utility2.profileSync = function (task) {
        /*
         * this function will profile the sync task in milliseconds
         */
            var timeStart;
            timeStart = Date.now();
            // run sync task
            task();
            // return difference in milliseconds between Date.now() and timeStart
            return Date.now() - timeStart;
        };

        local.utility2.replStart = function () {
        /*
         * this function will start the repl debugger
         */
            var self;
            /*jslint evil: true*/
            if (local.utility2.replServer) {
                return;
            }
            // start replServer
            self = local.utility2.replServer = local.repl.start({ useGlobal: true });
            self.onError = function (error) {
            /*
             * this function will debug any repl-error
             */
                local.utility2._debugReplError = error || local.utility2._debugReplError;
            };
            self._domain.on('error', self.onError);
            // save repl eval function
            self.evalDefault = self.eval;
            // hook custom repl eval function
            self.eval = function (script, context, file, onError) {
                var match, onError2;
                match = (/^(\S+)(.*?)\n/).exec(script);
                onError2 = function (error, data) {
                    // debug error
                    self.onError(error);
                    onError(error, data);
                };
                switch (match && match[1]) {
                // syntax sugar to run async shell command
                case '$':
                    switch (match[2]) {
                    // syntax sugar to run git diff
                    case ' git diff':
                        match[2] = ' git diff --color | cat';
                        break;
                    // syntax sugar to run git log
                    case ' git log':
                        match[2] = ' git log -n 4 | cat';
                        break;
                    }
                    // run async shell command
                    local.utility2.processSpawnWithTimeout(
                        '/bin/sh',
                        ['-c', match[2]],
                        { stdio: ['ignore', 1, 2] }
                    )
                        // on shell exit, print return prompt
                        .on('exit', function (exitCode) {
                            console.log('exit-code ' + exitCode);
                            self.evalDefault(
                                '\n',
                                context,
                                file,
                                onError2
                            );
                        });
                    script = '\n';
                    break;
                // syntax sugar to grep current dir
                case 'grep':
                    // run async shell command
                    local.utility2.processSpawnWithTimeout(
                        '/bin/sh',
                        ['-c', 'find . -type f | grep -v ' +
/* jslint-ignore-begin */
'"\
/\\.\\|.*\\(\\b\\|_\\)\\(\\.\\d\\|\
archive\\|artifact\\|\
bower_component\\|build\\|\
coverage\\|\
doc\\|\
external\\|\
fixture\\|\
git_module\\|\
jquery\\|\
log\\|\
min\\|mock\\|\
node_module\\|\
rollup\\|\
swp\\|\
tmp\\)\\(\\b\\|[_s]\\)\
" ' +
/* jslint-ignore-end */
                            '| tr "\\n" "\\000" | xargs -0 grep -in "' +
                            match[2].trim() + '"'],
                        { stdio: ['ignore', 1, 2] }
                    )
                        // on shell exit, print return prompt
                        .on('exit', function (exitCode) {
                            console.log('exit-code ' + exitCode);
                            self.evalDefault(
                                '\n',
                                context,
                                file,
                                onError2
                            );
                        });
                    script = '\n';
                    break;
                // syntax sugar to list object's keys, sorted by item-type
                case 'keys':
                    script = 'console.log(Object.keys(' + match[2] + ').map(function (key) {' +
                        'return typeof ' + match[2] + '[key] + " " + key;' +
                        '}).sort().join("\\n"))\n';
                    break;
                // syntax sugar to print stringified arg
                case 'print':
                    script = 'console.log(String(' + match[2] + '))\n';
                    break;
                }
                // try to eval the script
                local.utility2.tryCatchOnError(function () {
                    self.evalDefault(script, context, file, onError2);
                }, onError2);
            };
            self.socket = {
                end: local.utility2.nop,
                on: local.utility2.nop,
                write: local.utility2.nop
            };
            // init process.stdout
            process.stdout._write2 = process.stdout._write2 || process.stdout._write;
            process.stdout._write = function (chunk, encoding, callback) {
                process.stdout._write2(chunk, encoding, callback);
                if (self.socket.readable) {
                    self.socket.write(chunk, encoding);
                }
            };
            // start tcp-server
            self.serverTcp = local.net.createServer(function (socket) {
                // init socket
                self.socket = socket;
                self.socket.on('data', self.write.bind(self));
                self.socket.on('error', local.utility2.onErrorDefault);
                self.socket.setKeepAlive(true);
            });
            [
                // coverage-hack - test no tcp-server handling-behavior
                null,
                local.utility2.envDict.PORT_REPL
            ].forEach(function (port) {
                if (!port) {
                    return;
                }
                console.log('repl-server listening on tcp-port ' + port);
                self.serverTcp.listen(port);
            });
        };

        local.utility2.requestResponseCleanup = function (request, response) {
        /*
         * this function will end or destroy the request and response objects
         */
            [request, response].forEach(function (stream) {
                // try to end the stream
                local.utility2.tryCatchOnError(function () {
                    stream.end();
                }, function () {
                    // if error, then try to destroy the stream
                    local.utility2.tryCatchOnError(function () {
                        stream.destroy();
                    }, local.utility2.nop);
                });
            });
        };

        local.utility2.requireExampleJsFromReadme = function (options) {
        /*
         * this function will require and export example.js embedded in README.md
         */
            var file, module, script;
            if (options.module.isRollup) {
                // init assets
                local.utility2.assetsDict['/'] = local.utility2.assetsDict['/index.html'] =
                    local.utility2.templateRender(options.module.exports.templateIndexHtml, {
                        envDict: local.utility2.envDict,
                        isRollup: true
                    });
                local.utility2.assetsDict['/assets.app.js'] =
                    local.fs.readFileSync(__filename, 'utf8');
                local.utility2.assetsDict['/assets.app.min.js'] =
                    local.utility2.uglifyIfProduction(
                        local.utility2.assetsDict['/assets.app.js']
                    );
                return options.module;
            }
            file = options.__dirname + '/example.js';
            // read script from README.md
            local.fs.readFileSync(options.__dirname + '/README.md', 'utf8')
                .replace(
                    (/```\w*?(\n[\W\s]*?example.js[\n\"][\S\s]+?)\n```/),
                    function (match0, match1, ii, text) {
                        // jslint-hack
                        local.utility2.nop(match0);
                        // preserve lineno
                        script = text.slice(0, ii).replace((/.+/g), '') + match1;
                    }
                );
            script = script
                // alias require($npm_package_name) to module.moduleExports;
                .replace(
                    "require('" + local.utility2.envDict.npm_package_name + "')",
                    'module.moduleExports'
                )
                // uncomment utility2-comment
                .replace((/<!-- utility2-comment\b([\S\s]+?)\butility2-comment -->/g), '$1');
            // jslint script
            local.utility2.jslintAndPrint(script, file);
            // cover script
            script = local.utility2.istanbulInstrumentInPackage(script, file);
            // init module
            module = local.require2.cache[file] = new local.Module(file);
            module.moduleExports = require(options.__dirname + '/index.js');
            // load script into module
            module._compile(script, file);
            // init exports
            module.exports.utility2 = local.utility2;
            module.exports[local.utility2.envDict.npm_package_name] = module.moduleExports;
            // init assets
            local.utility2.assetsDict[
                '/assets.' + local.utility2.envDict.npm_package_name + '.css'
            ] = local.fs.readFileSync(process.cwd() + '/index.css', 'utf8');
            local.utility2.assetsDict[
                '/assets.' + local.utility2.envDict.npm_package_name + '.js'
            ] = local.utility2.istanbulInstrumentInPackage(
                local.fs.readFileSync(process.cwd() + '/index.js', 'utf8')
                    .replace((/^#!/), '//'),
                process.cwd() + '/index.js'
            );
            local.utility2.assetsDict['/assets.example.js'] = script;
            local.utility2.assetsDict['/assets.test.js'] = '';
            local.utility2.tryCatchOnError(function () {
                local.utility2.assetsDict['/assets.test.js'] =
                    local.utility2.istanbulInstrumentInPackage(
                        local.fs.readFileSync(process.cwd() + '/test.js', 'utf8'),
                        process.cwd() + '/test.js'
                    );
            }, local.utility2.nop);
            local.utility2.assetsDict['/'] = local.utility2.assetsDict['/index.html'] =
                local.utility2.jslintAndPrintHtml(
                    local.utility2.templateRender(module.exports.templateIndexHtml, {
                        envDict: local.utility2.envDict,
                        isRollup: module.isRollup ||
                            local.utility2.envDict.NODE_ENV === 'production'
                    })
                );
            // debug dir
            [
                __dirname,
                process.cwd()
            ].forEach(function (dir) {
                local.fs.readdirSync(dir).forEach(function (file) {
                    file = dir + '/' + file;
                    // if the file is modified, then restart the process
                    local.utility2.onFileModifiedRestart(file);
                    switch (local.path.extname(file)) {
                    case '.css':
                    case '.js':
                    case '.json':
                        // jslint file
                        local.utility2.jslintAndPrintConditional(
                            local.fs.readFileSync(file, 'utf8'),
                            file
                        );
                        break;
                    }
                });
            });
            return module.exports;
        };

        local.utility2.serverRespondDefault = function (request, response, statusCode, error) {
        /*
         * this function will respond with a default message,
         * or error.stack for the given statusCode
         */
            // init statusCode and contentType
            local.utility2.serverRespondHeadSet(
                request,
                response,
                statusCode,
                { 'Content-Type': 'text/plain; charset=utf-8' }
            );
            if (error) {
                // debug statusCode / method / url
                local.utility2.errorMessagePrepend(error, response.statusCode + ' ' +
                    request.method + ' ' + request.url + '\n');
                // print error.stack to stderr
                local.utility2.onErrorDefault(error);
                // end response with error.stack
                response.end(error.stack);
                return;
            }
            // end response with default statusCode message
            response.end(
                statusCode + ' ' + local.http.STATUS_CODES[statusCode]
            );
        };

        local.utility2.serverRespondEcho = function (request, response) {
        /*
         * this function will respond with debug info
         */
            response.write(request.method + ' ' + request.url +
                ' HTTP/' + request.httpVersion + '\r\n' +
                Object.keys(request.headers).map(function (key) {
                    return key + ': ' + request.headers[key] + '\r\n';
                }).join('') + '\r\n');
            request.pipe(response);
        };

        local.utility2.serverRespondHeadSet = function (
            request,
            response,
            statusCode,
            headers
        ) {
        /*
         * this function will set the response object's statusCode / headers
         */
            // jslint-hack
            local.utility2.nop(request);
            if (response.headersSent) {
                return;
            }
            // init response.statusCode
            if (Number(statusCode)) {
                response.statusCode = Number(statusCode);
            }
            Object.keys(headers).forEach(function (key) {
                if (headers[key]) {
                    response.setHeader(key, headers[key]);
                }
            });
            return true;
        };

        local.utility2.serverRespondTimeoutDefault = function (request, response, timeout) {
        /*
         * this function will return a timeout-error-handler for the server-request
         */
            request.onTimeout = request.onTimeout || function (error) {
                local.utility2.serverRespondDefault(request, response, 500, error);
                setTimeout(function () {
                    // cleanup request and response
                    local.utility2.requestResponseCleanup(request, response);
                }, 1000);
            };
            request.timerTimeout = local.utility2.onTimeout(
                request.onTimeout,
                timeout || local.utility2.timeoutDefault,
                'server ' + request.method + ' ' + request.url
            );
            response.on('finish', function () {
                // cleanup timerTimeout
                clearTimeout(request.timerTimeout);
            });
        };

        local.utility2.serverLocalUrlTest = local.utility2.nop;

        local.utility2.sjclCipherAes128Decrypt = function (password, encrypted) {
        /*
         * this function will aes-decrypt the encrypted-data with the given password
         */
            var decrypted;
            local.utility2.tryCatchOnError(function () {
                encrypted = encrypted.split('.');
                decrypted = local.utility2.sjcl.decrypt(password, JSON.stringify({
                    ct: encrypted[2],
                    iter: 128,
                    iv: encrypted[1],
                    mode: 'gcm',
                    salt: encrypted[0]
                }));
            }, local.utility2.nop);
            return decrypted;
        };

        local.utility2.sjclCipherAes128Encrypt = function (password, decrypted) {
        /*
         * this function will aes-encrypt the decrypted-data with the given password
         */
            var options;
            options = { iter: 128, mode: 'gcm' };
            options = JSON.parse(local.utility2.sjcl.encrypt(password, decrypted, options));
            return (options.salt + '.' + options.iv + '.' + options.ct)
                .replace((/\=/g), '');
        };

        local.utility2.sjclHashHmacSha256Create = function (password, data) {
        /*
         * this function will return the base64-encoded hmac-sha256 hash
         * of the data with the given password
         */
            return local.utility2.sjcl.codec.base64.fromBits(
                new local.utility2.sjcl.misc.hmac(
                    local.utility2.sjcl.codec.utf8String.toBits(password)
                ).encrypt(data)
            );
        };

        local.utility2.sjclHashScryptCreate = function (password, options) {
        /*
         * https://github.com/wg/scrypt
         * this function will return the scrypt-hash of the password
         * with the given options (default = $s0$10801)
         * e.g. $s0$e0801$epIxT/h6HbbwHaehFnh/bw==$7H0vsXlY8UxxyW/BWx/9GuY7jEvGjT71GFd6O4SZND0=
         */
            // init options
            options = (options || '$s0$10801').split('$');
            // init salt
            if (!options[3]) {
                options[3] = local.utility2.sjcl.codec.base64.fromBits(
                    local.utility2.sjcl.random.randomWords(4, 0)
                );
            }
            // init hash
            options[4] = local.utility2.sjcl.codec.base64.fromBits(
                local.utility2.sjcl.misc.scrypt(
                    password || '',
                    local.utility2.sjcl.codec.base64.toBits(options[3]),
                    Math.pow(2, parseInt(options[2].slice(0, 1), 16)),
                    parseInt(options[2].slice(1, 2), 16),
                    parseInt(options[2].slice(3, 4), 16)
                )
            );
            return options.slice(0, 5).join('$');
        };

        local.utility2.sjclHashScryptValidate = function (password, hash) {
        /*
         * https://github.com/wg/scrypt
         * this function will validate the password against the scrypt-hash
         */
            return local.utility2.sjclHashScryptCreate(password, hash) === hash;
        };

        local.utility2.sjclHashSha256Create = function (data) {
        /*
         * this function will return the base64-encoded sha-256 hash of the string data
         */
            return local.utility2.sjcl.codec.base64.fromBits(
                local.utility2.sjcl.hash.sha256.hash(data)
            );
        };

        local.utility2.stateInit = function (options) {
        /*
         * this function will init the state-options
         */
            local.utility2.objectSetOverride(local, options, 10);
        };

        local.utility2.streamReadAll = function (stream, onError) {
        /*
         * this function will concat data from the stream,
         * and pass it to onError when done reading
         */
            var chunkList;
            chunkList = [];
            // read data from the stream
            stream
                // on data event, push the buffer chunk to chunkList
                .on('data', function (chunk) {
                    chunkList.push(chunk);
                })
                // on end event, pass concatenated read buffer to onError
                .on('end', function () {
                    onError(null, local.modeJs === 'browser'
                        ? chunkList[0]
                        : local.utility2.bufferConcat(chunkList));
                })
                // on error event, pass error to onError
                .on('error', onError);
        };

        local.utility2.stringFromBase64 = function (text) {
        /*
         * this function will convert the base64-encoded text to text
         */
            return local.utility2.bufferToString(local.utility2.bufferCreate(text, 'base64'));
        };

        local.utility2.stringHtmlSafe = function (text) {
        /*
         * this function will replace '&' to '&amp;', '<' to '&lt;',
         * and '>' to '&gt;' in the text to make it htmlSafe
         */
            return text
                .replace((/&/g), '&amp;')
                .replace((/</g), '&lt;')
                .replace((/>/g), '&gt;')
                .replace((/"/g), '&quot;')
                .replace((/'/g), '&#x27;')
                .replace((/`/g), '&#x60;');
        };

        local.utility2.stringToBase64 = function (text) {
        /*
         * this function will convert the text to base64-encoded text
         */
            return local.utility2.bufferToString(local.utility2.bufferCreate(text), 'base64');
        };

        local.utility2.taskOnErrorPush = function (options, onError) {
        /*
         * this function will push the callback onError to the task named options.key
         */
            var task;
            onError = local.utility2.onErrorWithStack(onError);
            // init task
            task = local.utility2.taskOnTaskDict[options.key] =
                local.utility2.taskOnTaskDict[options.key] || { onErrorList: [] };
            // push callback onError to the task
            task.onErrorList.push(onError);
        };

        local.utility2.taskOnErrorPushCached = function (options, onError, onTask) {
        /*
         * this function will
         * 1. if cache-hit, then call onError with cacheValue
         * 2. run onTask in background
         * 3. save onTask's result to cache
         * 4. if cache-miss, then call onError with onTask's result
         */
            var modeNext, onNext;
            modeNext = 0;
            onNext = function (error, data) {
                modeNext += 1;
                switch (modeNext) {
                //  1. if cache-hit, then call onError with cacheValue
                case 1:
                    onError = local.utility2.onErrorWithStack(onError);
                    // read cacheValue from memory-cache
                    local.utility2.cacheDict[options.cacheDict] =
                        local.utility2.cacheDict[options.cacheDict] || {};
                    options.cacheValue =
                        local.utility2.cacheDict[options.cacheDict][options.key];
                    if (options.cacheValue) {
                        // call onError with cacheValue
                        options.modeCacheHit = true;
                        onError(null, JSON.parse(options.cacheValue));
                        if (!options.modeCacheUpdate) {
                            break;
                        }
                    }
                    // run background-task with lower priority for cache-hit
                    setTimeout(onNext, options.modeCacheHit && options.cacheTtl);
                    break;
                // 2. run onTask in background
                case 2:
                    local.utility2.taskOnErrorPush(options, onNext);
                    local.utility2.taskOnTaskUpsert(options, onTask);
                    break;
                case 3:
                    // 3. save onTask's result to cache
                    // JSON.stringify data to prevent side-effects on cache
                    options.cacheValue = JSON.stringify(data);
                    if (!error && options.cacheValue) {
                        local.utility2.cacheDict[options.cacheDict][options.key] =
                            options.cacheValue;
                    }
                    // 4. if cache-miss, then call onError with onTask's result
                    if (!options.modeCacheHit) {
                        onError(error, options.cacheValue && JSON.parse(options.cacheValue));
                    }
                    (options.onCacheWrite || local.utility2.nop)();
                    break;
                }
            };
            onNext();
        };

        local.utility2.taskOnTaskUpsert = function (options, onTask) {
        /*
         * this function will upsert the task onTask named options.key
         */
            var task;
            // init task
            task = local.utility2.taskOnTaskDict[options.key] =
                local.utility2.taskOnTaskDict[options.key] || { onErrorList: [] };
            // if task is defined, then return
            if (task.onTask) {
                return task;
            }
            task.onDone = function () {
                // if already done, then do nothing
                if (task.done) {
                    return;
                }
                task.done = true;
                // cleanup timerTimeout
                clearTimeout(task.timerTimeout);
                // cleanup task
                delete local.utility2.taskOnTaskDict[options.key];
                // preserve error.message and error.stack
                task.result = JSON.stringify(Array.prototype.slice.call(arguments)
                    .map(function (element) {
                        if (element && element.stack) {
                            element = local.utility2.objectSetDefault(local.utility2.jsonCopy(
                                element
                            ), {
                                message: element.message,
                                name: element.name,
                                stack: element.stack
                            });
                        }
                        return element;
                    }));
                // pass result to callbacks in onErrorList
                task.onErrorList.forEach(function (onError) {
                    onError.apply(null, JSON.parse(task.result));
                });
            };
            // init timerTimeout
            task.timerTimeout = local.utility2.onTimeout(
                task.onDone,
                options.timeout || local.utility2.timeoutDefault,
                'taskOnTaskUpsert ' + options.key
            );
            task.onTask = onTask;
            // run onTask
            task.onTask(task.onDone);
            return task;
        };

        local.utility2.templateRender = function (template, dict) {
        /*
         * this function will render the template with the given dict
         */
            var argList, getValue, match, renderPartial, rgx, value;
            dict = dict || {};
            getValue = function (key) {
                argList = key.split(' ');
                value = dict;
                // iteratively lookup nested values in the dict
                argList[0].split('.').forEach(function (key) {
                    value = value && value[key];
                });
                return value;
            };
            renderPartial = function (match0, helper, key, partial) {
                switch (helper) {
                case 'each':
                    value = getValue(key);
                    return Array.isArray(value)
                        ? value.map(function (dict) {
                            // recurse with partial
                            return local.utility2.templateRender(partial, dict);
                        }).join('')
                        : '';
                case 'if':
                    partial = partial.split('{{#unless ' + key + '}}');
                    partial = getValue(key)
                        ? partial[0]
                        // handle 'unless' case
                        : partial.slice(1).join('{{#unless ' + key + '}}');
                    // recurse with partial
                    return local.utility2.templateRender(partial, dict);
                case 'unless':
                    return getValue(key)
                        ? ''
                        // recurse with partial
                        : local.utility2.templateRender(partial, dict);
                default:
                    // recurse with partial
                    return match0[0] + local.utility2.templateRender(match0.slice(1), dict);
                }
            };
            // render partials
            rgx = (/\{\{#(\w+) ([^}]+?)\}\}/g);
            for (match = rgx.exec(template); match; match = rgx.exec(template)) {
                rgx.lastIndex += 1 - match[0].length;
                template = template.replace(
                    new RegExp('\\{\\{#(' + match[1] + ') (' + match[2] +
                        ')\\}\\}([\\S\\s]*?)\\{\\{/' + match[1] + ' ' + match[2] +
                        '\\}\\}'),
                    renderPartial
                );
            }
            // search for keys in the template
            return template.replace((/\{\{[^}]+?\}\}/g), function (match0) {
                getValue(match0.slice(2, -2));
                if (value === undefined) {
                    return match0;
                }
                argList.slice(1).forEach(function (arg) {
                    switch (arg) {
                    case 'decodeURIComponent':
                        value = decodeURIComponent(value);
                        break;
                    case 'encodeURIComponent':
                        value = encodeURIComponent(value);
                        break;
                    case 'htmlSafe':
                        value = local.utility2.stringHtmlSafe(String(value));
                        break;
                    case 'jsonStringify':
                        value = JSON.stringify(value);
                        break;
                    default:
                        value = value[arg]();
                        break;
                    }
                });
                return String(value);
            });
        };

        local.utility2.testMock = function (mockList, onTestCase, onError) {
        /*
         * this function will mock the objects in mockList while running the onTestCase
         */
            var onError2;
            onError2 = function (error) {
                // restore mock[0] from mock[2]
                mockList.reverse().forEach(function (mock) {
                    local.utility2.objectSetOverride(mock[0], mock[2]);
                });
                onError(error);
            };
            // try to call onError with mock-objects
            local.utility2.tryCatchOnError(function () {
                // mock-objects
                mockList.forEach(function (mock) {
                    mock[2] = {};
                    // backup mock[0] into mock[2]
                    Object.keys(mock[1]).forEach(function (key) {
                        mock[2][key] = mock[0][key];
                    });
                    // override mock[0] with mock[1]
                    local.utility2.objectSetOverride(mock[0], mock[1]);
                });
                // run onTestCase
                onTestCase(onError2);
            }, onError2);
        };

        local.utility2.testReportCreate = function (testReport) {
        /*
         * this function will create test-report artifacts
         */
            // print test-report summary
            console.log('\n' + new Array(56).join('-') + '\n' + testReport.testPlatformList
                .filter(function (testPlatform) {
                    // if testPlatform has no tests, then filter it out
                    return testPlatform.testCaseList.length;
                })
                .map(function (testPlatform) {
                    return '| test-report - ' + testPlatform.name + '\n|' +
                        ('        ' + testPlatform.timeElapsed + ' ms     ')
                        .slice(-16) +
                        ('        ' + testPlatform.testsFailed + ' failed ')
                        .slice(-16) +
                        ('        ' + testPlatform.testsPassed + ' passed ')
                        .slice(-16) + '     |\n' + new Array(56).join('-');
                })
                .join('\n') + '\n');
            // create test-report.html
            local.fs.writeFileSync(
                local.utility2.envDict.npm_config_dir_build + '/test-report.html',
                local.utility2.testReportMerge(testReport, {})
            );
            // create build.badge.svg
            local.fs.writeFileSync(local.utility2.envDict.npm_config_dir_build +
                '/build.badge.svg', local.utility2.templateBuildBadgeSvg
                // edit branch name
                .replace((/0000-00-00 00:00:00/g),
                    new Date().toISOString().slice(0, 19).replace('T', ' '))
                // edit branch name
                .replace((/- master -/g), '| ' + local.utility2.envDict.CI_BRANCH + ' |')
                // edit commit id
                .replace((/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/g),
                    local.utility2.envDict.CI_COMMIT_ID));
            // create test-report.badge.svg
            local.fs.writeFileSync(local.utility2.envDict.npm_config_dir_build +
                '/test-report.badge.svg', local.utility2.templateTestReportBadgeSvg
                // edit number of tests failed
                .replace((/999/g), testReport.testsFailed)
                // edit badge color
                .replace(
                    (/d00/g),
                    // coverage-hack - cover both fail and pass cases
                    '0d00'.slice(!!testReport.testsFailed).slice(0, 3)
                ));
            console.log('created test-report file://' +
                local.utility2.envDict.npm_config_dir_build + '/test-report.html\n');
            // if any test failed, then exit with non-zero exit-code
            console.log('\n' + local.utility2.envDict.MODE_BUILD +
                ' - ' + testReport.testsFailed + ' failed tests\n');
            // exit with number of tests failed
            local.utility2.exit(testReport.testsFailed);
        };

        local.utility2.testReportMerge = function (testReport1, testReport2) {
        /*
         * this function will
         * 1. merge testReport2 into testReport1
         * 2. return testReport1 in html-format
         */
            var errorStackList, testCaseNumber, testReport;
            // 1. merge testReport2 into testReport1
            [testReport1, testReport2].forEach(function (testReport, ii) {
                ii += 1;
                local.utility2.objectSetDefault(testReport, {
                    date: new Date().toISOString(),
                    errorStackList: [],
                    testPlatformList: [],
                    timeElapsed: 0
                }, 8);
                // security - handle malformed testReport
                local.utility2.assert(
                    testReport && typeof testReport === 'object',
                    ii + ' invalid testReport ' + typeof testReport
                );
                // validate timeElapsed
                local.utility2.assert(
                    typeof testReport.timeElapsed === 'number',
                    ii + ' invalid testReport.timeElapsed ' + typeof testReport.timeElapsed
                );
                // security - handle malformed testReport.testPlatformList
                testReport.testPlatformList.forEach(function (testPlatform) {
                    local.utility2.objectSetDefault(testPlatform, {
                        name: 'undefined',
                        testCaseList: [],
                        timeElapsed: 0
                    }, 8);
                    local.utility2.assert(
                        typeof testPlatform.name === 'string',
                        ii + ' invalid testPlatform.name ' + typeof testPlatform.name
                    );
                    // insert $MODE_BUILD into testPlatform.name
                    if (local.utility2.envDict.MODE_BUILD) {
                        testPlatform.name = testPlatform.name.replace(
                            (/^(browser|node)\b/),
                            local.utility2.envDict.MODE_BUILD + ' - $1'
                        );
                    }
                    // validate timeElapsed
                    local.utility2.assert(
                        typeof testPlatform.timeElapsed === 'number',
                        ii + ' invalid testPlatform.timeElapsed ' +
                            typeof testPlatform.timeElapsed
                    );
                    // security - handle malformed testPlatform.testCaseList
                    testPlatform.testCaseList.forEach(function (testCase) {
                        local.utility2.objectSetDefault(testCase, {
                            errorStack: '',
                            name: 'undefined',
                            timeElapsed: 0
                        }, 8);
                        local.utility2.assert(
                            typeof testCase.errorStack === 'string',
                            ii + ' invalid testCase.errorStack ' + typeof testCase.errorStack
                        );
                        local.utility2.assert(
                            typeof testCase.name === 'string',
                            ii + ' invalid testCase.name ' + typeof testCase.name
                        );
                        // validate timeElapsed
                        local.utility2.assert(
                            typeof testCase.timeElapsed === 'number',
                            ii + ' invalid testCase.timeElapsed ' + typeof testCase.timeElapsed
                        );
                    });
                });
            });
            // merge testReport2.testPlatformList into testReport1.testPlatformList
            testReport2.testPlatformList.forEach(function (testPlatform2) {
                // add testPlatform2 to testReport1.testPlatformList
                testReport1.testPlatformList.push(testPlatform2);
            });
            // update testReport1.timeElapsed
            testReport1.timeElapsed += testReport2.timeElapsed;
            testReport = testReport1;
            testReport.testsFailed = 0;
            testReport.testsPassed = 0;
            testReport.testsPending = 0;
            testReport.testPlatformList.forEach(function (testPlatform) {
                testPlatform.testsFailed = 0;
                testPlatform.testsPassed = 0;
                testPlatform.testsPending = 0;
                testPlatform.testCaseList.forEach(function (testCase) {
                    switch (testCase.status) {
                    // update failed tests
                    case 'failed':
                        testPlatform.testsFailed += 1;
                        testReport.testsFailed += 1;
                        break;
                    // update passed tests
                    case 'passed':
                        testPlatform.testsPassed += 1;
                        testReport.testsPassed += 1;
                        break;
                    // update pending tests
                    default:
                        testPlatform.testsPending += 1;
                        testReport.testsPending += 1;
                    }
                });
                // update testPlatform.status
                testPlatform.status = testPlatform.testsFailed
                    ? 'failed'
                    : testPlatform.testsPending
                    ? 'pending'
                    : 'passed';
                // sort testCaseList by status and name
                testPlatform.testCaseList.sort(function (arg1, arg2) {
                    return arg1.status.replace('passed', 'z') + arg1.name <
                        arg2.status.replace('passed', 'z') + arg2.name
                        ? -1
                        : 1;
                });
            });
            // sort testPlatformList by status and name
            testReport.testPlatformList.sort(function (arg1, arg2) {
                return arg1.status.replace('passed', 'z') + arg1.name <
                    arg2.status.replace('passed', 'z') + arg2.name
                    ? -1
                    : 1;
            });
            // stop testReport timer
            if (testReport.testsPending === 0) {
                local.utility2.timeElapsedStop(testReport);
            }
            // 2. return testReport1 in html-format
            // json-copy testReport that will be modified for html templating
            testReport = local.utility2.jsonCopy(testReport1);
            // update timeElapsed
            local.utility2.timeElapsedStop(testReport);
            testReport.testPlatformList.forEach(function (testPlatform) {
                local.utility2.timeElapsedStop(testPlatform);
                testPlatform.testCaseList.forEach(function (testCase) {
                    if (!testCase.done) {
                        local.utility2.timeElapsedStop(testCase);
                    }
                    testPlatform.timeElapsed = Math.max(
                        testPlatform.timeElapsed,
                        testCase.timeElapsed
                    );
                });
                // update testReport.timeElapsed with testPlatform.timeElapsed
                testReport.timeElapsed =
                    Math.max(testReport.timeElapsed, testPlatform.timeElapsed);
            });
            // create html test-report
            testCaseNumber = 0;
            return local.utility2.templateRender(
                local.utility2.templateTestReportHtml,
                local.utility2.objectSetOverride(testReport, {
                    envDict: local.utility2.envDict,
                    // map testPlatformList
                    testPlatformList: testReport.testPlatformList
                        .filter(function (testPlatform) {
                            // if testPlatform has no tests, then filter it out
                            return testPlatform.testCaseList.length;
                        })
                        .map(function (testPlatform, ii) {
                            errorStackList = [];
                            return local.utility2.objectSetOverride(testPlatform, {
                                errorStackList: errorStackList,
                                name: testPlatform.name,
                                screenCaptureImg: testPlatform.screenCaptureImg,
                                // map testCaseList
                                testCaseList: testPlatform.testCaseList.map(function (
                                    testCase
                                ) {
                                    testCaseNumber += 1;
                                    if (testCase.errorStack) {
                                        errorStackList.push({
                                            errorStack: testCaseNumber + '. ' + testCase.name +
                                                '\n' + testCase.errorStack
                                        });
                                    }
                                    return local.utility2.objectSetOverride(testCase, {
                                        testCaseNumber: testCaseNumber,
                                        testReportTestStatusClass: 'test' +
                                            testCase.status[0].toUpperCase() +
                                            testCase.status.slice(1)
                                    }, 8);
                                }),
                                preClass: errorStackList.length
                                    ? ''
                                    : 'displayNone',
                                testPlatformNumber: ii + 1
                            });
                        }, 8),
                    testStatusClass: testReport.testsFailed
                        ? 'testFailed'
                        : 'testPassed'
                }, 8)
            );
        };

        local.utility2.testRun = function (options) {
        /*
         * this function will run all tests in testPlatform.testCaseList
         */
            var exit, onParallel, testPlatform, testReport, testReportDiv, timerInterval;
            // init modeTest
            local.utility2.modeTest = local.utility2.modeTest ||
                local.utility2.envDict.npm_config_mode_test;
            if (!(local.utility2.modeTest || options.modeTest)) {
                return;
            }
            if (!options.onReadyAfter) {
                // reset nedb
                local.utility2.dbReset();
                options.onReadyAfter = local.utility2.onReadyAfter(function () {
                    local.utility2.testRun(options);
                });
                return;
            }
            // init onParallel
            onParallel = local.utility2.onParallel(function () {
            /*
             * this function will create the test-report after all tests are done
             */
                // stop testPlatform timer
                local.utility2.timeElapsedStop(testPlatform);
                // finalize testReport
                local.utility2.testReportMerge(testReport, {});
                switch (local.modeJs) {
                case 'browser':
                    // notify saucelabs of test results
                    // https://docs.saucelabs.com/reference/rest-api/
                    // #js-unit-testing
                    local.global.global_test_results = {
                        coverage: local.global.__coverage__,
                        failed: testReport.testsFailed,
                        testReport: testReport
                    };
                    break;
                case 'node':
                    // create test-report.json
                    local.fs.writeFileSync(
                        local.utility2.envDict.npm_config_dir_build + '/test-report.json',
                        JSON.stringify(testReport)
                    );
                    // restore exit
                    process.exit = exit;
                    break;
                }
                setTimeout(function () {
                    if (local.modeJs === 'browser') {
                        // update coverageReport
                        local.utility2.istanbulCoverageReportCreate({
                            coverage: local.global.__coverage__
                        });
                    }
                    // exit with number of tests failed
                    local.utility2.exit(testReport.testsFailed);
                // coverage-hack - wait 1000 ms for timerInterval
                }, 1000);
            });
            onParallel.counter += 1;
            // mock exit
            switch (local.modeJs) {
            case 'node':
                exit = process.exit;
                process.exit = local.utility2.nop;
                break;
            }
            // init modeTestCase
            local.utility2.modeTestCase = local.utility2.modeTestCase ||
                local.utility2.envDict.npm_config_mode_test_case;
            // init testReport
            testReport = local.utility2.testReport;
            // init testReport timer
            local.utility2.timeElapsedStart(testReport);
            // init testPlatform
            testPlatform = local.utility2.testReport.testPlatformList[0];
            // init testPlatform timer
            local.utility2.timeElapsedStart(testPlatform);
            // reset testPlatform.testCaseList
            testPlatform.testCaseList.length = 0;
            // add tests into testPlatform.testCaseList
            Object.keys(options).forEach(function (key) {
                // add testCase options[key] to testPlatform.testCaseList
                if ((local.utility2.modeTestCase && local.utility2.modeTestCase === key) ||
                        (!local.utility2.modeTestCase && key.indexOf('testCase_') === 0)) {
                    testPlatform.testCaseList.push({
                        name: key,
                        status: 'pending',
                        onTestCase: options[key]
                    });
                }
            });
            // visual notification - update test-progress until done
            // init testReportDiv element
            if (local.modeJs === 'browser') {
                testReportDiv = document.querySelector('.testReportDiv');
            }
            testReportDiv = testReportDiv || { style: {} };
            testReportDiv.style.display = 'block';
            testReportDiv.innerHTML = local.utility2.testReportMerge(testReport, {});
            // update test-report status every 1000 ms until done
            timerInterval = setInterval(function () {
                // update testReportDiv in browser
                testReportDiv.innerHTML = local.utility2.testReportMerge(testReport, {});
                if (testReport.testsPending === 0) {
                    // cleanup timerInterval
                    clearInterval(timerInterval);
                }
            }, 1000);
            // shallow-copy testPlatform.testCaseList to prevent side-effects
            // from in-place sort from testReportMerge
            testPlatform.testCaseList.slice().forEach(function (testCase) {
                var onError, timerTimeout;
                onError = function (error) {
                    // cleanup timerTimeout
                    clearTimeout(timerTimeout);
                    // if testCase already done, then fail testCase with error for ending again
                    if (testCase.done) {
                        error = error || new Error('callback in testCase ' +
                            testCase.name + ' called multiple times');
                    }
                    // if error occurred, then fail testCase
                    if (error) {
                        testCase.status = 'failed';
                        console.error('\ntestCase ' + testCase.name + ' failed\n' +
                            error.message + '\n' + error.stack);
                        testCase.errorStack = testCase.errorStack ||
                            error.message + '\n' + error.stack;
                        // validate errorStack is non-empty
                        local.utility2.assert(testCase.errorStack, 'invalid errorStack ' +
                            testCase.errorStack);
                    }
                    // if already done, then do nothing
                    if (testCase.done) {
                        return;
                    }
                    testCase.done = true;
                    if (testCase.status === 'pending') {
                        testCase.status = 'passed';
                    }
                    // stop testCase timer
                    local.utility2.timeElapsedStop(testCase);
                    console.log('[' + local.modeJs + ' test-case ' +
                        testPlatform.testCaseList.filter(function (testCase) {
                            return testCase.done;
                        }).length + ' of ' + testPlatform.testCaseList.length + ' ' +
                        testCase.status + '] - ' + testCase.name);
                    // if all tests are done, then create test-report
                    onParallel();
                };
                // init timerTimeout
                timerTimeout = local.utility2.onTimeout(
                    onError,
                    local.utility2.timeoutDefault,
                    testCase.name
                );
                // increment number of tests remaining
                onParallel.counter += 1;
                // try to run testCase
                local.utility2.tryCatchOnError(function () {
                    // start testCase timer
                    local.utility2.timeElapsedStart(testCase);
                    testCase.onTestCase(null, onError);
                }, onError);
            });
            onParallel();
        };

        local.utility2.testRunServer = function (options) {
        /*
         * this function will
         * 1. create server from options.middleware
         * 2. start server on local.utility2.envDict.PORT
         * 3. run tests
         */
            local.utility2.onReadyBefore.counter += 1;
            local.utility2.objectSetDefault(options, {
                middleware: local.utility2.middlewareGroupCreate([
                    local.utility2.middlewareInit,
                    local.utility2.middlewareAssetsCached,
                    local.utility2.middlewareJsonpStateInit
                ]),
                middlewareError: local.utility2.middlewareError
            });
            // 1. create server from options.middleware
            local.utility2.serverLocalRequestHandler = function (request, response) {
                options.middleware(request, response, function (error) {
                    options.middlewareError(error, request, response);
                });
            };
            local.utility2.server = local.http.createServer(
                local.utility2.serverLocalRequestHandler
            );
            // 2. start server on local.utility2.envDict.PORT
            local.utility2.envDict.PORT = local.utility2.envDict.PORT || '8081';
            console.log('server listening on http-port ' + local.utility2.envDict.PORT);
            local.utility2.onReadyBefore.counter += 1;
            local.utility2.server.listen(
                local.utility2.envDict.PORT,
                local.utility2.onReadyBefore
            );
            // 3. run tests
            local.utility2.testRun(options);
            local.utility2.onReadyBefore();
        };

        local.utility2.timeElapsedStart = function (options) {
        /*
         * this function will start options.timeElapsed
         */
            options = options || {};
            options.timeStart = options.timeStart || Date.now();
            return options;
        };

        local.utility2.timeElapsedStop = function (options) {
        /*
         * this function will stop options.timeElapsed
         */
            options = local.utility2.timeElapsedStart(options);
            options.timeElapsed = Date.now() - options.timeStart;
            return options;
        };

        local.utility2.tryCatchOnError = function (task, onError) {
        /*
         * this function will try to run the task in a try-catch block,
         * else call onError with the errorCaught
         */
            try {
                local.utility2.tryCatchErrorCaught = null;
                task();
            } catch (errorCaught) {
                local.utility2.tryCatchErrorCaught = errorCaught;
                onError(errorCaught);
            }
        };

        local.utility2.uglify = (local.utility2.uglifyjs &&
            local.utility2.uglifyjs.uglify) || local.utility2.echo;

        local.utility2.uglifyIfProduction = function (code) {
        /*
         * this function will, if $NODE_ENV === production, then uglify the js-code
         *
         */
            return local.utility2.envDict.NODE_ENV === 'production'
                ? local.utility2.uglify(code)
                : code;
        };

        local.utility2.urlParse = function (url) {
        /*
         * https://developer.mozilla.org/en-US/docs/Web/API/URL
         * this function will parse the url according to the above spec, plus a query param
         */
            var urlParsed;
            urlParsed = {};
            // try to parse the url
            local.utility2.tryCatchOnError(function () {
                // resolve host-less url
                switch (local.modeJs) {
                case 'browser':
                    local.utility2.serverLocalHost = local.utility2.serverLocalHost ||
                        location.protocol + '//' + location.host;
                    // resolve absolute path
                    if (url[0] === '/') {
                        url = local.utility2.serverLocalHost + url;
                    // resolve relative path
                    } else if (!(/^\w+?:\/\//).test(url)) {
                        url = local.utility2.serverLocalHost +
                            location.pathname.replace((/\/[^\/]*?$/), '') + '/' + url;
                    }
                    urlParsed = new local.global.URL(url);
                    break;
                case 'node':
                    local.utility2.serverLocalHost = local.utility2.serverLocalHost ||
                        'http://localhost:' + (local.utility2.envDict.PORT || '80');
                    // resolve absolute path
                    if (url[0] === '/') {
                        url = local.utility2.serverLocalHost + url;
                    // resolve relative path
                    } else if (!(/^\w+?:\/\//).test(url)) {
                        url = local.utility2.serverLocalHost + '/' + url;
                    }
                    urlParsed = local.url.parse(url);
                    break;
                }
                // init query
                urlParsed.query = {};
                urlParsed.search.slice(1).replace((/[^&]+/g), function (item) {
                    item = item.split('=');
                    item[0] = decodeURIComponent(item[0]);
                    item[1] = decodeURIComponent(item.slice(1).join('='));
                    // parse repeating query-param as an array
                    if (urlParsed.query[item[0]]) {
                        if (!Array.isArray(urlParsed.query[item[0]])) {
                            urlParsed.query[item[0]] = [urlParsed.query[item[0]]];
                        }
                        urlParsed.query[item[0]].push(item[1]);
                    } else {
                        urlParsed.query[item[0]] = item[1];
                    }
                });
            }, local.utility2.nop);
            // https://developer.mozilla.org/en/docs/Web/API/URL#Properties
            return {
                hash: urlParsed.hash || '',
                host: urlParsed.host || '',
                hostname: urlParsed.hostname || '',
                href: urlParsed.href || '',
                pathname: urlParsed.pathname || '',
                port: urlParsed.port || '',
                protocol: urlParsed.protocol || '',
                query: urlParsed.query || {},
                search: urlParsed.search || ''
            };
        };

        local.utility2.uuid4Create = function () {
        /*
         * this function will return a random uuid,
         * with format 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
         */
            // code derived from http://jsperf.com/uuid4
            var id, ii;
            id = '';
            for (ii = 0; ii < 32; ii += 1) {
                switch (ii) {
                case 8:
                case 20:
                    id += '-';
                    // coerce to finite integer
                    id += (Math.random() * 16 | 0).toString(16);
                    break;
                case 12:
                    id += '-';
                    id += '4';
                    break;
                case 16:
                    id += '-';
                    id += (Math.random() * 4 | 8).toString(16);
                    break;
                default:
                    // coerce to finite integer
                    id += (Math.random() * 16 | 0).toString(16);
                }
            }
            return id;
        };

        local.utility2.uuidTimeCreate = function () {
        /*
         * this function will return a time-based version of uuid4,
         * with format 'tttttttt-tttx-4xxx-yxxx-xxxxxxxxxxxx'
         */
            return Date.now().toString(16).replace((/(.{8})/), '$1-') +
                local.utility2.uuid4Create().slice(12);
        };
    }());



    // run shared js-env code - post-init
    (function () {
        local.utility2.ajaxProgressCounter = 0;
        local.utility2.ajaxProgressState = 0;
        local.utility2.cacheDict = {};
        local.utility2.contentTypeDict = {
            // application
            '.js': 'application/javascript; charset=UTF-8',
            '.json': 'application/json; charset=UTF-8',
            '.pdf': 'application/pdf',
            '.xml': 'application/xml; charset=UTF-8',
            // image
            '.bmp': 'image/bmp',
            '.gif': 'image/gif',
            '.jpeg': 'image/jpeg',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.svg': 'image/svg+xml; charset=UTF-8',
            // text
            '.css': 'text/css; charset=UTF-8',
            '.htm': 'text/html; charset=UTF-8',
            '.html': 'text/html; charset=UTF-8',
            '.md': 'text/markdown; charset=UTF-8',
            '.txt': 'text/plain; charset=UTF-8'
        };
        local.utility2.dbSeedList = [];
        local.utility2.envDict = local.modeJs === 'browser'
            ? {}
            : process.env;
        local.utility2.errorDefault = new Error('default error');
        local.utility2.regexpUriComponentCharset = (/[\w\!\%\'\(\)\*\-\.\~]/);
        local.utility2.regexpUuidValidate =
            (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        local.utility2.stringAsciiCharset = local.utility2.stringExampleAscii ||
            '\x00\x01\x02\x03\x04\x05\x06\x07\b\t\n\x0b\f\r\x0e\x0f' +
            '\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f' +
            ' !"#$%&\'()*+,-./0123456789:;<=>?' +
            '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_' +
            '`abcdefghijklmnopqrstuvwxyz{|}~\x7f';
        local.utility2.stringUriComponentCharset = '!%\'()*-.' +
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~';
        local.utility2.taskOnTaskDict = {};
        local.utility2.testReport = { testPlatformList: [{
            name: local.modeJs === 'browser'
                ? 'browser - ' +
                    location.pathname + ' - ' +
                    navigator.userAgent + ' - ' +
                    new Date().toISOString()
                : 'node - ' + process.platform + ' ' + process.version + ' - ' +
                    new Date().toISOString(),
            screenCaptureImg: local.utility2.envDict.MODE_BUILD_SCREEN_CAPTURE,
            testCaseList: []
        }] };
        // init serverLocalHost
        local.utility2.urlParse('');
        // init timeoutDefault
        switch (local.modeJs) {
        case 'browser':
            location.search.replace(
                (/\b(NODE_ENV|mode[A-Z]\w+|timeExit|timeoutDefault)=([\w\-\.\%]+)/g),
                function (match0, key, value) {
                    // jslint-hack
                    local.utility2.nop(match0);
                    local.utility2[key] = local.utility2.envDict[key] = value;
                    // try to JSON.parse the string
                    local.utility2.tryCatchOnError(function () {
                        local.utility2[key] = JSON.parse(value);
                    }, local.utility2.nop);
                }
            );
            break;
        case 'node':
            local.utility2.timeoutDefault = local.utility2.envDict.npm_config_timeout_default;
            break;
        }
        // init timeExit
        local.utility2.timeExit = Number(local.utility2.timeExit) ||
            Number(Date.now() + Number(local.utility2.envDict.npm_config_timeout_exit)) ||
            Number(local.utility2.envDict.npm_config_time_exit);
        if (local.utility2.timeExit) {
            local.utility2.timeoutDefault = local.utility2.timeExit - Date.now();
            setTimeout(local.utility2.exit, local.utility2.timeoutDefault);
        }
        // re-init timeoutDefault
        local.utility2.timeoutDefault = Number(local.utility2.timeoutDefault || 30000);
        // init onReadyAfter
        local.utility2.onReadyAfter = function (onError) {
        /*
         * this function will call onError when onReadyBefore.counter === 0
         */
            local.utility2.onReadyBefore.counter += 1;
            local.utility2.taskOnErrorPush({ key: 'utility2.onReadyAfter' }, onError);
            local.utility2.onResetAfter(local.utility2.onReadyBefore);
            return onError;
        };
        // init onReadyBefore
        local.utility2.onReadyBefore = local.utility2.onParallel(function (error) {
        /*
         * this function will keep track of onReadyBefore.counter
         */
            local.utility2.taskOnErrorPush({ key: 'utility2.onReadyAfter' }, function (error) {
                // validate no error occurred
                local.utility2.assert(!error, error);
            });
            local.utility2.taskOnTaskUpsert({
                key: 'utility2.onReadyAfter'
            }, function (onError) {
                onError(error);
            });
        });
        // init onResetAfter
        local.utility2.onResetAfter = function (onError) {
        /*
         * this function will call onError when onResetBefore.counter === 0
         */
            local.utility2.onResetBefore.counter += 1;
            // visual notification - onResetAfter
            local.utility2.ajaxProgressUpdate();
            local.utility2.taskOnErrorPush({ key: 'utility2.onResetAfter' }, onError);
            setTimeout(local.utility2.onResetBefore);
            return onError;
        };
        // init onResetBefore
        local.utility2.onResetBefore = local.utility2.onParallel(function (error) {
        /*
         * this function will keep track of onResetBefore.counter
         */
            local.utility2.taskOnErrorPush({ key: 'utility2.onResetAfter' }, function (error) {
                // validate no error occurred
                local.utility2.assert(!error, error);
            });
            local.utility2.taskOnTaskUpsert({
                key: 'utility2.onResetAfter'
            }, function (onError) {
                onError(error);
            });
        });
        local.utility2.onReadyAfter(local.utility2.nop);
        // init state
        local.utility2.stateInit({});
    }());
    switch (local.modeJs) {



    // run browser js-env code - post-init
    case 'browser':
        // init exports
        local.global.utility2 = local.utility2;
        // require modules
        local.http = local._http;
        local.https = local._http;
        break;



    /* istanbul ignore next */
    // run node js-env code - post-init
    case 'node':
        // init exports
        module.exports = local.utility2;
        module.exports.__dirname = __dirname;
        // require modules
        local.Module = require('module');
        local.child_process = require('child_process');
        local.fs = require('fs');
        local.http = require('http');
        local.https = require('https');
        local.net = require('net');
        local.path = require('path');
        local.repl = require('repl');
        local.stream = require('stream');
        local.url = require('url');
        local.vm = require('vm');
        local.zlib = require('zlib');
        // init envDict
        local.utility2.objectSetDefault(local.utility2.envDict, {
            npm_config_dir_build: process.cwd() + '/tmp/build',
            npm_config_dir_tmp: process.cwd() + '/tmp'
        });
        if (module.isRollup) {
            break;
        }
        // init assets
        [
            'index.css',
            'index.js',
            'index.sh',
            'lib.istanbul.js',
            'lib.jslint.js',
            'lib.nedb.js',
            'lib.sjcl.js',
            'lib.uglifyjs.js',
            'templateDocApiHtml',
            'templateTestReportHtml'
        ].forEach(function (key) {
            switch (key) {
            case 'index.css':
                local.utility2.assetsDict['/assets.utility2.css'] =
                    local.fs.readFileSync(__dirname + '/' + key, 'utf8');
                break;
            case 'index.js':
                local.utility2.assetsDict['/assets.utility2.js'] =
                    local.utility2.istanbulInstrumentInPackage(
                        local.fs.readFileSync(__dirname + '/' + key, 'utf8')
                            .replace((/^#!/), '//'),
                        __dirname + '/' + key
                    );
                break;
            case 'index.sh':
                local.utility2.jslintAndPrintHtml(
                    local.fs.readFileSync(__dirname + '/' + key, 'utf8')
                        .replace((/^#!/), '//'),
                    __dirname + '/' + key
                );
                break;
            case 'lib.istanbul.js':
            case 'lib.jslint.js':
            case 'lib.nedb.js':
            case 'lib.sjcl.js':
            case 'lib.uglifyjs.js':
                local.utility2.assetsDict['/assets.utility2.' + key] =
                    local.utility2.istanbulInstrumentInPackage(
                        local.fs.readFileSync(__dirname + '/' + key, 'utf8')
                            .replace((/^#!/), '//')
                            .replace(
                                (/(\bistanbul instrument in package .*-lite\b)/),
                                '!$1'
                            ),
                        __dirname + '/' + key
                    );
                break;
            case 'templateDocApiHtml':
            case 'templateTestReportHtml':
                local.utility2.jslintAndPrintHtml(local.utility2[key], key);
                break;
            }
        });
        local.utility2.assetsDict['/assets.utility2.rollup.js'] = [
            '/assets.utility2.rollup.begin.js',
            '/assets.utility2.lib.istanbul.js',
            '/assets.utility2.lib.jslint.js',
            '/assets.utility2.lib.nedb.js',
            '/assets.utility2.lib.sjcl.js',
            '/assets.utility2.lib.uglifyjs.js',
            '/assets.utility2.js',
            '/assets.utility2.css',
            '/assets.utility2.rollup.end.js'
        ].map(function (key) {
            switch (local.path.extname(key)) {
            case '.js':
                return '// ' + key + '\n' + local.utility2.assetsDict[key];
            default:
                return '// ' + key + '\n' +
                    local.utility2.assetsDict['/assets.utility2.rollup.content.js']
                    .replace(
                        '/* utility2.rollup.js content */',
                        'local.utility2.assetsDict[' + JSON.stringify(key) + '] = ' +
                            JSON.stringify(local.utility2.assetsDict[key])
                    );
            }
        }).join('\n\n\n\n');
        // merge previous test-report
        if (local.utility2.envDict.npm_config_file_test_report_merge &&
                local.fs.existsSync(
                    local.utility2.envDict.npm_config_file_test_report_merge
                )) {
            local.utility2.testReportMerge(
                local.utility2.testReport,
                JSON.parse(local.fs.readFileSync(
                    local.utility2.envDict.npm_config_file_test_report_merge,
                    'utf8'
                ))
            );
        }
        // run the cli
        if (module !== local.require2.main) {
            break;
        }
        switch (process.argv[2]) {
        case 'browserTest':
            local.utility2.browserTest({}, local.utility2.exit);
            break;
        }
        break;
    }
}(
    (function () {
        'use strict';
        var local;
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
        // init module
        if (local.modeJs === 'node') {
            local = module;
            local.modeJs = 'node';
            local.require2 = require;
        }
        return local;
    }())
));




// /assets.utility2.css
(function () {
    "use strict";
    var local;
    (function () {
        if (typeof module === "object") {
            module.isRollup = true;
        }
        local = {};
        local.modeJs = (function () {
            try {
                return typeof navigator.userAgent === "string" &&
                    typeof document.querySelector("body") === "object" &&
                    typeof XMLHttpRequest.prototype.open === "function" &&
                    "browser";
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === "string" &&
                    typeof require("http").createServer === "function" &&
                    "node";
            }
        }());
        local = local.modeJs === "browser"
            ? window.utility2.local
            : module;
/* jslint-ignore-begin */
local.utility2.assetsDict["/assets.utility2.css"] = "/*csslint\n    box-model: false\n*/\n.ajaxProgressBarDiv {\n    animation: 2s linear 0s normal none infinite ajaxProgressBarDivAnimation;\n    background-image: linear-gradient(\n    45deg,rgba(255,255,255,.25) 25%,\n    transparent 25%,\n    transparent 50%,\n    rgba(255,255,255,.25) 50%,\n    rgba(255,255,255,.25) 75%,\n    transparent 75%,\n    transparent\n    );\n    background-size: 40px 40px;\n    color: #fff;\n    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n    font-size: 12px;\n    padding: 2px 0 2px 0;\n    text-align: center;\n    text-shadow: 0 0 5px #007;\n    transition: width 1s ease-in-out;\n    width: 25%;\n}\n.ajaxProgressBarDivLoaded {\n    background-color: #3b3;\n}\n.ajaxProgressBarDivLoading {\n    background-color: #37b;\n}\n.ajaxProgressDiv {\n    background-color: #fff;\n    box-shadow: 0 0 1px 1px #333;\n    display: none;\n    left: 50%;\n    margin: 0 0 0 -50px;\n    padding: 4px 4px 4px 4px;\n    position: fixed;\n    top: 49%;\n    width: 100px;\n    z-index: 9999;\n}\n@keyframes ajaxProgressBarDivAnimation {\n    from { background-position: 40px 0; }\n    to { background-position: 0 0; }\n}\n"
/* jslint-ignore-end */
    }());
}());




// /assets.utility2.rollup.end.js
/* utility2.rollup.js end */