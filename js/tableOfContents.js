//
// Table of Contents - Javascript for adding a "Table of contents" block to any HTML page.
// Project homepage: https://github.com/epursimuove/table-of-contents
// Created by Anders Gustafson, April 2017.
// Revised February 2019.
//

'use strict';

const CONFIGURATION = {
    supportedHeadingLevels: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    startItemIdentifier: 'body', // 'div#myOwnContent' 'div#content'
    expandedByDefault: true,
    useNumbering: true,
    useLogging: false // Set this to true if you want to use console logging.
};
log('Loading tableOfContents.js file');
log('Configuration', CONFIGURATION);

function generateTableOfContents() {
    log('Generating ToC and adding the block to the body element');

    const tableOfContentsContainer = jQuery('body');

    const tableOfContents = jQuery('<div id="tableOfContents"></div>');
    tableOfContentsContainer.append(tableOfContents);

    const tableOfContentsLabel = jQuery('<div></div>', {
        id: 'tableOfContentsLabel',
        html: 'Table of contents',
        onClick: 'toggleTableOfContentsList()',
        title: 'Collapse/expand the Table of Contents block'
    });
    tableOfContents.append(tableOfContentsLabel);

    const tableOfContentsCollapseIcon = jQuery('<span></span>', {
        id: 'tableOfContentsCollapseIcon',
        html: '-',
        class: CONFIGURATION.expandedByDefault ? '' : 'collapsed'
    });
    tableOfContentsLabel.append(tableOfContentsCollapseIcon);
    const tableOfContentsExpandIcon = jQuery('<span></span>', {
        id: 'tableOfContentsExpandIcon',
        html: '+',
        class: CONFIGURATION.expandedByDefault ? 'collapsed' : ''
    });
    tableOfContentsLabel.append(tableOfContentsExpandIcon);

    const tableOfContentsList = jQuery('<div></div>', {
        id: 'tableOfContentsList',
        class: CONFIGURATION.expandedByDefault ? '' : 'collapsed'
    });
    tableOfContents.append(tableOfContentsList);

    const topOfPageLink = jQuery('<div class="meta"></div>');
    tableOfContentsList.append(topOfPageLink);

    const topOfPageHref = jQuery('<a></a>', {
        href: '#',
        html: '[Top of page]',
        title: 'Top of page'
    });
    topOfPageLink.append(topOfPageHref);

    const startItem = jQuery(CONFIGURATION.startItemIdentifier);
    log('Using start item', startItem);

    const wrapper = {
        level: 0,
        levelPrefix: null,
        currentToCListItem: tableOfContentsList,
        startElementForSearching: startItem.children(":first-child")
    };

    buildSublist(wrapper);

    log('ToC generated');
}

function buildSublist(wrapper) {

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
        startElementForSearching.prop('tagName').toUpperCase() === headingToSearchFor.toUpperCase();

    const subHeadings = startElementIsTheSameAsTheHeadingWeAreLookingFor ?
        startElementForSearching.nextUntil(headingThatStopsSearching, headingToSearchFor).addBack() :
        startElementForSearching.nextUntil(headingThatStopsSearching, headingToSearchFor);

    const numberOfSubHeadings = subHeadings.length;
    logWithIndentation('Number of sub headings of type ' + headingToSearchFor + " = " + numberOfSubHeadings);

    if (numberOfSubHeadings > 0) {

        const tocListOfSubHeadings = jQuery('<ol class="level' + level + '">');
        currentToCListItem.append(tocListOfSubHeadings);

        for (let k = 0; k < numberOfSubHeadings; k++) {
            const subHeading = jQuery(subHeadings[k]);
            const labelForHeading = subHeading.html();

            const headingLevelIdentifier = (levelPrefix !== null ? levelPrefix + '.' : '') + (k + 1);
            logWithIndentation('Starts examining ' + headingLevelIdentifier + ' (named "' + labelForHeading + '")');

            const anchorToHeading = jQuery('<a id="toc_' + headingLevelIdentifier + '"></a>');
            anchorToHeading.insertBefore(subHeading);

            const headingInTableOfContents = jQuery('<li></li>');
            if (CONFIGURATION.useNumbering) {
                const headingNumbering = jQuery('<span></span>', {
                    html: headingLevelIdentifier,
                    class: 'headingNumbering'
                });
                headingInTableOfContents.append(headingNumbering);
            }
            const headingLinkInTableOfContents = jQuery('<a></a>', {
                html: labelForHeading,
                href: '#toc_' + headingLevelIdentifier
            });
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

function toggleTableOfContentsList() {
    log('Toggling Table of contents');
    ['#tableOfContentsList', '#tableOfContentsCollapseIcon', '#tableOfContentsExpandIcon']
        .forEach((identifier) => {
            jQuery(identifier).toggleClass('collapsed');
        });
}

function log(message, object, level) {
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

log('Loading tableOfContents.js file done');

jQuery(document).ready(generateTableOfContents);