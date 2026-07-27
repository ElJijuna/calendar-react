import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'error' },
    docs: { toc: true },
  },
  globalTypes: {
    direction: {
      description: 'Writing direction',
      defaultValue: 'ltr',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: ['ltr', 'rtl'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.dir = context.globals.direction as string;

      return Story();
    },
  ],
};

export default preview;
