package com.shop.droping.presentation.dto;

import com.shop.droping.domain.Role;

public class RoleDto {


    private Long id;
    private String code;
    private String designation;

    public RoleDto(String code, String designation) {
        this.code = code;
        this.designation =designation;
    }

    public RoleDto( Role role) {
        this.id = role.getId();
        this.code = role.getCode();
        this.designation = role.getDesignation();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
