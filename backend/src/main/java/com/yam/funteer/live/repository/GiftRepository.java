package com.yam.funteer.live.repository;

import com.yam.funteer.live.entity.Gift;
import com.yam.funteer.user.entity.Member;
import com.yam.funteer.user.entity.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GiftRepository extends JpaRepository<Gift, Long> {
    Page<Gift> findAllByMember(Member member, Pageable pageable);
    Page<Gift> findByLiveFundingTeam(Team team, Pageable pageable);

}
