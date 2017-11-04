//
// Table of Contents - Javascript for adding a "Table of contents" block to any HTML page.
// Project homepage: https://github.com/epursimuove/table-of-contents
// Created by Anders Gustafson, April 2017.
//

log('Loading tableOfContents.js file');

const SUPPORTED_HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
log('Supported headings', SUPPORTED_HEADING_LEVELS);

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

    const topOfPageHref = $('<a/>', {
        href: '#',
        html: '[Top of page]',
        title: 'Top of page'
    });
    topOfPageLink.append(topOfPageHref);

    const startItem = tableOfContentsContainer.children(":first-child");

    const wrapper = {
        level: 0,
        levelPrefix: null,
        currentToCListItem: tableOfContentsList,
        startElementForSearching: startItem
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

    const startElementIsTheSameAsTheHeadingWeAreLookingFor =
        startElementForSearching.prop('tagName').toUpperCase() === headingToSearchFor.toUpperCase();

    const subHeadings = startElementIsTheSameAsTheHeadingWeAreLookingFor ?
        startElementForSearching.nextUntil(headingThatStopsSearching, headingToSearchFor).addBack() :
        startElementForSearching.nextUntil(headingThatStopsSearching, headingToSearchFor);

    const numberOfSubHeadings = subHeadings.length;
    if (numberOfSubHeadings > 0) {

        const tocListOfSubHeadings = $('<ol class="level' + level + '">');
        currentToCListItem.append(tocListOfSubHeadings);

        for (var k = 0; k < numberOfSubHeadings; k++) {
            const subHeading = $(subHeadings[k]);

            const headingLevelIdentifier = (levelPrefix !== null ? levelPrefix + '.' : '') + (k + 1);

            const anchorToHeading = $('<a id="toc_' + headingLevelIdentifier + '"></a>');
            anchorToHeading.insertBefore(subHeading);

            const headingLinkInTableOfContents = $('<a/>', {
                html: subHeading.html(),
                href: '#toc_' + headingLevelIdentifier
            });

            const headingInTableOfContents = $('<li>').append(headingLinkInTableOfContents);
            tocListOfSubHeadings.append(headingInTableOfContents);
            log('Added heading', headingLevelIdentifier);

            if (level + 1 < SUPPORTED_HEADING_LEVELS.length) {
                const nextLevelWrapper = {
                    level: level + 1,
                    levelPrefix: headingLevelIdentifier,
                    currentToCListItem: headingInTableOfContents,
                    startElementForSearching: subHeading
                };

                buildSublist(nextLevelWrapper); // Here is the recursive call.
            }
        }
    }
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