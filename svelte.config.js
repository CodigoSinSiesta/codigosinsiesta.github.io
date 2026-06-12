import { vitePreprocess } from '@astrojs/svelte';

export default {
  // El theme usa <script lang="ts"> en sus componentes Svelte.
  preprocess: vitePreprocess(),
};
