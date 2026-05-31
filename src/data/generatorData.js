// ── Generator Data ─────────────────────────────────────────────────────────────
// Combinatorial word pools for all generators.

// ── Utility ──────────────────────────────────────────────────────────────────
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
export function pickN(arr, n) {
  const copy = [...arr]; const out = []
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}
function d(n) { return Math.floor(Math.random() * n) + 1 }

// ── SURNAMES by race ──────────────────────────────────────────────────────────
export const SURNAMES = {
  Human: ['Ashford','Blackwell','Coldwater','Draven','Eastwick','Falcrest','Goldhaven','Hawkmoor','Ironside','Jorvane','Kettridge','Larkmere','Mossbridge','Nightholm','Oakenshield','Pinevale','Quickwater','Ravencroft','Stonewall','Thornbury','Underhall','Vanthorpe','Westerfield','Yewdale','Zimrath','Alderidge','Branwick','Cromwell','Dunmore','Evermore','Fairbanks','Greystone','Hartwell','Inglewood','Jasperton','Kindermoor','Lordsgate','Morwick','Norbury','Oakhurst','Pembrooke','Quarrystone','Redmane','Silverbrook','Thistledown','Underwick','Valecroft','Windham','Yorwick','Zephyrvale','Coldmere','Darkwater','Elmsworth','Ferngate','Gildstone','Harrowgate','Ivorymere','Jadewick','Keldmore','Lockwood','Murkmere','Netherton','Overdale','Pinecrest','Quickthorn','Reddmoor','Saltwick','Thatchmore','Understone','Vaultmere','Wyndmere','Yarborough','Zellmore'],
  Elf: ['Aelindra','Brightleaf','Celarandë','Dawnwhisper','Elarindë','Faenorel','Galadhorn','Heleneth','Isilmë','Jadethorne','Keladry','Lorithiel','Miruvantë','Naelindë','Olorindë','Pelarandë','Quelindë','Raelindë','Silverwind','Thalindë','Ulorindë','Vaelindë','Windwhisper','Xaelindë','Yaelindë','Zaelorindë','Aranmirë','Brightveil','Celindë','Dawnmirë','Eloriandë','Faelorindë','Galindë','Helarindë','Ilindë','Jademistveil','Kelorindë','Loramirveil','Mirveil','Naelorindë','Olarindë','Pelorindë','Quelindra','Raelorindë','Silvanë','Thalindra','Ulorindra','Vaelindra','Windveil','Xaelorindë'],
  Dwarf: ['Anvilborn','Boulderback','Copperforge','Deepdelve','Emberheart','Flintrock','Goldvein','Hammerfall','Ironbrew','Jadehammer','Kegbreaker','Loderock','Mouldrock','Northpeak','Oreborn','Pickaxe','Quarrymane','Rockbreaker','Steelcrown','Thornback','Underpeak','Vaultborn','Whetstone','Yorerock','Zenithpeak','Axeborn','Blackforge','Cragborn','Deepvein','Embervein','Forgecrown','Gravelback','Hammerborn','Ironcrown','Jadecrown','Keldvein','Lodeborn','Mountainheart','Northvein','Oreforge','Pickborn','Quartzvein','Rockborn','Steelback','Thornvein','Undervein','Vaultback','Whetborn','Yoreborn','Zenithborn'],
  Halfling: ['Bramblewick','Chestnut','Cloverpatch','Dawnfield','Elderberry','Fernhollow','Goodbarrel','Heatherwick','Ivybrook','Jollymead','Kettlewick','Larkmere','Meadowbrook','Nightwick','Oakpatch','Pebblebrook','Quickfield','Rosebush','Silverleaf','Thistlewick','Underhill','Vines','Willowmere','Yellowmead','Zephyrwick','Applewick','Barleymead','Cloverfield','Dewfield','Elmwick','Fernfield','Greenhill','Hawthorn','Ivyfield','Jollybrook','Kettlefield','Larkfield','Meadowwick','Nightfield','Oakfield','Pebblemead','Quickwick','Rosewick','Silverbrook','Thistlemead','Underbush','Vinefield','Willowwick','Yellowbrook','Zephyrfield'],
  Gnome: ['Boltcrank','Cogsworth','Dweezle','Fizzlebang','Geargrind','Hopplewit','Inkblot','Jinglebell','Kettledrum','Latchwick','Mooglewick','Noodlebrain','Oddwick','Puzzlebox','Quickscrew','Ratchet','Sprocketworth','Tinklewick','Underwick','Vexgear','Widdershins','Xenocog','Yarnsworth','Zipplebolt','Brasswick','Cogwheel','Drivespring','Fizzenwig','Gearborn','Hopplewick','Inkwick','Jinglemere','Kettlewick','Latchmere','Moogleborn','Noodlewick','Oddborn','Puzzlewick','Quickborn','Ratchetwick','Sprocketwick','Tinkleborn','Underborn','Vexwick','Widderswick','Xenowick','Yarnswick','Zipplewick','Brasscog'],
  'Half-Orc': ['Bloodaxe','Cragtooth','Darkmantle','Emberfist','Flintjaw','Grimtusk','Hardback','Ironjaw','Jadeback','Kragfist','Lowbrow','Mossback','Nightsnarl','Orebreaker','Prowlback','Quickfist','Ragthorn','Stoneback','Toughback','Undergrowl','Vaultfist','Wartback','Yellowtooth','Zagback','Ashmantle','Boulderback','Cragback','Darkfist','Embertusk','Flintsnarl','Grimback','Hardtusk','Ironback','Jadebrow','Kragback','Lowfist','Mossfist','Nightback','Orebrow','Prowlfist','Quickback','Ragback','Stonefist','Toughfist','Underback','Vaultback','Wartfist','Yellowback','Zagfist'],
  Tiefling: ['Ashmourne','Brimstone','Cinderfall','Darkflame','Emberveil','Flameheart','Grimoire','Hellscourge','Infernus','Jadescorch','Kindlescorch','Lamentfire','Moonshadow','Nightscorch','Omenveil','Pyreveil','Quickscorch','Ruinfire','Shadowflame','Thornscorch','Umbraveil','Voidflame','Wickedburn','Xenoscorch','Yarnshadow','Zephyrscorch','Ashscorch','Brimscorch','Cinderveil','Darkscorch','Embershadow','Flameshadow','Grimbane','Hellscorch','Infernoscorch','Jadebane','Kindlebane','Lamentscorch','Moonscorch','Nightbane','Omenbane','Pyrebane','Quickbane','Ruinscorch','Shadowscorch','Thornbane','Umbrabane','Voidscorch','Wickedscorch','Xenobane'],
  Dragonborn: ['Aurakesh','Brightscale','Cindermaw','Drakonath','Emberclaw','Flamejaw','Goldscale','Heatscale','Ironscale','Jadeclaw','Keepscale','Lordrake','Moonshard','Nightscale','Orescript','Primescale','Quickshard','Rimescale','Silverscale','Thornscale','Umbrashard','Voidscale','Windscale','Xenoscale','Yarnshard','Zephyrscale','Ashscale','Blazeclaw','Cinderscale','Darkscale','Embershard','Flarescale','Grimscale','Heatclaw','Ironjaw','Jadescale','Keepclaw','Lordscale','Moonscale','Nightclaw','Orescale','Primeclaw','Quickscale','Rimeclaw','Silverclaw','Thornclaw','Umbraclaw','Voidclaw','Windclaw','Xenoclaw'],
  'Half-Elf': ['Amberwood','Brightmere','Cedarveil','Dawnveil','Elmhaven','Forestmere','Goldenmere','Hazelwood','Ivyveil','Jadewood','Kindlewood','Lorewood','Moonveil','Nightwood','Oakveil','Pinewood','Quickwood','Rosewood','Silverwood','Thornwood','Underveil','Valewood','Willowveil','Xenowood','Yarnwood','Zephyrwood','Ashwood','Birchwood','Cedarwood','Darkwood','Elmwood','Fernwood','Greenwood','Hawthorwood','Ivywood','Jadewood','Kindlewood','Lorewood','Mapleveil','Nightveil','Oakwood','Pinewood','Quickveil','Roseveil','Silverveil','Thornveil','Underveil','Valeveil','Willowwood','Xenoveil'],
}

