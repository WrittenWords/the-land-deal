// scenario.js — all content. Facts are keys; moves are citizen actions.

const ROLES = {
  teacher: {
    id: 'teacher', name: 'June Albright', age: 54, title: 'The Teacher',
    has: 'Everyone talks to you. Twenty-two years of parent conferences buys a kind of trust nobody elected.',
    carries: 'The school district — which has the most to gain or lose from the tax deal, and doesn’t know it yet.',
    place: 'Twenty-two years in Halverson. You know it by its kids.'
  },
  county: {
    id: 'county', name: 'Marcus Webb', age: 41, title: 'The County Employee',
    has: 'You work in the county recorder’s office. You know what a plat map is. You know records are public because you file them.',
    carries: 'A job. Using what crosses your desk for township politics could cost it.',
    place: 'Grew up here, left, came back. Still explaining why.'
  },
  farmer: {
    id: 'farmer', name: 'Ellen Prater', age: 58, title: 'The Neighboring Farmer',
    has: '180 acres east of the Kessler place — and a letter from Ashvale’s land agent in your kitchen drawer.',
    carries: 'The option would pay off the operating loan. You are inside the thing you have questions about.',
    place: 'Third generation on the land. The walnut trees are older than the township hall.'
  },
  friend: {
    id: 'friend', name: 'Gene Sorrell', age: 71, title: 'The Trustee’s Old Friend',
    has: 'Forty years of coffee with Dale Berg, the board president. Doors open for you that stay shut for everyone else.',
    carries: 'The friendship. The truth is going to lean on it.',
    place: 'Retired lineman. You built half the poles this deal will feed off.'
  }
}

const SCENE_ORDER = ['title', 'role_select', 'briefing',
  'a1_open', 'a1_first_move', 'a1_meeting', 'a1_room', 'a1_evening',
  'a2_open', 'a2_records', 'a2_people', 'a2_thread', 'a2_channels', 'a2_pushback', 'a2_late',
  'a3_open', 'a3_comment', 'a3_recusal', 'a3_vote',
  'reveal', 'bridge', 'toolkit']

const SCENES = {}

// ───────────────────────── ACT 1 — THE RUMOR ─────────────────────────

SCENES.a1_open = {
  id: 'a1_open', type: 'cards', tap: 'Look at your phone',
  cards: [
    { dark: true, eyebrow: 'Halverson Township, Ohio — Tuesday, 7:42 a.m.', h2: 'A text from your neighbor Carol.',
      bubble: 'did you see the surveyors out on the kessler place?? three trucks. been there since yesterday' },
    { eyebrow: 'The Kessler farm — east edge of the township', bgImg: 'img/scenes/img-01-farm.webp', paras: ['The Kessler farm is 400 acres of corn and walnut trees on the east edge of the township.',
      'Walt Kessler’s family has farmed it for ninety years.',
      'Nobody surveys 400 acres for fun.'] }
  ]
}

SCENES.a1_first_move = {
  id: 'a1_first_move', type: 'decision',
  setup: [{ eyebrow: 'Act 1 — The Rumor · Your morning', paras: ['It’s your morning. You have one detour in you before the day takes over.'] }],
  prompt: 'What do you do?',
  moves: [
    {
      id: 'drive_out', label: 'Drive out past the Kessler place and look.',
      response: 'Survey stakes with pink ribbon, a white pickup with out-of-county plates, a man with a tablet who waves — friendly, practiced — and doesn’t stop walking. You’ve seen enough to know it’s real.',
      costs: [{ id: 'evening1', label: 'a morning, rearranged' }],
      flags: ['sawStakes'],
      echo: { scene: 'a1_meeting', text: 'You recognize the man with the tablet who waved you off at the Kessler farm — his white pickup is parked outside. He’s sitting up front, next to the trustees’ table. He’s not here to answer questions from the cheap seats.' }
    },
    {
      id: 'call_township', label: 'Call the township office and ask what’s going on.',
      response: 'The fiscal officer, carefully: “There’s a meeting Thursday. The trustees can’t discuss it before then. They signed… there are agreements.” She sounds like someone reading from a card she resents.',
      grantsFacts: ['P1']
    },
    {
      id: 'text_back', label: 'Text Carol back: “probably a pipeline thing” — and get on with your day.',
      response: 'You get on with your day. The day, it turns out, does not return the favor.',
      echo: { scene: 'a1_meeting', text: 'Everything you know about tonight arrived secondhand — Carol’s texts, a flyer photographed at the gas station. You’re walking in a step behind the room.' }
    }
  ]
}

