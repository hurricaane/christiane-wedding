<!-- shared/emails/OrganizerNotification.vue -->
<script lang="ts">
import { Body, Head, Html, Section, Text } from "@vue-email/components";

export default {
  components: {
    EHtml: Html,
    EHead: Head,
    EBody: Body,
    EText: Text,
    ESection: Section,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    attending: {
      type: String as () => "yes" | "no",
      required: true,
    },
    dietary: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
  },
};
</script>

<template>
  <EHtml lang="fr">
    <EHead />
    <EBody style="background-color: #f5f5f5; margin: 0; padding: 0; font-family: Arial, sans-serif;">
      <ESection style="max-width: 560px; margin: 32px auto; padding: 0 16px;">
        <!-- Header -->
        <ESection style="background-color: #2c2c2c; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <EText style="color: #ffffff; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
            Nouveau RSVP
          </EText>
        </ESection>

        <!-- Content -->
        <ESection style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <!-- Row: Nom -->
          <ESection style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Nom
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0; font-weight: bold;">
              {{ name }}
            </EText>
          </ESection>

          <!-- Row: Email -->
          <ESection style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Email
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0;">
              {{ email }}
            </EText>
          </ESection>

          <!-- Row: Présence -->
          <ESection style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Présence
            </EText>
            <EText :style="`font-size: 15px; margin: 0; font-weight: bold; color: ${attending === 'yes' ? '#2e7d32' : '#c62828'};`">
              {{ attending === 'yes' ? '✓ Présent(e)' : '✗ Absent(e)' }}
            </EText>
          </ESection>

          <!-- Row: Régime (conditional) -->
          <ESection v-if="dietary" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Régime alimentaire
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0;">
              {{ dietary }}
            </EText>
          </ESection>

          <!-- Row: Message (conditional) -->
          <ESection v-if="message" style="margin-bottom: 0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Message
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0; line-height: 1.6; font-style: italic;">
              "{{ message }}"
            </EText>
          </ESection>
        </ESection>
      </ESection>
    </EBody>
  </EHtml>
</template>
