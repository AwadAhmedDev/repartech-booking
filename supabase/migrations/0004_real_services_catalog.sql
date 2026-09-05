-- Replace the 6 generic template services with the client's real 11-item
-- catalog and add price range support (price = minimum, price_max = maximum).
--
-- The old services are archived (is_active = false), not deleted: 3
-- pre-existing appointments reference them via a foreign key with
-- "on delete restrict", and deleting the rows would fail the migration.
--
-- ROLLBACK:
--   update public.services set is_active = true
--   where name in ('Business IT Support Session', 'Computer Diagnostic Service',
--     'Data Recovery Consultation', 'Desktop Computer Repair',
--     'Laptop Repair Service', 'Virus & Malware Removal');
--   delete from public.services where name in (
--     'Diagnostic système & panne', 'Optimisation & nettoyage système',
--     'Maintenance préventive', 'Désinfection & suppression de virus',
--     'Récupération de données & Sauvegarde',
--     'Réinstallation de système (Windows / macOS)',
--     'Réparation & remplacement de composants', 'Passage au SSD & Clonage',
--     'Assemblage PC sur mesure', 'Assistance & Dépannage à distance',
--     'Configuration réseau & Wi-Fi'
--   );
--   alter table public.services drop column if exists price_max;

alter table public.services
  add column if not exists price_max numeric(10,2);

update public.services set is_active = false
where name in (
  'Business IT Support Session',
  'Computer Diagnostic Service',
  'Data Recovery Consultation',
  'Desktop Computer Repair',
  'Laptop Repair Service',
  'Virus & Malware Removal'
);

insert into public.services (name, description, duration_minutes, price, price_max, is_active) values
('Diagnostic système & panne', 'Analyse complète du matériel et des logiciels pour identifier la cause des ralentissements, pannes, écrans bleus et erreurs système. Le montant du diagnostic est déduit du prix de la réparation si vous l''acceptez.', 45, 30, 50, true),
('Optimisation & nettoyage système', 'Suppression des fichiers inutiles, désactivation des programmes au démarrage, nettoyage du registre et réglages pour optimiser la vitesse.', 60, 50, 70, true),
('Maintenance préventive', 'Dépoussiérage interne complet, remplacement de la pâte thermique, tests de charge et mise à jour des pilotes pour éviter la surchauffe et prolonger la durée de vie du matériel.', 90, 60, 90, true),
('Désinfection & suppression de virus', 'Élimination complète des malwares, spywares, ransomwares et virus, suivie du renforcement de la sécurité et du paramétrage d''un antivirus.', 75, 50, 80, true),
('Récupération de données & Sauvegarde', 'Extraction de vos fichiers importants depuis un disque dur défaillant ou un système bloqué, et mise en place d''une solution de sauvegarde automatique.', 120, 60, 120, true),
('Réinstallation de système (Windows / macOS)', 'Installation propre du système d''exploitation, configuration des pilotes, réinstallation de vos logiciels et transfert complet de vos données.', 150, 90, 130, true),
('Réparation & remplacement de composants', 'Changement des pièces défectueuses ou obsolètes : alimentation, mémoire RAM, carte graphique, carte mère, écran ou batterie d''ordinateur portable. Prix hors pièces.', 60, 40, 70, true),
('Passage au SSD & Clonage', 'Remplacement de votre ancien disque dur lent par un disque SSD rapide, avec clonage à l''identique de votre système sans perte de données. Prix hors SSD.', 90, 60, 90, true),
('Assemblage PC sur mesure', 'Conseil sur le choix des composants, montage complet, rangement des câbles, paramétrage du BIOS et installation de votre PC (bureau, gaming ou création).', 180, 90, 150, true),
('Assistance & Dépannage à distance', 'Intervention rapide par prise en main à distance pour résoudre les bugs logiciels, configurer vos e-mails ou débloquer une situation simple. Tarif par tranche de 30 minutes.', 30, 25, 40, true),
('Configuration réseau & Wi-Fi', 'Installation de routeurs, répéteurs Wi-Fi, imprimantes en réseau et configuration de partages de fichiers sécurisés (NAS).', 90, 50, 80, true);
