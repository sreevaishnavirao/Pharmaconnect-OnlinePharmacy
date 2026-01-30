package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.model.Product;
import com.onlinepharmacy.backend.model.StockAlertLog;
import com.onlinepharmacy.backend.repositories.ProductRepository;
import com.onlinepharmacy.backend.repositories.StockAlertLogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class LowStockAlertJob {

    @Value("${app.stock.low-threshold:10}")
    private int threshold;

    @Value("${app.stock.admin-emails:}")
    private String adminEmails;

    @Value("${app.stock.alert-cooldown-minutes:60}")
    private long cooldownMinutes;

    private final ProductRepository productRepo;
    private final StockAlertLogRepository logRepo;
    private final EmailService emailService;

    public LowStockAlertJob(ProductRepository productRepo,
                            StockAlertLogRepository logRepo,
                            EmailService emailService) {
        this.productRepo = productRepo;
        this.logRepo = logRepo;
        this.emailService = emailService;
    }

    @Scheduled(fixedDelayString = "${app.stock.job-interval-ms:300000}")
    public void run() {
        List<String> recipients = parseRecipients(adminEmails);
        if (recipients.isEmpty()) return;

        List<Product> low = productRepo.findByQuantityLessThanEqual(threshold);
        if (low.isEmpty()) return;

        for (Product p : low) {
            Integer qty = (p.getQuantity() == null) ? 0 : p.getQuantity();

            StockAlertLog log = logRepo.findByProductId(p.getProductId()).orElse(null);

            boolean shouldSend = (log == null)
                    || log.getLastAlertAt() == null
                    || log.getLastAlertAt().isBefore(LocalDateTime.now().minusMinutes(cooldownMinutes))
                    || (log.getLastQuantity() != null && !log.getLastQuantity().equals(qty));

            if (!shouldSend) continue;

            String subject = "LOW STOCK ALERT: " + p.getProductName();
            String body =
                    "Low stock detected.\n\n" +
                            "Product: " + p.getProductName() + " (ID: " + p.getProductId() + ")\n" +
                            "Quantity left: " + qty + "\n" +
                            "Threshold: " + threshold + "\n\n" +
                            "Please restock soon.";


            emailService.sendEmail(recipients, subject, body);

            if (log == null) log = new StockAlertLog();
            log.setProductId(p.getProductId());
            log.setLastAlertAt(LocalDateTime.now());
            log.setLastQuantity(qty);
            logRepo.save(log);
        }
    }
    private List<String> parseRecipients(String csv) {
        if (csv == null || csv.trim().isEmpty()) return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();
    }
}
