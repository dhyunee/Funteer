package com.yam.funteer.funding.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.yam.funteer.common.code.PostType;
import com.yam.funteer.funding.entity.Category;
import com.yam.funteer.funding.entity.Funding;
import com.yam.funteer.user.entity.Team;

public interface FundingRepository extends JpaRepository<Funding, Long> {

	List<Funding> findAllByPostType(PostType postType);

	Page<Funding> findAllByCategory(Category category, Pageable pageable);

	Page<Funding> findAllByTitleContainingOrContentContaining(String keyword, String keyword2, Pageable pageable);

	List<Funding> findAllByStartDate(LocalDate now);

	List<Funding> findAllByEndDate(LocalDate minusDays);

	List<Funding> findAllByTeamAndPostType(Team team,PostType postType);
}
