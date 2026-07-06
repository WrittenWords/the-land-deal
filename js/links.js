// links.js — every external URL and Signal-specific string. Placeholders are
// marked TODO-LINK and are expected to be replaced before public launch;
// the game must render and function with placeholders in place.
const LINKS = {
  brandName: 'Signal Statewide',
  coverage: 'https://signalohio.org/ohio-data-centers-what-to-know-news-resources/',
  tipLine: 'https://signalohio.org/signal-statewide-submit-a-news-tip/',
  newsletter: 'https://signalohio.org/subscribe-signal-statewide-ohio-newsletter/',
  publicRecordsLaw: 'https://www.ohioattorneygeneral.gov/Legal/Sunshine-Laws', // Ohio Sunshine Laws (real, stable)
  sosBusinessSearch: 'https://businesssearch.ohiosos.gov/',                    // Ohio SOS business search (real, stable)
  gameUrl: 'https://writtenwords.github.io/the-land-deal/'
}
if (typeof module !== 'undefined') { module.exports = { LINKS } } else { window.LINKS = LINKS }