// ── FIRST NAME POOLS (pulls from nameData POOLS, plus additional) ──────────────
// We reference nameData for first names; surnames above are new.
// Combined: ~100 first × ~70 surnames = 7,000 per race per gender × 9 races × 2 genders = ~126,000 unique names
// Add generated syllable combos from nameData: total well over 1 million

// ── TAVERN NAME COMPONENTS ────────────────────────────────────────────────────
export const TAVERN_ADJ = [
  'Rusty','Golden','Silver','Twisted','Broken','Wandering','Stumbling','Laughing','Weeping','Prancing',
  'Dancing','Sleeping','Howling','Roaring','Whispering','Hidden','Forgotten','Lost','Ancient','Cursed',
  'Blessed','Gilded','Tarnished','Muddy','Leaky','Crooked','Crumbling','Weathered','Shadowy','Glowing',
  'Burning','Frozen','Stormy','Misty','Smoky','Dusty','Creaking','Groaning','Swaying','Jolly',
  'Merry','Gloomy','Weary','Hungry','Thirsty','Drunken','Sober','Wild','Tame','Bold',
  'Cowardly','Brave','Fearless','Reckless','Cunning','Sly','Wise','Foolish','Mad','Sane',
  'Blind','One-Eyed','Scarred','Bearded','Hooded','Cloaked','Armored','Barefoot','Crowned','Shackled',
  'Gleaming','Shimmering','Flickering','Fading','Rising','Falling','Soaring','Plunging','Drifting','Sinking',
  'Howling','Growling','Rumbling','Thundering','Crackling','Hissing','Buzzing','Clanking','Rattling','Squeaking',
  'Salted','Spiced','Honeyed','Bitter','Sweet','Sour','Pungent','Fragrant','Rotten','Fresh',
  'Broken','Mended','Shattered','Whole','Half','Lone','Twin','Triple','Last','First',
  'Emerald','Crimson','Azure','Obsidian','Ivory','Amber','Violet','Scarlet','Cobalt','Copper',
  'Iron','Steel','Bronze','Tin','Lead','Onyx','Pearl','Ruby','Sapphire','Jade',
  'Ragged','Tattered','Patched','Mended','Worn','Faded','Frayed','Torn','Ripped','Shredded',
  'Faithful','Treacherous','Loyal','Corrupt','Pious','Wicked','Holy','Profane','Sacred','Damned',
  'Stumbling','Lurching','Swaggering','Strutting','Creeping','Slinking','Prowling','Stalking','Charging','Fleeing',
  'Fat','Lean','Skinny','Stout','Tall','Short','Giant','Tiny','Massive','Dainty',
  'Crooked','Straight','Tangled','Knotted','Twisted','Coiled','Winding','Meandering','Spiraling','Zigzagging',
  'Bloody','Muddy','Dusty','Ashy','Sooty','Frosty','Dewy','Damp','Dry','Wet',
  'Lucky','Unlucky','Cursed','Blessed','Fortunate','Doomed','Fated','Destined','Chosen','Forsaken',
]

