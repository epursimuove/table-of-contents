//
// Table of Contents - Javascript for adding a "Table of contents" block to any HTML page.
// Project homepage: https://github.com/epursimuove/table-of-contents
// Created by Anders Gustafson, April 2017.
// Revised February 2019.
// Revised April 2020.
//

'use strict';

(function () {

    const log = (message, object, level) => {
        if (CONFIGURATION.useLogging) {
            if (level) {
                message = ' '.repeat(4 * level) + message;
            }
            if (object !== undefined) {
                console.log(message, object);
            } else {
                console.log(message);
            }
        }
    }

    const CONFIGURATION = {
        supportedHeadingLevels: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        startItemIdentifier: 'body', // 'div#myOwnContent' 'div#content'
        expandedByDefault: true,
        useNumbering: true,
        useLogging: false // Set this to true if you want to use console logging.
    };
    log('Loading tableOfContents.js file');
    log('Configuration', CONFIGURATION);

    const generateTableOfContents = () => {
        log('Generating ToC and adding the block to the body element');

        const tableOfContentsContainer = getHtmlElementBySelector('body');

        const tableOfContents = createElement('div', {id: 'tableOfContents'});
        tableOfContentsContainer.append(tableOfContents);

        const tableOfContentsLabel = createElement('div', {
                id: 'tableOfContentsLabel',
                onClick: 'toggleTableOfContentsList()',
                title: 'Collapse/expand the Table of Contents block'
            },
            'Table of contents');
        tableOfContents.append(tableOfContentsLabel);

        const tableOfContentsCollapseIcon = createElement('span', {
                id: 'tableOfContentsCollapseIcon',
                class: CONFIGURATION.expandedByDefault ? '' : 'collapsed'
            },
            '-');
        tableOfContentsLabel.append(tableOfContentsCollapseIcon);
        const tableOfContentsExpandIcon = createElement('span', {
                id: 'tableOfContentsExpandIcon',
                class: CONFIGURATION.expandedByDefault ? 'collapsed' : ''
            },
            '+');
        tableOfContentsLabel.append(tableOfContentsExpandIcon);

        const tableOfContentsList = createElement('div', {
            id: 'tableOfContentsList',
            class: CONFIGURATION.expandedByDefault ? '' : 'collapsed'
        });
        tableOfContents.append(tableOfContentsList);

        const topOfPageLink = createElement('div', {class: 'meta'});
        tableOfContentsList.append(topOfPageLink);

        const topOfPageHref = createElement('a', {
                href: '#',
                title: 'Top of page'
            },
            '[Top of page]');
        topOfPageLink.append(topOfPageHref);

        const startItem = getHtmlElementBySelector(CONFIGURATION.startItemIdentifier);
        log('Using start item', startItem);

        const wrapper = {
            level: 0,
            levelPrefix: null,
            currentToCListItem: tableOfContentsList,
            startElementForSearching: startItem.querySelector(":first-child")
        };

        buildSublist(wrapper);

        log('ToC generated');
    }

    const buildSublist = (wrapper) => {

        const level = wrapper.level;
        const levelPrefix = wrapper.levelPrefix;
        const currentToCListItem = wrapper.currentToCListItem;
        const startElementForSearching = wrapper.startElementForSearching;

        const headingToSearchFor = CONFIGURATION.supportedHeadingLevels[level];
        const headingThatStopsSearching = level === 0 ? null : CONFIGURATION.supportedHeadingLevels[level - 1];

        const logWithIndentation = (message, object) => log(message, object, level);

        logWithIndentation('Starts searching for heading', headingToSearchFor);
        logWithIndentation('Heading that will stop the searching', headingThatStopsSearching);

        const startElementIsTheSameAsTheHeadingWeAreLookingFor =
            startElementForSearching.tagName.toUpperCase() === headingToSearchFor.toUpperCase();

        const subHeadings = startElementIsTheSameAsTheHeadingWeAreLookingFor ?
            findSubHeadings(startElementForSearching, headingThatStopsSearching, headingToSearchFor, true) :
            findSubHeadings(startElementForSearching, headingThatStopsSearching, headingToSearchFor);

        const numberOfSubHeadings = subHeadings.length;
        logWithIndentation('Number of sub headings of type ' + headingToSearchFor + " = " + numberOfSubHeadings);

        if (numberOfSubHeadings > 0) {

            const tocListOfSubHeadings = createElement('ol', {class: 'level' + level});
            currentToCListItem.append(tocListOfSubHeadings);

            for (let k = 0; k < numberOfSubHeadings; k++) {
                const subHeading = subHeadings[k];
                const labelForHeading = subHeading.textContent;

                const headingLevelIdentifier = (levelPrefix !== null ? levelPrefix + '.' : '') + (k + 1);
                logWithIndentation('Starts examining ' + headingLevelIdentifier + ' (named "' + labelForHeading + '")');

                const anchorToHeading = createElement('a', {id: 'toc_' + headingLevelIdentifier});
                insertBefore(subHeading, anchorToHeading);

                const headingInTableOfContents = createElement('li');
                if (CONFIGURATION.useNumbering) {
                    const headingNumbering = createElement('span', {
                            class: 'headingNumbering'
                        },
                        headingLevelIdentifier);
                    headingInTableOfContents.append(headingNumbering);
                }
                const headingLinkInTableOfContents = createElement('a', {
                        href: '#toc_' + headingLevelIdentifier
                    },
                    labelForHeading);
                headingInTableOfContents.append(headingLinkInTableOfContents);
                tocListOfSubHeadings.append(headingInTableOfContents);

                if (level + 1 < CONFIGURATION.supportedHeadingLevels.length) {
                    const nextLevelWrapper = {
                        level: level + 1,
                        levelPrefix: headingLevelIdentifier,
                        currentToCListItem: headingInTableOfContents,
                        startElementForSearching: subHeading
                    };

                    buildSublist(nextLevelWrapper); // Here is the recursive call.
                }
                logWithIndentation('Done examining ' + headingLevelIdentifier + ' (named "' + labelForHeading + '")');
            }
        }
        logWithIndentation('Done searching for heading', headingToSearchFor);
    }

    const getHtmlElementById = id => document.getElementById(id);

    const getHtmlElementBySelector = selector => document.querySelector(selector);

    const createElement = (tagName, attributes, textContent) => {
        const element = document.createElement(tagName);

        for (const attribute in attributes) {
            if (attributes.hasOwnProperty(attribute)) {
                element.setAttribute(attribute, attributes[attribute]);
            }
        }

        if (textContent) {
            element.textContent = textContent;
        }

        return element;
    }

    const insertBefore = (existingElement, elementToInsert) => existingElement.insertAdjacentElement('beforebegin', elementToInsert);

    const findSubHeadings = (startElement, headingThatStopsSearching, headingToSearchFor, includeStartElement = false) => {

        const subHeadings = [];
        if (includeStartElement) {
            subHeadings.push(startElement);
        }

        for (let currentElement = startElement.nextElementSibling;
             currentElement !== null;
             currentElement = currentElement.nextElementSibling) {

            const tagName = currentElement.tagName.toLowerCase();

            if (tagName === headingToSearchFor) {
                subHeadings.push(currentElement);
            } else if (tagName === headingThatStopsSearching) {
                break;
            }
        }

        return subHeadings;
    }

    const toggleTableOfContentsList = () => {
        log('Toggling Table of contents');
        ['tableOfContentsList', 'tableOfContentsCollapseIcon', 'tableOfContentsExpandIcon']
            .forEach((identifier) => {
                getHtmlElementById(identifier).classList.toggle('collapsed');
            });
    }

    log('Loading tableOfContents.js file done');

    const whenDomFullyLoaded = (callbackFunction) => {
        if (document.readyState !== 'loading') {
            callbackFunction();
        } else {
            document.addEventListener('DOMContentLoaded', callbackFunction);
        }
    }
    whenDomFullyLoaded(generateTableOfContents);

})();
