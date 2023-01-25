package com.yam.funteer.qna.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yam.funteer.qna.entity.Qna;
import com.yam.funteer.user.entity.User;

public interface QnaRepository extends JpaRepository<Qna,Long> {

}
