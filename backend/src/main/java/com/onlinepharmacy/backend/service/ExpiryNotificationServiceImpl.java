package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.model.Product;
import com.onlinepharmacy.backend.model.ProductDetails;
import com.onlinepharmacy.backend.repositories.ProductDetailsRepository;
import com.onlinepharmacy.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpiryNotificationServiceImpl implements ExpiryNotificationService {

    private final ProductDetailsRepository detailsRepo;
    private final ProductRepository productRepo;
    private final EmailService emailService;

    @Value("${pharma.expiry.alert.days:30}")
    private int alertDays;
    @Value("${pharma.admin.alert.emails:}")
    private String adminEmailsCsv;

    public ExpiryNotificationServiceImpl(
            ProductDetailsRepository detailsRepo,
            ProductRepository productRepo,
            EmailService emailService
    ) {
        this.detailsRepo = detailsRepo;
        this.productRepo = productRepo;
        this.emailService = emailService;
    }

    @Override
    public void sendNearExpiryAlerts() {
        List<String> recipients = parseRecipients(adminEmailsCsv);
        if (recipients.isEmpty()) return;

        LocalDate today = LocalDate.now();
        LocalDate end = today.plusDays(alertDays);


        List<ProductDetails> expiring =
                detailsRepo.findExpiringNotAlertedToday(today, end, today);

        if (expiring == null || expiring.isEmpty()) return;


        Set<Long> ids = expiring.stream()
                .map(d -> d.getProduct() != null ? d.getProduct().getProductId() : null)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Long, Product> productMap = productRepo.findAllById(ids).stream()
                .collect(Collectors.toMap(Product::getProductId, p -> p));

        String subject = "PharmaConnect: Expiry Alert (Next " + alertDays + " days)";
        String body = buildEmailBody(today, alertDays, expiring, productMap);

        emailService.sendEmail(recipients, subject, body);


        expiring.forEach(d -> d.setExpiryAlertSentOn(today));
        detailsRepo.saveAll(expiring);
    }

    private List<String> parseRecipients(String csv) {
        if (csv == null || csv.trim().isEmpty()) return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();
    }

    private String buildEmailBody(LocalDate today, int days, List<ProductDetails> expiring, Map<Long, Product> productMap) {
        StringBuilder sb = new StringBuilder();
        sb.append("Expiry alert: Products expiring within next ").append(days).append(" days\n");
        sb.append("Date: ").append(today).append("\n\n");

        sb.append(String.format("%-6s | %-28s | %-14s | %-6s | %-12s\n",
                "ID", "Product", "Category", "Stock", "Expiry"));
        sb.append("----------------------------------------------------------------------------\n");

        for (ProductDetails d : expiring) {
            Long pid = d.getProduct() != null ? d.getProduct().getProductId() : null;
            Product p = (pid != null) ? productMap.get(pid) : null;

            String name = p != null ? p.getProductName() : "Unknown";
            String cat = (p != null && p.getCategory() != null) ? p.getCategory().getCategoryName() : "-";
            String stock = (p != null && p.getQuantity() != null) ? String.valueOf(p.getQuantity()) : "0";
            String exp = d.getExpiryDate() != null ? d.getExpiryDate().toString() : "-";

            sb.append(String.format("%-6s | %-28s | %-14s | %-6s | %-12s\n",
                    String.valueOf(pid), truncate(name, 28), truncate(cat, 14), stock, exp));
        }

        sb.append("\nAction: Review inventory, discount/remove near-expiry items, restock if needed.\n");
        return sb.toString();
    }

    private String truncate(String s, int max) {
        if (s == null) return "-";
        if (s.length() <= max) return s;
        return s.substring(0, max - 3) + "...";
    }
}
