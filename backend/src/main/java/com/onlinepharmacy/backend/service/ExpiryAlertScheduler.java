package com.onlinepharmacy.backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ExpiryAlertScheduler {

    private final ExpiryNotificationService expiryNotificationService;

    public ExpiryAlertScheduler(ExpiryNotificationService expiryNotificationService) {
        this.expiryNotificationService = expiryNotificationService;
    }

    @Scheduled(cron = "${pharma.expiry.alert.cron:0 0 9 * * *}")
    public void run() {
        expiryNotificationService.sendNearExpiryAlerts();
    }
}