export const TAVERN_NOUN = [
  'Flagon','Tankard','Mug','Barrel','Keg','Cask','Anvil','Hammer','Sword','Shield',
  'Axe','Bow','Arrow','Crown','Throne','Coin','Gem','Ruby','Emerald','Sapphire',
  'Skull','Bone','Lantern','Torch','Candle','Key','Lock','Chain','Rope','Boot',
  'Glove','Hat','Cloak','Staff','Wand','Tome','Scroll','Map','Compass','Hourglass',
  'Mirror','Bell','Drum','Lute','Harp','Flask','Vial','Dagger','Spear','Mace',
  'Flail','Crossbow','Quiver','Helm','Gauntlet','Pauldron','Buckler','Greave','Sabaton','Gorget',
  'Chalice','Goblet','Ewer','Platter','Trencher','Ladle','Cleaver','Skillet','Cauldron','Spit',
  'Saddle','Bridle','Stirrup','Spur','Horseshoe','Wagon','Wheel','Pulley','Lever','Gear',
  'Pipe','Bellows','Tongs','Poker','Shovel','Pick','Mattock','Hoe','Scythe','Flail',
  'Feather','Quill','Ink','Parchment','Seal','Stamp','Brand','Sigil','Rune','Glyph',
  'Moon','Sun','Star','Comet','Eclipse','Dawn','Dusk','Twilight','Midnight','Noon',
  'Storm','Thunder','Lightning','Rain','Snow','Ice','Fire','Flame','Ember','Ash',
  'River','Lake','Sea','Ocean','Bay','Cove','Reef','Shore','Beach','Cliff',
  'Mountain','Hill','Valley','Gorge','Canyon','Cave','Tunnel','Bridge','Gate','Tower',
  'Forest','Grove','Thicket','Glade','Meadow','Moor','Fen','Bog','Marsh','Swamp',
  'Road','Path','Trail','Track','Ford','Crossing','Junction','Crossroads','Waypoint','Milestone',
  'Hearth','Chimney','Roof','Cellar','Loft','Stable','Forge','Mill','Well','Fountain',
  'Hound','Cat','Rat','Crow','Raven','Owl','Hawk','Eagle','Swan','Dove',
  'Rose','Thorn','Thistle','Ivy','Vine','Fern','Moss','Oak','Pine','Willow',
  'Fist','Hand','Eye','Ear','Tooth','Claw','Talon','Hoof','Horn','Tail',
]

export const TAVERN_CREATURE = [
  'Dragon','Wyvern','Basilisk','Chimera','Hydra','Manticore','Sphinx','Griffin','Hippogriff','Pegasus',
  'Unicorn','Phoenix','Roc','Kraken','Leviathan','Behemoth','Tarrasque','Beholder','Mindflayer','Lich',
  'Vampire','Werewolf','Troll','Ogre','Giant','Cyclops','Medusa','Harpy','Siren','Banshee',
  'Wraith','Specter','Phantom','Revenant','Ghoul','Wight','Zombie','Skeleton','Golem','Gargoyle',
  'Minotaur','Centaur','Satyr','Faun','Nymph','Dryad','Naiad','Nereid','Sylph','Salamander',
  'Serpent','Viper','Cobra','Python','Wyrm','Lindworm','Amphithere','Couatl','Naga','Yuan-Ti',
  'Dire Wolf','Dire Bear','Dire Boar','Dire Eagle','Dire Rat','Dire Ape','Winter Wolf','Worg','Hellhound','Cerberus',
  'Owlbear','Displacer Beast','Bulette','Remorhaz','Purple Worm','Ankheg','Rust Monster','Gelatinous Cube','Mimic','Darkmantle',
  'Imp','Quasit','Mephit','Pixie','Sprite','Brownie','Boggart','Nixie','Redcap','Kelpie',
  'Elemental','Djinn','Efreeti','Marid','Dao','Slaad','Modron','Inevitable','Archon','Celestial',
]

export const TAVERN_PLACE_SUFFIX = [
  'Inn','Tavern','Pub','Lodge','Alehouse','Brewhouse','Roadhouse','Waystation','Hostel','Rest',
  'Haven','Refuge','Retreat','Hideaway','Den','Haunt','Hole','Hollow','Nook','Corner',
]

export const TAVERN_NAME_SUFFIX = [
  'of Doom','of Destiny','of Fortune','of Misfortune','of Legend','of Lore','of Mystery','of Secrets',
  'of Shadows','of Light','of Darkness','of Hope','of Despair','of Glory','of Ruin','of Old',
]

