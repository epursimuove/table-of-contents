# table-of-contents

The project *table-of-contents* is JavaScript functionality that generates and adds an HTML block to an existing HTML page. This added HTML block contains a clickable *Table of Contents (ToC)* built from the existing heading elements in the page.


## Background

This project was started in April 2017 when I wanted a simple and elegant solution for automatically adding a clickable *Table of Contents* list for existing HTML pages.

In February 2019 the code was revised and refactored quite a bit.
 
 In April 2020 the dependency on jQuery was removed.


## Files

The project consists of the following files:

```
.
├── LICENSE
├── README.md
├── css
│   └── tableOfContents.css
├── example.html
├── exampleSmall.html
├── example_tableOfContents.png
└── js
    └── tableOfContents.js
```

The *important* files are `tableOfContents.js` and `tableOfContents.css`. The other files are for documentation and help.


## Installing

You will need to include the `tableOfContents.js` and `tableOfContents.css` files in your HTML `head` section.

```html
<head>
    ...
    <script type="text/javascript"
            src="js/tableOfContents.js"></script>
    <link rel="stylesheet"
          type="text/css"
          href="css/tableOfContents.css">
    ...
</head>
```


## Documentation

There are only two files that you need to know about. All the functionality is implemented within the `tableOfContents.js` file. The styling is accomplished by the `tableOfContents.css` file.

The *Table of Contents* block will be generated when the `whenDomFullyLoaded()` call kicks in after the HTML page has been loaded. The JavaScript function `generateTableOfContents()` will build the HTML block containing the *Table of Contents*, using information from all the HTML heading elements `h1`-`h6` found on the existing page. These elements should lie in a *plain* structure, i.e. not nested within each other or nested in other elements. For each `h1`-`h6` element, an anchor tag, for example `<a id="toc_3.1.2"></a>`, is inserted just before the heading element.



### Configuration

#### JavaScript

You can alter the JS file (`tableOfContents.js`) if you need your own specific behaviour. The `CONFIGURATION` object at the top of the file is used for this.

```javascript
const CONFIGURATION = {
    supportedHeadingLevels: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    startItemIdentifier: 'body',
    expandedByDefault: true,
    useNumbering: true,
    useLogging: false
};
```

* If you just want to support `h2`-`h4` you can modify `CONFIGURATION.supportedHeadingLevels`.

* If you want to start with another element than `body`, you can modify `CONFIGURATION.startItemIdentifier`. If you, for example, have your heading elements buried in a `div` element with the `id` attribute 'myOwnContent', you can use a value like `'div#myOwnContent'`.

* If the *Table of Contents* should be expanded by default is defined by `CONFIGURATION.expandedByDefault`.

* If you want explicit numbering of the headings, you use `CONFIGURATION.useNumbering`. If `true` every heading in the *Table of Contents* will be prefixed (with for example *1*, *1.1*, *1.1.1*).

* If you need to see details about what is happening, you can toggle console logging via `CONFIGURATION.useLogging`.


#### Stylesheet

You can alter the CSS file (`tableOfContents.css`) if you need your own specific look:
* Colors.
* Font sizes.
* Positioning.
* Margins and paddings.
* Borders.
* Opacity.


##### Max width for ToC list

You can define a max width of the generated list by using the `max-width` property in the `#tableOfContents div#tableOfContentsList` CSS rule set (commented out by default).


### The generated *Table of Contents* block

The *Table of Contents* block will, by default, be fixed to the upper right corner of your web page.

The block can be collapsed (and expanded) by clicking on the *Table of contents* label.

A link to the *Top of page* is always automatically generated.

There is some opacity to the block, so the underlying content will be slightly visible.

The generated block is appended to the DOM tree at the *bottom* of the `body` element. The top level outermost element in this block will be

```html
<div id="tableOfContents">
...
</div>
```

### The `tableOfContents.js` file

#### Main functionality

The entry function is `generateTableOfContents()` and the function doing most of the work is `buildSublist()`. There are also some helper functions.


