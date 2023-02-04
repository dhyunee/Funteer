package com.yam.funteer.user.service;

import com.yam.funteer.user.dto.request.*;
import com.yam.funteer.user.dto.request.member.*;
import com.yam.funteer.user.dto.response.member.MemberAccountResponse;
import com.yam.funteer.user.dto.response.member.MemberProfileResponse;
import com.yam.funteer.user.dto.response.member.MileageDetailResponse;
import org.springframework.data.domain.Pageable;

public interface MemberService {

    void createAccountWithOutProfile(CreateMemberRequest request);
    void setAccountSignOut(BaseUserRequest baseUserRequest);
    MemberProfileResponse getProfile(Long userId);
    void updateProfile(UpdateMemberProfileRequest request);

    MemberAccountResponse getAccountInfo();
    void updateAccount(UpdateMemberAccountRequest request);

    void followTeam(FollowRequest followRequest);
    void wishFunding(WishRequest wishRequest);

    MileageDetailResponse getMileageDetails(MileageDetailRequest request, Pageable pageable);
    void chargeMileage(ChargeRequest chargeRequest);

}