// ── TOWN NAME COMPONENTS ──────────────────────────────────────────────────────
export const TOWN_PREFIX = [
  'Ash','Black','Bright','Brook','Cedar','Crest','Crown','Dark','Dawn','Dusk',
  'East','Elm','Ever','Fair','Fall','Fern','Fire','Ford','Forest','Frost',
  'Glen','Gold','Gray','Green','Grim','Grove','Hammer','Hard','Haven','Hawk',
  'Heath','High','Hill','Hollow','Hope','Horn','Iron','Ivory','Jade','Keep',
  'Lake','Leaf','Light','Lone','Long','Low','Maple','Marsh','Mead','Mill',
  'Mist','Moon','Moss','Mount','Muddy','New','Night','North','Oak','Old',
  'Over','Pine','Port','Quick','Rain','Red','Ridge','River','Rock','Rose',
  'Royal','Run','Rush','Salt','Sand','Shadow','Silver','Snow','South','Spring',
  'Star','Stone','Storm','Summer','Sun','Swan','Swift','Thorn','Thunder','Timber',
  'Tower','Twin','Under','Vale','Water','West','White','Wild','Wind','Winter',
  'Wolf','Wood','Amber','Blue','Bone','Bright','Calm','Coal','Cold','Copper',
  'Coral','Crimson','Cross','Deep','Dry','Dust','Ember','Empty','End','Far',
  'Fen','Flint','Fog','Gem','Ghost','Glade','Gloom','Granite','Gravel','Hale',
  'Haze','Haze','Hearth','Hedge','Helm','Herb','Heron','Hide','Honey','Hound',
  'Ice','Inland','Isle','Ivy','Jasper','Jet','Keel','Knoll','Lark','Last',
  'Latch','Laurel','Linden','Loch','Loft','Loom','Lost','Lute','Mallow','Manor',
  'Mark','Mere','Mid','Mild','Mire','Moor','Mortar','Narrow','Near','Nettle',
  'Noble','Nook','Norward','Notch','Pale','Peat','Plum','Pond','Pool','Poplar',
  'Quartz','Raven','Reed','Rime','Rowan','Ruin','Rust','Rye','Safe','Sage',
  'Shale','Sharp','Sheer','Silt','Slate','Slow','Soft','Soot','Sorrel','Spell',
  'Spindle','Squall','Stag','Still','Straw','Swift','Tar','Thatch','Thick','Thistle',
  'Tide','Till','Tinder','Toll','Torrent','Trace','Track','Trade','Trestle','Trim',
  'Tumble','Turf','Umber','Upper','Urn','Veil','Verdant','Vicar','Vine','Wallow',
  'Ward','Warm','Wary','Watch','Wax','Weld','Whit','Wilder','Wilt','Wither',
  'Woad','Wren','Yard','Yarrow','Yew','Yonder','Zenith','Zeal',
]

export const TOWN_SUFFIX = [
  'acre','bourne','bridge','brook','burg','burn','bury','by','chester','cliff',
  'combe','cross','dale','dell','den','don','dun','fell','field','ford',
  'forth','gate','glen','grove','hall','ham','haven','heath','hill','hollow',
  'holm','holt','hope','hurst','keep','kirk','land','leigh','lock','mead',
  'mere','mill','moor','mouth','pool','port','ridge','rise','rock','run',
  'shire','side','spring','stead','stoke','stone','stow','thorpe','ton','tree',
  'vale','ward','wick','worth','yard','bay','beach','bend','bluff','bog',
  'bottom','bound','bush','camp','coast','crest','crossing','cut','deep','drift',
  'drop','dune','edge','end','falls','farm','flat','gap','glade','gorge',
  'guard','gulch','gully','harbor','haven','head','hollow','hook','junction','knoll',
  'landing','ledge','light','loch','lodge','marsh','meadow','nest','notch','park',
  'pass','peak','pier','plain','plaza','post','quay','reef','retreat','rise',
  'road','run','settlement','shoal','shore','slope','sound','spur','station','strand',
  'summit','tor','trace','trail','trench','turn','vale','view','village','water',
  'way','weald','well','wharf','wood','works',
]

// ── NPC COMPONENTS ────────────────────────────────────────────────────────────
export const NPC_RACES = ['Human','Elf','Half-Elf','Dwarf','Halfling','Gnome','Half-Orc','Tiefling','Dragonborn']
export const NPC_CLASSES = ['Fighter','Wizard','Rogue','Cleric','Ranger','Paladin','Bard','Druid','Barbarian','Monk','Sorcerer','Warlock','Merchant','Guard','Noble','Farmer','Innkeeper','Blacksmith','Scholar','Sailor','Healer','Scribe','Hunter','Herbalist','Beggar','Thief','Spy','Assassin','Diplomat','Priest']
export const NPC_AGES = ['young','middle-aged','aging','elderly','ancient-looking']
export const NPC_BUILDS = ['slight','lean','wiry','average','stocky','heavyset','imposing','gaunt','broad-shouldered','hunched']
export const NPC_EYES = ['sharp grey','warm brown','pale blue','deep green','amber','mismatched','cloudy white','jet black','golden','violet']
export const NPC_HAIR = ['cropped black','long silver','wild red','neat brown','shaved','braided blonde','streaked grey','matted dark','flowing auburn','close-cropped white']
export const NPC_FEATURES = [
  'a prominent scar across the cheek','a missing finger','an intricate tattoo on the neck','a glass eye',
  'unusually long fingers','a permanent squint','a gap-toothed smile','burn marks on one arm',
  'an elaborate signet ring','a nervous tic','calloused hands','ink-stained fingers',
  'a broken nose that healed crooked','a birthmark shaped like a crescent','filed teeth',
  'elaborate braids adorned with beads','a brand on the wrist','sun-darkened skin','pale as chalk',
  'laugh lines deeply etched','hollow cheeks','a perpetual five-o-clock shadow','silver-streaked temples',
]
export const NPC_PERSONALITY = [
  'abrasive but deeply loyal','cheerful to a fault','brooding and introspective','suspiciously generous',
  'fiercely protective of the weak','quick to laugh, slow to forgive','blunt to the point of rudeness',
  'endlessly curious about everything','pathologically honest','charmingly deceitful',
  'calm under pressure, anxious at rest','loud and boisterous','soft-spoken but commanding',
  'perpetually exhausted yet relentless','bitter about past failures','infectiously optimistic',
  'deeply superstitious','coldly pragmatic','surprisingly tender-hearted','consumed by ambition',
]
export const NPC_MOTIVATION = [
  'seeking revenge against a noble house','desperately trying to repay an old debt',
  'searching for a long-lost sibling','protecting a secret that could topple a government',
  'trying to earn enough gold to retire','hunting a monster that killed their family',
  'collecting rare knowledge at any cost','building toward an act of grand redemption',
  'working undercover for a hidden faction','escaping a past identity they cannot shake',
  'trying to resurrect someone they lost','seeking a cure for a creeping curse',
  'amassing power quietly and patiently','fulfilling an oath sworn to a dying friend',
  'trying to prevent a prophecy from coming true','simply trying to survive another week',
]
export const NPC_SECRET = [
  'secretly works for the thieves guild','is a former assassin living under a false name',
  'owes a life debt to a demon','is being blackmailed by someone in power',
  'murdered someone years ago and carries the guilt','is a spy for a rival faction',
  'knows the location of a legendary treasure','harbors romantic feelings for someone forbidden',
  'is far wealthier than they appear','is dying of an incurable illness',
  'was once a war criminal under a different name','secretly practices forbidden magic',
  'is the legitimate heir to a noble title they abandoned','has betrayed the party\'s employer already',
  'knows the true identity of a major local figure','was involved in an atrocity they helped cover up',
]
export const NPC_QUIRK = [
  'always hums quietly when nervous','never sits with their back to the door',
  'refers to themselves in the third person when angry','obsessively counts coins when thinking',
  'cannot make direct eye contact with anyone','laughs at entirely wrong moments',
  'always agrees first, then qualifies everything','touches their scar when lying',
  'keeps every promise to a fault, even harmful ones','always has food hidden somewhere on them',
  'speaks in proverbs no one has heard before','writes everything important in a tiny journal',
  'refuses to sleep anywhere without first checking for exits','names every animal they encounter',
  'fidgets with a coin that has a hole through it','always corrects mispronunciations',
]

