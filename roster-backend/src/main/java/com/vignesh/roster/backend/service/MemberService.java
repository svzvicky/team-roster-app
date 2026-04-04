package com.vignesh.roster.backend.service;

import com.vignesh.roster.backend.entity.Member;
import com.vignesh.roster.backend.repository.MemberRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;

    public Member saveMember(Member member){
        memberRepository.save(member);
        log.debug("Member saved : {}", member);
        return member;
    }

}
