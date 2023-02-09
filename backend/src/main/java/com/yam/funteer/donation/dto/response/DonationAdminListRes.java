
package com.yam.funteer.donation.dto.response;

	import java.time.LocalDate;

	import com.yam.funteer.common.code.PostType;
	import com.yam.funteer.donation.entity.Donation;

	import lombok.Getter;

@Getter
public class DonationAdminListRes {
	private Long id;
	private String title;
	private PostType postType;
	private LocalDate startDate;
	private LocalDate endDate;
	private String targetAmount;

	public DonationAdminListRes(Donation donation){
		this.id=donation.getDonationId();
		this.title=donation.getTitle();
		this.postType=donation.getPostType();
		this.startDate=donation.getStartDate();
		this.endDate=donation.getEndDate();
		this.targetAmount=donation.getAmount().toString();
	}
}
