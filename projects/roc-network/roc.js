const mapBounds = {
  west: -10.476361,
  east: 1.765083,
  north: 60.846142,
  south: 49.1626,
  width: 628.09174,
  height: 1051.4788
};

const mapOverlayOffset = {
  x: 0,
  y: 32
};

// Sectors used by the UKWMO from the 1973 reorganisation onward.
// Each Group Control belongs to exactly one Sector. Northern Ireland
// (Group 31) was operationally separate but is included for completeness.
const sectors = [
  { id: "metropolitan", name: "Metropolitan Sector" },
  { id: "midland",      name: "Midland Sector" },
  { id: "southern",     name: "Southern Sector" },
  { id: "western",      name: "Western Sector" },
  { id: "eastern",      name: "Eastern Sector" },
  { id: "caledonian",   name: "Caledonian Sector" },
  { id: "ni",           name: "Northern Ireland" }
];

const groupControls = [
  { id: "g01", group: "1",  name: "Maidstone Group Control",   place: "Maidstone",            lat: 51.2726, lon:  0.5290, sector: "metropolitan" },
  { id: "g02", group: "2",  name: "Horsham Group Control",     place: "Horsham",              lat: 51.0629, lon: -0.3259, sector: "metropolitan" },
  { id: "g03", group: "3",  name: "Oxford Group Control",      place: "Oxford",               lat: 51.7520, lon: -1.2577, sector: "metropolitan" },
  { id: "g04", group: "4",  name: "Colchester Group Control",  place: "Colchester",           lat: 51.8892, lon:  0.9042, sector: "metropolitan" },
  { id: "g05", group: "5",  name: "Watford Group Control",     place: "Watford",              lat: 51.6565, lon: -0.3903, sector: "metropolitan" },
  { id: "g06", group: "6",  name: "Norwich Group Control",     place: "Norwich",              lat: 52.5650, lon:  1.1830, sector: "midland" },
  { id: "g07", group: "7",  name: "Bedford Group Control",     place: "Bedford",              lat: 52.1364, lon: -0.4675, sector: "midland" },
  { id: "g08", group: "8",  name: "Coventry Group Control",    place: "Coventry",             lat: 52.4068, lon: -1.5197, sector: "midland" },
  { id: "g09", group: "9",  name: "Yeovil Group Control",      place: "Yeovil",               lat: 50.9421, lon: -2.6333, sector: "southern" },
  { id: "g10", group: "10", name: "Exeter Group Control",      place: "Exeter",               lat: 50.7184, lon: -3.5339, sector: "southern" },
  { id: "g11", group: "11", name: "Truro Group Control",       place: "Truro",                lat: 50.2632, lon: -5.0510, sector: "southern" },
  { id: "g12", group: "12", name: "Bristol Group Control",     place: "Bristol",              lat: 51.4545, lon: -2.5879, sector: "southern" },
  { id: "g13", group: "13", name: "South Wales Group Control", place: "Carmarthen",           lat: 51.8576, lon: -4.3121, sector: "southern" },
  { id: "g14", group: "14", name: "Winchester Group Control",  place: "Winchester",           lat: 51.0629, lon: -1.3167, sector: "southern" },
  { id: "g15", group: "15", name: "Lincoln Group Control",     place: "Lincoln",              lat: 53.2307, lon: -0.5406, sector: "eastern" },
  { id: "g16", group: "16", name: "Shrewsbury Group Control",  place: "Shrewsbury",           lat: 52.7073, lon: -2.7553, sector: "midland" },
  { id: "g17", group: "17", name: "North Wales Group Control", place: "Wrexham / Borras",     lat: 53.0460, lon: -2.9916, sector: "western" },
  { id: "g18", group: "18", name: "Leeds Group Control",       place: "Leeds",                lat: 53.8008, lon: -1.5491, sector: "eastern" },
  { id: "g20", group: "20", name: "York Group Control",        place: "Acomb, York",          lat: 53.9590, lon: -1.0815, sector: "eastern" },
  { id: "g21", group: "21", name: "Preston Group Control",     place: "Preston / Goosnargh",  lat: 53.7632, lon: -2.7031, sector: "western" },
  { id: "g22", group: "22", name: "Carlisle Group Control",    place: "Carlisle",             lat: 54.8925, lon: -2.9329, sector: "western" },
  { id: "g23", group: "23", name: "Durham Group Control",      place: "Durham",               lat: 54.7753, lon: -1.5849, sector: "eastern" },
  { id: "g24", group: "24", name: "Edinburgh Group Control",   place: "Edinburgh / Lothian",  lat: 55.9000, lon: -3.2000, sector: "caledonian" },
  { id: "g25", group: "25", name: "Ayr Group Control",         place: "Ayr / Prestwick",      lat: 55.4586, lon: -4.6292, sector: "caledonian" },
  { id: "g27", group: "27", name: "Oban Group Control",        place: "North Connel",         lat: 56.4510, lon: -5.3910, sector: "caledonian" },
  { id: "g28", group: "28", name: "Dundee Group Control",      place: "Dundee",               lat: 56.4620, lon: -2.9707, sector: "caledonian" },
  { id: "g29", group: "29", name: "Aberdeen Group Control",    place: "Northfield, Aberdeen", lat: 57.1497, lon: -2.0943, sector: "caledonian" },
  { id: "g30", group: "30", name: "Inverness Group Control",   place: "Inverness",            lat: 57.4778, lon: -4.2247, sector: "caledonian" },
  { id: "g31", group: "31", name: "Belfast Group Control",     place: "Belfast / County Down",lat: 54.4500, lon: -5.9500, sector: "ni" }
];

