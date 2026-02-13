<template>
  <div>
    <UApp>
      <NuxtRouteAnnouncer />
      <UError
        :clear="{
          icon: 'i-lucide-arrow-left',
          label: 'Retour à la page d\'accueil',
          class: 'cursor-pointer px-4 py-2 font-body font-medium tracking-wide text-primary-foreground transition-all duration-300 hover:scale-105',
        }"
        :error="{
          statusCode: 404,
          statusMessage: 'Page Not Found',
          message: 'La page que vous recherchez n\'existe pas',
        }"
      />
    </UApp>
  </div>
</template>
