// ui.js — all DOM rendering. Content comes from SCENARIO; ui builds cards.

const UI = (function () {

  function _esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function _clearNotebook() {
    const root = document.getElementById('notebook-root')
    if (root) root.innerHTML = ''
  }

  function _cardHtml(card, echoes) {
    let inner = ''
    if (card.eyebrow) inner += '<p class="card-eyebrow">' + _esc(card.eyebrow) + '</p>'
    if (card.h2) inner += '<h2>' + _esc(card.h2) + '</h2>'
    ;(card.paras || []).forEach(p => { inner += '<p class="card-para">' + _esc(p) + '</p>' })
    // A text message, rendered as a message — not a quoted paragraph.
    if (card.bubble) inner += '<div class="msg-bubble">' + _esc(card.bubble) + '</div>'
    // A document rendered as a physical object: first line is the letterhead.
    if (card.paper) {
      inner += '<div class="paper-doc">'
      card.paper.forEach((line, i) => {
        inner += i === 0 ? '<p class="paper-head">' + _esc(line) + '</p>' : '<p>' + _esc(line) + '</p>'
      })
      inner += '</div>'
    }
    ;(card.parasAfter || []).forEach(p => { inner += '<p class="card-para">' + _esc(p) + '</p>' })
    ;(echoes || []).forEach(e => { inner += '<p class="card-echo">' + _esc(e) + '</p>' })
    return inner
  }

  // Card runner — Instagram-Stories pattern (build-v2 lineage, simplified):
  // fullscreen slides, thin progress segments, tap/data-next to advance.
  // Last slide's advance calls onDone().
  function _run(container, specs, tapLabel, onDone) {
    let segs = '', slides = ''
    specs.forEach((spec, i) => {
      segs += '<div class="seg' + (i === 0 ? ' active' : '') + '"></div>'
      const cls = 'card-slide' + (spec.bgImg ? ' card-image' : '') + (spec.dark ? ' card-dark' : '') + (spec.textTop ? ' text-top' : '') + (i === 0 ? ' active' : '')
      // strip anything that could break out of the url() — paths are ours, but belt and suspenders
      const bg = spec.bgImg ? ' style="background-image:url(\'' + String(spec.bgImg).replace(/['"()\\ ]/g, '') + '\')"' : ''
      const isLast = i === specs.length - 1
      // re-read affordance: only within this card stack, never across a decision
      const back = i > 0 ? '<button class="card-back" data-back="' + i + '" aria-label="Back to previous card">‹ Back</button>' : ''
      const btn = '<button class="card-tap" data-adv="' + i + '">' +
        _esc(isLast ? tapLabel : 'Tap to continue') + ' →</button>'
      slides += '<div class="' + cls + '"' + bg + '>' + back + '<div class="card-inner">' +
        spec.html + btn + '</div></div>'
    })
    container.innerHTML = '<div class="card-root"><div class="card-progress">' + segs + '</div>' + slides + '</div>'
    const slideEls = container.querySelectorAll('.card-slide')
    const segEls = container.querySelectorAll('.seg')
    container.querySelectorAll('[data-adv]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-adv'), 10)
        if (i >= specs.length - 1) { onDone(); return }
        slideEls[i].classList.remove('active'); slideEls[i].classList.add('exiting')
        slideEls[i + 1].classList.add('active')
        segEls[i].classList.remove('active'); segEls[i].classList.add('done')
        segEls[i + 1].classList.add('active')
        window.scrollTo(0, 0)
      })
    })
    container.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-back'), 10)
        slideEls[i].classList.remove('active')
        slideEls[i - 1].classList.remove('exiting'); slideEls[i - 1].classList.add('active')
        segEls[i].classList.remove('active'); segEls[i - 1].classList.remove('done'); segEls[i - 1].classList.add('active')
        window.scrollTo(0, 0)
      })
    })
  }

  // ── Title ──
  function renderTitle(container) {
    _clearNotebook()
    _run(container, [{
      dark: true,
      bgImg: 'img/scenes/img-01-farm.webp',
      html: '<p class="card-eyebrow brand-credit">' + _esc(LINKS.brandName) + '</p>' +
        '<h1 class="title-h1">The Land Deal</h1>' +
        '<p class="card-para">A data center is coming to a township like yours. The deal is already made. The vote is in six weeks.</p>' +
        '<p class="card-para">How much of the truth can one neighbor surface — and at what cost?</p>'
    }], 'Begin', () => Engine.goTo('role_select'))
  }

  // ── Role select ──
  function renderRoleSelect(container) {
    _clearNotebook()
    let cards = ''
    Object.values(SCENARIO.ROLES).forEach(r => {
      cards += '<button class="role-card" data-role="' + r.id + '">' +
        '<div class="role-title">' + _esc(r.title) + '</div>' +
        '<div class="role-name">' + _esc(r.name) + ', ' + r.age + '</div>' +
        '<div class="role-desc">' + _esc(r.has) + '</div></button>'
    })
    container.innerHTML = '<div class="card-root"><div class="card-slide active card-scrollable"><div class="card-inner">' +
      '<p class="card-eyebrow">Who are you in Halverson?</p>' + cards + '</div></div></div>'
    container.querySelectorAll('[data-role]').forEach(btn =>
      btn.addEventListener('click', () => {
        GameState.setRole(btn.getAttribute('data-role'))
        Engine.goTo('briefing')
      }))
  }

  // ── Briefing ──
  function renderBriefing(container) {
    _clearNotebook()
    const r = SCENARIO.ROLES[GameState.getRole()]
    if (!r) { Engine.goTo('role_select'); return }
    _run(container, [
      { html: _cardHtml({ eyebrow: r.title, h2: r.name + ', ' + r.age, paras: [r.has, r.carries, r.place] }) },
      { dark: true, html: _cardHtml({ eyebrow: 'Halverson Township', h2: 'Six weeks to the vote.', paras: [
          'You are not on the board. You are not a journalist. You’re a neighbor.',
          'Some of what’s true about this deal is sitting in public files and private conversations, waiting for someone to go get it.',
          'Finding it is half the job. Making sure the whole township knows it — that’s up to you.'] }) }
    ], 'Start', () => Engine.next('briefing'))
  }

  // ── Cards scenes (with variants + echoes) ──
  function _resolveVariant(scene) {
    if (!scene.variants) return scene.cards
    if (scene.id === 'a3_open') {
      if (!GameState.getFlag('reporterResolved')) {
        const res = GameState.resolveReporter(Engine.REPORTER_CUTOFF_SCENES)
        GameState.setFlag('reporterResolved')
        GameState.setFlag('reporterPublished', res.published.length > 0)
      }
      if (GameState.getFlag('reporterPublished')) return scene.variants.reporter
      return GameState.publicFacts().length >= 3 ? scene.variants.loud : scene.variants.quiet
    }
    if (scene.id === 'a3_vote') {
      const outcome = GameState.endingNow().outcome
      const recused = GameState.getFlag('recusalCalled')
      if (outcome === 'delayed' && !recused) return scene.variants.delayed_quiet
      if (outcome === 'as_written' && recused) return scene.variants.as_written_recused
      return scene.variants[outcome]
    }
    return scene.cards
  }

  function renderCardsScene(container, scene) {
    const cards = _resolveVariant(scene)
    const echoes = Engine.echoesFor(scene.id)
    const specs = cards.map((c, i) => ({
      dark: c.dark, bgImg: c.bgImg, textTop: c.textTop,
      html: _cardHtml(c, i === cards.length - 1 ? echoes : [])
    }))
    _run(container, specs, scene.tap || 'Continue', () => Engine.next(scene.id))
    _renderNotebookButton()
  }

  // ── Decision scenes ──
  function renderDecisionScene(container, scene) {
    const moves = Engine.availableMoves(scene.moves)
    // A decision with fewer than two live choices isn't a decision — and its setup
    // text may reference things this player never learned. Skip the scene entirely.
    if (moves.length < 2) { Engine.next(scene.id); return }
    const echoes = Engine.echoesFor(scene.id)
    const setup = scene.setup || []
    const setupSpecs = setup.map((c, i) => ({ dark: c.dark, bgImg: c.bgImg, textTop: c.textTop, html: _cardHtml(c, i === setup.length - 1 ? echoes : []) }))
    let choiceHtml = '<p class="card-eyebrow">' + _esc(scene.prompt) + '</p><div class="choice-list">'
    moves.forEach(m => {
      choiceHtml += '<button class="choice-card" data-move="' + m.id + '">' + _esc(m.label) + '</button>'
    })
    choiceHtml += '</div>'
    const specs = setupSpecs.concat([{ html: choiceHtml }])
    _run(container, specs, '', () => {})   // decision card doesn't use the tap button
    // hide the tap button on the choice slide — choosing IS the advance
    const slides = container.querySelectorAll('.card-slide')
    slides[slides.length - 1].querySelector('.card-tap').style.display = 'none'

    container.querySelectorAll('[data-move]').forEach(btn =>
      btn.addEventListener('click', () => {
        const move = scene.moves.find(m => m.id === btn.getAttribute('data-move'))
        const { newFacts } = Engine.applyMove(move)
        _announceFacts(newFacts)
        _renderResponse(container, move, newFacts, () => Engine.next(scene.id))
      }))
    _renderNotebookButton()
  }

  function _renderResponse(container, move, newFacts, onContinue) {
    let factsHtml = ''
    newFacts.forEach(id => {
      const f = FACTWEB.FACTS[id]
      factsHtml += '<div class="notebook-entry"><span class="notebook-cluster">' +
        _esc(FACTWEB.CLUSTERS[f.cluster]) + '</span><strong>' + _esc(f.title) + '</strong><p>' + _esc(f.body) + '</p></div>'
    })
    // First facts the player has ever collected: explain the notebook once.
    if (newFacts.length > 0 && GameState.knownFacts().length === newFacts.length) {
      factsHtml += '<p class="notebook-nudge"><strong>Saved to your notebook.</strong> Tap “Notebook” at the bottom of the screen any time to review everything you’ve learned — and who’s who in Halverson.</p>'
    }
    container.innerHTML = '<div class="card-root"><div class="card-slide active card-scrollable"><div class="card-inner">' +
      '<p class="card-eyebrow">What happens</p>' +
      '<p class="card-para">' + _esc(move.response) + '</p>' + factsHtml +
      '<button class="card-tap" id="resp-continue">Continue →</button>' +
      '</div></div></div>'
    document.getElementById('resp-continue').addEventListener('click', onContinue)
    _renderNotebookButton(newFacts.length > 0)
  }

  function _announceFacts(ids) {
    const live = document.getElementById('fact-live')
    if (!live || ids.length === 0) return
    live.textContent = 'New in your notebook: ' + ids.map(id => FACTWEB.FACTS[id].title).join('. ')
  }

  // ── The Notebook ──
  function _renderNotebookButton(pulse) {
    const root = document.getElementById('notebook-root')
    if (!root) return
    const n = GameState.knownFacts().length
    root.innerHTML = '<button class="notebook-btn' + (pulse ? ' nb-pulse' : '') + '" id="nb-open" aria-label="Open notebook, ' + n + ' facts">' +
      'Notebook · ' + n + '</button>'
    document.getElementById('nb-open').addEventListener('click', _openNotebook)
  }

  function _openNotebook() {
    if (document.querySelector('.notebook-panel')) return
    const root = document.getElementById('notebook-root')
    const known = GameState.knownFacts()
    const publicIds = GameState.publicFacts().map(p => p.id)
    let html = '<div class="notebook-panel" role="dialog" aria-label="Your notebook">' +
      '<div class="notebook-head"><h2>Your notebook</h2><button id="nb-close" aria-label="Close">×</button></div>'
    // Who's who / what's what — recoverable context for anyone who skimmed the setup
    const role = GameState.getRole()
    html += '<div class="notebook-cluster-block"><h3>' + _esc(SCENARIO.WORLD.title) + '</h3>'
    SCENARIO.WORLD.entries.filter(e => !e.role || e.role === role).forEach(e => {
      html += '<div class="notebook-entry"><strong>' + _esc(e.h) + '</strong><p>' + _esc(e.text) + '</p></div>'
    })
    html += '</div>'
    Object.entries(FACTWEB.CLUSTERS).forEach(([cid, label]) => {
      const clusterFacts = Object.values(FACTWEB.FACTS).filter(f => f.cluster === cid)
      const found = clusterFacts.filter(f => known.includes(f.id))
      html += '<div class="notebook-cluster-block"><h3>' + _esc(label) + '</h3>'
      if (found.length === 0) {
        html += '<p class="notebook-missing">Nothing yet.</p>'
      } else {
        found.forEach(f => {
          const pub = publicIds.includes(f.id)
          html += '<div class="notebook-entry"><strong>' + _esc(f.title) + '</strong>' +
            (pub ? ' <span class="notebook-public">public</span>' : ' <span class="notebook-private">only you know this</span>') +
            '<p>' + _esc(f.body) + '</p></div>'
        })
        if (found.length < clusterFacts.length) {
          html += '<p class="notebook-missing">Something here is still missing.</p>'
        }
      }
      html += '</div>'
    })
    html += '</div>'
    root.insertAdjacentHTML('beforeend', html)
    document.getElementById('nb-close').focus()
    document.getElementById('nb-close').addEventListener('click', () => {
      root.querySelector('.notebook-panel').remove()
      const openBtn = document.getElementById('nb-open')
      if (openBtn) openBtn.focus()
    })
  }

  // ── The Reveal ──
  function renderReveal(container) {
    _clearNotebook()
    const RC = SCENARIO.REVEAL_COPY
    const ending = GameState.endingNow()
    const endCopy = SCENARIO.ENDINGS[ending.outcome]
    const known = GameState.knownFacts()
    const publicIds = GameState.publicFacts().map(p => p.id)
    const late = GameState.lateFacts()
    const role = GameState.getRole()

    // 1. ending + shadow
    let html = '<p class="card-eyebrow">' + _esc(RC.eyebrow) + '</p>' +
      '<h2>' + _esc(endCopy.title) + '</h2>' +
      '<p class="card-para">' + _esc(endCopy.body) + '</p>' +
      '<div class="shadow-box"><h3>' + _esc(RC.shadowTitle) + '</h3><p>' + _esc(endCopy.shadowLine) + '</p></div>'

    // 2. the fact web
    html += '<p class="card-para" style="margin-top:28px"><strong>' +
      _esc(RC.foundLabel({ public: publicIds.length, known: known.length })) + '</strong></p>'
    if (known.some(id => !publicIds.includes(id))) {
      html += '<p class="card-para">' + _esc(RC.knownNotPublic) + '</p>'
    }
    const allFacts = Object.values(FACTWEB.FACTS)
    const foundFacts = allFacts.filter(f => known.includes(f.id))
    const missedFacts = allFacts.filter(f => !known.includes(f.id))
    html += '<div class="fact-grid">'
    foundFacts.forEach((f, i) => {
      const cls = publicIds.includes(f.id) ? 'public' : 'known'
      html += '<div class="fact-tile fact-' + cls + '" style="animation-delay:' + (i * 70) + 'ms"><span class="notebook-cluster">' +
        _esc(FACTWEB.CLUSTERS[f.cluster]) + '</span><strong>' + _esc(f.title) + '</strong>' +
        '<p>' + _esc(f.body) + '</p></div>'
    })
    html += '</div>'
    if (missedFacts.length > 0) {
      html += '<h3 class="reveal-h3">What never surfaced</h3><div class="fact-grid">'
      missedFacts.forEach((f, i) => {
        const canOwn = f.reachableBy.includes(role)
        const others = f.reachableBy.filter(r => r !== role).map(r => SCENARIO.ROLES[r].title)
        let who = canOwn
          ? 'This one was reachable on your path — it slipped past.'
          : 'Not reachable as ' + SCENARIO.ROLES[role].title + '.' +
            (others.length ? ' Play as ' + others.join(' or ') + ' to find it.' : '')
        html += '<div class="fact-tile fact-missed" style="animation-delay:' + (i * 70) + 'ms"><span class="notebook-cluster">' +
          _esc(FACTWEB.CLUSTERS[f.cluster]) + '</span><strong>' + _esc(f.title) + '</strong>' +
          '<p>' + _esc(f.missedLine) + '</p>' +
          '<p class="fact-who">' + _esc(who) + '</p></div>'
      })
      html += '</div>'
    }
    if (late.length > 0) {
      html += '<p class="card-para"><em>' + _esc(RC.lateReporter) + ' ' +
        late.map(id => FACTWEB.FACTS[id].title).join(', ') + '</em></p>'
    }

    // 3. costs
    const costs = GameState.getCosts()
    html += '<h3 class="reveal-h3">' + _esc(RC.costsTitle) + '</h3>'
    html += costs.length === 0
      ? '<p class="card-para">' + _esc(RC.costsNone) + '</p>'
      : '<ul class="cost-list">' + costs.map(c => '<li>' + _esc(c.label) + '</li>').join('') + '</ul>'

    // 4. share + replay + onward
    const otherRoles = Object.values(SCENARIO.ROLES).filter(r => r.id !== role)
    html += '<button class="card-tap" id="share-btn">Share your result</button>'
    otherRoles.forEach(r => {
      html += '<button class="card-tap" data-replay="' + r.id + '">' + _esc(RC.replayHook(r.title)) + '</button>'
    })
    html += '<button class="card-tap brand-cta" id="to-bridge">One more thing →</button>'

    container.innerHTML = '<div class="card-root"><div class="card-slide active card-scrollable"><div class="card-inner">' + html + '</div></div></div>'

    document.getElementById('share-btn').addEventListener('click', () => {
      const text = 'I surfaced ' + publicIds.length + ' of 15 truths before the vote in The Land Deal — a ' + LINKS.brandName + ' game. ' + LINKS.gameUrl
      if (navigator.share) { navigator.share({ text }).catch(() => {}) }
      else { navigator.clipboard.writeText(text).then(() => {
        document.getElementById('share-btn').textContent = 'Copied to clipboard'
      }).catch(() => {}) }
    })
    container.querySelectorAll('[data-replay]').forEach(btn =>
      btn.addEventListener('click', () => {
        Engine.clearSave(); GameState.resetState()
        GameState.setRole(btn.getAttribute('data-replay'))
        Engine.goTo('briefing')
      }))
    document.getElementById('to-bridge').addEventListener('click', () => Engine.next('reveal'))
  }

  // ── Bridge ──
  function renderBridge(container) {
    _clearNotebook()
    const B = SCENARIO.BRIDGE_COPY
    _run(container, [
      { dark: true, html: _cardHtml({ eyebrow: B.notFiction.eyebrow, h2: B.notFiction.h2, paras: B.notFiction.paras }) +
        '<a class="card-tap" href="' + LINKS.coverage + '" target="_blank" rel="noopener">Read the real coverage — ' + _esc(LINKS.brandName) + '</a>' },
      { html: _cardHtml({ h2: B.oneAction.h2, paras: B.oneAction.paras }) +
        '<p class="card-para"><strong>' + _esc(B.toolkitTease) + '</strong></p>' }
    ], B.oneAction.cta, () => Engine.next('bridge'))
  }

  // ── Toolkit ──
  function renderToolkit(container) {
    _clearNotebook()
    const T = SCENARIO.TOOLKIT_COPY
    let html = '<p class="card-eyebrow brand-credit">' + _esc(LINKS.brandName) + '</p>' +
      '<h2>' + _esc(T.title) + '</h2><p class="card-para">' + _esc(T.intro) + '</p>'
    T.items.forEach(item => {
      html += '<div class="toolkit-item"><h3>' + _esc(item.h3) + '</h3>'
      item.paras.forEach(p => { html += '<p class="card-para">' + _esc(p) + '</p>' })
      if (item.template) html += '<pre class="toolkit-template">' + _esc(item.template) + '</pre>'
      if (item.linkKey) html += '<a class="toolkit-link" href="' + LINKS[item.linkKey] + '" target="_blank" rel="noopener">' + _esc(item.linkLabel) + ' →</a>'
      html += '</div>'
    })
    html += '<div class="toolkit-item"><p class="card-para">' + _esc(T.newsletter.paras[0]) + '</p>' +
      '<a class="card-tap brand-cta" href="' + LINKS[T.newsletter.linkKey] + '" target="_blank" rel="noopener">' + _esc(T.newsletter.linkLabel) + '</a></div>'
    html += '<button class="card-tap" id="play-again">Play again</button>'
    container.innerHTML = '<div class="card-root"><div class="card-slide active card-scrollable"><div class="card-inner">' + html + '</div></div></div>'
    document.getElementById('play-again').addEventListener('click', () => {
      Engine.clearSave(); GameState.resetState(); Engine.goTo('title')
    })
  }

  // ── Welcome back (a mid-game save exists) ──
  function renderWelcomeBack(container) {
    _clearNotebook()
    container.innerHTML = '<div class="card-root"><div class="card-slide active card-dark"><div class="card-inner">' +
      '<p class="card-eyebrow brand-credit">' + _esc(LINKS.brandName) + '</p>' +
      '<h2>Welcome back.</h2>' +
      '<p class="card-para">You have a game in progress in Halverson.</p>' +
      '<button class="card-tap" id="wb-resume">Pick up where you left off →</button>' +
      '<button class="card-tap" id="wb-restart">Start over</button>' +
      '</div></div></div>'
    document.getElementById('wb-resume').addEventListener('click', () => {
      if (!Engine.tryResume()) { Engine.clearSave(); GameState.resetState(); Engine.goTo('title') }
    })
    document.getElementById('wb-restart').addEventListener('click', () => {
      Engine.clearSave(); GameState.resetState(); Engine.goTo('title')
    })
  }

  function registerAllScenes() {
    Engine.register('title', renderTitle)
    Engine.register('role_select', renderRoleSelect)
    Engine.register('briefing', renderBriefing)
    Engine.register('welcome_back', renderWelcomeBack)
    SCENARIO.SCENE_ORDER.forEach(id => {
      const scene = SCENARIO.SCENES[id]
      if (!scene) return
      if (scene.type === 'cards') Engine.register(id, c => renderCardsScene(c, scene))
      if (scene.type === 'decision') Engine.register(id, c => renderDecisionScene(c, scene))
    })
    Engine.register('reveal', renderReveal)
    Engine.register('bridge', renderBridge)
    Engine.register('toolkit', renderToolkit)

    // a3_recusal only renders when I3 is public and not discounted; otherwise skip straight through.
    // Registered after the SCENE_ORDER loop so it overwrites that loop's generic 'decision' registration.
    Engine.register('a3_recusal', c => {
      const i3public = GameState.publicFacts().some(p => p.id === 'I3' && !p.discounted)
      if (!i3public) { Engine.next('a3_recusal'); return }
      renderDecisionScene(c, SCENARIO.SCENES.a3_recusal)
    })
  }

  return { registerAllScenes, _esc, _cardHtml, _run }
})()
