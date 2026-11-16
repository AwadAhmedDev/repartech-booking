import { LegalLayout, P, Section, Ul } from '../../components/layout/LegalLayout'

export function CGVPage() {
  return (
    <LegalLayout
      subtitle="Conditions de vente"
      title="Conditions Générales de Vente"
      updated="17 novembre 2026"
    >
      <Section title="1. Parties et champ d'application">
        <P>
          Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les prestations
          de services proposées par RepaTek (ci-après « le Prestataire ») à tout client
          particulier ou professionnel (ci-après « le Client »).
        </P>
        <P>
          Toute commande ou réservation de prestation implique l'acceptation sans réserve des
          présentes CGV, qui prévalent sur tout autre document du Client, notamment ses
          conditions générales d'achat.
        </P>
      </Section>

      <Section title="2. Services proposés">
        <P>
          RepaTek propose des prestations de réparation informatique et de support technique,
          notamment :
        </P>
        <Ul
          items={[
            "Diagnostic et réparation matérielle (ordinateurs portables, PC de bureau)",
            "Suppression de logiciels malveillants et sécurisation des systèmes",
            "Récupération de données sur supports défaillants",
            "Installation, configuration et mise à jour de systèmes d'exploitation et logiciels",
            "Support et maintenance réseau (Wi-Fi, LAN, VPN)",
            "Conseil et assistance informatique à destination des entreprises",
          ]}
        />
        <P>
          Les tarifs en vigueur sont affichés sur le site et constituent des prix forfaitaires
          indicatifs. Un devis précis sera établi après diagnostic initial, sans frais ni
          engagement pour le Client.
        </P>
      </Section>

      <Section title="3. Prise de rendez-vous et formation du contrat">
        <P>
          La réservation en ligne constitue une demande de rendez-vous. Le contrat de prestation
          est formé à la réception de la confirmation écrite de RepaTek (par e-mail), précisant
          la date, l'heure et le service retenu.
        </P>
        <P>
          Aucun engagement définitif n'est pris avant l'établissement du devis et l'accord
          explicite du Client sur le montant et les travaux à effectuer.
        </P>
      </Section>

      <Section title="4. Devis et tarification">
        <P>
          Un diagnostic préliminaire est réalisé gratuitement et sans engagement. À l'issue
          de ce diagnostic, un devis écrit est remis au Client, précisant :
        </P>
        <Ul
          items={[
            "La nature des travaux à effectuer",
            "Le montant TTC de la prestation",
            "Le délai estimé d'intervention",
          ]}
        />
        <P>
          Les travaux ne sont entrepris qu'après accord écrit ou oral explicite du Client sur
          le devis. Tout devis accepté est valable 30 jours. Les prix sont exprimés en euros
          toutes taxes comprises (TTC).
        </P>
      </Section>

      <Section title="5. Modalités de paiement">
        <P>
          Le paiement s'effectue <strong>au comptant, à l'issue de la prestation</strong> — directement
          sur place à la fin de l'intervention, à domicile ou dans les locaux du Client (ou à
          distance pour une assistance en ligne). RepaTek accepte les modes de paiement suivants :
        </P>
        <Ul
          items={[
            "Espèces",
            "Carte bancaire (Visa, Mastercard)",
            "Virement bancaire (sur devis supérieur à 200 €)",
          ]}
        />
        <P>
          Aucun paiement en ligne n'est collecté via ce site. En cas de non-paiement à
          l'échéance, des pénalités de retard seront appliquées au taux légal en vigueur,
          ainsi qu'une indemnité forfaitaire de recouvrement de 40 € (Art. D.441-5 C. com.).
        </P>
      </Section>

      <Section title="6. Délais d'intervention">
        <P>
          Les délais indicatifs communiqués au Client sont donnés à titre d'information. Ils
          peuvent varier en fonction de la disponibilité des pièces détachées ou de la complexité
          du diagnostic. RepaTek s'engage à informer le Client sans délai en cas de dépassement
          significatif du délai estimé.
        </P>
        <P>
          En règle générale, la majorité des réparations standards est réalisée dans un délai de
          24 à 48 heures ouvrées.
        </P>
      </Section>

      <Section title="7. Garanties">
        <P>
          <strong>Garantie contractuelle RepaTek (30 jours) :</strong> Toutes les réparations
          effectuées par RepaTek sont couvertes par une garantie de 30 jours calendaires à
          compter de la date de fin de l'intervention, portant sur la qualité de la main-d'œuvre et des
          pièces installées. Cette garantie ne couvre pas les dommages accidentels, les actes de
          l'utilisateur ou les pannes non liées à l'intervention effectuée.
        </P>
        <P>
          <strong>Garantie légale de conformité (Art. L.217-4 C. conso.) :</strong> Pour les
          prestations effectuées auprès de consommateurs, la garantie légale de conformité
          s'applique pendant 2 ans à compter de la réparation. En cas de défaut de conformité,
          le Client peut demander la réparation ou le remplacement de la pièce défectueuse.
        </P>
        <P>
          <strong>Garantie contre les vices cachés (Art. 1641 C. civ.) :</strong> RepaTek
          répond des vices cachés affectant les pièces fournies, qui rendent la chose impropre
          à l'usage auquel elle est destinée.
        </P>
      </Section>

      <Section title="8. Droit de rétractation">
        <P>
          Conformément à l'article L.221-18 du Code de la consommation, les consommateurs
          disposent d'un délai de rétractation de <strong>14 jours calendaires</strong> à
          compter de la confirmation du rendez-vous pour annuler leur commande, sans avoir
          à se justifier.
        </P>
        <P>
          Toutefois, conformément à l'article L.221-28 du Code de la consommation, le Client
          qui souhaite que la prestation débute avant l'expiration du délai de rétractation
          doit en faire la demande expresse. Dans ce cas, si la prestation est intégralement
          exécutée avant l'expiration du délai, le droit de rétractation est perdu.
        </P>
        <P>
          Pour exercer le droit de rétractation, le Client doit notifier sa décision par
          e-mail à <strong>repatekcontact@gmail.com</strong> avant l'expiration du délai.
        </P>
      </Section>

      <Section title="9. Responsabilité du Prestataire">
        <P>
          RepaTek est tenu à une <strong>obligation de moyens</strong>. La responsabilité de
          RepaTek ne saurait être engagée en cas de perte de données ou de logiciels présents
          sur l'appareil confié. Il est fortement conseillé au Client d'effectuer une sauvegarde
          de ses données avant toute intervention.
        </P>
        <P>
          En cas de dommage causé à l'appareil du Client lors de l'intervention, la responsabilité
          de RepaTek sera limitée à la valeur vénale de l'appareil au moment du dépôt,
          déduction faite de la vétusté.
        </P>
      </Section>

      <Section title="10. Réclamations et médiation">
        <P>
          Toute réclamation doit être adressée en premier lieu à RepaTek par e-mail à{' '}
          <strong>repatekcontact@gmail.com</strong>. En cas d'absence de réponse satisfaisante
          dans un délai de 60 jours, le Client consommateur peut recourir à un médiateur de
          la consommation.
        </P>
        <P>
          Conformément à l'ordonnance n°2015-1033 du 20 août 2015 et au décret d'application
          n°2015-1382 du 30 octobre 2015, le Client peut saisir gratuitement le médiateur
          de la consommation compétent. La Commission européenne met également à disposition
          une plateforme de règlement en ligne des litiges (RLL) accessible à :{' '}
          <strong>ec.europa.eu/consumers/odr</strong>
        </P>
      </Section>

      <Section title="11. Droit applicable et juridiction compétente">
        <P>
          Les présentes CGV sont soumises au droit français. En cas de litige et à défaut de
          résolution amiable, les tribunaux compétents de Paris seront seuls habilités à
          connaître du différend.
        </P>
        <P>
          Pour les clients professionnels, tout litige sera soumis à la compétence exclusive
          du Tribunal de Commerce de Paris.
        </P>
      </Section>
    </LegalLayout>
  )
}
