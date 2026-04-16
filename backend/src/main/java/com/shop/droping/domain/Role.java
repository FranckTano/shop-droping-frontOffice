package com.shop.droping.domain;

import com.shop.droping.presentation.dto.RoleDto;
import jakarta.persistence.*;

@Entity
@Access(AccessType.FIELD)
@Table(name = Role.TABLE_NAME)
public class Role extends AbstractEntity {
    public static final String TABLE_NAME = "role";
    public static final String TABLE_ID = TABLE_NAME + ID;
    public static final String TABLE_SEQ = TABLE_ID + SEQ;

    @Id
    @SequenceGenerator(name = TABLE_SEQ, sequenceName = TABLE_SEQ)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = TABLE_SEQ)
    private Long id;
    private String code;
    private String designation;

    public Role (String code, String designation) {
        this.code = code;
        this.designation = designation;
    }

    public Role() {

    }
    public Role (RoleDto roleDto) {
        this.code = roleDto.getCode();
        this.designation = roleDto.getDesignation();
    }

    @Override
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
