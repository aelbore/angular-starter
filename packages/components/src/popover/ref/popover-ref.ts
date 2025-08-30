import { Injectable, ComponentRef, ViewContainerRef, TemplateRef, Injector, ApplicationRef, createComponent, EnvironmentInjector, Type } from '@angular/core';
import { PopoverComponent, PopoverPosition, PopoverArrowPosition, PopoverMode } from '../popover';
import { TempComponent } from '../content/default-content';
import { PopoverOutputClose } from '../content/types';

export interface PopoverConfig {
  elementId: string;
  content: TemplateRef<any> | string | Type<any>;
  position?: PopoverPosition;
  arrowPosition?: PopoverArrowPosition;
  mode?: PopoverMode;
  disableClickOutside?: boolean;
  customClass?: string;
  componentInputs?: { [key: string]: any };
  onOpen?: () => void;
  onClose?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class PopoverRef {
  private activePopovers = new Map<string, ComponentRef<PopoverComponent>>();

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  /**
   * Opens a popover based on the provided configuration
   * @param config PopoverConfig object containing all popover settings
   * @returns Promise<boolean> - true if popover was opened successfully, false otherwise
   */
  openPopover(config: PopoverConfig) {
    // Find the trigger element
    const triggerElement = document.getElementById(config.elementId);
    if (!triggerElement) {
      console.warn(`PopoverService: Element with ID '${config.elementId}' not found`);
      return false;
    }
    
    const ref = this.activePopovers.get(config.elementId)
    ref?.instance.close.emit()

    // Create the popover component
    const environmentInjector = this.appRef.injector.get(EnvironmentInjector);
    const popoverRef = createComponent(PopoverComponent, {
      environmentInjector,
      elementInjector: this.injector
    });

    // Configure the popover
    popoverRef.instance.isVisible.set(true);
    popoverRef.instance.position.set(config.position || 'bottom');
    popoverRef.instance.arrowPosition.set(config.arrowPosition || 'center');
    popoverRef.instance.triggerElement.set(triggerElement);
    popoverRef.instance.mode.set(config.mode || 'static');
    popoverRef.instance.disableClickOutside.set(config.disableClickOutside || false);

    // Add custom class if provided
    if (config.customClass) {
      popoverRef.location.nativeElement.classList.add(config.customClass);
    }

    // Handle content
    const contentElement = popoverRef.location.nativeElement.querySelector('.popover-content');
    if (contentElement) {
      this.renderContent(contentElement, config);
    }

    // Subscribe to close event
    const closeSubscription = popoverRef.instance.close.subscribe(() => {
      this.closePopover(config.elementId);
      if (config.onClose) {
        config.onClose();
      }
      closeSubscription.unsubscribe();
    });

    // Append to body for proper positioning
    document.body.appendChild(popoverRef.location.nativeElement);

    // Attach to the Angular application
    this.appRef.attachView(popoverRef.hostView);

    // Store the reference
    this.activePopovers.set(config.elementId, popoverRef);

    // Call onOpen callback
    if (config.onOpen) {
      config.onOpen();
    }

    return true;
  }

  /**
   * Closes a popover for the specified element ID
   * @param elementId The ID of the trigger element
   */
  closePopover(elementId: string): void {
    const popoverRef = this.activePopovers.get(elementId);
    if (popoverRef) {
      popoverRef.instance.isVisible.set(false);
      
      // Wait for animation to complete before destroying
       if (this.activePopovers.has(elementId)) {
          // Clean up component reference if it exists
          const componentRef = (popoverRef.instance as any)._componentRef;
          if (componentRef) {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
          }
          
          this.appRef.detachView(popoverRef.hostView);
          popoverRef.destroy();
          this.activePopovers.delete(elementId);
      }
    }
  }

  /**
   * Closes all active popovers
   */
  closeAllPopovers(): void {
    const elementIds = Array.from(this.activePopovers.keys());
    elementIds.forEach(elementId => this.closePopover(elementId));
  }

  /**
   * Checks if a popover is currently open for the specified element ID
   * @param elementId The ID of the trigger element
   * @returns boolean
   */
  isPopoverOpen(elementId: string): boolean {
    return this.activePopovers.has(elementId);
  }

  /**
   * Toggles a popover for the specified element ID
   * @param config PopoverConfig object containing all popover settings
   * @returns Promise<boolean>
   */
  togglePopover(config: PopoverConfig) {
    if (this.isPopoverOpen(config.elementId)) {
      this.closePopover(config.elementId);
      return false;
    } else {
      return this.openPopover(config);
    }
  }

  private renderContent(contentElement: HTMLElement, config: PopoverConfig): void {
    if (typeof config.content === 'string') {
      // Handle string content
      contentElement.innerHTML = config.content;
    } else if (this.isComponent(config.content)) {
      // Handle component content
      const environmentInjector = this.appRef.injector.get(EnvironmentInjector);
      const componentRef = createComponent(config.content, {
        environmentInjector,
        elementInjector: this.injector
      });

      // Set component inputs if provided
      if (config.componentInputs) {
        Object.keys(config.componentInputs).forEach(key => {
          if (componentRef.instance.hasOwnProperty(key)) {
            componentRef.instance[key] = config.componentInputs![key];
          }
        });
      }

      // Trigger change detection
      componentRef.changeDetectorRef.detectChanges();

      const c = componentRef.instance as PopoverOutputClose
      c?.close?.subscribe(() => {
        this.closePopover(config.elementId);
      })

      // Append component to content element
      contentElement.appendChild(componentRef.location.nativeElement);

      // Attach to Angular application
      this.appRef.attachView(componentRef.hostView);

      // Store component reference for cleanup
      const popoverRef = this.activePopovers.get(config.elementId);
      if (popoverRef) {
        (popoverRef.instance as any)._componentRef = componentRef;
      }
    } else if (config.content) {
      // Handle template content
      const viewContainerRef = this.createViewContainerRef();
      const embeddedView = viewContainerRef.createEmbeddedView(config.content as TemplateRef<any>);
      embeddedView.rootNodes.forEach(node => {
        contentElement.appendChild(node);
      });
    }
  }

  private isComponent(content: any): content is Type<any> {
    return typeof content === 'function' && content.prototype && content.prototype.constructor === content;
  }

  private createViewContainerRef(): ViewContainerRef {
    const tempComponent = createComponent(TempComponent, {
      environmentInjector: this.appRef.injector.get(EnvironmentInjector)
    });
    return tempComponent.instance.viewContainerRef;
  }
}

