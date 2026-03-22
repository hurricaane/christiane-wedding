<script setup lang="ts">
useSeoMeta({
  title: "Mentions légales",
  robots: "noindex",
});
</script>

<template>
  <section class="section-padding bg-linear-to-t from-background to-ivory-dark min-h-screen">
    <div class="max-w-3xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <h1 class="font-display text-4xl md:text-5xl text-foreground mb-4">
          Mentions légales
        </h1>
        <div class="flex items-center justify-center gap-4">
          <div class="w-16 h-px bg-sable/60" />
          <UIcon
            name="i-lucide-scale"
            class="text-sable"
            size="18"
          />
          <div class="w-16 h-px bg-sable/60" />
        </div>
      </div>

      <div class="space-y-10 font-body text-muted-foreground leading-relaxed">
        <div>
          <h2 class="font-display text-2xl text-foreground mb-4">
            Éditeur du site
          </h2>
          <div class="space-y-1">
            <p><span class="text-foreground font-medium">Dénomination :</span> Lumina Consulting</p>
            <p><span class="text-foreground font-medium">Forme juridique :</span> Entrepreneur individuel</p>
            <p><span class="text-foreground font-medium">Responsable :</span> Yannick Dossou</p>
            <p><span class="text-foreground font-medium">SIRET :</span> 934 402 900 00021</p>
            <p><span class="text-foreground font-medium">N° TVA intracommunautaire :</span> FR86934402900</p>
            <p><span class="text-foreground font-medium">Adresse :</span> 206 Rue d'Oran, Résidence Rimbaud Bâtiment A/B, 30000 Nîmes, France</p>
            <p>
              <span class="text-foreground font-medium">Contact :</span>
              <a href="mailto:dossouyannick.pro@gmail.com" class="text-marine hover:text-sable-dark transition-colors duration-200 underline ml-1">dossouyannick.pro@gmail.com</a>
            </p>
          </div>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Directeur de la publication
          </h2>
          <p>Yannick Dossou</p>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Hébergement
          </h2>
          <div class="space-y-1">
            <p><span class="text-foreground font-medium">Hébergeur :</span> Vercel Inc.</p>
            <p><span class="text-foreground font-medium">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
            <p>
              <span class="text-foreground font-medium">Site :</span> <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-marine hover:text-sable-dark transition-colors duration-200 underline"
              >vercel.com</a>
            </p>
          </div>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Propriété intellectuelle
          </h2>
          <p>L'ensemble du contenu de ce site (textes, images, graphismes, logo) est la propriété exclusive de Lumina Consulting et des époux Christiane & Stéphane Fagnon, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.</p>
        </div>

        <div class="border-t border-marine/10 pt-10">
          <h2 class="font-display text-2xl text-foreground mb-4">
            Données personnelles
          </h2>
          <p>
            Pour toute information relative au traitement de vos données personnelles, veuillez consulter notre
            <NuxtLink to="/politique-de-confidentialite" class="text-marine hover:text-sable-dark transition-colors duration-200 underline">
              Politique de confidentialité
            </NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
