package com.shop.droping.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties
public class WebProperties {

    private String clientBaseUrlLocal;
    private String clientBaseUrlOnline;
    private String fileUploadBasePath;

    public String getClientBaseUrlLocal() {
        return clientBaseUrlLocal;
    }

    public void setClientBaseUrlLocal(String clientBaseUrlLocal) {
        this.clientBaseUrlLocal = clientBaseUrlLocal;
    }

    public String getClientBaseUrlOnline() {
        return clientBaseUrlOnline;
    }

    public void setClientBaseUrlOnline(String clientBaseUrlOnline) {
        this.clientBaseUrlOnline = clientBaseUrlOnline;
    }

    public String getFileUploadBasePath() {
        return fileUploadBasePath;
    }

    public void setFileUploadBasePath(String fileUploadBasePath) {
        this.fileUploadBasePath = fileUploadBasePath;
    }
}
