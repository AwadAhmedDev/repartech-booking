-- Replace the price ranges introduced in 0004 with a single fixed price per
-- service (a reasonable market rate picked from within each original range).
-- price_max is kept as a column (still useful for a future service that
-- genuinely needs a range) but is null on every current service, so
-- formatPriceRange() falls back to displaying a single amount.
--
-- ROLLBACK: re-apply the price/price_max pairs from
-- 0004_real_services_catalog.sql for these same service names.

update public.services set price = 39,  price_max = null where name = 'Diagnostic système & panne';
update public.services set price = 59,  price_max = null where name = 'Optimisation & nettoyage système';
update public.services set price = 69,  price_max = null where name = 'Maintenance préventive';
update public.services set price = 69,  price_max = null where name = 'Désinfection & suppression de virus';
update public.services set price = 89,  price_max = null where name = 'Récupération de données & Sauvegarde';
update public.services set price = 109, price_max = null where name = 'Réinstallation de système (Windows / macOS)';
update public.services set price = 59,  price_max = null where name = 'Réparation & remplacement de composants';
update public.services set price = 79,  price_max = null where name = 'Passage au SSD & Clonage';
update public.services set price = 129, price_max = null where name = 'Assemblage PC sur mesure';
update public.services set price = 29,  price_max = null where name = 'Assistance & Dépannage à distance';
update public.services set price = 69,  price_max = null where name = 'Configuration réseau & Wi-Fi';
