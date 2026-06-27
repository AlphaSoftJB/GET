export const LIVE_EVENTS = [
  {user:"Alice Johnson",  action:"added 3 items to inventory",          icon:"📦", color:"#6366F1"},
  {user:"Bob Smith",      action:"scanned a barcode in Kitchen",         icon:"📷", color:"#10B981"},
  {user:"Eve Martinez",   action:"marked Greek Yogurt as used",          icon:"✅", color:"#10B981"},
  {user:"David Lee",      action:"viewed recipe: Spinach Omelette",      icon:"🍳", color:"#F59E0B"},
  {user:"Carol Davis",    action:"reported 2 expired items",             icon:"⚠️", color:"#EF4444"},
  {user:"Frank Wilson",   action:"updated allergen profile",             icon:"💚", color:"#14B8A6"},
  {user:"Alice Johnson",  action:"generated Inventory Summary report",   icon:"📋", color:"#6366F1"},
  {user:"Bob Smith",      action:"set expiry alert for Whole Milk",      icon:"🔔", color:"#F59E0B"},
];

export const userGrowthData = [
  {date:"Jun 1",users:980,scans:1420},{date:"Jun 2",users:1010,scans:1650},{date:"Jun 3",users:1045,scans:1820},
  {date:"Jun 4",users:1089,scans:1590},{date:"Jun 5",users:1120,scans:2100},{date:"Jun 6",users:1198,scans:1980},{date:"Jun 7",users:1234,scans:1892},
];
export const topProducts = [
  {name:"Whole Milk",scans:342},{name:"Greek Yogurt",scans:289},{name:"Sourdough",scans:265},
  {name:"Chicken",scans:241},{name:"Spinach",scans:198},{name:"Eggs",scans:187},{name:"Carrots",scans:156},
];
export const allergenData = [
  {name:"Dairy",value:38,color:"#6366F1"},{name:"Gluten",value:22,color:"#10B981"},
  {name:"Eggs",value:15,color:"#F97316"},{name:"Peanuts",value:12,color:"#EF4444"},
  {name:"Tree Nuts",value:8,color:"#7C3AED"},{name:"Others",value:5,color:"#9CA3AF"},
];
export const expirationTimeline = [
  {date:"Jun 1",items:45,expired:8},{date:"Jun 2",items:52,expired:6},{date:"Jun 3",items:38,expired:11},
  {date:"Jun 4",items:61,expired:4},{date:"Jun 5",items:44,expired:9},{date:"Jun 6",items:57,expired:7},{date:"Jun 7",items:49,expired:5},
];
export const categoryData = [
  {cat:"Dairy",count:4521},{cat:"Produce",count:3876},{cat:"Meat",count:2341},{cat:"Bakery",count:1987},{cat:"Pantry",count:1654},{cat:"Beverage",count:1432},
];
export const alertsData = [
  {date:"Jun 1",alerts:23},{date:"Jun 2",alerts:31},{date:"Jun 3",alerts:18},{date:"Jun 4",alerts:42},{date:"Jun 5",alerts:27},{date:"Jun 6",alerts:35},{date:"Jun 7",alerts:29}
];
export const USERS = [
  {id:1,avatar:"👩",name:"Alice Johnson",email:"alice@example.com",role:"Admin",  status:"Active",   lastLogin:"2h ago",  scans:142, joined:"Jan 15, 2026"},
  {id:2,avatar:"👨",name:"Bob Smith",    email:"bob@example.com",  role:"User",   status:"Active",   lastLogin:"5h ago",  scans:89,  joined:"Feb 3, 2026"},
  {id:3,avatar:"👩",name:"Carol Davis",  email:"carol@example.com",role:"User",   status:"Inactive", lastLogin:"3d ago",  scans:234, joined:"Mar 11, 2026"},
  {id:4,avatar:"👦",name:"David Lee",    email:"david@example.com",role:"User",   status:"Active",   lastLogin:"1h ago",  scans:67,  joined:"Apr 2, 2026"},
  {id:5,avatar:"👩",name:"Eve Martinez", email:"eve@example.com",  role:"Admin",  status:"Active",   lastLogin:"30m ago", scans:312, joined:"Jan 20, 2026"},
  {id:6,avatar:"👨",name:"Frank Wilson", email:"frank@example.com",role:"User",   status:"Suspended",lastLogin:"7d ago",  scans:12,  joined:"May 5, 2026"},
];
export const REPORTS = [
  {id:1,name:"User Activity Report",   type:"User",      date:"Jun 1, 2026", format:"PDF",   size:"2.4 MB"},
  {id:2,name:"Inventory Summary",      type:"Inventory", date:"May 31, 2026",format:"CSV",   size:"856 KB"},
  {id:3,name:"Health Alerts Q2",       type:"Health",    date:"May 30, 2026",format:"Excel", size:"1.2 MB"},
  {id:4,name:"Analytics Dashboard",    type:"Analytics", date:"May 28, 2026",format:"PDF",   size:"3.1 MB"},
];
