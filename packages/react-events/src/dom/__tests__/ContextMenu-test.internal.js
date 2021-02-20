/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

import {
  dispatchLongPressContextMenu,
  dispatchRightClickContextMenu,
  dispatchModifiedClickContextMenu,
  platform,
  setPointerEvent,
} from '../test-utils';

let React;
let ReactFeatureFlags;
let ReactDOM;
let useContextMenuResponder;

function initializeModules(hasPointerEvents) {
  setPointerEvent(hasPointerEvents);
  jest.resetModules();
  ReactFeatureFlags = require('shared/ReactFeatureFlags');
  ReactFeatureFlags.enableFlareAPI = true;
  React = require('react');
  ReactDOM = require('react-dom');
  useContextMenuResponder = require('react-events/context-menu')
    .useContextMenuResponder;
}

const forcePointerEvents = true;
const table = [[forcePointerEvents], [!forcePointerEvents]];

describe.each(table)('ContextMenu responder', hasPointerEvents => {
  let container;

  beforeEach(() => {
    initializeModules(hasPointerEvents);
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.render(null, container);
    document.body.removeChild(container);
    container = null;
  });

  describe('all platforms', () => {
    it('mouse right-click', () => {
      const onContextMenu = jest.fn();
      const preventDefault = jest.fn();
      const ref = React.createRef();
      const Component = () => {
        const listener = useContextMenuResponder({onContextMenu});
        return <div ref={ref} listeners={listener} />;
      };
      ReactDOM.render(<Component />, container);

      dispatchRightClickContextMenu(ref.current, {preventDefault});
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(onContextMenu).toHaveBeenCalledTimes(1);
      expect(onContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({pointerType: 'mouse', type: 'contextmenu'}),
      );
    });

    it('touch long-press', () => {
      const onContextMenu = jest.fn();
      const preventDefault = jest.fn();
      const ref = React.createRef();
      const Component = () => {
        const listener = useContextMenuResponder({onContextMenu});
        return <div ref={ref} listeners={listener} />;
      };
      ReactDOM.render(<Component />, container);

      dispatchLongPressContextMenu(ref.current, {preventDefault});
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(onContextMenu).toHaveBeenCalledTimes(1);
      expect(onContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({pointerType: 'touch', type: 'contextmenu'}),
      );
    });

    it('"disabled" is true', () => {
      const onContextMenu = jest.fn();
      const ref = React.createRef();
      const Component = () => {
        const listener = useContextMenuResponder({
          onContextMenu,
          disabled: true,
        });
        return <div ref={ref} listeners={listener} />;
      };
      ReactDOM.render(<Component />, container);

      dispatchRightClickContextMenu(ref.current);
      expect(onContextMenu).toHaveBeenCalledTimes(0);
    });

    it('"preventDefault" is false', () => {
      const preventDefault = jest.fn();
      const onContextMenu = jest.fn();
      const ref = React.createRef();
      const Component = () => {
        const listener = useContextMenuResponder({
          onContextMenu,
          preventDefault: false,
        });
        return <div ref={ref} listeners={listener} />;
      };
      ReactDOM.render(<Component />, container);

      dispatchRightClickContextMenu(ref.current, {preventDefault});
      expect(preventDefault).toHaveBeenCalledTimes(0);
      expect(onContextMenu).toHaveBeenCalledTimes(1);
    });
  });

  describe('mac platform', () => {
    beforeEach(() => {
      platform.set('mac');
      jest.resetModules();
    });

    afterEach(() => {
      platform.clear();
    });

    it('mouse modified left-click', () => {
      const onContextMenu = jest.fn();
      const ref = React.createRef();
      const Component = () => {
        const listener = useContextMenuResponder({onContextMenu});
        return <div ref={ref} listeners={listener} />;
      };
      ReactDOM.render(<Component />, container);

      dispatchModifiedClickContextMenu(ref.current);
      expect(onContextMenu).toHaveBeenCalledTimes(1);
      expect(onContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({pointerType: 'mouse', type: 'contextmenu'}),
      );
    });
  });

  describe('windows platform', () => {
    beforeEach(() => {
      platform.set('windows');
      jest.resetModules();
    });

    afterEach(() => {
      platform.clear();
    });

    it('mouse modified left-click', () => {
      const onContextMenu = jest.fn();
      const ref = React.createRef();
      const Component = () => {
        const listener = useContextMenuResponder({onContextMenu});
        return <div ref={ref} listeners={listener} />;
      };
      ReactDOM.render(<Component />, container);

      dispatchModifiedClickContextMenu(ref.current);
      expect(onContextMenu).toHaveBeenCalledTimes(0);
    });
  });
});