SCENES.a1_meeting = {
  id: 'a1_meeting', type: 'cards', tap: 'Walk in',
  cards: [
    { dark: true, eyebrow: 'Two days later — Thursday, 7:00 p.m.', h2: 'The fire hall.', bgImg: 'img/scenes/img-02-firehall-night.webp',
      paras: ['The township called a public meeting — a photocopied flyer at the gas station, a line in the church bulletin. Word traveled anyway.',
        'Folding chairs. Coffee that’s been on since five. More people than the trustees expected — someone is dragging in chairs from the truck bay.'] },
    { eyebrow: 'The fire hall — the announcement', paras: ['Dale Berg, board president, reads a statement: an “economic development opportunity of generational significance.” A company called Ashvale Digital Infrastructure. A data center campus — warehouse-sized buildings full of the computers that run the internet. They need land. They need power. They need water. They want the Kessler farm.',
      'Next to him: a consultant, Gil Mora, in a jacket that costs more than the fire hall’s coffee budget for a decade. He smiles like he’s done this in forty townships. He has.',
      'The vote on the zoning and the tax package: six weeks from tonight.'] }
  ]
}

SCENES.a1_room = {
  id: 'a1_room', type: 'decision',
  setup: [{ eyebrow: 'The fire hall — question time', paras: ['Questions are opened. Hands go up. The room is a mix of hunger and alarm — jobs, money, water, traffic, all talking over each other.'] }],
  prompt: 'You get one real moment in this room. What do you do with it?',
  moves: [
    {
      id: 'ask_water', label: 'Stand and ask the water question: “How much water does this thing use, and where does it come from?”',
      response: 'Gil Mora, smoothly: “Impact studies will be made available at the appropriate stage of the process.” He does not say a number. The room notices that he does not say a number. So do you.',
      costs: [{ id: 'comfort', label: 'your comfort with a quiet life' }],
      flags: ['askedWater'],
      echo: { scene: 'a3_open', text: 'People remember you as the one who asked about the water. Strangers nod at you near the door.' }
    },
    {
      id: 'listen', label: 'Sit and listen. Really listen — to the room, not just the table.',
      response: 'Two rows up, a woman you know from church: her son does HVAC in Columbus because there’s nothing for him here — two hundred construction jobs would bring him home. She isn’t wrong, and she isn’t naive. Behind you, a man mutters to his wife: “My cousin’s in Ledger County, Indiana. Ashvale put one of these there. Promised them 150 jobs, he says.” His wife shushes him. You file both away.',
      grantsFacts: ['R1']
    },
    {
      id: 'corner_consultant', label: 'Catch Gil Mora afterward, one-on-one, by the coffee.', requiresRole: 'farmer',
      response: '“Ms. Prater.” He knows your name. “You got our letter.” He says the tax terms out loud like they’re a courtesy between business partners: a hundred percent off property taxes, fifteen years. He assumes you’re already inside.',
      grantsFacts: ['M1']
    },
    {
      id: 'catch_dale', label: 'Catch Dale Berg in the parking lot, like forty years of Thursdays.', requiresRole: 'friend',
      response: 'Dale doesn’t look at you. “I can’t talk about it, Gene. I signed something. All three of us did.” Then, quieter: “I hate it. But I signed it.”',
      grantsFacts: ['P1']
    }
  ]
}

SCENES.a1_evening = {
  id: 'a1_evening', type: 'decision',
  setup: [{ eyebrow: 'The week after the meeting — around the township', paras: ['The township is one long conversation now — the gas station, the school pickup line, the group chats. You have evenings, and choices about what to do with them.'] }],
  prompt: 'How do you spend tonight?',
  moves: [
    {
      id: 'pull_zoning', label: 'At work, pull the county file on the Kessler parcels.', requiresRole: 'county',
      response: 'The zoning amendment is already drafted — dated before the meeting was announced. And on the plat map, fourteen lines down: an option filed on 200 adjacent acres. Holder: Pinloch Land Holdings LLC. You’ve never heard of Pinloch. You write it down anyway. You also just crossed a line you can’t quite name — this crossed your desk because of your job.',
      grantsFacts: ['P2', 'I1'],
      costs: [{ id: 'workline', label: 'a line at work you can’t uncross' }]
    },
    {
      id: 'call_treasurer', label: 'Call the school district treasurer — you’ve known her since her kids were in your class.', requiresRole: 'teacher',
      response: '“We ran the numbers the night it leaked,” she says. “They’re floating a quarter million a year for the schools. Full valuation would be about three point one million. Nobody’s asked us to the table.” She pauses. “You didn’t hear the tax terms from me. A hundred percent off. Fifteen years.”',
      grantsFacts: ['M1', 'M3']
    },
    {
      id: 'reread_letter', label: 'Take your own option letter out of the kitchen drawer and read it like a lawyer.', requiresRole: 'farmer',
      response: 'Page four, in the definitions: the master agreement carries “no performance conditions.” If the jobs never come, nothing happens to anybody — except everyone who already got paid. Your signature line is still blank. It stares at you.',
      grantsFacts: ['M1', 'M2']
    },
    {
      id: 'watch_trucks', label: 'Drive the township roads like you used to walk the lines. See who’s where.', requiresRole: 'friend',
      response: 'Kyle Redmon’s truck, parked at the Kessler place at dusk, twice in one week. Kyle doesn’t farm. Kyle sells insurance in town and married Dale Berg’s daughter six years ago. You don’t know what he’s doing there. You know it’s something.',
      grantsFacts: ['I1']
    },
    {
      id: 'facebook_early', label: 'Post what you’ve heard so far to the Halverson Community Group.',
      response: 'Forty comments by midnight. Half say JOBS. Half say water. One says you’re a plant for the sierra club. Nothing you posted moved anything — heat, no light. You log off feeling worse.',
      flags: ['postedEarly']
    },
    {
      id: 'family_evening', label: 'Let it sit for a night. Dinner. The porch. The people you actually live with.',
      response: 'The best evening you’ve had in two weeks. It doesn’t advance anything. That’s not nothing — it’s the thing everyone else in this fight is spending down.'
    }
  ]
}