##### The function `generateTableOfContents()`

Creates the top level `div` element that will be appended to the `body` element in the DOM tree.

Also creates the *Table of Contents* label and the *Top of page* link.

Calls `buildSublist()` with its starting parameters.


##### The function `buildSublist()`

This function is called *recursively* and traverses deeper and deeper into the heading elements for each level.


### The `tableOfContents.css` file

Not much to say about it.


## Examples

### HTML page

The result of showing the `exampleSmall.html` in a browser:

![A simple example of the resulting table-of-contents block](example_tableOfContents.png "A simple example of the resulting table-of-contents block")


### Resulting HTML block containing ToC

A trivial example of how the generated HTML can look like can be found in the `exampleSmall.html` file. There you have an HTML page that looks something like

```html
<body>

<h1>Chapter 1</h1>

<h1>Chapter 2</h1>
<h2>Section 2.1</h2>
<h2>Section 2.2</h2>

<h1>Chapter 3</h1>
<h2>Section 3.1</h2>
<h3>Section 3.1.1</h3>
<h3>Section 3.1.2</h3>
<h2>Section 3.2</h2>
<h2>Section 3.3</h2>

<h1>Chapter 4</h1>

</body>
```

The automatically generated block in the bottom of the `body` element will look like

```html
<div id="tableOfContents">
    <div id="tableOfContentsLabel"
         onclick="toggleTableOfContentsList()"
         title="Collapse/expand the Table of Contents block">
        Table of contents
        <span id="tableOfContentsCollapseIcon" class="">-</span>
        <span id="tableOfContentsExpandIcon" class="collapsed">+</span>
    </div>
    <div id="tableOfContentsList" class="">
        <div class="meta"><a href="#" title="Top of page">[Top of page]</a></div>
        <ol class="level0">
            <li><span class="headingNumbering">1</span><a href="#toc_1">Chapter 1</a></li>
            <li><span class="headingNumbering">2</span><a href="#toc_2">Chapter 2</a>
                <ol class="level1">
                    <li><span class="headingNumbering">2.1</span><a href="#toc_2.1">Section 2.1</a></li>
                    <li><span class="headingNumbering">2.2</span><a href="#toc_2.2">Section 2.2</a></li>
                </ol>
            </li>
            <li><span class="headingNumbering">3</span><a href="#toc_3">Chapter 3</a>
                <ol class="level1">
                    <li><span class="headingNumbering">3.1</span><a href="#toc_3.1">Section 3.1</a>
                        <ol class="level2">
                            <li><span class="headingNumbering">3.1.1</span><a href="#toc_3.1.1">Section 3.1.1</a></li>
                            <li><span class="headingNumbering">3.1.2</span><a href="#toc_3.1.2">Section 3.1.2</a></li>
                        </ol>
                    </li>
                    <li><span class="headingNumbering">3.2</span><a href="#toc_3.2">Section 3.2</a></li>
                    <li><span class="headingNumbering">3.3</span><a href="#toc_3.3">Section 3.3</a></li>
                </ol>
            </li>
            <li><span class="headingNumbering">4</span><a href="#toc_4">Chapter 4</a></li>
        </ol>
    </div>
</div>
```
A larger example can be found in the `example.html` file.

#### Viewing HTML for Table of Contents

Since the `Table of Contents` block is dynamically generated, the HTML for it will not be shown when you use "Show source" in your browser. Instead you have to use "Inspect" (or something similar).


### Real world examples

At the *NNM* pages [Time zones - to be or not to be][], [Roman numerals converter][] and [Clock angle][] you have real world examples of using *table-of-contents*.

   [Time zones - to be or not to be]: http://anders.nemonisimors.com/timeZones.php "Time zones - to be or not to be"

   [Roman numerals converter]: http://anders.nemonisimors.com/romanConverter.php "Roman numerals converter"

   [Clock angle]: http://anders.nemonisimors.com/clockAngle.php "Clock angle"



*Nemo nisi mors*