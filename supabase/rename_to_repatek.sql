-- One-off rename: applies the new "RepaTek" brand name (repatek.fr) to the
-- live business_settings row. RLS blocks this from the anon/public key by
-- design, so run it in the Supabase SQL editor (or via the admin
-- dashboard's "Paramètres de l'Entreprise" page) instead.
update public.business_settings
set business_name = 'RepaTek',
    business_email = 'support@repatek.fr'
where business_name = 'RéparTech';
