package com.shop.droping.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final WebProperties webProperties;

    public WebConfig(WebProperties webProperties) {
        this.webProperties = webProperties;
    }

	@Override
	public void addCorsMappings(CorsRegistry corsRegistry) {
		corsRegistry.addMapping("/**")
				.allowedOrigins(webProperties.getClientBaseUrlLocal(), webProperties.getClientBaseUrlOnline())
				.allowedMethods("*")
				.maxAge(3600L)
				.allowedHeaders("*")
				.exposedHeaders("Authorization")
				.allowCredentials(true);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/fichiers/**")
				.addResourceLocations(
						System.getProperty("os.name").startsWith("Windows") ?
								"file:///" + webProperties.getFileUploadBasePath().replace("\\", "/")+ "/" :
								"file:" + webProperties.getFileUploadBasePath() + "/"
				);

		registry.addResourceHandler("/assets/images/**")
				.addResourceLocations("classpath:/images/");

		registry.addResourceHandler("/images/**")
				.addResourceLocations("classpath:/images/");
	}
}
