package com.shop.droping.controllers;

import com.shop.droping.presentation.dto.auth.AuthDto;
import com.shop.droping.presentation.dto.auth.TokenDto;
import com.shop.droping.services.SecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ws/securite/auth")
public class AuthController {

    private final SecurityService securityService;

    public AuthController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@RequestBody AuthDto authDto) {
        TokenDto token = securityService.autentifier(authDto);
        return ResponseEntity.ok(token);
    }
}