// ── QUEST HOOKS ───────────────────────────────────────────────────────────────
const QUEST_LOCATIONS = ['the Ashwood Forest','the Sunken City of Vaal','Thornwall Keep','the Ironmarsh','the Shivering Pass','the Old Pilgrim Road','Coldwater Bay','the Ruins of Halkmere','the Crimson Caverns','the Dwarven Underhalls','the Wandering Isle','the Bleached Desert','the Thornback Mountains','the Whispering Bog','the Last Lighthouse']
const QUEST_CLIENTS = ['a desperate merchant','a grieving widow','the town mayor','a shady guild contact','a dying veteran','a mysterious masked figure','a panicked innkeeper','a young noble','a grizzled ranger','an eccentric wizard','a village elder','a tearful child','a disgraced knight','a cryptic oracle','a wealthy collector']
const QUEST_MCGUFFINS = ['a stolen amulet of great power','a locked chest no one can open','a missing family heirloom','a ledger full of incriminating names','an ancient map fragment','a sealed letter addressed to a dead king','a rare medicinal herb','the deed to disputed land','a weapon of legendary provenance','a tome bound in unknown leather','a gemstone that glows at night','a child kidnapped before dawn','a shipment of arms','a sealed urn containing unknown contents','a mirror that shows the past']
const QUEST_VILLAINS = ['a corrupt guard captain','a merchant with ties to the underworld','a cult operating in plain sight','a rogue mage seeking power','a vengeful noble','a monster with unsettling intelligence','a shapeshifter who has replaced someone important','a bandit lord with a surprising code of honor','a spirit bound to the land by injustice','a former hero who crossed a terrible line','a criminal syndicate tightening its grip','a priest whose faith has curdled into fanaticism']
const QUEST_TWISTS = ['the client is not who they say they are','the target is innocent of what they\'re accused of','a third party is manipulating both sides','the MacGuffin is far more dangerous than described','the villain was once a hero','someone in the party has been compromised','the real threat is something else entirely','completing the quest creates a worse problem','the reward comes with strings attached','the quest has already been attempted — and failed']

