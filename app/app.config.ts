export default defineAppConfig({
  ui: {
    error: {
      slots: {
        root: "min-h-[calc(100vh-var(--ui-header-height))] flex flex-col items-center justify-center text-center",
        statusCode: "text-2xl font-body font-semibold text-secondary",
        statusMessage: "mt-2 text-4xl sm:text-6xl font-display font-bold text-primary text-balance",
        message: "mt-8 text-lg font-body text-muted-foreground text-balance",
        links: "mt-8 flex items-center justify-center gap-6",
      },
    },
  },
});
