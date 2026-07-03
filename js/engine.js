// engine.js — scene routing, move gating, echo queue, persistence. DOM-light.

const Engine = (function () {
  const _scenes = {}
  const SAVE_KEY = 'landdeal.v1'

  // Scenes at-or-before the reporter cutoff (facts handed here publish pre-vote)
  const REPORTER_CUTOFF_SCENES = [
    'a1_first_move', 'a1_room', 'a1_evening',
    'a2_records', 'a2_people', 'a2_thread', 'a2_channels'
  ]

  let _echoes = {}   // sceneId -> [text]

  function register(id, renderFn) { _scenes[id] = renderFn }

  function goTo(sceneId, data = {}) {
    const container = document.getElementById('scene-container')
    if (!container) return
    GameState.setScene(sceneId)
    persist()
    container.innerHTML = ''
    if (_scenes[sceneId]) { _scenes[sceneId](container, data) }
    else { container.innerHTML = '<p style="padding:40px">Scene not found: ' + sceneId + '</p>' }
    window.scrollTo(0, 0)
  }

  function next(fromSceneId) {
    const order = SCENARIO.SCENE_ORDER
    const i = order.indexOf(fromSceneId)
    if (i === -1 || i === order.length - 1) return
    goTo(order[i + 1])
  }

  function availableMoves(moves) {
    return moves.filter(m => {
      if (m.requiresRole && m.requiresRole !== GameState.getRole()) return false
      if (m.requiresFacts && !m.requiresFacts.every(f => GameState.knowsFact(f))) return false
      if (m.requiresFlag && !GameState.getFlag(m.requiresFlag)) return false
      if (m.hideIfFacts && m.hideIfFacts.some(f => GameState.knowsFact(f))) return false
      if (m.hideIfFlag && GameState.getFlag(m.hideIfFlag)) return false
      return true
    })
  }

  function _publicizeTopKnown(n, channel) {
    const publicIds = GameState.publicFacts().map(p => p.id)
    const candidates = FACTWEB.FACT_PRIORITY.filter(
      id => GameState.knowsFact(id) && !publicIds.includes(id)
    ).slice(0, n)
    candidates.forEach(id => GameState.publicizeFact(id, channel))
    return candidates
  }

  function applyMove(move) {
    const newFacts = []
    ;(move.grantsFacts || []).forEach(id => { if (GameState.learnFact(id)) newFacts.push(id) })
    let publicized = []
    if (move.makesPublic) {
      const ids = move.makesPublic.ids || move.grantsFacts || []
      ids.forEach(id => GameState.publicizeFact(id, move.makesPublic.channel, { discounted: !!move.makesPublic.discounted }))
      publicized = ids
    }
    if (move.makesPublicKnown) {
      publicized = publicized.concat(_publicizeTopKnown(move.makesPublicKnown.count, move.makesPublicKnown.channel))
    }
    if (move.reporterHandoff) {
      const publicIds = GameState.publicFacts().map(p => p.id)
      const toGive = GameState.knownFacts().filter(id => !publicIds.includes(id))
      GameState.giveToReporter(toGive, GameState.getScene())
      GameState.setFlag('gaveReporter')
    }
    ;(move.costs || []).forEach(c => GameState.addCost(c.id, c.label))
    ;(move.flags || []).forEach(f => GameState.setFlag(f))
    if (publicized.length > 0 && GameState.getRole() === 'farmer') {
      GameState.addCost('payout', 'your option payout, probably')
    }
    if (move.echo) queueEcho(move.echo.scene, move.echo.text)
    persist()
    return { newFacts }
  }

  function queueEcho(sceneId, text) {
    if (!_echoes[sceneId]) _echoes[sceneId] = []
    _echoes[sceneId].push(text)
  }
  function echoesFor(sceneId) { return _echoes[sceneId] || [] }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ state: GameState.serialize(), echoes: _echoes }))
    } catch (e) { /* private mode etc. — resume is best-effort */ }
  }
  function tryResume() {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return false
      const saved = JSON.parse(raw)
      if (!saved || !GameState.restore(saved.state)) return false
      const sceneId = GameState.getScene()
      if (!sceneId || !_scenes[sceneId]) return false
      _echoes = saved.echoes || {}
      goTo(sceneId)
      return true
    } catch (e) { return false }
  }
  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY) } catch (e) {}
    _echoes = {}
  }

  // Scene id inside the save, without restoring it. Null if no/invalid save.
  function _savedSceneId() {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return null
      const st = JSON.parse(JSON.parse(raw).state)
      return (st && st.sceneId) ? st.sceneId : null
    } catch (e) { return null }
  }

  // Pre-game scenes resume silently; only a MID-GAME save earns the welcome prompt.
  const PREGAME_SCENES = ['title', 'role_select', 'briefing', 'welcome_back']

  function start() {
    const savedScene = _savedSceneId()
    if (savedScene && !PREGAME_SCENES.includes(savedScene) && _scenes['welcome_back']) {
      const container = document.getElementById('scene-container')
      if (container) { _scenes['welcome_back'](container, {}); return }
    }
    if (tryResume()) return
    clearSave()
    GameState.resetState()
    goTo('title')
  }

  return {
    register, goTo, next, start,
    availableMoves, applyMove,
    queueEcho, echoesFor,
    persist, tryResume, clearSave,
    REPORTER_CUTOFF_SCENES
  }
})()

if (typeof module !== 'undefined') { module.exports = { Engine } }
