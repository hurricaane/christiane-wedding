<!-- shared/emails/GuestConfirmation.vue -->
<script lang="ts">
import { Body, Head, Hr, Html, Section, Text } from "@vue-email/components";

export default {
  components: {
    EHtml: Html,
    EHead: Head,
    EBody: Body,
    EText: Text,
    ESection: Section,
    EHr: Hr,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    attending: {
      type: String as () => "yes" | "no",
      required: true,
    },
    dates: {
      type: Array as () => string[],
      default: () => [],
    },
    dietary: {
      type: String,
      default: "",
    },
  },
};
</script>

<template>
  <EHtml lang="fr">
    <EHead />
    <EBody style="background-color: #fdf8f3; margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif;">
      <ESection style="max-width: 600px; margin: 40px auto; padding: 0 20px;">
        <!-- Header -->
        <ESection
          style="text-align: center; padding: 48px 32px 32px; background-color: #ffffff; border-radius: 12px 12px 0 0; border: 1px solid #e8ddd0; border-bottom: none;"
        >
          <EText
            style="font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: #8b7355; margin: 0 0 16px;"
          >
            Christiane &amp; Stéphane
          </EText>
          <EText style="font-size: 32px; color: #2c2c2c; margin: 0 0 8px; font-style: italic;">
            {{ attending === 'yes' ? 'Merci !' : 'Merci de nous avoir répondu' }}
          </EText>
          <EHr style="border: none; border-top: 1px solid #e8ddd0; margin: 24px auto; width: 80px;" />
        </ESection>

        <!-- Body -->
        <ESection
          style="padding: 32px; background-color: #ffffff; border: 1px solid #e8ddd0; border-top: none; border-bottom: none;"
        >
          <!-- Attending: yes -->
          <template v-if="attending === 'yes'">
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Cher(e) {{ name }},
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Nous sommes profondément touchés par votre présence à nos côtés. Votre RSVP a bien été enregistré — nous
              avons hâte de partager ce moment inoubliable avec vous.
            </EText>
            <ESection
              style="background-color: #fdf8f3; border: 1px solid #e8ddd0; border-radius: 8px; padding: 20px 24px; margin: 24px 0;"
            >
              <EText
                style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #8b7355; margin: 0 0 8px;"
              >
                Détails de la célébration
              </EText>
              <EText v-if="dates.includes('17-dec')" style="font-size: 15px; color: #2c2c2c; margin: 0 0 4px;">
                📅 17 Décembre 2026 — Cérémonie Traditionnelle
              </EText>
              <EText v-if="dates.includes('19-dec-church')" style="font-size: 15px; color: #2c2c2c; margin: 0 0 4px;">
                📅 19 Décembre 2026 — Cérémonie Religieuse
              </EText>
              <EText
                v-if="dates.includes('19-dec-reception')"
                style="font-size: 15px; color: #2c2c2c; margin: 0 0 4px;"
              >
                📅 19 Décembre 2026 — Grande Réception
              </EText>
              <EText style="font-size: 15px; color: #2c2c2c; margin: 4px 0 0;">
                📍 Cotonou, Bénin
              </EText>
            </ESection>
            <EText v-if="dietary" style="font-size: 15px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Nous avons bien noté vos préférences alimentaires : <em>{{ dietary }}</em>.
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Toutes les informations concernant la cérémonie (programme, lieux…) sont disponibles sur notre site.
              Pensez à le consulter régulièrement, car nous le mettrons à jour au fil des semaines : <a
                href="https://christiane-et-stephane.luminaconsulting.fr"
                style="color: #8b7355;"
              >christiane-et-stephane.luminaconsulting.fr</a>
            </EText>
          </template>

          <!-- Attending: no -->
          <template v-else>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Cher(e) {{ name }},
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Merci d'avoir pris le temps de nous répondre. Nous comprenons que la vie nous réserve parfois des
              imprévus, et votre pensée à notre égard nous touche énormément.
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Vous nous manquerez ce jour-là. Nous espérons avoir l'occasion de célébrer avec vous une prochaine fois.
            </EText>
          </template>

          <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 24px 0 0;">
            Avec toute notre affection,
          </EText>
          <EText style="font-size: 20px; color: #2c2c2c; margin: 8px 0 0; font-style: italic;">
            Christiane &amp; Stéphane
          </EText>
        </ESection>

        <!-- Footer -->
        <ESection
          style="padding: 24px 32px; background-color: #f5ede3; border: 1px solid #e8ddd0; border-top: none; border-radius: 0 0 12px 12px; text-align: center;"
        >
          <EText style="font-size: 12px; color: #8b7355; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
            <template v-if="dates.includes('17-dec') && (dates.includes('19-dec-church') || dates.includes('19-dec-reception'))">
              17 &amp; 19 Décembre 2026 · Cotonou, Bénin
            </template>
            <template v-else-if="dates.includes('17-dec')">
              17 Décembre 2026 · Cotonou, Bénin
            </template>
            <template v-else>
              19 Décembre 2026 · Cotonou, Bénin
            </template>
          </EText>
        </ESection>
      </ESection>
    </EBody>
  </EHtml>
</template>
