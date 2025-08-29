import { NotificationDto, ESystemNotificationType } from '../gen/api/src';

export class NotificationHandlerService {
  private onOpenInviteModal?: (notification: NotificationDto) => void;
  private onOpenSimpleModal?: (notification: NotificationDto) => void;
  private onOpenBannerModal?: (notification: NotificationDto) => void;
  private onOpenPopupModal?: (notification: NotificationDto) => void;

  constructor(
    onOpenInviteModal?: (notification: NotificationDto) => void,
    onOpenSimpleModal?: (notification: NotificationDto) => void,
    onOpenBannerModal?: (notification: NotificationDto) => void,
    onOpenPopupModal?: (notification: NotificationDto) => void
  ) {
    this.onOpenInviteModal = onOpenInviteModal;
    this.onOpenSimpleModal = onOpenSimpleModal;
    this.onOpenBannerModal = onOpenBannerModal;
    this.onOpenPopupModal = onOpenPopupModal;
  }

  public handleNotificationClick(notification: NotificationDto): void {
    const notificationType = notification.notificationType as number;

    switch (notificationType) {
      case ESystemNotificationType.NUMBER_0: // Simple
        this.handleSimpleNotification(notification);
        break;
      
      case ESystemNotificationType.NUMBER_1: // Banner
        this.handleBannerNotification(notification);
        break;
      
      case ESystemNotificationType.NUMBER_2: // Popup
        this.handlePopupNotification(notification);
        break;
      
      case ESystemNotificationType.NUMBER_3: // Invite
        this.handleInviteNotification(notification);
        break;
      
      default:
        this.handleSimpleNotification(notification);
        break;
    }
  }

  private handleSimpleNotification(notification: NotificationDto): void {
    if (this.onOpenSimpleModal) {
      this.onOpenSimpleModal(notification);
    }
  }

  private handleBannerNotification(notification: NotificationDto): void {
    if (this.onOpenBannerModal) {
      this.onOpenBannerModal(notification);
    }
  }

  private handlePopupNotification(notification: NotificationDto): void {
    if (this.onOpenPopupModal) {
      this.onOpenPopupModal(notification);
    }
  }

  private handleInviteNotification(notification: NotificationDto): void {
    if (this.onOpenInviteModal) {
      this.onOpenInviteModal(notification);
    }
  }

  public updateHandlers(
    onOpenInviteModal?: (notification: NotificationDto) => void,
    onOpenSimpleModal?: (notification: NotificationDto) => void,
    onOpenBannerModal?: (notification: NotificationDto) => void,
    onOpenPopupModal?: (notification: NotificationDto) => void
  ): void {
    this.onOpenInviteModal = onOpenInviteModal;
    this.onOpenSimpleModal = onOpenSimpleModal;
    this.onOpenBannerModal = onOpenBannerModal;
    this.onOpenPopupModal = onOpenPopupModal;
  }
}
