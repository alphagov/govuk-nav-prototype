(function() {
  "use strict";

  var WARNING_COLOUR = '#c00';
  var MAX_CONTENT_LENGTH = 15;
  var QUERY_PARAMETER_KEY = 'longLists';

  run();

  function run() {
    if (!shouldHighlightLongContent()) {
      return;
    }

    highlightLongAccordionSections();
    highlightLongLeafList();
  }

  function shouldHighlightLongContent() {
    var shouldHighlight = false;

    if (GOVUK.getCookie(QUERY_PARAMETER_KEY) === 'true') {
      shouldHighlight = true;
    }

    var searchParams = new URLSearchParams(location.search);

    if (searchParams.has(QUERY_PARAMETER_KEY)) {
      shouldHighlight = true;
    }

    if (searchParams.get(QUERY_PARAMETER_KEY) === 'false') {
      shouldHighlight = false;
    }

    GOVUK.setCookie(QUERY_PARAMETER_KEY, shouldHighlight);

    return shouldHighlight;
  }

  function highlightLongAccordionSections() {
    var $accordionSections = $('.child-topic-contents .subsection');

    $accordionSections.each(function (index, section) {
      var $section = $(section);
      var $sectionContent = $section.find('.subsection-content li');

      if ($sectionContent.length > MAX_CONTENT_LENGTH) {
        $section.find('.subsection-header')
          .append(
            accordionWarningMessage($sectionContent.length),
            accordionWarningBorder()
          );

        var $firstExcessiveContent = $($sectionContent[MAX_CONTENT_LENGTH]);
        $firstExcessiveContent.before(warningLine());
      }
    });
  }

  function highlightLongLeafList() {
    var $leafContainer = $('.parent-topic-contents');
    var $leafItems = $leafContainer.find('li');

    if ($leafItems.length > MAX_CONTENT_LENGTH) {
      var $firstExcessiveContent = $($leafItems[MAX_CONTENT_LENGTH]);
      $firstExcessiveContent.before(warningLine());
    }
  }

  function accordionWarningBorder() {
    return $('<div></div>')
      .css('position', 'absolute')
      .css('left', '-12px')
      .css('top', '0')
      .css('bottom', '0')
      .css('width', '5px')
      .css('background', WARNING_COLOUR);
  }

  function accordionWarningMessage(numberOfContentItems) {
    return $('<p></p>')
      .html('This section contains <strong>' + numberOfContentItems + '</strong> items, ' +
        'but content beyond the ' + MAX_CONTENT_LENGTH + 'th item is rarely clicked')
      .css('color', WARNING_COLOUR)
      .css('font-size', '14px')
      .css('margin', '0 45px 0 0');
  }

  function warningLine() {
    return $('<div></div>')
      .text('Content beyond the ' + MAX_CONTENT_LENGTH + 'th item is rarely clicked')
      .css('border-top', '5px solid ' + WARNING_COLOUR)
      .css('color', WARNING_COLOUR)
      .css('padding', '6px 10px')
      .css('font-size', '14px')
      .css('margin', '10px -10px');
  }
}());