// Cluster topology for all UKWMO groups. Group 20 (York) is fully documented
// from the March 1989 ringbell.co.uk map (https://www.ringbell.co.uk/ukwmo/Page221.htm).
// All other groups carry representative 3-post clusters reflecting the
// standard ROC reporting topology: each cluster has one VHF-radio master post
// and two or three satellite posts on landlines.
const clusters = [
  // Group 1 — Maidstone (Metropolitan Sector)
  { id: "c01-dover",       group: "1",  masterId: "p-dover",       memberIds: ["p-dover",       "p-folkestone",   "p-deal"] },
  { id: "c01-ashford",     group: "1",  masterId: "p-ashford",     memberIds: ["p-ashford",     "p-tenterden",    "p-rye"] },
  { id: "c01-canterbury",  group: "1",  masterId: "p-canterbury",  memberIds: ["p-canterbury",  "p-faversham",    "p-margate"] },
  { id: "c01-tonbridge",   group: "1",  masterId: "p-sevenoaks",   memberIds: ["p-sevenoaks",   "p-tonbridge",    "p-cranbrook"] },
  // Group 2 — Horsham (Metropolitan Sector)
  { id: "c02-chichester",  group: "2",  masterId: "p-chichester",  memberIds: ["p-chichester",  "p-arundel",      "p-petworth"] },
  { id: "c02-crawley",     group: "2",  masterId: "p-crawley",     memberIds: ["p-crawley",     "p-east-grinstead","p-haywards-heath"] },
  { id: "c02-lewes",       group: "2",  masterId: "p-lewes",       memberIds: ["p-lewes",       "p-billingshurst","p-storrington"] },
  // Group 3 — Oxford (Metropolitan Sector)
  { id: "c03-faringdon",   group: "3",  masterId: "p-faringdon",   memberIds: ["p-faringdon",   "p-wantage",      "p-witney"] },
  { id: "c03-bicester",    group: "3",  masterId: "p-bicester",    memberIds: ["p-bicester",    "p-chipping-norton","p-aylesbury"] },
  { id: "c03-wallingford", group: "3",  masterId: "p-wallingford", memberIds: ["p-wallingford", "p-thame",        "p-high-wycombe"] },
  // Group 4 — Colchester (Metropolitan Sector)
  { id: "c04-ipswich",     group: "4",  masterId: "p-ipswich",     memberIds: ["p-ipswich",     "p-harwich",      "p-aldeburgh"] },
  { id: "c04-halstead",    group: "4",  masterId: "p-halstead",    memberIds: ["p-halstead",    "p-sudbury",      "p-haverhill"] },
  { id: "c04-braintree",   group: "4",  masterId: "p-braintree",   memberIds: ["p-braintree",   "p-saffron-walden","p-witham"] },
  // Group 5 — Watford (Metropolitan Sector)
  { id: "c05-st-albans",   group: "5",  masterId: "p-st-albans",   memberIds: ["p-st-albans",   "p-hemel-hempstead","p-hatfield"] },
  { id: "c05-barnet",      group: "5",  masterId: "p-barnet",      memberIds: ["p-barnet",      "p-potters-bar",  "p-bowes-park"] },
  { id: "c05-ware",        group: "5",  masterId: "p-ware",        memberIds: ["p-ware",        "p-hertford",     "p-northolt"] },
  // Group 6 — Norwich (Midland Sector)
  { id: "c06-cromer",      group: "6",  masterId: "p-cromer",      memberIds: ["p-cromer",      "p-north-walsham","p-aylsham"] },
  { id: "c06-fakenham",    group: "6",  masterId: "p-fakenham",    memberIds: ["p-fakenham",    "p-swaffham",     "p-downham-market"] },
  { id: "c06-attleborough",group: "6",  masterId: "p-attleborough",memberIds: ["p-attleborough","p-new-buckenham","p-beccles"] },
  // Group 7 — Bedford (Midland Sector)
  { id: "c07-northampton", group: "7",  masterId: "p-northampton", memberIds: ["p-northampton", "p-wellingborough","p-olney"] },
  { id: "c07-huntingdon",  group: "7",  masterId: "p-huntingdon",  memberIds: ["p-huntingdon",  "p-st-neots",     "p-oundle"] },
  { id: "c07-luton",       group: "7",  masterId: "p-luton",       memberIds: ["p-luton",       "p-ampthill",     "p-potton"] },
  // Group 8 — Coventry (Midland Sector)
  { id: "c08-nuneaton",    group: "8",  masterId: "p-nuneaton",    memberIds: ["p-nuneaton",    "p-atherstone",   "p-meriden"] },
  { id: "c08-rugby",       group: "8",  masterId: "p-rugby",       memberIds: ["p-rugby",       "p-daventry",     "p-southam"] },
  { id: "c08-stratford",   group: "8",  masterId: "p-stratford",   memberIds: ["p-stratford",   "p-leamington",   "p-kenilworth"] },
  // Group 9 — Yeovil (Southern Sector)
  { id: "c09-dorchester",  group: "9",  masterId: "p-dorchester",  memberIds: ["p-dorchester",  "p-bridport",     "p-weymouth"] },
  { id: "c09-wareham",     group: "9",  masterId: "p-wareham",     memberIds: ["p-wareham",     "p-swanage",      "p-wimborne"] },
  { id: "c09-sherborne",   group: "9",  masterId: "p-sherborne",   memberIds: ["p-sherborne",   "p-wincanton",    "p-shaftesbury"] },
  // Group 10 — Exeter (Southern Sector)
  { id: "c10-barnstaple",  group: "10", masterId: "p-barnstaple",  memberIds: ["p-barnstaple",  "p-bideford",     "p-south-molton"] },
  { id: "c10-tavistock",   group: "10", masterId: "p-tavistock",   memberIds: ["p-tavistock",   "p-okehampton",   "p-crediton"] },
  { id: "c10-totnes",      group: "10", masterId: "p-totnes",      memberIds: ["p-totnes",      "p-newton-abbot", "p-honiton"] },
  // Group 11 — Truro (Southern Sector)
  { id: "c11-penzance",    group: "11", masterId: "p-penzance",    memberIds: ["p-penzance",    "p-st-just",      "p-helston"] },
  { id: "c11-camborne",    group: "11", masterId: "p-camborne",    memberIds: ["p-camborne",    "p-falmouth",     "p-nanpean"] },
  { id: "c11-bodmin",      group: "11", masterId: "p-bodmin",      memberIds: ["p-bodmin",      "p-newquay",      "p-launceston"] },
  // Group 12 — Bristol (Southern Sector)
  { id: "c12-swindon",     group: "12", masterId: "p-swindon",     memberIds: ["p-swindon",     "p-chippenham",   "p-devizes"] },
  { id: "c12-stroud",      group: "12", masterId: "p-stroud",      memberIds: ["p-stroud",      "p-cirencester",  "p-malmesbury"] },
  { id: "c12-bath",        group: "12", masterId: "p-bath",        memberIds: ["p-bath",        "p-frome",        "p-warminster"] },
  { id: "c12-weston",      group: "12", masterId: "p-weston",      memberIds: ["p-weston",      "p-nailsea",      "p-long-ashton"] },
  // Group 13 — Carmarthen / South Wales (Southern Sector)
  { id: "c13-haverfordwest",group:"13", masterId: "p-haverfordwest",memberIds: ["p-haverfordwest","p-fishguard",   "p-tenby"] },
  { id: "c13-swansea",     group: "13", masterId: "p-swansea",     memberIds: ["p-swansea",     "p-llandeilo",    "p-llandovery"] },
  { id: "c13-cardigan",    group: "13", masterId: "p-cardigan",    memberIds: ["p-cardigan",    "p-lampeter",     "p-brecon"] },
  // Group 14 — Winchester (Metropolitan Sector)
  { id: "c14-andover",     group: "14", masterId: "p-andover",     memberIds: ["p-andover",     "p-stockbridge",  "p-romsey"] },
  { id: "c14-basingstoke", group: "14", masterId: "p-basingstoke", memberIds: ["p-basingstoke", "p-overton-hants","p-alton"] },
  { id: "c14-petersfield", group: "14", masterId: "p-petersfield", memberIds: ["p-petersfield", "p-bishops-waltham","p-fordingbridge"] },
  // Group 15 — Lincoln (Eastern Sector)
  { id: "c15-grimsby",     group: "15", masterId: "p-grimsby",     memberIds: ["p-grimsby",     "p-louth",        "p-market-rasen"] },
  { id: "c15-skegness",    group: "15", masterId: "p-skegness",    memberIds: ["p-skegness",    "p-alford-lincs", "p-hackthorn"] },
  { id: "c15-grantham",    group: "15", masterId: "p-grantham",    memberIds: ["p-grantham",    "p-sleaford",     "p-spalding"] },
  // Group 16 — Shrewsbury (Midland Sector)
  { id: "c16-stafford",    group: "16", masterId: "p-stafford",    memberIds: ["p-stafford",    "p-market-drayton","p-upton-magna"] },
  { id: "c16-ludlow",      group: "16", masterId: "p-ludlow",      memberIds: ["p-ludlow",      "p-bridgnorth",   "p-bishops-castle"] },
  { id: "c16-hereford",    group: "16", masterId: "p-hereford",    memberIds: ["p-hereford",    "p-ross-on-wye",  "p-clun"] },
  // Group 17 — Wrexham / North Wales (Western Sector)
  { id: "c17-bangor",      group: "17", masterId: "p-bangor",      memberIds: ["p-bangor",      "p-caernarfon",   "p-holyhead"] },
  { id: "c17-colwyn",      group: "17", masterId: "p-colwyn-bay",  memberIds: ["p-colwyn-bay",  "p-bala",         "p-llanrhaiadr"] },
  { id: "c17-aberystwyth", group: "17", masterId: "p-aberystwyth", memberIds: ["p-aberystwyth", "p-machynlleth",  "p-dolgellau"] },
  { id: "c17-welshpool",   group: "17", masterId: "p-welshpool",   memberIds: ["p-welshpool",   "p-newtown-wales","p-llanidloes"] },
  // Group 18 — Leeds (Eastern Sector)
  { id: "c18-otley",       group: "18", masterId: "p-otley",       memberIds: ["p-otley",       "p-ilkley",       "p-tadcaster"] },
  { id: "c18-wetherby",    group: "18", masterId: "p-wetherby",    memberIds: ["p-wetherby",    "p-castleford",   "p-pontefract"] },
  { id: "c18-wakefield",   group: "18", masterId: "p-wakefield",   memberIds: ["p-wakefield",   "p-dewsbury",     "p-hemsworth"] },
  // Group 20 — York (Eastern Sector) — full cluster data from ringbell.co.uk
  { id: "c20-tunstall",      group: "20", masterId: "p-tunstall",      memberIds: ["p-tunstall",      "p-keyingham",   "p-skirlaugh"] },
  { id: "c20-bridlington",   group: "20", masterId: "p-bridlington",   memberIds: ["p-bridlington",   "p-skipsea",     "p-langtoft"] },
  { id: "c20-pickering",     group: "20", masterId: "p-pickering",     memberIds: ["p-pickering",     "p-kirby-moorside","p-wykeham"] },
  { id: "c20-pocklington",   group: "20", masterId: "p-pocklington",   memberIds: ["p-pocklington",   "p-fulford",     "p-tockwith"] },
  { id: "c20-beverley",      group: "20", masterId: "p-beverley",      memberIds: ["p-beverley",      "p-holme-spalding","p-gilberdyke"] },
  { id: "c20-strensall",     group: "20", masterId: "p-strensall",     memberIds: ["p-strensall",     "p-brandsby",    "p-birdsall"] },
  { id: "c20-northallerton", group: "20", masterId: "p-northallerton", memberIds: ["p-northallerton", "p-bedale"] },
  { id: "c20-middlesmoor",   group: "20", masterId: "p-middlesmoor",   memberIds: ["p-middlesmoor",   "p-north-stainley","p-kirby-hill","p-darley"] },
  { id: "c20-buckden",       group: "20", masterId: "p-buckden",       memberIds: ["p-buckden",       "p-horton",      "p-settle","p-grassington"] },
  { id: "c20-heckmondwike",  group: "20", masterId: "p-heckmondwike",  memberIds: ["p-heckmondwike",  "p-sowerby-bridge","p-thornton"] },
  { id: "c20-guiseley",      group: "20", masterId: "p-guiseley",      memberIds: ["p-guiseley",      "p-keighley",    "p-gargrave"] },
  { id: "c20-holmfirth",     group: "20", masterId: "p-holmfirth",     memberIds: ["p-holmfirth",     "p-darton"] },
  { id: "c20-barwick",       group: "20", masterId: "p-barwick",       memberIds: ["p-barwick",       "p-camblesforth"] },
  // Group 21 — Preston (Western Sector)
  { id: "c21-blackburn",   group: "21", masterId: "p-blackburn",   memberIds: ["p-blackburn",   "p-darwen",       "p-burnley"] },
  { id: "c21-lancaster",   group: "21", masterId: "p-lancaster",   memberIds: ["p-lancaster",   "p-garstang",     "p-longridge"] },
  { id: "c21-burscough",   group: "21", masterId: "p-burscough",   memberIds: ["p-burscough",   "p-chorley",      "p-accrington"] },
  // Group 22 — Carlisle (Western Sector)
  { id: "c22-keswick",     group: "22", masterId: "p-keswick",     memberIds: ["p-keswick",     "p-cockermouth",  "p-wigton"] },
  { id: "c22-whitehaven",  group: "22", masterId: "p-whitehaven",  memberIds: ["p-whitehaven",  "p-workington",   "p-kendal"] },
  { id: "c22-penrith",     group: "22", masterId: "p-penrith",     memberIds: ["p-penrith",     "p-appleby",      "p-alston"] },
  // Group 23 — Durham (Eastern Sector)
  { id: "c23-stanhope",    group: "23", masterId: "p-stanhope",    memberIds: ["p-stanhope",    "p-bishop-auckland","p-barnard-castle"] },
  { id: "c23-darlington",  group: "23", masterId: "p-darlington",  memberIds: ["p-darlington",  "p-stockton",     "p-hartlepool"] },
  { id: "c23-hexham",      group: "23", masterId: "p-hexham",      memberIds: ["p-hexham",      "p-consett",      "p-seaham"] },
  // Group 24 — Edinburgh (Caledonian Sector)
  { id: "c24-dunbar",      group: "24", masterId: "p-dunbar",      memberIds: ["p-dunbar",      "p-haddington",   "p-dalkeith"] },
  { id: "c24-galashiels",  group: "24", masterId: "p-galashiels",  memberIds: ["p-galashiels",  "p-melrose",      "p-kelso"] },
  { id: "c24-hawick",      group: "24", masterId: "p-hawick",      memberIds: ["p-hawick",      "p-jedburgh",     "p-peebles"] },
  // Group 25 — Ayr (Caledonian Sector)
  { id: "c25-kilmarnock",  group: "25", masterId: "p-kilmarnock",  memberIds: ["p-kilmarnock",  "p-troon",        "p-prestwick"] },
  { id: "c25-girvan",      group: "25", masterId: "p-girvan",      memberIds: ["p-girvan",      "p-newton-stewart","p-stranraer"] },
  { id: "c25-dumfries",    group: "25", masterId: "p-dumfries",    memberIds: ["p-dumfries",    "p-castle-douglas","p-kirkcudbright"] },
  // Group 27 — Oban (Caledonian Sector)
  { id: "c27-campbeltown", group: "27", masterId: "p-campbeltown", memberIds: ["p-campbeltown", "p-tarbert",      "p-lochgilphead"] },
  { id: "c27-oban-post",   group: "27", masterId: "p-oban",        memberIds: ["p-oban",        "p-inveraray",    "p-dalmally"] },
  { id: "c27-fort-william",group: "27", masterId: "p-fort-william",memberIds: ["p-fort-william","p-tyndrum",      "p-bridge-of-orchy"] },
  // Group 28 — Dundee (Caledonian Sector)
  { id: "c28-arbroath",    group: "28", masterId: "p-arbroath",    memberIds: ["p-arbroath",    "p-montrose",     "p-forfar"] },
  { id: "c28-st-andrews",  group: "28", masterId: "p-st-andrews",  memberIds: ["p-st-andrews",  "p-cupar",        "p-kirkcaldy"] },
  { id: "c28-perth",       group: "28", masterId: "p-perth",       memberIds: ["p-perth",       "p-blairgowrie",  "p-crieff"] },
  // Group 29 — Aberdeen (Caledonian Sector)
  { id: "c29-peterhead",   group: "29", masterId: "p-peterhead",   memberIds: ["p-peterhead",   "p-fraserburgh",  "p-banff"] },
  { id: "c29-elgin",       group: "29", masterId: "p-elgin",       memberIds: ["p-elgin",       "p-keith",        "p-huntly"] },
  { id: "c29-stonehaven",  group: "29", masterId: "p-stonehaven",  memberIds: ["p-stonehaven",  "p-banchory",     "p-kintore"] },
  // Group 30 — Inverness (Caledonian Sector)
  { id: "c30-dingwall",    group: "30", masterId: "p-dingwall",    memberIds: ["p-dingwall",    "p-beauly",       "p-cannich"] },
  { id: "c30-forres",      group: "30", masterId: "p-forres",      memberIds: ["p-forres",      "p-nairn",        "p-grantown"] },
  { id: "c30-kingussie",   group: "30", masterId: "p-kingussie",   memberIds: ["p-kingussie",   "p-newtonmore",   "p-aviemore"] },
  // Group 31 — Belfast (Northern Ireland)
  { id: "c31-ballymena",   group: "31", masterId: "p-ballymena",   memberIds: ["p-ballymena",   "p-antrim",       "p-cookstown"] },
  { id: "c31-londonderry", group: "31", masterId: "p-londonderry", memberIds: ["p-londonderry", "p-omagh",        "p-enniskillen"] },
  { id: "c31-armagh",      group: "31", masterId: "p-armagh",      memberIds: ["p-armagh",      "p-newry",        "p-downpatrick"] },

  // ── Expanded clusters for complete national coverage ──────────────────────
  // Each group now carries ~8–10 clusters covering its full territory.
  // Master post (VHF radio equipped) is listed first in memberIds.

  // Group 1 — Maidstone / Kent (additional)
  { id: "c01-ramsgate",     group: "1",  masterId: "p-ramsgate",         memberIds: ["p-ramsgate",         "p-broadstairs",      "p-sandwich"] },
  { id: "c01-maidstone-e",  group: "1",  masterId: "p-maidstone",        memberIds: ["p-maidstone",        "p-sittingbourne",    "p-sheerness"] },
  { id: "c01-gravesend",    group: "1",  masterId: "p-gravesend",        memberIds: ["p-gravesend",        "p-rochester",        "p-snodland"] },
  { id: "c01-tunbridge-w",  group: "1",  masterId: "p-tunbridge-wells",  memberIds: ["p-tunbridge-wells",  "p-edenbridge",       "p-westerham"] },
  { id: "c01-herne-bay",    group: "1",  masterId: "p-herne-bay",        memberIds: ["p-herne-bay",        "p-whitstable",       "p-birchington"] },
  // Group 2 — Horsham / Sussex (additional)
  { id: "c02-worthing",     group: "2",  masterId: "p-worthing",         memberIds: ["p-worthing",         "p-shoreham",         "p-steyning"] },
  { id: "c02-brighton",     group: "2",  masterId: "p-brighton",         memberIds: ["p-brighton",         "p-newhaven",         "p-uckfield"] },
  { id: "c02-hastings",     group: "2",  masterId: "p-hastings",         memberIds: ["p-hastings",         "p-bexhill",          "p-battle"] },
  { id: "c02-eastbourne",   group: "2",  masterId: "p-eastbourne",       memberIds: ["p-eastbourne",       "p-hailsham",         "p-seaford"] },
  // Group 3 — Oxford / Oxfordshire + S.Bucks (additional)
  { id: "c03-banbury",      group: "3",  masterId: "p-banbury",          memberIds: ["p-banbury",          "p-deddington",       "p-brackley"] },
  { id: "c03-henley",       group: "3",  masterId: "p-henley",           memberIds: ["p-henley",           "p-marlow",           "p-maidenhead"] },
  { id: "c03-abingdon",     group: "3",  masterId: "p-abingdon",         memberIds: ["p-abingdon",         "p-didcot",           "p-grove"] },
  { id: "c03-buckingham",   group: "3",  masterId: "p-buckingham",       memberIds: ["p-buckingham",       "p-winslow",          "p-towcester"] },
  // Group 4 — Colchester / Essex + Suffolk (additional)
  { id: "c04-chelmsford",   group: "4",  masterId: "p-chelmsford",       memberIds: ["p-chelmsford",       "p-maldon",           "p-burnham-crouch"] },
  { id: "c04-colchester-e", group: "4",  masterId: "p-colchester",       memberIds: ["p-colchester",       "p-clacton",          "p-mersea"] },
  { id: "c04-lowestoft",    group: "4",  masterId: "p-lowestoft",        memberIds: ["p-lowestoft",        "p-bungay",           "p-halesworth"] },
  { id: "c04-woodbridge",   group: "4",  masterId: "p-woodbridge",       memberIds: ["p-woodbridge",       "p-framlingham",      "p-saxmundham"] },
  // Group 5 — Watford / Herts + N.London (additional)
  { id: "c05-enfield",      group: "5",  masterId: "p-enfield",          memberIds: ["p-enfield",          "p-waltham-abbey",    "p-cheshunt"] },
  { id: "c05-stortford",    group: "5",  masterId: "p-bishops-stortford",memberIds: ["p-bishops-stortford","p-sawbridgeworth",   "p-harlow"] },
  { id: "c05-stevenage",    group: "5",  masterId: "p-stevenage",        memberIds: ["p-stevenage",        "p-hitchin",          "p-letchworth"] },
  { id: "c05-berkhamsted",  group: "5",  masterId: "p-berkhamsted",      memberIds: ["p-berkhamsted",      "p-tring",            "p-chesham"] },
  // Group 6 — Norwich / Norfolk (additional)
  { id: "c06-kings-lynn",   group: "6",  masterId: "p-kings-lynn",       memberIds: ["p-kings-lynn",       "p-heacham",          "p-hunstanton"] },
  { id: "c06-thetford",     group: "6",  masterId: "p-thetford",         memberIds: ["p-thetford",         "p-watton",           "p-diss"] },
  { id: "c06-yarmouth",     group: "6",  masterId: "p-great-yarmouth",   memberIds: ["p-great-yarmouth",   "p-loddon",           "p-wymondham"] },
  { id: "c06-wells",        group: "6",  masterId: "p-wells-next-sea",   memberIds: ["p-wells-next-sea",   "p-burnham-market",   "p-brancaster"] },
  // Group 7 — Bedford / Beds + Northants + Cambs (additional)
  { id: "c07-cambridge",    group: "7",  masterId: "p-cambridge",        memberIds: ["p-cambridge",        "p-royston",          "p-sawston"] },
  { id: "c07-kettering",    group: "7",  masterId: "p-kettering",        memberIds: ["p-kettering",        "p-corby",            "p-thrapston"] },
  { id: "c07-bedford",      group: "7",  masterId: "p-bedford",          memberIds: ["p-bedford",          "p-sandy",            "p-biggleswade"] },
  { id: "c07-ely",          group: "7",  masterId: "p-ely",              memberIds: ["p-ely",              "p-march",            "p-chatteris"] },
  // Group 8 — Coventry / Warwicks + W.Midlands (additional)
  { id: "c08-warwick",      group: "8",  masterId: "p-warwick",          memberIds: ["p-warwick",          "p-henley-in-arden",  "p-solihull"] },
  { id: "c08-tamworth",     group: "8",  masterId: "p-tamworth",         memberIds: ["p-tamworth",         "p-lichfield",        "p-burton"] },
  { id: "c08-redditch",     group: "8",  masterId: "p-redditch",         memberIds: ["p-redditch",         "p-alcester",         "p-evesham"] },
  // Group 9 — Yeovil / Dorset + Somerset (additional)
  { id: "c09-taunton",      group: "9",  masterId: "p-taunton",          memberIds: ["p-taunton",          "p-chard",            "p-ilminster"] },
  { id: "c09-glastonbury",  group: "9",  masterId: "p-glastonbury",      memberIds: ["p-glastonbury",      "p-bridgwater",       "p-burnham-sea"] },
  { id: "c09-yeovil",       group: "9",  masterId: "p-yeovil",           memberIds: ["p-yeovil",           "p-crewkerne",        "p-somerton"] },
  { id: "c09-blandford",    group: "9",  masterId: "p-blandford",        memberIds: ["p-blandford",        "p-sturminster-newton","p-gillingham-dorset"] },
  // Group 10 — Exeter / Devon (additional)
  { id: "c10-tiverton",     group: "10", masterId: "p-tiverton",         memberIds: ["p-tiverton",         "p-cullompton",       "p-bampton"] },
  { id: "c10-exeter",       group: "10", masterId: "p-exeter",           memberIds: ["p-exeter",           "p-exmouth",          "p-sidmouth"] },
  { id: "c10-brixham",      group: "10", masterId: "p-brixham",          memberIds: ["p-brixham",          "p-paignton",         "p-torquay"] },
  // Group 11 — Truro / Cornwall (additional)
  { id: "c11-truro",        group: "11", masterId: "p-truro",            memberIds: ["p-truro",            "p-redruth",          "p-perranporth"] },
  { id: "c11-lostwithiel",  group: "11", masterId: "p-lostwithiel",      memberIds: ["p-lostwithiel",      "p-fowey",            "p-liskeard"] },
  { id: "c11-bude",         group: "11", masterId: "p-bude",             memberIds: ["p-bude",             "p-camelford",        "p-wadebridge"] },
  // Group 12 — Bristol / Bristol + Wilts + Glos + N.Som (additional)
  { id: "c12-cheltenham",   group: "12", masterId: "p-cheltenham",       memberIds: ["p-cheltenham",       "p-gloucester",       "p-tewkesbury"] },
  { id: "c12-tetbury",      group: "12", masterId: "p-tetbury",          memberIds: ["p-tetbury",          "p-chipping-sodbury", "p-thornbury"] },
  { id: "c12-shepton-m",    group: "12", masterId: "p-shepton-mallet",   memberIds: ["p-shepton-mallet",   "p-radstock",         "p-midsomer-norton"] },
  { id: "c12-trowbridge",   group: "12", masterId: "p-trowbridge",       memberIds: ["p-trowbridge",       "p-westbury",         "p-melksham"] },
  // Group 13 — South Wales / Carmarthen + Valleys (additional)
  { id: "c13-merthyr",      group: "13", masterId: "p-merthyr-tydfil",   memberIds: ["p-merthyr-tydfil",   "p-aberdare",         "p-rhymney"] },
  { id: "c13-neath",        group: "13", masterId: "p-neath",            memberIds: ["p-neath",            "p-port-talbot",      "p-maesteg"] },
  { id: "c13-abergavenny",  group: "13", masterId: "p-abergavenny",      memberIds: ["p-abergavenny",      "p-monmouth",         "p-raglan"] },
  { id: "c13-rhayader",     group: "13", masterId: "p-rhayader",         memberIds: ["p-rhayader",         "p-builth-wells",     "p-llandrindod"] },
  // Group 14 — Winchester / Hampshire (additional)
  { id: "c14-southampton",  group: "14", masterId: "p-southampton",      memberIds: ["p-southampton",      "p-eastleigh",        "p-chandlers-ford"] },
  { id: "c14-fareham",      group: "14", masterId: "p-fareham",          memberIds: ["p-fareham",          "p-gosport",          "p-havant"] },
  { id: "c14-ringwood",     group: "14", masterId: "p-ringwood",         memberIds: ["p-ringwood",         "p-lymington",        "p-hythe"] },
  { id: "c14-portsmouth",   group: "14", masterId: "p-portsmouth",       memberIds: ["p-portsmouth",       "p-waterlooville",    "p-hamble"] },
  // Group 15 — Lincoln / Lincolnshire (additional)
  { id: "c15-horncastle",   group: "15", masterId: "p-horncastle",       memberIds: ["p-horncastle",       "p-woodhall-spa",     "p-tattershall"] },
  { id: "c15-boston",       group: "15", masterId: "p-boston-lincs",     memberIds: ["p-boston-lincs",     "p-holbeach",         "p-donington"] },
  { id: "c15-gainsborough", group: "15", masterId: "p-gainsborough",     memberIds: ["p-gainsborough",     "p-retford",          "p-bawtry"] },
  // Group 16 — Shrewsbury / Shropshire + Staffs + Hereford (additional)
  { id: "c16-wolverhampton",group: "16", masterId: "p-wolverhampton",    memberIds: ["p-wolverhampton",    "p-sedgley",          "p-stourbridge"] },
  { id: "c16-oswestry",     group: "16", masterId: "p-oswestry",         memberIds: ["p-oswestry",         "p-ellesmere",        "p-whitchurch"] },
  { id: "c16-telford",      group: "16", masterId: "p-telford",          memberIds: ["p-telford",          "p-newport-sa",       "p-much-wenlock"] },
  { id: "c16-kidderminster",group: "16", masterId: "p-kidderminster",    memberIds: ["p-kidderminster",    "p-bewdley",          "p-stourport"] },
  // Group 17 — North Wales / Wrexham (additional)
  { id: "c17-rhyl",         group: "17", masterId: "p-rhyl",             memberIds: ["p-rhyl",             "p-prestatyn",        "p-st-asaph"] },
  { id: "c17-llangefni",    group: "17", masterId: "p-llangefni",        memberIds: ["p-llangefni",        "p-amlwch",           "p-beaumaris"] },
  { id: "c17-pwllheli",     group: "17", masterId: "p-pwllheli",         memberIds: ["p-pwllheli",         "p-criccieth",        "p-portmadoc"] },
  { id: "c17-barmouth",     group: "17", masterId: "p-barmouth",         memberIds: ["p-barmouth",         "p-tywyn",            "p-aberdyfi"] },
  // Group 18 — Leeds / W.Yorkshire + S.Yorkshire (additional)
  { id: "c18-bradford",     group: "18", masterId: "p-bradford",         memberIds: ["p-bradford",         "p-bingley",          "p-shipley"] },
  { id: "c18-huddersfield", group: "18", masterId: "p-huddersfield",     memberIds: ["p-huddersfield",     "p-mirfield",         "p-brighouse"] },
  { id: "c18-barnsley",     group: "18", masterId: "p-barnsley",         memberIds: ["p-barnsley",         "p-royston-yorks",    "p-hoyland"] },
  { id: "c18-sheffield",    group: "18", masterId: "p-sheffield",        memberIds: ["p-sheffield",        "p-chapeltown",       "p-rotherham"] },
  { id: "c18-harrogate",    group: "18", masterId: "p-harrogate",        memberIds: ["p-harrogate",        "p-knaresborough",    "p-ripon"] },
  // Group 21 — Preston / Lancashire (additional)
  { id: "c21-southport",    group: "21", masterId: "p-southport",        memberIds: ["p-southport",        "p-ormskirk",         "p-skelmersdale"] },
  { id: "c21-blackpool",    group: "21", masterId: "p-blackpool",        memberIds: ["p-blackpool",        "p-lytham-st-annes",  "p-fleetwood"] },
  { id: "c21-colne",        group: "21", masterId: "p-colne",            memberIds: ["p-colne",            "p-nelson",           "p-padiham"] },
  { id: "c21-clitheroe",    group: "21", masterId: "p-clitheroe",        memberIds: ["p-clitheroe",        "p-ribchester",       "p-slaidburn"] },
  // Group 22 — Carlisle / Cumbria (additional)
  { id: "c22-carlisle-c",   group: "22", masterId: "p-carlisle",         memberIds: ["p-carlisle",         "p-brampton",         "p-longtown"] },
  { id: "c22-ulverston",    group: "22", masterId: "p-ulverston",        memberIds: ["p-ulverston",        "p-barrow",           "p-dalton"] },
  { id: "c22-ambleside",    group: "22", masterId: "p-ambleside",        memberIds: ["p-ambleside",        "p-windermere",       "p-coniston"] },
  // Group 23 — Durham / Co.Durham + Tyne&Wear + Teesside (additional)
  { id: "c23-north-tyne",   group: "23", masterId: "p-morpeth",          memberIds: ["p-morpeth",          "p-blyth",            "p-ashington"] },
  { id: "c23-gateshead",    group: "23", masterId: "p-gateshead",        memberIds: ["p-gateshead",        "p-sunderland",       "p-washington"] },
  { id: "c23-middlesbrough",group: "23", masterId: "p-middlesbrough",    memberIds: ["p-middlesbrough",    "p-redcar",           "p-guisborough"] },
  // Group 24 — Edinburgh / Lothian + Borders (additional)
  { id: "c24-edinburgh",    group: "24", masterId: "p-edinburgh-city",   memberIds: ["p-edinburgh-city",   "p-penicuik",         "p-bathgate"] },
  { id: "c24-linlithgow",   group: "24", masterId: "p-linlithgow",       memberIds: ["p-linlithgow",       "p-bo-ness",          "p-falkirk"] },
  { id: "c24-berwick",      group: "24", masterId: "p-berwick",          memberIds: ["p-berwick",          "p-coldstream",       "p-duns"] },
  // Group 25 — Ayr / Ayrshire + Galloway (additional)
  { id: "c25-largs",        group: "25", masterId: "p-largs",            memberIds: ["p-largs",            "p-ardrossan",        "p-irvine"] },
  { id: "c25-beith",        group: "25", masterId: "p-beith",            memberIds: ["p-beith",            "p-dalry",            "p-stewarton"] },
  { id: "c25-sanquhar",     group: "25", masterId: "p-sanquhar",         memberIds: ["p-sanquhar",         "p-thornhill",        "p-moffat"] },
  // Group 27 — Oban / Argyll + Islands (additional)
  { id: "c27-islay",        group: "27", masterId: "p-port-ellen",       memberIds: ["p-port-ellen",       "p-bowmore",          "p-bridgend-islay"] },
  { id: "c27-mull",         group: "27", masterId: "p-tobermory",        memberIds: ["p-tobermory",        "p-craignure",        "p-fionnphort"] },
  { id: "c27-arran",        group: "27", masterId: "p-brodick",          memberIds: ["p-brodick",          "p-lamlash",          "p-lochranza"] },
  // Group 28 — Dundee / Tayside + Fife (additional)
  { id: "c28-dundee-city",  group: "28", masterId: "p-dundee",           memberIds: ["p-dundee",           "p-balgay",           "p-broughty-ferry"] },
  { id: "c28-kinross",      group: "28", masterId: "p-kinross",          memberIds: ["p-kinross",          "p-cowdenbeath",      "p-auchtermuchty"] },
  { id: "c28-pitlochry",    group: "28", masterId: "p-pitlochry",        memberIds: ["p-pitlochry",        "p-aberfeldy",        "p-dunkeld"] },
  // Group 29 — Aberdeen / Aberdeenshire + Moray (additional)
  { id: "c29-aberdeen",     group: "29", masterId: "p-aberdeen-city",    memberIds: ["p-aberdeen-city",    "p-portlethen",       "p-westhill"] },
  { id: "c29-turriff",      group: "29", masterId: "p-turriff",          memberIds: ["p-turriff",          "p-oldmeldrum",       "p-macduff"] },
  // Group 30 — Inverness / Highland (additional)
  { id: "c30-wick",         group: "30", masterId: "p-wick",             memberIds: ["p-wick",             "p-thurso",           "p-brora"] },
  { id: "c30-kyle",         group: "30", masterId: "p-kyle",             memberIds: ["p-kyle",             "p-plockton",         "p-glenelg"] },
  { id: "c30-ullapool",     group: "30", masterId: "p-ullapool",         memberIds: ["p-ullapool",         "p-garve",            "p-lairg"] },
  // Group 31 — Belfast / Northern Ireland (additional)
  { id: "c31-belfast",      group: "31", masterId: "p-belfast",          memberIds: ["p-belfast",          "p-hillsborough",     "p-lisburn"] },
  { id: "c31-bangor-ni",    group: "31", masterId: "p-bangor-ni",        memberIds: ["p-bangor-ni",        "p-newtownards",      "p-comber"] },
  { id: "c31-coleraine",    group: "31", masterId: "p-coleraine",        memberIds: ["p-coleraine",        "p-portrush",         "p-ballymoney"] }
];