// ───────────────────────── ACT 2 — THE DIG ─────────────────────────

SCENES.a2_open = {
  id: 'a2_open', type: 'cards', tap: 'Keep going',
  cards: [
    { dark: true, eyebrow: 'Act 2 — The Dig · Two weeks in, four weeks to the vote', h2: 'The yard signs are up.',
      paras: ['JOBS FOR HALVERSON — printed and glossy, all along the county road. WHAT ABOUT OUR WATER — hand-painted on plywood. Somebody with money is organizing one side. Somebody with a kitchen table is organizing the other.',
        'Maybe this deal is good for Halverson. Maybe it isn’t. Right now nobody can tell — and that’s the problem.',
        'The facts that would answer it exist — in filings, in contracts, in rooms you weren’t in. Almost none of them are public yet. Somebody has to go get them.'] }
  ]
}

SCENES.a2_records = {
  id: 'a2_records', type: 'decision',
  setup: [{ eyebrow: 'Your kitchen table — four weeks to the vote', bgImg: 'img/scenes/img-03-kitchen-table.webp', paras: ['Anyone can ask the government for its documents — it’s called a public records request, and you don’t need a lawyer or a reason. Most people never file one, not because it’s hard, but because they don’t know what to ask for.',
    'Records take about ten days to arrive. There’s time for exactly one request before the vote, so what you ask for now is all you’ll have.'] }],
  prompt: 'What do you ask for?',
  moves: [
    {
      id: 'request_water', label: 'The water and power studies — every impact document the township holds.',
      response: 'Ten days later, a fat envelope. The draw: 2.1 million gallons a day — about 9,000 homes’ worth, for a township of 1,600. Not the billion gallons the group chat claims; the truth cuts down the rumor and is still enormous. And the substation: $48 million, recovered through base electric rates. Everyone pays it. Whether the jobs come or not.',
      grantsFacts: ['W1', 'W2'],
      costs: [{ id: 'afternoon1', label: 'an afternoon learning what a records request is' }],
      flags: ['hasDocuments']
    },
    {
      id: 'request_finance', label: 'The draft development agreement and every tax document behind it.',
      response: 'The envelope takes twelve days. The tax abatement — Ashvale pays no property taxes at all: 100 percent, fifteen years. What the schools get instead: $250,000 a year. Full property taxes would have been $3.1 million. And on page 31 — nothing. No clawback: no rule that takes the tax break back if the promised jobs never come. You read it twice to be sure the promises are decorative. They are.',
      grantsFacts: ['M1', 'M2', 'M3'],
      costs: [{ id: 'afternoon1', label: 'an afternoon learning what a records request is' }],
      flags: ['hasDocuments']
    },
    {
      id: 'request_legal', label: 'The township’s legal invoices — who reviewed this deal, and who hired them?', requiresFacts: ['P1'],
      response: 'A thin envelope, quickly produced — nobody thought these were sensitive. The invoice cover letter thanks the township for the referral and cc’s Ashvale’s counsel. The township’s “independent” review was suggested by the company it was reviewing.',
      grantsFacts: ['M4'],
      costs: [{ id: 'afternoon1', label: 'an afternoon learning what a records request is' }],
      flags: ['hasDocuments']
    },
    {
      id: 'skip_records', label: 'Paperwork isn’t your fight. Spend the time on people instead.',
      response: 'You spend the evening at your kitchen table with a legal pad, writing down who you know and what they might know. It’s not nothing. It’s also not documents.'
    }
  ]
}

