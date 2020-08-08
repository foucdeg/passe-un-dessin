import * as H from 'history'; // eslint-disable-line

export default (
  history: H.History<H.LocationState>,
  timeout = 1000,
  mainSelector = 'right-side',
) => {
  let observer: MutationObserver;
  let timeoutId: number | null;

  if (!window.MutationObserver) {
    return;
  }

  const reset = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);

      timeoutId = null;
    }

    if (observer) {
      observer.disconnect();
    }
  };

  const createScrollToElement = (id: string) => {
    return () => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView();

        reset();

        return true;
      }

      return false;
    };
  };

  function scroll(location: H.Location | Location) {
    if (typeof location.hash !== 'string') {
      return;
    }

    const elementId = location.hash.slice(1);

    if (!elementId) {
      const contentArea = document.getElementById(mainSelector);
      if (contentArea) {
        contentArea.scrollTop = 0;
      }
      return;
    }

    const scrollToElement = createScrollToElement(elementId);

    setTimeout(() => {
      if (scrollToElement()) {
        return;
      }

      observer = new MutationObserver(scrollToElement);

      observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
      });

      timeoutId = setTimeout(reset, timeout);
    });
  }

  history.listen((location, action) => {
    if (timeoutId) {
      reset();
    }

    if (action !== 'PUSH') {
      return;
    }

    scroll(location);
  });

  requestAnimationFrame(() => {
    scroll(window.location);
  });
};
