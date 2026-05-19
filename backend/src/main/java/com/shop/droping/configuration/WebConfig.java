package com.shop.droping.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final WebProperties webProperties;

    @Value("${file.product.image-path}")
    private String productImagePath;

    public WebConfig(WebProperties webProperties) {
        this.webProperties = webProperties;
    }

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .maxAge(3600L)
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        boolean isWindows = System.getProperty("os.name", "").startsWith("Windows");

        // Fichiers uploadés (produits)
        String productImageLocation = isWindows
                ? "file:///" + productImagePath.replace("\\", "/") + "/"
                : "file:" + productImagePath + "/";

        registry.addResourceHandler("/uploads/produits/**")
                .addResourceLocations(productImageLocation);

        // Fichiers génériques
        String fileUploadLocation = isWindows
                ? "file:///" + webProperties.getFileUploadBasePath().replace("\\", "/") + "/"
                : "file:" + webProperties.getFileUploadBasePath() + "/";

        registry.addResourceHandler("/fichiers/**")
                .addResourceLocations(fileUploadLocation);

        // Images statiques du classpath (catalogue auto-généré)
        registry.addResourceHandler("/assets/images/**")
                .addResourceLocations("classpath:/images/");

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/images/");
    }
}
