function unsplash(id: string, width: number, quality = 75): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export const images = {
  heroWorkstation:  unsplash('1581092918056-0c4c3acd3789', 1280),
  technicianRepair: unsplash('1597872200969-2b65d56bd16b', 800),
  serverRoom:       unsplash('1558494949-ef010cbdcc31', 800),
  diagnosticsDesk:  unsplash('1517694712202-14dd9538aa97', 800),
  cybersecurity:    unsplash('1550751827-4bd374c3f58b', 800),
  networking:       unsplash('1544197150-b99a580bb7a8', 800),
  circuitBoard:     unsplash('1518770660439-4636190af475', 800),
  supportTeam:      unsplash('1521737711867-e3b97375f902', 800),
  laptopParts:      unsplash('1591370874773-6702e8f12fd8', 800),
  officeIt:         unsplash('1573164713988-8665fc963095', 800),
  techSupport:      unsplash('1563770660941-20978e870e26', 800),
  cleanDesk:        unsplash('1593642632559-0c6d3fc62b89', 800),
  laptopRepair:     unsplash('1580894894513-541e068a3e2b', 800),
} as const
