package com.shop.droping.controllers;

import com.shop.droping.dto.WhatsappMessageRequest;
import com.shop.droping.services.WhatsappService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/whatsapp")
public class WhatsappController {

    @Autowired
    private WhatsappService whatsappService;

    @PostMapping("/send")
    public void sendMessage(@RequestBody WhatsappMessageRequest request) {
        whatsappService.sendMessage(request.getTo(), request.getMessage());
    }
}
