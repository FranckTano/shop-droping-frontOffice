package com.shop.droping.facade;

import com.shop.droping.domain.Role;
import com.shop.droping.presentation.dto.RoleDto;
import com.shop.droping.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoleFacade {
    private final RoleRepository roleRepository;

    public RoleFacade(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /**
     * Liste tous les roles.
     *
     * @return la liste {@link RoleDto} des role.
     */
    @Transactional(readOnly = true)
    public List<RoleDto> lister() {
        return roleRepository.findAll()
                .stream()
                .map(RoleDto::new)
                .toList();
    }

    /**
     * Enregistre un role.
     *
     * @param roleDto le risque à enregistrer.
     */
    @Transactional
    public void enregistrer(RoleDto roleDto) throws Exception {

        if(roleDto.getId() !=null) {
            Role role = this.roleRepository.findById(roleDto.getId()).orElseThrow(() -> new Exception("Aucun rôle d'id "+ roleDto.getId()+ " trouvé."));
            role.setDesignation(roleDto.getDesignation());
            role.setCode(roleDto.getCode());
            this.roleRepository.save(role);
        }
        else {
            Role role = new Role(
                    roleDto.getCode(),
                    roleDto.getDesignation()
            );
            this.roleRepository.save(role);
        }

    }

    /**
     * Modifier un role.
     *
     * @param roleDto le role.
     */
    @Transactional
    public void modifier(RoleDto roleDto) {
        Role role = this.roleRepository.findById(roleDto.getId()).orElseThrow(() -> new RuntimeException("role d'id "+ roleDto.getId() + " n'existe pas"));

        role.setCode(roleDto.getCode());
        role.setDesignation(roleDto.getDesignation());
        this.roleRepository.save(role);
    }
}
