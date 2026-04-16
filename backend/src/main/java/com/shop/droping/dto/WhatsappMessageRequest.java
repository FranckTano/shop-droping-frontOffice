package com.shop.droping.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WhatsappMessageRequest {
    private String to;
    private String message;
}
