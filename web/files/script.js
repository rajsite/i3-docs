/* globals lunr HTMLImports*/
(function () {
    'use strict';

    var domReady = function (readyCallback) {
        if (window.HTMLImports && window.HTMLImports.whenReady) {
            HTMLImports.whenReady(readyCallback);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', readyCallback);
        } else {
            readyCallback();
        }
    };

    var buildIndex = function (data, index) {
        data.forEach(function (projectItem) {
            index.add(projectItem);
        });
    };

    var addListState = function (data) {
        data.forEach(function (projectItem) {
            projectItem.block_diagram_images.forEach(function (blockDiagramImage, index) {
                blockDiagramImage.opened = index === 0;
            });
        });
    };

    var addSearchListeners = function (data, index, searchElement, projectItems) {
        var allData = data;

        searchElement.addEventListener('value-changed', function (evt) {
            var resultRefs = index.search(evt.target.value);
            var refMap = resultRefs.reduce(function (refMap, resultRef) {
                refMap[resultRef.ref] = resultRef.score;
                return refMap;
            }, {});
            var results = allData.filter(function (projectItem) {
                return refMap[projectItem.item_id] !== undefined;
            });

            if (results.length > 0) {
                projectItems.items = results;
            } else {
                projectItems.items = allData;
            }
        });
    };

    var addBasePathToUrls = function (data, basePath) {
        if (basePath === '') {
            return;
        }

        data.forEach(function (projectItem) {
            projectItem.icon_images.forEach(function (iconImage) {
                iconImage.file_name = basePath + iconImage.file_name;
            });

            projectItem.block_diagram_images.forEach(function (blockDiagramImage) {
                blockDiagramImage.file_name = basePath + blockDiagramImage.file_name;
            });
        });
    };

    var getPageConfig = function () {
        var pageConfig = {
            basePath: '',
            searchDefault: '',
            searchHidden: false
        };

        var searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('i3-docs-path')) {
            pageConfig.basePath = searchParams.get('i3-docs-path');
        }

        if (searchParams.has('search-default')) {
            pageConfig.searchDefault = searchParams.get('search-default');
        }

        pageConfig.searchHidden = searchParams.has('search-hidden');

        return pageConfig;
    };

    var updatePageTitle = function (data) {
        if (data.length > 0) {
            document.title = data[0].display_name + ' - LabVIEW Documentation';
        }
    };

    var main = function () {
        var pageConfig = getPageConfig();
        var i3DocsPath = pageConfig.basePath + 'i3-docs.json';

        var index = lunr(function (idx) {
            idx.field('display_name');
            idx.field('description');
            idx.ref('item_id');
        });

        var projectItems = document.querySelector('.project_items');
        var searchField = document.querySelector('.search_field');
        var viSearchWidgetWrapper = document.querySelector('.vi_search_widget_wrapper');

        fetch(i3DocsPath)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            addListState(data);
            updatePageTitle(data);
            addBasePathToUrls(data, pageConfig.basePath);
            buildIndex(data, index);
            addSearchListeners(data, index, searchField, projectItems);
            viSearchWidgetWrapper.hidden = pageConfig.searchHidden;
            projectItems.items = data;
            searchField.value = pageConfig.searchDefault;
        });
    };

    domReady(main);
}());