const monitoringPosts = [
  // Group 5 — Watford (Metropolitan)
  { id: "p-northolt",   name: "Northolt ROC Post",   group: "5", number: "62", lat: 51.55374316, lon: -0.42374780, status: "Opened 1967, closed 1991" },
  { id: "p-bowes-park", name: "Bowes Park ROC Post", group: "5", number: "61", lat: 51.59698805, lon: -0.12366686, status: "Opened 1964, closed 1991" },
  { id: "p-dulwich",    name: "Dulwich ROC Post",    group: "5", number: "15", lat: 51.437, lon: -0.071, status: "Opened 1965, closed 1991" },

  // Representative posts — 2–3 per group for national coverage.
  // Group 1 — Maidstone (Metropolitan)
  { id: "p-dover",        name: "Dover ROC Post",          group: "1",  number: "7",  lat: 51.14012922, lon:  1.34064250, status: "Publicly listed ROC post" },
  { id: "p-sevenoaks",    name: "Sevenoaks ROC Post",      group: "1",  number: "22", lat: 51.27822406, lon:  0.18105945, status: "Publicly listed ROC post" },
  { id: "p-tonbridge",    name: "Tonbridge ROC Post",      group: "1",  number: "31", lat: 51.19739634, lon:  0.28359183, status: "Publicly listed ROC post" },
  // Group 2 — Horsham (Metropolitan)
  { id: "p-crawley",      name: "Crawley ROC Post",        group: "2",  number: "14", lat: 51.14505045, lon: -0.20038378, status: "Publicly listed ROC post" },
  { id: "p-billingshurst",name: "Billingshurst ROC Post",  group: "2",  number: "26", lat: 51.02139719, lon: -0.43801883, status: "Publicly listed ROC post" },
  { id: "p-lewes",        name: "Lewes ROC Post",          group: "2",  number: "37", lat: 50.88404531, lon:  -0.02108972, status: "Publicly listed ROC post" },
  // Group 3 — Oxford (Metropolitan)
  { id: "p-faringdon",    name: "Faringdon ROC Post",      group: "3",  number: "9",  lat: 51.65405357, lon: -1.58697372, status: "Publicly listed ROC post" },
  { id: "p-wallingford",  name: "Wallingford ROC Post",    group: "3",  number: "18", lat: 51.60164781, lon: -1.14115482, status: "Publicly listed ROC post" },
  { id: "p-chipping-norton",name:"Chipping Norton ROC Post",group:"3",  number: "28", lat: 51.94411744, lon: -1.54169072, status: "Publicly listed ROC post" },
  // Group 4 — Colchester (Metropolitan)
  { id: "p-ipswich",      name: "Ipswich ROC Post",        group: "4",  number: "33", lat: 52.06802603, lon:  1.15499107, status: "Publicly listed ROC post" },
  { id: "p-witham",       name: "Witham ROC Post",         group: "4",  number: "21", lat: 51.81246986, lon:  0.63026778, status: "Publicly listed ROC post" },
  { id: "p-halstead",     name: "Halstead ROC Post",       group: "4",  number: "12", lat: 51.94792771, lon:  0.62931189, status: "Publicly listed ROC post" },
  // Group 6 — Norwich (Midland)
  { id: "p-new-buckenham",name: "New Buckenham ROC Post",  group: "6",  number: "39", lat: 52.47422589, lon:  1.08516402, status: "Publicly listed ROC post" },
  { id: "p-dereham",      name: "Dereham ROC Post",        group: "6",  number: "24", lat: 52.68501418, lon:  0.93708008, status: "Publicly listed ROC post" },
  { id: "p-beccles",      name: "Beccles ROC Post",        group: "6",  number: "47", lat: 52.45763237, lon:  1.56912700, status: "Publicly listed ROC post" },
  // Group 7 — Bedford (Midland)
  { id: "p-olney",        name: "Olney ROC Post",          group: "7",  number: "35", lat: 52.10246138, lon: -0.69984580, status: "Opened 1964, closed 1991" },
  { id: "p-luton",        name: "Luton ROC Post",          group: "7",  number: "12", lat: 51.87983106, lon: -0.36093802, status: "Publicly listed ROC post" },
  { id: "p-huntingdon",   name: "Huntingdon ROC Post",     group: "7",  number: "48", lat: 52.33001503, lon: -0.18159225, status: "Publicly listed ROC post" },
  // Group 8 — Coventry (Midland)
  { id: "p-meriden",      name: "Meriden ROC Post",           group: "8",  number: "31", lat: 52.43939867, lon: -1.61645096, status: "Opened 1965, closed 1991" },
  { id: "p-leamington",   name: "Leamington Spa ROC Post",    group: "8",  number: "18", lat: 52.19924132, lon: -1.53380535, status: "Publicly listed ROC post" },
  { id: "p-rugby",        name: "Rugby ROC Post",             group: "8",  number: "24", lat: 52.36699526, lon: -1.26680053, status: "Publicly listed ROC post" },
  // p-stratford: archivedPostCoordinates has Stratford, East London — override with Stratford-upon-Avon
  { id: "p-stratford",    name: "Stratford-upon-Avon ROC Post",group: "8", number: "36", lat: 52.16678688, lon: -1.83883675, status: "Publicly listed ROC post" },
  // Group 9 — Yeovil (Southern)
  { id: "p-sherborne",    name: "Sherborne ROC Post",      group: "9",  number: "19", lat: 50.99328027, lon: -2.42826615, status: "Publicly listed ROC post" },
  { id: "p-bridport",     name: "Bridport ROC Post",       group: "9",  number: "25", lat: 50.72822598, lon: -2.75582359, status: "Publicly listed ROC post" },
  { id: "p-blandford",    name: "Blandford Forum ROC Post",group: "9",  number: "31", lat: 50.85079021, lon: -2.16543971, status: "Publicly listed ROC post" },
  // Group 10 — Exeter (Southern)
  { id: "p-okehampton",   name: "Okehampton ROC Post",     group: "10", number: "18", lat: 50.72702757, lon: -4.07094432, status: "Publicly listed ROC post" },
  { id: "p-totnes",       name: "Totnes ROC Post",         group: "10", number: "27", lat: 50.43111051, lon: -3.67528757, status: "Publicly listed ROC post" },
  { id: "p-honiton",      name: "Honiton ROC Post",        group: "10", number: "34", lat: 50.79648608, lon: -3.20459410, status: "Publicly listed ROC post" },
  // Group 11 — Truro (Southern)
  { id: "p-nanpean",      name: "Nanpean ROC Post",        group: "11", number: "44", lat: 50.22433827, lon: -4.84097294, status: "Publicly listed ROC post" },
  { id: "p-bodmin",       name: "Bodmin ROC Post",         group: "11", number: "29", lat: 50.46127507, lon: -4.72058189, status: "Publicly listed ROC post" },
  { id: "p-liskeard",     name: "Liskeard ROC Post",       group: "11", number: "17", lat: 50.45588833, lon: -4.45750585, status: "Publicly listed ROC post" },
  // Group 12 — Bristol (Southern)
  { id: "p-long-ashton",  name: "Long Ashton ROC Post",    group: "12", number: "23", lat: 51.42145674, lon: -2.66423346, status: "Publicly listed ROC post" },
  { id: "p-bath",         name: "Bath ROC Post",           group: "12", number: "11", lat: 51.38296186, lon: -2.38562570, status: "Publicly listed ROC post" },
  { id: "p-weston",       name: "Weston-super-Mare ROC Post",group:"12",number: "34", lat: 51.31951862, lon: -2.95851024, status: "Publicly listed ROC post" },
  // Group 13 — Carmarthen / South Wales (Southern)
  { id: "p-carmarthen",   name: "Carmarthen ROC Post",     group: "13", number: "38", lat: 51.86712868, lon: -4.30957094, status: "Publicly listed ROC post" },
  { id: "p-swansea",      name: "Swansea ROC Post",        group: "13", number: "15", lat: 51.62959062, lon: -3.99808745, status: "Publicly listed ROC post" },
  { id: "p-haverfordwest",name: "Haverfordwest ROC Post",  group: "13", number: "51", lat: 51.80312404, lon: -4.88247797, status: "Publicly listed ROC post" },
  // Group 14 — Winchester (Metropolitan/Southern)
  { id: "p-overton-hants",name: "Overton ROC Post",        group: "14", number: "20", lat: 51.24473604, lon: -1.25540964, status: "Publicly listed ROC post" },
  { id: "p-basingstoke",  name: "Basingstoke ROC Post",    group: "14", number: "8",  lat: 51.19613035, lon: -1.03894411, status: "Publicly listed ROC post" },
  { id: "p-petersfield",  name: "Petersfield ROC Post",    group: "14", number: "32", lat: 51.01222019, lon: -0.94324966, status: "Publicly listed ROC post" },
  // p-stockbridge: archivedPostCoordinates has Stocksbridge, S. Yorkshire — override with Stockbridge, Hampshire
  { id: "p-stockbridge",  name: "Stockbridge ROC Post",    group: "14", number: "27", lat: 51.11554794, lon: -1.45664063, status: "Publicly listed ROC post" },
  { id: "p-andover",      name: "Andover ROC Post",        group: "14", number: "12", lat: 51.27105124, lon: -1.46341027, status: "Publicly listed ROC post" },
  { id: "p-romsey",       name: "Romsey ROC Post",         group: "14", number: "38", lat: 50.95509620, lon: -1.53297321, status: "Publicly listed ROC post" },
  // Group 15 — Lincoln (Eastern)
  { id: "p-hackthorn",    name: "Hackthorn ROC Post",      group: "15", number: "41", lat: 53.29804747, lon: -0.50582259, status: "Publicly listed ROC post" },
  { id: "p-louth",        name: "Louth ROC Post",          group: "15", number: "22", lat: 53.34265972, lon: 0.00722175, status: "Publicly listed ROC post" },
  { id: "p-spalding",     name: "Spalding ROC Post",       group: "15", number: "14", lat: 52.77410817, lon: -0.11984899, status: "Publicly listed ROC post" },
  // Group 16 — Shrewsbury (Midland)
  { id: "p-upton-magna",  name: "Upton Magna ROC Post",    group: "16", number: "19", lat: 52.70854726, lon: -2.66851855, status: "Publicly listed ROC post" },
  { id: "p-stafford",     name: "Stafford ROC Post",       group: "16", number: "33", lat: 52.84859825, lon: -2.02920961, status: "Publicly listed ROC post" },
  { id: "p-ludlow",       name: "Ludlow ROC Post",         group: "16", number: "27", lat: 52.36503487, lon: -2.72984737, status: "Publicly listed ROC post" },
  // Group 17 — Wrexham / North Wales (Western)
  { id: "p-llanrhaiadr",  name: "Llanrhaiadr ROC Post",    group: "17", number: "24", lat: 52.82521850, lon: -3.29096466, status: "Publicly listed ROC post" },
  { id: "p-aberystwyth",  name: "Aberystwyth ROC Post",    group: "17", number: "11", lat: 52.41548954, lon: -4.07122690, status: "Publicly listed ROC post" },
  { id: "p-colwyn-bay",   name: "Colwyn Bay ROC Post",     group: "17", number: "37", lat: 53.29431107, lon: -3.73013548, status: "Publicly listed ROC post" },
  // Group 18 — Leeds (Eastern)
  { id: "p-wetherby",     name: "Wetherby ROC Post",       group: "18", number: "15", lat: 53.92305175, lon: -1.40290519, status: "Publicly listed ROC post" },
  { id: "p-dewsbury",     name: "Dewsbury ROC Post",       group: "18", number: "34", lat: 53.68786627, lon: -1.63503622, status: "Publicly listed ROC post" },
  { id: "p-ilkley",       name: "Ilkley ROC Post",         group: "18", number: "22", lat: 53.92538927, lon: -1.82027363, status: "Publicly listed ROC post" },

  // Additional cluster master / anchor posts for Groups 1–17.
  // These ensure clusterAnchor() places each cluster in the correct geographic
  // area. Without at least one originalPostById member, clusterAnchor() falls
  // back to a ring around the Group Control, which can put the master post
  // 30–70 km from its true location.
  //
  // Group 1 — Maidstone
  { id: "p-ashford",     name: "Ashford ROC Post",     group: "1",  number: "27", lat: 51.12764198, lon:  0.91676540, status: "Publicly listed ROC post" },
  // Group 2 — Horsham
  { id: "p-chichester",  name: "Chichester ROC Post",  group: "2",  number: "11", lat: 50.81811783, lon: -0.80837400, status: "Publicly listed ROC post" },
  // Group 3 — Oxford
  { id: "p-bicester",    name: "Bicester ROC Post",    group: "3",  number: "31", lat: 51.90956801, lon: -1.21379608, status: "Publicly listed ROC post" },
  // Group 5 — Watford (master of c05-ware; archived coords for p-stratford
  // put it in East London so we override the entry above in Group 8 instead)
  { id: "p-ware",        name: "Ware ROC Post",        group: "5",  number: "19", lat: 51.81239059, lon: -0.03784381, status: "Publicly listed ROC post" },
  // Group 8 — Coventry
  { id: "p-nuneaton",    name: "Nuneaton ROC Post",    group: "8",  number: "14", lat: 52.56640608, lon: -1.41366909, status: "Publicly listed ROC post" },
  // Group 10 — Exeter (also in archivedPostCoordinates but needs to be in
  // monitoringPosts so it anchors clusterAnchor for c10-barnstaple)
  { id: "p-barnstaple",  name: "Barnstaple ROC Post",  group: "10", number: "7",  lat: 51.04793491, lon: -4.02387984, status: "Publicly listed ROC post" },
  // Group 11 — Truro (Penzance and Camborne clusters are far SW; without
  // anchors they fall back to the Truro ring, 30–40 km from their true area)
  { id: "p-penzance",    name: "Penzance ROC Post",    group: "11", number: "41", lat: 50.13096730, lon: -5.55547563, status: "Publicly listed ROC post" },
  { id: "p-camborne",    name: "Camborne ROC Post",    group: "11", number: "32", lat: 50.21308040, lon: -5.30053728, status: "Publicly listed ROC post" },
  { id: "p-launceston",  name: "Launceston ROC Post",  group: "11", number: "18", lat: 50.63238512, lon: -4.35625524, status: "Publicly listed ROC post" },
  // Group 15 — Lincoln
  { id: "p-grimsby",     name: "Grimsby ROC Post",     group: "15", number: "9",  lat: 53.53176002, lon: -0.00044302, status: "Publicly listed ROC post" },
  // Group 16 — Shrewsbury (Hereford cluster has no members in original posts
  // or archived coords, so all three ended up near Shrewsbury without this)
  { id: "p-hereford",    name: "Hereford ROC Post",    group: "16", number: "42", lat: 52.04417978, lon: -2.71221378, status: "Publicly listed ROC post" },
  // Group 17 — North Wales (Bangor cluster members ended up near Wrexham
  // without an anchor; p-bangor is in archived but that doesn't feed
  // clusterAnchor, which only looks at monitoringPosts)
  { id: "p-bangor",      name: "Bangor ROC Post",      group: "17", number: "26", lat: 53.21826417, lon: -4.12923898, status: "Publicly listed ROC post" },

  // Group 20 — York. Full network as shown on the ringbell.co.uk March 1989
  // map. Cluster assignments follow the green sector lines on that map.
  // Tunstall cluster (master 20/M2, 1975–1991)
  { id: "p-tunstall",       name: "Tunstall ROC Post",       group: "20", number: "55", lat: 53.76756265, lon: -0.01125467, status: "Opened 1959, closed 1991. Master post 20/M2.", cluster: "c20-tunstall" },
  { id: "p-keyingham",      name: "Keyingham ROC Post",      group: "20", number: "56", lat: 53.70125203, lon: -0.10194725, status: "Opened 1965, closed 1991", cluster: "c20-tunstall" },
  { id: "p-skirlaugh",      name: "Skirlaugh ROC Post",      group: "20", number: "57", lat: 53.84454809, lon: -0.27484141, status: "Opened 1959, closed 1991", cluster: "c20-tunstall" },
  // Bridlington cluster
  { id: "p-bridlington",    name: "Bridlington ROC Post",    group: "20", number: "20", lat: 54.12382348, lon: -0.21857626, status: "Opened 1958, closed 1991. Master post.", cluster: "c20-bridlington" },
  { id: "p-skipsea",        name: "Skipsea ROC Post",        group: "20", number: "21", lat: 53.97581392, lon: -0.20903837, status: "Opened 1959, closed 1991", cluster: "c20-bridlington" },
  { id: "p-langtoft",       name: "Langtoft ROC Post",       group: "20", number: "22", lat: 54.08372434, lon: -0.46581741, status: "Opened 1959, closed 1991", cluster: "c20-bridlington" },
  // Pickering cluster
  { id: "p-pickering",      name: "Pickering ROC Post",      group: "20", number: "17", lat: 54.24951066, lon: -0.78459943, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-pickering" },
  { id: "p-kirby-moorside", name: "Kirby Moorside ROC Post", group: "20", number: "16", lat: 54.26846481, lon: -0.94588470, status: "Opened 1960, closed 1991", cluster: "c20-pickering" },
  { id: "p-wykeham",        name: "Wykeham ROC Post",        group: "20", number: "23", lat: 54.24616487, lon: -0.52502306, status: "Opened 1961, closed 1991", cluster: "c20-pickering" },
  // Pocklington cluster
  { id: "p-pocklington",    name: "Pocklington ROC Post",    group: "20", number: "35", lat: 53.94645935, lon: -0.71815666, status: "Opened 1958, closed 1991. Master post.", cluster: "c20-pocklington" },
  { id: "p-fulford",        name: "Fulford ROC Post",        group: "20", number: "47", lat: 53.92552321, lon: -1.07043319, status: "Opened 1965, closed 1991", cluster: "c20-pocklington" },
  { id: "p-tockwith",       name: "Tockwith ROC Post",       group: "20", number: "36", lat: 53.96418369, lon: -1.31269245, status: "Opened 1958, closed 1991", cluster: "c20-pocklington" },
  // Beverley cluster
  { id: "p-beverley",       name: "Beverley ROC Post",       group: "20", number: "51", lat: 53.83332691, lon: -0.46799314, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-beverley" },
  { id: "p-holme-spalding", name: "Holme-on-Spalding-Moor ROC Post", group: "20", number: "50", lat: 53.78761136, lon: -0.74167385, status: "Opened 1960, closed 1991", cluster: "c20-beverley" },
  { id: "p-gilberdyke",     name: "Gilberdyke ROC Post",     group: "20", number: "52", lat: 53.73760897, lon: -0.73073563, status: "Opened 1965, closed 1991", cluster: "c20-beverley" },
  // Strensall cluster
  { id: "p-strensall",      name: "Strensall ROC Post",      group: "20", number: "38", lat: 54.03287351, lon: -1.02910775, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-strensall" },
  { id: "p-brandsby",       name: "Brandsby ROC Post",       group: "20", number: "37", lat: 54.14110066, lon: -1.12454725, status: "Opened 1960, closed 1991", cluster: "c20-strensall" },
  { id: "p-birdsall",       name: "Birdsall ROC Post",       group: "20", number: "15", lat: 54.09494296, lon: -0.68453026, status: "Opened 1965, closed 1991", cluster: "c20-strensall" },
  // Northallerton cluster
  { id: "p-northallerton",  name: "Northallerton ROC Post",  group: "20", number: "10", lat: 54.31495308, lon: -1.41123615, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-northallerton" },
  { id: "p-bedale",         name: "Bedale ROC Post",         group: "20", number: "11", lat: 54.29356684, lon: -1.58499696, status: "Opened 1959, closed 1991", cluster: "c20-northallerton" },
  // Middlesmoor cluster
  { id: "p-middlesmoor",    name: "Middlesmoor ROC Post",    group: "20", number: "33", lat: 54.17378075, lon: -1.87051901, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-middlesmoor" },
  { id: "p-north-stainley", name: "North Stainley ROC Post", group: "20", number: "30", lat: 54.18231127, lon: -1.58733688, status: "Opened 1958, closed 1991", cluster: "c20-middlesmoor" },
  { id: "p-kirby-hill",     name: "Kirby Hill ROC Post",     group: "20", number: "31", lat: 54.10917918, lon: -1.41935454, status: "Opened 1965, closed 1991", cluster: "c20-middlesmoor" },
  { id: "p-darley",         name: "Darley ROC Post",         group: "20", number: "32", lat: 54.02393274, lon: -1.66888882, status: "Opened 1962, closed 1991", cluster: "c20-middlesmoor" },
  // Buckden cluster (Yorkshire Dales)
  { id: "p-buckden",        name: "Buckden ROC Post",        group: "20", number: "25", lat: 54.19978268, lon: -2.09898847, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-buckden" },
  { id: "p-horton",         name: "Horton-in-Ribblesdale ROC Post", group: "20", number: "28", lat: 54.14751676, lon: -2.29405816, status: "Opened 1962, closed 1991", cluster: "c20-buckden" },
  { id: "p-settle",         name: "Settle ROC Post",         group: "20", number: "27", lat: 54.06215511, lon: -2.28581531, status: "Opened 1959, closed 1991", cluster: "c20-buckden" },
  { id: "p-grassington",    name: "Grassington ROC Post",    group: "20", number: "26", lat: 54.06896582, lon: -2.01066082, status: "Opened 1959, closed 1991", cluster: "c20-buckden" },
  // Heckmondwike cluster (West Riding)
  { id: "p-heckmondwike",   name: "Heckmondwike ROC Post",   group: "20", number: "62", lat: 53.72295261, lon: -1.67777240, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-heckmondwike" },
  { id: "p-sowerby-bridge", name: "Sowerby Bridge ROC Post", group: "20", number: "61", lat: 53.68605553, lon: -1.91638142, status: "Opened 1959, closed 1991", cluster: "c20-heckmondwike" },
  { id: "p-thornton",       name: "Thornton ROC Post",       group: "20", number: "41", lat: 53.79610995, lon: -1.86287767, status: "Opened 1965, closed 1991", cluster: "c20-heckmondwike" },
  // Guiseley cluster (West Riding NW)
  { id: "p-guiseley",       name: "Guiseley ROC Post",       group: "20", number: "40", lat: 53.89395214, lon: -1.69624107, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-guiseley" },
  { id: "p-keighley",       name: "Keighley ROC Post",       group: "20", number: "42", lat: 53.87480574, lon: -1.92011313, status: "Opened 1959, closed 1991", cluster: "c20-guiseley" },
  { id: "p-gargrave",       name: "Gargrave ROC Post",       group: "20", number: "43", lat: 53.97212986, lon: -2.09753201, status: "Opened 1962, closed 1991", cluster: "c20-guiseley" },
  // Holmfirth cluster
  { id: "p-holmfirth",      name: "Holmfirth ROC Post",      group: "20", number: "60", lat: 53.53503191, lon: -1.76519905, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-holmfirth" },
  { id: "p-darton",         name: "Darton ROC Post",         group: "20", number: "67", lat: 53.60458702, lon: -1.51953924, status: "Opened 1962, closed 1991", cluster: "c20-holmfirth" },
  // Barwick cluster
  { id: "p-barwick",        name: "Barwick-in-Elmet ROC Post", group: "20", number: "65", lat: 53.82405006, lon: -1.41221267, status: "Opened 1962, closed 1991. Master post.", cluster: "c20-barwick" },
  { id: "p-camblesforth",   name: "Camblesforth ROC Post",   group: "20", number: "45", lat: 53.73059817, lon: -1.01789469, status: "Opened 1962, closed 1991", cluster: "c20-barwick" },

  // Groups 21–31 — anchor posts (cluster members that need originalPostById entries
  // so that clusterAnchor() places generated posts in the correct area).
  // Group 21 — Preston (Western)
  { id: "p-burscough",    name: "Burscough ROC Post",      group: "21", number: "11", lat: 53.58819550, lon: -2.86844360, status: "Opened 1962, closed 1991" },
  { id: "p-blackburn",    name: "Blackburn ROC Post",      group: "21", number: "24", lat: 53.77707621, lon: -2.52165509, status: "Publicly listed ROC post" },
  { id: "p-chorley",      name: "Chorley ROC Post",        group: "21", number: "33", lat: 53.70129720, lon: -2.61796197, status: "Publicly listed ROC post" },
  { id: "p-lancaster",    name: "Lancaster ROC Post",      group: "21", number: "8",  lat: 54.04723847, lon: -2.80177769, status: "Publicly listed ROC post" },
  { id: "p-burnley",      name: "Burnley ROC Post",        group: "21", number: "29", lat: 53.78604968, lon: -2.24538284, status: "Publicly listed ROC post" },
  { id: "p-accrington",   name: "Accrington ROC Post",     group: "21", number: "37", lat: 53.80737795, lon: -2.31125951, status: "Publicly listed ROC post" },
  // Group 22 — Carlisle (Western)
  { id: "p-brampton",     name: "Brampton ROC Post",       group: "22", number: "8",  lat: 54.93514722, lon: -2.73491259, status: "Opened 1959, closed 1991" },
  { id: "p-penrith",      name: "Penrith ROC Post",        group: "22", number: "19", lat: 54.65463292, lon: -2.77013937, status: "Publicly listed ROC post" },
  { id: "p-whitehaven",   name: "Whitehaven ROC Post",     group: "22", number: "31", lat: 54.55496875, lon: -3.56922536, status: "Publicly listed ROC post" },
  { id: "p-keswick",      name: "Keswick ROC Post",        group: "22", number: "22", lat: 54.60991335, lon: -3.07245256, status: "Publicly listed ROC post" },
  { id: "p-appleby",      name: "Appleby ROC Post",        group: "22", number: "14", lat: 54.57572029, lon: -2.49684703, status: "Publicly listed ROC post" },
  { id: "p-alston",       name: "Alston ROC Post",         group: "22", number: "26", lat: 54.81085506, lon: -2.43935949, status: "Publicly listed ROC post" },
  // Group 23 — Durham (Eastern)
  { id: "p-stanhope",     name: "Stanhope ROC Post",       group: "23", number: "27", lat: 54.76006778, lon: -2.01550798, status: "Publicly listed ROC post" },
  { id: "p-sunderland",   name: "Sunderland ROC Post",     group: "23", number: "14", lat: 54.88329357, lon: -1.45145927, status: "Publicly listed ROC post" },
  { id: "p-darlington",   name: "Darlington ROC Post",     group: "23", number: "36", lat: 54.52610787, lon: -1.54726126, status: "Publicly listed ROC post" },
  { id: "p-hexham",       name: "Hexham ROC Post",         group: "23", number: "18", lat: 54.91651355, lon: -2.04489680, status: "Publicly listed ROC post" },
  { id: "p-bishop-auckland",name:"Bishop Auckland ROC Post",group:"23", number: "42", lat: 54.67545479, lon: -1.62174381, status: "Publicly listed ROC post" },
  { id: "p-barnard-castle",name:"Barnard Castle ROC Post", group: "23", number: "33", lat: 54.54876292, lon: -1.91555983, status: "Publicly listed ROC post" },
  // Group 24 — Edinburgh (Caledonian)
  { id: "p-penicuik",     name: "Penicuik ROC Post",       group: "24", number: "12", lat: 55.80584874, lon: -3.22364588, status: "Publicly listed ROC post" },
  { id: "p-dunbar",       name: "Dunbar ROC Post",         group: "24", number: "27", lat: 55.97679415, lon: -2.51915038, status: "Publicly listed ROC post" },
  { id: "p-galashiels",   name: "Galashiels ROC Post",     group: "24", number: "38", lat: 55.62096492, lon: -2.79167867, status: "Publicly listed ROC post" },
  { id: "p-hawick",       name: "Hawick ROC Post",         group: "24", number: "44", lat: 55.42267031, lon: -2.78865379, status: "Publicly listed ROC post" },
  { id: "p-melrose",      name: "Melrose ROC Post",        group: "24", number: "31", lat: 55.59738952, lon: -2.72439372, status: "Publicly listed ROC post" },
  { id: "p-haddington",   name: "Haddington ROC Post",     group: "24", number: "19", lat: 55.95549317, lon: -2.77671341, status: "Publicly listed ROC post" },
  // Group 25 — Ayr (Caledonian)
  { id: "p-prestwick",    name: "Prestwick ROC Post",      group: "25", number: "36", lat: 55.49155680, lon: -4.62271669, status: "Publicly listed ROC post" },
  { id: "p-kilmarnock",   name: "Kilmarnock ROC Post",     group: "25", number: "19", lat: 55.61166616, lon: -4.47923474, status: "Publicly listed ROC post" },
  { id: "p-girvan",       name: "Girvan ROC Post",         group: "25", number: "42", lat: 55.21559182, lon: -4.84728566, status: "Publicly listed ROC post" },
  { id: "p-troon",        name: "Troon ROC Post",          group: "25", number: "12", lat: 55.55828605, lon: -4.65872270, status: "Publicly listed ROC post" },
  { id: "p-stranraer",    name: "Stranraer ROC Post",      group: "25", number: "51", lat: 54.83327924, lon: -4.99176675, status: "Publicly listed ROC post" },
  // Group 27 — Oban (Caledonian)
  { id: "p-oban",         name: "Oban ROC Post",           group: "27", number: "7",  lat: 56.46591077, lon: -5.39915367, status: "Opened 1960, closed 1968" },
  { id: "p-fort-william", name: "Fort William ROC Post",   group: "27", number: "15", lat: 56.83357446, lon: -5.10003285, status: "Publicly listed ROC post" },
  { id: "p-inveraray",    name: "Inveraray ROC Post",      group: "27", number: "22", lat: 56.22962001, lon: -5.07040814, status: "Publicly listed ROC post" },
  { id: "p-campbeltown",  name: "Campbeltown ROC Post",    group: "27", number: "31", lat: 55.42111834, lon: -5.60879422, status: "Publicly listed ROC post" },
  { id: "p-tyndrum",      name: "Tyndrum ROC Post",        group: "27", number: "9",  lat: 56.43688297, lon: -4.71312675, status: "Publicly listed ROC post" },
  // Group 28 — Dundee (Caledonian)
  { id: "p-forfar",       name: "Forfar ROC Post",         group: "28", number: "29", lat: 56.63060014, lon: -2.88344444, status: "Publicly listed ROC post" },
  { id: "p-arbroath",     name: "Arbroath ROC Post",       group: "28", number: "16", lat: 56.54892040, lon: -2.61788038, status: "Publicly listed ROC post" },
  { id: "p-perth",        name: "Perth ROC Post",          group: "28", number: "41", lat: 56.47321327, lon: -3.43091673, status: "Publicly listed ROC post" },
  { id: "p-kirkcaldy",    name: "Kirkcaldy ROC Post",      group: "28", number: "22", lat: 56.12103391, lon: -3.15160121, status: "Publicly listed ROC post" },
  { id: "p-blairgowrie",  name: "Blairgowrie ROC Post",    group: "28", number: "35", lat: 56.59468432, lon: -3.34283693, status: "Publicly listed ROC post" },
  { id: "p-montrose",     name: "Montrose ROC Post",       group: "28", number: "11", lat: 56.70573256, lon: -2.46332942, status: "Publicly listed ROC post" },
  // Group 29 — Aberdeen (Caledonian)
  { id: "p-kintore",      name: "Kintore ROC Post",        group: "29", number: "6",  lat: 57.23067722, lon: -2.33622551, status: "Publicly listed ROC post" },
  { id: "p-elgin",        name: "Elgin ROC Post",          group: "29", number: "22", lat: 57.62930191, lon: -3.35016005, status: "Publicly listed ROC post" },
  { id: "p-inverurie",    name: "Inverurie ROC Post",      group: "29", number: "14", lat: 57.23013292, lon: -2.33820817, status: "Publicly listed ROC post" },
  { id: "p-peterhead",    name: "Peterhead ROC Post",      group: "29", number: "9",  lat: 57.50624390, lon: -1.77319168, status: "Publicly listed ROC post" },
  { id: "p-banchory",     name: "Banchory ROC Post",       group: "29", number: "18", lat: 57.01791154, lon: -2.59105528, status: "Publicly listed ROC post" },
  { id: "p-banff",        name: "Banff ROC Post",          group: "29", number: "31", lat: 57.65938580, lon: -2.52955814, status: "Publicly listed ROC post" },
  // Group 30 — Inverness (Caledonian)
  { id: "p-cannich",      name: "Cannich ROC Post",        group: "30", number: "14", lat: 57.34298174, lon: -4.76336185, status: "Publicly listed ROC post" },
  { id: "p-dingwall",     name: "Dingwall ROC Post",       group: "30", number: "26", lat: 57.60947527, lon: -4.42024975, status: "Publicly listed ROC post" },
  { id: "p-beauly",       name: "Beauly ROC Post",         group: "30", number: "8",  lat: 57.49052917, lon: -4.47444781, status: "Publicly listed ROC post" },
  { id: "p-forres",       name: "Forres ROC Post",         group: "30", number: "19", lat: 57.60776823, lon: -3.60878678, status: "Publicly listed ROC post" },
  { id: "p-aviemore",     name: "Aviemore ROC Post",       group: "30", number: "33", lat: 57.19989810, lon: -3.82489466, status: "Publicly listed ROC post" },
  { id: "p-newtonmore",   name: "Newtonmore ROC Post",     group: "30", number: "41", lat: 57.08493743, lon: -4.02651303, status: "Publicly listed ROC post" },
  // Group 31 — Belfast (Northern Ireland)
  { id: "p-hillsborough", name: "Hillsborough ROC Post",   group: "31", number: "51", lat: 54.463, lon: -6.083, status: "Publicly listed ROC post" },
  { id: "p-antrim",       name: "Antrim ROC Post",         group: "31", number: "22", lat: 54.720, lon: -6.210, status: "Publicly listed ROC post" },
  { id: "p-londonderry",  name: "Londonderry ROC Post",    group: "31", number: "37", lat: 54.997, lon: -7.310, status: "Publicly listed ROC post" },
  { id: "p-armagh",       name: "Armagh ROC Post",         group: "31", number: "15", lat: 54.352, lon: -6.656, status: "Publicly listed ROC post" },
  { id: "p-enniskillen",  name: "Enniskillen ROC Post",    group: "31", number: "28", lat: 54.344, lon: -7.634, status: "Publicly listed ROC post" },
  { id: "p-ballymena",    name: "Ballymena ROC Post",      group: "31", number: "9",  lat: 54.861, lon: -6.275, status: "Publicly listed ROC post" },

  // ── Master posts for expanded clusters ───────────────────────────────────
  // Coordinates are approximate town-centre positions (±2 km).
  // Satellite members are generated automatically via clusterAnchor + memberOffset.

  // Group 1 — Kent
  { id: "p-ramsgate",          name: "Ramsgate ROC Post",          group: "1",  lat: 51.38674866, lon:  1.44096241, status: "Publicly listed ROC post" },
  { id: "p-maidstone",         name: "Maidstone ROC Post",         group: "1",  lat: 51.27467893, lon:  0.57261266, status: "Publicly listed ROC post" },
  { id: "p-gravesend",         name: "Gravesend ROC Post",         group: "1",  lat: 51.43677097, lon:  0.31249114, status: "Publicly listed ROC post" },
  { id: "p-tunbridge-wells",   name: "Tunbridge Wells ROC Post",   group: "1",  lat: 51.09917303, lon:  0.27046332, status: "Publicly listed ROC post" },
  { id: "p-herne-bay",         name: "Herne Bay ROC Post",         group: "1",  lat: 51.34241470, lon:  1.11621968, status: "Publicly listed ROC post" },
  // Group 2 — Sussex
  { id: "p-worthing",          name: "Worthing ROC Post",          group: "2",  lat: 50.81956245, lon: -0.33814346, status: "Publicly listed ROC post" },
  { id: "p-brighton",          name: "Brighton ROC Post",          group: "2",  lat: 50.82486479, lon: -0.11318887, status: "Publicly listed ROC post" },
  { id: "p-hastings",          name: "Hastings ROC Post",          group: "2",  lat: 50.87041812, lon:  0.64409727, status: "Publicly listed ROC post" },
  { id: "p-eastbourne",        name: "Eastbourne ROC Post",        group: "2",  lat: 50.80094113, lon:  0.33417491, status: "Publicly listed ROC post" },
  // Group 3 — Oxfordshire / S.Bucks
  { id: "p-banbury",           name: "Banbury ROC Post",           group: "3",  lat: 52.07911252, lon: -1.32609953, status: "Publicly listed ROC post" },
  { id: "p-henley",            name: "Henley-on-Thames ROC Post",  group: "3",  lat: 51.49422633, lon: -0.90679166, status: "Publicly listed ROC post" },
  { id: "p-abingdon",          name: "Abingdon ROC Post",          group: "3",  lat: 51.65092922, lon: -1.26135082, status: "Publicly listed ROC post" },
  { id: "p-buckingham",        name: "Buckingham ROC Post",        group: "3",  lat: 51.98471901, lon: -0.97774867, status: "Publicly listed ROC post" },
  // Group 4 — Essex / Suffolk
  { id: "p-chelmsford",        name: "Chelmsford ROC Post",        group: "4",  lat: 51.72140110, lon:  0.51797159, status: "Publicly listed ROC post" },
  { id: "p-colchester",        name: "Colchester ROC Post",        group: "4",  lat: 51.86688138, lon:  0.86122582, status: "Publicly listed ROC post" },
  { id: "p-lowestoft",         name: "Lowestoft ROC Post",         group: "4",  lat: 52.50130362, lon:  1.75056675, status: "Publicly listed ROC post" },
  { id: "p-woodbridge",        name: "Woodbridge ROC Post",        group: "4",  lat: 52.11562880, lon:  1.25652858, status: "Publicly listed ROC post" },
  // Group 5 — Hertfordshire / N.London
  { id: "p-enfield",           name: "Enfield ROC Post",           group: "5",  lat: 51.68181741, lon: -0.13694205, status: "Publicly listed ROC post" },
  { id: "p-bishops-stortford", name: "Bishop's Stortford ROC Post",group: "5",  lat: 51.85966670, lon:  0.08373587, status: "Publicly listed ROC post" },
  { id: "p-stevenage",         name: "Stevenage ROC Post",         group: "5",  lat: 51.91704179, lon: -0.10817135, status: "Publicly listed ROC post" },
  { id: "p-berkhamsted",       name: "Berkhamsted ROC Post",       group: "5",  lat: 51.77195272, lon: -0.56935631, status: "Publicly listed ROC post" },
  // Group 6 — Norfolk
  { id: "p-kings-lynn",        name: "King's Lynn ROC Post",       group: "6",  lat: 52.77845549, lon:  0.37468262, status: "Publicly listed ROC post" },
  { id: "p-thetford",          name: "Thetford ROC Post",          group: "6",  lat: 52.43476772, lon:  0.74133730, status: "Publicly listed ROC post" },
  { id: "p-great-yarmouth",    name: "Great Yarmouth ROC Post",    group: "6",  lat: 52.64456243, lon:  1.70293680, status: "Publicly listed ROC post" },
  { id: "p-wells-next-sea",    name: "Wells-next-the-Sea ROC Post",group: "6",  lat: 52.94196276, lon:  0.85100855, status: "Publicly listed ROC post" },
  // Group 7 — Bedfordshire / Northants / Cambs
  { id: "p-cambridge",         name: "Cambridge ROC Post",         group: "7",  lat: 52.13440523, lon:  -0.07121311, status: "Publicly listed ROC post" },
  { id: "p-kettering",         name: "Kettering ROC Post",         group: "7",  lat: 52.36835948, lon: -0.73641125, status: "Publicly listed ROC post" },
  { id: "p-bedford",           name: "Bedford ROC Post",           group: "7",  lat: 52.02972399, lon: -0.50298289, status: "Publicly listed ROC post" },
  { id: "p-ely",               name: "Ely ROC Post",               group: "7",  lat: 52.44275297, lon:  0.29934304, status: "Publicly listed ROC post" },
  // Group 8 — Warwickshire / W.Midlands
  { id: "p-warwick",           name: "Warwick ROC Post",           group: "8",  lat: 52.38781803, lon: -1.81188004, status: "Publicly listed ROC post" },
  { id: "p-tamworth",          name: "Tamworth ROC Post",          group: "8",  lat: 52.61702692, lon: -1.64104462, status: "Publicly listed ROC post" },
  { id: "p-redditch",          name: "Redditch ROC Post",          group: "8",  lat: 52.31882326, lon: -1.95168931, status: "Publicly listed ROC post" },
  // Group 9 — Dorset / Somerset
  { id: "p-taunton",           name: "Taunton ROC Post",           group: "9",  lat: 51.06767966, lon: -3.09787316, status: "Publicly listed ROC post" },
  { id: "p-glastonbury",       name: "Glastonbury ROC Post",       group: "9",  lat: 51.14035284, lon: -2.72737232, status: "Publicly listed ROC post" },
  { id: "p-yeovil",            name: "Yeovil ROC Post",            group: "9",  lat: 50.95239625, lon: -2.74436443, status: "Publicly listed ROC post" },
  // p-blandford already in monitoringPosts above as "Blandford Forum ROC Post"
  // Group 10 — Devon
  { id: "p-tiverton",          name: "Tiverton ROC Post",          group: "10", lat: 50.89409555, lon: -3.52448483, status: "Publicly listed ROC post" },
  { id: "p-exeter",            name: "Exeter ROC Post",            group: "10", lat: 50.73026648, lon: -3.42280534, status: "Publicly listed ROC post" },
  { id: "p-brixham",           name: "Brixham ROC Post",           group: "10", lat: 50.39914290, lon: -3.48631447, status: "Publicly listed ROC post" },
  // Group 11 — Cornwall
  { id: "p-truro",             name: "Truro ROC Post",             group: "11", lat: 50.25284447, lon: -5.05396220, status: "Publicly listed ROC post" },
  { id: "p-lostwithiel",       name: "Lostwithiel ROC Post",       group: "11", lat: 50.40756459, lon: -4.66275021, status: "Publicly listed ROC post" },
  // p-liskeard already in monitoringPosts; used as c11-lostwithiel member
  { id: "p-bude",              name: "Bude ROC Post",              group: "11", lat: 50.83385314, lon: -4.54463552, status: "Publicly listed ROC post" },
  // Group 12 — Bristol / Gloucestershire / Wiltshire
  { id: "p-cheltenham",        name: "Cheltenham ROC Post",        group: "12", lat: 51.91252488, lon: -2.07903895, status: "Publicly listed ROC post" },
  { id: "p-tetbury",           name: "Tetbury ROC Post",           group: "12", lat: 51.60290710, lon: -2.24772011, status: "Publicly listed ROC post" },
  { id: "p-shepton-mallet",    name: "Shepton Mallet ROC Post",    group: "12", lat: 51.18268813, lon: -2.56822700, status: "Publicly listed ROC post" },
  { id: "p-trowbridge",        name: "Trowbridge ROC Post",        group: "12", lat: 51.35050147, lon: -2.25410920, status: "Publicly listed ROC post" },
  // Group 13 — South Wales
  { id: "p-merthyr-tydfil",    name: "Merthyr Tydfil ROC Post",    group: "13", lat: 51.75296102, lon: -3.40937661, status: "Publicly listed ROC post" },
  { id: "p-neath",             name: "Neath ROC Post",             group: "13", lat: 51.63121512, lon: -3.82664303, status: "Publicly listed ROC post" },
  { id: "p-abergavenny",       name: "Abergavenny ROC Post",       group: "13", lat: 51.82455429, lon: -2.98326945, status: "Publicly listed ROC post" },
  { id: "p-rhayader",          name: "Rhayader ROC Post",          group: "13", lat: 52.29492525, lon: -3.52066361, status: "Publicly listed ROC post" },
  // Group 14 — Hampshire
  { id: "p-southampton",       name: "Southampton ROC Post",       group: "14", lat: 50.87593255, lon: -1.44393818, status: "Publicly listed ROC post" },
  { id: "p-fareham",           name: "Fareham ROC Post",           group: "14", lat: 50.82261862, lon: -1.25277134, status: "Publicly listed ROC post" },
  { id: "p-ringwood",          name: "Ringwood ROC Post",          group: "14", lat: 50.81917404, lon: -1.75336946, status: "Publicly listed ROC post" },
  { id: "p-portsmouth",        name: "Portsmouth ROC Post",        group: "14", lat: 50.78847965, lon: -1.10421376, status: "Publicly listed ROC post" },
  // Group 15 — Lincolnshire
  { id: "p-horncastle",        name: "Horncastle ROC Post",        group: "15", lat: 53.24313972, lon: -0.16004900, status: "Publicly listed ROC post" },
  { id: "p-boston-lincs",      name: "Boston ROC Post",            group: "15", lat: 53.01826079, lon: -0.01815662, status: "Publicly listed ROC post" },
  { id: "p-gainsborough",      name: "Gainsborough ROC Post",      group: "15", lat: 53.39263832, lon: -0.76748822, status: "Publicly listed ROC post" },
  // Group 16 — Shropshire / Staffordshire / Herefordshire
  { id: "p-wolverhampton",     name: "Wolverhampton ROC Post",     group: "16", lat: 52.588, lon: -2.128, status: "Publicly listed ROC post" },
  { id: "p-oswestry",          name: "Oswestry ROC Post",          group: "16", lat: 52.86188106, lon: -3.04607279, status: "Publicly listed ROC post" },
  { id: "p-telford",           name: "Telford ROC Post",           group: "16", lat: 52.68807442, lon: -2.45487366, status: "Publicly listed ROC post" },
  { id: "p-kidderminster",     name: "Kidderminster ROC Post",     group: "16", lat: 52.41759808, lon: -2.30578502, status: "Publicly listed ROC post" },
  // Group 17 — North Wales
  { id: "p-rhyl",              name: "Rhyl ROC Post",              group: "17", lat: 53.26444345, lon: -3.47058582, status: "Publicly listed ROC post" },
  { id: "p-llangefni",         name: "Llangefni ROC Post",         group: "17", lat: 53.26368791, lon: -4.31608547, status: "Publicly listed ROC post" },
  { id: "p-pwllheli",          name: "Pwllheli ROC Post",          group: "17", lat: 52.92423464, lon: -4.32276332, status: "Publicly listed ROC post" },
  { id: "p-barmouth",          name: "Barmouth ROC Post",          group: "17", lat: 52.74202827, lon: -4.07275628, status: "Publicly listed ROC post" },
  // Group 18 — W. & S. Yorkshire
  { id: "p-bradford",          name: "Bradford ROC Post",          group: "18", lat: 53.79610995, lon: -1.86287767, status: "Publicly listed ROC post" },
  { id: "p-huddersfield",      name: "Huddersfield ROC Post",      group: "18", lat: 53.62117485, lon: -1.84122032, status: "Publicly listed ROC post" },
  { id: "p-barnsley",          name: "Barnsley ROC Post",          group: "18", lat: 53.554, lon: -1.488, status: "Publicly listed ROC post" },
  { id: "p-sheffield",         name: "Sheffield ROC Post",         group: "18", lat: 53.32725910, lon: -1.51184856, status: "Publicly listed ROC post" },
  { id: "p-harrogate",         name: "Harrogate ROC Post",         group: "18", lat: 54.02933453, lon: -1.45038862, status: "Publicly listed ROC post" },
  // Group 21 — Lancashire
  { id: "p-southport",         name: "Southport ROC Post",         group: "21", lat: 53.64188575, lon: -3.02398580, status: "Publicly listed ROC post" },
  { id: "p-blackpool",         name: "Blackpool ROC Post",         group: "21", lat: 53.81277213, lon: -2.94552609, status: "Publicly listed ROC post" },
  { id: "p-colne",             name: "Colne ROC Post",             group: "21", lat: 53.86060139, lon: -2.16934084, status: "Publicly listed ROC post" },
  { id: "p-clitheroe",         name: "Clitheroe ROC Post",         group: "21", lat: 53.94669625, lon: -2.34200653, status: "Publicly listed ROC post" },
  // Group 22 — Cumbria
  { id: "p-carlisle",          name: "Carlisle ROC Post",          group: "22", lat: 54.92366744, lon: -2.96313410, status: "Publicly listed ROC post" },
  { id: "p-ulverston",         name: "Ulverston ROC Post",         group: "22", lat: 54.19829974, lon: -3.10054587, status: "Publicly listed ROC post" },
  { id: "p-ambleside",         name: "Ambleside ROC Post",         group: "22", lat: 54.37273142, lon: -2.99960512, status: "Publicly listed ROC post" },
  // Group 23 — Co.Durham / Tyne & Wear / Teesside
  { id: "p-morpeth",           name: "Morpeth ROC Post",           group: "23", lat: 55.11502482, lon: -1.66855581, status: "Publicly listed ROC post" },
  { id: "p-gateshead",         name: "Gateshead ROC Post",         group: "23", lat: 54.92496753, lon: -1.55590304, status: "Publicly listed ROC post" },
  { id: "p-middlesbrough",     name: "Middlesbrough ROC Post",     group: "23", lat: 54.58172231, lon: -1.28362197, status: "Publicly listed ROC post" },
  // Group 24 — Lothian / Scottish Borders
  { id: "p-edinburgh-city",    name: "Edinburgh ROC Post",         group: "24", lat: 55.94303810, lon: -3.17032890, status: "Publicly listed ROC post" },
  { id: "p-linlithgow",        name: "Linlithgow ROC Post",        group: "24", lat: 55.99717464, lon: -3.59847000, status: "Publicly listed ROC post" },
  { id: "p-berwick",           name: "Berwick-upon-Tweed ROC Post",group: "24", lat: 55.77186495, lon: -2.01033504, status: "Publicly listed ROC post" },
  // Group 25 — Ayrshire / Galloway
  { id: "p-largs",             name: "Largs ROC Post",             group: "25", lat: 55.84382712, lon: -4.88332544, status: "Publicly listed ROC post" },
  { id: "p-beith",             name: "Beith ROC Post",             group: "25", lat: 55.76008771, lon: -4.64598418, status: "Publicly listed ROC post" },
  { id: "p-sanquhar",          name: "Sanquhar ROC Post",          group: "25", lat: 55.37316943, lon: -3.92213995, status: "Publicly listed ROC post" },
  // Group 27 — Argyll & Bute / Islands
  { id: "p-port-ellen",        name: "Port Ellen ROC Post",        group: "27", lat: 55.629, lon: -6.195, status: "Publicly listed ROC post" },
  { id: "p-tobermory",         name: "Tobermory ROC Post",         group: "27", lat: 56.60239376, lon: -6.03575497, status: "Publicly listed ROC post" },
  { id: "p-brodick",           name: "Brodick ROC Post",           group: "27", lat: 55.57167779, lon: -5.11989450, status: "Publicly listed ROC post" },
  // Group 28 — Tayside / Fife
  { id: "p-dundee",            name: "Dundee ROC Post",            group: "28", lat: 56.50253627, lon: -2.93764831, status: "Publicly listed ROC post" },
  { id: "p-kinross",           name: "Kinross ROC Post",           group: "28", lat: 56.21843636, lon: -3.45785295, status: "Publicly listed ROC post" },
  { id: "p-pitlochry",         name: "Pitlochry ROC Post",         group: "28", lat: 56.69211854, lon: -3.73901141, status: "Publicly listed ROC post" },
  // Group 29 — Aberdeenshire / Moray
  { id: "p-aberdeen-city",     name: "Aberdeen ROC Post",          group: "29", lat: 57.11441347, lon: -2.07973417, status: "Publicly listed ROC post" },
  { id: "p-turriff",           name: "Turriff ROC Post",           group: "29", lat: 57.54327202, lon: -2.45253057, status: "Publicly listed ROC post" },
  // Group 30 — Highland
  { id: "p-wick",              name: "Wick ROC Post",              group: "30", lat: 58.46924556, lon: -3.08992056, status: "Publicly listed ROC post" },
  { id: "p-kyle",              name: "Kyle of Lochalsh ROC Post",  group: "30", lat: 57.31444931, lon: -5.68934907, status: "Publicly listed ROC post" },
  { id: "p-ullapool",          name: "Ullapool ROC Post",          group: "30", lat: 57.89496021, lon: -5.16680714, status: "Publicly listed ROC post" },
  // Group 31 — Northern Ireland
  { id: "p-belfast",           name: "Belfast ROC Post",           group: "31", lat: 54.597, lon: -5.930, status: "Publicly listed ROC post" },
  { id: "p-bangor-ni",         name: "Bangor ROC Post",            group: "31", lat: 54.654, lon: -5.670, status: "Publicly listed ROC post" },
  { id: "p-coleraine",         name: "Coleraine ROC Post",         group: "31", lat: 55.133, lon: -6.659, status: "Publicly listed ROC post" }
];

const postNameOverrides = {
  // Existing overrides
  "p-alford-lincs":       "Alford ROC Post",
  "p-bishops-castle":     "Bishop's Castle ROC Post",
  "p-bishops-waltham":    "Bishop's Waltham ROC Post",
  "p-bridge-of-orchy":    "Bridge of Orchy ROC Post",
  "p-newtown-wales":      "Newtown ROC Post",
  "p-overton-hants":      "Overton ROC Post",
  "p-ross-on-wye":        "Ross-on-Wye ROC Post",
  // New overrides for expanded clusters
  "p-aberdeen-city":      "Aberdeen ROC Post",
  "p-bangor-ni":          "Bangor ROC Post",
  "p-barrow":             "Barrow-in-Furness ROC Post",
  "p-berwick":            "Berwick-upon-Tweed ROC Post",
  "p-bishops-stortford":  "Bishop's Stortford ROC Post",
  "p-bo-ness":            "Bo'ness ROC Post",
  "p-boston-lincs":       "Boston ROC Post",
  "p-bridgend-islay":     "Bridgend ROC Post",
  "p-burnham-crouch":     "Burnham-on-Crouch ROC Post",
  "p-burnham-sea":        "Burnham-on-Sea ROC Post",
  "p-chandlers-ford":     "Chandler's Ford ROC Post",
  "p-dundee":             "Dundee ROC Post",
  "p-edinburgh-city":     "Edinburgh ROC Post",
  "p-gillingham-dorset":  "Gillingham ROC Post",
  "p-henley":             "Henley-on-Thames ROC Post",
  "p-henley-in-arden":    "Henley-in-Arden ROC Post",
  "p-kings-lynn":         "King's Lynn ROC Post",
  "p-kyle":               "Kyle of Lochalsh ROC Post",
  "p-lytham-st-annes":    "Lytham St Annes ROC Post",
  "p-midsomer-norton":    "Midsomer Norton ROC Post",
  "p-much-wenlock":       "Much Wenlock ROC Post",
  "p-newport-sa":         "Newport ROC Post",
  "p-portmadoc":          "Porthmadog ROC Post",
  "p-royston-yorks":      "Royston ROC Post",
  "p-sturminster-newton": "Sturminster Newton ROC Post",
  "p-wells-next-sea":     "Wells-next-the-Sea ROC Post",
  "p-westhill":           "Westhill ROC Post",
  "p-woodhall-spa":       "Woodhall Spa ROC Post"
};

const generatedPostSource = "SubBrit and Ringbell cluster data";
const generatedPostStatus = "Cluster member listed in source topology; position approximated for display";
const archivedCoordinateSource = "Archived content-delivery ROC GPS index";
const archivedCoordinateStatus = "Cluster member listed in source topology; GPS coordinate from archived ROC index";

// Coordinates derived from OS National Grid references (Wikipedia ROC post lists A-Z)
// via OSGB36 TM inverse projection + Helmert transform (accuracy ±5 m).
// Original archived GPS entries retained where Wikipedia grid refs are unavailable.
// Source: https://en.wikipedia.org/wiki/List_of_Royal_Observer_Corps_/_United_Kingdom_Warning_and_Monitoring_Organisation_Posts
const archivedPostCoordinates = {
  "p-aberfeldy": { lat: 56.6183351140, lon: -3.8640427163 },
  "p-abergavenny": { lat: 51.8245542935, lon: -2.9832694457 },
  "p-aberystwyth": { lat: 52.4154895397, lon: -4.0712268960 },
  "p-aldeburgh": { lat: 52.1546069153, lon: 1.5867828561 },
  "p-alford-lincs": { lat: 53.2581743935, lon: 0.1452445192 },
  "p-alston": { lat: 54.8108550598, lon: -2.4393594942 },
  "p-ampthill": { lat: 52.0269850934, lon: -0.4997218463 },
  "p-appleby": { lat: 54.5757202862, lon: -2.4968470261 },
  "p-arbroath": { lat: 56.54892040, lon: -2.61788038 },
  "p-aviemore": { lat: 57.19989810, lon: -3.82489466 },
  "p-aylsham": { lat: 52.7827574069, lon: 1.2575047430 },
  "p-bala": { lat: 52.9098945666, lon: -3.6084440738 },
  "p-banbury": { lat: 52.0791125238, lon: -1.3260995339 },
  "p-banff": { lat: 57.6593857971, lon: -2.5295581409 },
  "p-bangor": { lat: 53.21826417, lon: -4.12923898 },
  "p-barmouth": { lat: 52.74202827, lon: -4.07275628 },
  "p-barnard-castle": { lat: 54.5487629225, lon: -1.9155598267 },
  "p-barnstaple": { lat: 51.0479349123, lon: -4.0238798364 },
  "p-barwick": { lat: 53.8240500566, lon: -1.4122126716 },
  "p-bath": { lat: 51.3829618613, lon: -2.3856256956 },
  "p-beauly": { lat: 57.49052917, lon: -4.47444781 },
  "p-bedale": { lat: 54.29356684, lon: -1.58499696 },
  "p-berwick": { lat: 55.7718649497, lon: -2.0103350401 },
  "p-beverley": { lat: 53.8333269079, lon: -0.4679931440 },
  "p-blairgowrie": { lat: 56.5946843187, lon: -3.3428369303 },
  "p-blandford": { lat: 50.8507902101, lon: -2.1654397060 },
  "p-bodmin": { lat: 50.4612750659, lon: -4.7205818860 },
  "p-braintree": { lat: 52.3216874300, lon: 0.6230902650 },
  "p-brampton": { lat: 54.93514722, lon: -2.73491259 },
  "p-brecon": { lat: 51.9230124176, lon: -4.8676120131 },
  "p-bridge-of-orchy": { lat: 56.5380384700, lon: -4.7656306010 },
  "p-bridgnorth": { lat: 52.5347729959, lon: -2.4125975542 },
  "p-bridlington": { lat: 54.1238234753, lon: -0.2185762569 },
  "p-bridport": { lat: 50.7282259798, lon: -2.7558235923 },
  "p-buckden": { lat: 54.19978268, lon: -2.09898847 },
  "p-buckingham": { lat: 51.98471901, lon: -0.97774867 },
  "p-bude": { lat: 50.8338531442, lon: -4.5446355237 },
  "p-burnley": { lat: 53.7860496785, lon: -2.2453828354 },
  "p-camborne": { lat: 50.2130803996, lon: -5.3005372804 },
  "p-cambridge": { lat: 52.13440523, lon: -0.07121311 },
  "p-campbeltown": { lat: 55.4211183399, lon: -5.6087942209 },
  "p-cannich": { lat: 57.34298174, lon: -4.76336185 },
  "p-canterbury": { lat: 51.2828625900, lon: 1.1040619420 },
  "p-cardigan": { lat: 52.1330156954, lon: -4.6642216313 },
  "p-carlisle": { lat: 54.9236674436, lon: -2.9631341027 },
  "p-carmarthen": { lat: 51.86712868, lon: -4.30957094 },
  "p-castle-douglas": { lat: 54.9406103927, lon: -3.9323535347 },
  "p-chelmsford": { lat: 51.72140110, lon: 0.51797159 },
  "p-cheltenham": { lat: 51.9125248847, lon: -2.0790389469 },
  "p-chichester": { lat: 50.8181178313, lon: -0.8083739950 },
  "p-chippenham": { lat: 51.4638288755, lon: -2.1214430899 },
  "p-chipping-norton": { lat: 51.9441174392, lon: -1.5416907186 },
  "p-cockermouth": { lat: 54.6628683116, lon: -3.3651615338 },
  "p-colne": { lat: 53.8606013853, lon: -2.1693408358 },
  "p-cranbrook": { lat: 51.0913598479, lon: 0.5158643325 },
  "p-crieff": { lat: 56.3781501456, lon: -3.8456531953 },
  "p-cromer": { lat: 52.9297429174, lon: 1.3179508762 },
  "p-cupar": { lat: 56.3185683715, lon: -3.0130014616 },
  "p-dalkeith": { lat: 55.8936571035, lon: -3.0671408801 },
  "p-dalmally": { lat: 56.4023875579, lon: -4.9672731470 },
  "p-darley": { lat: 54.02393274, lon: -1.66888882 },
  "p-darlington": { lat: 54.5261078659, lon: -1.5472612610 },
  "p-daventry": { lat: 52.2514116056, lon: -1.1635297558 },
  "p-devizes": { lat: 51.3527556033, lon: -1.9930579835 },
  "p-dingwall": { lat: 57.60947527, lon: -4.42024975 },
  "p-dolgellau": { lat: 52.7427380876, lon: -3.8847895588 },
  "p-dorchester": { lat: 50.7131292535, lon: -2.4374625379 },
  "p-dover": { lat: 51.14012922, lon: 1.34064250 },
  "p-downham-market": { lat: 52.6051113239, lon: 0.3828676246 },
  "p-dumfries": { lat: 55.0779118619, lon: -3.6137598625 },
  "p-dunbar": { lat: 55.97679415, lon: -2.51915038 },
  "p-edinburgh-city": { lat: 55.9430381016, lon: -3.1703289016 },
  "p-elgin": { lat: 57.62930191, lon: -3.35016005 },
  "p-fakenham": { lat: 52.8307704416, lon: 0.8492118343 },
  "p-faringdon": { lat: 51.6540535677, lon: -1.5869737208 },
  "p-fordingbridge": { lat: 50.9268752528, lon: -1.7845304506 },
  "p-forfar": { lat: 56.63060014, lon: -2.88344444 },
  "p-forres": { lat: 57.6077682269, lon: -3.6087867844 },
  "p-fort-william": { lat: 56.83357446, lon: -5.10003285 },
  "p-fraserburgh": { lat: 57.6825914227, lon: -2.0023341221 },
  "p-frome": { lat: 51.4793955180, lon: -2.3104084047 },
  "p-fulford": { lat: 53.92552321, lon: -1.07043319 },
  "p-gainsborough": { lat: 53.39263832, lon: -0.76748822 },
  "p-galashiels": { lat: 55.62096492, lon: -2.79167867 },
  "p-gargrave": { lat: 53.97212986, lon: -2.09753201 },
  "p-girvan": { lat: 55.21559182, lon: -4.84728566 },
  "p-glastonbury": { lat: 51.1403528362, lon: -2.7273723173 },
  "p-grantham": { lat: 52.9045899487, lon: -0.6352233818 },
  "p-grassington": { lat: 54.06896582, lon: -2.01066082 },
  "p-great-yarmouth": { lat: 52.64456243, lon: 1.70293680 },
  "p-haddington": { lat: 55.9554931724, lon: -2.7767134128 },
  "p-hartlepool": { lat: 54.6568375481, lon: -1.2368847769 },
  "p-haverfordwest": { lat: 51.80312404, lon: -4.88247797 },
  "p-haverhill": { lat: 52.0864673592, lon: 0.4389218235 },
  "p-hawick": { lat: 55.4226703119, lon: -2.7886537935 },
  "p-heckmondwike": { lat: 53.72295261, lon: -1.67777240 },
  "p-helston": { lat: 50.0943724799, lon: -5.2768436426 },
  "p-hereford": { lat: 52.0441797832, lon: -2.7122137807 },
  "p-hertford": { lat: 51.7924425686, lon: -0.0713372552 },
  "p-holme-spalding": { lat: 53.7876113586, lon: -0.7416738498 },
  "p-holmfirth": { lat: 53.5350319116, lon: -1.7651990537 },
  "p-horton": { lat: 54.1475167578, lon: -2.2940581629 },
  "p-huntingdon": { lat: 52.3300150261, lon: -0.1815922539 },
  "p-huntly": { lat: 57.4460350116, lon: -2.7897184251 },
  "p-ilkley": { lat: 53.9253892658, lon: -1.8202736263 },
  "p-inveraray": { lat: 56.2296200065, lon: -5.0704081350 },
  "p-jedburgh": { lat: 55.4694741439, lon: -2.5630766905 },
  "p-keighley": { lat: 53.8748057377, lon: -1.9201131251 },
  "p-kelso": { lat: 55.5923007917, lon: -2.4315518400 },
  "p-kendal": { lat: 54.3346676736, lon: -2.7303114544 },
  "p-keyingham": { lat: 53.7012520298, lon: -0.1019472521 },
  "p-kilmarnock": { lat: 55.6116661572, lon: -4.4792347423 },
  "p-kingussie": { lat: 57.0808164152, lon: -4.0533499241 },
  "p-kintore": { lat: 57.2306772217, lon: -2.3362255116 },
  "p-kirby-hill": { lat: 54.1091791824, lon: -1.4193545421 },
  "p-kirby-moorside": { lat: 54.2684648128, lon: -0.9458846986 },
  "p-kirkcaldy": { lat: 56.1210339079, lon: -3.1516012075 },
  "p-kirkcudbright": { lat: 54.8334548960, lon: -4.0485272802 },
  "p-kyle": { lat: 57.3144493139, lon: -5.6893490652 },
  "p-lampeter": { lat: 52.1157771972, lon: -4.0721987115 },
  "p-lancaster": { lat: 54.0472384675, lon: -2.8017776941 },
  "p-langtoft": { lat: 54.0837243368, lon: -0.4658174079 },
  "p-launceston": { lat: 50.6323851175, lon: -4.3562552377 },
  "p-llandovery": { lat: 52.0027351920, lon: -3.7994850185 },
  "p-llanidloes": { lat: 52.4590625777, lon: -3.5511885157 },
  "p-lochgilphead": { lat: 56.0179043916, lon: -5.4514666825 },
  "p-longridge": { lat: 53.8443226992, lon: -2.5770546004 },
  "p-lostwithiel": { lat: 50.4075645852, lon: -4.6627502095 },
  "p-louth": { lat: 53.3426597173, lon: 0.0072217453 },
  "p-ludlow": { lat: 52.36503487, lon: -2.72984737 },
  "p-machynlleth": { lat: 52.5901099069, lon: -3.8596298252 },
  "p-maidstone": { lat: 51.27467893, lon: 0.57261266 },
  "p-malmesbury": { lat: 51.5680834326, lon: -2.0671846739 },
  "p-market-drayton": { lat: 52.9079287602, lon: -2.5066880341 },
  "p-market-rasen": { lat: 53.3750025630, lon: -0.3622754118 },
  "p-melrose": { lat: 55.5973895181, lon: -2.7243937180 },
  "p-middlesbrough": { lat: 54.5817223072, lon: -1.2836219675 },
  "p-middlesmoor": { lat: 54.1737807514, lon: -1.8705190070 },
  "p-montrose": { lat: 56.7057325637, lon: -2.4633294227 },
  "p-nairn": { lat: 57.5877399254, lon: -3.8449491061 },
  "p-nanpean": { lat: 50.2243382716, lon: -4.8409729447 },
  "p-new-buckenham": { lat: 52.4742258926, lon: 1.0851640202 },
  "p-newquay": { lat: 50.4349268440, lon: -5.0294765997 },
  "p-newton-stewart": { lat: 54.9573459570, lon: -4.4940584877 },
  "p-newtown-wales": { lat: 52.5209025463, lon: -3.3069311608 },
  "p-north-stainley": { lat: 54.1823112712, lon: -1.5873368762 },
  "p-north-walsham": { lat: 52.8434531818, lon: 1.3323062220 },
  "p-northallerton": { lat: 54.3149530793, lon: -1.4112361456 },
  "p-oban": { lat: 56.4659107749, lon: -5.3991536702 },
  "p-okehampton": { lat: 50.7270275698, lon: -4.0709443152 },
  "p-olney": { lat: 52.1024613826, lon: -0.6998458001 },
  "p-oundle": { lat: 52.4625753607, lon: -0.4014972126 },
  "p-peebles": { lat: 55.6568192556, lon: -3.2008723864 },
  "p-penrith": { lat: 54.6546329202, lon: -2.7701393728 },
  "p-penzance": { lat: 50.1309673042, lon: -5.5554756325 },
  "p-perth": { lat: 56.4732132674, lon: -3.4309167276 },
  "p-peterhead": { lat: 57.5062439047, lon: -1.7731916843 },
  "p-petersfield": { lat: 51.0122201919, lon: -0.9432496603 },
  "p-petworth": { lat: 50.9341824200, lon: -0.6339452590 },
  "p-pickering": { lat: 54.2495106557, lon: -0.7845994284 },
  "p-pitlochry": { lat: 56.6921185434, lon: -3.7390114061 },
  "p-pocklington": { lat: 53.9464593536, lon: -0.7181566561 },
  "p-prestwick": { lat: 55.49155680, lon: -4.62271669 },
  "p-rhayader": { lat: 52.2949252502, lon: -3.5206636144 },
  "p-ringwood": { lat: 50.8191740350, lon: -1.7533694593 },
  "p-sanquhar": { lat: 55.3731694273, lon: -3.9221399489 },
  "p-settle": { lat: 54.0621551094, lon: -2.2858153143 },
  "p-shepton-mallet": { lat: 51.1826881279, lon: -2.5682269958 },
  "p-skegness": { lat: 53.1647221900, lon: 0.3245950489 },
  "p-skipsea": { lat: 53.9758139177, lon: -0.2090383684 },
  "p-skirlaugh": { lat: 53.8445480892, lon: -0.2748414076 },
  "p-sleaford": { lat: 53.0271985057, lon: -0.3963569099 },
  "p-south-molton": { lat: 51.0057982270, lon: -3.8363122556 },
  "p-sowerby-bridge": { lat: 53.6860555321, lon: -1.9163814212 },
  "p-spalding": { lat: 52.7741081718, lon: -0.1198489866 },
  "p-st-andrews": { lat: 56.3294933428, lon: -2.7681226979 },
  "p-stanhope": { lat: 54.7600677750, lon: -2.0155079791 },
  "p-stockbridge": { lat: 51.11554794, lon: -1.45664063 },
  "p-stonehaven": { lat: 56.9369215365, lon: -2.2173929357 },
  "p-stratford": { lat: 52.16678688, lon: -1.83883675 },
  "p-strensall": { lat: 54.0328735090, lon: -1.0291077536 },
  "p-stroud": { lat: 51.7762580048, lon: -2.2473646895 },
  "p-sturminster-newton": { lat: 50.9140102210, lon: -2.2992323154 },
  "p-sudbury": { lat: 52.0573286544, lon: 0.7493792829 },
  "p-swaffham": { lat: 52.6700016847, lon: 0.6908113220 },
  "p-swindon": { lat: 51.5496356556, lon: -1.8286203363 },
  "p-tarbert": { lat: 55.8581826831, lon: -5.4305624160 },
  "p-tavistock": { lat: 50.5749499285, lon: -4.1546588721 },
  "p-tenterden": { lat: 51.0820248433, lon: 0.6729981999 },
  "p-thame": { lat: 51.7473534087, lon: -0.9576203426 },
  "p-thornton": { lat: 53.7961099467, lon: -1.8628776725 },
  "p-tiverton": { lat: 50.8940955458, lon: -3.5244848259 },
  "p-tockwith": { lat: 53.9641836910, lon: -1.3126924475 },
  "p-totnes": { lat: 50.4311105090, lon: -3.6752875669 },
  "p-troon": { lat: 55.5582860502, lon: -4.6587227010 },
  "p-truro": { lat: 50.2528444719, lon: -5.0539622042 },
  "p-tunstall": { lat: 53.7675626461, lon: -0.0112546669 },
  "p-turriff": { lat: 57.5432720212, lon: -2.4525305690 },
  "p-tyndrum": { lat: 56.4368829719, lon: -4.7131267498 },
  "p-ullapool": { lat: 57.8949602089, lon: -5.1668071419 },
  "p-ulverston": { lat: 54.1982997412, lon: -3.1005458676 },
  "p-wallingford": { lat: 51.6016478053, lon: -1.1411548165 },
  "p-wantage": { lat: 51.5816856296, lon: -1.4197844600 },
  "p-ware": { lat: 51.8123905948, lon: -0.0378438064 },
  "p-wareham": { lat: 50.6764078418, lon: -2.1004307782 },
  "p-welshpool": { lat: 52.6705539981, lon: -3.1456091052 },
  "p-whitehaven": { lat: 54.5549687462, lon: -3.5692253645 },
  "p-wick": { lat: 58.4692455607, lon: -3.0899205614 },
  "p-wigton": { lat: 54.8321868745, lon: -3.1673890307 },
  "p-workington": { lat: 54.6518453613, lon: -3.5351364269 },
  "p-wykeham": { lat: 54.2461648683, lon: -0.5250230615 },
};

const titleCasePostName = (id) => {
  if (postNameOverrides[id]) return postNameOverrides[id];

  const smallWords = new Set(["and", "in", "of", "on"]);
  const name = id
    .replace(/^p-/, "")
    .split("-")
    .map((part, index) => {
      if (smallWords.has(part) && index !== 0) return part;
      if (part === "st") return "St";
      return `${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    })
    .join(" ");

  return `${name} ROC Post`;
};

const clustersByGroup = clusters.reduce((groups, cluster) => {
  if (!groups.has(cluster.group)) groups.set(cluster.group, []);
  groups.get(cluster.group).push(cluster);
  return groups;
}, new Map());

const originalPostById = new Map(monitoringPosts.map((post) => [post.id, post]));
const postById = new Map(originalPostById);
const postClusterById = new Map();

const memberOffset = (anchor, memberIndex, memberCount) => {
  if (memberIndex === 0) return anchor;

  const radius = 0.028 + (memberIndex % 2) * 0.012;
  const angle = ((Math.PI * 2) / Math.max(memberCount, 2)) * memberIndex - Math.PI / 5;
  const lonScale = Math.max(0.35, Math.cos((anchor.lat * Math.PI) / 180));

  return {
    lat: anchor.lat + Math.sin(angle) * radius,
    lon: anchor.lon + (Math.cos(angle) * radius) / lonScale
  };
};

const fallbackClusterAnchor = (cluster) => {
  const control = groupControls.find((group) => group.group === cluster.group);
  const groupClusters = clustersByGroup.get(cluster.group) || [cluster];
  const index = Math.max(0, groupClusters.findIndex((item) => item.id === cluster.id));
  const angle = ((Math.PI * 2) / Math.max(groupClusters.length, 1)) * index - Math.PI / 2;
  const groupSpread = Math.min(0.55, 0.16 + groupClusters.length * 0.018);
  const center = control || { lat: 54.5, lon: -3.0 };
  const lonScale = Math.max(0.35, Math.cos((center.lat * Math.PI) / 180));

  return {
    lat: center.lat + Math.sin(angle) * groupSpread,
    lon: center.lon + (Math.cos(angle) * groupSpread) / lonScale
  };
};

const clusterAnchor = (cluster) => {
  const existingMembers = cluster.memberIds
    .map((id) => originalPostById.get(id))
    .filter((post) => post && Number.isFinite(post.lat) && Number.isFinite(post.lon));

  if (!existingMembers.length) return fallbackClusterAnchor(cluster);

  return {
    lat: existingMembers.reduce((total, post) => total + post.lat, 0) / existingMembers.length,
    lon: existingMembers.reduce((total, post) => total + post.lon, 0) / existingMembers.length
  };
};

clusters.forEach((cluster) => {
  const anchor = clusterAnchor(cluster);

  cluster.memberIds.forEach((postId, memberIndex) => {
    postClusterById.set(postId, cluster.id);

    const existingPost = postById.get(postId);
    if (existingPost) return;

    const archivedPoint = archivedPostCoordinates[postId];
    const point = archivedPoint || memberOffset(anchor, memberIndex, cluster.memberIds.length);
    const generatedPost = {
      id: postId,
      name: titleCasePostName(postId),
      group: cluster.group,
      lat: Number(point.lat.toFixed(4)),
      lon: Number(point.lon.toFixed(4)),
      status: archivedPoint ? archivedCoordinateStatus : generatedPostStatus,
      source: archivedPoint ? `${archivedCoordinateSource}; ${generatedPostSource}` : generatedPostSource,
      cluster: cluster.id
    };

    monitoringPosts.push(generatedPost);
    postById.set(postId, generatedPost);
  });
});

const clusterById = Object.fromEntries(clusters.map((c) => [c.id, c]));
const masterPostIds = new Set(clusters.map((c) => c.masterId));

const state = {
  controls: true,
  posts: true,
  selectedId: "g20",
  viewId: "group:20"
};

const svg = document.getElementById("roc-map");
const pointLayer = document.getElementById("roc-point-layer");
const linkLayer = document.getElementById("roc-link-layer");
const selectedPanel = document.getElementById("roc-selected");
const toggles = Array.from(document.querySelectorAll("[data-layer-toggle]"));
const calculatorForm = document.getElementById("roc-calculator");
const reportRows = Array.from(document.querySelectorAll("[data-report-row]"));
const calculatorOutput = document.getElementById("roc-calc-output");
const clearCalculatorButton = document.querySelector("[data-calc-clear]");
const sectorChipContainer = document.querySelector("[data-sector-chips]");
const groupChipContainer = document.querySelector("[data-group-chips]");
const allViewButton = document.querySelector("[data-view='all']");

const allSites = [
  ...groupControls.map((site) => ({ ...site, type: "control" })),
  ...monitoringPosts.map((site) => ({ ...site, type: "post", isMaster: masterPostIds.has(site.id) }))
];

const project = ({ lat, lon }) => ({
  x: ((lon - mapBounds.west) / (mapBounds.east - mapBounds.west)) * mapBounds.width + mapOverlayOffset.x,
  y: ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * mapBounds.height + mapOverlayOffset.y
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createSvgElement = (tag, attributes = {}) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
};

const clusterLayer = createSvgElement("g", { "aria-hidden": "true", class: "roc-cluster-layer" });
svg?.insertBefore(clusterLayer, pointLayer);

const fixLayer = createSvgElement("g", { "aria-hidden": "true", class: "roc-fix-layer" });
svg?.insertBefore(fixLayer, pointLayer);

const toRadians = (value) => (value * Math.PI) / 180;

const numberedPosts = monitoringPosts
  .filter((site) => site.number)
  .sort((first, second) => {
    const groupDiff = Number(first.group) - Number(second.group);
    if (groupDiff !== 0) return groupDiff;
    return Number(first.number) - Number(second.number);
  });

const toLocalPoint = (site, origin) => {
  const latKm = 110.574;
  const lonKm = 111.32 * Math.cos(toRadians(origin.lat));
  return {
    x: (site.lon - origin.lon) * lonKm,
    y: (site.lat - origin.lat) * latKm
  };
};

const fromLocalPoint = (point, origin) => {
  const latKm = 110.574;
  const lonKm = 111.32 * Math.cos(toRadians(origin.lat));
  return {
    lat: origin.lat + point.y / latKm,
    lon: origin.lon + point.x / lonKm
  };
};

const lineIntersection = (first, second, origin) => {
  const firstPoint = toLocalPoint(first.site, origin);
  const secondPoint = toLocalPoint(second.site, origin);
  const firstBearing = toRadians(first.bearing);
  const secondBearing = toRadians(second.bearing);
  const firstVector = { x: Math.sin(firstBearing), y: Math.cos(firstBearing) };
  const secondVector = { x: Math.sin(secondBearing), y: Math.cos(secondBearing) };
  const cross = firstVector.x * secondVector.y - firstVector.y * secondVector.x;
  if (Math.abs(cross) < 0.0001) return null;

  const delta = { x: secondPoint.x - firstPoint.x, y: secondPoint.y - firstPoint.y };
  const t = (delta.x * secondVector.y - delta.y * secondVector.x) / cross;
  return {
    x: firstPoint.x + firstVector.x * t,
    y: firstPoint.y + firstVector.y * t
  };
};

const calculateFix = (reports) => {
  const origin = {
    lat: reports.reduce((total, report) => total + report.site.lat, 0) / reports.length,
    lon: reports.reduce((total, report) => total + report.site.lon, 0) / reports.length
  };
  const intersections = [];

  reports.forEach((first, firstIndex) => {
    reports.slice(firstIndex + 1).forEach((second) => {
      const point = lineIntersection(first, second, origin);
      if (point) intersections.push({ point, pair: `${first.site.number}/${second.site.number}` });
    });
  });

  if (intersections.length < 2) return null;

  const mean = intersections.reduce(
    (total, intersection) => ({
      x: total.x + intersection.point.x / intersections.length,
      y: total.y + intersection.point.y / intersections.length
    }),
    { x: 0, y: 0 }
  );
  const fix = fromLocalPoint(mean, origin);
  const spread = intersections.reduce((largest, intersection) => {
    const distance = Math.hypot(intersection.point.x - mean.x, intersection.point.y - mean.y);
    return Math.max(largest, distance);
  }, 0);

  return { fix, intersections, spread, origin };
};

// ── Fix marker helpers ────────────────────────────────────────────────────────

const clearFixMarker = () => {
  while (fixLayer.firstChild) fixLayer.firstChild.remove();
};

const renderFixMarker = (result) => {
  clearFixMarker();
  if (!result) return;

  const { fix, intersections, spread, origin } = result;
  const center = project({ lat: fix.lat, lon: fix.lon });

  const midLat = (mapBounds.north + mapBounds.south) / 2;
  const lonKmPerDeg = 111.32 * Math.cos(midLat * Math.PI / 180);
  const pxPerKm = mapBounds.width / ((mapBounds.east - mapBounds.west) * lonKmPerDeg);
  const spreadPx = Math.max(5, spread * pxPerKm);

  fixLayer.append(createSvgElement("circle", {
    cx: center.x.toFixed(2), cy: center.y.toFixed(2),
    r: spreadPx.toFixed(2),
    class: "roc-fix-spread"
  }));

  intersections.forEach(({ point }) => {
    const pt = project(fromLocalPoint(point, origin));
    fixLayer.append(createSvgElement("line", {
      x1: pt.x.toFixed(2), y1: pt.y.toFixed(2),
      x2: center.x.toFixed(2), y2: center.y.toFixed(2),
      class: "roc-fix-pair-line"
    }));
    fixLayer.append(createSvgElement("circle", {
      cx: pt.x.toFixed(2), cy: pt.y.toFixed(2),
      r: "2.5",
      class: "roc-fix-pair"
    }));
  });

  const arm = 9;
  fixLayer.append(createSvgElement("line", {
    x1: (center.x - arm).toFixed(2), y1: center.y.toFixed(2),
    x2: (center.x + arm).toFixed(2), y2: center.y.toFixed(2),
    class: "roc-fix-crosshair"
  }));
  fixLayer.append(createSvgElement("line", {
    x1: center.x.toFixed(2), y1: (center.y - arm).toFixed(2),
    x2: center.x.toFixed(2), y2: (center.y + arm).toFixed(2),
    class: "roc-fix-crosshair"
  }));
};

const animateOutputRows = (container) => {
  const rows = Array.from(container.querySelectorAll(".roc-calc-result > div, .roc-calc-pairs > div"));
  rows.forEach((row, i) => {
    row.style.opacity = "0";
    row.style.transition = "opacity 0.15s";
    window.setTimeout(() => { row.style.opacity = "1"; }, (i + 1) * 90);
  });
};

const clearChildren = (node) => {
  if (!node) return;
  while (node.firstChild) node.firstChild.remove();
};

// ── View bounds (sectors / groups / all UK) ───────────────────────────────────

const fitBoundsToSites = (sites, paddingFactor = 0.18) => {
  if (!sites.length) {
    return { x: 0, y: 0, width: mapBounds.width, height: mapBounds.height };
  }
  const points = sites.map(project);
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = Math.max(maxX - minX, 1);
  const h = Math.max(maxY - minY, 1);
  const targetRatio = mapBounds.width / mapBounds.height;
  let width = w * (1 + paddingFactor * 2);
  let height = h * (1 + paddingFactor * 2);
  if (width / height < targetRatio) width = height * targetRatio;
  else height = width / targetRatio;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  let x = clamp(cx - width / 2, 0, Math.max(0, mapBounds.width - width));
  let y = clamp(cy - height / 2, 0, Math.max(0, mapBounds.height - height));
  if (width > mapBounds.width) { width = mapBounds.width; x = 0; }
  if (height > mapBounds.height) { height = mapBounds.height; y = 0; }
  return { x, y, width, height };
};

const computeViewBox = (viewId) => {
  if (viewId === "all") {
    return { x: 0, y: 0, width: mapBounds.width, height: mapBounds.height };
  }
  if (viewId.startsWith("sector:")) {
    const sectorId = viewId.slice(7);
    const groupsInSector = groupControls.filter((g) => g.sector === sectorId);
    const postsInSector = monitoringPosts.filter((p) =>
      groupsInSector.some((g) => g.group === p.group)
    );
    return fitBoundsToSites([...groupsInSector, ...postsInSector], 0.22);
  }
  if (viewId.startsWith("group:")) {
    const groupNum = viewId.slice(6);
    const ctrl = groupControls.find((g) => g.group === groupNum);
    const postsInGroup = monitoringPosts.filter((p) => p.group === groupNum);
    const sites = ctrl ? [ctrl, ...postsInGroup] : postsInGroup;
    return fitBoundsToSites(sites, 0.18);
  }
  return { x: 0, y: 0, width: mapBounds.width, height: mapBounds.height };
};

// ── Map rendering ─────────────────────────────────────────────────────────────

const renderLinks = () => {
  clearChildren(linkLayer);
  if (!state.controls || !state.posts) return;
  if (!state.viewId.startsWith("group:")) return;
  const groupNum = state.viewId.slice(6);
  const control = groupControls.find((g) => g.group === groupNum);
  if (!control) return;

  monitoringPosts
    .filter((p) => p.group === groupNum && masterPostIds.has(p.id))
    .forEach((post) => {
      const start = project(post);
      const end = project(control);
      linkLayer.append(
        createSvgElement("line", {
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          class: "roc-link",
          "vector-effect": "non-scaling-stroke"
        })
      );
    });
};

const renderClusters = () => {
  clearChildren(clusterLayer);
  if (!state.posts) return;
  if (!state.viewId.startsWith("group:")) return;

  const groupNum = state.viewId.slice(6);
  const groupClusters = clusters.filter((c) => c.group === groupNum);

  groupClusters.forEach((cluster) => {
    const members = cluster.memberIds
      .map((id) => monitoringPosts.find((p) => p.id === id))
      .filter(Boolean);
    if (members.length < 2) return;

    if (members.length === 2) {
      const [a, b] = members.map(project);
      clusterLayer.append(createSvgElement("line", {
        x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        class: "roc-cluster-line",
        "vector-effect": "non-scaling-stroke"
      }));
      return;
    }

    const points = members.map(project).map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    clusterLayer.append(createSvgElement("polygon", {
      points,
      class: "roc-cluster-line",
      "vector-effect": "non-scaling-stroke"
    }));
  });
};

const renderPoints = () => {
  clearChildren(pointLayer);

  // Compute dot radius so dots stay a fixed physical pixel size at every zoom
  // level. We derive how many SVG user units equal 1 screen pixel from the
  // current viewBox width and the rendered SVG element width.
  const vbWidth = computeViewBox(state.viewId).width;
  const svgPxWidth = (svg instanceof SVGSVGElement ? svg.getBoundingClientRect().width : 0) || 600;
  const unitsPerPx = vbWidth / svgPxWidth;

  // Target physical sizes (screen pixels).
  const R = {
    control: 6.5 * unitsPerPx,
    master:  5.0 * unitsPerPx,
    post:    3.8 * unitsPerPx
  };

  // Only show post dots when zoomed into a specific Group — at sector/all-UK
  // scale there are too many to be useful and they clutter the controls.
  const inGroupView = state.viewId.startsWith("group:");
  const groupNum = inGroupView ? state.viewId.slice(6) : null;

  allSites.forEach((site) => {
    if (site.type === "control" && !state.controls) return;
    if (site.type === "post" && !state.posts) return;
    // Posts only visible in group view, and only for the active group
    if (site.type === "post" && !inGroupView) return;
    if (site.type === "post" && inGroupView && site.group !== groupNum) return;

    const point = project(site);
    const isCtrl   = site.type === "control";
    const isMaster = !isCtrl && site.isMaster;
    let roleClass = `roc-point-${site.type}`;
    if (isMaster) roleClass += " roc-point-master";
    const role = isCtrl ? "Group Control" : isMaster ? "Cluster master post" : "Monitoring post";

    const button = createSvgElement("g", {
      class: `roc-point ${roleClass}${state.selectedId === site.id ? " is-selected" : ""}`,
      tabindex: "0",
      role: "button",
      "aria-label": `${site.name}, ${role}`,
      "data-site-id": site.id,
      transform: `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`
    });

    const baseR  = isCtrl ? R.control : isMaster ? R.master : R.post;
    const radius = baseR.toFixed(2);
    const hitPad = parseFloat(radius) + 4;

    button.append(createSvgElement("rect", {
      class: "roc-point-hit",
      x: -hitPad, y: -hitPad,
      width: hitPad * 2 + parseFloat(radius) * 3,
      height: hitPad * 2
    }));
    button.append(createSvgElement("circle", { r: radius }));

    if (isCtrl || site.number) {
      const label = createSvgElement("text", {
        x: (parseFloat(radius) + 2.2).toFixed(1),
        y: (parseFloat(radius) * 0.38).toFixed(1)
      });
      // font-size in SVG user units (no "px") — scales with the viewBox
      label.setAttribute("font-size", (parseFloat(radius) * 2.1).toFixed(1));
      label.textContent = isCtrl ? site.group : site.number;
      button.append(label);
    }

    pointLayer.append(button);
  });
};

const makeDlRow = (label, value) => {
  const div = document.createElement("div");
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value;
  div.append(dt, dd);
  return div;
};

const sectorName = (sectorId) => sectors.find((s) => s.id === sectorId)?.name || "—";

const renderSelected = () => {
  const site = allSites.find((item) => item.id === state.selectedId) || allSites[0];
  if (!site || !(selectedPanel instanceof HTMLElement)) return;

  const isControl = site.type === "control";
  const isMaster = !isControl && site.isMaster;

  const kicker = document.createElement("p");
  kicker.className = "roc-kicker";
  kicker.textContent = isControl ? "Group Control" : isMaster ? "Cluster master post" : "Monitoring Post";

  const heading = document.createElement("h3");
  heading.textContent = site.name;

  const dl = document.createElement("dl");
  dl.append(makeDlRow("Area", site.place || site.name));

  if (site.number) dl.append(makeDlRow("Post No.", site.number));

  dl.append(makeDlRow("Group", `No. ${site.group}`));
  if (isControl) {
    dl.append(makeDlRow("Sector", sectorName(site.sector)));
  } else {
    dl.append(makeDlRow("Status", site.status || "—"));
    const clusterId = site.cluster || postClusterById.get(site.id);
    if (clusterId) {
      const cluster = clusterById[clusterId];
      if (cluster) {
        const master = monitoringPosts.find((p) => p.id === cluster.masterId);
        dl.append(makeDlRow(
          "Cluster",
          `${master ? master.name.replace(" ROC Post", "") : "—"} (${cluster.memberIds.length} posts)`
        ));
        const fellow = cluster.memberIds
          .filter((id) => id !== site.id)
          .map((id) => monitoringPosts.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => p.name.replace(" ROC Post", ""))
          .join(", ");
        if (fellow) dl.append(makeDlRow("With", fellow));
      }
    }
  }

  if (!isControl) {
    dl.append(makeDlRow("Instruments", "GZI · FSM · BPI"));
    dl.append(makeDlRow("Depth", "Approx. 14 ft underground"));
    const coords = `${site.lat.toFixed(4)}°N, ${Math.abs(site.lon).toFixed(4)}°${site.lon < 0 ? "W" : "E"}`;
    dl.append(makeDlRow("Coordinates", coords));
  }

  dl.append(makeDlRow("Active period", "1955 – 1991"));

  const source = document.createElement("p");
  source.className = "roc-selected-source";
  source.textContent = `Source: ${site.source || (isControl ? "SubBrit Group HQ list" : "ringbell.co.uk March 1989 map · SubBrit")}`;

  selectedPanel.replaceChildren(kicker, heading, dl, source);
};

const renderMapView = () => {
  if (!(svg instanceof SVGSVGElement)) return;
  const view = computeViewBox(state.viewId);
  svg.setAttribute("viewBox", `${view.x.toFixed(2)} ${view.y.toFixed(2)} ${view.width.toFixed(2)} ${view.height.toFixed(2)}`);
  svg.dataset.viewScale = state.viewId === "all" ? "all" : state.viewId.startsWith("sector:") ? "sector" : "group";
};

const render = () => {
  renderMapView();
  renderLinks();
  renderClusters();
  renderPoints();
  renderSelected();
};

const selectSite = (siteId) => {
  if (!allSites.some((site) => site.id === siteId)) return;
  state.selectedId = siteId;
  render();
};

// ── Sector / Group navigation UI ──────────────────────────────────────────────

const groupsBySector = sectors.map((s) => ({
  ...s,
  groups: groupControls
    .filter((g) => g.sector === s.id)
    .sort((a, b) => Number(a.group) - Number(b.group))
}));

const updateNavActiveStates = () => {
  if (allViewButton instanceof HTMLButtonElement) {
    allViewButton.classList.toggle("is-active", state.viewId === "all");
    allViewButton.setAttribute("aria-pressed", state.viewId === "all" ? "true" : "false");
  }
  if (sectorChipContainer) {
    Array.from(sectorChipContainer.querySelectorAll("[data-sector]")).forEach((btn) => {
      const sectorId = btn.getAttribute("data-sector");
      const inGroupView = state.viewId.startsWith("group:") &&
        groupControls.find((g) => g.group === state.viewId.slice(6))?.sector === sectorId;
      const active = state.viewId === `sector:${sectorId}` || inGroupView;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  if (groupChipContainer) {
    Array.from(groupChipContainer.querySelectorAll("[data-group]")).forEach((btn) => {
      const groupNum = btn.getAttribute("data-group");
      const active = state.viewId === `group:${groupNum}`;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
};

const renderGroupChips = (sectorId) => {
  if (!(groupChipContainer instanceof HTMLElement)) return;
  const sector = groupsBySector.find((s) => s.id === sectorId);
  clearChildren(groupChipContainer);
  if (!sector || !sector.groups.length) {
    groupChipContainer.hidden = true;
    return;
  }
  groupChipContainer.hidden = false;
  sector.groups.forEach((g) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "roc-chip roc-chip-group";
    btn.dataset.group = g.group;
    btn.setAttribute("aria-pressed", "false");
    // Show the well-known city name. For "Acomb, York" take the part after the
    // comma; for "Preston / Goosnargh" take the part before the slash.
    const byComma = g.place.split(/, /);
    const city = byComma.length > 1
      ? byComma[byComma.length - 1].trim()
      : g.place.split(/ \/ /)[0].trim();
    btn.textContent = city;
    btn.title = `Group ${g.group} — ${g.name}`;
    groupChipContainer.append(btn);
  });
};

const setView = (viewId) => {
  state.viewId = viewId;
  if (viewId.startsWith("sector:")) {
    renderGroupChips(viewId.slice(7));
  } else if (viewId.startsWith("group:")) {
    const ctrl = groupControls.find((g) => g.group === viewId.slice(6));
    if (ctrl) {
      renderGroupChips(ctrl.sector);
      state.selectedId = ctrl.id;
    }
  } else if (groupChipContainer instanceof HTMLElement) {
    groupChipContainer.hidden = true;
    clearChildren(groupChipContainer);
  }
  updateNavActiveStates();
  render();
};

const buildSectorChips = () => {
  if (!(sectorChipContainer instanceof HTMLElement)) return;
  clearChildren(sectorChipContainer);
  groupsBySector.forEach((s) => {
    if (!s.groups.length) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "roc-chip roc-chip-sector";
    btn.dataset.sector = s.id;
    btn.setAttribute("aria-pressed", "false");
    btn.textContent = s.name.replace(" Sector", "");
    btn.title = s.name;
    sectorChipContainer.append(btn);
  });
};

// ── Calculator ────────────────────────────────────────────────────────────────

const populateCalculator = () => {
  reportRows.forEach((row) => {
    const select = row.querySelector("[data-report-post]");
    if (!(select instanceof HTMLSelectElement)) return;
    clearChildren(select);

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Post number";
    select.append(placeholder);

    const group20Posts = numberedPosts.filter((s) => s.group === "20");
    const otherPosts = numberedPosts.filter((s) => s.group !== "20");

    if (group20Posts.length) {
      const og = document.createElement("optgroup");
      og.label = "Group 20 — York";
      group20Posts.forEach((site) => {
        const isMaster = masterPostIds.has(site.id);
        const option = document.createElement("option");
        option.value = site.id;
        option.textContent = `${site.number} - ${site.name.replace(" ROC Post", "")}${isMaster ? " (master)" : ""}`;
        og.append(option);
      });
      select.append(og);
    }

    if (otherPosts.length) {
      const og = document.createElement("optgroup");
      og.label = "Other groups";
      otherPosts.forEach((site) => {
        const option = document.createElement("option");
        option.value = site.id;
        option.textContent = `${site.number} - ${site.name.replace(" ROC Post", "")} (Grp ${site.group})`;
        og.append(option);
      });
      select.append(og);
    }
  });
};

const setCalculatorMessage = (message, tone = "neutral") => {
  if (!(calculatorOutput instanceof HTMLElement)) return;
  calculatorOutput.dataset.tone = tone;
  const span = document.createElement("span");
  span.textContent = message;
  calculatorOutput.replaceChildren(span);
};

const readCalculatorReports = () =>
  reportRows.map((row) => {
    const select = row.querySelector("[data-report-post]");
    const input = row.querySelector("[data-report-bearing]");
    const site = select instanceof HTMLSelectElement
      ? monitoringPosts.find((item) => item.id === select.value)
      : null;
    const bearing = input instanceof HTMLInputElement ? Number(input.value) : Number.NaN;
    return { site, bearing };
  });

const buildResultRow = (label, value) => {
  const div = document.createElement("div");
  const span = document.createElement("span");
  span.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value;
  div.append(span, strong);
  return div;
};

const renderCalculatorResult = (result, reports) => {
  const origin = {
    lat: reports.reduce((total, report) => total + report.site.lat, 0) / reports.length,
    lon: reports.reduce((total, report) => total + report.site.lon, 0) / reports.length
  };

  calculatorOutput.dataset.tone = "ready";

  const summary = document.createElement("div");
  summary.className = "roc-calc-result";
  summary.append(
    buildResultRow("Mean fix", `${result.fix.lat.toFixed(4)}, ${result.fix.lon.toFixed(4)}`),
    buildResultRow("Spread", `${result.spread.toFixed(2)} km`),
    buildResultRow("Fix status", "Ready for site identification")
  );

  const pairs = document.createElement("div");
  pairs.className = "roc-calc-pairs";
  result.intersections.forEach((intersection) => {
    const fix = fromLocalPoint(intersection.point, origin);
    pairs.append(buildResultRow(intersection.pair, `${fix.lat.toFixed(4)}, ${fix.lon.toFixed(4)}`));
  });

  calculatorOutput.replaceChildren(summary, pairs);
};

calculatorForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const reports = readCalculatorReports();
  if (reports.some((report) => !report.site || !Number.isFinite(report.bearing))) {
    setCalculatorMessage("Enter three numbered posts and true bearings.", "warn");
    return;
  }
  if (new Set(reports.map((report) => report.site.id)).size !== reports.length) {
    setCalculatorMessage("Each report must use a different post.", "warn");
    return;
  }
  if (reports.some((report) => report.bearing < 0 || report.bearing >= 360)) {
    setCalculatorMessage("Bearings must be between 0 and 359.9 degrees.", "warn");
    return;
  }

  const result = calculateFix(reports);
  if (!result) {
    setCalculatorMessage("Reports do not produce a stable intersection.", "warn");
    return;
  }

  renderCalculatorResult(result, reports);
  renderFixMarker(result);
  animateOutputRows(calculatorOutput);

  if (result.spread < 3.5) {
    console.log(
      "%c[ROC_CONTROL] SIGNAL QUALITY: HIGH — secondary acknowledge",
      "color: #6ef2aa; font-family: monospace; font-weight: bold",
      "\nP2P{RAVEN_GLASS_OPERATOR}"
    );
  }
});

clearCalculatorButton?.addEventListener("click", () => {
  reportRows.forEach((row) => {
    const select = row.querySelector("[data-report-post]");
    const input = row.querySelector("[data-report-bearing]");
    if (select instanceof HTMLSelectElement) select.value = "";
    if (input instanceof HTMLInputElement) {
      input.value = "";
      input.classList.remove("is-error");
      input.removeAttribute("aria-invalid");
    }
  });
  clearFixMarker();
  setCalculatorMessage("Awaiting three post reports.");
});

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const key = toggle.dataset.layerToggle;
    if (!key || !(key in state)) return;
    state[key] = !state[key];
    toggle.classList.toggle("is-active", Boolean(state[key]));
    render();
  });
});

// ── Navigation event wiring ───────────────────────────────────────────────────

allViewButton?.addEventListener("click", () => setView("all"));

sectorChipContainer?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-sector]") : null;
  if (!(target instanceof HTMLElement)) return;
  const sectorId = target.getAttribute("data-sector");
  if (sectorId) setView(`sector:${sectorId}`);
});

groupChipContainer?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-group]") : null;
  if (!(target instanceof HTMLElement)) return;
  const groupNum = target.getAttribute("data-group");
  if (groupNum) setView(`group:${groupNum}`);
});

svg?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-site-id]") : null;
  if (!(target instanceof Element)) return;
  selectSite(target.getAttribute("data-site-id") || "");
});

svg?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const target = event.target instanceof Element ? event.target.closest("[data-site-id]") : null;
  if (!(target instanceof Element)) return;
  event.preventDefault();
  selectSite(target.getAttribute("data-site-id") || "");
});

// ── Init ──────────────────────────────────────────────────────────────────────

buildSectorChips();
populateCalculator();
const initialCtrl = groupControls.find((g) => g.group === "20");
if (initialCtrl) renderGroupChips(initialCtrl.sector);
updateNavActiveStates();
render();

reportRows.forEach((row) => {
  const input = row.querySelector("[data-report-bearing]");
  if (!(input instanceof HTMLInputElement)) return;
  input.addEventListener("input", () => {
    if (!input.value.trim()) {
      input.classList.remove("is-error");
      input.removeAttribute("aria-invalid");
      return;
    }
    const val = Number(input.value);
    const invalid = !Number.isFinite(val) || val < 0 || val >= 360;
    input.classList.toggle("is-error", invalid);
    if (invalid) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  });
});
