// links.js — every external URL and Signal-specific string. Placeholders are
// marked TODO-LINK and are expected to be replaced before public launch;
// the game must render and function with placeholders in place.
const LINKS = {
  brandName: 'Signal Statewide',
  coverage: 'https://signalohio.org/',                    // TODO-LINK: data-center coverage landing
  tipLine: 'https://signalohio.org/tips',                 // TODO-LINK: confirm tip URL
  newsletter: 'https://signalohio.org/newsletters',       // TODO-LINK: confirm signup URL
  publicRecordsLaw: 'https://www.ohioattorneygeneral.gov/Legal/Sunshine-Laws', // Ohio Sunshine Laws (real, stable)
  sosBusinessSearch: 'https://businesssearch.ohiosos.gov/',                    // Ohio SOS business search (real, stable)
  gameUrl: 'https://example.github.io/landdeal/'          // TODO-LINK: final Pages URL
}
if (typeof module !== 'undefined') { module.exports = { LINKS } } else { window.LINKS = LINKS }
