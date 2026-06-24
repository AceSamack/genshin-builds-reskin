const infoPopoverWindow = window as typeof window & {
  __infoPopoversReady?: boolean;
};

if (!infoPopoverWindow.__infoPopoversReady) {
  infoPopoverWindow.__infoPopoversReady = true;

  const VIEWPORT_PADDING = 8;
  const POPOVER_GAP = 8;
  const MOBILE_POPOVER_QUERY = '(max-width: 900px)';
  let ignoreNextClick = false;
  let lastTouchY = 0;
  let lockedScrollY = 0;
  let hoveredPopover: HTMLElement | null = null;
  let focusedPopover: HTMLElement | null = null;
  let openPopover: HTMLElement | null = null;
  let popoverPositionFrame = 0;
  let isTouchMoveBound = false;

  /**
   * Keeps a coordinate inside a min/max viewport range.
   */
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  /**
   * Updates a popover trigger's expanded state.
   */
  const setTriggerExpanded = (popover: HTMLElement, isExpanded: boolean) => {
    popover
      .querySelector<HTMLElement>('.info-popover-trigger')
      ?.setAttribute('aria-expanded', String(isExpanded));
  };

  /**
   * Finds the popover wrapper for an event target.
   */
  const getClosestPopover = (target: EventTarget | null) =>
    target instanceof HTMLElement
      ? target.closest<HTMLElement>('.info-popover')
      : null;

  /**
   * Checks whether an event happened inside a popover card.
   */
  const isInsidePopoverCard = (target: EventTarget | null) =>
    target instanceof HTMLElement
      ? target.closest<HTMLElement>('.info-popover-card') !== null
      : false;

  const getOpenPopoverCard = () =>
    document.querySelector<HTMLElement>(
      '.info-popover.is-open .info-popover-card',
    );

  const hasOpenPopover = () =>
    openPopover?.isConnected === true &&
    openPopover.classList.contains('is-open');

  const isMobilePopoverViewport = () =>
    window.matchMedia(MOBILE_POPOVER_QUERY).matches;

  const isPageAnchoredPopover = () => false;

  const shouldLockPageScroll = () =>
    hasOpenPopover() && isMobilePopoverViewport();

  const ensurePopoverCard = (popover: HTMLElement) => {
    const existingCard =
      popover.querySelector<HTMLElement>('.info-popover-card');

    if (existingCard) {
      return existingCard;
    }

    const template = popover.querySelector<HTMLTemplateElement>(
      'template[data-info-popover-template]',
    );

    if (!template) {
      return null;
    }

    const fragment = template.content.cloneNode(true);
    template.remove();
    popover.append(fragment);

    return popover.querySelector<HTMLElement>('.info-popover-card');
  };

  const syncPopoverTouchMoveListener = () => {
    const shouldBind = shouldLockPageScroll();

    if (shouldBind && !isTouchMoveBound) {
      document.addEventListener('touchmove', handlePopoverTouchMove, {
        passive: false,
      });
      isTouchMoveBound = true;
      return;
    }

    if (!shouldBind && isTouchMoveBound) {
      document.removeEventListener('touchmove', handlePopoverTouchMove);
      isTouchMoveBound = false;
    }
  };

  const lockPageScroll = () => {
    lockedScrollY = window.scrollY;
  };

  const unlockPageScroll = () => {
    if (document.body.style.position !== 'fixed') return;

    const previousScrollBehavior =
      document.documentElement.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, lockedScrollY);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  };

  const syncPageScrollLock = () => {
    if (shouldLockPageScroll()) {
      lockPageScroll();
    } else {
      unlockPageScroll();
    }

    syncPopoverTouchMoveListener();
  };

  const handlePopoverTouchStart = (event: TouchEvent) => {
    if (!getOpenPopoverCard()) return;

    lastTouchY = event.touches[0]?.clientY ?? 0;
  };

  const handlePopoverTouchMove = (event: TouchEvent) => {
    const card = getOpenPopoverCard();

    if (!card) return;

    const touch = event.touches[0];

    if (!touch) return;

    const target = event.target;

    if (!(target instanceof Node) || !card.contains(target)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    const currentTouchY = touch.clientY;
    const deltaY = lastTouchY - currentTouchY;
    lastTouchY = currentTouchY;
    card.scrollTop += deltaY;
  };

  /**
   * Handles opening, closing, and outside-tap behavior for popovers.
   */
  const handlePopoverToggle = (event: Event) => {
    const target = event.target as HTMLElement;
    const noteLink = target.closest('.note-link');
    const trigger = target.closest('.info-popover-trigger');
    const card = target.closest('.info-popover-card');

    if (noteLink) {
      return;
    }

    if (card) {
      return;
    }

    if (!trigger) {
      closeInfoPopovers();
      return;
    }

    event.preventDefault();

    const popover = getClosestPopover(trigger);
    if (!popover) return;

    const isOpen = popover.classList.toggle('is-open');
    setTriggerExpanded(popover, isOpen);
    openPopover = isOpen ? popover : null;
    if (isOpen) {
      ensurePopoverCard(popover);
      positionPopoverCard(popover);
    }
    closeInfoPopovers(popover);
  };

  /**
   * Switches a weapon passive between refinement panels.
   */
  const handleRefinementChange = (event: Event) => {
    const button = (event.target as HTMLElement).closest(
      '.weapon-popover-refinement-button',
    ) as HTMLElement | null;

    if (!button) return;

    event.preventDefault();

    const card = button.closest('.info-popover-card');

    if (!card) return;

    const refinement = button.dataset.refinement;

    if (!refinement) return;

    card
      .querySelectorAll('.weapon-popover-refinement-button')
      .forEach((item) => {
        item.setAttribute('aria-selected', String(item === button));
      });

    card
      .querySelectorAll('.weapon-popover-passive-refinement')
      .forEach((panel) => {
        (panel as HTMLElement).hidden =
          (panel as HTMLElement).dataset.refinementPanel !== refinement;
      });

    const popover = getClosestPopover(button);

    if (popover) {
      positionPopoverCard(popover);
    }
  };

  /**
   * Positions a popover card so it remains fully inside the viewport.
   */
  const positionPopoverCard = (popover: HTMLElement) => {
    ensurePopoverCard(popover);

    const trigger = popover.querySelector<HTMLElement>('.info-popover-trigger');
    const card = popover.querySelector<HTMLElement>('.info-popover-card');

    if (!trigger || !card) return;

    const previousDisplay = card.style.display;
    const previousVisibility = card.style.visibility;

    card.style.display = 'block';
    card.style.visibility = 'hidden';

    const triggerRect = trigger.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const maxLeft = window.innerWidth - cardRect.width - VIEWPORT_PADDING;
    const maxTop = window.innerHeight - cardRect.height - VIEWPORT_PADDING;
    const alignedLeft = triggerRect.left;
    const topPlacement = triggerRect.top - cardRect.height - POPOVER_GAP;
    const bottomPlacement = triggerRect.bottom + POPOVER_GAP;
    const hasRoomAbove = topPlacement >= VIEWPORT_PADDING;
    const hasRoomBelow =
      bottomPlacement + cardRect.height <=
      window.innerHeight - VIEWPORT_PADDING;
    const preferredTop =
      hasRoomAbove || !hasRoomBelow ? topPlacement : bottomPlacement;
    const finalLeft = clamp(
      alignedLeft,
      VIEWPORT_PADDING,
      Math.max(VIEWPORT_PADDING, maxLeft),
    );
    const finalTop = clamp(
      preferredTop,
      VIEWPORT_PADDING,
      Math.max(VIEWPORT_PADDING, maxTop),
    );

    if (isPageAnchoredPopover(popover)) {
      card.style.left = `${finalLeft - popoverRect.left}px`;
      card.style.top = `${finalTop - popoverRect.top}px`;
    } else {
      card.style.left = `${finalLeft}px`;
      card.style.top = `${finalTop}px`;
    }

    card.style.display = previousDisplay;
    card.style.visibility = previousVisibility;
  };

  /**
   * Repositions every popover that is currently visible or interactive.
   */
  const getActivePopovers = (includeHover = true) => {
    const popovers = new Set<HTMLElement>();

    if (includeHover && hoveredPopover?.isConnected) {
      popovers.add(hoveredPopover);
    }

    if (focusedPopover?.isConnected) {
      popovers.add(focusedPopover);
    }

    if (hasOpenPopover() && openPopover) {
      popovers.add(openPopover);
    }

    return popovers;
  };

  const positionActivePopovers = (
    positionPageAnchored = true,
    includeHover = true,
  ) => {
    getActivePopovers(includeHover).forEach((popover) => {
      if (positionPageAnchored || !isPageAnchoredPopover(popover)) {
        positionPopoverCard(popover);
      }
    });
  };

  const scheduleActivePopoverPosition = (
    positionPageAnchored = true,
    includeHover = true,
  ) => {
    if (!getActivePopovers(includeHover).size || popoverPositionFrame) {
      return;
    }

    popoverPositionFrame = window.requestAnimationFrame(() => {
      popoverPositionFrame = 0;
      positionActivePopovers(positionPageAnchored, includeHover);
    });
  };

  /**
   * Closes open popovers except for the one currently being interacted with.
   */
  const closeInfoPopovers = (except?: HTMLElement) => {
    document
      .querySelectorAll<HTMLElement>('.info-popover.is-open')
      .forEach((popover) => {
        if (popover !== except) {
          popover.classList.remove('is-open');
          setTriggerExpanded(popover, false);
        }
      });

    openPopover = except?.classList.contains('is-open') ? except : null;
    document.body.classList.toggle('info-popover-locked', hasOpenPopover());
    syncPageScrollLock();
  };

  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;

    handleRefinementChange(event);

    if (!event.defaultPrevented) {
      handlePopoverToggle(event);
    }

    if (event.defaultPrevented) {
      ignoreNextClick = true;
    }
  });

  document.addEventListener('click', (event) => {
    if (ignoreNextClick) {
      ignoreNextClick = false;
      return;
    }

    handlePopoverToggle(event);
  });

  document.addEventListener('touchstart', handlePopoverTouchStart, {
    passive: true,
  });
  document.addEventListener('pointerover', (event) => {
    const popover = getClosestPopover(event.target);

    if (popover) {
      hoveredPopover = popover;
      ensurePopoverCard(popover);
      positionPopoverCard(popover);
    }
  });

  document.addEventListener('pointerout', (event) => {
    const popover = getClosestPopover(event.target);
    const nextPopover = getClosestPopover(event.relatedTarget);

    if (popover && popover !== nextPopover && hoveredPopover === popover) {
      hoveredPopover = null;
    }
  });

  document.addEventListener('focusin', (event) => {
    const popover = getClosestPopover(event.target);

    if (popover && !document.body.classList.contains('info-popover-locked')) {
      focusedPopover = popover;
      ensurePopoverCard(popover);
      positionPopoverCard(popover);
      closeInfoPopovers(popover);
    }
  });

  document.addEventListener('focusout', (event) => {
    const popover = getClosestPopover(event.target);
    const nextPopover = getClosestPopover(event.relatedTarget);

    if (popover && popover !== nextPopover && focusedPopover === popover) {
      focusedPopover = null;
    }
  });

  window.addEventListener('resize', () => {
    scheduleActivePopoverPosition();
    syncPageScrollLock();
  });
  window.addEventListener(
    'scroll',
    (event) => {
      if (!isInsidePopoverCard(event.target)) {
        scheduleActivePopoverPosition(false);
      }
    },
    true,
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeInfoPopovers();
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest('.note-link')) {
      return;
    }

    if (target.closest('.info-popover-trigger')) {
      handlePopoverToggle(event);
    }
  });

  document.addEventListener('click', handleRefinementChange);
}
