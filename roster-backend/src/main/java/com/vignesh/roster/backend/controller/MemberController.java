package com.vignesh.roster.backend.controller;

import com.vignesh.roster.backend.entity.Member;
import com.vignesh.roster.backend.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@AllArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public Member saveMember(@RequestBody Member member){
        return memberService.saveMember(member);
    }

    @GetMapping
    public List<Member> getAllMembers(){
        return memberService.getAllMembers();
    }

}