SCENES.a2_people = {
  id: 'a2_people', type: 'decision',
  setup: [{ eyebrow: 'Around the township — three weeks to the vote', paras: ['A township is a web of people who’ve known each other too long. Some of them know pieces of this deal. Every thread you pull costs something.'] }],
  prompt: 'Who do you go see?',
  moves: [
    {
      id: 'carpool', label: 'The Hendricks kid’s mom — she works at the regional water district.', requiresRole: 'teacher',
      response: 'She meets you in the school lot, engine running. “You didn’t get this from me. Their projected draw is 2.1 million gallons a day. I’ve seen the intake application. And whoever’s saying a billion — they’re off by five hundred times. The real number’s bad enough.” She looks at her mirrors the whole time she talks.',
      grantsFacts: ['W1']
    },
    {
      id: 'coffee_dale', label: 'Coffee with Dale Berg. Press him — as a friend, which is the only way anyone can.', requiresRole: 'friend',
      response: 'Dale ages ten years in forty minutes. He won’t break the NDA. But at the door he says two things. “Comment window’s open, Gene. Has been for two weeks. Not that anyone told anybody.” And, quieter: “The zoning language was written before the first meeting. I’ve read it. It was done before you ever heard the word Ashvale.” He closes the door before you can thank him. Something between you has changed weight.',
      grantsFacts: ['P3', 'P2'],
      costs: [{ id: 'friendship', label: 'a 40-year friendship, strained' }]
    },
    {
      id: 'fence_walt', label: 'Talk to Walt Kessler across the fence line. Not about the deal. About him.', requiresRole: 'farmer',
      response: '“They told us we’d be the villains,” Walt says, looking at his own corn. “Ruth’s knees. The operating loan. Ninety years, and it comes down to us being the ones who couldn’t carry it.” Then: “Their man said Indiana went great. Ledger County. Look it up, if anybody’s looking things up.”',
      grantsFacts: ['R1']
    },
    {
      id: 'sos_search', label: 'Run Pinloch through the Secretary of State’s business search.', requiresRole: 'county', requiresFacts: ['I1'],
      response: 'Formation date: three weeks after Ashvale’s first documented contact with the trustees. Before anything was public. Somebody didn’t just know — somebody moved.',
      grantsFacts: ['I2']
    },
    {
      id: 'title_office', label: 'Ask the parent who works at the title office what’s moving on the east side.', requiresRole: 'teacher',
      response: '“Funny you ask.” She lowers her voice in the produce aisle. “An LLC took an option on 200 acres next to the Kessler place. Pinloch-something. Quiet filing. We notice quiet filings.”',
      grantsFacts: ['I1']
    },
    {
      id: 'quiet_week', label: 'Lie low for a week. Let the township talk without you.',
      response: 'The township talks without you. By Friday the rumor has the data center using “a billion gallons” and employing “basically nobody.” Rumors don’t rest, it turns out. They compound.'
    }
  ]
}

SCENES.a2_thread = {
  id: 'a2_thread', type: 'decision',
  setup: [{ eyebrow: 'Your notebook — three weeks to the vote', bgImg: 'img/scenes/img-04-road-dusk.webp', paras: ['Pinloch Land Holdings LLC. The name sits in your notebook like a splinter.',
    'An LLC is a company that doesn’t have to say who’s behind it — on paper it’s just a name and a filing. Finding the actual people takes one more pull.'] }],
  prompt: 'How hard do you pull?',
  moves: [
    {
      id: 'name_agent', label: 'Get the full filing and read every name on it.', requiresFacts: ['I2'],
      response: 'Registered agent: Kyle Redmon. You say it out loud to your empty kitchen. Kyle Redmon — Dale Berg’s son-in-law. The board president’s family holds an option that pays off the moment the board president’s vote goes through.',
      grantsFacts: ['I3']
    },
    {
      id: 'you_know_that_name', label: 'You already know whose truck that was. Say the name to yourself.', requiresRole: 'friend', requiresFacts: ['I1'],
      response: 'Kyle. Dale’s Kyle. Who married Sarah at the church you and Dale painted one August. You sit in the cab of your truck for a long time. Forty years of Thursdays, and the thing in your notebook is going to land on all of them.',
      grantsFacts: ['I3']
    },
    {
      id: 'ask_around', label: 'Ask around town — carefully — about who’s behind Pinloch.', requiresRole: 'teacher', requiresFacts: ['I1'],
      response: 'Three conversations, two dead ends, and then a retired loan officer who owes you for two decades of her grandkids: “The Redmon boy. Berg’s son-in-law.” She holds your eyes. “Be careful where you say that.”',
      grantsFacts: ['I3'],
      costs: [{ id: 'comfort', label: 'your comfort with a quiet life' }]
    },
    {
      id: 'call_your_agent', label: 'Call your own land agent and ask what else Ashvale’s people have signed out here.', requiresRole: 'farmer',
      response: '“Your neighbors to the east are already in,” he says, meaning it as reassurance. “Pinloch outfit — they optioned the two hundred acres past the creek. Signed the same week as our first calls, matter of fact.” The same week. Before anything was public. He does not understand what he just told you.',
      grantsFacts: ['I1', 'I2']
    },
    {
      id: 'let_it_lie', label: 'Let it lie. An LLC buying land isn’t a crime, and you have a life.',
      response: 'You let it lie. It doesn’t let you lie — the name floats up at odd hours, in the shower, at stoplights. Splinters work inward.'
    }
  ]
}

