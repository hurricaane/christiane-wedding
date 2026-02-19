<template>
  <UApp>
    <WeddingLoader :min-loading-time="3500">
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </WeddingLoader>
  </UApp>
</template>
