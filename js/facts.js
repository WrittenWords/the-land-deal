// facts.js — the fact web. The whole game hangs off this file.
// tier: surface = nearly free · dig = costs a move · deep = requires a chain.
// reachableBy: which roles have at least one path to this fact (validated in tests).
// missedLine: shown on the reveal screen when the player did NOT find the fact.

const CLUSTERS = {
  water: 'Water & Power',
  money: 'The Money',
  insiders: 'Who Benefits',
  process: 'The Process',
  record: 'The Track Record'
}

const FACTS = {
  W1: {
    id: 'W1', cluster: 'water', tier: 'dig',
    title: 'The draw',
    body: '2.1 million gallons a day. About what 9,000 homes use. Halverson has 1,600.',
    missedLine: 'The water numbers were in the impact study the whole time. Nobody asked for it.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  W2: {
    id: 'W2', cluster: 'water', tier: 'dig',
    title: 'Who pays for the substation',
    body: "The $48 million substation upgrade is recovered through base electric rates. Everyone’s bill. Whether the jobs come or not.",
    missedLine: "The substation cost was public the whole time — buried in a utility filing one records request away.",
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  M1: {
    id: 'M1', cluster: 'money', tier: 'surface',
    title: 'The abatement',
    body: 'A 100 percent property-tax abatement: Ashvale pays no property taxes on the site. For fifteen years.',
    missedLine: 'The abatement terms were the first thing anyone would have heard at the meeting — if they asked.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  M2: {
    id: 'M2', cluster: 'money', tier: 'dig',
    title: 'No clawback',
    body: 'There is no clawback clause. If the jobs never come, nothing happens. The promises are not enforceable.',
    missedLine: 'The missing clawback clause was findable in the draft agreement. One request. Nobody read it.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  M3: {
    id: 'M3', cluster: 'money', tier: 'dig',
    title: 'What the schools get',
    body: 'The PILOT payment to the school district: $250,000 a year. Full valuation would be about $3.1 million.',
    missedLine: 'The school district ran the PILOT numbers weeks ago. The treasurer would have told anyone who called.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  M4: {
    id: 'M4', cluster: 'money', tier: 'deep',
    title: 'The independent review',
    body: "The township’s \"independent\" legal review came from a firm suggested by Ashvale’s counsel. The invoice cover letter says so.",
    missedLine: 'The legal invoices were public records. The cover letter named who suggested the firm.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  I1: {
    id: 'I1', cluster: 'insiders', tier: 'dig',
    title: 'Pinloch',
    body: 'Pinloch Land Holdings LLC holds an option on 200 acres adjacent to the site. Filed quietly. Worth nothing unless the data center comes.',
    missedLine: 'The Pinloch option was sitting in the county plat records, fourteen lines down.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  I2: {
    id: 'I2', cluster: 'insiders', tier: 'deep',
    title: 'Three weeks',
    body: 'Pinloch was formed three weeks after Ashvale first contacted the trustees. Before anything was public. Someone knew.',
    missedLine: "The formation date was one search away on the Secretary of State’s site — for anyone who knew to look.",
    reachableBy: ['county', 'farmer']
  },
  I3: {
    id: 'I3', cluster: 'insiders', tier: 'deep',
    title: 'The registered agent',
    body: "Pinloch’s registered agent is Kyle Redmon. Dale Berg’s son-in-law. The board president’s family is positioned to profit from the vote he runs.",
    missedLine: 'The name was right there on the filing. It took one person who knew Halverson to recognize it.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  P1: {
    id: 'P1', cluster: 'process', tier: 'surface',
    title: 'The NDAs',
    body: 'The trustees signed non-disclosure agreements months ago. Your elected officials are contractually barred from telling you what they know.',
    missedLine: "The NDAs weren’t even a secret. The fiscal officer told anyone who called the office.",
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  P2: {
    id: 'P2', cluster: 'process', tier: 'dig',
    title: 'Already drafted',
    body: 'The zoning amendment is already written. It was drafted before the first public meeting was announced.',
    missedLine: 'The draft amendment sat in a county file. The public process was catching up to a decision already shaped.',
    reachableBy: ['county', 'friend']
  },
  P3: {
    id: 'P3', cluster: 'process', tier: 'dig',
    title: 'The comment window',
    body: 'A public comment window is open right now. It was never announced. It closes before the vote.',
    missedLine: 'The comment window opened, sat unannounced, and closed. Zero comments were filed.',
    reachableBy: ['friend']
  },
  R1: {
    id: 'R1', cluster: 'record', tier: 'surface',
    title: 'Ledger County',
    body: 'Ashvale built one of these in Ledger County, Indiana. They promised 150 permanent jobs.',
    missedLine: 'The Ledger County story was one overheard conversation away. Everyone was too busy arguing to listen.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  R2: {
    id: 'R2', cluster: 'record', tier: 'deep',
    title: 'Thirty-one',
    body: 'Ledger County got 31 jobs. The commissioners will say so on the phone, on the record, to anyone who calls.',
    missedLine: 'A commissioner in Indiana was one phone call away, and happy to talk. Nobody called.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  },
  R3: {
    id: 'R3', cluster: 'record', tier: 'deep',
    title: 'It can be done',
    body: 'Ledger County forced a clawback amendment in year two. Conditions are winnable — if you push before the vote, not after.',
    missedLine: 'The playbook for winning conditions already existed, one county over and one phone call away.',
    reachableBy: ['teacher', 'county', 'farmer', 'friend']
  }
}

// Most newsworthy first — used when a move publicizes "your strongest N known facts."
const FACT_PRIORITY = ['I3', 'I2', 'I1', 'M2', 'R2', 'M4', 'W2', 'M3', 'W1', 'R3', 'P2', 'P3', 'M1', 'R1', 'P1']

if (typeof module !== 'undefined') {
  module.exports = { FACTS, CLUSTERS, FACT_PRIORITY }
} else {
  window.FACTWEB = { FACTS, CLUSTERS, FACT_PRIORITY }
}
