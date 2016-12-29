/* globals lunr HTMLImports*/
(function () {
    'use strict';

    // also try http://fusejs.io/
    // https://github.com/fortnightlabs/snowball-js
    // https://github.com/mattyork/fuzzy
    // https://github.com/fiatjaf/js-search-engines-comparison
    var allData = [];
    var projectItemsElement;

    var buildIndex = function (index, data) {
        data.forEach(function (projectItem) {
            index.add(projectItem);
        });
    };

    var addListState = function (data) {
        data.forEach(function (projectItem) {
            projectItem.block_diagram_images.forEach(function (blockDiagramImage) {
                blockDiagramImage.opened = true;
            });
        });
    };

    var addSearchListeners = function (index, searchElement) {
        searchElement.addEventListener('change', function (evt) {
            var resultRefs = index.search(evt.target.value);
            var refMap = resultRefs.reduce(function (refMap, resultRef) {
                refMap[resultRef.ref] = resultRef.score;
                return refMap;
            }, {});
            var results = allData.filter(function (projectItem) {
                return refMap[projectItem.item_id] !== undefined;
            });

            if (results.length > 0) {
                projectItemsElement.items = results;
            } else {
                projectItemsElement.items = allData;
            }
        });
    };

    var main = function () {
        var index = lunr(function (idx) {
            idx.field('display_name');
            idx.field('description');
            idx.ref('item_id');
        });
        var projectItems = document.querySelector('.project_items');
        projectItemsElement = projectItems;

        var searchField = document.querySelector('.search_field');

        fetch(projectItems.dataset.i3docsUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            allData = data;
            addListState(data);
            buildIndex(index, data);
            addSearchListeners(index, searchField);
            projectItems.items = data;
        });
    };

    // Cannot use DOMContentLoaded if we want to support browsers without native HTML Imports
    // domReady(cb)
    // There are a couple of scenarios:
    // 1) Custom Elements loaded with script tag (no HTML Imports) -> can use DOMContentLoaded
    // 2) Custom Elements loaded with native HTML Imports -> can use DOMContentLoaded
    // 3) Custom Elements loaded with polyfill HTML Imports -> have to use HTMLImports.whenReady
    // Current browser support: http://caniuse.com/#feat=Imports
    var domReady = function (readyCallback) {
        if (window.HTMLImports && window.HTMLImports.whenReady) {
            HTMLImports.whenReady(readyCallback);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', readyCallback);
        } else {
            readyCallback();
        }
    };

    domReady(main);
}());