SCENES.a2_channels = {
  id: 'a2_channels', type: 'decision',
  setup: [{ eyebrow: 'Two weeks to the vote — a decision', paras: ['Here is what nobody tells you about finding things out: knowing is the easy half. What you know changes nothing until it’s somewhere the township can act on it.'] }],
  prompt: 'What you know is private. What do you do with it?',
  moves: [
    {
      id: 'call_reporter', label: 'Call Maya Torres — the reporter from the statewide nonprofit newsroom who covered the Ledger County deal.',
      response: 'She picks up on the second ring. She asks what you have. She asks what you can document. She says the two sentences you’ll repeat to other people for years: “Documents beat rumors. And early beats airtight — I need time to verify or it doesn’t run before your vote.”',
      reporterHandoff: true,
      costs: [{ id: 'evening2', label: 'an evening assembling everything for a stranger' }],
      flags: ['gaveReporter']
    },
    {
      id: 'post_llc_raw', label: 'Post the Pinloch discovery to the Halverson Community Group tonight, while it’s hot.', requiresFacts: ['I1'], hideIfFacts: ['I3'],
      response: 'By morning it’s the only thing the township is talking about — and it’s wrong. Someone “confirmed” BERG OWNS THE LAND. He doesn’t; you never said he did. Berg rebuts the wrong version at the diner, wins easily, and now everything with the word Pinloch in it sounds like a debunked rumor. You watch your one real thread get laughed into the ditch.',
      makesPublic: { channel: 'facebook', ids: ['I1'], discounted: true },
      costs: [{ id: 'credibility', label: 'the benefit of the doubt' }]
    },
    {
      id: 'post_documented', label: 'Post the Pinloch chain — with every name and date you can back up.', requiresFacts: ['I3'],
      response: 'You write it flat and factual: the option, the formation date, the registered agent, the family connection. No adjectives. The thread goes quiet in the way rooms go quiet. Nobody debunks it. There is nothing to debunk.',
      makesPublic: { channel: 'facebook', ids: ['I1', 'I2', 'I3'] }
    },
    {
      id: 'hold_for_meeting', label: 'Hold everything for the vote meeting. Say it once, in the room, on the record.',
      response: 'You start writing what you’ll say. Three minutes is 390 words. You cut everything that sounds like an opinion. What’s left is heavier.',
      flags: ['holding']
    }
  ]
}

SCENES.a2_pushback = {
  id: 'a2_pushback', type: 'cards', tap: 'Put it down',
  cards: [
    { dark: true, eyebrow: 'Your mailbox — ten days before the vote', h2: 'The envelope with your name typed on it.', bgImg: 'img/scenes/img-05-mailbox.webp',
      paras: ['A law firm you’ve never heard of. It cites nothing you actually did. It doesn’t have to — it’s not a legal instrument, it’s a mood.'],
      paper: ['Attorneys at Law',
        'RE: Notice regarding interference with contractual relations',
        '“…please be reminded that intentional interference with existing contractual relationships may carry personal liability under Ohio law…”'],
      parasAfter: ['Your spouse reads it twice at the kitchen table and asks, quietly, if this is worth it.',
        'You notice the letter doesn’t say anything you found was wrong.'] }
  ]
}

SCENES.a2_late = {
  id: 'a2_late', type: 'decision',
  setup: [{ eyebrow: 'The last week — six days to the vote', paras: ['Whatever isn’t public by Thursday night stays buried until it’s too late to matter.'] }],
  prompt: 'One more push. Where?',
  moves: [
    {
      id: 'ledger_call', label: 'Call the Ledger County commissioners’ office in Indiana. Ask what actually happened.', requiresFacts: ['R1'],
      response: 'A commissioner calls you back personally, which tells you something. “I’ll give you the whole picture. The construction years were real — eight hundred jobs, two good years. My brother-in-law bought a house. Permanent? Thirty-one. They promised 150.” Then, unprompted: “Get your conditions before the vote. We forced a clawback in year two — made the tax break contingent on the jobs actually showing up — but by then we’d given away two years of leverage. It can be done. Do it now.”',
      grantsFacts: ['R2', 'R3'],
      costs: [{ id: 'afternoon2', label: 'an afternoon of Indiana phone tag' }]
    },
    {
      id: 'written_comment', label: 'File a written public comment before the unannounced window closes.', requiresFacts: ['P3'],
      response: 'You file the first — and, you later learn, only — written comment of the entire process. It enters the record. The record is the thing that survives.',
      makesPublicKnown: { count: 2, channel: 'meeting' }
    },
    {
      id: 'reporter_callback', label: 'Maya calls back. She needs one more corroboration to run it.', requiresFlag: 'gaveReporter',
      response: 'You spend two hours reconstructing exactly where each piece came from, what’s documented and what’s secondhand. “Okay,” she finally says. “Okay.” You have never heard a better two-word sentence.',
      flags: ['corroborated']
    },
    {
      id: 'rest', label: 'You’ve done what you can do. Take the week back.',
      response: 'You coach the practice. You fix the gutter. The vote is coming either way, and you will walk into it rested. There’s a case for that, too.'
    }
  ]
}

