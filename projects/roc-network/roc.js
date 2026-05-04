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
  { id: "c21-blackburn",   group: "21", masterId: "p-blackburn",   memberIds: ["p-blackburn",   "p-clitheroe",    "p-burnley"] },
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
  { id: "c31-armagh",      group: "31", masterId: "p-armagh",      memberIds: ["p-armagh",      "p-newry",        "p-downpatrick"] }
];

const monitoringPosts = [
  // Group 5 — Watford (Metropolitan)
  { id: "p-northolt",   name: "Northolt ROC Post",   group: "5", number: "62", lat: 51.553, lon: -0.418, status: "Opened 1967, closed 1991" },
  { id: "p-bowes-park", name: "Bowes Park ROC Post", group: "5", number: "61", lat: 51.594, lon: -0.125, status: "Opened 1964, closed 1991" },
  { id: "p-dulwich",    name: "Dulwich ROC Post",    group: "5", number: "15", lat: 51.437, lon: -0.071, status: "Opened 1965, closed 1991" },

  // Representative posts — 2–3 per group for national coverage.
  // Group 1 — Maidstone (Metropolitan)
  { id: "p-dover",        name: "Dover ROC Post",          group: "1",  number: "7",  lat: 51.127, lon:  1.315, status: "Publicly listed ROC post" },
  { id: "p-sevenoaks",    name: "Sevenoaks ROC Post",      group: "1",  number: "22", lat: 51.276, lon:  0.187, status: "Publicly listed ROC post" },
  { id: "p-tonbridge",    name: "Tonbridge ROC Post",      group: "1",  number: "31", lat: 51.195, lon:  0.276, status: "Publicly listed ROC post" },
  // Group 2 — Horsham (Metropolitan)
  { id: "p-crawley",      name: "Crawley ROC Post",        group: "2",  number: "14", lat: 51.109, lon: -0.188, status: "Publicly listed ROC post" },
  { id: "p-billingshurst",name: "Billingshurst ROC Post",  group: "2",  number: "26", lat: 51.016, lon: -0.453, status: "Publicly listed ROC post" },
  { id: "p-lewes",        name: "Lewes ROC Post",          group: "2",  number: "37", lat: 50.875, lon:  0.014, status: "Publicly listed ROC post" },
  // Group 3 — Oxford (Metropolitan)
  { id: "p-faringdon",    name: "Faringdon ROC Post",      group: "3",  number: "9",  lat: 51.657, lon: -1.581, status: "Publicly listed ROC post" },
  { id: "p-wallingford",  name: "Wallingford ROC Post",    group: "3",  number: "18", lat: 51.600, lon: -1.123, status: "Publicly listed ROC post" },
  { id: "p-chipping-norton",name:"Chipping Norton ROC Post",group:"3",  number: "28", lat: 51.942, lon: -1.541, status: "Publicly listed ROC post" },
  // Group 4 — Colchester (Metropolitan)
  { id: "p-ipswich",      name: "Ipswich ROC Post",        group: "4",  number: "33", lat: 52.059, lon:  1.155, status: "Publicly listed ROC post" },
  { id: "p-witham",       name: "Witham ROC Post",         group: "4",  number: "21", lat: 51.799, lon:  0.639, status: "Publicly listed ROC post" },
  { id: "p-halstead",     name: "Halstead ROC Post",       group: "4",  number: "12", lat: 51.944, lon:  0.647, status: "Publicly listed ROC post" },
  // Group 6 — Norwich (Midland)
  { id: "p-new-buckenham",name: "New Buckenham ROC Post",  group: "6",  number: "39", lat: 52.470, lon:  1.070, status: "Publicly listed ROC post" },
  { id: "p-dereham",      name: "Dereham ROC Post",        group: "6",  number: "24", lat: 52.681, lon:  0.940, status: "Publicly listed ROC post" },
  { id: "p-beccles",      name: "Beccles ROC Post",        group: "6",  number: "47", lat: 52.461, lon:  1.559, status: "Publicly listed ROC post" },
  // Group 7 — Bedford (Midland)
  { id: "p-olney",        name: "Olney ROC Post",          group: "7",  number: "35", lat: 52.156, lon: -0.704, status: "Opened 1964, closed 1991" },
  { id: "p-luton",        name: "Luton ROC Post",          group: "7",  number: "12", lat: 51.879, lon: -0.416, status: "Publicly listed ROC post" },
  { id: "p-huntingdon",   name: "Huntingdon ROC Post",     group: "7",  number: "48", lat: 52.330, lon: -0.188, status: "Publicly listed ROC post" },
  // Group 8 — Coventry (Midland)
  { id: "p-meriden",      name: "Meriden ROC Post",        group: "8",  number: "31", lat: 52.431, lon: -1.638, status: "Opened 1965, closed 1991" },
  { id: "p-leamington",   name: "Leamington Spa ROC Post", group: "8",  number: "18", lat: 52.291, lon: -1.537, status: "Publicly listed ROC post" },
  { id: "p-rugby",        name: "Rugby ROC Post",          group: "8",  number: "24", lat: 52.375, lon: -1.266, status: "Publicly listed ROC post" },
  // Group 9 — Yeovil (Southern)
  { id: "p-sherborne",    name: "Sherborne ROC Post",      group: "9",  number: "19", lat: 50.947, lon: -2.516, status: "Publicly listed ROC post" },
  { id: "p-bridport",     name: "Bridport ROC Post",       group: "9",  number: "25", lat: 50.733, lon: -2.759, status: "Publicly listed ROC post" },
  { id: "p-blandford",    name: "Blandford Forum ROC Post",group: "9",  number: "31", lat: 50.862, lon: -2.163, status: "Publicly listed ROC post" },
  // Group 10 — Exeter (Southern)
  { id: "p-okehampton",   name: "Okehampton ROC Post",     group: "10", number: "18", lat: 50.738, lon: -4.003, status: "Publicly listed ROC post" },
  { id: "p-totnes",       name: "Totnes ROC Post",         group: "10", number: "27", lat: 50.431, lon: -3.683, status: "Publicly listed ROC post" },
  { id: "p-honiton",      name: "Honiton ROC Post",        group: "10", number: "34", lat: 50.800, lon: -3.189, status: "Publicly listed ROC post" },
  // Group 11 — Truro (Southern)
  { id: "p-nanpean",      name: "Nanpean ROC Post",        group: "11", number: "44", lat: 50.352, lon: -4.934, status: "Publicly listed ROC post" },
  { id: "p-bodmin",       name: "Bodmin ROC Post",         group: "11", number: "29", lat: 50.467, lon: -4.716, status: "Publicly listed ROC post" },
  { id: "p-liskeard",     name: "Liskeard ROC Post",       group: "11", number: "17", lat: 50.455, lon: -4.465, status: "Publicly listed ROC post" },
  // Group 12 — Bristol (Southern)
  { id: "p-long-ashton",  name: "Long Ashton ROC Post",    group: "12", number: "23", lat: 51.428, lon: -2.667, status: "Publicly listed ROC post" },
  { id: "p-bath",         name: "Bath ROC Post",           group: "12", number: "11", lat: 51.381, lon: -2.360, status: "Publicly listed ROC post" },
  { id: "p-weston",       name: "Weston-super-Mare ROC Post",group:"12",number: "34", lat: 51.342, lon: -2.977, status: "Publicly listed ROC post" },
  // Group 13 — Carmarthen / South Wales (Southern)
  { id: "p-carmarthen",   name: "Carmarthen ROC Post",     group: "13", number: "38", lat: 51.855, lon: -4.307, status: "Publicly listed ROC post" },
  { id: "p-swansea",      name: "Swansea ROC Post",        group: "13", number: "15", lat: 51.621, lon: -3.943, status: "Publicly listed ROC post" },
  { id: "p-haverfordwest",name: "Haverfordwest ROC Post",  group: "13", number: "51", lat: 51.802, lon: -4.969, status: "Publicly listed ROC post" },
  // Group 14 — Winchester (Southern)
  { id: "p-overton-hants",name: "Overton ROC Post",        group: "14", number: "20", lat: 51.244, lon: -1.263, status: "Publicly listed ROC post" },
  { id: "p-basingstoke",  name: "Basingstoke ROC Post",    group: "14", number: "8",  lat: 51.266, lon: -1.087, status: "Publicly listed ROC post" },
  { id: "p-petersfield",  name: "Petersfield ROC Post",    group: "14", number: "32", lat: 51.005, lon: -0.933, status: "Publicly listed ROC post" },
  // Group 15 — Lincoln (Eastern)
  { id: "p-hackthorn",    name: "Hackthorn ROC Post",      group: "15", number: "41", lat: 53.333, lon: -0.504, status: "Publicly listed ROC post" },
  { id: "p-louth",        name: "Louth ROC Post",          group: "15", number: "22", lat: 53.367, lon: -0.001, status: "Publicly listed ROC post" },
  { id: "p-spalding",     name: "Spalding ROC Post",       group: "15", number: "14", lat: 52.788, lon: -0.153, status: "Publicly listed ROC post" },
  // Group 16 — Shrewsbury (Midland)
  { id: "p-upton-magna",  name: "Upton Magna ROC Post",    group: "16", number: "19", lat: 52.711, lon: -2.665, status: "Publicly listed ROC post" },
  { id: "p-stafford",     name: "Stafford ROC Post",       group: "16", number: "33", lat: 52.806, lon: -2.121, status: "Publicly listed ROC post" },
  { id: "p-ludlow",       name: "Ludlow ROC Post",         group: "16", number: "27", lat: 52.367, lon: -2.717, status: "Publicly listed ROC post" },
  // Group 17 — Wrexham / North Wales (Western)
  { id: "p-llanrhaiadr",  name: "Llanrhaiadr ROC Post",    group: "17", number: "24", lat: 52.850, lon: -3.300, status: "Publicly listed ROC post" },
  { id: "p-aberystwyth",  name: "Aberystwyth ROC Post",    group: "17", number: "11", lat: 52.416, lon: -4.082, status: "Publicly listed ROC post" },
  { id: "p-colwyn-bay",   name: "Colwyn Bay ROC Post",     group: "17", number: "37", lat: 53.294, lon: -3.720, status: "Publicly listed ROC post" },
  // Group 18 — Leeds (Eastern)
  { id: "p-wetherby",     name: "Wetherby ROC Post",       group: "18", number: "15", lat: 53.909, lon: -1.388, status: "Publicly listed ROC post" },
  { id: "p-dewsbury",     name: "Dewsbury ROC Post",       group: "18", number: "34", lat: 53.692, lon: -1.632, status: "Publicly listed ROC post" },
  { id: "p-ilkley",       name: "Ilkley ROC Post",         group: "18", number: "22", lat: 53.924, lon: -1.830, status: "Publicly listed ROC post" },

  // Group 20 — York. Full network as shown on the ringbell.co.uk March 1989
  // map. Cluster assignments follow the green sector lines on that map.
  // Tunstall cluster (master 20/M2, 1975–1991)
  { id: "p-tunstall",       name: "Tunstall ROC Post",       group: "20", number: "55", lat: 53.7660, lon: -0.0110, status: "Opened 1959, closed 1991. Master post 20/M2.", cluster: "c20-tunstall" },
  { id: "p-keyingham",      name: "Keyingham ROC Post",      group: "20", number: "56", lat: 53.7135, lon: -0.1125, status: "Opened 1965, closed 1991", cluster: "c20-tunstall" },
  { id: "p-skirlaugh",      name: "Skirlaugh ROC Post",      group: "20", number: "57", lat: 53.8394, lon: -0.2664, status: "Opened 1959, closed 1991", cluster: "c20-tunstall" },
  // Bridlington cluster
  { id: "p-bridlington",    name: "Bridlington ROC Post",    group: "20", number: "20", lat: 54.0850, lon: -0.1980, status: "Opened 1958, closed 1991. Master post.", cluster: "c20-bridlington" },
  { id: "p-skipsea",        name: "Skipsea ROC Post",        group: "20", number: "21", lat: 53.9783, lon: -0.2203, status: "Opened 1959, closed 1991", cluster: "c20-bridlington" },
  { id: "p-langtoft",       name: "Langtoft ROC Post",       group: "20", number: "22", lat: 54.0630, lon: -0.4340, status: "Opened 1959, closed 1991", cluster: "c20-bridlington" },
  // Pickering cluster
  { id: "p-pickering",      name: "Pickering ROC Post",      group: "20", number: "17", lat: 54.2470, lon: -0.7760, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-pickering" },
  { id: "p-kirby-moorside", name: "Kirby Moorside ROC Post", group: "20", number: "16", lat: 54.2720, lon: -0.9270, status: "Opened 1960, closed 1991", cluster: "c20-pickering" },
  { id: "p-wykeham",        name: "Wykeham ROC Post",        group: "20", number: "23", lat: 54.2300, lon: -0.5390, status: "Opened 1961, closed 1991", cluster: "c20-pickering" },
  // Pocklington cluster
  { id: "p-pocklington",    name: "Pocklington ROC Post",    group: "20", number: "35", lat: 53.9290, lon: -0.7760, status: "Opened 1958, closed 1991. Master post.", cluster: "c20-pocklington" },
  { id: "p-fulford",        name: "Fulford ROC Post",        group: "20", number: "47", lat: 53.9370, lon: -1.0610, status: "Opened 1965, closed 1991", cluster: "c20-pocklington" },
  { id: "p-tockwith",       name: "Tockwith ROC Post",       group: "20", number: "36", lat: 53.9640, lon: -1.2910, status: "Opened 1958, closed 1991", cluster: "c20-pocklington" },
  // Beverley cluster
  { id: "p-beverley",       name: "Beverley ROC Post",       group: "20", number: "51", lat: 53.8470, lon: -0.4280, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-beverley" },
  { id: "p-holme-spalding", name: "Holme-on-Spalding-Moor ROC Post", group: "20", number: "50", lat: 53.8340, lon: -0.7550, status: "Opened 1960, closed 1991", cluster: "c20-beverley" },
  { id: "p-gilberdyke",     name: "Gilberdyke ROC Post",     group: "20", number: "52", lat: 53.7470, lon: -0.7080, status: "Opened 1965, closed 1991", cluster: "c20-beverley" },
  // Strensall cluster
  { id: "p-strensall",      name: "Strensall ROC Post",      group: "20", number: "38", lat: 54.0400, lon: -1.0400, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-strensall" },
  { id: "p-brandsby",       name: "Brandsby ROC Post",       group: "20", number: "37", lat: 54.1240, lon: -1.1030, status: "Opened 1960, closed 1991", cluster: "c20-strensall" },
  { id: "p-birdsall",       name: "Birdsall ROC Post",       group: "20", number: "15", lat: 54.0460, lon: -0.6790, status: "Opened 1965, closed 1991", cluster: "c20-strensall" },
  // Northallerton cluster
  { id: "p-northallerton",  name: "Northallerton ROC Post",  group: "20", number: "10", lat: 54.3390, lon: -1.4340, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-northallerton" },
  { id: "p-bedale",         name: "Bedale ROC Post",         group: "20", number: "11", lat: 54.2910, lon: -1.5950, status: "Opened 1959, closed 1991", cluster: "c20-northallerton" },
  // Middlesmoor cluster
  { id: "p-middlesmoor",    name: "Middlesmoor ROC Post",    group: "20", number: "33", lat: 54.1370, lon: -1.8330, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-middlesmoor" },
  { id: "p-north-stainley", name: "North Stainley ROC Post", group: "20", number: "30", lat: 54.1800, lon: -1.5830, status: "Opened 1958, closed 1991", cluster: "c20-middlesmoor" },
  { id: "p-kirby-hill",     name: "Kirby Hill ROC Post",     group: "20", number: "31", lat: 54.1560, lon: -1.5410, status: "Opened 1965, closed 1991", cluster: "c20-middlesmoor" },
  { id: "p-darley",         name: "Darley ROC Post",         group: "20", number: "32", lat: 54.0240, lon: -1.6820, status: "Opened 1962, closed 1991", cluster: "c20-middlesmoor" },
  // Buckden cluster (Yorkshire Dales)
  { id: "p-buckden",        name: "Buckden ROC Post",        group: "20", number: "25", lat: 54.1930, lon: -2.0940, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-buckden" },
  { id: "p-horton",         name: "Horton-in-Ribblesdale ROC Post", group: "20", number: "28", lat: 54.1490, lon: -2.3020, status: "Opened 1962, closed 1991", cluster: "c20-buckden" },
  { id: "p-settle",         name: "Settle ROC Post",         group: "20", number: "27", lat: 54.0690, lon: -2.2750, status: "Opened 1959, closed 1991", cluster: "c20-buckden" },
  { id: "p-grassington",    name: "Grassington ROC Post",    group: "20", number: "26", lat: 54.0730, lon: -1.9980, status: "Opened 1959, closed 1991", cluster: "c20-buckden" },
  // Heckmondwike cluster (West Riding)
  { id: "p-heckmondwike",   name: "Heckmondwike ROC Post",   group: "20", number: "62", lat: 53.7060, lon: -1.6790, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-heckmondwike" },
  { id: "p-sowerby-bridge", name: "Sowerby Bridge ROC Post", group: "20", number: "61", lat: 53.7150, lon: -1.9170, status: "Opened 1959, closed 1991", cluster: "c20-heckmondwike" },
  { id: "p-thornton",       name: "Thornton ROC Post",       group: "20", number: "41", lat: 53.7940, lon: -1.8660, status: "Opened 1965, closed 1991", cluster: "c20-heckmondwike" },
  // Guiseley cluster (West Riding NW)
  { id: "p-guiseley",       name: "Guiseley ROC Post",       group: "20", number: "40", lat: 53.8760, lon: -1.7130, status: "Opened 1959, closed 1991. Master post.", cluster: "c20-guiseley" },
  { id: "p-keighley",       name: "Keighley ROC Post",       group: "20", number: "42", lat: 53.8660, lon: -1.9060, status: "Opened 1959, closed 1991", cluster: "c20-guiseley" },
  { id: "p-gargrave",       name: "Gargrave ROC Post",       group: "20", number: "43", lat: 53.9840, lon: -2.1110, status: "Opened 1962, closed 1991", cluster: "c20-guiseley" },
  // Holmfirth cluster
  { id: "p-holmfirth",      name: "Holmfirth ROC Post",      group: "20", number: "60", lat: 53.5710, lon: -1.7850, status: "Opened 1960, closed 1991. Master post.", cluster: "c20-holmfirth" },
  { id: "p-darton",         name: "Darton ROC Post",         group: "20", number: "67", lat: 53.5780, lon: -1.5210, status: "Opened 1962, closed 1991", cluster: "c20-holmfirth" },
  // Barwick cluster
  { id: "p-barwick",        name: "Barwick-in-Elmet ROC Post", group: "20", number: "65", lat: 53.8230, lon: -1.4050, status: "Opened 1962, closed 1991. Master post.", cluster: "c20-barwick" },
  { id: "p-camblesforth",   name: "Camblesforth ROC Post",   group: "20", number: "45", lat: 53.7470, lon: -1.0660, status: "Opened 1962, closed 1991", cluster: "c20-barwick" },

  // Groups 21–31 — representative posts for national coverage
  // Group 21 — Preston (Western)
  { id: "p-burscough",    name: "Burscough ROC Post",      group: "21", number: "11", lat: 53.598, lon: -2.853, status: "Opened 1962, closed 1991" },
  { id: "p-blackburn",    name: "Blackburn ROC Post",      group: "21", number: "24", lat: 53.748, lon: -2.480, status: "Publicly listed ROC post" },
  { id: "p-chorley",      name: "Chorley ROC Post",        group: "21", number: "33", lat: 53.653, lon: -2.632, status: "Publicly listed ROC post" },
  // Group 22 — Carlisle (Western)
  { id: "p-brampton",     name: "Brampton ROC Post",       group: "22", number: "8",  lat: 54.943, lon: -2.739, status: "Opened 1959, closed 1991" },
  { id: "p-penrith",      name: "Penrith ROC Post",        group: "22", number: "19", lat: 54.665, lon: -2.752, status: "Publicly listed ROC post" },
  { id: "p-whitehaven",   name: "Whitehaven ROC Post",     group: "22", number: "31", lat: 54.549, lon: -3.591, status: "Publicly listed ROC post" },
  // Group 23 — Durham (Eastern)
  { id: "p-stanhope",     name: "Stanhope ROC Post",       group: "23", number: "27", lat: 54.748, lon: -2.009, status: "Publicly listed ROC post" },
  { id: "p-sunderland",   name: "Sunderland ROC Post",     group: "23", number: "14", lat: 54.906, lon: -1.381, status: "Publicly listed ROC post" },
  { id: "p-darlington",   name: "Darlington ROC Post",     group: "23", number: "36", lat: 54.527, lon: -1.550, status: "Publicly listed ROC post" },
  // Group 24 — Edinburgh (Caledonian)
  { id: "p-penicuik",     name: "Penicuik ROC Post",       group: "24", number: "12", lat: 55.831, lon: -3.223, status: "Publicly listed ROC post" },
  { id: "p-dunbar",       name: "Dunbar ROC Post",         group: "24", number: "27", lat: 55.997, lon: -2.519, status: "Publicly listed ROC post" },
  { id: "p-galashiels",   name: "Galashiels ROC Post",     group: "24", number: "38", lat: 55.618, lon: -2.809, status: "Publicly listed ROC post" },
  // Group 25 — Ayr (Caledonian)
  { id: "p-prestwick",    name: "Prestwick ROC Post",      group: "25", number: "36", lat: 55.496, lon: -4.611, status: "Publicly listed ROC post" },
  { id: "p-kilmarnock",   name: "Kilmarnock ROC Post",     group: "25", number: "19", lat: 55.611, lon: -4.497, status: "Publicly listed ROC post" },
  { id: "p-girvan",       name: "Girvan ROC Post",         group: "25", number: "42", lat: 55.246, lon: -4.861, status: "Publicly listed ROC post" },
  // Group 27 — Oban (Caledonian)
  { id: "p-oban",         name: "Oban ROC Post",           group: "27", number: "7",  lat: 56.415, lon: -5.472, status: "Opened 1960, closed 1968" },
  { id: "p-fort-william", name: "Fort William ROC Post",   group: "27", number: "15", lat: 56.820, lon: -5.105, status: "Publicly listed ROC post" },
  { id: "p-inveraray",    name: "Inveraray ROC Post",      group: "27", number: "22", lat: 56.228, lon: -5.078, status: "Publicly listed ROC post" },
  // Group 28 — Dundee (Caledonian)
  { id: "p-forfar",       name: "Forfar ROC Post",         group: "28", number: "29", lat: 56.644, lon: -2.889, status: "Publicly listed ROC post" },
  { id: "p-arbroath",     name: "Arbroath ROC Post",       group: "28", number: "16", lat: 56.559, lon: -2.587, status: "Publicly listed ROC post" },
  { id: "p-perth",        name: "Perth ROC Post",          group: "28", number: "41", lat: 56.396, lon: -3.435, status: "Publicly listed ROC post" },
  // Group 29 — Aberdeen (Caledonian)
  { id: "p-kintore",      name: "Kintore ROC Post",        group: "29", number: "6",  lat: 57.237, lon: -2.346, status: "Publicly listed ROC post" },
  { id: "p-elgin",        name: "Elgin ROC Post",          group: "29", number: "22", lat: 57.648, lon: -3.314, status: "Publicly listed ROC post" },
  { id: "p-inverurie",    name: "Inverurie ROC Post",      group: "29", number: "14", lat: 57.285, lon: -2.378, status: "Publicly listed ROC post" },
  // Group 30 — Inverness (Caledonian)
  { id: "p-cannich",      name: "Cannich ROC Post",        group: "30", number: "14", lat: 57.349, lon: -4.762, status: "Publicly listed ROC post" },
  { id: "p-dingwall",     name: "Dingwall ROC Post",       group: "30", number: "26", lat: 57.598, lon: -4.424, status: "Publicly listed ROC post" },
  { id: "p-beauly",       name: "Beauly ROC Post",         group: "30", number: "8",  lat: 57.477, lon: -4.464, status: "Publicly listed ROC post" },
  // Group 31 — Belfast (Northern Ireland)
  { id: "p-hillsborough", name: "Hillsborough ROC Post",   group: "31", number: "51", lat: 54.463, lon: -6.083, status: "Publicly listed ROC post" },
  { id: "p-antrim",       name: "Antrim ROC Post",         group: "31", number: "22", lat: 54.720, lon: -6.210, status: "Publicly listed ROC post" },
  { id: "p-londonderry",  name: "Londonderry ROC Post",    group: "31", number: "37", lat: 54.997, lon: -7.310, status: "Publicly listed ROC post" }
];

const postNameOverrides = {
  "p-alford-lincs": "Alford ROC Post",
  "p-bishops-castle": "Bishop's Castle ROC Post",
  "p-bishops-waltham": "Bishop's Waltham ROC Post",
  "p-bridge-of-orchy": "Bridge of Orchy ROC Post",
  "p-newtown-wales": "Newtown ROC Post",
  "p-overton-hants": "Overton ROC Post",
  "p-ross-on-wye": "Ross-on-Wye ROC Post"
};

const generatedPostSource = "SubBrit and Ringbell cluster data";
const generatedPostStatus = "Cluster member listed in source topology; position approximated for display";
const archivedCoordinateSource = "Archived content-delivery ROC GPS index";
const archivedCoordinateStatus = "Cluster member listed in source topology; GPS coordinate from archived ROC index";

// Coordinates from:
// https://web.archive.org/web/20070819200526/http://content-delivery.co.uk/aviation/airfields/roc/
// Only values inside the UK map bounds are used here; existing hand-entered
// monitoringPosts records above are intentionally left unchanged.
const archivedPostCoordinates = {
  "p-aldeburgh": { lat: 52.18844873, lon: 1.622847246 },
  "p-alford-lincs": { lat: 53.24506407, lon: 0.113489417 },
  "p-alston": { lat: 54.80989138, lon: -2.431344278 },
  "p-ampthill": { lat: 52.02928011, lon: -0.501397872 },
  "p-appleby": { lat: 54.57422293, lon: -2.503576792 },
  "p-aviemore": { lat: 57.20011465, lon: -3.823498066 },
  "p-aylsham": { lat: 52.78075392, lon: 1.242889194 },
  "p-bala": { lat: 52.90926168, lon: -3.612085358 },
  "p-bangor": { lat: 53.21801014, lon: -4.128036477 },
  "p-barnstaple": { lat: 51.04742583, lon: -4.022734772 },
  "p-braintree": { lat: 52.32168743, lon: 0.623090265 },
  "p-brecon": { lat: 51.93361338, lon: -3.387469788 },
  "p-bridge-of-orchy": { lat: 56.53803847, lon: -4.765630601 },
  "p-bridgnorth": { lat: 52.53547273, lon: -2.391319839 },
  "p-canterbury": { lat: 51.28286259, lon: 1.104061942 },
  "p-cardigan": { lat: 52.06604476, lon: -4.676809726 },
  "p-castle-douglas": { lat: 54.94094836, lon: -3.923432208 },
  "p-chippenham": { lat: 51.44416662, lon: -2.140306269 },
  "p-cockermouth": { lat: 54.68253198, lon: -3.365405612 },
  "p-cranbrook": { lat: 51.09079092, lon: 0.517526447 },
  "p-cromer": { lat: 52.92460817, lon: 1.319720219 },
  "p-cupar": { lat: 56.32301762, lon: -2.995966484 },
  "p-dalkeith": { lat: 55.88831610, lon: -3.023180890 },
  "p-dalmally": { lat: 56.40502298, lon: -5.011491746 },
  "p-daventry": { lat: 52.25748999, lon: -1.138738953 },
  "p-devizes": { lat: 51.33974619, lon: -1.952763288 },
  "p-dolgellau": { lat: 52.74916445, lon: -3.883864679 },
  "p-dorchester": { lat: 50.71789450, lon: -2.452630743 },
  "p-downham-market": { lat: 52.60531101, lon: 0.364080162 },
  "p-dumfries": { lat: 55.06051696, lon: -3.592466000 },
  "p-fakenham": { lat: 52.82506949, lon: 0.903793635 },
  "p-fordingbridge": { lat: 50.92601160, lon: -1.761933086 },
  "p-frome": { lat: 51.23504138, lon: -2.337785104 },
  "p-grantham": { lat: 52.88647242, lon: -0.659445507 },
  "p-hartlepool": { lat: 54.69570406, lon: -1.246953507 },
  "p-haverhill": { lat: 52.08821742, lon: 0.447161908 },
  "p-helston": { lat: 50.09827264, lon: -5.288344228 },
  "p-hertford": { lat: 51.81451266, lon: -0.123741510 },
  "p-huntly": { lat: 57.43558657, lon: -2.757123954 },
  "p-jedburgh": { lat: 55.46849533, lon: -2.577082544 },
  "p-kelso": { lat: 55.62931894, lon: -2.406784612 },
  "p-kendal": { lat: 54.31797983, lon: -2.730295808 },
  "p-kingussie": { lat: 57.08514279, lon: -4.025148293 },
  "p-kirkcudbright": { lat: 54.84322194, lon: -4.018470252 },
  "p-lampeter": { lat: 52.11539313, lon: -4.071025915 },
  "p-llandovery": { lat: 52.00233456, lon: -3.798283940 },
  "p-llanidloes": { lat: 52.45871218, lon: -3.549943033 },
  "p-lochgilphead": { lat: 56.01799884, lon: -5.450331184 },
  "p-longridge": { lat: 53.84412205, lon: -2.575641271 },
  "p-machynlleth": { lat: 52.58977875, lon: -3.858416380 },
  "p-malmesbury": { lat: 51.56760920, lon: -2.065797703 },
  "p-market-drayton": { lat: 52.90761705, lon: -2.505302714 },
  "p-market-rasen": { lat: 53.37471343, lon: -0.360615872 },
  "p-nairn": { lat: 57.58800341, lon: -3.843537641 },
  "p-newquay": { lat: 50.43435825, lon: -5.028463721 },
  "p-newton-stewart": { lat: 54.95730222, lon: -4.492839330 },
  "p-newtown-wales": { lat: 52.52055624, lon: -3.305654707 },
  "p-north-walsham": { lat: 52.84307331, lon: 1.334140328 },
  "p-oundle": { lat: 52.46218024, lon: -0.399882279 },
  "p-peebles": { lat: 55.65684240, lon: -3.199461900 },
  "p-petworth": { lat: 50.93418242, lon: -0.633945259 },
  "p-skegness": { lat: 53.16439716, lon: 0.326326298 },
  "p-sleaford": { lat: 53.02686921, lon: -0.394716907 },
  "p-south-molton": { lat: 51.00528197, lon: -3.835147005 },
  "p-st-andrews": { lat: 56.32959097, lon: -2.766626923 },
  "p-stockbridge": { lat: 53.46959764, lon: -1.619727261 },
  "p-stonehaven": { lat: 56.93708398, lon: -2.215796399 },
  "p-stratford": { lat: 51.52244296, lon: 0.041122811 },
  "p-stroud": { lat: 51.77581050, lon: -2.245990950 },
  "p-sudbury": { lat: 52.05686752, lon: 0.751109543 },
  "p-swaffham": { lat: 52.66961275, lon: 0.692562588 },
  "p-swindon": { lat: 51.54915589, lon: -1.827206628 },
  "p-tarbert": { lat: 55.85825773, lon: -5.429429935 },
  "p-tavistock": { lat: 50.57438757, lon: -4.153542801 },
  "p-tenterden": { lat: 51.08145223, lon: 0.674677579 },
  "p-thame": { lat: 51.74688375, lon: -0.956099063 },
  "p-wantage": { lat: 51.58120366, lon: -1.418322638 },
  "p-wareham": { lat: 50.67583078, lon: -2.099079071 },
  "p-welshpool": { lat: 52.67022311, lon: -3.144308290 },
  "p-wigton": { lat: 54.83211118, lon: -3.166008586 },
  "p-workington": { lat: 54.65175309, lon: -3.533808942 }
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

  if (result.spread < 2.0) {
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
