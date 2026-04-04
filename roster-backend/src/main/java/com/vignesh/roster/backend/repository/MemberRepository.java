package com.vignesh.roster.backend.repository;

import com.vignesh.roster.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