// ───────────────────────── ACT 3 — THE VOTE ─────────────────────────

// variants resolved by ui.js: 'reporter' if a reporter story published,
// 'loud' if 3+ facts public, else 'quiet'
SCENES.a3_open = {
  id: 'a3_open', type: 'cards', tap: 'Take a seat',
  variants: {
    reporter: [
      { dark: true, eyebrow: 'Act 3 — The morning of the vote', h2: 'The story runs.', bgImg: 'img/scenes/img-08-porch-morning.webp',
        paras: ['Statewide nonprofit newsroom, top of the page: the documents, the numbers, the names — verified. By noon it’s in the group chats. By four, a TV truck from the city is parked outside the fire hall.',
          'Tonight there are 140 people for 60 chairs.'] }
    ],
    loud: [
      { dark: true, eyebrow: 'Act 3 — Vote night · The fire hall', h2: 'The fire hall, full.', bgImg: 'img/scenes/img-06-meeting-full.webp',
        paras: ['What surfaced these past weeks has been working through the township like water through limestone. People arrive carrying printouts. Somebody made copies.',
          'The trustees’ table has three microphones tonight. That’s new.'] }
    ],
    quiet: [
      { dark: true, eyebrow: 'Act 3 — Vote night · The fire hall', h2: 'The fire hall, quiet.', bgImg: 'img/scenes/img-07-meeting-empty.webp',
        paras: ['Fourteen people, most of them the same fourteen. The agenda is photocopied and stapled. The vote is item six of seven, between a culvert bid and the cemetery mowing contract.',
          'Whatever is true tonight, almost none of it is in this room.'] }
    ]
  }
}

SCENES.a3_comment = {
  id: 'a3_comment', type: 'decision',
  setup: [{ eyebrow: 'The fire hall — public comment', paras: ['Before the trustees vote, anyone who signs up gets three minutes at the microphone. That’s public comment — it’s how community members get on the record at a government meeting.',
    'Lena Fitch times the three minutes with a kitchen timer, apologetically. What’s said here enters the official record and the room at the same time.'] }],
  prompt: 'Your name is called. What do you bring to the microphone?',
  moves: [
    {
      id: 'speak_documents', label: 'The documents. Read the numbers into the record, page and line.', requiresFlag: 'hasDocuments',
      response: 'You read page numbers out loud. It is impossible to argue with a page number — Gil Mora, for the first time in six weeks, checks his own binder. Behind you: the sound of forty people writing things down.',
      makesPublicKnown: { count: 3, channel: 'meeting' },
      costs: [{ id: 'comfort', label: 'your comfort with a quiet life' }]
    },
    {
      id: 'speak_plain', label: 'No documents — just what you know, said plainly, with your name on it.',
      response: 'Your voice shakes for the first thirty seconds. It stops shaking when you realize the room has gone quiet in the listening way, not the waiting way.',
      makesPublicKnown: { count: 2, channel: 'meeting' },
      costs: [{ id: 'comfort', label: 'your comfort with a quiet life' }]
    },
    {
      id: 'yield_time', label: 'Yield your time. Let the room carry what’s already out there.',
      response: 'You sit with your hands folded while your neighbors stand up one by one. Some of them are holding facts you recognize — things that would still be private if the past six weeks had gone differently.'
    }
  ]
}

// Rendered only when I3 is public or (I3 known and player spoke) — ui.js skips it otherwise
SCENES.a3_recusal = {
  id: 'a3_recusal', type: 'decision',
  setup: [{ eyebrow: 'The fire hall — the motion to vote', paras: ['Roy Prentice moves to proceed to the vote. Lena Fitch seconds, slowly. Dale Berg reaches for the gavel — and the room, which now knows what it knows, holds its breath at the sight of his hand.',
    'When a board member stands to profit from a vote, the remedy has a name: recusal. Stepping aside. Not voting. Someone has to ask for it.'] }],
  prompt: 'The Pinloch connection is in the open. Someone has to say the word.',
  moves: [
    {
      id: 'call_recusal', label: 'Stand and ask the question: “Mr. Berg, will you recuse yourself?”',
      response: 'The word lands like a dropped hymnal. Berg looks at the room — and for a moment, straight at you. Then he sets the gavel down. “On advice of counsel,” he says, barely audible, “I will step aside from this matter.”',
      makesPublic: { channel: 'meeting', ids: ['I3'] },
      flags: ['recusalCalled'],
      costs: [{ id: 'comfort', label: 'your comfort with a quiet life' }]
    },
    {
      id: 'stay_seated', label: 'Stay seated. If the room wants it, the room can ask.',
      response: 'A woman near the back — you don’t know her — stands and asks it, her voice cracking on “recuse.” It didn’t need to be you. It needed to be somebody, and because of the past six weeks, somebody knew enough to ask.',
      flags: ['recusalCalled']
    }
  ]
}