export const QUEST_THEMES = {
  Escort: {
    label: 'Escort',
    templates: [
      () => `${pick(QUEST_CLIENTS)} needs safe passage from ${pick(QUEST_LOCATIONS)} to ${pick(QUEST_LOCATIONS)}. ${pick(QUEST_VILLAINS)} will stop at nothing to prevent their arrival. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `A convoy carrying ${pick(QUEST_MCGUFFINS)} must reach ${pick(QUEST_LOCATIONS)} before the new moon. ${pick(QUEST_VILLAINS)} has already sent scouts ahead.`,
      () => `${pick(QUEST_CLIENTS)} is the only witness to a terrible crime. Escort them safely to the magistrate — ${pick(QUEST_VILLAINS)} wants them silenced.`,
      () => `Guide a group of refugees through ${pick(QUEST_LOCATIONS)} while ${pick(QUEST_VILLAINS)} hunts them from behind. The reason for their flight is more complicated than stated.`,
      () => `${pick(QUEST_CLIENTS)} must attend a summit at ${pick(QUEST_LOCATIONS)}, but the road passes through territory controlled by ${pick(QUEST_VILLAINS)}. Twist: ${pick(QUEST_TWISTS)}.`,
    ],
  },
  Retrieval: {
    label: 'Retrieval',
    templates: [
      () => `${pick(QUEST_CLIENTS)} has lost ${pick(QUEST_MCGUFFINS)} somewhere in ${pick(QUEST_LOCATIONS)}. ${pick(QUEST_VILLAINS)} got there first. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `Recover ${pick(QUEST_MCGUFFINS)} from ${pick(QUEST_LOCATIONS)} before it falls into the hands of ${pick(QUEST_VILLAINS)}.`,
      () => `${pick(QUEST_MCGUFFINS)} was stolen and sold to ${pick(QUEST_VILLAINS)}, who has taken it to ${pick(QUEST_LOCATIONS)}. Retrieve it — quietly.`,
      () => `An expedition sent to ${pick(QUEST_LOCATIONS)} to recover ${pick(QUEST_MCGUFFINS)} has gone silent. Find the item — and if possible, the team.`,
      () => `${pick(QUEST_CLIENTS)} will pay handsomely for ${pick(QUEST_MCGUFFINS)} currently held in ${pick(QUEST_LOCATIONS)}. They claim the previous owner deserved to lose it. Twist: ${pick(QUEST_TWISTS)}.`,
    ],
  },
  Assassination: {
    label: 'Assassination',
    templates: [
      () => `${pick(QUEST_CLIENTS)} offers a life-changing sum to eliminate ${pick(QUEST_VILLAINS)} before they can act. The target is currently hiding in ${pick(QUEST_LOCATIONS)}. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_VILLAINS)} has been untouchable — until now. A window of vulnerability opens at ${pick(QUEST_LOCATIONS)}, but the clock is ticking.`,
      () => `The contract is simple: reach ${pick(QUEST_LOCATIONS)}, end ${pick(QUEST_VILLAINS)}. The complication is that the target expects someone is coming.`,
      () => `${pick(QUEST_CLIENTS)} claims that eliminating ${pick(QUEST_VILLAINS)} will save hundreds of lives. The moral calculus seems straightforward — until it isn't. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `A political assassination at ${pick(QUEST_LOCATIONS)} — frame it as an accident. ${pick(QUEST_VILLAINS)} must not appear to have been targeted. Twist: ${pick(QUEST_TWISTS)}.`,
    ],
  },
  Exploration: {
    label: 'Exploration',
    templates: [
      () => `${pick(QUEST_CLIENTS)} funds an expedition into ${pick(QUEST_LOCATIONS)} to chart what lies beyond the last known map. What they find there defies expectation.`,
      () => `Strange lights have been seen coming from ${pick(QUEST_LOCATIONS)}. No one who has gone to investigate has returned. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `A newly discovered entrance to ${pick(QUEST_LOCATIONS)} has opened up. ${pick(QUEST_CLIENTS)} wants a full survey — and retrieval of anything valuable.`,
      () => `Rumors place the legendary ${pick(QUEST_MCGUFFINS)} somewhere within ${pick(QUEST_LOCATIONS)}, a place no one has fully mapped. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_CLIENTS)} needs someone to verify a claim: that ${pick(QUEST_LOCATIONS)} contains evidence of a long-denied historical event.`,
    ],
  },
  Mystery: {
    label: 'Mystery Investigation',
    templates: [
      () => `People in ${pick(QUEST_LOCATIONS)} are disappearing. ${pick(QUEST_CLIENTS)} begs for answers. The only lead is ${pick(QUEST_MCGUFFINS)} found near the last known location. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_CLIENTS)} was found dead with ${pick(QUEST_MCGUFFINS)} clutched in their hand and a name scratched into the floor. What happened?`,
      () => `Something in ${pick(QUEST_LOCATIONS)} is not what it appears. ${pick(QUEST_CLIENTS)} has noticed the signs. ${pick(QUEST_VILLAINS)} does not want the truth uncovered.`,
      () => `A series of identical crimes across the region all point back to ${pick(QUEST_LOCATIONS)}. ${pick(QUEST_VILLAINS)} is involved — but how? Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_MCGUFFINS)} has appeared in three different places simultaneously. Someone is lying. ${pick(QUEST_CLIENTS)} needs the truth before it destroys them.`,
    ],
  },
  Heist: {
    label: 'Heist',
    templates: [
      () => `${pick(QUEST_CLIENTS)} needs ${pick(QUEST_MCGUFFINS)} taken from ${pick(QUEST_VILLAINS)} — without anyone knowing it was stolen. The target is located in ${pick(QUEST_LOCATIONS)}.`,
      () => `Break into ${pick(QUEST_LOCATIONS)}, retrieve ${pick(QUEST_MCGUFFINS)}, leave no trace. ${pick(QUEST_VILLAINS)} has it and doesn't know what they have. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_CLIENTS)} has the plan. They just need people who can get in and out of ${pick(QUEST_LOCATIONS)} without getting killed. ${pick(QUEST_VILLAINS)} patrols heavily.`,
      () => `The prize is ${pick(QUEST_MCGUFFINS)}, the location is ${pick(QUEST_LOCATIONS)}, and the complication is that ${pick(QUEST_VILLAINS)} has already thought of every obvious approach. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `What looks like a straightforward theft from ${pick(QUEST_LOCATIONS)} becomes complicated when it becomes clear that ${pick(QUEST_VILLAINS)} set the whole thing up as a trap.`,
    ],
  },
  Rescue: {
    label: 'Rescue',
    templates: [
      () => `${pick(QUEST_CLIENTS)} has been taken to ${pick(QUEST_LOCATIONS)} by ${pick(QUEST_VILLAINS)}. They are being held as leverage. Rescue them before the deadline passes.`,
      () => `A group of prisoners held by ${pick(QUEST_VILLAINS)} in ${pick(QUEST_LOCATIONS)} includes someone the party can't afford to lose. A full assault would get them all killed. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_CLIENTS)} sends word: someone dear to them is captive in ${pick(QUEST_LOCATIONS)}, and ${pick(QUEST_VILLAINS)} has made demands that cannot be met.`,
      () => `Rescue the survivors of an expedition lost in ${pick(QUEST_LOCATIONS)}. ${pick(QUEST_VILLAINS)} controls the only known route in. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_CLIENTS)} needs someone retrieved from ${pick(QUEST_LOCATIONS)} — but the person being rescued may not want to leave.`,
    ],
  },
  'Boss Battle': {
    label: 'Boss Battle',
    templates: [
      () => `${pick(QUEST_VILLAINS)} has been consolidating power for months. Their stronghold is in ${pick(QUEST_LOCATIONS)}. ${pick(QUEST_CLIENTS)} is funding the assault — but intel suggests the target is more powerful than reported.`,
      () => `The region won't be safe until ${pick(QUEST_VILLAINS)} is stopped. They've retreated to ${pick(QUEST_LOCATIONS)} and are preparing for something terrible. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `Three previous attempts to stop ${pick(QUEST_VILLAINS)} at ${pick(QUEST_LOCATIONS)} have failed. ${pick(QUEST_CLIENTS)} believes the party has what those groups lacked.`,
      () => `${pick(QUEST_VILLAINS)} holds ${pick(QUEST_MCGUFFINS)} and will use it at dawn. The only way to stop them is a direct assault on ${pick(QUEST_LOCATIONS)}. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_CLIENTS)} reveals that ${pick(QUEST_VILLAINS)} is not acting alone — defeating them will only be the beginning.`,
    ],
  },
  Survival: {
    label: 'Survival',
    templates: [
      () => `Stranded in ${pick(QUEST_LOCATIONS)} with dwindling supplies, the party must find a way out before ${pick(QUEST_VILLAINS)} closes the last escape route.`,
      () => `A catastrophic event traps the party and ${pick(QUEST_CLIENTS)} in ${pick(QUEST_LOCATIONS)}. They have enough supplies for three days. Help is not coming. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `${pick(QUEST_VILLAINS)} has been hunting the party through ${pick(QUEST_LOCATIONS)}. Resources are gone. Escape is the only goal.`,
      () => `The party must survive a full night in ${pick(QUEST_LOCATIONS)}, defending ${pick(QUEST_CLIENTS)} against increasingly dangerous waves sent by ${pick(QUEST_VILLAINS)}.`,
      () => `Cut off from civilization in ${pick(QUEST_LOCATIONS)}, the party must locate ${pick(QUEST_MCGUFFINS)} to signal for rescue — while ${pick(QUEST_VILLAINS)} hunts them. Twist: ${pick(QUEST_TWISTS)}.`,
    ],
  },
  'Time-Sensitive': {
    label: 'Time-Sensitive',
    templates: [
      () => `${pick(QUEST_MCGUFFINS)} must reach ${pick(QUEST_LOCATIONS)} before dawn, or ${pick(QUEST_CLIENTS)} dies. ${pick(QUEST_VILLAINS)} knows the route and has a head start.`,
      () => `The ritual begins at midnight. Only retrieving ${pick(QUEST_MCGUFFINS)} from ${pick(QUEST_LOCATIONS)} can stop it. ${pick(QUEST_VILLAINS)} will try to delay the party at every step.`,
      () => `${pick(QUEST_CLIENTS)} has hours, not days. ${pick(QUEST_MCGUFFINS)} is the only cure, it's in ${pick(QUEST_LOCATIONS)}, and ${pick(QUEST_VILLAINS)} holds it. Twist: ${pick(QUEST_TWISTS)}.`,
      () => `A timed device hidden somewhere in ${pick(QUEST_LOCATIONS)} will detonate unless disarmed. ${pick(QUEST_CLIENTS)} knows how — but is being held by ${pick(QUEST_VILLAINS)}.`,
      () => `The trade deal between two factions falls apart in three hours unless ${pick(QUEST_MCGUFFINS)} is returned to ${pick(QUEST_CLIENTS)}. ${pick(QUEST_VILLAINS)} stole it deliberately. Twist: ${pick(QUEST_TWISTS)}.`,
    ],
  },
}

