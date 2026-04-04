package com.vignesh.roster.backend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "members")
@Data
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Location location;

    @Enumerated(EnumType.STRING)
    private Skill skill;

    private Integer opsExpertise; // 0–5, null if New

    private Integer lastAssignedRound;

    private Boolean active = true;

    public enum Location {
        ONSHORE,
        OFFSHORE
    }

    public enum Skill {
        DEVELOPMENT,
        INFRA,
        TEST,
        BUSINESS
    }
}

