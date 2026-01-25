package com.onlinepharmacy.backend.service;

import com.onlinepharmacy.backend.model.Product;
import com.onlinepharmacy.backend.model.StockSubscription;
import com.onlinepharmacy.backend.repositories.StockSubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StockNotificationService {

    private final StockSubscriptionRepository subscriptionRepo;
    private final EmailService emailService;

    public StockNotificationService(StockSubscriptionRepository subscriptionRepo, EmailService emailService) {
        this.subscriptionRepo = subscriptionRepo;
        this.emailService = emailService;
    }

    @Transactional
    public void subscribe(Long productId, String email) {
        // If already exists, just set notified=false again so user can re-subscribe
        StockSubscription sub = subscriptionRepo.findByProductIdAndEmail(productId, email)
                .orElseGet(StockSubscription::new);

        sub.setProductId(productId);
        sub.setEmail(email);
        sub.setNotified(false);

        subscriptionRepo.save(sub);
    }

    @Transactional
    public void onProductQuantityChanged(Product savedProduct, int oldQty) {
        int newQty = savedProduct.getQuantity() == null ? 0 : savedProduct.getQuantity();

        if (oldQty <= 0 && newQty > 0) {
            List<StockSubscription> subs = subscriptionRepo.findByProductIdAndNotifiedFalse(savedProduct.getProductId());
            if (subs.isEmpty()) return;

            String subject = "Back in stock: " + savedProduct.getProductName();
            String body =
                    "Good news!\n\n" +
                            savedProduct.getProductName() + " is back in stock.\n" +
                            "Available quantity: " + newQty + "\n\n" +
                            "Open the app to order now.";

            for (StockSubscription s : subs) {
                emailService.send(s.getEmail(), subject, body);
                s.setNotified(true);
            }
            subscriptionRepo.saveAll(subs);
        }
    }
}
