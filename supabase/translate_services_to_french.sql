-- Run this once in the Supabase SQL editor if you already ran the original
-- schema.sql (with English seed data) and want to translate the existing
-- "services" rows to French in place. Safe to run multiple times — each
-- UPDATE only matches the original English name, so it becomes a no-op once
-- a row has already been translated.

update public.services set
  name = 'Service de Diagnostic Informatique',
  description = 'Diagnostic complet du matériel et des logiciels pour identifier précisément le problème avant toute réparation.'
where name = 'Computer Diagnostic Service';

update public.services set
  name = 'Suppression de Virus et Logiciels Malveillants',
  description = 'Analyse approfondie du système et suppression des virus, logiciels espions, rançongiciels et autres logiciels malveillants.'
where name = 'Virus & Malware Removal';

update public.services set
  name = 'Service de Réparation d''Ordinateurs Portables',
  description = 'Réparation d''écran, de clavier, de batterie, de charnière et de carte mère pour toutes les grandes marques d''ordinateurs portables.'
where name = 'Laptop Repair Service';

update public.services set
  name = 'Réparation d''Ordinateurs de Bureau',
  description = 'Réparation au niveau des composants : alimentations, cartes graphiques, cartes mères et stockage.'
where name = 'Desktop Computer Repair';

update public.services set
  name = 'Consultation de Récupération de Données',
  description = 'Évaluation professionnelle et plan de récupération pour les données perdues, corrompues ou inaccessibles.'
where name = 'Data Recovery Consultation';

update public.services set
  name = 'Session de Support IT pour Entreprises',
  description = 'Session de support IT sur site ou à distance pour les réseaux, serveurs et postes de travail professionnels.'
where name = 'Business IT Support Session';
