//
// Table of Contents - Javascript for adding a "Table of contents" block to any HTML page.
// Project homepage: https://github.com/epursimuove/table-of-contents
// Created by Anders Gustafson, April 2017.
//

log('Loading tableOfContents.js file');

const SUPPORTED_HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
log('Supported headings', SUPPORTED_HEADING_LEVELS);
const LOG_INDENTATIONS = ['    ', '        ', '            ', '                ', '                    ', '                        '];

function generateTableOfContents() {
    log('Generating ToC and adding the block to the body element');

    const tableOfContentsContainer = $('body');

    const tableOfContents = $('<div id="tableOfContents"></div>');
    tableOfContentsContainer.append(tableOfContents);

    const tableOfContentsLabel = $('<div></div>', {
        id: 'tableOfContentsLabel',
        html: 'Table of contents',
        onClick: 'toggleTableOfContentsList()',
        title: 'Collapse/expand this Table of Contents block'
    });
    tableOfContents.append(tableOfContentsLabel);

    const tableOfContentsList = $('<div id="tableOfContentsList"></div>');
    tableOfContents.append(tableOfContentsList);

    const topOfPageLink = $('<div class="meta"></div>');
    tableOfContentsList.append(topOfPageLink);

    const topOfPageHref = $('<a></a>', {
        href: '#',
        html: '[Top of page]',
        title: 'Top of page'
    });
    topOfPageLink.append(topOfPageHref);

    const startItem = tableOfContentsContainer;
    // const startItem = $('div#myOwnContent');
    // const startItem = $('div#content');
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

    const headingToSearchFor = SUPPORTED_HEADING_LEVELS[level];
    const headingThatStopsSearching = level === 0 ? null : SUPPORTED_HEADING_LEVELS[level - 1];

    const logPrefix = LOG_INDENTATIONS[level];

    log(logPrefix + 'Starts searching for heading', headingToSearchFor);
    log(logPrefix + 'Heading that will stop the searching', headingThatStopsSearching);

    const startElementIsTheSameAsTheHeadingWeAreLookingFor =
        startElementForSearching.prop('tagName').toUpperCase() === headingToSearchFor.toUpperCase();

    const subHeadings = startElementIsTheSameAsTheHeadingWeAreLookingFor ?
        startElementForSearching.nextUntil(headingThatStopsSearching, headingToSearchFor).addBack() :
        startElementForSearching.nextUntil(headingThatStopsSearching, headingToSearchFor);

    const numberOfSubHeadings = subHeadings.length;
    log(logPrefix + 'Number of sub headings of type ' + headingToSearchFor + " = " + numberOfSubHeadings);

    if (numberOfSubHeadings > 0) {

        const tocListOfSubHeadings = $('<ol class="level' + level + '">');
        currentToCListItem.append(tocListOfSubHeadings);

        for (var k = 0; k < numberOfSubHeadings; k++) {
            const subHeading = $(subHeadings[k]);
            const labelForHeading = subHeading.html();

            const headingLevelIdentifier = (levelPrefix !== null ? levelPrefix + '.' : '') + (k + 1);
            log(logPrefix + 'Starts examining ' + headingLevelIdentifier + ' (named "' + labelForHeading + '")');

            const anchorToHeading = $('<a id="toc_' + headingLevelIdentifier + '"></a>');
            anchorToHeading.insertBefore(subHeading);

            const headingLinkInTableOfContents = $('<a></a>', {
                html: labelForHeading,
                href: '#toc_' + headingLevelIdentifier
            });

            const headingInTableOfContents = $('<li>').append(headingLinkInTableOfContents);
            tocListOfSubHeadings.append(headingInTableOfContents);

            if (level + 1 < SUPPORTED_HEADING_LEVELS.length) {
                const nextLevelWrapper = {
                    level: level + 1,
                    levelPrefix: headingLevelIdentifier,
                    currentToCListItem: headingInTableOfContents,
                    startElementForSearching: subHeading
                };

                buildSublist(nextLevelWrapper); // Here is the recursive call.
            }
            log(logPrefix + 'Done examining ' + headingLevelIdentifier + ' (named "' + labelForHeading + '")');
        }
    }
    log(logPrefix + 'Done searching for heading', headingToSearchFor);
}

function toggleTableOfContentsList() {
    log('Toggling Table of contents');
    $('#tableOfContentsList').toggleClass('collapsed');
}

function log(message, object) {
    const USE_LOGGING = false; // Set this to true if you want to use console logging.
    if (USE_LOGGING) {
        if (object !== undefined) {
            console.log(message, object);
        } else {
            console.log(message);
        }
    }
}

log('Loading tableOfContents.js file done');

$(document).ready(generateTableOfContents);