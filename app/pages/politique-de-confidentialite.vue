<script setup lang="ts">
useSeoMeta({
  title: "Politique de confidentialité",
  robots: "noindex",
});
</script>

<template>
  <section class="section-padding bg-linear-to-t from-background to-ivory-dark min-h-screen">
    <div class="max-w-3xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <h1 class="font-display text-4xl md:text-5xl text-foreground mb-4">
          Politique de confidentialité
        </h1>
        <div class="flex items-center justify-center gap-4">
          <div class="w-16 h-px bg-sable/60" />
          <UIcon
            name="i-lucide-shield"
            class="text-sable"
            size="18"
          />
          <div class="w-16 h-px bg-sable/60" />
        </div>
      </div>

      <div class="space-y-10 font-body text-muted-foreground leading-relaxed">
        <div>
          <h2 class="font-display text-2xl text-foreground mb-4">
            Responsable du traitement
          </h2>
          <div class="space-y-1">
            <p><span class="text-foreground font-medium">Entité :</span> Lumina Consulting — Yannick Dossou</p>
            <p><span class="text-foreground font-medium">Adresse :</span> 206 Rue d'Oran, Résidence Rimbaud Bâtiment A/B, 30000 Nîmes, France</p>
            <p>
              <span class="text-foreground font-medium">Contact :</span>
              <a href="mailto:dossouyannick.pro@gmail.com" class="text-marine hover:text-sable-dark transition-colors duration-200 underline ml-1">dossouyannick.pro@gmail.com</a>
            </p>
          </div>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Données collectées
          </h2>
          <p class="mb-4">
            Dans le cadre du formulaire RSVP, les données suivantes sont collectées :
          </p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Confirmation de présence</li>
            <li>Restrictions ou préférences alimentaires (optionnel)</li>
            <li>Message libre (optionnel)</li>
          </ul>
          <p class="mt-4">
            Aucune donnée n'est collectée via des cookies ou traceurs publicitaires.
          </p>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Finalités du traitement
          </h2>
          <p>Les données collectées sont utilisées exclusivement pour :</p>
          <ul class="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Organiser et gérer les invitations au mariage</li>
            <li>Vous envoyer une confirmation de votre RSVP par e-mail</li>
            <li>Adapter les repas en fonction des régimes alimentaires déclarés</li>
          </ul>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Destinataires des données
          </h2>
          <p class="mb-4">
            Vos données sont transmises aux prestataires techniques suivants, dans le strict cadre de leur mission :
          </p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li><span class="text-foreground font-medium">Resend Inc.</span> (envoi d'e-mails transactionnels) — États-Unis</li>
            <li><span class="text-foreground font-medium">Vercel Inc.</span> (hébergement) — États-Unis</li>
          </ul>
          <p class="mt-4">
            Ces prestataires sont soumis à des garanties appropriées pour le transfert de données hors de l'Union européenne (clauses contractuelles types).
          </p>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Durée de conservation
          </h2>
          <p>Vos données sont conservées uniquement le temps nécessaire à l'organisation de l'événement, et supprimées au plus tard six mois après la date du dernier mariage (décembre 2026).</p>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Vos droits
          </h2>
          <p class="mb-4">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
          </p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit d'opposition</li>
          </ul>
          <p class="mt-4">
            Pour exercer ces droits, contactez-nous à :
            <a href="mailto:dossouyannick.pro@gmail.com" class="text-marine hover:text-sable-dark transition-colors duration-200 underline ml-1">dossouyannick.pro@gmail.com</a>
          </p>
          <p class="mt-4">
            En cas de litige, vous pouvez introduire une réclamation auprès de la <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              class="text-marine hover:text-sable-dark transition-colors duration-200 underline"
            >CNIL</a>.
          </p>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Mise à jour
          </h2>
          <p>Cette politique de confidentialité a été mise à jour le 22 mars 2026.</p>
        </div>
      </div>
    </div>
  </section>
</template>
