// The punk family tree, hard-coded until the backend has a Genre model.
//
// Two levels on purpose. `genres` holds the labels with real historical weight:
// a scene, records, a before and an after. `related` holds everything else —
// regional scenes, fusions, fan tags, platform tags. Giving all of them a card
// would bury the ones that matter under three hundred that do not.

export interface Genre {
  name: string;
  years: string;
  origin: string;
  description: string;
  bands: string[];
}

export interface Family {
  name: string;
  summary: string;
  genres: Genre[];
  /** Labels that belong to the family without deserving a card of their own. */
  related: string[];
}

export const FAMILIES: Family[] = [
  {
    name: "Roots & Proto-Punk",
    summary: "Before the word existed — loud, primitive, and hostile to studio polish.",
    genres: [
      {
        name: "Garage Rock",
        years: "1963–1968",
        origin: "United States",
        description: "Teenage bands recording raw rock and roll badly on purpose. Punk's oldest ancestor.",
        bands: ["The Sonics", "The Seeds", "? and the Mysterians"],
      },
      {
        name: "Proto-Punk",
        years: "1967–1974",
        origin: "United States",
        description: "Punk before it had a name: distortion, repetition, and open contempt for virtuosity.",
        bands: ["The Stooges", "MC5", "The Velvet Underground"],
      },
      {
        name: "Pub Rock",
        years: "1972–1976",
        origin: "United Kingdom",
        description: "Small-venue rock that rejected stadium excess and built the circuit punk would inherit.",
        bands: ["Dr. Feelgood", "Eddie and the Hot Rods", "Ducks Deluxe"],
      },
      {
        name: "Glam Punk",
        years: "1971–1976",
        origin: "United States",
        description: "Makeup, platform boots and songs that fall apart on purpose.",
        bands: ["New York Dolls", "Hollywood Brats", "Jobriath"],
      },
    ],
    related: [
      "Detroit proto-punk", "New York proto-punk", "Garage punk", "Freakbeat punk",
      "Noise rock", "Art rock proto-punk", "Krautpunk", "Avant-punk", "No wave",
      "Trash rock", "Punk blues", "Punk rock'n'roll", "Deathrock'n'roll",
      "Psychedelic proto-punk", "Glam rock punk",
    ],
  },
  {
    name: "First Wave",
    summary: "1976–1979. Three chords, two minutes, no solos — and the year everything split in two.",
    genres: [
      {
        name: "Punk Rock",
        years: "1974–",
        origin: "United States / United Kingdom",
        description: "The first wave that gave everything else its name. Short, fast, and deliberately unskilled.",
        bands: ["Ramones", "Sex Pistols", "The Clash"],
      },
      {
        name: "77 Punk",
        years: "1976–1979",
        origin: "United Kingdom",
        description: "The British year zero: art-school sloganeering, safety pins, and a singles chart under siege.",
        bands: ["The Damned", "Buzzcocks", "The Adverts"],
      },
      {
        name: "New York Punk",
        years: "1974–1979",
        origin: "United States",
        description: "Built around one Bowery club, closer to poetry and art rock than to the London version.",
        bands: ["Television", "Patti Smith Group", "Richard Hell and the Voidoids"],
      },
      {
        name: "Art Punk",
        years: "1977–",
        origin: "United Kingdom",
        description: "Punk method applied to sounds that were never meant to be punk.",
        bands: ["Wire", "The Pop Group", "Swell Maps"],
      },
    ],
    related: [
      "'76 punk", "Early punk", "US punk", "London punk", "California punk",
      "Washington D.C. punk", "DIY punk", "Minimalist punk", "Raw punk",
      "Primitive punk", "Noise punk", "Fuzz punk", "Power punk", "Proto-hardcore",
      "Political punk", "Situationist punk", "Dadaist punk", "Theatrical punk",
      "Nihilist punk", "Experimental punk",
    ],
  },
  {
    name: "Post-Punk & Dark Offshoots",
    summary: "Punk's energy turned inward — angular, cold, and willing to borrow from dub, funk and horror.",
    genres: [
      {
        name: "Post-Punk",
        years: "1978–",
        origin: "United Kingdom",
        description: "Kept punk's refusal, dropped its sound. Bass-led, dissonant, often bleak.",
        bands: ["Joy Division", "Gang of Four", "Siouxsie and the Banshees"],
      },
      {
        name: "Deathrock",
        years: "1979–",
        origin: "United States",
        description: "Los Angeles punk crossed with horror imagery and reverb, years before goth was a shop.",
        bands: ["Christian Death", "45 Grave", "Kommunity FK"],
      },
      {
        name: "Horror Punk",
        years: "1977–",
        origin: "United States",
        description: "B-movie imagery over doo-wop melodies, sung like something is coming through the wall.",
        bands: ["Misfits", "Samhain", "The Damned"],
      },
      {
        name: "Synth-Punk",
        years: "1977–",
        origin: "United States",
        description: "Punk with a cheap keyboard instead of a lead guitar, and no apology for it.",
        bands: ["Suicide", "The Screamers", "Devo"],
      },
      {
        name: "Dance-Punk",
        years: "1979–",
        origin: "United Kingdom / United States",
        description: "Punk that admitted the rhythm section was the point.",
        bands: ["ESG", "Liquid Liquid", "!!!"],
      },
    ],
    related: [
      "Goth punk", "Gothic punk", "Coldwave", "Darkwave", "Minimal wave", "Batcave",
      "Positive punk", "No wave", "Industrial punk", "Electropunk", "Digital hardcore",
      "Psychobilly", "Gothabilly", "Math rock punk", "Post-punk revival", "Funk-punk",
      "Disco-punk", "Noise rock", "Apocalyptic post-punk", "Anarcho-post-punk",
      "Ethereal wave", "Deathrock revival", "Dark punk", "Cyberpunk",
    ],
  },
  {
    name: "Hardcore",
    summary: "Punk stripped of anything that slowed it down — and the root of almost every '-core' that followed.",
    genres: [
      {
        name: "Hardcore Punk",
        years: "1978–",
        origin: "United States",
        description: "Punk played faster, shorter and angrier, with the melody sanded off.",
        bands: ["Black Flag", "Bad Brains", "Dead Kennedys"],
      },
      {
        name: "Straight Edge",
        years: "1981–",
        origin: "United States",
        description: "Hardcore plus a refusal: no drink, no drugs. A lyric from one song became a movement.",
        bands: ["Minor Threat", "SSD", "Youth of Today"],
      },
      {
        name: "Youth Crew",
        years: "1986–",
        origin: "United States",
        description: "Straight edge with gang vocals, varsity jackets and a relentlessly positive tone.",
        bands: ["Youth of Today", "Gorilla Biscuits", "Bold"],
      },
      {
        name: "Melodic Hardcore",
        years: "1982–",
        origin: "United States",
        description: "Hardcore that let the tunes back in without dropping the tempo.",
        bands: ["Dag Nasty", "Descendents", "Strike Anywhere"],
      },
      {
        name: "Beatdown Hardcore",
        years: "1990s–",
        origin: "United States",
        description: "Built around the breakdown: slow, heavy, and written for the pit rather than the record.",
        bands: ["Hatebreed", "Bulldoze", "Terror"],
      },
    ],
    related: [
      "Old-school hardcore", "New-school hardcore", "NYHC", "Boston hardcore",
      "D.C. hardcore", "Bay Area hardcore", "Los Angeles hardcore", "Texas hardcore",
      "Midwest hardcore", "Chicago hardcore", "Florida hardcore", "Connecticut hardcore",
      "UK hardcore", "Britcore", "European hardcore", "German hardcore", "Italian hardcore",
      "Scandinavian hardcore", "Krishnacore", "Positive hardcore", "Political hardcore",
      "Metallic hardcore", "Chaotic hardcore", "Tough-guy hardcore", "Moshcore",
      "Two-step", "Downtempo hardcore", "Stomp hardcore", "Heavy hardcore",
      "Crossover hardcore", "Youth-crew revival", "Skatecore", "Fast hardcore",
    ],
  },
  {
    name: "Street Punk & Oi!",
    summary: "Working-class punk written for the terraces: shouted choruses, no art school.",
    genres: [
      {
        name: "Oi!",
        years: "1977–",
        origin: "United Kingdom",
        description: "Punk stripped back to singalong choruses and subject matter from the estate and the pub.",
        bands: ["Cock Sparrer", "Sham 69", "The 4-Skins"],
      },
      {
        name: "Street Punk",
        years: "1980–",
        origin: "United Kingdom",
        description: "Oi! with spiked hair and studs: louder production, faster tempos, same audience.",
        bands: ["The Exploited", "GBH", "The Casualties"],
      },
      {
        name: "UK82",
        years: "1981–1984",
        origin: "United Kingdom",
        description: "The second British wave — bleak, distorted, and named after the year it peaked.",
        bands: ["Discharge", "Chaos UK", "Varukers"],
      },
    ],
    related: [
      "Working-class punk", "Bootboy punk", "Anarcho-Oi!", "Redskin", "Antifa punk",
      "Streetcore", "Street crust", "Street rock", "Pub punk", "Beer punk",
      "Football punk", "Casuals punk", "Singalong punk", "Chorus punk",
      "RAC (far-right, disowned by most of the scene)", "French Oi!", "Punk'n'Oi!",
    ],
  },
  {
    name: "Anarcho-Punk, Crust & D-Beat",
    summary: "Politics first, music second — and the point where punk started borrowing from metal.",
    genres: [
      {
        name: "Anarcho-Punk",
        years: "1977–",
        origin: "United Kingdom",
        description: "Stencilled sleeves, collective living, records sold at cost, and no interest in a career.",
        bands: ["Crass", "Conflict", "Subhumans"],
      },
      {
        name: "D-Beat",
        years: "1981–",
        origin: "United Kingdom / Sweden",
        description: "An entire genre built on one drum pattern, borrowed from Discharge and never given back.",
        bands: ["Discharge", "Anti Cimex", "Disclose"],
      },
      {
        name: "Crust Punk",
        years: "1982–",
        origin: "United Kingdom",
        description: "Anarcho-punk politics welded to metal riffs, recorded as murkily as possible.",
        bands: ["Amebix", "Doom", "Nausea"],
      },
      {
        name: "Stenchcore",
        years: "1985–",
        origin: "United Kingdom",
        description: "The metallic end of crust: slower, epic, closer to early Celtic Frost than to punk.",
        bands: ["Axegrinder", "Deviated Instinct", "Hellbastard"],
      },
      {
        name: "Neocrust",
        years: "2000s–",
        origin: "Spain / Sweden",
        description: "Crust with melody and long build-ups, borrowing structure from post-metal.",
        bands: ["Ekkaia", "Madame Germen", "Alpinist"],
      },
    ],
    related: [
      "Peace punk", "Eco-punk", "Crass punk", "Raw punk", "Kängpunk", "Käng",
      "Mangel", "Mangelpunk", "Discore", "Burning Spirits", "Japan-core",
      "Scandi-crust", "Swedish D-beat", "Japanese D-beat", "Scandinavian raw punk",
      "Blackened crust", "Death crust", "Doom crust", "Sludge crust", "Grind crust",
      "Emo crust", "Screamo crust", "Atmospheric crust", "Epic crust",
      "Apocalyptic crust", "Funeral crust", "Melodic crust", "Progressive crust",
      "Dis-crust", "Post-crust", "Anarcho-hardcore", "Anarcho-folk punk",
      "Feminist anarcho-punk", "Industrial crust",
    ],
  },
  {
    name: "Melodic, Pop & Skate",
    summary: "Punk that kept the hooks — dismissed by purists, and how most people heard punk at all.",
    genres: [
      {
        name: "Pop Punk",
        years: "1977–",
        origin: "United States / United Kingdom",
        description: "Punk tempo, pop songwriting. The Ramones invented it; the 90s sold it.",
        bands: ["Buzzcocks", "Descendents", "Green Day"],
      },
      {
        name: "Skate Punk",
        years: "1980s–",
        origin: "United States",
        description: "Melodic hardcore written for skateparks: fast, tight, impossible to sit still to.",
        bands: ["Suicidal Tendencies", "NOFX", "Pennywise"],
      },
      {
        name: "Easycore",
        years: "2000s–",
        origin: "United States",
        description: "Pop punk with metalcore breakdowns bolted on, entirely without irony.",
        bands: ["New Found Glory", "Four Year Strong", "A Day to Remember"],
      },
    ],
    related: [
      "Melodic punk", "Punk pop", "Power pop punk", "Emo pop-punk", "Neon pop-punk",
      "Mall punk", "Warped-tour punk", "Popcore", "Nerd punk", "Geek punk",
      "Chiptune punk", "Nintendocore", "Scene punk", "College punk", "Indie punk",
      "Modern punk", "Punk revival", "Alternative punk", "Christian punk",
      "Straight-edge pop-punk", "Post-pop punk",
    ],
  },
  {
    name: "Emo, Screamo & Post-Hardcore",
    summary: "Hardcore that turned the shouting inward — and then shouted much, much louder.",
    genres: [
      {
        name: "Emocore",
        years: "1985–",
        origin: "United States",
        description: "Emotional hardcore out of Washington D.C., before the word meant a haircut.",
        bands: ["Rites of Spring", "Embrace", "Moss Icon"],
      },
      {
        name: "Midwest Emo",
        years: "1994–",
        origin: "United States",
        description: "Twinkling guitars, odd time signatures and lyrics about a specific bedroom.",
        bands: ["American Football", "Cap'n Jazz", "The Promise Ring"],
      },
      {
        name: "Screamo",
        years: "1991–",
        origin: "United States",
        description: "Emo taken to its limit: shrieked vocals, chaos, and songs that collapse mid-bar.",
        bands: ["Orchid", "Pg. 99", "City of Caterpillar"],
      },
      {
        name: "Post-Hardcore",
        years: "1985–",
        origin: "United States",
        description: "Hardcore musicians refusing hardcore's rules — dynamics, space, unusual structures.",
        bands: ["Fugazi", "Drive Like Jehu", "At the Drive-In"],
      },
      {
        name: "Mathcore",
        years: "1995–",
        origin: "United States",
        description: "Metallic hardcore in shifting time signatures, played as if the tape is skipping.",
        bands: ["The Dillinger Escape Plan", "Converge", "Botch"],
      },
    ],
    related: [
      "Skramz", "First-wave emo", "Second-wave emo", "Emo revival", "Fourth-wave emo",
      "Fifth-wave emo", "Twinkly emo", "Math emo", "Bedroom emo", "Lo-fi emo",
      "Acoustic emo", "Folk emo", "Post-emo", "Emoviolence", "Emo violence",
      "Chaotic screamo", "Blackened screamo", "Screamo crust", "Screamo grind",
      "Nu-screamo", "Skramz revival", "Swancore", "Chaotic post-hardcore",
      "Atmospheric post-hardcore", "Melodic post-hardcore", "Progressive post-hardcore",
      "Post-metalcore", "Dance post-hardcore", "Scene post-hardcore",
    ],
  },
  {
    name: "Powerviolence, Fastcore & Grindcore",
    summary: "Hardcore pushed until it breaks: blast beats, dead stops, songs under thirty seconds.",
    genres: [
      {
        name: "Thrashcore",
        years: "1982–",
        origin: "United States",
        description: "Hardcore at thrash metal speed, with the songs cut down to the length of a sneeze.",
        bands: ["D.R.I.", "Septic Death", "Siege"],
      },
      {
        name: "Powerviolence",
        years: "1988–",
        origin: "United States",
        description: "Blast beats slammed against dead stops and sludge crawls. Deliberately unlistenable.",
        bands: ["Infest", "Man Is the Bastard", "Spazz"],
      },
      {
        name: "Grindcore",
        years: "1985–",
        origin: "United Kingdom",
        description: "Crust and hardcore fused with death metal. The bridge between punk and extreme metal.",
        bands: ["Napalm Death", "Repulsion", "Terrorizer"],
      },
      {
        name: "Mincecore",
        years: "1989–",
        origin: "Belgium",
        description: "Grindcore played as a political joke that is entirely serious about the politics.",
        bands: ["Agathocles", "Archagathus", "Warsore"],
      },
    ],
    related: [
      "Fastcore", "Thrash punk", "Crossover thrash", "Skate thrash", "Noisecore",
      "Noisegrind", "Blastbeat hardcore", "Grindviolence", "Emoviolence",
      "Crust powerviolence", "Sludge powerviolence", "Blackened powerviolence",
      "Goregrind", "Pornogrind", "Gorenoise", "Deathgrind", "Cybergrind",
      "Digital grindcore", "Industrial grindcore", "Technical grindcore",
      "Math grindcore", "Progressive grindcore", "Political grindcore",
      "Slamgrind", "Sludgegrind", "Doomgrind", "Mincegore", "Melodic grindcore",
    ],
  },
  {
    name: "The Metal Edge",
    summary: "Where the family tree stops being punk and starts being something the metal press claims.",
    genres: [
      {
        name: "Crossover Thrash",
        years: "1984–",
        origin: "United States",
        description: "Hardcore kids discovering thrash metal, and thrash kids discovering the pit.",
        bands: ["Suicidal Tendencies", "Cro-Mags", "Nuclear Assault"],
      },
      {
        name: "Metalcore",
        years: "1990s–",
        origin: "United States",
        description: "Heavy metal riffs with hardcore vocals and structure. By far the most commercially successful branch.",
        bands: ["Earth Crisis", "Converge", "Killswitch Engage"],
      },
      {
        name: "Deathcore",
        years: "2000s–",
        origin: "United States",
        description: "Death metal crossed with metalcore, organised entirely around the breakdown.",
        bands: ["Job for a Cowboy", "Whitechapel", "Suicide Silence"],
      },
    ],
    related: [
      "Old-school metalcore", "New-school metalcore", "Melodic metalcore",
      "Progressive metalcore", "Technical metalcore", "Djentcore", "Electronicore",
      "Nu-metalcore", "Symphonic metalcore", "Blackened metalcore", "Christian metalcore",
      "Industrial metalcore", "Sludgecore", "Doomcore", "Metallic crust",
      "Downtempo deathcore", "Beatdown deathcore", "Slam deathcore",
      "Technical deathcore", "Progressive deathcore", "Symphonic deathcore",
      "Blackened deathcore", "MySpace deathcore", "TikTok deathcore", "Nu-deathcore",
    ],
  },
  {
    name: "Fusions",
    summary: "Punk plus something else — usually whatever was playing in the next room.",
    genres: [
      {
        name: "Ska Punk",
        years: "1979–",
        origin: "United Kingdom / United States",
        description: "Jamaican offbeat plugged into punk amplifiers, usually with a horn section in tow.",
        bands: ["The Specials", "Operation Ivy", "Rancid"],
      },
      {
        name: "Psychobilly",
        years: "1980–",
        origin: "United Kingdom",
        description: "Rockabilly played by punks, with an upright bass and a horror-film script.",
        bands: ["The Meteors", "Demented Are Go", "Nekromantix"],
      },
      {
        name: "Celtic Punk",
        years: "1982–",
        origin: "United Kingdom / Ireland",
        description: "Irish folk instruments and drinking songs at punk volume.",
        bands: ["The Pogues", "Dropkick Murphys", "Flogging Molly"],
      },
      {
        name: "Folk Punk",
        years: "1985–",
        origin: "United Kingdom / United States",
        description: "An acoustic guitar, a shouted political lyric, and no PA system required.",
        bands: ["Billy Bragg", "Against Me!", "Defiance, Ohio"],
      },
      {
        name: "Cowpunk",
        years: "1980s–",
        origin: "United States",
        description: "Country songwriting played with punk impatience and no respect for Nashville.",
        bands: ["X", "Jason and the Scorchers", "Rank and File"],
      },
    ],
    related: [
      "2 Tone", "Third-wave ska", "Ska-core", "Reggae punk", "Dub punk", "Ragga punk",
      "Ska metal", "Crack rock steady", "Gypsy punk", "Pirate punk", "Sea shanty punk",
      "Country punk", "Alt-country punk", "Gothabilly", "Punkabilly", "Rockabilly punk",
      "Bluegrass punk", "Appalachian punk", "Acoustic punk", "Surf punk", "Jazz punk",
      "Funk punk", "Rap punk", "Punk rap", "Techno-punk", "Shoegaze punk", "Dream punk",
      "Drone punk", "Psychedelic punk", "Math punk", "Progressive punk",
    ],
  },
  {
    name: "Identity & Politics",
    summary: "Scenes built by people the first wave left at the door.",
    genres: [
      {
        name: "Riot Grrrl",
        years: "1990–",
        origin: "United States",
        description: "Feminist hardcore built on zines and self-run shows, aimed squarely at the boys' club.",
        bands: ["Bikini Kill", "Bratmobile", "Huggy Bear"],
      },
      {
        name: "Queercore",
        years: "1985–",
        origin: "Canada / United States",
        description: "Started as a fake scene in a fake zine, then enough bands turned up to make it real.",
        bands: ["Pansy Division", "Team Dresch", "Limp Wrist"],
      },
      {
        name: "Afro-Punk",
        years: "2003–",
        origin: "United States",
        description: "A documentary that named something that had existed since Bad Brains, and built a festival on it.",
        bands: ["Bad Brains", "Fishbone", "Big Joanie"],
      },
      {
        name: "Taqwacore",
        years: "2003–",
        origin: "United States",
        description: "Muslim punk, invented in a novel before any of the bands in it existed.",
        bands: ["The Kominas", "Secret Trial Five", "Al-Thawra"],
      },
    ],
    related: [
      "Feminist punk", "Girl punk", "Homo-core", "Latino punk", "Chicano punk",
      "Indigenous punk", "Asian punk", "Jewish punk", "Anarcho-feminist punk",
      "Antifa punk", "Political hardcore", "Vegan straight edge", "Gutter punk",
      "Squatter punk",
    ],
  },
  {
    name: "Regional Scenes",
    summary: "The same three chords, rebuilt from scratch in places the record industry never reached.",
    genres: [
      {
        name: "Japanese Hardcore",
        years: "1982–",
        origin: "Japan",
        description: "Hardcore rebuilt from imported records into something louder and more theatrical.",
        bands: ["G.I.S.M.", "The Stalin", "Gauze"],
      },
      {
        name: "Swedish Hardcore",
        years: "1980–",
        origin: "Sweden",
        description: "D-beat taken up by a whole country, with a guitar tone you can identify in one bar.",
        bands: ["Anti Cimex", "Mob 47", "Totalitär"],
      },
      {
        name: "Brazilian Hardcore",
        years: "1982–",
        origin: "Brazil",
        description: "Punk under the last years of a dictatorship, with the politics that implies.",
        bands: ["Olho Seco", "Ratos de Porão", "Cólera"],
      },
    ],
    related: [
      "Punk français", "French hardcore", "Paris hardcore", "Punk basque", "Punk breton",
      "Rock alternatif français", "Punk antifasciste", "Belgian hardcore",
      "German hardcore", "Italian hardcore", "Spanish punk", "Catalan punk",
      "Greek punk", "Balkan punk", "Polish punk", "Russian punk", "Soviet punk",
      "Turkish punk", "Palestinian punk", "Middle Eastern punk", "South African punk",
      "Indonesian punk", "Malaysian punk", "Philippine punk", "Korean hardcore",
      "Australian hardcore", "New Zealand punk", "Mexican punk", "Argentine punk",
      "Colombian punk", "Canadian hardcore", "Finnish hardcore", "Norwegian hardcore",
    ],
  },
  {
    name: "Internet-Era Microgenres",
    summary: "Labels born on forums, blogs and platform tags. Treat them as descriptions, not history.",
    genres: [
      {
        name: "Egg Punk",
        years: "2010s–",
        origin: "United States",
        description: "A joke label that stuck: lo-fi, synth-flecked, deliberately silly garage punk.",
        bands: ["Coneheads", "Erik Nervous", "Lumpy and the Dumpers"],
      },
      {
        name: "Digital Hardcore",
        years: "1994–",
        origin: "Germany",
        description: "Punk politics delivered through breakcore and distorted samplers instead of guitars.",
        bands: ["Atari Teenage Riot", "EC8OR", "Shizuo"],
      },
      {
        name: "Cybergrind",
        years: "1990s–",
        origin: "International",
        description: "Grindcore made on a laptop, usually with a programmed drum machine past any human tempo.",
        bands: ["Agoraphobic Nosebleed", "The Berzerker", "Genghis Tron"],
      },
    ],
    related: [
      "Chain punk", "Pogo punk", "Weird punk", "Devo-core", "Synth punk revival",
      "Blog punk", "Tumblr punk", "Zoomer punk", "Gen Z punk", "TikTok punk",
      "Corecore", "Scenecore", "Internet screamo", "Bedroom screamo",
      "MySpace metalcore", "Visual kei core", "Kawaii metalcore", "Nintendocore",
      "Slacker punk", "Sad punk", "Soft punk", "Cloud punk",
    ],
  },
];
