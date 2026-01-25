package com.onlinepharmacy.backend.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockSubscribeRequest {

    @NotBlank
    @Email
    private String email;
}