// ── GENERATORS ────────────────────────────────────────────────────────────────

export function generateTavernName() {
  const format = d(5)
  if (format <= 2) return `The ${pick(TAVERN_ADJ)} ${pick(TAVERN_NOUN)}`
  if (format === 3) return `The ${pick(TAVERN_ADJ)} ${pick(TAVERN_CREATURE)}`
  if (format === 4) return `The ${pick(TAVERN_NOUN)} and ${pick(TAVERN_NOUN)}`
  return `The ${pick(TAVERN_ADJ)} ${pick(TAVERN_NOUN)} ${pick(TAVERN_NAME_SUFFIX)}`
}

export function generateTownName() {
  const format = d(3)
  if (format === 1) return pick(TOWN_PREFIX) + pick(TOWN_SUFFIX)
  if (format === 2) return pick(TOWN_PREFIX) + pick(TOWN_PREFIX).toLowerCase() + pick(TOWN_SUFFIX)
  return pick(TOWN_PREFIX) + '-' + pick(TOWN_PREFIX).toLowerCase()
}

export function generateNPC() {
  const race = pick(NPC_RACES)
  const surname = pick(SURNAMES[race] || SURNAMES.Human)
  const occ = pick(NPC_CLASSES)
  const age = pick(NPC_AGES)
  const build = pick(NPC_BUILDS)

  // Get a first name from nameData-style generation
  const firstNames = {
    Human: ['Aldric','Bram','Cassius','Daven','Elara','Finn','Gwen','Harwick','Isolde','Joren','Kira','Lian','Mara','Nolan','Orla','Perin','Quinn','Reva','Soren','Talia','Urien','Vessa','Wren','Xander','Yara','Zane','Aelith','Bertram','Calla','Dorin','Evie','Falka','Garrett','Henna','Idris','Juliet','Kael','Lysa','Moric','Niamh','Oswin','Petra','Rook','Sienna','Tobias','Una','Vance','Willa','Xyla','Yoric'],
    Elf: ['Aelindra','Caladwen','Elarion','Faelindë','Galadmir','Helaneth','Isilmë','Kaelindra','Lyrindë','Myraell','Naelindir','Olorindë','Pelaneth','Quelindra','Raelindë','Silvanë','Thalindra','Ulorindë','Vaelindra','Windmirë'],
    'Half-Elf': ['Aiden','Brynn','Caela','Doran','Elya','Fayne','Gareth','Halia','Idris','Jaela','Kael','Lyra','Mira','Nolan','Oryn','Petra','Quinn','Reva','Soren','Talia'],
    Dwarf: ['Baldur','Brundar','Daina','Durna','Grimhild','Gundra','Halda','Kelda','Morda','Norna','Thordis','Ulfhild','Urgrim','Valdis','Vorra'],
    Halfling: ['Alton','Beau','Cade','Corrin','Eldon','Garret','Lyle','Merry','Osborn','Perrin','Reed','Rolo','Tuck','Welby','Willo'],
    Gnome: ['Bix','Cogsworth','Dweezle','Fizwik','Glim','Hopwick','Jinx','Kettledrum','Litz','Moog','Nix','Oddwick','Pip','Quill','Rix','Sprocket','Tinker','Vex','Wex','Zix'],
    'Half-Orc': ['Bragg','Crusk','Drog','Forge','Grull','Harsk','Irga','Jark','Krusk','Lurga','Mogra','Naerg','Orgus','Prask','Rusk'],
    Tiefling: ['Akmenos','Amnizu','Barakas','Carrion','Damaia','Ekemon','Foltus','Greigur','Haures','Iados','Kallista','Leucis','Makaria','Nemeia','Orianna'],
    Dragonborn: ['Arjhan','Balasar','Bharash','Donaar','Ghesh','Heskan','Kriv','Medrash','Mehen','Nadarr','Pandjed','Patrin','Rhogar','Shamash','Shedinn'],
  }

  const firstName = pick(firstNames[race] || firstNames.Human)

  return {
    name: `${firstName} ${surname}`,
    race,
    role: occ,
    disposition: pick(['Friendly','Neutral','Neutral','Neutral','Hostile']),
    alive: true,
    notes: (() => {
      const feat = pick(NPC_FEATURES); const personality = pick(NPC_PERSONALITY)
      return `A ${age} ${build} ${race.toLowerCase()}. ${feat.charAt(0).toUpperCase() + feat.slice(1)}. ${personality.charAt(0).toUpperCase() + personality.slice(1)}. Motivation: ${pick(NPC_MOTIVATION)}. Secret: ${pick(NPC_SECRET)}. Quirk: ${pick(NPC_QUIRK)}.`
    })(),
  }
}

