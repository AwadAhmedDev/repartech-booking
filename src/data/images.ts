function unsplash(id: string, width: number, quality = 85): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export const images = {
  heroWorkstation:  unsplash('1581092918056-0c4c3acd3789', 1600),
  technicianRepair: unsplash('1597872200969-2b65d56bd16b', 1200),
  serverRoom:       unsplash('1558494949-ef010cbdcc31', 1200),
  diagnosticsDesk:  unsplash('1517694712202-14dd9538aa97', 1200),
  cybersecurity:    unsplash('1550751827-4bd374c3f58b', 1200),
  networking:       unsplash('1544197150-b99a580bb7a8', 1200),
  circuitBoard:     unsplash('1518770660439-4636190af475', 1200),
  supportTeam:      unsplash('1521737711867-e3b97375f902', 1200),
  laptopParts:      unsplash('1591370874773-6702e8f12fd8', 1200),
  officeIt:         unsplash('1573164713988-8665fc963095', 1200),
  techSupport:      unsplash('1563770660941-20978e870e26', 1200),
  cleanDesk:        unsplash('1593642632559-0c6d3fc62b89', 1200),
  laptopRepair:     unsplash('1580894894513-541e068a3e2b', 1200),
} as const
