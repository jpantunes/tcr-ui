import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories');
  require('../src/stories/Cards.js');
  require('../src/stories/SidePanels.js');
}

configure(loadStories, module);