// variants resolved by ui.js from GameState.endingNow().outcome
SCENES.a3_vote = {
  id: 'a3_vote', type: 'cards', tap: 'See what it meant',
  variants: {
    delayed: [
      { dark: true, eyebrow: 'The fire hall — the vote', h2: 'Tabled.',
        paras: ['With Berg recused and an ethics inquiry opened, the vote is tabled pending independent review. Gil Mora’s smile finally reaches nowhere near his eyes.',
          'The data center may still come. But it will come through a process Halverson can see — negotiated by a board the township is watching, on terms that now have to survive daylight.'] }
    ],
    conditions: [
      { dark: true, eyebrow: 'The fire hall — the vote', h2: 'Approved — with conditions.',
        paras: ['The numbers that surfaced did their work. The amended package: a clawback clause tied to the job commitments, a cap on the daily water draw, and a renegotiated school payment — $1.4 million a year instead of $250,000.',
          'Roy Prentice votes yes like a man relieved to be voting for something he can defend at the diner. The data center is coming. Halverson set terms.'] }
    ],
    as_written: [
      { dark: true, eyebrow: 'The fire hall — the vote', h2: 'Approved, 3–0.',
        paras: ['The whole item takes eleven minutes, including the reading of the resolution. No clawback. No water cap. The schools keep the quarter million.',
          'Gil Mora shakes three hands and is on the road by 8:40. In the parking lot, people who will live here for the rest of their lives stand around in the dark, asking each other what just happened.'] }
    ],
    delayed_quiet: [
      { dark: true, eyebrow: 'The fire hall — the vote', h2: 'Tabled.',
        paras: ['The Pinloch filings — an option on 200 acres, signed three weeks after first contact, before anything was public — are on every phone in the fire hall. Lena Fitch, slowly and carefully, moves to table the vote pending an independent ethics review of who knew what, and when. It passes.',
          'The data center may still come. But it will come through a process Halverson can see — on terms that now have to survive daylight.'] }
    ],
    as_written_recused: [
      { dark: true, eyebrow: 'The fire hall — the vote', h2: 'Approved.',
        paras: ['With Dale Berg stepped aside, the vote is 2–0. No clawback. No water cap. The schools keep the quarter million.',
          'A recusal without the numbers behind it, it turns out, changes who votes — not what passes. Gil Mora shakes two hands and is on the road by 8:40.'] }
    ]
  }
}

// ───────────────────────── ENDINGS / REVEAL / BRIDGE / TOOLKIT COPY ─────────────────────────

const ENDINGS = {
  delayed: {
    title: 'Halverson bought itself time — and leverage.',
    body: 'The deal isn’t dead, and honestly, it may not need to be. What died was the version negotiated in the dark. Every term now has to survive an ethics review, a watching township, and a public record with names in it.',
    shadowLine: 'Without what surfaced: approved as written, 3–0, in eleven minutes.'
  },
  conditions: {
    title: 'The data center is coming. Halverson set the terms.',
    body: 'A clawback with teeth. A water cap. $1.4 million a year for the schools instead of $250,000. None of it was on the table six weeks ago — it got there because facts became public while the vote could still respond to them.',
    shadowLine: 'Without what surfaced: no clawback, no cap, and the schools keep the quarter million.'
  },
  as_written: {
    title: 'The township had a decision made to it.',
    body: 'Nobody lied, exactly. The truth just stayed wherever it was found — or was never found at all. The terms are what they were always going to be when no one is watching: generous in the press release, unenforceable on page 31.',
    shadowLine: 'This IS the eleven-minute meeting. It’s what happens every time no one surfaces anything.'
  }
}

const REVEAL_COPY = {
  eyebrow: 'What you never found out',
  foundLabel: n => 'You surfaced ' + n.public + ' of 15 truths — and found ' + n.known + ' — before the vote.',
  knownNotPublic: 'Facts you knew but never made public counted for nothing. Knowing isn’t the act. Surfacing is.',
  lateReporter: 'Handed to the reporter too late to verify before the vote:',
  costsTitle: 'What it cost you',
  costsNone: 'Almost nothing. Worth sitting with what that bought.',
  shadowTitle: 'The meeting that happens if you stay home',
  replayHook: role => 'Play again as ' + role + ' — different doors open.'
}

