package com.yam.funteer.pay.repository;

import java.util.List;

import com.yam.funteer.pay.entity.Payment;
import com.yam.funteer.post.entity.Post;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	List<Payment> findAllByPost(Post post);
}
