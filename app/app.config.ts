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
    header: {
      slots: {
        left: "flex items-center gap-1.5 shrink-0",
        center: "hidden lg:flex flex-1 justify-end items-center",
        right: "lg:hidden flex items-center justify-end gap-1.5",
      },
    },
    navigationMenu: {
      slots: {
        list: "items-center gap-16 isolate min-w-0",
        link: "group relative w-full flex items-center gap-1.5 font-medium text-sm text-foreground/80 transition-colors duration-300",
      },
      compoundVariants: [
        {
          orientation: "horizontal",
          variant: "link",
          active: false,
          class: {
            link: "hover:text-primary",
          },
        },
        {
          highlight: true,
          active: true,
          orientation: "horizontal",
          class: {
            link: [
              "after:-bottom-0.5 after:h-[2px] after:bg-foreground",
              "after:transition-transform after:duration-300",
            ],
          },
        },
      ],
    },
  },
});
