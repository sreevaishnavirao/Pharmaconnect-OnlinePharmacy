package com.onlinepharmacy.backend.service;

import java.util.List;

public interface EmailService {


    void sendEmail(List<String> to, String subject, String body);


    default void send(String to, String subject, String body) {
        sendEmail(List.of(to), subject, body);
    }
}