export function generateQuest(theme) {
  const themeData = QUEST_THEMES[theme] || pick(Object.values(QUEST_THEMES))
  const template = pick(themeData.templates)
  return {
    name: `${themeData.label}: ${pick(['Urgent Request','A Desperate Plea','Strange Tidings','The Job','An Offer','A Warning','The Contract','Unexpected News'])}`,
    status: 'Active',
    priority: pick(['High','High','Medium','Medium','Low','Critical']),
    giver: pick(QUEST_CLIENTS),
    reward: pick(['500 gp','750 gp','1,000 gp','1,500 gp','2,000 gp','A rare magic item','Favors from a guild','Land deed','Information','Safe passage']),
    notes: template(),
  }
}

// ── Combinatorial counts (for display) ───────────────────────────────────────
export const GENERATOR_STATS = {
  names: (() => {
    // ~50 first × 70 surnames × 9 races × 2 genders, plus syllabic combos
    const syllabicCombos = 200 * 9 * 2  // avg 200 combos per race/gender from nameData
    const fullNameCombos = 50 * 70 * 9 * 2
    return (syllabicCombos + fullNameCombos).toLocaleString() + '+'
  })(),
  taverns: (() => {
    const f1 = TAVERN_ADJ.length * TAVERN_NOUN.length
    const f2 = TAVERN_ADJ.length * TAVERN_CREATURE.length
    const f3 = TAVERN_NOUN.length * TAVERN_NOUN.length
    const f4 = TAVERN_ADJ.length * TAVERN_NOUN.length * TAVERN_NAME_SUFFIX.length
    return (f1 + f2 + f3 + f4).toLocaleString() + '+'
  })(),
  towns: (TOWN_PREFIX.length * TOWN_SUFFIX.length + TOWN_PREFIX.length * TOWN_PREFIX.length * TOWN_SUFFIX.length).toLocaleString() + '+',
  npcs: 'Billions',
  quests: (Object.keys(QUEST_THEMES).length * 5 * 15 * 15 * 12).toLocaleString() + '+',
}
