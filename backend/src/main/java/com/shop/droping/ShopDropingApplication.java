package com.shop.droping;

import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import java.time.LocalDateTime;

import static io.swagger.v3.oas.annotations.enums.SecuritySchemeIn.HEADER;
import static io.swagger.v3.oas.annotations.enums.SecuritySchemeType.APIKEY;

@SpringBootApplication
@SecurityScheme(
        name = "Authorization",
        scheme = "bearer",
        type = APIKEY,
        in = HEADER
)
public class ShopDropingApplication extends SpringBootServletInitializer {

    private static final Logger log = LoggerFactory.getLogger(ShopDropingApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ShopDropingApplication.class, args);

        log.info("""
                
                *******************************************************************************************
                
                        🛒 SHOP DROPPING — APPLICATION STARTED SUCCESSFULLY
                
                ╔════════════════════════════════════════════════════════════════════════════════════════╗
                ║                                                                                        ║
                ║     ███████╗██╗  ██╗ ██████╗ ██████╗     ██████╗ ██████╗  ██████╗ ██████╗              ║
                ║     ██╔════╝██║  ██║██╔═══╝ ██╔══██╗    ██╔═══╝ ██╔══██╗██╔═══╝ ██╔══██╗             ║
                ║     ███████╗███████║██║     ██████╔╝    ██║     ██████╔╝██║     ██████╔╝             ║
                ║     ╚════██║██╔══██║██║     ██╔═══╝     ██║     ██╔═══╝ ██║     ██╔═══╝              ║
                ║     ███████║██║  ██║╚██████╗██║         ╚██████╗██║     ╚██████╗██║                  ║
                ║     ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝          ╚═════╝╚═╝      ╚═════╝╚═╝                  ║
                ║                                                                                        ║
                ╚════════════════════════════════════════════════════════════════════════════════════════╝
                
                ✅ Project      : Shop Dropping (E-commerce / Dropshipping)
                ✅ Environment  : Dev / Test / Prod
                ✅ Started at   : {}
                
                *******************************************************************************************
                """, LocalDateTime.now());
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ShopDropingApplication.class);
    }
}
