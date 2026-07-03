// state.js — game state and pure logic. No DOM. Fully testable.

let FACTWEB_REF
if (typeof module !== 'undefined') { FACTWEB_REF = require('./facts.js') } else { FACTWEB_REF = window.FACTWEB }
const { FACTS: _FACTS } = FACTWEB_REF

const STATE_VERSION = 1

let _state
function resetState() {
  _state = {
    v: STATE_VERSION,
    role: null,
    known: [],            // fact ids in learn order
    public: [],           // { id, channel, discounted }
    reporterQueue: [],    // { id, sceneId }
    late: [],             // fact ids verified too late
    costs: [],            // { id, label }
    flags: {},
    sceneId: null         // set by engine for resume
  }
}
resetState()

function getState() { return JSON.parse(JSON.stringify(_state)) }
function setRole(roleId) { _state.role = roleId }
function getRole() { return _state.role }
function setScene(sceneId) { _state.sceneId = sceneId }
function getScene() { return _state.sceneId }

function learnFact(id) {
  if (!_FACTS[id]) return false
  if (_state.known.includes(id)) return false
  _state.known.push(id)
  return true
}
function knowsFact(id) { return _state.known.includes(id) }
function knownFacts() { return [..._state.known] }

function publicizeFact(id, channel, opts = {}) {
  if (!_FACTS[id]) return
  learnFact(id)
  if (_state.public.some(p => p.id === id)) return
  _state.public.push({ id, channel, discounted: !!opts.discounted })
}

function giveToReporter(ids, sceneId) {
  ids.forEach(id => {
    if (!_FACTS[id]) return
    if (_state.reporterQueue.some(q => q.id === id)) return
    _state.reporterQueue.push({ id, sceneId })
  })
}

function resolveReporter(cutoffSceneList) {
  const published = [], late = []
  _state.reporterQueue.forEach(({ id, sceneId }) => {
    if (cutoffSceneList.includes(sceneId)) {
      if (!_state.public.some(p => p.id === id)) {
        _state.public.push({ id, channel: 'reporter', discounted: false })
        published.push(id)
      }
    } else {
      if (!_state.late.includes(id)) _state.late.push(id)
      late.push(id)
    }
  })
  _state.reporterQueue = []
  return { published, late }
}

function publicFacts() { return _state.public.map(p => ({ ...p })) }
function lateFacts() { return [..._state.late] }
function hasGivenReporter() { return _state.reporterQueue.length > 0 || _state.flags.gaveReporter === true }

function addCost(id, label) {
  if (_state.costs.some(c => c.id === id)) return
  _state.costs.push({ id, label })
}
function getCosts() { return _state.costs.map(c => ({ ...c })) }

function setFlag(k, v = true) { _state.flags[k] = v }
function getFlag(k) { return _state.flags[k] }

function computeEnding(publicList) {
  const counted = publicList.filter(p => !p.discounted)
  const inCluster = cluster => counted.filter(p => _FACTS[p.id] && _FACTS[p.id].cluster === cluster).length
  const insiders = inCluster('insiders')
  const moneyWater = inCluster('money') + inCluster('water')
  let outcome = 'as_written'
  if (insiders >= 2) outcome = 'delayed'
  else if (moneyWater >= 3) outcome = 'conditions'
  return { outcome, counts: { insiders, moneyWater } }
}
function endingNow() { return computeEnding(_state.public) }
function shadowEnding() { return computeEnding([]) }

function serialize() { return JSON.stringify(_state) }
function restore(json) {
  try {
    const parsed = JSON.parse(json)
    if (!parsed || parsed.v !== STATE_VERSION || !Array.isArray(parsed.known)) return false
    _state = parsed
    return true
  } catch (e) { return false }
}

const api = {
  resetState, getState, setRole, getRole, setScene, getScene,
  learnFact, knowsFact, knownFacts,
  publicizeFact, giveToReporter, resolveReporter, publicFacts, lateFacts, hasGivenReporter,
  addCost, getCosts, setFlag, getFlag,
  computeEnding, endingNow, shadowEnding,
  serialize, restore
}
if (typeof module !== 'undefined') { module.exports = api } else { window.GameState = api }