const BRIDGE_COPY = {
  notFiction: {
    eyebrow: 'This is not fiction',
    h2: 'Halverson is invented. The deal structure isn’t.',
    paras: ['Property-tax abatements of 75 to 100 percent. Negotiations under non-disclosure agreements. Water and power questions asked after the terms were set. This is how data-center deals are being made across Ohio right now.',
      'The details in this game are drawn from real reporting on real Ohio deals — and that reporting is ongoing.']
  },
  oneAction: {
    h2: 'Do you know what’s being decided in your township this month?',
    paras: ['Every Ohio township and county posts meeting schedules and agendas. Your county auditor, your board of elections, and your township’s own site are the standard doors in.',
      'The single highest-leverage civic act in this game — and outside it — is showing up before the vote instead of after.'],
    cta: 'Find your next local meeting'
  },
  toolkitTease: 'Everything you just did exists in real life — the records request, the business search, the tip. Open the toolkit.'
}

const TOOLKIT_COPY = {
  title: 'The Citizen’s Toolkit',
  intro: 'Every move in the game, translated to the real thing.',
  items: [
    {
      h3: 'The records request',
      paras: ['Ohio’s Public Records Act covers nearly everything a township or county holds: impact studies, draft agreements, legal invoices, correspondence. You don’t need a lawyer or a reason.',
        'Copy-ready template:'],
      template: 'To the records custodian: Pursuant to the Ohio Public Records Act (R.C. 149.43), I request copies of [describe: e.g., all water or utility impact studies related to the proposed development at (location)]. I ask that responsive records be provided electronically. Please advise of any costs before fulfilling. Thank you. — [Name, contact]',
      linkKey: 'publicRecordsLaw', linkLabel: 'Ohio Sunshine Laws manual'
    },
    {
      h3: 'The meeting',
      paras: ['Agendas are posted in advance; comment periods are real and mostly empty. The three load-bearing questions from this game are literal questions to ask:',
        '1. Who pays for the infrastructure upgrades — and does that appear in anyone’s rates?',
        '2. Is there a clawback clause if the promised jobs don’t come?',
        '3. Who holds options on land adjacent to the site?']
    },
    {
      h3: 'The reporter',
      paras: ['Early beats airtight. Documents beat rumors. Reporters can verify what you can’t — but verification takes time, so the moment you have something real is the moment to reach out.'],
      linkKey: 'tipLine', linkLabel: 'Send a tip'
    },
    {
      h3: 'The paper trail',
      paras: ['County auditor property records show who owns and options land. The Secretary of State’s business search shows when any LLC was formed and who its registered agent is. Both are free, public, and take about four minutes.'],
      linkKey: 'sosBusinessSearch', linkLabel: 'Ohio business search'
    }
  ],
  newsletter: {
    paras: ['The paper that shows up at the meeting is part of the infrastructure.'],
    linkKey: 'newsletter', linkLabel: 'Get the newsletter'
  }
}

// WORLD — the "who's who / what's what" reference shown at the top of the Notebook,
// so a player who skimmed the setup can recover context any time. Entries with a
// `role` field appear only for that role.
const WORLD = {
  title: 'Who’s who, what’s what',
  entries: [
    { h: 'The deal', text: 'Ashvale Digital Infrastructure wants to build a data center campus on 400 acres of the Kessler farm. The three township trustees vote on the zoning and the tax package six weeks after the news breaks.' },
    { h: 'The Kesslers', text: 'Walt and Ruth Kessler. Ninety years of family farming on that land. They’re selling because they can’t carry it anymore — Ruth’s health, and a farm loan that never gets smaller.' },
    { h: 'The trustees', text: 'Halverson’s elected three-member board: Dale Berg (president), Lena Fitch, and Roy Prentice. They negotiated with Ashvale under non-disclosure agreements — legally barred from discussing the deal.' },
    { h: 'Gil Mora', text: 'Ashvale’s site consultant. Polite, practiced, and gives away exactly nothing.' },
    { h: 'Maya Torres', text: 'A reporter at a statewide nonprofit newsroom. She covered Ashvale’s last project, in Ledger County, Indiana.' },
    { h: 'Your option letter', role: 'farmer', text: 'Ashvale’s land agent offered to buy an option on your 180 acres — money that would pay off your operating loan. You haven’t signed it. It’s in the kitchen drawer.' },
    { h: 'Your job', role: 'county', text: 'You file public records at the county recorder’s office. Using what crosses your desk in township politics could cost you the job.' },
    { h: 'Dale Berg', role: 'friend', text: 'Board president — and your friend of forty years. Coffee every Thursday since before either of you had gray hair.' },
    { h: 'The school district', role: 'teacher', text: 'Property taxes fund the schools. Whatever tax deal the township cuts with Ashvale decides what the district gets — or doesn’t.' }
  ]
}

if (typeof module !== 'undefined') {
  module.exports = { ROLES, SCENE_ORDER, SCENES, ENDINGS, REVEAL_COPY, BRIDGE_COPY, TOOLKIT_COPY, WORLD }
} else {
  window.SCENARIO = { ROLES, SCENE_ORDER, SCENES, ENDINGS, REVEAL_COPY, BRIDGE_COPY, TOOLKIT_COPY, WORLD }
}
