# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

## Todo

- loading state
- error state
- add illustration empty state
- empty group toaster
  - random user created from 0
- remove resource
- routes
- free and pro
- first step simple design
- remove one of select resources
- refactor
- fix issue display resources
  => select user resource
  => select group
  => both resources are displayed
- hide button back step when needed
- improve design back button
- add number of licenses
- design footer and headers
- max width cards
- disabled already selected resources in selects
- find icons models and campaigns
  - add to list in select
  - add to button select
  - add to review resources
- fake post request
- modal success
- modal leave page
- fix issue select all on mobile
- add design to list users when select all
- add design to cards when selected
- add design to cards when selected
  - remove chevron right ?
- add color circle or user avatar in resource panel when selected
- home page add description design
